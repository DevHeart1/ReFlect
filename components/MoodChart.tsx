import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { MoodCheckin } from '../utils/storage';

interface MoodChartProps {
  moods: MoodCheckin[];
}

export const MoodChart: React.FC<MoodChartProps> = ({ moods }) => {
  const data = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const chartData = [];

    // Use passed moods instead of querying DB
    const recentMoods = moods || [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];

      // Find avg mood for this day
      const dayStr = d.toDateString();
      const dayMoods = recentMoods.filter(m => new Date(m.date).toDateString() === dayStr);

      let value = 0;
      if (dayMoods.length > 0) {
        const sum = dayMoods.reduce((acc, curr) => acc + (Number(curr.moodValue) || 3), 0); // Default to 3 if missing or invalid
        const rawValue = (sum / dayMoods.length) * 20;
        value = Number.isFinite(rawValue) ? rawValue : 0; // Ensure no NaNs
      }

      chartData.push({ day: dayName, value });
    }
    return chartData;
  }, [moods]);
  if (!data || data.length === 0) return <div className="h-[160px] w-full bg-gray-50 dark:bg-gray-800/20 rounded-xl animate-pulse"></div>;

  return (
    <div className="w-full h-[160px]" style={{ minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#CCAB48" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#CCAB48" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
            dy={10}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={[0, 100]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#CCAB48"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
