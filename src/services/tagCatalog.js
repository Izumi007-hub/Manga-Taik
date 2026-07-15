import { fetchTagList } from './mangadex'

/**
 * tagCatalog.js: resuelve nombres de género (en inglés) contra los UUIDs
 * reales que expone MangaDex en /manga/tag, y cachea el resultado en
 * localStorage para no volver a pedirlo en cada visita.
 *
 * Reglas de diseño (por requisito explícito del proyecto):
 *  - NUNCA se llama automáticamente al cargar la Home. Solo se dispara
 *    cuando el usuario abre o usa los filtros por primera vez.
 *  - Si la petición falla (red caída, Worker caído, etc.), nunca se lanza
 *    un error hacia arriba: se devuelve un catálogo vacío y los filtros
 *    quedan inactivos, pero el resto de la app sigue funcionando.
 *  - Si un nombre pedido no aparece en la caché (porque MangaDex renombró
 *    o agregó un tag después de que se generó la caché), se dispara UNA
 *    regeneración automática antes de rendirse.
 */

const CACHE_KEY = 'mangadex_tag_catalog_v1'
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 días

function normalizeName(name = '') {
  return name.trim().toLowerCase()
}

/**
 * Lee la caché de localStorage. Por defecto respeta el TTL (devuelve null
 * si expiró); con ignoreTTL:true devuelve la caché aunque esté vencida
 * (se usa como último recurso si falla un refetch).
 */
function readCache({ ignoreTTL = false } = {}) {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.index) return null

    const isExpired = Date.now() - parsed.fetchedAt > CACHE_TTL_MS
    if (isExpired && !ignoreTTL) return null

    return parsed.index
  } catch {
    return null
  }
}

function writeCache(index) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ fetchedAt: Date.now(), index })
    )
  } catch {
    // localStorage lleno o bloqueado: no es crítico, simplemente no cacheamos
  }
}

/**
 * Convierte la lista cruda de tags de MangaDex en un índice
 * { "nombre en minúsculas": "uuid" } para resolución rápida.
 */
function buildIndex(rawTags = []) {
  const index = {}
  rawTags.forEach((tag) => {
    const name = tag?.attributes?.name?.en
    if (name && tag.id) {
      index[normalizeName(name)] = tag.id
    }
  })
  return index
}

/**
 * Carga el índice nombre→id, usando caché salvo que se pida lo contrario.
 * Nunca lanza: ante cualquier fallo devuelve la mejor caché disponible
 * (aunque esté vencida) o un objeto vacío.
 */
async function loadTagIndex({ signal, forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = readCache()
    if (cached) return cached
  }

  try {
    const rawTags = await fetchTagList({ signal })
    const index = buildIndex(rawTags)
    writeCache(index)
    return index
  } catch {
    // Falló la red / el Worker / todos los proxies: no rompemos la app.
    // Como último recurso, usamos una caché vencida si existe.
    return readCache({ ignoreTTL: true }) || {}
  }
}

/**
 * Resuelve una lista de nombres de género (en inglés, ver src/data/genres.js)
 * a sus UUIDs reales de MangaDex. Los nombres que no se puedan resolver
 * simplemente se omiten del resultado (el chip correspondiente queda inactivo).
 *
 * @param {string[]} names
 * @param {object} [options]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<Record<string, string>>} - { "Action": "uuid...", ... }
 */
export async function resolveGenreIds(names = [], options = {}) {
  let index = await loadTagIndex(options)

  const missing = names.filter((name) => !index[normalizeName(name)])

  // Si falta algún nombre, puede que la caché esté desactualizada
  // (MangaDex agregó/renombró un tag) → un intento de regeneración automática.
  if (missing.length > 0) {
    index = await loadTagIndex({ ...options, forceRefresh: true })
  }

  const result = {}
  names.forEach((name) => {
    const id = index[normalizeName(name)]
    if (id) result[name] = id
  })
  return result
}

/**
 * Fuerza una regeneración completa de la caché de tags. No se usa
 * automáticamente en ningún flujo actual; queda exportada por si en el
 * futuro se agrega un botón manual de "actualizar categorías".
 */
export async function regenerateTagCache(options = {}) {
  return loadTagIndex({ ...options, forceRefresh: true })
}
