import { CATEGORIES } from '../../utils/constants'

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
            selected === cat
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-surface-dark text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/5'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
