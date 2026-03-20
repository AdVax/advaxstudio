import { AlertCircle } from 'lucide-react'

export default function Confirm({ msg, onYes, onNo }) {
  return (
    <div className="modal-wrap">
      <div className="modal-box" style={{ maxWidth: 370, textAlign: 'center' }}>
        <AlertCircle size={50} style={{ color: 'var(--danger)', margin: '0 auto 14px' }} />
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 22 }}>{msg}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-d" onClick={onYes}>تأكيد الحذف</button>
          <button className="btn btn-o" onClick={onNo}>إلغاء</button>
        </div>
      </div>
    </div>
  )
}
