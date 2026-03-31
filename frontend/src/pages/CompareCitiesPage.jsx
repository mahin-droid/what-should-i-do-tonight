import { useState, useEffect } from 'react'
import PageHead from '../components/shared/PageHead'
import { getCurrentWeather, getNearbyFood, getNearbyEvents } from '../services/api'

const CITIES = ['Ahmedabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Jaipur']

export default function CompareCitiesPage() {
  const [city1, setCity1] = useState('Ahmedabad')
  const [city2, setCity2] = useState('Mumbai')
  const [data1, setData1] = useState(null)
  const [data2, setData2] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.allSettled([
      getCurrentWeather(city1),
      getCurrentWeather(city2),
      getNearbyFood({ city: city1 }),
      getNearbyFood({ city: city2 }),
      getNearbyEvents(city1),
      getNearbyEvents(city2),
    ]).then(([w1, w2, f1, f2, e1, e2]) => {
      setData1({
        weather: w1.status === 'fulfilled' ? w1.value.data.data : null,
        food: f1.status === 'fulfilled' ? (f1.value.data.data || []).length : 0,
        events: e1.status === 'fulfilled' ? (e1.value.data.data || []).length : 0,
      })
      setData2({
        weather: w2.status === 'fulfilled' ? w2.value.data.data : null,
        food: f2.status === 'fulfilled' ? (f2.value.data.data || []).length : 0,
        events: e2.status === 'fulfilled' ? (e2.value.data.data || []).length : 0,
      })
      setLoading(false)
    })
  }, [city1, city2])

  const CompareRow = ({ label, val1, val2, higher = 'higher' }) => {
    const n1 = parseFloat(val1) || 0
    const n2 = parseFloat(val2) || 0
    const w1 = higher === 'higher' ? n1 > n2 : n1 < n2
    const w2 = higher === 'higher' ? n2 > n1 : n2 < n1
    return (
      <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100 dark:border-white/5">
        <span className={`text-sm text-right pr-4 ${w1 ? 'text-success font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>{val1}</span>
        <span className="text-xs text-gray-400 text-center">{label}</span>
        <span className={`text-sm pl-4 ${w2 ? 'text-success font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>{val2}</span>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHead title="Compare Cities" description="Compare weather, food and events between cities" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compare Cities</h1>

      <div className="grid grid-cols-2 gap-4">
        <select value={city1} onChange={e => setCity1(e.target.value)} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50">
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={city2} onChange={e => setCity2(e.target.value)} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50">
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading comparison...</div>
      ) : data1 && data2 ? (
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm font-semibold">
            <span className="text-right pr-4 text-primary">{city1}</span>
            <span className="text-center text-gray-400">vs</span>
            <span className="pl-4 text-accent">{city2}</span>
          </div>
          <div className="px-4">
            <CompareRow label="Temperature" val1={data1.weather ? `${data1.weather.temperature}°C` : '—'} val2={data2.weather ? `${data2.weather.temperature}°C` : '—'} higher="lower" />
            <CompareRow label="Humidity" val1={data1.weather ? `${data1.weather.humidity}%` : '—'} val2={data2.weather ? `${data2.weather.humidity}%` : '—'} higher="lower" />
            <CompareRow label="Wind" val1={data1.weather ? `${data1.weather.wind_speed} km/h` : '—'} val2={data2.weather ? `${data2.weather.wind_speed} km/h` : '—'} higher="lower" />
            <CompareRow label="Weather" val1={data1.weather?.condition || '—'} val2={data2.weather?.condition || '—'} />
            <CompareRow label="Restaurants" val1={String(data1.food)} val2={String(data2.food)} />
            <CompareRow label="Events" val1={String(data1.events)} val2={String(data2.events)} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
