/**
 * Lista curada de géneros a mostrar como filtros. `en` debe coincidir
 * EXACTAMENTE (sin distinguir mayúsculas/minúsculas) con el nombre en inglés
 * que MangaDex usa para ese tag en /manga/tag — es el único idioma que
 * garantizamos que existe para todos los tags.
 *
 * Si algún nombre no calza (p. ej. MangaDex lo renombra en el futuro),
 * tagCatalog.js simplemente no resuelve un id para ese género: el chip
 * queda inactivo/deshabilitado, pero el resto de la app sigue funcionando
 * con normalidad (ver requisito de "filtros opcionales, nunca bloqueantes").
 */

export const SAFE_GENRES = [
  { label: 'Acción', en: 'Action' },
  { label: 'Aventura', en: 'Adventure' },
  { label: 'Comedia', en: 'Comedy' },
  { label: 'Drama', en: 'Drama' },
  { label: 'Fantasía', en: 'Fantasy' },
  { label: 'Horror', en: 'Horror' },
  { label: 'Misterio', en: 'Mystery' },
  { label: 'Romance', en: 'Romance' },
  { label: 'Ciencia Ficción', en: 'Sci-Fi' },
  { label: 'Slice of Life', en: 'Slice of Life' },
  { label: 'Deportes', en: 'Sports' },
  { label: 'Sobrenatural', en: 'Supernatural' },
  { label: "Boys' Love (BL)", en: "Boys' Love" },
  { label: "Girls' Love (GL)", en: "Girls' Love" }
]

/**
 * Géneros disponibles dentro de la zona +18 (además del filtro de
 * contentRating, que es el que hace el trabajo pesado de separar el
 * contenido explícito — ver ADULT_CONTENT_RATINGS más abajo).
 */
export const ADULT_GENRES = [
  { label: 'Ecchi', en: 'Ecchi' },
  { label: "Boys' Love (BL)", en: "Boys' Love" },
  { label: "Girls' Love (GL)", en: "Girls' Love" }
]

/**
 * contentRating que usa el catálogo general (Home, búsqueda, favoritos, historial).
 */
export const SAFE_CONTENT_RATINGS = ['safe', 'suggestive']

/**
 * contentRating exclusivo de la zona +18.
 */
export const ADULT_CONTENT_RATINGS = ['erotica', 'pornographic']
