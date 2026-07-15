import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowLeft, List } from 'lucide-react'
import { nextPageIndex, prevPageIndex, readingProgress, chapterLabel } from '../utils/reader'

export default function Reader({
  mangaId,
  pages,
  currentIndex,
  onChangeIndex,
  chapter,
  onPrevChapter,
  onNextChapter,
  hasPrevChapter,
  hasNextChapter
}) {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)

  const goNext = useCallback(() => {
    const next = nextPageIndex(currentIndex, pages.length)
    if (next !== null) {
      setLoaded(false)
      onChangeIndex(next)
    } else if (hasNextChapter) {
      onNextChapter()
    }
  }, [currentIndex, pages.length, onChangeIndex, hasNextChapter, onNextChapter])

  const goPrev = useCallback(() => {
    const prev = prevPageIndex(currentIndex)
    if (prev !== null) {
      setLoaded(false)
      onChangeIndex(prev)
    } else if (hasPrevChapter) {
      onPrevChapter()
    }
  }, [currentIndex, onChangeIndex, hasPrevChapter, onPrevChapter])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  const progress = readingProgress(currentIndex, pages.length)

  return (
    <div className="reader-container pb-16">
      <div className="reader-toolbar">
        <button onClick={() => navigate(`/manga/${mangaId}`)} className="flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Volver</span>
        </button>

        <span className="text-sm font-medium truncate max-w-[45vw]">{chapterLabel(chapter)}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/manga/${mangaId}`)}
            aria-label="Lista de capítulos"
            className="p-1.5"
          >
            <List size={18} />
          </button>
          <span className="text-xs text-gray-300">
            {currentIndex + 1}/{pages.length}
          </span>
        </div>
      </div>

      <div className="relative w-full flex justify-center mt-2">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm py-20">
            Cargando página...
          </div>
        )}
        {pages[currentIndex] && (
          <img
            key={pages[currentIndex]}
            src={pages[currentIndex]}
            alt={`Página ${currentIndex + 1}`}
            className="reader-page"
            referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)}
          />
        )}

        {/* Zonas de click izquierda/derecha para pasar de página */}
        <button
          onClick={goPrev}
          aria-label="Página anterior"
          className="absolute left-0 top-0 h-full w-1/3 opacity-0"
        />
        <button
          onClick={goNext}
          aria-label="Página siguiente"
          className="absolute right-0 top-0 h-full w-1/3 opacity-0"
        />
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0 && !hasPrevChapter}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-800 text-white text-sm disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Anterior
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === pages.length - 1 && !hasNextChapter}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm disabled:opacity-40"
        >
          Siguiente <ChevronRight size={16} />
        </button>
      </div>

      <div className="reader-progress" style={{ width: `${progress}%` }} />
    </div>
  )
}
