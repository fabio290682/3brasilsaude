import { useEffect, useState, useCallback } from 'react';
import { collectionsApi } from '../api';
import { BloodBadge, StatusBadge, TriageBadge, Modal, Field, Empty, Loading, Err, Pager, fmtDate, isExpired, isExpiringSoon } from '../ui';
import type { Collection, BloodGroup, RhFactor, CollectionStatus } from '../types';

const GROUPS: BloodGroup[]         = ['A','B','AB','O'];
const RHS: RhFactor[]              = ['+','-'];
const STATUSES: CollectionStatus[] = ['available','reserved','used','discarded','expired'];

const blank = (): Partial<Collection> => ({
  donorName:'',donorBirthDate:'',donorDocument:'',bloodGroup:'O',rhFactor:'+',
  volumeMl:450,bagCode:'',phlebotomist:'',
  collectionDate:new Date().toISOString().split('T')[0],
  expiresAt:new Date(Date.now()+35*86400000).toISOString().split('T')[0],
  triageApproved:false,status:'available',
});

export function Collections() {
  const [items,setItems]   = useState<Collection[]>([]);
  const [total,setTotal]   = useState(0);
  const [page,setPage]     = useState(1);
  const [loading,setLoading] = useState(true);
  const [error,setError]   = useState('');
  const [modal,setModal]   = useState<'add'|'edit'|null>(null);
  const [selected,setSelected] = useState<Collection|null>(null);
  const [form,setForm]     = useState<Partial<Collection>>(blank());
  const [saving,setSaving] = useState(false);
  const [search,setSearch] = useState('');
  const [fStatus,setFStatus] = useState('');
  const [fGroup,setFGroup]   = useState('');
  const [checked,setChecked] = useState<Set<string>>(new Set());

  const load = useCallback(() => {
    setLoading(true);
    const p: Record<string,string> = {page:String(page),limit:'20'};
    if (fStatus) p.status = fStatus;
    if (fGroup)  p.bloodGroup = fGroup;
    collectionsApi.list(p).then(r => {
      setItems(r.data); setTotal(r.total); setLoading(false);
    }).catch(e => { setError(e.message); setLoading(false); });
  },[page,fStatus,fGroup]);

  useEffect(()=>{ load(); },[load]);

  const openAdd  = ()=>{ setForm(blank()); setSelected(null); setModal('add'); };
  const openEdit = (c:Collection)=>{ setForm({...c}); setSelected(c); setModal('edit'); };

  const save = async ()=>{
    setSaving(true); setError('');
    try {
      if (modal==='add') await collectionsApi.create(form);
      else if (selected) await collectionsApi.update(selected._id,form);
      setModal(null); load();
    } catch(e:any){ setError(e.message); }
    setSaving(false);
  };

  const remove = async (c:Collection)=>{
    if (!confirm(`Remover bolsa ${c.bagCode}?`)) return;
    await collectionsApi.remove(c._id).catch(e=>setError(e.message));
    load();
  };

  const f=(k:keyof Collection)=>(e:any)=>
    setForm(p=>({...p,[k]:k==='volumeMl'?Number(e.target.value):k==='triageApproved'?e.target.checked:e.target.value}));

  const toggleCheck=(id:string)=>setChecked(s=>{ const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; });
  const allChecked = items.length>0 && items.every(i=>checked.has(i._id));

  const filtered = search
    ? items.filter(c=>c.donorName.toLowerCase().includes(search.toLowerCase())||c.bagCode.toLowerCase().includes(search.toLowerCase())||c.donorDocument.includes(search))
    : items;

  return (
    <>
      {/* Toolbar */}
      <div style={{background:'#fff',borderBottom:'1px solid var(--border)',padding:'8px 20px',display:'flex',alignItems:'center',gap:6,margin:'-16px -16px 16px',flexWrap:'wrap'}}>
        <button className="btn btn-primary" onClick={openAdd}>+ Nova coleta</button>
        <div className="tb-sep"/>
        <button className="btn">↓ Exportar</button>
        <button className="btn">↑ Importar</button>
        <button className="btn">⎙ Imprimir</button>
        <div className="tb-sep"/>
        <button className="btn" disabled={checked.size===0} style={{opacity:checked.size?1:.5}}>Ações ({checked.size}) ▾</button>
        <div style={{marginLeft:'auto',display:'flex',gap:6,alignItems:'center'}}>
          <div style={{position:'relative'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar bolsa, doador, documento…"
              style={{paddingLeft:28,width:240,height:30}}/>
            <span style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',color:'var(--muted)',fontSize:13,pointerEvents:'none'}}>⌕</span>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Coletas — Listagem geral</span>
          <span style={{fontSize:11.5,color:'var(--muted)',marginLeft:'auto'}}>{total} registros</span>
          <div className="tb-sep"/>
          <button className="btn btn-sm">Colunas ▾</button>
        </div>
        <div className="filter-bar">
          <span className="filter-label">Tipo sanguíneo:</span>
          <select className="filter-sel" value={fGroup} onChange={e=>{setFGroup(e.target.value);setPage(1);}}>
            <option value="">Todos</option>
            {GROUPS.map(g=><option key={g}>{g}</option>)}
          </select>
          <span className="filter-label">Status:</span>
          <select className="filter-sel" value={fStatus} onChange={e=>{setFStatus(e.target.value);setPage(1);}}>
            <option value="">Todos</option>
            {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <span className="filter-label">Triagem:</span>
          <select className="filter-sel" onChange={()=>{}}>
            <option>Todos</option><option>Aprovada</option><option>Pendente</option>
          </select>
          <span className="filter-label">Período:</span>
          <select className="filter-sel"><option>Últimos 30 dias</option><option>Último trimestre</option><option>Este ano</option></select>
          <button className="btn btn-link btn-sm" onClick={()=>{setFGroup('');setFStatus('');setPage(1);}}>Limpar filtros</button>
        </div>

        {loading ? <Loading /> : filtered.length===0 ? <Empty /> : (
          <table>
            <colgroup>
              <col style={{width:36}}/><col style={{width:130}}/><col style={{width:190}}/>
              <col style={{width:60}}/><col style={{width:80}}/><col style={{width:90}}/><col style={{width:90}}/>
              <col style={{width:90}}/><col style={{width:95}}/><col style={{width:100}}/><col style={{width:115}}/>
            </colgroup>
            <thead>
              <tr>
                <th onClick={()=>{}}><input type="checkbox" checked={allChecked} onChange={()=>setChecked(allChecked?new Set():new Set(items.map(i=>i._id)))} /></th>
                <th>Cód. bolsa ↕</th>
                <th>Doador ↕</th>
                <th>Tipo</th>
                <th>Volume ↕</th>
                <th>Coleta ↓</th>
                <th>Validade ↕</th>
                <th>Triagem</th>
                <th>Status</th>
                <th>Responsável</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c=>(
                <tr key={c._id}>
                  <td><input type="checkbox" checked={checked.has(c._id)} onChange={()=>toggleCheck(c._id)} /></td>
                  <td className="cell-mono">{c.bagCode}</td>
                  <td>
                    <div className="cell-primary">{c.donorName}</div>
                    <div className="cell-sub">{c.donorDocument}</div>
                  </td>
                  <td><BloodBadge group={c.bloodGroup} rh={c.rhFactor}/></td>
                  <td className="cell-mono">{c.volumeMl} mL</td>
                  <td style={{color:'var(--text-3)'}}>{fmtDate(c.collectionDate)}</td>
                  <td style={{color:isExpired(c.expiresAt)?'var(--danger)':isExpiringSoon(c.expiresAt)?'#d97706':'#16a34a',fontWeight:isExpired(c.expiresAt)||isExpiringSoon(c.expiresAt)?600:400}}>
                    {fmtDate(c.expiresAt)}
                  </td>
                  <td><TriageBadge approved={c.triageApproved}/></td>
                  <td><StatusBadge status={c.status}/></td>
                  <td style={{color:'var(--text-3)',fontSize:12}}>{c.phlebotomist}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-sm" style={{color:'var(--primary)',borderColor:'#c7d5e8'}} onClick={()=>openEdit(c)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>remove(c)}>✕</button>
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
        <Modal title={modal==='add'?'Nova coleta':'Editar coleta'} onClose={()=>setModal(null)}
          footer={<>
            <button className="btn" onClick={()=>setModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?'Salvando…':'Salvar'}</button>
          </>}>
          {error && <Err msg={error}/>}
          <div className="form-grid">
            <Field label="Nome do doador *" full><input value={form.donorName??''} onChange={f('donorName')}/></Field>
            <Field label="Data de nascimento *"><input type="date" value={form.donorBirthDate?.split('T')[0]??''} onChange={f('donorBirthDate')}/></Field>
            <Field label="Documento (CPF/RG) *"><input value={form.donorDocument??''} onChange={f('donorDocument')}/></Field>
            <Field label="Grupo sanguíneo *"><select value={form.bloodGroup} onChange={f('bloodGroup')}>{GROUPS.map(g=><option key={g}>{g}</option>)}</select></Field>
            <Field label="Fator Rh *"><select value={form.rhFactor} onChange={f('rhFactor')}>{RHS.map(r=><option key={r}>{r}</option>)}</select></Field>
            <Field label="Código da bolsa *"><input value={form.bagCode??''} onChange={f('bagCode')}/></Field>
            <Field label="Volume (mL) *"><input type="number" value={form.volumeMl??''} onChange={f('volumeMl')}/></Field>
            <Field label="Data da coleta *"><input type="date" value={form.collectionDate?.split('T')[0]??''} onChange={f('collectionDate')}/></Field>
            <Field label="Validade *"><input type="date" value={form.expiresAt?.split('T')[0]??''} onChange={f('expiresAt')}/></Field>
            <Field label="Flebotomista *" full><input value={form.phlebotomist??''} onChange={f('phlebotomist')}/></Field>
            <Field label="Reg. hospitalar"><input value={form.hospitalReg??''} onChange={f('hospitalReg')}/></Field>
            <Field label="Fenotipagem"><input value={form.phenotyping??''} onChange={f('phenotyping')}/></Field>
            {modal==='edit' && <Field label="Status"><select value={form.status} onChange={f('status')}>{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></Field>}
            <Field label="Observações de triagem" full><textarea value={form.triageNotes??''} onChange={f('triageNotes')} rows={2}/></Field>
            <div className="field form-full">
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                <input type="checkbox" checked={form.triageApproved??false} onChange={f('triageApproved')} style={{width:14,height:14}}/>
                Triagem aprovada
              </label>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
