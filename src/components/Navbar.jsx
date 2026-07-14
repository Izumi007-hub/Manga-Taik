import { Link, NavLink } from 'react-router-dom'
import { Moon, Sun, BookOpen, Heart, History as HistoryIcon, Home as HomeIcon } from 'lucide-react'

const linkClass = ({ isActive }) =>
  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-gray-600 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-slate-800'
  }`

export default function Navbar({ darkMode, onToggleDark }) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-brand-600 dark:text-brand-400">
          <BookOpen size={22} />
          Manga Reader
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            <HomeIcon size={16} />
            <span className="hidden sm:inline">Inicio</span>
          </NavLink>
          <NavLink to="/favorites" className={linkClass}>
            <Heart size={16} />
            <span className="hidden sm:inline">Favoritos</span>
          </NavLink>
          <NavLink to="/history" className={linkClass}>
            <HistoryIcon size={16} />
            <span className="hidden sm:inline">Historial</span>
          </NavLink>

          <button
            onClick={onToggleDark}
            aria-label="Cambiar tema"
            className="ml-1 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </div>
    </header>
  )
}
