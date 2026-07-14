/**
 * Devuelve el índice de la siguiente página, o null si ya es la última.
 */
export function nextPageIndex(currentIndex, totalPages) {
  const next = currentIndex + 1
  return next < totalPages ? next : null
}

/**
 * Devuelve el índice de la página anterior, o null si ya es la primera.
 */
export function prevPageIndex(currentIndex) {
  const prev = currentIndex - 1
  return prev >= 0 ? prev : null
}

/**
 * Dado un capítulo actual y la lista completa de capítulos (ordenada asc),
 * devuelve el siguiente capítulo, o null si es el último.
 */
export function getNextChapter(chapters, currentChapterId) {
  const idx = chapters.findIndex((c) => c.id === currentChapterId)
  if (idx === -1 || idx === chapters.length - 1) return null
  return chapters[idx + 1]
}

/**
 * Dado un capítulo actual y la lista completa de capítulos (ordenada asc),
 * devuelve el capítulo anterior, o null si es el primero.
 */
export function getPrevChapter(chapters, currentChapterId) {
  const idx = chapters.findIndex((c) => c.id === currentChapterId)
  if (idx <= 0) return null
  return chapters[idx - 1]
}

/**
 * Calcula el porcentaje de progreso de lectura (0-100) dentro de un capítulo.
 */
export function readingProgress(currentIndex, totalPages) {
  if (!totalPages) return 0
  return Math.min(100, Math.round(((currentIndex + 1) / totalPages) * 100))
}

/**
 * Etiqueta legible para un capítulo, ej: "Cap. 12 - El comienzo"
 */
export function chapterLabel(chapter) {
  if (!chapter) return ''
  const num = chapter.chapter ? `Cap. ${chapter.chapter}` : 'Extra'
  return chapter.title ? `${num} - ${chapter.title}` : num
}
