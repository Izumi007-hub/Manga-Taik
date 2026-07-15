import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Loader2 } from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce'
import { getSuggestions } from '../services/mangadex'
import { SAFE_CONTENT_RATINGS } from '../data/genres'

/**
 * Caché de sugerencias en memoria (dura mientras la pestaña esté abierta).
 * Vive fuera del componente para sobrevivir a remontajes del componente
 * dentro de la misma sesión (ej. si el usuario navega y vuelve a Home).
 * Clave: `${contentRating.join(',')}::${term}` para no mezclar resultados
 * del catálogo general con los de la zona +18.
 */
const suggestionsCache = new Map()

export default function SearchBar({ onSearch, initialValue = '', contentRating = SAFE_CONTENT_RATINGS }) {
  const [value, setValue] = useState(initialValue)
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const debouncedValue = useDebounce(value, 400)
  const abortRef = useRef(null)
  const navigate = useNavigate()
  const containerRef = useRef(null)

  // Cierra el dropdown al hacer click fuera del componente
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const term = debouncedValue.trim()

    if (term.length < 2) {
      setSuggestions([])
      setLoadingSuggestions(false)
      return
    }

    const cacheKey = `${contentRating.join(',')}::${term.toLowerCase()}`
    const cached = suggestionsCache.get(cacheKey)
    if (cached) {
      setSuggestions(cached)
      return
    }

    // Cancela cualquier petición de sugerencias anterior que siga en vuelo
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoadingSuggestions(true)

    getSuggestions(term, { limit: 6, contentRating, signal: controller.signal })
      .then((results) => {
        if (controller.signal.aborted) return // respuesta obsoleta: se descarta
        suggestionsCache.set(cacheKey, results)
        setSuggestions(results)
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        // Fallo silencioso: el autocompletado es un extra, no debe romper la búsqueda normal
        setSuggestions([])
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingSuggestions(false)
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  function handleSubmit(e) {
    e.preventDefault()
    setShowDropdown(false)
    onSearch(value.trim())
  }

  function handleClear() {
    setValue('')
    setSuggestions([])
    onSearch('')
  }

  function handleSelectSuggestion(manga) {
    setShowDropdown(false)
    setValue(manga.title)
    navigate(`/manga/${manga.id}`)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit}>
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Buscar manga por título..."
          className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-300 dark:border-slate-700
                     bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {showDropdown && (loadingSuggestions || suggestions.length > 0) && (
        <div className="absolute z-40 mt-1 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
          {loadingSuggestions && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400">
              <Loader2 size={14} className="animate-spin" /> Buscando...
            </div>
          )}

          {!loadingSuggestions &&
            suggestions.map((manga) => (
              <button
                key={manga.id}
                onClick={() => handleSelectSuggestion(manga)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-brand-50 dark:hover:bg-slate-700 text-left transition-colors"
              >
                <div className="w-8 h-11 shrink-0 rounded overflow-hidden bg-gray-200 dark:bg-slate-700">
                  {manga.cover && (
                    <img
                      src={manga.cover}
                      alt={manga.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <span className="text-sm font-medium line-clamp-1">{manga.title}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
