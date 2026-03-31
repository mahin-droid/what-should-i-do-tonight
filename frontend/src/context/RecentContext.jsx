import { createContext, useContext, useState, useCallback } from 'react'
import { getItem, setItem } from '../services/storage'

const RecentContext = createContext()

export function RecentProvider({ children }) {
  const [recentItems, setRecentItems] = useState(() => getItem('recent_viewed') || [])

  const addRecent = useCallback((item) => {
    setRecentItems(prev => {
      const id = item.id || item.match_id || item.destination || item.name
      const filtered = prev.filter(r => (r.id || r.match_id || r.destination || r.name) !== id)
      const updated = [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, 10)
      setItem('recent_viewed', updated)
      return updated
    })
  }, [])

  return (
    <RecentContext.Provider value={{ recentItems, addRecent }}>
      {children}
    </RecentContext.Provider>
  )
}

export function useRecent() {
  const context = useContext(RecentContext)
  if (!context) throw new Error('useRecent must be used within RecentProvider')
  return context
}
