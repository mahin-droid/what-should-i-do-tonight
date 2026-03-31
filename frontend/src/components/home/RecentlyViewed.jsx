import { useRecent } from '../../context/RecentContext'

const TYPE_EMOJI = { movie: '🎬', tv: '📺', food: '🍽️', travel: '✈️', event: '🎭', cricket: '🏏', football: '⚽' }

export default function RecentlyViewed() {
  const { recentItems } = useRecent()

  if (recentItems.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">🕐 Recently Viewed</h3>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {recentItems.slice(0, 6).map((item, i) => {
          const emoji = TYPE_EMOJI[item.type] || TYPE_EMOJI[item.sport] || '📌'
          return (
            <div key={i} className="flex-shrink-0 w-36 bg-white dark:bg-surface-dark rounded-xl p-3 border border-gray-200 dark:border-white/5">
              {item.poster_url ? (
                <img src={item.poster_url} alt="" className="w-full h-20 object-cover rounded-lg mb-2" loading="lazy" />
              ) : (
                <div className="w-full h-20 bg-gray-100 dark:bg-white/5 rounded-lg mb-2 flex items-center justify-center text-2xl">{emoji}</div>
              )}
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.title || item.name || item.destination}</p>
              <p className="text-[10px] text-gray-400 truncate">{item.type || item._category || item.sport || ''}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
