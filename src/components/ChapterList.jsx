import { Link } from 'react-router-dom'
import { chapterLabel } from '../utils/reader'
import { BookOpenCheck } from 'lucide-react'

export default function ChapterList({ mangaId, chapters, lastReadChapterId }) {
  if (!chapters || chapters.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No se encontraron capítulos disponibles para este manga.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-slate-700 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
      {chapters.map((ch) => {
        const isRead = ch.id === lastReadChapterId
        return (
          <li key={ch.id}>
            <Link
              to={`/read/${mangaId}/${ch.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-sm font-medium flex items-center gap-2">
                {isRead && <BookOpenCheck size={15} className="text-brand-500" />}
                {chapterLabel(ch)}
              </span>
              <span className="text-xs text-gray-400">
                {ch.language?.toUpperCase()}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
