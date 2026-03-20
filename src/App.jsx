import { useState, useMemo } from 'react'
import { FlaskConical, Menu, Download } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Materials from './components/Materials'
import Recipes from './components/Recipes'
import SettingsPage from './components/SettingsPage'
import Toast from './components/ui/Toast'
import InstallBanner from './components/ui/InstallBanner'
import { useLS } from './hooks/useLS'
import { usePWA } from './hooks/usePWA'

export default function App() {
  const [page,      setPage]      = useState('dashboard')
  const [materials, setMaterials] = useLS('advax-materials', [])
  const [recipes,   setRecipes]   = useLS('advax-recipes',   [])
  const [currency,  setCurrency]  = useLS('advax-currency',  'SAR')
  const [sbOpen,    setSbOpen]    = useState(false)
  const [toast,     setToast]     = useState(null)
  const { installPrompt, isInstalled, isIOS, install } = usePWA()

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  // ✨ Reactive cost engine
  const recipesWithCosts = useMemo(() => recipes.map(recipe => {
    const ingredients = (recipe.ingredients || []).map(ing => {
      const mat = materials.find(m => m.id === ing.materialId)
      return { ...ing, cost: mat ? mat.currentUnitCost * ing.quantity : 0 }
    })
    const ingTotal = ingredients.reduce((s, i) => s + i.cost, 0)
    const total    = ingTotal + (recipe.overhead || 0)
    const bs       = Math.max(1, recipe.batchSize || 1)
    const cpu      = total / bs
    const margin   = recipe.sellingPrice > 0
      ? ((recipe.sellingPrice - cpu) / recipe.sellingPrice) * 100
      : null
    return { ...recipe, ingredients, totalCost: total, costPerUnit: cpu, margin }
  }), [recipes, materials])

  const common = { currency, showToast }

  // Show install button in header if prompt is available and not installed
  const showInstallBtn = !isInstalled && (installPrompt || isIOS)

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'var(--bg)', color: 'var(--text)',
      fontFamily: "'Cairo', sans-serif", direction: 'rtl'
    }}>
      <Sidebar page={page} setPage={setPage} open={sbOpen} setOpen={setSbOpen} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Header */}
        <header style={{
          padding: '13px 16px', borderBottom: '1.5px solid var(--border)',
          background: 'var(--surf)', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexShrink: 0, gap: 10
        }}>
          <button
            onClick={() => setSbOpen(true)}
            style={{ background: 'rgba(255,255,255,.06)', border: 'none', color: 'var(--muted2)', cursor: 'pointer', padding: '7px 9px', borderRadius: 8, display: 'flex', flexShrink: 0 }}
          >
            <Menu size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, justifyContent: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#E8B86D,#F5CC80)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FlaskConical size={17} color="#06060F" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--gold)', whiteSpace: 'nowrap' }}>AdVax Studio</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Install button in header */}
            {showInstallBtn && !isIOS && (
              <button onClick={install} style={{
                background: 'linear-gradient(135deg,#E8B86D,#F5CC80)',
                border: 'none', borderRadius: 8, padding: '6px 12px',
                fontWeight: 800, fontSize: 12, color: '#08081A',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                fontFamily: 'Cairo,sans-serif'
              }}>
                <Download size={13} /> تثبيت
              </button>
            )}
            <span style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--card2)', padding: '4px 10px', borderRadius: 20, border: '1px solid var(--border)' }}>
              {currency}
            </span>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, overflow: 'auto', padding: '22px 16px' }}>
          {page === 'dashboard' && (
            <Dashboard materials={materials} recipes={recipesWithCosts} currency={currency} setPage={setPage} />
          )}
          {page === 'materials' && (
            <Materials materials={materials} setMaterials={setMaterials} {...common} />
          )}
          {page === 'recipes' && (
            <Recipes recipes={recipesWithCosts} setRecipes={setRecipes} materials={materials} {...common} />
          )}
          {page === 'settings' && (
            <SettingsPage
              currency={currency} setCurrency={setCurrency}
              materials={materials} setMaterials={setMaterials}
              recipes={recipes} setRecipes={setRecipes}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* PWA install banner (bottom of screen) */}
      <InstallBanner />

      <Toast t={toast} />
    </div>
  )
}
