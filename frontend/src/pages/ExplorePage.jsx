import { useState, useEffect, useRef, useCallback } from 'react'
import PageHead from '../components/shared/PageHead'
import CategoryFilter from '../components/explore/CategoryFilter'
import ExploreGrid from '../components/explore/ExploreGrid'
import MoodSelector from '../components/home/MoodSelector'
import { useMood } from '../context/MoodContext'
import { useUser } from '../context/UserContext'
import { useDataCache } from '../context/DataCacheContext'
import { getEntertainmentTrending, getLiveSports, getUpcomingSports, getNearbyFood, getTravelDeals, getNearbyEvents } from '../services/api'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import CompareModal from '../components/shared/CompareModal'
import { ArrowLeftRight } from 'lucide-react'

export default function ExplorePage() {
  const [category, setCategory] = useState('All')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(12)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('trending')
  const [showCompare, setShowCompare] = useState(false)
  const { mood, clearMood } = useMood()
  const { user } = useUser()
  const { getCached, setCached } = useDataCache()
  const initialLoad = useRef(true)

  useEffect(() => {
    const cacheKey = `explore_${category}_${mood}_${user.city}`
    const cached = getCached(cacheKey)
    if (cached) {
      setItems(cached)
      setLoading(false)
      initialLoad.current = false
      return
    }

    let cancelled = false
    setLoading(true)
    setVisibleCount(12)
    setError(null)

    async function fetchData() {
      try {
        const results = []
        const fetchers = {
          Entertainment: () => getEntertainmentTrending().then(r => (r.data.data || []).map(i => ({ ...i, _category: 'Entertainment', type: i.type || 'movie' }))),
          Sports: async () => {
            const [live, upcoming] = await Promise.allSettled([getLiveSports(), getUpcomingSports()])
            const liveData = live.status === 'fulfilled' ? (live.value.data.data || []) : []
            const upData = upcoming.status === 'fulfilled' ? (upcoming.value.data.data || []) : []
            return [...liveData, ...upData].map(i => ({ ...i, _category: 'Sports', type: i.sport || 'cricket' }))
          },
          Food: () => getNearbyFood({ mood, city: user.city }).then(r => (r.data.data || []).map(i => ({ ...i, _category: 'Food', type: 'food' }))),
          Travel: () => getTravelDeals({ from_city: user.city }).then(r => (r.data.data || []).map(i => ({ ...i, _category: 'Travel', type: 'travel' }))),
          Events: () => getNearbyEvents(user.city).then(r => (r.data.data || []).map(i => ({ ...i, _category: 'Events', type: 'event' }))),
        }

        if (category === 'All') {
          const all = await Promise.allSettled(Object.values(fetchers).map(f => f()))
          all.forEach(r => { if (r.status === 'fulfilled') results.push(...r.value) })
        } else if (fetchers[category]) {
          const data = await fetchers[category]()
          results.push(...data)
        }

        if (!cancelled) {
          setItems(results)
          setCached(cacheKey, results)
          setError(results.length === 0 ? 'No results found for your current filters.' : null)
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load recommendations. Please try again.')
          setItems([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
          initialLoad.current = false
        }
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [category, mood, user.city])

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
    if (sortBy === 'trending') return (b.trending_score || b.excitement_score || b.popularity || 0) - (a.trending_score || a.excitement_score || a.popularity || 0)
    if (sortBy === 'name') return (a.title || a.name || a.destination || '').localeCompare(b.title || b.name || b.destination || '')
    return 0
  })

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      setVisibleCount(prev => Math.min(prev + 12, sortedItems.length))
    }
  }, [sortedItems.length])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div className="space-y-5">
      <PageHead title="Explore" description="Browse entertainment, food, sports, travel and events" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Explore</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Discover recommendations across all categories</p>
      </div>

      <MoodSelector />

      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 overflow-hidden">
          <CategoryFilter selected={category} onSelect={setCategory} />
        </div>
        <button
          onClick={() => setShowCompare(true)}
          disabled={items.length < 2}
          className="p-2 rounded-lg bg-gray-100 dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-primary transition disabled:opacity-30 flex-shrink-0"
          title="Compare items"
        >
          <ArrowLeftRight size={18} />
        </button>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 flex-shrink-0"
        >
          <option value="trending">Trending</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {mood && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
            Mood: {mood}
          </span>
        )}
        {category !== 'All' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
            {category}
          </span>
        )}
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {items.length} results {user.city && `in ${user.city}`}
        </span>
      </div>

      {loading && items.length === 0 ? (
        <LoadingSpinner text="Fetching recommendations..." />
      ) : error && items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">😕</div>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <button
            onClick={() => setCategory('All')}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/80 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <ExploreGrid items={sortedItems.slice(0, visibleCount)} />
          {visibleCount < sortedItems.length && (
            <p className="text-center text-xs text-gray-400 py-4">Showing {visibleCount} of {sortedItems.length} · Scroll for more</p>
          )}
        </>
      )}
      {showCompare && items.length >= 2 && <CompareModal items={sortedItems} onClose={() => setShowCompare(false)} />}
    </div>
  )
}
