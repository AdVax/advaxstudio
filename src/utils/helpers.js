export const uid   = () => Math.random().toString(36).slice(2, 9)
export const fmt   = (n, c = 'SAR') => `${(+n || 0).toFixed(2)} ${c}`
export const fu4   = (n) => (+n || 0).toFixed(4)
export const today = () => new Date().toISOString().slice(0, 10)

export const MATERIAL_CATS = ['زيوت وشموع', 'عطور', 'زهور', 'تغليف', 'مكونات جافة', 'كيماويات', 'أخرى']
export const RECIPE_CATS   = ['مستحضرات تجميل', 'باقات ورد', 'عطور', 'شموع', 'طعام وحلويات', 'هدايا', 'أخرى']
export const UNITS         = ['غ', 'مل', 'كغ', 'لتر', 'قطعة', 'ملعقة ص', 'ملعقة ك']
export const CURRENCIES    = [
  { code: 'SAR', name: 'ريال سعودي',    sym: 'ر.س' },
  { code: 'AED', name: 'درهم إماراتي',  sym: 'د.إ' },
  { code: 'KWD', name: 'دينار كويتي',   sym: 'د.ك' },
  { code: 'USD', name: 'دولار أمريكي',  sym: '$'   },
  { code: 'EUR', name: 'يورو',           sym: '€'   },
]
