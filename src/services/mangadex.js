import { smartFetchJson } from './smartFetch'

// Antes se llamaba directo a la API pública de MangaDex (https://api.mangadex.org),
// pero eso causaba bloqueos CORS desde GitHub Pages. Ahora todas las peticiones
// pasan por el Cloudflare Worker propio, que actúa de proxy y añade las
// cabeceras CORS necesarias.
// Documentación oficial de la API que el worker reenvía: https://api.mangadex.org/docs/
const API_BASE = 'https://mangataik-proxy.torresizumi1.workers.dev'
const UPLOADS_BASE = 'https://uploads.mangadex.org'

/**
 * Construye una URL de la API de MangaDex, serializando arrays con el
 * formato `clave[]=valor1&clave[]=valor2` que la API exige.
 */
function buildUrl(path, params = {}) {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(`${key}[]`, item))
    } else {
      search.append(key, value)
    }
  })

  const qs = search.toString()
  return `${API_BASE}${path}${qs ? `?${qs}` : ''}`
}

/**
 * Extrae el título y la descripción "planos" del objeto attributes de MangaDex,
 * priorizando español > inglés > el primer idioma disponible.
 */
function pickLocalized(obj = {}) {
  if (!obj) return ''
  return obj.es || obj['es-la'] || obj.en || Object.values(obj)[0] || ''
}

/**
 * Construye la URL de la portada a partir de las relaciones incluidas en la respuesta.
 */
function buildCoverUrl(manga) {
  const coverRel = manga.relationships?.find((r) => r.type === 'cover_art')
  const fileName = coverRel?.attributes?.fileName
  if (!fileName) return null
  // .256.jpg genera un thumbnail liviano; usar sin sufijo para tamaño completo
  return `${UPLOADS_BASE}/covers/${manga.id}/${fileName}.256.jpg`
}

/**
 * Normaliza un objeto "manga" crudo de la API a un formato simple para la UI.
 * (Mismo formato de salida que antes: no rompe componentes existentes.)
 */
function normalizeManga(manga) {
  const attrs = manga.attributes || {}
  const authorRel = manga.relationships?.find((r) => r.type === 'author')
  return {
    id: manga.id,
    title: pickLocalized(attrs.title),
    description: pickLocalized(attrs.description),
    status: attrs.status,
    year: attrs.year,
    tags: (attrs.tags || []).map((t) => pickLocalized(t.attributes?.name)).filter(Boolean),
    author: authorRel?.attributes?.name || 'Desconocido',
    cover: buildCoverUrl(manga)
  }
}

/**
 * Busca mangas por título.
 * @param {string} title
 * @param {number} limit
 */
export async function searchManga(title, limit = 20) {
  const url = buildUrl('/manga', {
    title,
    limit,
    includes: ['cover_art', 'author'],
    'order[relevance]': 'desc',
    contentRating: ['safe', 'suggestive']
  })
  const data = await smartFetchJson(url)
  return data.data.map(normalizeManga)
}

/**
 * Lista mangas populares (usado en la Home cuando no hay búsqueda activa).
 */
export async function getPopularManga(limit = 20) {
  const url = buildUrl('/manga', {
    limit,
    includes: ['cover_art', 'author'],
    'order[followedCount]': 'desc',
    contentRating: ['safe', 'suggestive']
  })
  const data = await smartFetchJson(url)
  return data.data.map(normalizeManga)
}

/**
 * Obtiene el detalle de un manga por id.
 */
export async function getMangaById(id) {
  const url = buildUrl(`/manga/${id}`, { includes: ['cover_art', 'author'] })
  const data = await smartFetchJson(url)
  return normalizeManga(data.data)
}

/**
 * Lista los capítulos de un manga (ordenados ascendentemente), filtrando
 * por idioma para evitar duplicados de otros idiomas.
 */
export async function getMangaChapters(id, lang = 'es') {
  const results = []
  let offset = 0
  const limit = 100
  let total = Infinity

  while (offset < total) {
    const url = buildUrl(`/manga/${id}/feed`, {
      limit,
      offset,
      translatedLanguage: [lang, 'es-la', 'en'],
      'order[chapter]': 'asc',
      contentRating: ['safe', 'suggestive']
    })
    const data = await smartFetchJson(url)
    results.push(...data.data)
    total = data.total
    offset += limit
    if (data.data.length === 0) break
  }

  // Si no hay nada en español, nos quedamos con lo que haya (inglés, etc.)
  const preferred = results.filter((c) =>
    ['es', 'es-la'].includes(c.attributes.translatedLanguage)
  )
  const source = preferred.length > 0 ? preferred : results

  return source
    .map((c) => ({
      id: c.id,
      chapter: c.attributes.chapter,
      title: c.attributes.title,
      volume: c.attributes.volume,
      language: c.attributes.translatedLanguage,
      publishAt: c.attributes.publishAt,
      pages: c.attributes.pages
    }))
    .sort((a, b) => parseFloat(a.chapter || 0) - parseFloat(b.chapter || 0))
}

/**
 * Obtiene las URLs de las páginas de un capítulo listas para mostrar.
 */
export async function getChapterPages(chapterId) {
  const url = buildUrl(`/at-home/server/${chapterId}`)
  const data = await smartFetchJson(url)
  const { baseUrl, chapter } = data
  return chapter.data.map((fileName) => `${baseUrl}/data/${chapter.hash}/${fileName}`)
}
