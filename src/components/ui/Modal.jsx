import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="modal-wrap" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box${wide ? ' wide' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontSize: 19, fontWeight: 900 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,.07)', border: 'none', color: 'var(--muted2)', cursor: 'pointer', padding: '6px 8px', borderRadius: 8, display: 'flex' }}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
