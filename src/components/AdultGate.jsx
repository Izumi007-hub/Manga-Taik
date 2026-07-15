import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { confirmAdult } from '../utils/storage'

/**
 * Modal bloqueante que se muestra en /adult mientras el usuario no haya
 * confirmado su edad antes (ver isAdultConfirmed en utils/storage.js).
 */
export default function AdultGate({ onConfirm }) {
  const navigate = useNavigate()

  function handleConfirm() {
    confirmAdult()
    onConfirm()
  }

  function handleDecline() {
    navigate('/')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="bg-surface-light border border-surface-border rounded-xl max-w-sm w-full p-6 text-center">
        <ShieldAlert size={40} className="mx-auto text-brand-400 mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">Contenido para adultos</h2>
        <p className="text-sm text-gray-400 mb-6">
          Esta sección contiene material explícito, exclusivo para mayores de 18 años.
          ¿Confirmas que tienes 18 años o más?
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            No, volver
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-lg text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 transition-colors"
          >
            Sí, soy mayor
          </button>
        </div>
      </div>
    </div>
  )
}
