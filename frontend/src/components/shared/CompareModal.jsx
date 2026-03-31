import { useState } from 'react'
import { X, ArrowLeftRight } from 'lucide-react'

export default function CompareModal({ items, onClose }) {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(Math.min(1, items.length - 1))

  if (!items || items.length < 2) return null

  const itemA = items[left]
  const itemB = items[right]

  const fields = [
    { label: 'Rating', key: 'rating', format: v => v ? `${v} ⭐` : '—' },
    { label: 'Price', key: 'price_level', format: v => v ? '₹'.repeat(v) : (items[0]?.budget_range || '—') },
    { label: 'Distance', key: 'distance_km', format: v => v ? `${v} km` : '—' },
    { label: 'Excitement', key: 'excitement_score', format: v => v ? `${v}/100` : '—' },
  ]

  function getValue(item, key) {
    return item[key] !== undefined && item[key] !== null ? item[key] : null
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-surface-dark rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ArrowLeftRight size={20} /> Compare
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400"><X size={18} /></button>
        </div>

        <div className="p-4">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select value={left} onChange={e => setLeft(Number(e.target.value))} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white">
              {items.map((item, i) => <option key={i} value={i}>{item.title || item.name || item.destination}</option>)}
            </select>
            <select value={right} onChange={e => setRight(Number(e.target.value))} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white">
              {items.map((item, i) => <option key={i} value={i}>{item.title || item.name || item.destination}</option>)}
            </select>
          </div>

          {/* Comparison Table */}
          <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 dark:bg-white/5 px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span>{itemA.title || itemA.name || itemA.destination}</span>
              <span className="text-center">vs</span>
              <span className="text-right">{itemB.title || itemB.name || itemB.destination}</span>
            </div>
            {fields.map(field => {
              const valA = getValue(itemA, field.key)
              const valB = getValue(itemB, field.key)
              const numA = Number(valA) || 0
              const numB = Number(valB) || 0
              const winnerA = numA > numB
              const winnerB = numB > numA
              return (
                <div key={field.key} className="grid grid-cols-3 px-4 py-3 border-t border-gray-100 dark:border-white/5 items-center">
                  <span className={`text-sm ${winnerA ? 'text-success font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>{field.format(valA)}</span>
                  <span className="text-xs text-gray-400 text-center">{field.label}</span>
                  <span className={`text-sm text-right ${winnerB ? 'text-success font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>{field.format(valB)}</span>
                </div>
              )
            })}
            {/* Genres/Cuisine */}
            <div className="grid grid-cols-3 px-4 py-3 border-t border-gray-100 dark:border-white/5">
              <div className="flex flex-wrap gap-1">{(itemA.genres || itemA.cuisine || itemA.highlights || []).slice(0, 3).map((t, i) => <span key={i} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{t}</span>)}</div>
              <span className="text-xs text-gray-400 text-center">Tags</span>
              <div className="flex flex-wrap gap-1 justify-end">{(itemB.genres || itemB.cuisine || itemB.highlights || []).slice(0, 3).map((t, i) => <span key={i} className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded">{t}</span>)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
