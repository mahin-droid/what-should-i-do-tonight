import { useState, useEffect } from 'react'
import PageHead from '../components/shared/PageHead'
import { useToast } from '../components/shared/Toast'
import { setItem, getItem } from '../services/storage'

const API_KEYS = [
  { id: 'TMDB_API_KEY', label: 'TMDb (Movies/TV)', url: 'https://www.themoviedb.org/settings/api', description: 'Free, instant approval. Get trending movies and TV shows.' },
  { id: 'NEWS_API_KEY', label: 'NewsAPI', url: 'https://newsapi.org/register', description: 'Free, 100 requests/day. Real news headlines.' },
  { id: 'CRICKET_API_KEY', label: 'CricAPI (Cricket)', url: 'https://cricapi.com/', description: 'Free, 100 requests/day. Live IPL and international cricket.' },
  { id: 'FOOTBALL_API_KEY', label: 'Football-Data.org', url: 'https://www.football-data.org/client/register', description: 'Free, 10 requests/min. EPL, La Liga, Champions League.' },
  { id: 'FOURSQUARE_API_KEY', label: 'FourSquare (Restaurants)', url: 'https://developer.foursquare.com/', description: 'Free, 100K calls/month. Real restaurant data.' },
  { id: 'TICKETMASTER_API_KEY', label: 'Ticketmaster (Events)', url: 'https://developer.ticketmaster.com/', description: 'Free, 5000 requests/day. Real events near you.' },
]

export default function SettingsPage() {
  const [keys, setKeys] = useState(() => getItem('api_keys') || {})
  const { addToast } = useToast()
  const [health, setHealth] = useState({})
  const [checking, setChecking] = useState(false)

  const checkHealth = async () => {
    setChecking(true)
    const endpoints = [
      { name: 'Backend', url: '/api/health' },
      { name: 'Weather', url: '/api/weather/current?city=Ahmedabad' },
      { name: 'Entertainment', url: '/api/entertainment/trending' },
      { name: 'Sports', url: '/api/sports/live' },
      { name: 'Food', url: '/api/food/nearby?city=Ahmedabad' },
    ]
    const results = {}
    for (const ep of endpoints) {
      try {
        const start = Date.now()
        const resp = await fetch(`http://localhost:8000${ep.url}`)
        const time = Date.now() - start
        results[ep.name] = { ok: resp.ok, time, status: resp.status }
      } catch {
        results[ep.name] = { ok: false, time: 0, status: 'Error' }
      }
    }
    setHealth(results)
    setChecking(false)
  }

  useEffect(() => { checkHealth() }, [])

  const handleSave = (id, value) => {
    const updated = { ...keys, [id]: value }
    setKeys(updated)
    setItem('api_keys', updated)
  }

  const handleSaveAll = () => {
    setItem('api_keys', keys)
    addToast('API keys saved! Note: Keys are stored locally and sent to your backend.', 'success')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHead title="API Settings" description="Configure your API keys for real-time data" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys Setup</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add your free API keys to get real-time data. All keys are stored locally in your browser.</p>
      </div>

      {/* API Health */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">API Health</h3>
          <button onClick={checkHealth} disabled={checking} className="text-xs text-primary hover:underline disabled:opacity-50">
            {checking ? 'Checking...' : 'Refresh'}
          </button>
        </div>
        <div className="space-y-2">
          {Object.entries(health).map(([name, info]) => (
            <div key={name} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${info.ok ? 'bg-success' : 'bg-danger'}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
              </div>
              <span className={`text-xs ${info.ok ? 'text-success' : 'text-danger'}`}>
                {info.ok ? `${info.time}ms` : `Down (${info.status})`}
              </span>
            </div>
          ))}
          {Object.keys(health).length === 0 && !checking && (
            <p className="text-xs text-gray-400 text-center py-2">Click refresh to check API status</p>
          )}
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <p className="text-sm text-primary font-medium mb-1">Weather works without any key!</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">We use Open-Meteo which is completely free with no API key required.</p>
      </div>

      <div className="space-y-3">
        {API_KEYS.map(api => (
          <div key={api.id} className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-white/5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{api.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{api.description}</p>
              </div>
              <a
                href={api.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex-shrink-0"
              >
                Get key ↗
              </a>
            </div>
            <input
              type="text"
              value={keys[api.id] || ''}
              onChange={e => handleSave(api.id, e.target.value)}
              placeholder="Paste your API key here..."
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {keys[api.id] && (
              <p className="text-xs text-success mt-1">✓ Key saved</p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSaveAll}
        className="w-full px-4 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/80 transition"
      >
        Save All Keys
      </button>

      <p className="text-xs text-gray-400 text-center">
        Note: These keys are saved in your browser's localStorage. To use them with the backend, add them to the backend/.env file.
      </p>
    </div>
  )
}
