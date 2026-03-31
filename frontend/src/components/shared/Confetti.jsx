import { useEffect, useState } from 'react'

const COLORS = ['#378ADD', '#7F77DD', '#1D9E75', '#EF9F27', '#E24B4A', '#FF6B9D', '#4ECDC4']

function ConfettiPiece({ delay }) {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  const left = Math.random() * 100
  const size = Math.random() * 8 + 4
  const duration = Math.random() * 2 + 2

  return (
    <div
      className="absolute top-0 opacity-0"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        animation: `confettiFall ${duration}s ease-in ${delay}s forwards`,
      }}
    />
  )
}

export default function Confetti({ active }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (active) {
      setPieces(Array.from({ length: 50 }, (_, i) => i))
      const timer = setTimeout(() => setPieces([]), 4000)
      return () => clearTimeout(timer)
    }
  }, [active])

  if (pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
      {pieces.map(i => (
        <ConfettiPiece key={i} delay={Math.random() * 0.5} />
      ))}
    </div>
  )
}
