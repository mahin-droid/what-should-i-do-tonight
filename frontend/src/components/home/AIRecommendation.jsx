import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useMood } from '../../context/MoodContext'
import { useRecommendations } from '../../hooks/useRecommendations'
import { useUser } from '../../context/UserContext'
import LoadingSpinner from '../shared/LoadingSpinner'

const CATEGORY_ICONS = { entertainment: '🎬', food: '🍽️', sports: '🏏', travel: '✈️', events: '🎭', music: '🎵' }

export default function AIRecommendation() {
  const { mood } = useMood()
  const { user } = useUser()
  const { recommendations, loading } = useRecommendations(mood, user.city)

  if (!mood) {
    return (
      <div className="border border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-8 text-center">
        <Sparkles className="mx-auto text-primary mb-3" size={32} />
        <p className="text-gray-500 dark:text-gray-400">Select your mood above to get AI-powered recommendations</p>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner text="AI is crafting your perfect evening..." />
  }

  if (!recommendations && !loading && mood) {
    return (
      <div className="border border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Couldn't load recommendations. Try selecting a different mood.</p>
      </div>
    )
  }

  if (!recommendations) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mood}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-primary/20 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-primary" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{recommendations.plan_title}</h3>
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{recommendations.confidence}% match</span>
        </div>
        <div className="space-y-3">
          {recommendations.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 items-start"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-surface-dark flex items-center justify-center text-sm">
                {CATEGORY_ICONS[step.category] || '📌'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{step.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{step.description}</p>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0">{step.confidence}%</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
