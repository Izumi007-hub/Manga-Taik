import { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [value, setValue] = useState(initialValue)

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(value.trim())
  }

  function handleClear() {
    setValue('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl mx-auto">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar manga por título..."
        className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-300 dark:border-slate-700
                   bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={18} />
        </button>
      )}
    </form>
  )
}
