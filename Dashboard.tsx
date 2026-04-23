import { useEffect, useState } from 'react';
import { collectionsApi, transfusionsApi, therapeuticApi } from '../api';
import { KpiCard, BloodBadge, StatusBadge, fmtDate } from '../ui';
import type { Collection, Transfusion, Page } from '../types';

const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-'] as const;

export function Dashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [cols, setCols]   = useState<Collection[]>([]);
  const [trans, setTrans] = useState<Transfusion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      collectionsApi.list({ limit: '300' }),
      transfusionsApi.list({ limit: '200' }),
      therapeuticApi.list({ limit: '10' }),
    ]).then(([c, t]) => {
      setCols(c.data); setTrans(t.data); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const available  = cols.filter(c => c.status === 'available').length;
  const pending    = trans.filter(t => t.status === 'pending').length;
  const expiring   = cols.filter(c => {
    const diff = new Date(c.expiresAt).getTime() - Date.now();
    return diff > 0 && diff < 7 * 86400000;
  }).length;
  const byType: Record<string, number> = {};
  for (const c of cols) {
    if (c.status === 'available') {
      const k = `${c.bloodGroup}${c.rhFactor}`;
      byType[k] = (byType[k] ?? 0) + 1;
    }
  }

  if (loading) return <div style={{ padding: 40, color: 'var(--muted)', textAlign: 'center' }}>Carregando…</div>;

  return (
    <>
      {/* Toolbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, margin: '-16px -16px 16px', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => onNavigate('collections')}>+ Nova coleta</button>
        <button className="btn btn-success" onClick={() => onNavigate('transfusions')}>+ Solicitação</button>
        <div className="tb-sep" />
        <button className="btn">↓ Exportar relatório</button>
        <button className="btn">⎙ Imprimir</button>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>
          Atualizado: {new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 10 }}>
        <KpiCard label="Total de coletas"      value={cols.length}  sub="registros cadastrados" accentColor="#3b82f6" />
        <KpiCard label="Bolsas disponíveis"    value={available}    sub="prontas para uso"      accentColor="#16a34a" trend="up" />
        <KpiCard label="Transfusões pendentes" value={pending}      sub="aguardando aprovação"  accentColor={pending > 0 ? '#f59e0b' : '#16a34a'} trend={pending > 0 ? 'down' : 'up'} />
        <KpiCard label="A vencer (7 dias)"     value={expiring}     sub={expiring > 0 ? 'ação necessária' : 'nenhuma'}  accentColor={expiring > 0 ? '#dc2626' : '#16a34a'} />
        <KpiCard label="Tipos cadastrados"     value={Object.keys(byType).length} sub="tipos no estoque" accentColor="#94a3b8" />
      </div>

      {/* Stock by blood type */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Estoque atual por tipo sanguíneo</span>
          <span style={{ fontSize: 11.5, color: 'var(--muted)', marginLeft: 'auto' }}>Bolsas disponíveis</span>
          <button className="btn btn-sm" onClick={() => onNavigate('collections')}>Ver tudo</button>
        </div>
        <table>
          <colgroup>
            {BLOOD_TYPES.map(t => <col key={t} style={{ width: `${100 / BLOOD_TYPES.length}%` }} />)}
          </colgroup>
          <thead>
            <tr>
              {BLOOD_TYPES.map(bt => (
                <th key={bt} style={{ textAlign: 'center', padding: '8px 6px', cursor: 'default' }}>
                  <span className={`bt bt-${bt.replace(/[+-]/g, '')}`}>{bt}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {BLOOD_TYPES.map(bt => {
                const count = byType[bt] ?? 0;
                const max   = Math.max(...Object.values(byType), 1);
                const pct   = Math.round((count / max) * 100);
                return (
                  <td key={bt} style={{ textAlign: 'center', padding: '14px 6px', verticalAlign: 'bottom' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 18, fontWeight: 600, color: count > 0 ? 'var(--text)' : '#d1d5db', fontVariantNumeric: 'tabular-nums' }}>
                        {count}
                      </span>
                      <div style={{ width: 8, height: 56, background: '#f0f2f5', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${pct}%`, background: count > 0 ? 'var(--primary)' : '#e2e6ea', borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 500 }}>{pct}%</span>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recent lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Últimas coletas</span>
            <button className="btn-link btn btn-sm" onClick={() => onNavigate('collections')}>Ver todas →</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Bolsa</th>
                <th>Doador</th>
                <th>Tipo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cols.slice(0, 6).map(c => (
                <tr key={c._id}>
                  <td className="cell-mono" style={{ fontSize: 11.5 }}>{c.bagCode.slice(-8)}</td>
                  <td><div className="cell-primary" style={{ fontSize: 12.5 }}>{c.donorName.split(' ')[0]} {c.donorName.split(' ').pop()}</div></td>
                  <td><BloodBadge group={c.bloodGroup} rh={c.rhFactor} /></td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              ))}
              {cols.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px 0' }}>Sem registros</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Últimas transfusões</span>
            <button className="btn-link btn btn-sm" onClick={() => onNavigate('transfusions')}>Ver todas →</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Paciente</th>
                <th>Tipo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trans.slice(0, 6).map(t => (
                <tr key={t._id}>
                  <td className="cell-mono" style={{ fontSize: 11.5 }}>{t.hospitalOrder.slice(-8)}</td>
                  <td><div className="cell-primary" style={{ fontSize: 12.5 }}>{t.patientName.split(' ')[0]} {t.patientName.split(' ').pop()}</div></td>
                  <td><BloodBadge group={t.bloodGroup} rh={t.rhFactor} /></td>
                  <td><StatusBadge status={t.status} /></td>
                </tr>
              ))}
              {trans.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px 0' }}>Sem registros</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
