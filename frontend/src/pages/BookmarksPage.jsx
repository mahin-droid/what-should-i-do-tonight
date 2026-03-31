import { useState } from 'react'
import { useBookmarks } from '../context/BookmarkContext'
import PageHead from '../components/shared/PageHead'
import RecommendationCard from '../components/explore/RecommendationCard'
import DetailModal from '../components/shared/DetailModal'
import { Bookmark, Trash2 } from 'lucide-react'

const FILTER_TYPES = ['All', 'movie', 'tv', 'food', 'travel', 'event', 'cricket', 'football']

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks()
  const [filter, setFilter] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)

  const filtered = filter === 'All' ? bookmarks : bookmarks.filter(b => b.type === filter || b.sport === filter || b._category?.toLowerCase() === filter)

  return (
    <div className="space-y-5">
      <PageHead title="Saved" description="Your bookmarked recommendations" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bookmark size={24} /> Saved Items
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{bookmarks.length} items saved</p>
      </div>

      {bookmarks.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FILTER_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                filter === type
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-surface-dark text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5'
              }`}
            >
              {type === 'All' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📑</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {bookmarks.length === 0 ? 'No saved items yet' : 'No items match this filter'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {bookmarks.length === 0 ? 'Bookmark movies, restaurants, events and more from the Explore page.' : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item, i) => (
            <div key={item.id || item.match_id || item.destination || item.name || i} className="relative group">
              <div onClick={() => setSelectedItem(item)}>
                <RecommendationCard item={item} index={i} />
              </div>
              <button
                onClick={() => removeBookmark(item)}
                className="absolute top-2 right-2 p-1.5 bg-danger/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  )
}
