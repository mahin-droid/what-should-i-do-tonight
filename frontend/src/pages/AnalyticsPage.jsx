import { useState, useEffect } from 'react'
import PageHead from '../components/shared/PageHead'
import MetricCard from '../components/analytics/MetricCard'
import GenreTrendChart from '../components/analytics/GenreTrendChart'
import ActivityHeatmap from '../components/analytics/ActivityHeatmap'
import CuisineDonut from '../components/analytics/CuisineDonut'
import PriceRatingChart from '../components/analytics/PriceRatingChart'
import CrossDomainChart from '../components/analytics/CrossDomainChart'
import SportsAnalytics from '../components/analytics/SportsAnalytics'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { useUser } from '../context/UserContext'
import { useDataCache } from '../context/DataCacheContext'
import {
  getGenreTrends, getActivityHeatmap, getCuisineDistribution,
  getPriceRating, getCrossDomain, getSportsStats,
} from '../services/api'

export default function AnalyticsPage() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const { getCached, setCached } = useDataCache()

  useEffect(() => {
    const cacheKey = `analytics_${user.city}`
    const cached = getCached(cacheKey)
    if (cached) {
      setData(cached)
      setLoading(false)
      return
    }

    let cancelled = false
    async function fetchAll() {
      try {
        const [genres, heatmap, cuisine, price, cross, sports] = await Promise.allSettled([
          getGenreTrends(),
          getActivityHeatmap(),
          getCuisineDistribution(user.city),
          getPriceRating(),
          getCrossDomain(),
          getSportsStats(),
        ])

        if (!cancelled) {
          const result = {
            genres: genres.status === 'fulfilled' ? genres.value.data : null,
            heatmap: heatmap.status === 'fulfilled' ? heatmap.value.data : null,
            cuisine: cuisine.status === 'fulfilled' ? cuisine.value.data : null,
            price: price.status === 'fulfilled' ? price.value.data : null,
            cross: cross.status === 'fulfilled' ? cross.value.data : null,
            sports: sports.status === 'fulfilled' ? sports.value.data : null,
          }
          setData(result)
          setCached(cacheKey, result)
        }
      } catch {
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [user.city])

  if (loading && Object.keys(data).length === 0) return <LoadingSpinner text="Loading analytics dashboard..." />

  return (
    <div className="space-y-6">
      <PageHead title="Analytics" description="Data insights across entertainment, food, sports and travel" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          title="Trending Shows"
          value={data.genres?.data?.length ? String(data.genres.data.reduce((sum, d) => sum + Object.keys(d).filter(k => k !== 'month').length, 0) / data.genres.data.length | 0) : '—'}
          change={12} icon="📺" color="primary"
        />
        <MetricCard
          title="Live Matches"
          value={data.sports?.data?.length ? String(data.sports.data.filter(m => m.excitement_score > 50).length) : '—'}
          change={5} icon="🏏" color="success"
        />
        <MetricCard
          title="Cuisine Types"
          value={data.cuisine?.data?.length ? String(data.cuisine.data.length) : '—'}
          change={3} icon="🍽️" color="warning"
        />
        <MetricCard
          title="Excitement Avg"
          value={data.sports?.data?.length ? Math.round(data.sports.data.reduce((s, m) => s + m.excitement_score, 0) / data.sports.data.length) + '%' : '—'}
          change={8} icon="⚡" color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.genres && (
          <GenreTrendChart data={data.genres.data} title={data.genres.title} subtitle={data.genres.subtitle} />
        )}
        {data.heatmap && (
          <ActivityHeatmap data={data.heatmap.data} title={data.heatmap.title} subtitle={data.heatmap.subtitle} />
        )}
        {data.cuisine && (
          <CuisineDonut data={data.cuisine.data} title={data.cuisine.title} subtitle={data.cuisine.subtitle} />
        )}
        {data.price && (
          <PriceRatingChart data={data.price.data} title={data.price.title} subtitle={data.price.subtitle} />
        )}
      </div>

      {data.cross && (
        <CrossDomainChart data={data.cross.data} title={data.cross.title} subtitle={data.cross.subtitle} insights={data.cross.insights} />
      )}

      {data.sports && (
        <SportsAnalytics data={data.sports.data} title={data.sports.title} subtitle={data.sports.subtitle} insights={data.sports.insights} />
      )}
    </div>
  )
}
