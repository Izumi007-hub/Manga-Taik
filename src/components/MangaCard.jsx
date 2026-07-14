import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function MangaCard({ manga, isFav, onToggleFavorite, progressLabel }) {
  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow card-shadow hover:-translate-y-1 transition-transform duration-200">
      <Link to={`/manga/${manga.id}`}>
        <div className="aspect-[2/3] bg-gray-200 dark:bg-slate-700 overflow-hidden">
          {manga.cover ? (
            <img
              src={manga.cover}
              alt={manga.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sin portada
            </div>
          )}
        </div>
      </Link>

      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(manga)}
          aria-label="Favorito"
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <Heart
            size={16}
            className={isFav ? 'fill-red-500 text-red-500' : 'text-white'}
          />
        </button>
      )}

      <div className="p-2.5">
        <Link to={`/manga/${manga.id}`}>
          <h3 className="text-sm font-semibold line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400">
            {manga.title}
          </h3>
        </Link>
        {progressLabel && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{progressLabel}</p>
        )}
      </div>
    </div>
  )
}
