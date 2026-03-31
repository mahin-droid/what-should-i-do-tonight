import { motion } from 'framer-motion'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
        isUser ? 'bg-primary/20' : 'bg-accent/20'
      }`}>
        {isUser ? '👤' : '🤖'}
      </span>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-primary text-white rounded-tr-sm'
          : 'bg-gray-100 dark:bg-surface-dark text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-200 dark:border-white/5'
      }`}>
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content.split('**').map((part, i) =>
            i % 2 === 1
              ? <strong key={i} className="font-semibold">{part}</strong>
              : <span key={i}>{part}</span>
          )}
        </div>
        {message.mood_detected && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Mood: {message.mood_detected}</p>
        )}
      </div>
    </motion.div>
  )
}
