import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { MoodData } from '../types';

const data: MoodData[] = [
  { day: 'Mon', value: 30 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 65 },
  { day: 'Thu', value: 50 },
  { day: 'Fri', value: 45 },
  { day: 'Sat', value: 75 },
  { day: 'Sun', value: 85 },
];

export const MoodChart: React.FC = () => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#CCAB48" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#CCAB48" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
           <YAxis hide domain={[0, 100]} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#CCAB48" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
