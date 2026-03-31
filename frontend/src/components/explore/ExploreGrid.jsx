import { useState } from 'react'
import RecommendationCard from './RecommendationCard'
import DetailModal from '../shared/DetailModal'
import { useRecent } from '../../context/RecentContext'

export default function ExploreGrid({ items }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const { addRecent } = useRecent()

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-gray-500 dark:text-gray-400">No results found. Try a different filter!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <div key={item.id || item.match_id || item.destination || i} onClick={() => { addRecent(item); setSelectedItem(item) }}>
            <RecommendationCard item={item} index={i} />
          </div>
        ))}
      </div>
      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </>
  )
}
