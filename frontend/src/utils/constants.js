export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

export const MOODS = [
  { id: 'chill', label: 'Chill', emoji: '😌', color: '#378ADD', description: 'Relaxed and laid-back' },
  { id: 'excited', label: 'Excited', emoji: '🤩', color: '#EF9F27', description: 'Pumped and energetic' },
  { id: 'bored', label: 'Bored', emoji: '😴', color: '#7F77DD', description: 'Need something to do' },
  { id: 'social', label: 'Social', emoji: '🎉', color: '#1D9E75', description: 'Want to hang out' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', color: '#FF6B9D', description: 'Feeling lovey-dovey' },
  { id: 'hungry', label: 'Hungry', emoji: '🍕', color: '#E24B4A', description: 'Ready to eat' },
]

export const CATEGORIES = ['All', 'Entertainment', 'Sports', 'Food', 'Travel', 'Events']

export const CATEGORY_ICONS = {
  entertainment: '🎬',
  sports: '🏏',
  food: '🍽️',
  travel: '✈️',
  events: '🎭',
  music: '🎵',
}
