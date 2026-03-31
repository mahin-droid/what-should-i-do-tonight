import { createContext, useContext, useState, useEffect } from 'react'
import { getItem, setItem } from '../services/storage'

const MoodContext = createContext()

export function MoodProvider({ children }) {
  const [mood, setMoodState] = useState(() => getItem('mood') || null)

  const setMood = (newMood) => {
    setMoodState(newMood)
    setItem('mood', newMood)
    const moodColors = {
      chill: '55, 138, 221',      // blue
      excited: '239, 159, 39',     // amber
      bored: '127, 119, 221',      // purple
      social: '29, 158, 117',      // green
      romantic: '255, 107, 157',   // pink
      hungry: '226, 75, 74',       // red
    }
    document.documentElement.style.setProperty('--mood-color', moodColors[newMood] || '55, 138, 221')
  }

  const clearMood = () => {
    setMoodState(null)
    setItem('mood', null)
    document.documentElement.style.removeProperty('--mood-color')
  }

  return (
    <MoodContext.Provider value={{ mood, setMood, clearMood }}>
      {children}
    </MoodContext.Provider>
  )
}

export function useMood() {
  const context = useContext(MoodContext)
  if (!context) throw new Error('useMood must be used within MoodProvider')
  return context
}
