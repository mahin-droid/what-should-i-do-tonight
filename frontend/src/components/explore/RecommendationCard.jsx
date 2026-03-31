import { motion } from 'framer-motion'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import Badge from '../shared/Badge'
import { useBookmarks } from '../../context/BookmarkContext'

const TYPE_EMOJI = {
  movie: '🎬', tv: '📺', cricket: '🏏', football: '⚽', food: '🍽️', travel: '✈️', event: '🎭',
}

const CATEGORY_COLORS = {
  Entertainment: 'bg-primary/10 text-primary',
  Sports: 'bg-success/10 text-success',
  Food: 'bg-warning/10 text-warning',
  Travel: 'bg-accent/10 text-accent',
  Events: 'bg-pink/10 text-pink',
}

export default function RecommendationCard({ item, index = 0 }) {
  const emoji = TYPE_EMOJI[item.type] || TYPE_EMOJI[item.sport] || '📌'
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()
  const saved = isBookmarked(item)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="relative overflow-hidden bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-3">
        {item.poster_url ? (
              <img src={item.poster_url} alt="" className="w-12 h-16 object-cover rounded-lg flex-shrink-0" loading="lazy" />
            ) : (
              <span className="text-3xl flex-shrink-0">{emoji}</span>
            )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition line-clamp-1">
              {item.title || item.name || item.destination || item.teams?.join(' vs ')}
            </h4>
            {item.rating && <Badge text={`${item.rating}⭐`} variant="warning" />}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {item.overview || item.top_review || item.description || item.budget_range || ''}
          </p>
          {item._category && (
            <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded mt-1.5 ${CATEGORY_COLORS[item._category] || 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
              {item._category}
            </span>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {(item.genres || item.cuisine || item.highlights || []).slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] bg-gray-100 dark:bg-white/5 text-gray-400 px-1.5 py-0.5 rounded">{tag}</span>
            ))}
            {item.status === 'live' && <Badge text="LIVE" variant="live" pulse />}
            {item.trending_score > 85 && <Badge text="Trending" variant="primary" />}
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); saved ? removeBookmark(item) : addBookmark(item) }}
          className="p-1.5 rounded-lg bg-white/90 dark:bg-surface-dark/90 backdrop-blur shadow-sm text-gray-500 hover:text-primary transition"
        >
          {saved ? <BookmarkCheck size={14} className="text-primary" /> : <Bookmark size={14} />}
        </button>
      </div>
    </motion.div>
  )
}
