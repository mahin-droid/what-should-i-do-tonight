import { Moon, Sun, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Sparkles, Bookmark as BookmarkIcon, BarChart3, Settings, TrendingUp, ArrowLeftRight } from 'lucide-react'
import PageHead from '../components/shared/PageHead'
import MapView from '../components/shared/MapView'
import { useUser } from '../context/UserContext'
import { useMood } from '../context/MoodContext'
import { useActivity } from '../context/ActivityContext'
import { MOODS } from '../utils/constants'

const CITIES = ['Ahmedabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Hyderabad', 'Goa']

export default function ProfilePage() {
  const { user, updateUser, toggleDarkMode, detectLocation } = useUser()
  const { mood } = useMood()
  const { activity } = useActivity()

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHead title="Profile" description="Manage your preferences and settings" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>

      {/* Location */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
          <MapPin size={16} /> Location
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={detectLocation}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition flex items-center gap-1"
          >
            📍 Auto-detect
          </button>
          {CITIES.map(city => (
            <button
              key={city}
              onClick={() => updateUser({ city })}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                user.city === city
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Appearance</h3>
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-white/5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition w-full"
        >
          {user.darkMode ? <Moon size={18} className="text-accent" /> : <Sun size={18} className="text-warning" />}
          <span className="text-sm text-gray-600 dark:text-gray-300">{user.darkMode ? 'Dark Mode' : 'Light Mode'}</span>
          <span className="ml-auto text-xs text-gray-500">{user.darkMode ? 'On' : 'Off'}</span>
        </button>
      </div>

      {/* Current Mood */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Your Activity</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-100 dark:bg-white/5 rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">{MOODS.find(m => m.id === mood)?.emoji || '🤔'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Current Mood</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{mood || 'Not set'}</p>
          </div>
          <div className="bg-gray-100 dark:bg-white/5 rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">📍</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">City</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.city}</p>
          </div>
          <div className="bg-gray-100 dark:bg-white/5 rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">🎯</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Searches Today</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.searches + activity.chatMessages}</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Your Location</h3>
        <MapView />
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">More Features</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { to: '/plan', icon: Sparkles, label: 'Plan Evening', color: 'text-primary' },
            { to: '/saved', icon: BookmarkIcon, label: 'Saved Items', color: 'text-accent' },
            { to: '/stats', icon: BarChart3, label: 'My Stats', color: 'text-success' },
            { to: '/predictions', icon: TrendingUp, label: 'Predictions', color: 'text-warning' },
            { to: '/settings', icon: Settings, label: 'API Settings', color: 'text-pink' },
            { to: '/compare', icon: ArrowLeftRight, label: 'Compare Cities', color: 'text-teal' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition"
            >
              <link.icon size={16} className={link.color} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">About</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          What Should I Do Tonight? — An AI-powered life recommendation engine.
          Built with React, FastAPI, and Socket.io.
        </p>
        <p className="text-xs text-gray-500 mt-2">Version 1.0.0</p>
      </div>
    </div>
  )
}
