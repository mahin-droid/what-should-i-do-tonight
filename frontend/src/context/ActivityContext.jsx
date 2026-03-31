import { createContext, useContext, useState, useCallback } from 'react'
import { getItem, setItem } from '../services/storage'

const ActivityContext = createContext()

export function ActivityProvider({ children }) {
  const [activity, setActivity] = useState(() => {
    const saved = getItem('activity') || {}
    const today = new Date().toISOString().slice(0, 10)
    if (saved.date !== today) {
      return { date: today, searches: 0, moodSelections: 0, bookmarks: 0, chatMessages: 0, pageViews: 0 }
    }
    return saved
  })

  const track = useCallback((type) => {
    setActivity(prev => {
      const updated = { ...prev, [type]: (prev[type] || 0) + 1 }
      setItem('activity', updated)
      return updated
    })
  }, [])

  return (
    <ActivityContext.Provider value={{ activity, track }}>
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const context = useContext(ActivityContext)
  if (!context) throw new Error('useActivity must be used within ActivityProvider')
  return context
}
