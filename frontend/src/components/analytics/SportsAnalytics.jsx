import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function SportsAnalytics({ data, title, subtitle, insights }) {
  if (!data || data.length === 0) return null

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3142" />
          <XAxis dataKey="match" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2D3142', borderRadius: '8px', fontSize: '12px' }}
          />
          <Bar dataKey="excitement_score" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.excitement_score > 75 ? '#1D9E75' : entry.excitement_score > 50 ? '#EF9F27' : '#E24B4A'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {insights && insights.length > 0 && (
        <div className="mt-4 bg-accent/5 rounded-xl p-3 border border-accent/10">
          <p className="text-xs font-medium text-accent mb-2">Match Insights</p>
          {insights.map((insight, i) => (
            <p key={i} className="text-xs text-gray-500 dark:text-gray-400 mb-1">• {insight}</p>
          ))}
        </div>
      )}
    </div>
  )
}
