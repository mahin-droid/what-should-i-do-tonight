import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { SkeletonTrending } from '../shared/Skeleton'
import { getEntertainmentTrending } from '../../services/api'
import { useDataCache } from '../../context/DataCacheContext'
import Badge from '../shared/Badge'

export default function TrendingSection() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { getCached, setCached } = useDataCache()

  useEffect(() => {
    const cached = getCached('trending')
    if (cached) {
      setItems(cached)
      setLoading(false)
      return
    }

    getEntertainmentTrending()
      .then(res => {
        const data = (res.data.data || []).slice(0, 8)
        setItems(data)
        setCached('trending', data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => <SkeletonTrending key={i} />)}
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-3">
        <TrendingUp size={16} /> Trending Tonight
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-50 dark:bg-surface-dark rounded-xl p-3 border border-gray-200 dark:border-white/5 hover:border-primary/30 transition cursor-pointer group"
          >
            {item.poster_url ? (
              <img src={item.poster_url} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-2" loading="lazy" />
            ) : (
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{item.type === 'movie' ? '🎬' : '📺'}</span>
              </div>
            )}
            <div className="flex items-center justify-between mb-1">
              <Badge text={item.rating.toFixed(1) + '⭐'} variant="warning" />
              <span className="text-[10px] text-gray-400">{item.type}</span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition line-clamp-2">
              {item.title}
            </h4>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{item.overview}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {(item.genres || []).slice(0, 2).map(g => (
                <span key={g} className="text-[10px] bg-gray-100 dark:bg-white/5 text-gray-400 px-1.5 py-0.5 rounded">{g}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
