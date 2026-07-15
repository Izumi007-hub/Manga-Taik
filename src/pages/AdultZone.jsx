import { useCallback, useEffect, useState } from 'react'
import AdultGate from '../components/AdultGate'
import GenreFilterBar from '../components/GenreFilterBar'
import MangaCard from '../components/MangaCard'
import SearchBar from '../components/SearchBar'
import { getPopularManga, searchManga } from '../services/mangadex'
import { ADULT_GENRES, ADULT_CONTENT_RATINGS } from '../data/genres'
import { getFavorites, toggleFavorite, isAdultConfirmed } from '../utils/storage'

export default function AdultZone() {
  const [unlocked, setUnlocked] = useState(isAdultConfirmed())
  const [mangas, setMangas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [activeTagIds, setActiveTagIds] = useState([])
  const [favorites, setFavorites] = useState(getFavorites())

  const runQuery = useCallback(async (term, tagIds) => {
    setLoading(true)
    setError(null)
    try {
      const data = term
        ? await searchManga(term, { limit: 24, includedTags: tagIds, contentRating: ADULT_CONTENT_RATINGS })
        : await getPopularManga({ limit: 24, includedTags: tagIds, contentRating: ADULT_CONTENT_RATINGS })
      setMangas(data)
    } catch (err) {
      setError(err.message || 'No se pudo cargar el catálogo. Intenta de nuevo más tarde.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Única petición principal de esta página, y solo después de pasar el gate.
  useEffect(() => {
    if (unlocked) runQuery('', [])
  }, [unlocked, runQuery])

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

  if (!unlocked) {
    return <AdultGate onConfirm={() => setUnlocked(true)} />
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white">+18</span>
        <h1 className="text-2xl font-bold text-center">Zona para adultos</h1>
      </div>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
        Contenido explícito. Separado del catálogo principal.
      </p>

      <SearchBar onSearch={handleSearch} initialValue={query} />
      <GenreFilterBar genres={ADULT_GENRES} selectedIds={activeTagIds} onChange={handleGenreChange} />

      <div className="mt-8">
        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400">Cargando...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && mangas.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No se encontraron resultados.
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
