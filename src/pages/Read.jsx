import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Reader from '../components/Reader'
import { getMangaById, getMangaChapters, getChapterPages } from '../services/mangadex'
import { saveHistoryEntry, getHistoryForManga } from '../utils/storage'
import { getNextChapter, getPrevChapter } from '../utils/reader'

export default function Read() {
  const { mangaId, chapterId } = useParams()
  const navigate = useNavigate()

  const [manga, setManga] = useState(null)
  const [chapters, setChapters] = useState([])
  const [pages, setPages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const currentChapter = chapters.find((c) => c.id === chapterId)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [mangaData, chapterList, chapterPages] = await Promise.all([
          getMangaById(mangaId),
          getMangaChapters(mangaId),
          getChapterPages(chapterId)
        ])
        if (cancelled) return

        setManga(mangaData)
        setChapters(chapterList)
        setPages(chapterPages)

        // Reanudar en la página guardada si corresponde a este mismo capítulo
        const prevEntry = getHistoryForManga(mangaId)
        if (prevEntry && prevEntry.chapterId === chapterId && typeof prevEntry.page === 'number') {
          setCurrentIndex(Math.min(prevEntry.page, chapterPages.length - 1))
        } else {
          setCurrentIndex(0)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'No se pudo cargar el capítulo. Intenta de nuevo.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [mangaId, chapterId])

  // Guardar progreso cada vez que cambia la página actual
  useEffect(() => {
    if (!manga || !currentChapter || pages.length === 0) return
    saveHistoryEntry({
      mangaId: manga.id,
      mangaTitle: manga.title,
      cover: manga.cover,
      chapterId: currentChapter.id,
      chapterLabel: currentChapter.chapter,
      page: currentIndex,
      totalPages: pages.length
    })
  }, [currentIndex, manga, currentChapter, pages.length])

  const handleChangeIndex = useCallback((idx) => setCurrentIndex(idx), [])

  const handleNextChapter = useCallback(() => {
    const next = getNextChapter(chapters, chapterId)
    if (next) navigate(`/read/${mangaId}/${next.id}`)
  }, [chapters, chapterId, mangaId, navigate])

  const handlePrevChapter = useCallback(() => {
    const prev = getPrevChapter(chapters, chapterId)
    if (prev) navigate(`/read/${mangaId}/${prev.id}`)
  }, [chapters, chapterId, mangaId, navigate])

  if (loading) {
    return <p className="text-center py-16 text-gray-300">Cargando capítulo...</p>
  }

  if (error) {
    return <p className="text-center py-16 text-red-500">{error}</p>
  }

  return (
    <Reader
      mangaId={mangaId}
      pages={pages}
      currentIndex={currentIndex}
      onChangeIndex={handleChangeIndex}
      chapter={currentChapter}
      onNextChapter={handleNextChapter}
      onPrevChapter={handlePrevChapter}
      hasNextChapter={!!getNextChapter(chapters, chapterId)}
      hasPrevChapter={!!getPrevChapter(chapters, chapterId)}
    />
  )
}
