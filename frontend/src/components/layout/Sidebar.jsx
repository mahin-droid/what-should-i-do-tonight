import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, BarChart3, MessageCircle, User } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-white/5 bg-bg-dark p-4 sticky top-16 h-[calc(100vh-4rem)]">
      <nav className="flex flex-col gap-1 mt-4">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
