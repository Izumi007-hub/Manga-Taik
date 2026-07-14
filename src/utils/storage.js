const FAVORITES_KEY = 'favorites'
const HISTORY_KEY = 'history'
const THEME_KEY = 'theme'

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

/* ---------------- Favoritos ---------------- */

export function getFavorites() {
  return safeParse(localStorage.getItem(FAVORITES_KEY), [])
}

export function isFavorite(mangaId) {
  return getFavorites().some((m) => m.id === mangaId)
}

export function toggleFavorite(manga) {
  const favorites = getFavorites()
  const exists = favorites.some((m) => m.id === manga.id)
  const updated = exists
    ? favorites.filter((m) => m.id !== manga.id)
    : [...favorites, manga]

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  return updated
}

/* ---------------- Historial ---------------- */

export function getHistory() {
  return safeParse(localStorage.getItem(HISTORY_KEY), [])
}

/**
 * Guarda / actualiza el progreso de lectura de un manga.
 * entry: { mangaId, mangaTitle, cover, chapterId, chapterLabel, page, updatedAt }
 */
export function saveHistoryEntry(entry) {
  const history = getHistory()
  const filtered = history.filter((h) => h.mangaId !== entry.mangaId)
  const updated = [{ ...entry, updatedAt: Date.now() }, ...filtered].slice(0, 100)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  return updated
}

export function getHistoryForManga(mangaId) {
  return getHistory().find((h) => h.mangaId === mangaId) || null
}

export function clearHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]))
  return []
}

export function removeHistoryEntry(mangaId) {
  const updated = getHistory().filter((h) => h.mangaId !== mangaId)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  return updated
}

/* ---------------- Tema ---------------- */

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark'
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
}
