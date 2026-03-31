import { useState, useEffect } from 'react'
import { useDataCache } from '../../context/DataCacheContext'
import { getEntertainmentTrending, getLiveSports } from '../../services/api'

export default function TrendingTicker() {
  const [items, setItems] = useState([])
  const { getCached, setCached } = useDataCache()

  useEffect(() => {
    const cached = getCached('ticker')
    if (cached) { setItems(cached); return }

    async function fetch() {
      try {
        const [ent, sports] = await Promise.allSettled([getEntertainmentTrending(), getLiveSports()])
        const tickers = []
        if (ent.status === 'fulfilled') {
          (ent.value.data.data || []).slice(0, 5).forEach(i => tickers.push(`🎬 ${i.title} (${i.rating}⭐)`))
        }
        if (sports.status === 'fulfilled') {
          (sports.value.data.data || []).slice(0, 3).forEach(m => {
            const teams = m.teams?.join(' vs ') || 'Match'
            const status = m.status === 'live' ? '🔴 LIVE' : '📅 Upcoming'
            tickers.push(`${m.sport === 'cricket' ? '🏏' : '⚽'} ${teams} — ${status}`)
          })
        }
        if (tickers.length === 0) tickers.push('🔥 Welcome! Select your mood to get started')
        setItems(tickers)
        setCached('ticker', tickers)
      } catch {
        setItems(['🔥 Welcome to What Should I Do Tonight?'])
      }
    }
    fetch()
  }, [])

  if (items.length === 0) return null

  return (
    <div className="overflow-hidden bg-primary/5 border border-primary/10 rounded-xl px-4 py-2">
      <div className="flex gap-8 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">{item}</span>
        ))}
      </div>
    </div>
  )
}
