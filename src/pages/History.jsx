import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { getHistory, removeHistoryEntry, clearHistory } from '../utils/storage'

function formatDate(ts) {
  return new Date(ts).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function History() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  function handleRemove(mangaId) {
    setHistory(removeHistoryEntry(mangaId))
  }

  function handleClearAll() {
    if (confirm('¿Borrar todo el historial de lectura?')) {
      setHistory(clearHistory())
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Historial de lectura</h1>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-red-500 hover:underline"
          >
            Borrar todo
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p>Todavía no has leído ningún capítulo.</p>
          <Link to="/" className="text-brand-600 dark:text-brand-400 font-medium">
            Empieza a leer
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {history.map((h) => (
            <li
              key={h.mangaId}
              className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-3 card-shadow"
            >
              <Link to={`/manga/${h.mangaId}`} className="shrink-0">
                <div className="w-14 h-20 rounded overflow-hidden bg-gray-200 dark:bg-slate-700">
                  {h.cover && (
                    <img
                      src={h.cover}
                      alt={h.mangaTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/manga/${h.mangaId}`} className="font-medium text-sm hover:text-brand-600 dark:hover:text-brand-400 truncate block">
                  {h.mangaTitle}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Cap. {h.chapterLabel ?? '-'} · Página {(h.page ?? 0) + 1}
                  {h.totalPages ? ` de ${h.totalPages}` : ''}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(h.updatedAt)}</p>
              </div>

              <Link
                to={`/read/${h.mangaId}/${h.chapterId}`}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600 text-white shrink-0"
              >
                Continuar
              </Link>

              <button
                onClick={() => handleRemove(h.mangaId)}
                aria-label="Eliminar del historial"
                className="text-gray-400 hover:text-red-500 shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
