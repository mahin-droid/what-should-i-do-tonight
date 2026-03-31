import { createContext, useContext, useState, useCallback } from 'react'
import { getItem, setItem } from '../services/storage'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => getItem('favorites') || [])

  const toggleFavorite = useCallback((item) => {
    setFavorites(prev => {
      const id = item.id || item.match_id || item.destination || item.name
      const exists = prev.some(f => (f.id || f.match_id || f.destination || f.name) === id)
      let updated
      if (exists) {
        updated = prev.filter(f => (f.id || f.match_id || f.destination || f.name) !== id)
      } else {
        updated = [{ ...item, favoritedAt: Date.now() }, ...prev].slice(0, 10)
      }
      setItem('favorites', updated)
      return updated
    })
  }, [])

  const isFavorite = useCallback((item) => {
    const id = item.id || item.match_id || item.destination || item.name
    return favorites.some(f => (f.id || f.match_id || f.destination || f.name) === id)
  }, [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider')
  return context
}
