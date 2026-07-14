/**
 * smartFetch: capa propia de peticiones (sin axios) pensada para consumir
 * la API de MangaDex desde GitHub Pages, donde las peticiones directas
 * pueden ser bloqueadas por CORS dependiendo del navegador/red del usuario.
 *
 * Estrategia:
 *   1. Intenta fetch() directo contra la URL original.
 *   2. Si falla (error de red o CORS), prueba en orden una lista de proxies
 *      públicos, pasando la URL original codificada con encodeURIComponent.
 *   3. Si todos fallan, lanza un error con un mensaje amigable para el usuario.
 *
 * IMPORTANTE: los proxies públicos son gratuitos pero no garantizan
 * disponibilidad 24/7. Por eso se prueban varios en cascada.
 */

const PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://proxy.cors.sh/?'
]

const FRIENDLY_ERROR = 'MangaDex no está disponible en este momento. Intenta nuevamente más tarde.'

/**
 * @param {string} url - URL absoluta a la que se quiere acceder (ej. API de MangaDex)
 * @param {RequestInit} [options] - Opciones estándar de fetch (headers, method, etc.)
 * @returns {Promise<Response>} - Response ok (status 2xx)
 */
export async function smartFetch(url, options = {}) {
  // 1. Intento directo
  try {
    const res = await fetch(url, options)
    if (res.ok) return res
  } catch {
    // Error de red / CORS: seguimos con los proxies
  }

  // 2. Rotación de proxies
  for (const proxy of PROXIES) {
    try {
      const proxiedUrl = proxy + encodeURIComponent(url)
      const res = await fetch(proxiedUrl, options)
      if (res.ok) return res
    } catch {
      // Probar el siguiente proxy
    }
  }

  // 3. Todos fallaron
  throw new Error(FRIENDLY_ERROR)
}

/**
 * Atajo para peticiones que devuelven JSON (la mayoría de los endpoints de MangaDex).
 */
export async function smartFetchJson(url, options = {}) {
  const res = await smartFetch(url, options)
  return res.json()
}

export { FRIENDLY_ERROR }
