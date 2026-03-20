export default function Toast({ t }) {
  if (!t) return null
  const bg = t.type === 'error' ? '#FF6B6B' : t.type === 'warn' ? '#E8B86D' : '#3ECFBF'
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: bg, color: '#06060F', padding: '11px 26px', borderRadius: 12,
      fontWeight: 800, zIndex: 99999, fontSize: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,.5)', animation: 'fadeUp .3s', whiteSpace: 'nowrap'
    }}>
      {t.msg}
    </div>
  )
}
