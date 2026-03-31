import { useFavorites } from '../../context/FavoritesContext'
import { Star } from 'lucide-react'

const TYPE_EMOJI = { movie: '🎬', tv: '📺', food: '🍽️', travel: '✈️', event: '🎭' }

export default function FavoritesBar() {
  const { favorites } = useFavorites()

  if (favorites.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
        <Star size={14} className="text-warning fill-warning" /> Your Favorites
      </h3>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {favorites.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0 px-3 py-2 bg-warning/5 border border-warning/20 rounded-xl">
            <span className="text-sm">{TYPE_EMOJI[item.type] || '⭐'}</span>
            <span className="text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap">{item.title || item.name || item.destination}</span>
            {item.rating && <span className="text-[10px] text-warning">{item.rating}⭐</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
