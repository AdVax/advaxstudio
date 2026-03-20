import { DollarSign, Layers, Download, Upload, RefreshCw } from 'lucide-react'
import { today, CURRENCIES } from '../utils/helpers'

export default function SettingsPage({ currency, setCurrency, materials, setMaterials, recipes, setRecipes, showToast }) {
  const doExport = () => {
    const d = JSON.stringify({ materials, recipes, exportDate: new Date().toISOString() }, null, 2)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([d], { type: 'application/json' }))
    a.download = `advax-backup-${today()}.json`
    a.click()
    showToast('✓ تم تصدير البيانات')
  }

  const doImport = e => {
    const f = e.target.files[0]; if (!f) return
    const r = new FileReader()
    r.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result)
        if (d.materials) setMaterials(d.materials)
        if (d.recipes)   setRecipes(d.recipes)
        showToast('✓ تم استيراد البيانات')
      } catch { showToast('خطأ في قراءة الملف', 'error') }
    }
    r.readAsText(f); e.target.value = ''
  }

  const doReset = () => {
    if (window.confirm('⚠️ مسح كل البيانات؟ لا يمكن التراجع!')) {
      setMaterials([]); setRecipes([])
      showToast('تم مسح كل البيانات', 'error')
    }
  }

  return (
    <div className="fu" style={{ maxWidth: 580 }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 22 }}>الإعدادات</h1>

      {/* Currency */}
      <div className="sec">
        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 7 }}>
          <DollarSign size={16} style={{ color: 'var(--gold)' }} />العملة الافتراضية
        </h3>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>تُستخدم في جميع الحسابات والعروض</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 9 }}>
          {CURRENCIES.map(c => (
            <button key={c.code}
              onClick={() => { setCurrency(c.code); showToast(`✓ العملة: ${c.name}`) }}
              style={{
                padding: '12px 6px', borderRadius: 11, cursor: 'pointer', textAlign: 'center',
                fontFamily: 'Cairo,sans-serif', transition: 'all .2s',
                border: `2px solid ${currency === c.code ? 'var(--gold)' : 'var(--border2)'}`,
                background: currency === c.code ? 'var(--goldBg)' : 'var(--card2)',
                color: currency === c.code ? 'var(--gold)' : 'var(--text)'
              }}>
              <div style={{ fontSize: 17, fontWeight: 900 }}>{c.sym}</div>
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 3 }}>{c.code}</div>
              <div style={{ fontSize: 10, color: currency === c.code ? 'var(--gold)' : 'var(--muted)', marginTop: 2 }}>{c.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Data */}
      <div className="sec">
        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 7 }}>
          <Layers size={16} style={{ color: 'var(--info)' }} />إدارة البيانات
        </h3>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>بياناتك محفوظة محلياً في المتصفح — صدّر نسخة احتياطية بانتظام.</p>
        <div style={{ background: 'var(--card2)', borderRadius: 9, padding: '10px 14px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: 'var(--muted2)' }}>المواد: <b style={{ color: 'var(--text)' }}>{materials.length}</b></span>
          <span style={{ color: 'var(--muted2)' }}>الوصفات: <b style={{ color: 'var(--text)' }}>{recipes.length}</b></span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <button className="btn btn-o" style={{ justifyContent: 'flex-start', gap: 10, width: '100%' }} onClick={doExport}>
            <Download size={15} />تصدير كل البيانات (JSON)
            <span style={{ marginRight: 'auto', fontSize: 11, color: 'var(--muted)' }}>نسخة احتياطية</span>
          </button>
          <label style={{ display: 'block', cursor: 'pointer' }}>
            <div className="btn btn-o" style={{ justifyContent: 'flex-start', gap: 10, width: '100%', display: 'flex' }}>
              <Upload size={15} />استيراد بيانات (JSON)
              <span style={{ marginRight: 'auto', fontSize: 11, color: 'var(--muted)' }}>استعادة نسخة</span>
            </div>
            <input type="file" accept=".json" onChange={doImport} style={{ display: 'none' }} />
          </label>
          <button className="btn btn-d" style={{ justifyContent: 'flex-start', gap: 10, width: '100%' }} onClick={doReset}>
            <RefreshCw size={15} />مسح جميع البيانات
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, marginTop: 20 }}>
        <div style={{ fontWeight: 800, color: 'var(--gold)', marginBottom: 3 }}>AdVax Studio</div>
        <div>حاسبة تكاليف الإنتاج الذكية · AdVax © {new Date().getFullYear()}</div>
        <div style={{ marginTop: 3, color: 'var(--border2)' }}>Know your cost. Grow your craft.</div>
      </div>
    </div>
  )
}
