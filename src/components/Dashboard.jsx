import { Package, BookOpen, TrendingUp, Percent, ArrowUpRight, Plus, Star } from 'lucide-react'
import { fmt, fu4 } from '../utils/helpers'

export default function Dashboard({ materials, recipes, currency, setPage }) {
  const matUsage = {}
  recipes.forEach(r => (r.ingredients || []).forEach(i => {
    matUsage[i.materialId] = (matUsage[i.materialId] || 0) + 1
  }))
  const mostExp = recipes.length ? [...recipes].sort((a, b) => b.costPerUnit - a.costPerUnit)[0] : null
  const bestM   = recipes.filter(r => r.margin !== null).sort((a, b) => b.margin - a.margin)[0]

  const stats = [
    { label: 'المواد الخام',   val: materials.length, sub: 'مادة مسجلة', icon: Package, color: 'var(--info)', pg: 'materials' },
    { label: 'الوصفات',        val: recipes.length,   sub: 'وصفة محفوظة', icon: BookOpen, color: 'var(--gold)', pg: 'recipes' },
    { label: 'أغلى منتج',      val: mostExp ? mostExp.name : '—', sub: mostExp ? fmt(mostExp.costPerUnit, currency) + '/وحدة' : 'لا توجد وصفات', icon: TrendingUp, color: 'var(--danger)', pg: 'recipes' },
    { label: 'أفضل هامش ربح', val: bestM ? `${bestM.margin?.toFixed(1)}%` : '—', sub: bestM ? bestM.name : 'أضف سعر بيع للوصفات', icon: Percent, color: 'var(--success)', pg: 'recipes' },
  ]

  return (
    <div className="fu">
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 5 }}>
          مرحباً في <span style={{ color: 'var(--gold)' }}>AdVax Studio</span> 👋
        </h1>
        <p style={{ color: 'var(--muted2)', fontSize: 14 }}>نظرة شاملة على تكاليف إنتاجك وأرباحك</p>
      </div>

      {/* Stats */}
      <div className="ga" style={{ marginBottom: 22 }}>
        {stats.map((s, i) => (
          <div key={i} className="card ch" style={{ padding: 20, cursor: 'pointer' }} onClick={() => setPage(s.pg)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={21} style={{ color: s.color }} />
              </div>
              <ArrowUpRight size={15} style={{ color: 'var(--muted)' }} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 13, color: 'var(--muted2)', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div className="g2">
        <div className="sec" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
              <Package size={15} style={{ color: 'var(--info)' }} />آخر المواد
            </h3>
            <button onClick={() => setPage('materials')} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Cairo,sans-serif' }}>
              إدارة ←
            </button>
          </div>
          {materials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '18px 0', color: 'var(--muted)' }}>
              <Package size={30} style={{ margin: '0 auto 10px', opacity: .25 }} />
              <p style={{ fontSize: 13 }}>لا توجد مواد بعد</p>
              <button className="btn btn-g" style={{ marginTop: 10, fontSize: 12, padding: '7px 14px' }} onClick={() => setPage('materials')}>
                <Plus size={13} />إضافة مادة
              </button>
            </div>
          ) : materials.slice(-6).reverse().map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 12 }}>{fu4(m.currentUnitCost)}/{m.currentUnit}</span>
            </div>
          ))}
        </div>

        <div className="sec" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
              <BookOpen size={15} style={{ color: 'var(--gold)' }} />آخر الوصفات
            </h3>
            <button onClick={() => setPage('recipes')} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Cairo,sans-serif' }}>
              إدارة ←
            </button>
          </div>
          {recipes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '18px 0', color: 'var(--muted)' }}>
              <BookOpen size={30} style={{ margin: '0 auto 10px', opacity: .25 }} />
              <p style={{ fontSize: 13 }}>لا توجد وصفات بعد</p>
              <button className="btn btn-g" style={{ marginTop: 10, fontSize: 12, padding: '7px 14px' }} onClick={() => setPage('recipes')}>
                <Plus size={13} />إضافة وصفة
              </button>
            </div>
          ) : recipes.slice(-6).reverse().map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 12 }}>{fmt(r.costPerUnit, currency)}</div>
                {r.margin !== null && (
                  <div style={{ color: r.margin > 30 ? 'var(--success)' : 'var(--danger)', fontSize: 11 }}>{r.margin.toFixed(1)}% ربح</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {materials.length === 0 && (
        <div style={{ background: 'rgba(232,184,109,.07)', border: '1.5px dashed rgba(232,184,109,.28)', borderRadius: 13, padding: 18, marginTop: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Star size={21} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 800, marginBottom: 5, color: 'var(--gold)' }}>ابدأ من هنا!</div>
            <div style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.9 }}>
              <b style={{ color: 'var(--text)' }}>الخطوة 1:</b> أضف مواد خامك مع أسعارها من صفحة "المواد الخام"<br />
              <b style={{ color: 'var(--text)' }}>الخطوة 2:</b> أنشئ وصفاتك واختر المكونات من المواد المضافة<br />
              <b style={{ color: 'var(--text)' }}>النتيجة ✨:</b> التطبيق يحسب التكلفة تلقائياً وتتحدث فور تغيير أي سعر
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
