import { useState, useEffect } from 'react'

export function useLS(key, init) {
  const [v, sv] = useState(() => {
    try {
      const s = localStorage.getItem(key)
      return s ? JSON.parse(s) : init
    } catch {
      return init
    }
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(v))
  }, [v, key])
  return [v, sv]
}
