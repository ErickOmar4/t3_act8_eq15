import { useCallback, useEffect, useState } from 'react'

/**
 * Sincroniza un objeto de parámetros (page, limit, search, category...) con
 * la query string de la URL, para que la página se pueda compartir y el
 * botón "atrás" del navegador funcione.
 *
 * @param {Record<string, string|number>} defaults valores por defecto
 */
export function useUrlParams(defaults) {
  const readFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    const result = { ...defaults }
    for (const key of Object.keys(defaults)) {
      if (params.has(key)) {
        const raw = params.get(key)
        result[key] = typeof defaults[key] === 'number' ? Number(raw) || defaults[key] : raw
      }
    }
    return result
  }, [defaults])

  const [values, setValues] = useState(readFromUrl)

  // Botón "atrás/adelante" del navegador
  useEffect(() => {
    const onPopState = () => setValues(readFromUrl())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [readFromUrl])

  const update = useCallback((patch) => {
    setValues((prev) => {
      const next = { ...prev, ...patch }
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(next)) {
        if (value !== '' && value !== undefined && value !== null) {
          params.set(key, String(value))
        }
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.pushState({}, '', newUrl)
      return next
    })
  }, [])

  return [values, update]
}
