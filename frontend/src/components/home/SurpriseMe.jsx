import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import { getRecommendations } from '../../services/api'

const MOODS = ['chill', 'excited', 'bored', 'social', 'romantic', 'hungry']
const EMOJIS = { chill: '😌', excited: '🤩', bored: '😴', social: '🎉', romantic: '💕', hungry: '🍕' }

export default function SurpriseMe() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [randomMood, setRandomMood] = useState(null)

  const handleSurprise = async () => {
    setLoading(true)
    const mood = MOODS[Math.floor(Math.random() * MOODS.length)]
    setRandomMood(mood)
    try {
      const res = await getRecommendations({ mood, city: 'Ahmedabad' })
      const data = res.data?.data
      if (data && data.steps && data.steps.length > 0) {
        const randomStep = data.steps[Math.floor(Math.random() * data.steps.length)]
        setResult(randomStep)
      }
    } catch {
      setResult({ title: 'Go for a walk!', description: 'Sometimes the best plan is no plan.', category: 'events' })
    } finally {
      setLoading(false)
    }
  }

  const CATEGORY_ICONS = { entertainment: '🎬', food: '🍽️', sports: '🏏', travel: '✈️', events: '🎭', music: '🎵' }

  return (
    <div className="bg-gradient-to-r from-accent/10 to-pink/10 border border-accent/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Feeling lucky?</h3>
        <button
          onClick={handleSurprise}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/80 transition disabled:opacity-50"
        >
          <Shuffle size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Shuffling...' : 'Surprise Me!'}
        </button>
      </div>
      {result && (
        <div className="flex items-start gap-3 bg-white/50 dark:bg-white/5 rounded-xl p-3">
          <span className="text-2xl">{CATEGORY_ICONS[result.category] || '🎯'}</span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{result.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{result.description}</p>
            {randomMood && <p className="text-xs text-accent mt-1">Mood: {EMOJIS[randomMood]} {randomMood}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
