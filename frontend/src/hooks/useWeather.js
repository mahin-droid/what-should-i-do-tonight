import { useState, useEffect } from 'react'
import { getCurrentWeather } from '../services/api'
import { useDataCache } from '../context/DataCacheContext'

export function useWeather(city = 'Ahmedabad') {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getCached, setCached } = useDataCache()

  useEffect(() => {
    const cached = getCached(`weather_${city}`)
    if (cached) {
      setWeather(cached)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    getCurrentWeather(city)
      .then(res => {
        if (!cancelled) {
          setWeather(res.data.data)
          setCached(`weather_${city}`, res.data.data)
        }
      })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [city])

  return { weather, loading, error }
}
