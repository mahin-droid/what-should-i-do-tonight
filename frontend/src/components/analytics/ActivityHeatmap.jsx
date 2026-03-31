const INTENSITY_COLORS = [
  { min: 0, max: 25, bg: 'bg-blue-900/30', text: 'text-blue-300' },
  { min: 25, max: 50, bg: 'bg-blue-800/40', text: 'text-blue-200' },
  { min: 50, max: 75, bg: 'bg-blue-600/50', text: 'text-blue-100' },
  { min: 75, max: 100, bg: 'bg-blue-500/60', text: 'text-white' },
]

function getIntensityClass(value) {
  const match = INTENSITY_COLORS.find(c => value >= c.min && value < c.max) || INTENSITY_COLORS[3]
  return `${match.bg} ${match.text}`
}

export default function ActivityHeatmap({ data, title, subtitle }) {
  if (!data || data.length === 0) return null
  const categories = Object.keys(data[0]).filter(k => k !== 'time')

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{subtitle}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-gray-500 py-2 pr-3">Time</th>
              {categories.map(c => (
                <th key={c} className="text-center text-gray-500 py-2 px-2">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td className="text-gray-400 py-1.5 pr-3 font-medium">{row.time}</td>
                {categories.map(c => (
                  <td key={c} className="py-1.5 px-1">
                    <div className={`rounded-lg px-2 py-1.5 text-center font-medium ${getIntensityClass(row[c])}`}>
                      {row[c]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
