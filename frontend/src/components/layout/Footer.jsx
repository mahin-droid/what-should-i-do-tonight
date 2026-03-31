import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, BarChart3, MessageCircle, User } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function Footer() {
  const location = useLocation()

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-bg-dark/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
      <nav className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${
                active ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px]">{label}</span>
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}
