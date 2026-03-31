import { useState, useEffect } from 'react'
import { sportsSocket } from '../services/socket'

export function useSportsLive() {
  const [matches, setMatches] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    sportsSocket.connect()

    sportsSocket.on('initial_state', (data) => {
      setMatches(data)
    })

    sportsSocket.on('score_update', (data) => {
      setMatches(data)
    })

    sportsSocket.on('wicket_fall', (data) => {
      setEvents(prev => [{ type: 'wicket', ...data, timestamp: Date.now() }, ...prev].slice(0, 10))
    })

    sportsSocket.on('goal_scored', (data) => {
      setEvents(prev => [{ type: 'goal', ...data, timestamp: Date.now() }, ...prev].slice(0, 10))
    })

    sportsSocket.on('match_ended', (data) => {
      setEvents(prev => [{ type: 'match_ended', ...data, timestamp: Date.now() }, ...prev].slice(0, 10))
    })

    return () => {
      sportsSocket.off('initial_state')
      sportsSocket.off('score_update')
      sportsSocket.off('wicket_fall')
      sportsSocket.off('goal_scored')
      sportsSocket.off('match_ended')
      sportsSocket.disconnect()
    }
  }, [])

  return { matches, events }
}
