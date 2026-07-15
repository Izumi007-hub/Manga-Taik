import { useEffect, useState } from 'react'

/**
 * Devuelve una versión "retrasada" de `value`: solo se actualiza cuando
 * `value` deja de cambiar durante `delay` milisegundos. Se usa para no
 * disparar una petición a la API en cada tecla que el usuario presiona.
 *
 * @param {*} value
 * @param {number} [delay=400]
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
