import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function PriceRatingChart({ data, title, subtitle }) {
  if (!data || data.length === 0) return null

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3142" />
          <XAxis type="number" domain={[0, 5]} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <YAxis type="category" dataKey="category" tick={{ fill: '#9CA3AF', fontSize: 11 }} width={100} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2D3142', borderRadius: '8px', fontSize: '12px' }}
          />
          <Bar dataKey="rating" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color || '#378ADD'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
