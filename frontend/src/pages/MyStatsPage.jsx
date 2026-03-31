import { useMemo } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useBookmarks } from '../context/BookmarkContext'
import { useMood } from '../context/MoodContext'
import { useUser } from '../context/UserContext'
import PageHead from '../components/shared/PageHead'

const MOOD_COLORS = { chill: '#378ADD', excited: '#EF9F27', bored: '#7F77DD', social: '#1D9E75', romantic: '#FF6B9D', hungry: '#E24B4A' }

export default function MyStatsPage() {
  const { bookmarks } = useBookmarks()
  const { mood } = useMood()
  const { user } = useUser()

  const categoryBreakdown = useMemo(() => {
    const counts = {}
    bookmarks.forEach(b => {
      const cat = b._category || b.type || b.sport || 'Other'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [bookmarks])

  const COLORS = ['#378ADD', '#7F77DD', '#1D9E75', '#EF9F27', '#E24B4A', '#FF6B9D', '#4ECDC4']

  const recentActivity = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map(day => ({
      day,
      saved: Math.floor(Math.random() * 5),
      searches: Math.floor(Math.random() * 8),
    }))
  }, [])

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHead title="My Stats" description="Your personal activity and preferences" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Stats</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-white/5 text-center">
          <p className="text-3xl font-bold text-primary">{bookmarks.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Items Saved</p>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-white/5 text-center">
          <p className="text-3xl font-bold text-accent">{categoryBreakdown.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Categories Explored</p>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-white/5 text-center">
          <p className="text-3xl">{mood ? ({ chill: '😌', excited: '🤩', bored: '😴', social: '🎉', romantic: '💕', hungry: '🍕' }[mood] || '🤔') : '🤔'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current Mood: {mood || 'None'}</p>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-white/5 text-center">
          <p className="text-3xl">📍</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.city}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Saved by Category */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Saved by Category</h3>
          {categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Save some items to see your breakdown!</p>
          )}
        </div>

        {/* Weekly Activity */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={recentActivity}>
              <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2D3142', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="saved" fill="#378ADD" radius={[4, 4, 0, 0]} name="Saved" />
              <Bar dataKey="searches" fill="#7F77DD" radius={[4, 4, 0, 0]} name="Searches" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Preferences */}
      {user.preferences && (
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Your Preferences</h3>
          <div className="space-y-3">
            {user.preferences.genres?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Favourite Genres</p>
                <div className="flex flex-wrap gap-1">
                  {user.preferences.genres.map(g => <span key={g} className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs">{g}</span>)}
                </div>
              </div>
            )}
            {user.preferences.cuisines?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Favourite Cuisines</p>
                <div className="flex flex-wrap gap-1">
                  {user.preferences.cuisines.map(c => <span key={c} className="px-2 py-1 bg-warning/10 text-warning rounded-lg text-xs">{c}</span>)}
                </div>
              </div>
            )}
            {user.preferences.sports?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sports You Follow</p>
                <div className="flex flex-wrap gap-1">
                  {user.preferences.sports.map(s => <span key={s} className="px-2 py-1 bg-success/10 text-success rounded-lg text-xs">{s}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Bookmarks */}
      {bookmarks.length > 0 && (
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recently Saved</h3>
          <div className="space-y-2">
            {bookmarks.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                <span className="text-lg">{item.type === 'movie' ? '🎬' : item.type === 'food' ? '🍽️' : item.type === 'travel' ? '✈️' : item.type === 'event' ? '🎭' : '📌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title || item.name || item.destination}</p>
                  <p className="text-xs text-gray-400 truncate">{item.type || item._category || ''}</p>
                </div>
                {item.rating && <span className="text-xs text-warning">{item.rating}⭐</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
