const PREFIX = 'wsidt_'

export function getItem(key) {
  try {
    const item = localStorage.getItem(PREFIX + key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable
  }
}

export function removeItem(key) {
  localStorage.removeItem(PREFIX + key)
}
