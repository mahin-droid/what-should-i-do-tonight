export function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

export function getGreeting() {
  const time = getTimeOfDay()
  const greetings = {
    morning: 'Good Morning',
    afternoon: 'Good Afternoon',
    evening: 'Good Evening',
    night: 'Hey Night Owl',
  }
  return greetings[time]
}

export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function getTimeEmoji() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 8) return '🌅'
  if (hour >= 8 && hour < 12) return '☀️'
  if (hour >= 12 && hour < 17) return '🌤️'
  if (hour >= 17 && hour < 20) return '🌆'
  if (hour >= 20 && hour < 23) return '🌙'
  return '🌃'
}

export function getTimeSuggestion() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 10) return 'Start your day with a plan!'
  if (hour >= 10 && hour < 14) return 'Lunchtime — check out nearby food spots!'
  if (hour >= 14 && hour < 17) return 'Afternoon vibes — catch up on trending shows'
  if (hour >= 17 && hour < 20) return 'Evening plans? Let me help you decide!'
  if (hour >= 20 && hour < 23) return "Night owl? Here's what's hot tonight"
  return 'Late night — perfect for movies or a midnight snack!'
}
