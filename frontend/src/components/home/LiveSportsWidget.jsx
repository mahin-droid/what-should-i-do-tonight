import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Badge from '../shared/Badge'
import { SkeletonMatch } from '../shared/Skeleton'
import { getLiveSports, getUpcomingSports } from '../../services/api'
import { useDataCache } from '../../context/DataCacheContext'
import { useToast } from '../shared/Toast'
import { useNotifications } from '../../context/NotificationContext'

const SPORTS = [
  { id: 'all', name: 'All', icon: '🏆' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'hockey', name: 'Hockey', icon: '🏒' },
  { id: 'badminton', name: 'Badminton', icon: '🏸' },
]

function ScoreDisplay({ match }) {
  const { sport, score, teams } = match
  if (!score) return null

  if (score.display) return <span>{score.display}</span>

  if (sport === 'cricket' && score.runs !== undefined) {
    return <span>{score.batting_team}: {score.runs}/{score.wickets} ({score.overs} ov)</span>
  }
  if (score.home !== undefined) {
    return <span>{score.home} - {score.away}{score.minute ? ` (${score.minute}')` : ''}</span>
  }
  return null
}

export default function LiveSportsWidget() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [sport, setSport] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const { getCached, setCached } = useDataCache()
  const { addToast } = useToast()
  const { addNotification } = useNotifications()

  useEffect(() => {
    let cancelled = false
    const cacheKey = `sports_${sport}`
    const cached = getCached(cacheKey)
    if (cached) {
      setMatches(cached)
      setLoading(false)
      return
    }

    setLoading(true)

    async function fetchMatches() {
      try {
        const sportParam = sport === 'all' ? null : sport
        const [liveRes, upcomingRes] = await Promise.allSettled([
          getLiveSports(sportParam),
          getUpcomingSports(sportParam),
        ])
        if (cancelled) return
        const live = liveRes.status === 'fulfilled' ? (liveRes.value.data.data || []) : []
        const upcoming = upcomingRes.status === 'fulfilled' ? (upcomingRes.value.data.data || []).slice(0, 5) : []
        const result = [...live, ...upcoming].slice(0, 6)
        setMatches(result)
        setCached(cacheKey, result)
        // Notify about live matches
        const liveOnes = result.filter(m => m.status === 'live')
        if (liveOnes.length > 0 && !getCached('notified_live')) {
          const match = liveOnes[0]
          const teams = match.teams?.join(' vs ') || 'Match'
          addToast(`🔴 LIVE: ${teams} — ${match.league}`, 'sport')
          addNotification(`${teams} is LIVE now! ${match.league}`, 'sport')
          setCached('notified_live', true)
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchMatches()
    const interval = setInterval(fetchMatches, 60000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [sport])

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
        🏆 Live & Upcoming Matches
      </h3>

      {/* Sport Filters */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        {SPORTS.map(s => (
          <button
            key={s.id}
            onClick={() => setSport(s.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
              sport === s.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-surface-dark text-gray-500 dark:text-gray-400 hover:text-primary border border-gray-200 dark:border-white/5'
            }`}
          >
            <span>{s.icon}</span>
            <span className="hidden sm:inline">{s.name}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => <SkeletonMatch key={i} />)}
        </div>
      ) : matches.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No matches found for this sport</p>
      ) : (
        matches.map((match, i) => (
          <motion.div
            key={match.match_id || i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setExpanded(expanded === match.match_id ? null : match.match_id)}
            className="bg-gray-50 dark:bg-surface-dark rounded-xl p-3 border border-gray-200 dark:border-white/5 cursor-pointer hover:border-primary/30 transition"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[60%]">{match.league}</span>
              <Badge
                text={match.status === 'live' ? 'LIVE' : match.status === 'completed' ? 'FT' : 'Upcoming'}
                variant={match.status === 'live' ? 'live' : match.status === 'completed' ? 'default' : 'primary'}
                pulse={match.status === 'live'}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{match.teams.join(' vs ')}</p>
                {match.score && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    <ScoreDisplay match={match} />
                  </p>
                )}
                {match.status === 'upcoming' && match.start_time && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(match.start_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    {match.venue ? ` · ${match.venue}` : ''}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end ml-2">
                <div className="w-14 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-success to-warning rounded-full transition-all duration-500"
                    style={{ width: `${match.excitement_score}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{match.excitement_score}% hype</span>
              </div>
            </div>
            {expanded === match.match_id && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-white/5 text-xs space-y-1">
                {match.venue && <p className="text-gray-500 dark:text-gray-400">📍 {match.venue}</p>}
                {match.start_time && <p className="text-gray-500 dark:text-gray-400">🕐 {new Date(match.start_time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>}
                {match.round && <p className="text-gray-500 dark:text-gray-400">🏆 Round {match.round}</p>}
                <p className="text-gray-400">Sport: {match.sport} · Hype: {match.excitement_score}/100</p>
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  )
}
