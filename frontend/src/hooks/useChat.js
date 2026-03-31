import { useState, useCallback, useEffect } from 'react'
import { sendChatMessage } from '../services/api'
import { useActivity } from '../context/ActivityContext'

export function useChat() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('wsidt_chat')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [loading, setLoading] = useState(false)
  const { track } = useActivity()

  useEffect(() => {
    try { sessionStorage.setItem('wsidt_chat', JSON.stringify(messages.slice(-50))) } catch {}
  }, [messages])

  const send = useCallback(async (text, mood = null) => {
    const userMsg = { role: 'user', content: text, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    track('chatMessages')
    setLoading(true)

    try {
      const res = await sendChatMessage({ message: text, mood })
      const data = res.data?.data || res.data || {}
      const aiMsg = {
        role: 'assistant',
        content: data.reply || 'Sorry, I could not process that. Try again!',
        mood_detected: data.mood_detected,
        recommendations: data.recommendations,
        intent: data.intent,
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, aiMsg])
      return data
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        content: 'Sorry, I couldn\'t connect to the server. Make sure the backend is running on port 8000.',
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, errorMsg])
      return null
    } finally {
      setLoading(false)
    }
  }, [track])

  const clearMessages = () => {
    setMessages([])
    sessionStorage.removeItem('wsidt_chat')
  }

  return { messages, loading, send, clearMessages }
}
