import { ReactNode } from 'react';
import type { BloodGroup, RhFactor, CollectionStatus, TransfusionStatus, TherapeuticStatus } from './types';

// ── Blood type chip ────────────────────────────────────────────────────────────
export function BloodBadge({ group, rh }: { group: BloodGroup; rh: RhFactor }) {
  const cls = `bt bt-${group}`;
  return <span className={cls}>{group}{rh}</span>;
}

// ── Status tag ─────────────────────────────────────────────────────────────────
type AnyStatus = CollectionStatus | TransfusionStatus | TherapeuticStatus;
const statusMap: Record<string, { label: string; cls: string }> = {
  available:   { label: 'Disponível',   cls: 'tag tag-green'  },
  reserved:    { label: 'Reservada',    cls: 'tag tag-blue'   },
  used:        { label: 'Utilizada',    cls: 'tag tag-gray'   },
  discarded:   { label: 'Descartada',  cls: 'tag tag-red'    },
  expired:     { label: 'Vencida',      cls: 'tag tag-red'    },
  pending:     { label: 'Pendente',     cls: 'tag tag-amber'  },
  approved:    { label: 'Aprovada',     cls: 'tag tag-blue'   },
  in_progress: { label: 'Em andamento', cls: 'tag tag-purple' },
  completed:   { label: 'Concluído',   cls: 'tag tag-green'  },
  cancelled:   { label: 'Cancelado',   cls: 'tag tag-red'    },
  scheduled:   { label: 'Agendado',    cls: 'tag tag-blue'   },
};
export function StatusBadge({ status }: { status: AnyStatus }) {
  const cfg = statusMap[status] ?? { label: status, cls: 'tag tag-gray' };
  return <span className={cfg.cls}>{cfg.label}</span>;
}

// ── Triagem badge ──────────────────────────────────────────────────────────────
export function TriageBadge({ approved }: { approved: boolean }) {
  return approved
    ? <span className="tag tag-green">✓ Aprovada</span>
    : <span className="tag tag-amber">Pendente</span>;
}

// ── Modal ──────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, footer }: {
  title: string; onClose: () => void; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn btn-sm" onClick={onClose} style={{ padding: '2px 8px' }}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────────
export function Field({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <div className={`field${full ? ' form-full' : ''}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}

// ── Toolbar ────────────────────────────────────────────────────────────────────
export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
      {children}
    </div>
  );
}

// ── KPI card ───────────────────────────────────────────────────────────────────
export function KpiCard({ label, value, sub, trend, accentColor }: {
  label: string; value: string | number; sub?: string; trend?: 'up' | 'down' | 'neutral'; accentColor?: string;
}) {
  return (
    <div className="kpi" style={accentColor ? { borderTop: `3px solid ${accentColor}` } : {}}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-val">{value}</div>
      {sub && (
        <div className="kpi-sub">
          {trend === 'up'   && <span className="kpi-up">▲ </span>}
          {trend === 'down' && <span className="kpi-down">▼ </span>}
          {sub}
        </div>
      )}
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────
export function Pager({ page, total, limit, onChange }: {
  page: number; total: number; limit: number; onChange: (p: number) => void;
}) {
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  const end   = Math.min(page * limit, total);
  return (
    <div className="pager">
      <span className="pager-info">Exibindo {start}–{end} de {total} registros</span>
      <span style={{ fontSize: 11.5, color: 'var(--muted)', marginLeft: 16 }}>Linhas por página:</span>
      <select className="filter-sel" style={{ marginLeft: 4 }} value={limit} readOnly>
        <option>{limit}</option>
      </select>
      <div className="pager-btns">
        <div className="pg-btn" onClick={() => onChange(1)}>«</div>
        <div className="pg-btn" onClick={() => onChange(Math.max(1, page - 1))}>‹</div>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          const p = i + 1;
          return <div key={p} className={`pg-btn${page === p ? ' active' : ''}`} onClick={() => onChange(p)}>{p}</div>;
        })}
        {pages > 5 && <div className="pg-btn">…</div>}
        <div className="pg-btn" onClick={() => onChange(Math.min(pages, page + 1))}>›</div>
        <div className="pg-btn" onClick={() => onChange(pages)}>»</div>
      </div>
    </div>
  );
}

// ── Empty ──────────────────────────────────────────────────────────────────────
export function Empty({ msg = 'Nenhum registro encontrado.' }: { msg?: string }) {
  return <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontSize: 13 }}>{msg}</div>;
}

export function Loading() {
  return <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>Carregando…</div>;
}

export function Err({ msg }: { msg: string }) {
  return <div className="erp-error">{msg}</div>;
}

// ── Utilities ──────────────────────────────────────────────────────────────────
export const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '—';

export function isExpiringSoon(d?: string) {
  if (!d) return false;
  const diff = new Date(d).getTime() - Date.now();
  return diff > 0 && diff < 7 * 86400000;
}
export function isExpired(d?: string) {
  if (!d) return false;
  return new Date(d) < new Date();
}
