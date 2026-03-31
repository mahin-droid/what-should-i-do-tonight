import { useWeather } from '../../hooks/useWeather'
import { useUser } from '../../context/UserContext'

const WEATHER_GRADIENTS = {
  Clear: 'from-amber-500/10 via-orange-400/5 to-transparent',
  'Mainly Clear': 'from-amber-400/8 via-yellow-300/5 to-transparent',
  'Partly Cloudy': 'from-blue-400/10 via-gray-300/5 to-transparent',
  Overcast: 'from-gray-500/15 via-gray-400/8 to-transparent',
  Fog: 'from-gray-400/20 via-gray-300/10 to-transparent',
  Rain: 'from-blue-600/15 via-indigo-500/8 to-transparent',
  'Light Rain': 'from-blue-500/12 via-blue-400/6 to-transparent',
  'Light Drizzle': 'from-blue-400/10 via-blue-300/5 to-transparent',
  Drizzle: 'from-blue-500/12 via-blue-400/6 to-transparent',
  'Heavy Rain': 'from-indigo-700/20 via-blue-600/10 to-transparent',
  Thunderstorm: 'from-purple-800/20 via-indigo-600/10 to-transparent',
  Snow: 'from-blue-200/20 via-white/10 to-transparent',
  'Light Showers': 'from-blue-500/12 via-blue-400/6 to-transparent',
  Showers: 'from-blue-600/15 via-indigo-500/8 to-transparent',
}

const WEATHER_PARTICLES = {
  Rain: '🌧️',
  'Light Rain': '🌦️',
  'Heavy Rain': '⛈️',
  Thunderstorm: '⚡',
  Snow: '❄️',
  Clear: '☀️',
}

export default function WeatherBackground() {
  const { user } = useUser()
  const { weather } = useWeather(user.city)

  if (!weather) return null

  const condition = weather.condition || 'Clear'
  const gradient = WEATHER_GRADIENTS[condition] || WEATHER_GRADIENTS['Partly Cloudy']
  const hour = new Date().getHours()
  const isNight = hour < 6 || hour >= 20

  const nightOverlay = isNight ? 'from-indigo-900/15 via-blue-900/8 to-transparent' : gradient

  return (
    <div className="fixed inset-x-0 top-16 h-64 pointer-events-none z-0 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${nightOverlay}`} />
      {isNight && (
        <div className="absolute inset-0 opacity-30">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
