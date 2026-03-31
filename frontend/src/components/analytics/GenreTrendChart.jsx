import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#378ADD', '#7F77DD', '#1D9E75', '#EF9F27', '#E24B4A', '#FF6B9D']

export default function GenreTrendChart({ data, title, subtitle }) {
  if (!data || data.length === 0) return null
  const genres = Object.keys(data[0]).filter(k => k !== 'month')

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3142" />
          <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2D3142', borderRadius: '8px', fontSize: '12px' }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {genres.map((genre, i) => (
            <Line key={genre} type="monotone" dataKey={genre} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
