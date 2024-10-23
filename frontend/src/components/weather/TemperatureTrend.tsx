import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailySummary } from '../../types/weather';
import { format } from 'date-fns';

interface Props {
  data: DailySummary[];
}

export const TemperatureTrend: React.FC<Props> = ({ data }) => {
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM dd'),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperature Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}°C`]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avg_temp"
                stroke="#8884d8"
                name="Average Temperature"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="max_temp"
                stroke="#82ca9d"
                name="Max Temperature"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="min_temp"
                stroke="#ff7300"
                name="Min Temperature"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};