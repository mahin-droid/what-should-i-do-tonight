import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const DATA = [
  { day: 'Mon', activity: 45 },
  { day: 'Tue', activity: 52 },
  { day: 'Wed', activity: 38 },
  { day: 'Thu', activity: 65 },
  { day: 'Fri', activity: 78 },
  { day: 'Sat', activity: 92 },
  { day: 'Sun', activity: 85 },
]

export default function ActivityChart() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-200 dark:border-white/5">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">📊 Weekly Activity</h3>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={DATA}>
          <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2D3142', borderRadius: '8px', fontSize: '12px' }}
            labelStyle={{ color: '#fff' }}
          />
          <Bar dataKey="activity" fill="#378ADD" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
