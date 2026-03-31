import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function CuisineDonut({ data, title, subtitle }) {
  if (!data || data.length === 0) return null

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-white/5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color || '#378ADD'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2D3142', borderRadius: '8px', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
