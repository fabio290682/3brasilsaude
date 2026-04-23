import { useEffect, useState, useCallback } from 'react';
import { transfusionsApi } from '../api';
import { BloodBadge, StatusBadge, Modal, Field, Empty, Loading, Err, Pager, fmtDate } from '../ui';
import type { Transfusion, BloodGroup, RhFactor, TransfusionStatus } from '../types';

const GROUPS: BloodGroup[] = ['A','B','AB','O'];
const RHS: RhFactor[]      = ['+','-'];
const STATUSES: TransfusionStatus[] = ['pending','approved','in_progress','completed','cancelled'];

const blank = (): Partial<Transfusion> => ({
  patientName:'',patientBirthDate:'',patientDocument:'',hospitalOrder:'',
  bloodGroup:'O',rhFactor:'+',quantityMl:300,indication:'',requestingDoctor:'',
  requestDate:new Date().toISOString().split('T')[0],status:'pending',
});

export function Transfusions() {
  const [items,setItems]   = useState<Transfusion[]>([]);
  const [total,setTotal]   = useState(0);
  const [page,setPage]     = useState(1);
  const [loading,setLoading] = useState(true);
  const [error,setError]   = useState('');
  const [modal,setModal]   = useState<'add'|'edit'|'approve'|null>(null);
  const [selected,setSelected] = useState<Transfusion|null>(null);
  const [form,setForm]     = useState<Partial<Transfusion>>(blank());
  const [appForm,setAppForm] = useState({bagCode:'',approvedBy:''});
  const [saving,setSaving] = useState(false);
  const [search,setSearch] = useState('');
  const [fStatus,setFStatus] = useState('');

  const load = useCallback(()=>{
    setLoading(true);
    const p:Record<string,string>={page:String(page),limit:'20'};
    if(fStatus) p.status=fStatus;
    transfusionsApi.list(p).then(r=>{setItems(r.data);setTotal(r.total);setLoading(false);})
      .catch(e=>{setError(e.message);setLoading(false);});
  },[page,fStatus]);

  useEffect(()=>{load();},[load]);

  const openAdd    = ()=>{setForm(blank());setSelected(null);setModal('add');};
  const openEdit   = (t:Transfusion)=>{setForm({...t});setSelected(t);setModal('edit');};
  const openApprove= (t:Transfusion)=>{setSelected(t);setAppForm({bagCode:'',approvedBy:''});setModal('approve');};

  const save = async ()=>{
    setSaving(true);setError('');
    try{
      if(modal==='add') await transfusionsApi.create(form);
      else if(selected) await transfusionsApi.update(selected._id,form);
      setModal(null);load();
    }catch(e:any){setError(e.message);}
    setSaving(false);
  };

  const approve = async ()=>{
    if(!selected||!appForm.bagCode||!appForm.approvedBy){setError('Preencha todos os campos.');return;}
    setSaving(true);setError('');
    try{await transfusionsApi.approve(selected._id,appForm.bagCode,appForm.approvedBy);setModal(null);load();}
    catch(e:any){setError(e.message);}
    setSaving(false);
  };

  const remove = async (t:Transfusion)=>{
    if(!confirm(`Remover solicitação ${t.hospitalOrder}?`)) return;
    await transfusionsApi.remove(t._id).catch(e=>setError(e.message));
    load();
  };

  const f=(k:keyof Transfusion)=>(e:any)=>
    setForm(p=>({...p,[k]:k==='quantityMl'?Number(e.target.value):e.target.value}));

  const filtered = search
    ? items.filter(t=>t.patientName.toLowerCase().includes(search.toLowerCase())||t.hospitalOrder.includes(search))
    : items;

  return (
    <>
      <div style={{background:'#fff',borderBottom:'1px solid var(--border)',padding:'8px 20px',display:'flex',alignItems:'center',gap:6,margin:'-16px -16px 16px',flexWrap:'wrap'}}>
        <button className="btn btn-primary" onClick={openAdd}>+ Nova solicitação</button>
        <div className="tb-sep"/>
        <button className="btn">↓ Exportar</button>
        <button className="btn">⎙ Imprimir</button>
        <div style={{marginLeft:'auto',display:'flex',gap:6}}>
          <div style={{position:'relative'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar paciente, ordem…"
              style={{paddingLeft:28,width:220,height:30}}/>
            <span style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',color:'var(--muted)',fontSize:13,pointerEvents:'none'}}>⌕</span>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Transfusões — Solicitações</span>
          <span style={{fontSize:11.5,color:'var(--muted)',marginLeft:'auto'}}>{total} registros</span>
        </div>
        <div className="filter-bar">
          <span className="filter-label">Status:</span>
          <select className="filter-sel" value={fStatus} onChange={e=>{setFStatus(e.target.value);setPage(1);}}>
            <option value="">Todos</option>
            {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <span className="filter-label">Período:</span>
          <select className="filter-sel"><option>Últimos 30 dias</option><option>Último trimestre</option></select>
          <button className="btn btn-link btn-sm" onClick={()=>{setFStatus('');setPage(1);}}>Limpar</button>
        </div>

        {loading?<Loading/>:filtered.length===0?<Empty/>:(
          <table>
            <colgroup>
              <col style={{width:36}}/><col style={{width:130}}/><col style={{width:180}}/><col style={{width:60}}/>
              <col style={{width:80}}/><col style={{width:120}}/><col style={{width:90}}/><col style={{width:95}}/>
              <col style={{width:90}}/><col style={{width:130}}/>
            </colgroup>
            <thead>
              <tr>
                <th><input type="checkbox"/></th>
                <th>Ordem hospitalar ↕</th>
                <th>Paciente ↕</th>
                <th>Tipo</th>
                <th>Volume ↕</th>
                <th>Médico solicitante</th>
                <th>Solicitação ↓</th>
                <th>Bolsa vinc.</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t=>(
                <tr key={t._id}>
                  <td><input type="checkbox"/></td>
                  <td className="cell-mono">{t.hospitalOrder}</td>
                  <td>
                    <div className="cell-primary">{t.patientName}</div>
                    <div className="cell-sub">{t.ward?`Leito: ${t.ward}`:t.patientDocument}</div>
                  </td>
                  <td><BloodBadge group={t.bloodGroup} rh={t.rhFactor}/></td>
                  <td className="cell-mono">{t.quantityMl} mL</td>
                  <td style={{color:'var(--text-3)',fontSize:12}}>{t.requestingDoctor}</td>
                  <td style={{color:'var(--text-3)'}}>{fmtDate(t.requestDate)}</td>
                  <td className="cell-mono" style={{fontSize:11.5}}>{t.bagCode??<span style={{color:'var(--muted)'}}>—</span>}</td>
                  <td><StatusBadge status={t.status}/></td>
                  <td>
                    <div className="row-actions">
                      {t.status==='pending' && (
                        <button className="btn btn-sm" style={{background:'#dbeafe',color:'#1e40af',borderColor:'#bfdbfe'}} onClick={()=>openApprove(t)}>Aprovar</button>
                      )}
                      <button className="btn btn-sm" style={{color:'var(--primary)',borderColor:'#c7d5e8'}} onClick={()=>openEdit(t)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>remove(t)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pager page={page} total={total} limit={20} onChange={setPage}/>
      </div>

      {(modal==='add'||modal==='edit') && (
        <Modal title={modal==='add'?'Nova solicitação de transfusão':'Editar solicitação'} onClose={()=>setModal(null)}
          footer={<><button className="btn" onClick={()=>setModal(null)}>Cancelar</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?'Salvando…':'Salvar'}</button></>}>
          {error && <Err msg={error}/>}
          <div className="form-grid">
            <Field label="Nome do paciente *" full><input value={form.patientName??''} onChange={f('patientName')}/></Field>
            <Field label="Nascimento *"><input type="date" value={form.patientBirthDate?.split('T')[0]??''} onChange={f('patientBirthDate')}/></Field>
            <Field label="Documento *"><input value={form.patientDocument??''} onChange={f('patientDocument')}/></Field>
            <Field label="Ordem hospitalar *"><input value={form.hospitalOrder??''} onChange={f('hospitalOrder')}/></Field>
            <Field label="Leito"><input value={form.ward??''} onChange={f('ward')}/></Field>
            <Field label="Grupo sanguíneo *"><select value={form.bloodGroup} onChange={f('bloodGroup')}>{GROUPS.map(g=><option key={g}>{g}</option>)}</select></Field>
            <Field label="Fator Rh *"><select value={form.rhFactor} onChange={f('rhFactor')}>{RHS.map(r=><option key={r}>{r}</option>)}</select></Field>
            <Field label="Volume (mL) *"><input type="number" value={form.quantityMl??''} onChange={f('quantityMl')}/></Field>
            <Field label="Data solicitação *"><input type="date" value={form.requestDate?.split('T')[0]??''} onChange={f('requestDate')}/></Field>
            <Field label="Médico solicitante *" full><input value={form.requestingDoctor??''} onChange={f('requestingDoctor')}/></Field>
            <Field label="Indicação clínica *" full><textarea value={form.indication??''} onChange={f('indication')} rows={2}/></Field>
            <Field label="Observações" full><textarea value={form.notes??''} onChange={f('notes')} rows={2}/></Field>
          </div>
        </Modal>
      )}

      {modal==='approve' && selected && (
        <Modal title="Aprovar solicitação de transfusão" onClose={()=>setModal(null)}
          footer={<><button className="btn" onClick={()=>setModal(null)}>Cancelar</button><button className="btn btn-primary" onClick={approve} disabled={saving}>{saving?'Aprovando…':'Confirmar aprovação'}</button></>}>
          {error && <Err msg={error}/>}
          <div style={{background:'#f8f9fb',border:'1px solid var(--border)',borderRadius:4,padding:'10px 14px',marginBottom:16,fontSize:12.5}}>
            <div style={{fontWeight:500,marginBottom:4}}>{selected.patientName} — <BloodBadge group={selected.bloodGroup} rh={selected.rhFactor}/></div>
            <div style={{color:'var(--muted)'}}>{selected.quantityMl} mL · Ordem: {selected.hospitalOrder}</div>
          </div>
          <div className="form-grid">
            <Field label="Código da bolsa (bag code) *"><input value={appForm.bagCode} onChange={e=>setAppForm(p=>({...p,bagCode:e.target.value}))} placeholder="ex: BOL-2026-001"/></Field>
            <Field label="Aprovado por *"><input value={appForm.approvedBy} onChange={e=>setAppForm(p=>({...p,approvedBy:e.target.value}))} placeholder="Nome do responsável"/></Field>
          </div>
        </Modal>
      )}
    </>
  );
}
