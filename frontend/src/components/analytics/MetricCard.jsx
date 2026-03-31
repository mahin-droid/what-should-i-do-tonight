import { useState, useEffect, useRef } from 'react'

function useCountUp(target, duration = 800) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const num = parseInt(target) || 0
    if (num === 0) { setCount(0); return }

    let start = 0
    const increment = num / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= num) {
        setCount(num)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])

  return count
}

export default function MetricCard({ title, value, change, icon, color = 'primary' }) {
  const isPositive = change && change > 0
  const numericValue = parseInt(value) || 0
  const animatedValue = useCountUp(numericValue)
  const suffix = typeof value === 'string' && value.includes('%') ? '%' : ''
  const displayValue = numericValue > 0 ? `${animatedValue}${suffix}` : value

  const colorMap = {
    primary: 'from-primary/20 to-primary/5 border-primary/20',
    accent: 'from-accent/20 to-accent/5 border-accent/20',
    success: 'from-success/20 to-success/5 border-success/20',
    warning: 'from-warning/20 to-warning/5 border-warning/20',
  }

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {change !== undefined && (
          <span className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayValue}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{title}</p>
    </div>
  )
}
