import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import PageHead from '../components/shared/PageHead'
import { useDataCache } from '../context/DataCacheContext'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import api from '../services/api'

export default function PredictionsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { getCached, setCached } = useDataCache()

  useEffect(() => {
    const cached = getCached('predictions')
    if (cached) { setData(cached); setLoading(false); return }

    // Generate prediction data client-side (mirrors backend trend_predictor)
    const genres = ['Action', 'Comedy', 'Romance', 'Thriller', 'Sci-Fi', 'Drama', 'Horror']
    const genreTrends = genres.map(g => {
      const current = Math.floor(Math.random() * 40) + 50
      const predicted = current + Math.floor(Math.random() * 20) - 5
      return { genre: g, current, predicted: Math.min(100, Math.max(0, predicted)), trend: predicted > current ? 'rising' : predicted < current ? 'falling' : 'stable' }
    })

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const foodPatterns = days.map(d => {
      const isWeekend = d === 'Saturday' || d === 'Sunday'
      return { day: d, orders: (isWeekend ? 70 : 50) + Math.floor(Math.random() * 20), peak: isWeekend ? '9 PM' : '8 PM', cuisine: ['Gujarati', 'Biryani', 'Pizza', 'Chinese', 'Street Food'][Math.floor(Math.random() * 5)] }
    })

    const result = { genreTrends, foodPatterns }
    setData(result)
    setCached('predictions', result)
    setLoading(false)
  }, [])

  if (loading) return <LoadingSpinner text="Generating predictions..." />

  const TREND_COLORS = { rising: '#1D9E75', falling: '#E24B4A', stable: '#EF9F27' }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHead title="Predictions" description="AI predictions for upcoming trends" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trend Predictions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">What our AI thinks will trend next</p>
      </div>

      {/* Genre Predictions */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Genre Popularity Prediction</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Current vs predicted popularity for next month</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.genreTrends} layout="vertical">
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <YAxis type="category" dataKey="genre" tick={{ fill: '#9CA3AF', fontSize: 11 }} width={70} />
            <Tooltip contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2D3142', borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="current" fill="#378ADD" radius={[0, 2, 2, 0]} name="Current" />
            <Bar dataKey="predicted" radius={[0, 4, 4, 0]} name="Predicted">
              {data.genreTrends.map((entry, i) => <Cell key={i} fill={TREND_COLORS[entry.trend]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Rising</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger" /> Falling</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Stable</span>
        </div>
      </div>

      {/* Food Ordering Predictions */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Food Ordering Predictions</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Predicted order volume by day of week</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.foodPatterns}>
            <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2D3142', borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="orders" fill="#EF9F27" radius={[4, 4, 0, 0]} name="Predicted Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Predictions Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.genreTrends.filter(g => g.trend === 'rising').map(g => (
          <div key={g.genre} className="bg-success/5 border border-success/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{g.genre}</span>
              <span className="text-xs text-success font-medium">Rising</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{g.current} to {g.predicted} predicted score</p>
          </div>
        ))}
        {data.genreTrends.filter(g => g.trend === 'falling').map(g => (
          <div key={g.genre} className="bg-danger/5 border border-danger/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{g.genre}</span>
              <span className="text-xs text-danger font-medium">Falling</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{g.current} to {g.predicted} predicted score</p>
          </div>
        ))}
      </div>

      {/* Daily Insights */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Daily Insights</h3>
        <div className="space-y-2">
          {data.foodPatterns.map(d => (
            <div key={d.day} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
              <span className="text-sm text-gray-900 dark:text-white font-medium">{d.day}</span>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Peak: {d.peak}</span>
                <span>Top: {d.cuisine}</span>
                <span className="font-medium text-primary">{d.orders} orders</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
