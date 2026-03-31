import { useEffect } from 'react'

export default function KeyboardShortcuts({ onSearch }) {
  useEffect(() => {
    function handleKeyDown(e) {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        onSearch?.()
      }
      // Escape to close any open modal (handled by modals themselves)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSearch])

  return null
}
