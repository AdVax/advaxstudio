import { LayoutDashboard, Package, BookOpen, Settings, FlaskConical, ChevronRight } from 'lucide-react'

const NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { id: 'materials',  icon: Package,         label: 'المواد الخام'  },
  { id: 'recipes',    icon: BookOpen,         label: 'الوصفات'       },
  { id: 'settings',   icon: Settings,         label: 'الإعدادات'     },
]

export default function Sidebar({ page, setPage, open, setOpen }) {
  const isMobile = window.innerWidth < 860
  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 998 }}
        />
      )}
      <aside style={{
        width: 238, flexShrink: 0, background: 'var(--surf)',
        borderLeft: '1.5px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '18px 10px',
        position: isMobile ? 'fixed' : 'relative',
        right: 0, top: 0, bottom: 0, height: '100%', zIndex: 999,
        transform: isMobile ? (open ? 'translateX(0)' : 'translateX(110%)') : 'none',
        transition: 'transform .3s'
      }}>
        {/* Logo */}
        <div style={{ padding: '8px 12px', marginBottom: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#E8B86D,#F5CC80)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlaskConical size={19} color="#06060F" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 17, color: 'var(--gold)' }}>AdVax Studio</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', paddingRight: 44 }}>حاسبة تكاليف الإنتاج</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-btn${page === n.id ? ' act' : ''}`}
              onClick={() => { setPage(n.id); setOpen(false) }}
            >
              <n.icon size={17} />{n.label}
              {page === n.id && <ChevronRight size={13} style={{ marginRight: 'auto' }} />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>AdVax © {new Date().getFullYear()}</div>
          <div style={{ fontSize: 10, color: 'var(--border2)', marginTop: 2 }}>Know your cost. Grow your craft.</div>
        </div>
      </aside>
    </>
  )
}
