import { useState } from 'react'
import { Package, Plus, Edit2, Trash2, Search, Clock, ChevronDown } from 'lucide-react'
import Modal from './ui/Modal'
import Confirm from './ui/Confirm'
import { uid, fmt, fu4, today, MATERIAL_CATS, UNITS } from '../utils/helpers'

function MatCard({ mat, currency, onEdit, onDel }) {
  const [exp, setExp] = useState(false)
  const latest = mat.purchases?.[mat.purchases.length - 1]

  return (
    <div className="card ch" style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 5 }}>{mat.name}</h3>
          <span className="tag ti">{mat.category}</span>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <button onClick={onEdit} style={{ background: 'rgba(123,143,232,.12)', border: 'none', color: 'var(--info)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex' }}>
            <Edit2 size={13} />
          </button>
          <button onClick={onDel} style={{ background: 'rgba(255,107,107,.12)', border: 'none', color: 'var(--danger)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--goldBg)', border: '1px solid rgba(232,184,109,.16)', borderRadius: 9, padding: '11px 13px', marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--muted2)', marginBottom: 2 }}>سعر الوحدة الحالي</div>
        <div style={{ fontSize: 19, fontWeight: 900, color: 'var(--gold)' }}>
          {fu4(mat.currentUnitCost)}
          <span style={{ fontSize: 12, color: 'var(--muted2)', marginRight: 5 }}>{currency}/{mat.currentUnit}</span>
        </div>
      </div>

      {latest && (
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
          <Clock size={10} style={{ marginLeft: 3, verticalAlign: 'middle' }} />
          آخر شراء: {latest.quantity} {mat.currentUnit} بـ {fmt(latest.totalPrice, currency)} — {latest.date}
        </div>
      )}

      <button
        onClick={() => setExp(!exp)}
        style={{ background: 'none', border: 'none', color: 'var(--muted2)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Cairo,sans-serif' }}
      >
        <Clock size={11} />{mat.purchases?.length || 0} عملية شراء
        <ChevronDown size={11} style={{ transform: exp ? 'rotate(180deg)' : 'rotate(0)', transition: '.2s' }} />
      </button>

      {exp && mat.purchases?.length > 0 && (
        <div style={{ marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          {[...mat.purchases].reverse().map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4,
              fontSize: 11, padding: '5px 9px', borderRadius: 7, marginBottom: 3,
              background: i === 0 ? 'rgba(232,184,109,.06)' : 'transparent',
              border: i === 0 ? '1px solid rgba(232,184,109,.13)' : 'none'
            }}>
              <span style={{ color: 'var(--muted2)' }}>{p.date}</span>
              <span>{p.quantity} {mat.currentUnit}</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{fmt(p.totalPrice, currency)}</span>
              <span style={{ color: 'var(--success)' }}>{fu4(p.unitCost)}/وحدة</span>
              {i === 0 && <span className="tag tg" style={{ fontSize: 9 }}>الحالي</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MatModal({ mat, onSave, onClose, currency }) {
  const [name, setName]       = useState(mat?.name || '')
  const [cat, setCat]         = useState(mat?.category || MATERIAL_CATS[0])
  const [purchases, setPurch] = useState(mat?.purchases || [])
  const [np, setNp]           = useState({ date: today(), qty: '', unit: UNITS[0], price: '' })

  const addP = () => {
    const qty = parseFloat(np.qty), price = parseFloat(np.price)
    if (!qty || !price) return
    setPurch(p => [...p, { id: uid(), date: np.date, quantity: qty, unit: np.unit, totalPrice: price, unitCost: price / qty }])
    setNp(p => ({ ...p, qty: '', price: '' }))
  }

  const save = () => {
    if (!name.trim() || purchases.length === 0) return
    const l = purchases[purchases.length - 1]
    onSave({ ...(mat || {}), name: name.trim(), category: cat, purchases, currentUnitCost: l.unitCost, currentUnit: l.unit })
  }

  const prev = np.qty && np.price ? (parseFloat(np.price) / parseFloat(np.qty)).toFixed(4) : null

  return (
    <Modal title={mat ? '✏️ تعديل المادة' : '➕ إضافة مادة جديدة'} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="g2">
          <div><label className="lbl">اسم المادة *</label><input value={name} onChange={e => setName(e.target.value)} placeholder="مثال: زبدة الشيا" /></div>
          <div><label className="lbl">الفئة</label>
            <select value={cat} onChange={e => setCat(e.target.value)}>
              {MATERIAL_CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <hr className="hr" />
        <h4 style={{ fontSize: 14, fontWeight: 800 }}>📦 سجل المشتريات</h4>

        <div style={{ background: 'var(--card2)', borderRadius: 11, padding: 14, border: '1px solid var(--border2)' }}>
          <p style={{ fontSize: 12, color: 'var(--muted2)', marginBottom: 10, fontWeight: 600 }}>إضافة عملية شراء جديدة</p>
          <div className="g2" style={{ marginBottom: 10 }}>
            <div><label className="lbl">تاريخ الشراء</label><input type="date" value={np.date} onChange={e => setNp(p => ({ ...p, date: e.target.value }))} /></div>
            <div><label className="lbl">الوحدة</label>
              <select value={np.unit} onChange={e => setNp(p => ({ ...p, unit: e.target.value }))}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="g2" style={{ marginBottom: 10 }}>
            <div><label className="lbl">الكمية المشتراة</label><input type="number" value={np.qty} onChange={e => setNp(p => ({ ...p, qty: e.target.value }))} placeholder="500" min="0" step="any" /></div>
            <div><label className="lbl">السعر الإجمالي ({currency})</label><input type="number" value={np.price} onChange={e => setNp(p => ({ ...p, price: e.target.value }))} placeholder="45" min="0" step="any" /></div>
          </div>
          {prev && (
            <div style={{ background: 'rgba(62,207,191,.1)', border: '1px solid rgba(62,207,191,.18)', borderRadius: 8, padding: '7px 11px', fontSize: 12, color: 'var(--success)', marginBottom: 10 }}>
              ✓ سعر الوحدة: {prev} {currency}/{np.unit}
            </div>
          )}
          <button className="btn btn-o" style={{ width: '100%', justifyContent: 'center' }} onClick={addP}><Plus size={13} />إضافة للسجل</button>
        </div>

        {purchases.length > 0 && (
          <div>
            <p style={{ fontSize: 12, color: 'var(--muted2)', marginBottom: 8 }}>السجل ({purchases.length} عملية)</p>
            {purchases.map((p, i) => (
              <div key={p.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px',
                background: i === purchases.length - 1 ? 'rgba(232,184,109,.06)' : 'var(--card2)',
                border: `1px solid ${i === purchases.length - 1 ? 'rgba(232,184,109,.18)' : 'var(--border)'}`,
                borderRadius: 9, marginBottom: 5
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{p.date} — {p.quantity} {p.unit}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>إجمالي: {fmt(p.totalPrice, currency)} | الوحدة: {fu4(p.unitCost)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {i === purchases.length - 1 && <span className="tag tg">الأحدث</span>}
                  <button onClick={() => setPurch(pr => pr.filter(x => x.id !== p.id))} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex' }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {purchases.length === 0 && <p style={{ color: 'var(--danger)', fontSize: 12, textAlign: 'center' }}>* يجب إضافة عملية شراء واحدة على الأقل</p>}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-g" style={{ flex: 1, justifyContent: 'center' }} onClick={save} disabled={!name.trim() || purchases.length === 0}>
            ✓ {mat ? 'حفظ التغييرات' : 'إضافة المادة'}
          </button>
          <button className="btn btn-o" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </Modal>
  )
}

export default function Materials({ materials, setMaterials, currency, showToast }) {
  const [srch, setSrch]   = useState('')
  const [cat, setCat]     = useState('الكل')
  const [modal, setModal] = useState(null)
  const [conf, setConf]   = useState(null)

  const filtered = materials.filter(m =>
    (cat === 'الكل' || m.category === cat) &&
    m.name.toLowerCase().includes(srch.toLowerCase())
  )

  const save = d => {
    if (d.id) { setMaterials(p => p.map(m => m.id === d.id ? d : m)); showToast('✓ تم تحديث المادة') }
    else       { setMaterials(p => [...p, { ...d, id: uid() }]);       showToast('✓ تمت إضافة المادة') }
    setModal(null)
  }
  const del = id => { setMaterials(p => p.filter(m => m.id !== id)); setConf(null); showToast('تم حذف المادة', 'error') }

  return (
    <div className="fu">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 3 }}>المواد الخام</h1>
          <p style={{ color: 'var(--muted2)', fontSize: 13 }}>{materials.length} مادة مسجلة</p>
        </div>
        <button className="btn btn-g" onClick={() => setModal('add')}><Plus size={15} />إضافة مادة</button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input value={srch} onChange={e => setSrch(e.target.value)} placeholder="بحث عن مادة..." style={{ paddingRight: 38 }} />
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)} style={{ width: 'auto', minWidth: 140 }}>
          <option>الكل</option>
          {MATERIAL_CATS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '52px 0', color: 'var(--muted)' }}>
          <Package size={48} style={{ margin: '0 auto 14px', opacity: .22 }} />
          <p style={{ fontSize: 15 }}>{srch ? 'لا توجد مواد تطابق البحث' : 'لا توجد مواد بعد'}</p>
          {!srch && <button className="btn btn-g" style={{ marginTop: 14 }} onClick={() => setModal('add')}><Plus size={14} />إضافة مادة الآن</button>}
        </div>
      ) : (
        <div className="ga">
          {filtered.map(m => <MatCard key={m.id} mat={m} currency={currency} onEdit={() => setModal(m)} onDel={() => setConf(m.id)} />)}
        </div>
      )}

      {modal && <MatModal mat={modal === 'add' ? null : modal} onSave={save} onClose={() => setModal(null)} currency={currency} />}
      {conf   && <Confirm msg="هل أنت متأكد من حذف هذه المادة؟ سيؤثر ذلك على الوصفات المرتبطة." onYes={() => del(conf)} onNo={() => setConf(null)} />}
    </div>
  )
}
