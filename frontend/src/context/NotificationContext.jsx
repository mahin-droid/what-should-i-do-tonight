import { createContext, useContext, useState, useCallback } from 'react'
import { getItem, setItem } from '../services/storage'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => getItem('notifications') || [])
  const [unreadCount, setUnreadCount] = useState(() => {
    const saved = getItem('notifications') || []
    return saved.filter(n => !n.read).length
  })

  const addNotification = useCallback((message, type = 'info') => {
    const notification = { id: Date.now(), message, type, read: false, timestamp: Date.now() }
    setNotifications(prev => {
      const updated = [notification, ...prev].slice(0, 20) // Keep last 20
      setItem('notifications', updated)
      return updated
    })
    setUnreadCount(prev => prev + 1)
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }))
      setItem('notifications', updated)
      return updated
    })
    setUnreadCount(0)
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
    setItem('notifications', [])
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used within NotificationProvider')
  return context
}
