import { useState } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { usePWA } from '../../hooks/usePWA'

export default function InstallBanner() {
  const { installPrompt, isInstalled, isIOS, install } = usePWA()
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('advax-install-dismissed') === 'true'
  )

  const dismiss = () => {
    setDismissed(true)
    localStorage.setItem('advax-install-dismissed', 'true')
  }

  // Don't show if: already installed, dismissed, or no prompt on non-iOS
  if (isInstalled || dismissed) return null
  if (!installPrompt && !isIOS) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9990, width: 'min(92vw, 400px)',
      background: 'linear-gradient(135deg, #181835, #1E1E42)',
      border: '1.5px solid rgba(232,184,109,.35)',
      borderRadius: 18, padding: '16px 18px',
      boxShadow: '0 12px 48px rgba(0,0,0,.7)',
      animation: 'slideUp .4s ease-out',
      display: 'flex', alignItems: 'center', gap: 14
    }}>

      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 13, flexShrink: 0,
        background: 'linear-gradient(135deg,#E8B86D,#F5CC80)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Smartphone size={26} color="#06060F" />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', marginBottom: 3 }}>
          ثبّت AdVax Studio
        </div>
        {isIOS ? (
          <div style={{ fontSize: 12, color: 'var(--muted2)', lineHeight: 1.5 }}>
            اضغط <b style={{ color: 'var(--gold)' }}>□↑</b> ثم "أضف إلى الشاشة الرئيسية"
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--muted2)' }}>
            أضفه لشاشتك الرئيسية ويعمل بدون إنترنت
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
        {!isIOS && (
          <button onClick={install} style={{
            background: 'linear-gradient(135deg,#E8B86D,#F5CC80)',
            border: 'none', borderRadius: 9, padding: '7px 14px',
            fontWeight: 800, fontSize: 13, color: '#08081A',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: 'Cairo,sans-serif'
          }}>
            <Download size={14} /> تثبيت
          </button>
        )}
        <button onClick={dismiss} style={{
          background: 'rgba(255,255,255,.06)', border: '1px solid var(--border2)',
          borderRadius: 9, padding: '6px 10px', color: 'var(--muted2)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Cairo,sans-serif', fontSize: 12
        }}>
          <X size={13} style={{ marginLeft: 4 }} /> لاحقاً
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
