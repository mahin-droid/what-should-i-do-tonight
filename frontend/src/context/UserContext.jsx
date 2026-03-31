import { createContext, useContext, useState, useEffect } from 'react'
import { getItem, setItem } from '../services/storage'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUserState] = useState(() => getItem('user') || {
    city: 'Ahmedabad',
    darkMode: true,
    preferences: { cuisines: [], sports: [], genres: [], budget: 'medium' },
  })

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUserState(updated)
    setItem('user', updated)
  }

  const toggleDarkMode = () => {
    const newMode = !user.darkMode
    updateUser({ darkMode: newMode })
    document.documentElement.classList.toggle('dark', newMode)
  }

  const detectLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const cities = [
            { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
            { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
            { name: 'Delhi', lat: 28.6139, lon: 77.209 },
            { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
            { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
            { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
            { name: 'Pune', lat: 18.5204, lon: 73.8567 },
            { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
            { name: 'Hyderabad', lat: 17.385, lon: 78.4867 },
            { name: 'Goa', lat: 15.2993, lon: 74.124 },
          ]
          let nearest = cities[0]
          let minDist = Infinity
          for (const city of cities) {
            const dist = Math.sqrt(Math.pow(city.lat - latitude, 2) + Math.pow(city.lon - longitude, 2))
            if (dist < minDist) {
              minDist = dist
              nearest = city
            }
          }
          updateUser({ city: nearest.name })
        } catch {}
      },
      () => {}
    )
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', user.darkMode)
  }, [])

  return (
    <UserContext.Provider value={{ user, updateUser, toggleDarkMode, detectLocation }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}
