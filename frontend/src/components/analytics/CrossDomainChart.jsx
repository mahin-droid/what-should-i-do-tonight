import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = { 'OTT Streaming': '#378ADD', 'Food Orders': '#EF9F27', 'Sports Viewers': '#1D9E75', 'Outings': '#7F77DD' }

export default function CrossDomainChart({ data, title, subtitle, insights }) {
  if (!data || data.length === 0) return null
  const keys = Object.keys(data[0]).filter(k => k !== 'day')

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3142" />
          <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2D3142', borderRadius: '8px', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {keys.map((key) => (
            <Bar key={key} dataKey={key} fill={COLORS[key] || '#378ADD'} radius={[2, 2, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      {insights && insights.length > 0 && (
        <div className="mt-4 bg-primary/5 rounded-xl p-3 border border-primary/10">
          <p className="text-xs font-medium text-primary mb-2">AI Insights</p>
          {insights.map((insight, i) => (
            <p key={i} className="text-xs text-gray-500 dark:text-gray-400 mb-1">• {insight}</p>
          ))}
        </div>
      )}
    </div>
  )
}
