import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { searchEntertainment, getNearbyFood, getNearbyEvents } from '../../services/api'

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const [entertainment, food, events] = await Promise.allSettled([
          searchEntertainment(query),
          getNearbyFood({ city: 'Ahmedabad' }),
          getNearbyEvents('Ahmedabad'),
        ])

        const all = []
        if (entertainment.status === 'fulfilled') {
          (entertainment.value.data.data || []).slice(0, 4).forEach(i => all.push({ ...i, _type: 'entertainment', _icon: '🎬' }))
        }
        if (food.status === 'fulfilled') {
          (food.value.data.data || []).filter(r => r.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3).forEach(i => all.push({ ...i, _type: 'food', _icon: '🍽️' }))
        }
        if (events.status === 'fulfilled') {
          (events.value.data.data || []).filter(e => e.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3).forEach(i => all.push({ ...i, _type: 'event', _icon: '🎭' }))
        }
        setResults(all)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="max-w-2xl mx-auto mt-20 px-4" onClick={e => e.stopPropagation()}>
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-white/5">
            <Search size={20} className="text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies, restaurants, events..."
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-sm"
            />
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <X size={18} />
            </button>
          </div>

          {loading && (
            <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
          )}

          {results.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              {results.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { navigate('/explore'); onClose() }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition text-left"
                >
                  <span className="text-lg">{item._icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title || item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.overview || item.description || (item.cuisine || []).join(', ')}</p>
                  </div>
                  {item.rating && <span className="text-xs text-warning">{item.rating}⭐</span>}
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && !loading && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">No results for "{query}"</div>
          )}

          {query.length < 2 && (
            <div className="px-4 py-4 text-xs text-gray-400">
              <p className="mb-2 font-medium">Try searching for:</p>
              <div className="flex flex-wrap gap-2">
                {['Jawan', 'Biryani', 'Comedy Show', 'Goa trip', 'IPL'].map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition">{s}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
