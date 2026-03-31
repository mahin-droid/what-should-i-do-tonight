import { RefreshCw } from 'lucide-react'

const ERROR_CONFIGS = {
  network: { emoji: '📡', title: 'Connection Error', message: 'Check if the backend server is running on port 8000' },
  empty: { emoji: '🔍', title: 'Nothing Found', message: 'Try different filters or check back later' },
  api: { emoji: '⚠️', title: 'Service Unavailable', message: 'The data service is temporarily down' },
  default: { emoji: '😕', title: 'Something went wrong', message: 'Please try again' },
}

export default function ErrorState({ type = 'default', onRetry, customMessage }) {
  const config = ERROR_CONFIGS[type] || ERROR_CONFIGS.default

  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">{config.emoji}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{config.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm mx-auto">{customMessage || config.message}</p>
      {onRetry && (
        <button onClick={onRetry} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/80 transition">
          <RefreshCw size={14} /> Try Again
        </button>
      )}
    </div>
  )
}
