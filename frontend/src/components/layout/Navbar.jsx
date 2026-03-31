import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, BarChart3, MessageCircle, User, Moon, Sun, Search } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import SearchBar from '../shared/SearchBar'
import NotificationBell from '../shared/NotificationBell'
import KeyboardShortcuts from '../shared/KeyboardShortcuts'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function Navbar() {
  const location = useLocation()
  const { user, toggleDarkMode } = useUser()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-bg-dark/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
      <KeyboardShortcuts onSearch={() => setSearchOpen(true)} />
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌙</span>
          <span className="font-bold text-lg text-gray-900 dark:text-white hidden sm:block">Tonight</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-primary/5 transition"
          >
            <Search size={18} />
          </button>
          <NotificationBell />
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{user.city}</span>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-primary/5 transition"
          >
            {user.darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </header>
  )
}
