import { createContext, useContext, useState, useCallback } from 'react'
import { getItem, setItem } from '../services/storage'

const BookmarkContext = createContext()

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => getItem('bookmarks') || [])

  const addBookmark = useCallback((item) => {
    setBookmarks(prev => {
      const id = item.id || item.match_id || item.destination || item.name
      if (prev.some(b => (b.id || b.match_id || b.destination || b.name) === id)) return prev
      const updated = [{ ...item, savedAt: Date.now() }, ...prev]
      setItem('bookmarks', updated)
      return updated
    })
  }, [])

  const removeBookmark = useCallback((item) => {
    setBookmarks(prev => {
      const id = item.id || item.match_id || item.destination || item.name
      const updated = prev.filter(b => (b.id || b.match_id || b.destination || b.name) !== id)
      setItem('bookmarks', updated)
      return updated
    })
  }, [])

  const isBookmarked = useCallback((item) => {
    const id = item.id || item.match_id || item.destination || item.name
    return bookmarks.some(b => (b.id || b.match_id || b.destination || b.name) === id)
  }, [bookmarks])

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  )
}

export function useBookmarks() {
  const context = useContext(BookmarkContext)
  if (!context) throw new Error('useBookmarks must be used within BookmarkProvider')
  return context
}
