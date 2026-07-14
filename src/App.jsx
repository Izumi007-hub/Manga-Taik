import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Manga from './pages/Manga'
import Read from './pages/Read'
import Favorites from './pages/Favorites'
import History from './pages/History'
import { getTheme, setTheme } from './utils/storage'

export default function App() {
  const [darkMode, setDarkMode] = useState(getTheme() === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    setTheme(darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="min-h-screen">
      <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manga/:id" element={<Manga />} />
        <Route path="/read/:mangaId/:chapterId" element={<Read />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/history" element={<History />} />
        <Route
          path="*"
          element={
            <p className="text-center py-16 text-gray-500 dark:text-gray-400">
              Página no encontrada.
            </p>
          }
        />
      </Routes>
    </div>
  )
}
