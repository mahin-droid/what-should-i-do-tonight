import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

export default function RefreshButton({ onRefresh }) {
  const [spinning, setSpinning] = useState(false)

  const handleClick = async () => {
    setSpinning(true)
    try {
      await onRefresh?.()
    } catch {}
    setTimeout(() => setSpinning(false), 1000)
  }

  return (
    <button
      onClick={handleClick}
      disabled={spinning}
      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-primary/5 transition disabled:opacity-50"
      title="Refresh data"
    >
      <RefreshCw size={16} className={spinning ? 'animate-spin' : ''} />
    </button>
  )
}
