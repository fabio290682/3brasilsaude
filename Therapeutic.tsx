import { useEffect, useState, useCallback } from 'react';
import { therapeuticApi } from '../api';
import { StatusBadge, Modal, Field, Empty, Loading, Err, Pager, fmtDate } from '../ui';
import type { Therapeutic, TherapeuticType, TherapeuticStatus } from '../types';

const TYPES: {value:TherapeuticType;label:string}[] = [
  {value:'plasmapheresis',label:'Plasmaférese'},
  {value:'plateletpheresis',label:'Plaquetaférese'},
  {value:'erythrocytapheresis',label:'Eritrocitaférese'},
  {value:'leukapheresis',label:'Leucaférese'},
  {value:'photopheresis',label:'Fotoaférese'},
  {value:'other',label:'Outro'},
];
const STATUSES: TherapeuticStatus[] = ['scheduled','in_progress','completed','cancelled'];
const label = (v:string) => TYPES.find(p=>p.value===v)?.label ?? v;

const blank = (): Partial<Therapeutic> => ({
  patientName:'',patientBirthDate:'',patientDocument:'',
  procedureType:'plasmapheresis',procedureDate:new Date().toISOString().split('T')[0],
  indication:'',responsibleDoctor:'',status:'scheduled',
});

export function TherapeuticPage() {
  const [items,setItems]   = useState<Therapeutic[]>([]);
  const [total,setTotal]   = useState(0);
  const [page,setPage]     = useState(1);
  const [loading,setLoading] = useState(true);
  const [error,setError]   = useState('');
  const [modal,setModal]   = useState<'add'|'edit'|null>(null);
  const [selected,setSelected] = useState<Therapeutic|null>(null);
  const [form,setForm]     = useState<Partial<Therapeutic>>(blank());
  const [saving,setSaving] = useState(false);
  const [fType,setFType]   = useState('');
  const [fStatus,setFStatus] = useState('');

  const load = useCallback(()=>{
    setLoading(true);
    const p:Record<string,string>={page:String(page),limit:'20'};
    if(fType)   p.procedureType=fType;
    if(fStatus) p.status=fStatus;
    therapeuticApi.list(p).then(r=>{setItems(r.data);setTotal(r.total);setLoading(false);})
      .catch(e=>{setError(e.message);setLoading(false);});
  },[page,fType,fStatus]);

  useEffect(()=>{load();},[load]);

  const openAdd  = ()=>{setForm(blank());setSelected(null);setModal('add');};
  const openEdit = (t:Therapeutic)=>{setForm({...t});setSelected(t);setModal('edit');};

  const save = async ()=>{
    setSaving(true);setError('');
    try{
      if(modal==='add') await therapeuticApi.create(form);
      else if(selected) await therapeuticApi.update(selected._id,form);
      setModal(null);load();
    }catch(e:any){setError(e.message);}
    setSaving(false);
  };

  const remove = async (t:Therapeutic)=>{
    if(!confirm(`Remover procedimento de ${t.patientName}?`)) return;
    await therapeuticApi.remove(t._id).catch(e=>setError(e.message));
    load();
  };

  const f=(k:keyof Therapeutic)=>(e:any)=>
    setForm(p=>({...p,[k]:(k==='durationMin'||k==='volumeProcessedMl')?Number(e.target.value):e.target.value}));

  return (
    <>
      <div style={{background:'#fff',borderBottom:'1px solid var(--border)',padding:'8px 20px',display:'flex',alignItems:'center',gap:6,margin:'-16px -16px 16px',flexWrap:'wrap'}}>
        <button className="btn btn-primary" onClick={openAdd}>+ Novo procedimento</button>
        <div className="tb-sep"/>
        <button className="btn">↓ Exportar</button>
        <button className="btn">⎙ Imprimir</button>
        <button className="btn">Agendar lote ▾</button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Procedimentos terapêuticos</span>
          <span style={{fontSize:11.5,color:'var(--muted)',marginLeft:'auto'}}>{total} registros</span>
        </div>
        <div className="filter-bar">
          <span className="filter-label">Procedimento:</span>
          <select className="filter-sel" value={fType} onChange={e=>{setFType(e.target.value);setPage(1);}}>
            <option value="">Todos</option>
            {TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <span className="filter-label">Status:</span>
          <select className="filter-sel" value={fStatus} onChange={e=>{setFStatus(e.target.value);setPage(1);}}>
            <option value="">Todos</option>
            {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <span className="filter-label">Período:</span>
          <select className="filter-sel"><option>Últimos 30 dias</option><option>Último trimestre</option></select>
          <button className="btn btn-link btn-sm" onClick={()=>{setFType('');setFStatus('');setPage(1);}}>Limpar</button>
        </div>

        {loading?<Loading/>:items.length===0?<Empty/>:(
          <table>
            <colgroup>
              <col style={{width:36}}/><col style={{width:175}}/><col style={{width:155}}/><col style={{width:95}}/>
              <col style={{width:80}}/><col style={{width:130}}/><col style={{width:100}}/><col style={{width:80}}/>
              <col style={{width:95}}/><col style={{width:110}}/>
            </colgroup>
            <thead>
              <tr>
                <th><input type="checkbox"/></th>
                <th>Paciente ↕</th>
                <th>Procedimento ↕</th>
                <th>Data ↓</th>
                <th>Duração</th>
                <th>Médico responsável</th>
                <th>Operador</th>
                <th>Vol. proc.</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(t=>(
                <tr key={t._id}>
                  <td><input type="checkbox"/></td>
                  <td>
                    <div className="cell-primary">{t.patientName}</div>
                    <div className="cell-sub">{t.patientDocument}</div>
                  </td>
                  <td>
                    <span style={{fontSize:12.5,fontWeight:500,color:'var(--text-2)'}}>{label(t.procedureType)}</span>
                    {t.hospitalReg && <div className="cell-sub">{t.hospitalReg}</div>}
                  </td>
                  <td style={{color:'var(--text-3)'}}>{fmtDate(t.procedureDate)}</td>
                  <td className="cell-mono">{t.durationMin?`${t.durationMin} min`:'—'}</td>
                  <td style={{color:'var(--text-3)',fontSize:12}}>{t.responsibleDoctor}</td>
                  <td style={{color:'var(--text-3)',fontSize:12}}>{t.operator??'—'}</td>
                  <td className="cell-mono">{t.volumeProcessedMl?`${t.volumeProcessedMl} mL`:'—'}</td>
                  <td><StatusBadge status={t.status}/></td>
                  <td>
                    <div className="row-actions">
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

      {modal && (
        <Modal title={modal==='add'?'Novo procedimento terapêutico':'Editar procedimento'} onClose={()=>setModal(null)}
          footer={<><button className="btn" onClick={()=>setModal(null)}>Cancelar</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?'Salvando…':'Salvar'}</button></>}>
          {error && <Err msg={error}/>}
          <div className="form-grid">
            <Field label="Nome do paciente *" full><input value={form.patientName??''} onChange={f('patientName')}/></Field>
            <Field label="Nascimento *"><input type="date" value={form.patientBirthDate?.split('T')[0]??''} onChange={f('patientBirthDate')}/></Field>
            <Field label="Documento *"><input value={form.patientDocument??''} onChange={f('patientDocument')}/></Field>
            <Field label="Tipo de procedimento *" full>
              <select value={form.procedureType} onChange={f('procedureType')}>
                {TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Data do procedimento *"><input type="date" value={form.procedureDate?.split('T')[0]??''} onChange={f('procedureDate')}/></Field>
            <Field label="Duração (min)"><input type="number" value={form.durationMin??''} onChange={f('durationMin')}/></Field>
            <Field label="Vol. processado (mL)"><input type="number" value={form.volumeProcessedMl??''} onChange={f('volumeProcessedMl')}/></Field>
            {modal==='edit' && <Field label="Status"><select value={form.status} onChange={f('status')}>{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></Field>}
            <Field label="Médico responsável *" full><input value={form.responsibleDoctor??''} onChange={f('responsibleDoctor')}/></Field>
            <Field label="Operador"><input value={form.operator??''} onChange={f('operator')}/></Field>
            <Field label="Reg. hospitalar"><input value={form.hospitalReg??''} onChange={f('hospitalReg')}/></Field>
            <Field label="Indicação clínica *" full><textarea value={form.indication??''} onChange={f('indication')} rows={2}/></Field>
            <Field label="Fluido de reposição"><input value={form.replacementFluid??''} onChange={f('replacementFluid')}/></Field>
            <Field label="Anticoagulante"><input value={form.anticoagulant??''} onChange={f('anticoagulant')}/></Field>
            <Field label="Acesso vascular" full><input value={form.vascularAccess??''} onChange={f('vascularAccess')}/></Field>
            {modal==='edit' && <>
              <Field label="Desfecho" full><textarea value={form.outcome??''} onChange={f('outcome')} rows={2}/></Field>
              <Field label="Reações adversas" full><textarea value={form.adverse??''} onChange={f('adverse')} rows={2}/></Field>
            </>}
            <Field label="Observações" full><textarea value={form.notes??''} onChange={f('notes')} rows={2}/></Field>
          </div>
        </Modal>
      )}
    </>
  );
}
