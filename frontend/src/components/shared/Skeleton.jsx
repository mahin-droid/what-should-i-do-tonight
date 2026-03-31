export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-white/5 animate-pulse">
      <div className="flex gap-3">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

export function SkeletonMetric() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-white/5 animate-pulse">
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
    </div>
  )
}

export function SkeletonTrending() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-3 border border-gray-200 dark:border-white/5 animate-pulse">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  )
}

export function SkeletonMatch() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-3 border border-gray-200 dark:border-white/5 animate-pulse">
      <div className="flex justify-between mb-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  )
}
