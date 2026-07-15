import { useEffect, useState, useCallback } from 'react'
import SearchBar from '../components/SearchBar'
import MangaCard from '../components/MangaCard'
import GenreFilterBar from '../components/GenreFilterBar'
import { searchManga, getPopularManga } from '../services/mangadex'
import { getFavorites, toggleFavorite } from '../utils/storage'
import { SAFE_GENRES } from '../data/genres'

export default function Home() {
  const [mangas, setMangas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [activeTagIds, setActiveTagIds] = useState([])
  const [favorites, setFavorites] = useState(getFavorites())

  // Única función de consulta: cubre carga inicial, búsqueda y filtros de
  // género con el mismo código, para no duplicar peticiones ni lógica.
  const runQuery = useCallback(async (term, tagIds) => {
    setLoading(true)
    setError(null)
    try {
      const data = term
        ? await searchManga(term, { limit: 24, includedTags: tagIds })
        : await getPopularManga({ limit: 24, includedTags: tagIds })
      setMangas(data)
    } catch (err) {
      setError(err.message || 'No se pudo cargar el catálogo. Intenta de nuevo más tarde.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Única petición principal al abrir Home (sin término de búsqueda ni filtros).
  useEffect(() => {
    runQuery('', [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearch(term) {
    setQuery(term)
    runQuery(term, activeTagIds)
  }

  function handleGenreChange(tagIds) {
    setActiveTagIds(tagIds)
    runQuery(query, tagIds)
  }

  function handleToggleFavorite(manga) {
    const updated = toggleFavorite(manga)
    setFavorites(updated)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-1">Descubre tu próximo manga</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
        Datos proporcionados por MangaDex
      </p>

      <SearchBar onSearch={handleSearch} initialValue={query} />
      <GenreFilterBar genres={SAFE_GENRES} selectedIds={activeTagIds} onChange={handleGenreChange} />

      <div className="mt-8">
        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400">Cargando...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && mangas.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No se encontraron resultados{query ? ` para "${query}"` : ''}.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mangas.map((manga) => (
            <MangaCard
              key={manga.id}
              manga={manga}
              isFav={favorites.some((f) => f.id === manga.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
