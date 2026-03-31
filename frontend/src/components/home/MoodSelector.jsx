import { motion } from 'framer-motion'
import { MOODS } from '../../utils/constants'
import { useMood } from '../../context/MoodContext'

export default function MoodSelector() {
  const { mood, setMood, clearMood } = useMood()

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">How are you feeling tonight?</h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {MOODS.map((m) => {
          const active = mood === m.id
          return (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => active ? clearMood() : setMood(m.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                active
                  ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20'
                  : 'border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-surface-dark hover:border-gray-300 dark:hover:border-white/10'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                {m.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
