import { useState } from 'react'
import { BookOpen, Plus, Edit2, Trash2, Search, Copy, ChevronDown, AlertCircle, FlaskConical, Check } from 'lucide-react'
import Modal from './ui/Modal'
import Confirm from './ui/Confirm'
import { uid, fmt, fu4, RECIPE_CATS, UNITS } from '../utils/helpers'

function RecCard({ r, currency, onEdit, onDel, onDup, materials }) {
  const [exp, setExp] = useState(false)
  const mc = r.margin === null ? 'var(--muted)'
           : r.margin > 50    ? 'var(--success)'
           : r.margin > 20    ? 'var(--gold)'
           : 'var(--danger)'

  return (
    <div className="card ch" style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 5 }}>{r.name}</h3>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            <span className="tag tg">{r.category}</span>
            {r.batchSize > 1 && <span className="tag tm">دفعة: {r.batchSize} وحدة</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={onDup}  style={{ background: 'rgba(62,207,191,.1)',  border: 'none', color: 'var(--success)', borderRadius: 7, padding: '5px 7px', cursor: 'pointer', display: 'flex' }}><Copy  size={12} /></button>
          <button onClick={onEdit} style={{ background: 'rgba(123,143,232,.1)', border: 'none', color: 'var(--info)',    borderRadius: 7, padding: '5px 7px', cursor: 'pointer', display: 'flex' }}><Edit2 size={12} /></button>
          <button onClick={onDel}  style={{ background: 'rgba(255,107,107,.1)', border: 'none', color: 'var(--danger)', borderRadius: 7, padding: '5px 7px', cursor: 'pointer', display: 'flex' }}><Trash2 size={12} /></button>
        </div>
      </div>

      {r.description && <p style={{ fontSize: 12, color: 'var(--muted2)', marginBottom: 10, lineHeight: 1.6 }}>{r.description}</p>}

      <div className="g2" style={{ marginBottom: r.sellingPrice > 0 ? 10 : 12 }}>
        <div style={{ background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.13)', borderRadius: 9, padding: '9px 11px' }}>
          <div style={{ fontSize: 10, color: 'var(--muted2)', marginBottom: 2 }}>تكلفة الإنتاج</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--danger)' }}>{fmt(r.totalCost, currency)}</div>
        </div>
        <div style={{ background: 'var(--goldBg)', border: '1px solid rgba(232,184,109,.16)', borderRadius: 9, padding: '9px 11px' }}>
          <div style={{ fontSize: 10, color: 'var(--muted2)', marginBottom: 2 }}>تكلفة الوحدة</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--gold)' }}>{fmt(r.costPerUnit, currency)}</div>
        </div>
      </div>

      {r.sellingPrice > 0 && (
        <div style={{ background: 'rgba(62,207,191,.07)', border: '1px solid rgba(62,207,191,.13)', borderRadius: 9, padding: '8px 12px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--muted2)' }}>سعر البيع: {fmt(r.sellingPrice, currency)}</span>
          <span style={{ fontWeight: 900, fontSize: 15, color: mc }}>{r.margin?.toFixed(1)}% ربح</span>
        </div>
      )}

      <button onClick={() => setExp(!exp)} style={{ background: 'none', border: 'none', color: 'var(--muted2)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Cairo,sans-serif' }}>
        <FlaskConical size={12} />{r.ingredients?.length || 0} مكوّن
        <ChevronDown size={11} style={{ transform: exp ? 'rotate(180deg)' : 'rotate(0)', transition: '.2s' }} />
      </button>

      {exp && r.ingredients?.length > 0 && (
        <div style={{ marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          {r.ingredients.map(ing => {
            const mat = materials.find(m => m.id === ing.materialId)
            return (
              <div key={ing.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 600 }}>{mat?.name || <span style={{ color: 'var(--danger)' }}>مادة محذوفة</span>}</span>
                <span style={{ color: 'var(--muted)' }}>{ing.quantity} {ing.unit}</span>
                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{fmt(ing.cost, currency)}</span>
              </div>
            )
          })}
          {r.overhead > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '5px 0', color: 'var(--info)' }}>
              <span>نفقات إضافية</span><span>{fmt(r.overhead, currency)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RecModal({ recipe, materials, onSave, onClose, currency }) {
  const [name, setName] = useState(recipe?.name || '')
  const [cat, setCat]   = useState(recipe?.category || RECIPE_CATS[0])
  const [desc, setDesc] = useState(recipe?.description || '')
  const [sp, setSp]     = useState(recipe?.sellingPrice || '')
  const [bs, setBs]     = useState(recipe?.batchSize || 1)
  const [ov, setOv]     = useState(recipe?.overhead || '')
  const [ings, setIngs] = useState(recipe?.ingredients || [])
  const [ni, setNi]     = useState({ matId: '', qty: '', unit: UNITS[0] })

  const addIng = () => {
    const mat = materials.find(m => m.id === ni.matId)
    if (!mat || !ni.qty) return
    const qty = parseFloat(ni.qty)
    setIngs(p => [...p, { id: uid(), materialId: ni.matId, quantity: qty, unit: ni.unit, cost: mat.currentUnitCost * qty }])
    setNi(p => ({ ...p, matId: '', qty: '' }))
  }

  const ingTotal = ings.reduce((s, i) => {
    const m = materials.find(x => x.id === i.materialId)
    return s + (m ? m.currentUnitCost * i.quantity : 0)
  }, 0)
  const total  = ingTotal + parseFloat(ov || 0)
  const bsN    = Math.max(1, parseInt(bs) || 1)
  const cpu    = total / bsN
  const margin = sp ? ((parseFloat(sp) - cpu) / parseFloat(sp)) * 100 : null
  const niMat  = materials.find(m => m.id === ni.matId)
  const niCost = niMat && ni.qty ? niMat.currentUnitCost * parseFloat(ni.qty) : null

  const save = () => {
    if (!name.trim() || ings.length === 0) return
    onSave({
      ...(recipe || {}), name: name.trim(), category: cat, description: desc,
      sellingPrice: parseFloat(sp) || 0, batchSize: bsN,
      overhead: parseFloat(ov) || 0, ingredients: ings
    })
  }

  return (
    <Modal title={recipe ? '✏️ تعديل الوصفة' : '➕ إضافة وصفة جديدة'} onClose={onClose} wide>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="g2">
          <div><label className="lbl">اسم المنتج / الوصفة *</label><input value={name} onChange={e => setName(e.target.value)} placeholder="مثال: كريم الوجه بالورد" /></div>
          <div><label className="lbl">الفئة</label>
            <select value={cat} onChange={e => setCat(e.target.value)}>
              {RECIPE_CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div><label className="lbl">وصف (اختياري)</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="ملاحظات عن المنتج..." /></div>

        <div className="g3">
          <div><label className="lbl">حجم الدفعة</label><input type="number" value={bs} onChange={e => setBs(e.target.value)} min={1} placeholder="1" /></div>
          <div><label className="lbl">نفقات إضافية ({currency})</label><input type="number" value={ov} onChange={e => setOv(e.target.value)} placeholder="0" min={0} step="any" /></div>
          <div><label className="lbl">سعر البيع ({currency})</label><input type="number" value={sp} onChange={e => setSp(e.target.value)} placeholder="0" min={0} step="any" /></div>
        </div>

        <hr className="hr" />
        <h4 style={{ fontSize: 14, fontWeight: 800 }}>🧪 المكونات</h4>

        {materials.length === 0 ? (
          <div style={{ background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.18)', borderRadius: 9, padding: 14, color: 'var(--danger)', fontSize: 13, textAlign: 'center' }}>
            لا توجد مواد خام — أضف مواد أولاً.
          </div>
        ) : (
          <div style={{ background: 'var(--card2)', borderRadius: 11, padding: 14, border: '1px solid var(--border2)' }}>
            <p style={{ fontSize: 12, color: 'var(--muted2)', marginBottom: 10, fontWeight: 600 }}>إضافة مكوّن</p>
            <div className="g3" style={{ marginBottom: 10 }}>
              <div><label className="lbl">المادة</label>
                <select value={ni.matId} onChange={e => setNi(p => ({ ...p, matId: e.target.value }))}>
                  <option value="">اختر...</option>
                  {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({fu4(m.currentUnitCost)}/{m.currentUnit})</option>)}
                </select>
              </div>
              <div><label className="lbl">الكمية</label><input type="number" value={ni.qty} onChange={e => setNi(p => ({ ...p, qty: e.target.value }))} placeholder="30" min="0" step="any" /></div>
              <div><label className="lbl">الوحدة</label>
                <select value={ni.unit} onChange={e => setNi(p => ({ ...p, unit: e.target.value }))}>
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            {niCost !== null && (
              <div style={{ background: 'rgba(62,207,191,.1)', borderRadius: 7, padding: '6px 10px', fontSize: 12, color: 'var(--success)', marginBottom: 10 }}>
                ✓ تكلفة هذا المكون: {fmt(niCost, currency)}
              </div>
            )}
            <button className="btn btn-o" style={{ width: '100%', justifyContent: 'center' }} onClick={addIng}><Plus size={13} />إضافة المكوّن</button>
          </div>
        )}

        {ings.length > 0 && (
          <div>
            {ings.map(ing => {
              const mat  = materials.find(m => m.id === ing.materialId)
              const cost = mat ? mat.currentUnitCost * ing.quantity : 0
              return (
                <div key={ing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 9, marginBottom: 5 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{mat?.name || <span style={{ color: 'var(--danger)' }}>مادة محذوفة</span>}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{ing.quantity} {ing.unit}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 13 }}>{fmt(cost, currency)}</span>
                    <button onClick={() => setIngs(p => p.filter(i => i.id !== ing.id))} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {ings.length > 0 && (
          <div style={{ background: 'var(--goldBg)', border: '1.5px solid rgba(232,184,109,.2)', borderRadius: 12, padding: 16 }}>
            <div className="g3" style={{ marginBottom: margin !== null ? 12 : 0 }}>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 10, color: 'var(--muted2)', marginBottom: 3 }}>تكلفة المكونات</div><div style={{ fontSize: 15, fontWeight: 900 }}>{fmt(ingTotal, currency)}</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 10, color: 'var(--muted2)', marginBottom: 3 }}>التكلفة الكلية</div><div style={{ fontSize: 15, fontWeight: 900, color: 'var(--danger)' }}>{fmt(total, currency)}</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 10, color: 'var(--muted2)', marginBottom: 3 }}>تكلفة الوحدة ÷{bsN}</div><div style={{ fontSize: 15, fontWeight: 900, color: 'var(--gold)' }}>{fmt(cpu, currency)}</div></div>
            </div>
            {margin !== null && (
              <div style={{ textAlign: 'center', paddingTop: 12, borderTop: '1px solid rgba(232,184,109,.18)' }}>
                <span style={{ fontSize: 12, color: 'var(--muted2)', marginLeft: 6 }}>هامش الربح المتوقع:</span>
                <span style={{ fontSize: 19, fontWeight: 900, color: margin > 50 ? 'var(--success)' : margin > 20 ? 'var(--gold)' : 'var(--danger)' }}>
                  {margin.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        )}

        {ings.length === 0 && <p style={{ color: 'var(--danger)', fontSize: 12, textAlign: 'center' }}>* يجب إضافة مكوّن واحد على الأقل</p>}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-g" style={{ flex: 1, justifyContent: 'center' }} onClick={save} disabled={!name.trim() || ings.length === 0}>
            <Check size={14} />{recipe ? 'حفظ التغييرات' : 'إضافة الوصفة'}
          </button>
          <button className="btn btn-o" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </Modal>
  )
}

export default function Recipes({ recipes, setRecipes, materials, currency, showToast }) {
  const [srch, setSrch]   = useState('')
  const [cat, setCat]     = useState('الكل')
  const [modal, setModal] = useState(null)
  const [conf, setConf]   = useState(null)

  const filtered = recipes.filter(r =>
    (cat === 'الكل' || r.category === cat) &&
    r.name.toLowerCase().includes(srch.toLowerCase())
  )

  const save = d => {
    if (d.id) { setRecipes(p => p.map(r => r.id === d.id ? { ...d, id: d.id } : r)); showToast('✓ تم تحديث الوصفة') }
    else       { setRecipes(p => [...p, { ...d, id: uid() }]);                         showToast('✓ تمت إضافة الوصفة') }
    setModal(null)
  }
  const del = id => { setRecipes(p => p.filter(r => r.id !== id)); setConf(null); showToast('تم حذف الوصفة', 'error') }
  const dup = r => { setRecipes(p => [...p, { ...r, id: uid(), name: `${r.name} (نسخة)` }]); showToast('✓ تم تكرار الوصفة', 'warn') }

  return (
    <div className="fu">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 3 }}>الوصفات والمنتجات</h1>
          <p style={{ color: 'var(--muted2)', fontSize: 13 }}>{recipes.length} وصفة محفوظة</p>
        </div>
        <button className="btn btn-g" onClick={() => setModal('add')} disabled={materials.length === 0}>
          <Plus size={15} />إضافة وصفة
        </button>
      </div>

      {materials.length === 0 && (
        <div style={{ background: 'rgba(232,184,109,.07)', border: '1.5px dashed rgba(232,184,109,.25)', borderRadius: 11, padding: 14, marginBottom: 18, fontSize: 13, color: 'var(--muted2)', display: 'flex', gap: 9, alignItems: 'center' }}>
          <AlertCircle size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          لإنشاء وصفات، أضف مواد خام أولاً من صفحة "المواد الخام"
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input value={srch} onChange={e => setSrch(e.target.value)} placeholder="بحث عن وصفة..." style={{ paddingRight: 38 }} />
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)} style={{ width: 'auto', minWidth: 150 }}>
          <option>الكل</option>
          {RECIPE_CATS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '52px 0', color: 'var(--muted)' }}>
          <BookOpen size={48} style={{ margin: '0 auto 14px', opacity: .22 }} />
          <p style={{ fontSize: 15 }}>{srch ? 'لا توجد وصفات تطابق البحث' : 'لا توجد وصفات بعد'}</p>
          {!srch && materials.length > 0 && <button className="btn btn-g" style={{ marginTop: 14 }} onClick={() => setModal('add')}><Plus size={14} />إضافة وصفة الآن</button>}
        </div>
      ) : (
        <div className="gal">
          {filtered.map(r => <RecCard key={r.id} r={r} currency={currency} materials={materials} onEdit={() => setModal(r)} onDel={() => setConf(r.id)} onDup={() => dup(r)} />)}
        </div>
      )}

      {modal && <RecModal recipe={modal === 'add' ? null : modal} materials={materials} onSave={save} onClose={() => setModal(null)} currency={currency} />}
      {conf   && <Confirm msg="هل أنت متأكد من حذف هذه الوصفة؟" onYes={() => del(conf)} onNo={() => setConf(null)} />}
    </div>
  )
}
