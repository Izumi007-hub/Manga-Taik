import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Filter, Loader2 } from 'lucide-react'
import { resolveGenreIds } from '../services/tagCatalog'

/**
 * Filtro de géneros por chips. No pide nada a la API hasta que el usuario
 * despliega el panel por primera vez (requisito: nunca durante la carga
 * inicial de Home). Si la resolución de tags falla, los chips quedan
 * deshabilitados pero el resto de la UI sigue funcionando con normalidad.
 *
 * @param {{label:string, en:string}[]} genres - catálogo a mostrar (SAFE_GENRES o ADULT_GENRES)
 * @param {string[]} selectedIds - UUIDs actualmente seleccionados (estado del padre)
 * @param {(ids: string[]) => void} onChange
 */
export default function GenreFilterBar({ genres, selectedIds, onChange }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nameToId, setNameToId] = useState(null) // null = todavía no se cargó
  const [loadError, setLoadError] = useState(false)
  const abortRef = useRef(null)
  const loadedOnceRef = useRef(false)

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  async function handleOpen() {
    const next = !open
    setOpen(next)

    if (next && !loadedOnceRef.current) {
      loadedOnceRef.current = true
      setLoading(true)
      setLoadError(false)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const map = await resolveGenreIds(
          genres.map((g) => g.en),
          { signal: controller.signal }
        )
        setNameToId(map)
        if (Object.keys(map).length === 0) setLoadError(true)
      } catch {
        setLoadError(true)
        setNameToId({})
      } finally {
        setLoading(false)
      }
    }
  }

  function toggleGenre(genre) {
    const id = nameToId?.[genre.en]
    if (!id) return // tag no resuelto: chip inactivo, no hace nada

    const isSelected = selectedIds.includes(id)
    const updated = isSelected
      ? selectedIds.filter((tagId) => tagId !== id)
      : [...selectedIds, id]
    onChange(updated)
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-3">
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mx-auto"
      >
        <Filter size={15} />
        Filtrar por género
        {selectedIds.length > 0 && (
          <span className="bg-brand-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {selectedIds.length}
          </span>
        )}
        <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-3 flex flex-wrap justify-center gap-2 px-2">
          {loading && (
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 size={14} className="animate-spin" /> Cargando géneros...
            </span>
          )}

          {!loading &&
            genres.map((genre) => {
              const id = nameToId?.[genre.en]
              const isSelected = id && selectedIds.includes(id)
              const disabled = !id

              return (
                <button
                  key={genre.en}
                  disabled={disabled}
                  onClick={() => toggleGenre(genre)}
                  title={disabled ? 'No disponible por el momento' : undefined}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    isSelected
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : disabled
                      ? 'border-surface-border text-gray-500 opacity-40 cursor-not-allowed'
                      : 'border-surface-border text-gray-600 dark:text-gray-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'
                  }`}
                >
                  {genre.label}
                </button>
              )
            })}

          {!loading && loadError && (
            <p className="w-full text-center text-xs text-gray-400 mt-1">
              No se pudieron cargar todos los géneros ahora mismo. Puedes seguir navegando con normalidad.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
