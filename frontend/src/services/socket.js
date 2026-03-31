import { io } from 'socket.io-client'
import { SOCKET_URL } from '../utils/constants'

export const sportsSocket = io(`${SOCKET_URL}/sports`, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
})

export const trendingSocket = io(`${SOCKET_URL}/trending`, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
})
