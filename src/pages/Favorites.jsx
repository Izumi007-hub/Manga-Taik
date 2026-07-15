import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MangaCard from '../components/MangaCard'
import { getFavorites, toggleFavorite } from '../utils/storage'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])

  function handleToggleFavorite(manga) {
    const updated = toggleFavorite(manga)
    setFavorites(updated)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis favoritos</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p>Aún no tienes mangas favoritos.</p>
          <Link to="/" className="text-brand-600 dark:text-brand-400 font-medium">
            Explora el catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {favorites.map((manga) => (
            <MangaCard
              key={manga.id}
              manga={manga}
              isFav={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}
