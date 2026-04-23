import { useState } from 'react';
import type { Page } from './types';
import { Dashboard }      from './pages/Dashboard';
import { Collections }    from './pages/Collections';
import { Transfusions }   from './pages/Transfusions';
import { TherapeuticPage} from './pages/Therapeutic';

type SideItem = { id: Page; label: string; badge?: string; badgeColor?: string };

const MODULES = [
  { id: 'dashboard',    label: 'Hemocentro' },
  { id: 'lab',         label: 'Laboratório' },
  { id: 'patients',    label: 'Pacientes' },
  { id: 'reports',     label: 'Relatórios' },
];

const SIDEBAR: { title: string; items: SideItem[] }[] = [
  {
    title: 'Visão geral',
    items: [
      { id: 'dashboard', label: 'Dashboard' },
    ],
  },
  {
    title: 'Estoque',
    items: [
      { id: 'collections', label: 'Coletas', badge: '247' },
    ],
  },
  {
    title: 'Solicitações',
    items: [
      { id: 'transfusions', label: 'Transfusões', badge: '12', badgeColor: 'red' },
    ],
  },
  {
    title: 'Terapêutico',
    items: [
      { id: 'therapeutic', label: 'Procedimentos', badge: '5' },
    ],
  },
];

const BREADCRUMBS: Record<Page, string[]> = {
  dashboard:    ['Hemocentro', 'Dashboard'],
  collections:  ['Hemocentro', 'Estoque', 'Coletas'],
  transfusions: ['Hemocentro', 'Solicitações', 'Transfusões'],
  therapeutic:  ['Hemocentro', 'Terapêutico', 'Procedimentos'],
};

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');

  const bc = BREADCRUMBS[page];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── Top bar ────────────────────────────────────────────── */}
      <header style={{ background: 'var(--primary)', height: 44, display: 'flex', alignItems: 'stretch', flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px 0 16px', borderRight: '1px solid rgba(255,255,255,.15)', flexShrink: 0 }}>
          <div style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '.02em' }}>3brasiltech ERP</span>
        </div>

        {/* Module nav */}
        <nav style={{ display: 'flex', alignItems: 'stretch' }}>
          {MODULES.map(m => (
            <div key={m.id} style={{
              padding: '0 16px', display: 'flex', alignItems: 'center',
              color: m.id === 'dashboard' ? '#fff' : 'rgba(255,255,255,.65)',
              fontSize: 12.5, cursor: 'pointer',
              borderBottom: m.id === 'dashboard' ? '2px solid #60a5fa' : '2px solid transparent',
              background: m.id === 'dashboard' ? 'rgba(255,255,255,.08)' : 'transparent',
            }}>
              {m.label}
            </div>
          ))}
        </nav>

        {/* Right */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 0, paddingRight: 12 }}>
          <div style={{ padding: '0 12px', color: 'rgba(255,255,255,.65)', fontSize: 12, height: 44, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
            Notif.
            <span style={{ background: '#ef4444', color: '#fff', borderRadius: 9, padding: '0 5px', fontSize: 10, fontWeight: 700 }}>3</span>
          </div>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,.15)', margin: '0 4px' }} />
          <div style={{ padding: '0 10px', color: 'rgba(255,255,255,.65)', fontSize: 12, height: 44, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>Ajuda</div>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,.15)', margin: '0 4px' }} />
          <div style={{ background: 'rgba(255,255,255,.12)', borderRadius: 4, padding: '4px 10px', color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginLeft: 4 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>FB</div>
            Fabio B.
            <span style={{ opacity: .5, fontSize: 10 }}>▼</span>
          </div>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{ width: 200, background: '#fff', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0 }}>
          {SIDEBAR.map(section => (
            <div key={section.title} style={{ padding: '8px 0', borderBottom: '1px solid #f0f2f5' }}>
              <div style={{ padding: '6px 16px 4px', fontSize: 10.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '.07em', textTransform: 'uppercase' }}>
                {section.title}
              </div>
              {section.items.map(item => {
                const active = page === item.id;
                return (
                  <div key={item.id} onClick={() => setPage(item.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 16px',
                    color: active ? 'var(--primary)' : 'var(--text-2)',
                    cursor: 'pointer', fontSize: 12.5,
                    fontWeight: active ? 500 : 400,
                    borderLeft: active ? '2px solid var(--primary)' : '2px solid transparent',
                    background: active ? 'var(--primary-lt)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#f5f7fa'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    {item.label}
                    {item.badge && (
                      <span style={{
                        marginLeft: 'auto', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 10,
                        background: item.badgeColor === 'red' ? '#fee2e2' : '#fef3c7',
                        color: item.badgeColor === 'red' ? '#991b1b' : '#92400e',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Breadcrumb */}
          <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 20px', height: 36, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)', flexShrink: 0 }}>
            {bc.map((crumb, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <span style={{ color: '#c8d0db', fontSize: 10 }}>›</span>}
                <span style={i === bc.length - 1 ? { color: 'var(--text-2)', fontWeight: 500 } : {}}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>

          {/* Scrollable page content */}
          <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {page === 'dashboard'    && <Dashboard    onNavigate={setPage} />}
            {page === 'collections'  && <Collections />}
            {page === 'transfusions' && <Transfusions />}
            {page === 'therapeutic'  && <TherapeuticPage />}
          </div>
        </div>
      </div>
    </div>
  );
}
