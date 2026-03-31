import { useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What should you do tonight?</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ask me anything! I can recommend movies, restaurants, plan trips, check live sports, and more.</p>
        </div>
      )}
      {messages.map((msg, i) => (
        <ChatMessage key={i} message={msg} />
      ))}
      {loading && (
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm flex-shrink-0">🤖</span>
          <div className="bg-gray-100 dark:bg-surface-dark rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-200 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Analyzing your request...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
