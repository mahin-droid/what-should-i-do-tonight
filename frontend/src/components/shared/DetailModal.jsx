import { X, Star, MapPin, Clock, ExternalLink } from 'lucide-react'
import { useBookmarks } from '../../context/BookmarkContext'
import { useFavorites } from '../../context/FavoritesContext'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import ShareCard from './ShareCard'

const TYPE_EMOJI = { movie: '🎬', tv: '📺', cricket: '🏏', football: '⚽', food: '🍽️', travel: '✈️', event: '🎭', basketball: '🏀', tennis: '🎾' }

export default function DetailModal({ item, onClose }) {
  if (!item) return null
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()
  const saved = isBookmarked(item)
  const { toggleFavorite, isFavorite } = useFavorites()
  const faved = isFavorite(item)
  const emoji = TYPE_EMOJI[item.type] || TYPE_EMOJI[item.sport] || '📌'

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-surface-dark rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-200 dark:border-white/5">
          <div className="flex gap-3">
            <span className="text-4xl">{emoji}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {item.title || item.name || item.destination || item.teams?.join(' vs ')}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {item.type || item.sport || item._category || ''}
                {item.league ? ` · ${item.league}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(item)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition"
            >
              <Star size={18} className={faved ? 'text-warning fill-warning' : 'text-gray-400'} />
            </button>
            <button
              onClick={() => saved ? removeBookmark(item) : addBookmark(item)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition"
            >
              {saved ? <BookmarkCheck size={18} className="text-primary" /> : <Bookmark size={18} className="text-gray-400" />}
            </button>
            <ShareCard title={item.title || item.name || item.destination || ''} description={item.overview || item.description || item.top_review || ''} category={item.type || ''} />
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition text-gray-400">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Rating */}
          {item.rating && (
            <div className="flex items-center gap-2">
              <Star size={16} className="text-warning fill-warning" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.rating}</span>
              <span className="text-xs text-gray-400">/ 10</span>
            </div>
          )}

          {/* Description */}
          {(item.overview || item.description || item.top_review) && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {item.overview || item.description || item.top_review}
            </p>
          )}

          {/* Genres / Cuisine / Highlights */}
          {(item.genres || item.cuisine || item.highlights) && (
            <div className="flex flex-wrap gap-2">
              {(item.genres || item.cuisine || item.highlights || []).map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">{tag}</span>
              ))}
            </div>
          )}

          {/* Location info */}
          {(item.address || item.venue) && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin size={14} />
              <span>{item.address || item.venue}</span>
            </div>
          )}

          {/* Price */}
          {(item.price_level || item.price || item.budget_range) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Price:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {item.price || item.budget_range || '₹'.repeat(item.price_level)}
              </span>
            </div>
          )}

          {/* Date */}
          {item.release_date && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock size={14} />
              <span>{item.release_date}</span>
            </div>
          )}

          {/* Transport for travel */}
          {item.transport_options && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Getting There</p>
              <div className="flex flex-wrap gap-1">
                {item.transport_options.map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Score for sports */}
          {item.score && (
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Score</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.score.display || `${item.score.home} - ${item.score.away}`}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {(item.type === 'movie' || item.type === 'tv') && (
              <>
                <a href={`https://www.google.com/search?q=watch+${encodeURIComponent(item.title || '')}+online`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-medium hover:bg-primary/80 transition">
                  ▶ Watch Now
                </a>
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent((item.title || '') + ' trailer')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-danger/10 text-danger rounded-xl text-xs font-medium hover:bg-danger/20 transition">
                  🎬 Trailer
                </a>
              </>
            )}
            {item.type === 'food' && (
              <>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(item.name + ' ' + (item.address || ''))}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-success text-white rounded-xl text-xs font-medium hover:bg-success/80 transition">
                  📍 Directions
                </a>
                <a href={`https://www.zomato.com/search?q=${encodeURIComponent(item.name || '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-danger/10 text-danger rounded-xl text-xs font-medium hover:bg-danger/20 transition">
                  🍽️ Zomato
                </a>
              </>
            )}
            {item.type === 'travel' && (
              <>
                <a href={`https://www.google.com/maps/dir//${encodeURIComponent(item.destination || '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-medium hover:bg-primary/80 transition">
                  🗺️ Map Route
                </a>
                <a href={`https://www.makemytrip.com/flight/search?from=AMD&to=${encodeURIComponent(item.destination || '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-medium hover:bg-accent/20 transition">
                  ✈️ Flights
                </a>
              </>
            )}
            {item.type === 'event' && (
              <a href={`https://www.google.com/search?q=${encodeURIComponent((item.name || '') + ' tickets ' + (item.city || 'Ahmedabad'))}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-warning text-white rounded-xl text-xs font-medium hover:bg-warning/80 transition">
                🎟️ Get Tickets
              </a>
            )}
            {(item.sport || item.type === 'cricket' || item.type === 'football') && (
              <a href={`https://www.google.com/search?q=${encodeURIComponent(item.teams?.join(' vs ') || 'live score')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-success text-white rounded-xl text-xs font-medium hover:bg-success/80 transition">
                📊 Live Score
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
