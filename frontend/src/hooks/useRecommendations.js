import { useState, useEffect } from 'react'
import { getRecommendations } from '../services/api'
import { useDataCache } from '../context/DataCacheContext'

export function useRecommendations(mood, city = 'Ahmedabad') {
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { getCached, setCached } = useDataCache()

  useEffect(() => {
    if (!mood) {
      setRecommendations(null)
      return
    }

    const cacheKey = `recs_${mood}_${city}`
    const cached = getCached(cacheKey)
    if (cached) {
      setRecommendations(cached)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    getRecommendations({ mood, city })
      .then(res => {
        if (!cancelled) {
          setRecommendations(res.data.data)
          setCached(cacheKey, res.data.data)
        }
      })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [mood, city])

  return { recommendations, loading, error }
}
