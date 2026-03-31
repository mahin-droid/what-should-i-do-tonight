import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-8xl mb-6">🌙</div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">404</h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">Page not found</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 max-w-md">
        Looks like this page went out for the night. Let's get you back on track!
      </p>
      <div className="flex gap-3">
        <Link to="/" className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/80 transition">
          Go Home
        </Link>
        <Link to="/explore" className="px-6 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition">
          Explore
        </Link>
      </div>
    </div>
  )
}
