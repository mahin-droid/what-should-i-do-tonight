import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react'
import { useWeather } from '../../hooks/useWeather'
import { useUser } from '../../context/UserContext'

export default function WeatherWidget() {
  const { user } = useUser()
  const { weather, loading } = useWeather(user.city)

  if (loading) {
    return (
      <div className="bg-surface-dark rounded-2xl p-5 animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-3" />
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20" />
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="bg-gray-100 dark:bg-surface-dark rounded-2xl p-5 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Weather data unavailable</p>
      </div>
    )
  }

  const ICON_MAP = {
    '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️', '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️', '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️', '50d': '🌫️', '50n': '🌫️',
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/5 dark:from-primary/20 dark:to-accent/10 border border-gray-200 dark:border-white/5 rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{weather.city}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">{Math.round(weather.temperature)}°</span>
            <span className="text-lg text-gray-500 dark:text-gray-400">C</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 capitalize mt-1">{weather.description}</p>
        </div>
        <span className="text-5xl">{ICON_MAP[weather.icon] || '☁️'}</span>
      </div>
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1"><Thermometer size={14} /> Feels {Math.round(weather.feels_like)}°</span>
        <span className="flex items-center gap-1"><Droplets size={14} /> {weather.humidity}%</span>
        <span className="flex items-center gap-1"><Wind size={14} /> {weather.wind_speed} km/h</span>
      </div>
    </div>
  )
}
