import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ArrowLeft } from 'lucide-react'
import ChapterList from '../components/ChapterList'
import { getMangaById, getMangaChapters } from '../services/mangadex'
import { isFavorite, toggleFavorite, getHistoryForManga } from '../utils/storage'

export default function Manga() {
  const { id } = useParams()
  const [manga, setManga] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fav, setFav] = useState(false)
  const [historyEntry, setHistoryEntry] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [mangaData, chapterData] = await Promise.all([
          getMangaById(id),
          getMangaChapters(id)
        ])
        if (cancelled) return
        setManga(mangaData)
        setChapters(chapterData)
        setFav(isFavorite(id))
        setHistoryEntry(getHistoryForManga(id))
      } catch (err) {
        if (!cancelled) setError(err.message || 'No se pudo cargar la información del manga.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  function handleToggleFavorite() {
    if (!manga) return
    toggleFavorite(manga)
    setFav((prev) => !prev)
  }

  if (loading) {
    return <p className="text-center py-16 text-gray-500 dark:text-gray-400">Cargando manga...</p>
  }

  if (error || !manga) {
    return <p className="text-center py-16 text-red-500">{error || 'Manga no encontrado.'}</p>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 mb-4">
        <ArrowLeft size={16} /> Volver
      </Link>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-40 sm:w-52 shrink-0 mx-auto sm:mx-0">
          <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-800">
            {manga.cover ? (
              <img
                src={manga.cover}
                alt={manga.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                Sin portada
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{manga.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Autor: {manga.author} {manga.year ? `• ${manga.year}` : ''} {manga.status ? `• ${manga.status}` : ''}
          </p>

          {manga.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {manga.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-brand-100 dark:bg-slate-800 text-brand-700 dark:text-brand-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {manga.description || 'Sin descripción disponible.'}
          </p>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleToggleFavorite}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                fav
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-200'
              }`}
            >
              <Heart size={16} className={fav ? 'fill-white' : ''} />
              {fav ? 'En favoritos' : 'Añadir a favoritos'}
            </button>

            {historyEntry && (
              <Link
                to={`/read/${manga.id}/${historyEntry.chapterId}`}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-600 text-white"
              >
                Continuar leyendo
              </Link>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-3">Capítulos ({chapters.length})</h2>
      <ChapterList
        mangaId={manga.id}
        chapters={chapters}
        lastReadChapterId={historyEntry?.chapterId}
      />
    </div>
  )
}
