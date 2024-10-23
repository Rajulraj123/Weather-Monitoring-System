import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { DailySummary as DailySummaryType } from '../../types/weather';

interface Props {
  data: DailySummaryType;
}

export const DailySummary: React.FC<Props> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-sm font-semibold">Average</div>
              <div className="text-xl">{data.avg_temp.toFixed(1)}°C</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-sm font-semibold">Maximum</div>
              <div className="text-xl">{data.max_temp.toFixed(1)}°C</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-sm font-semibold">Minimum</div>
              <div className="text-xl">{data.min_temp.toFixed(1)}°C</div>
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-sm font-semibold">Average Humidity</div>
            <div className="text-xl">{data.avg_humidity}%</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-sm font-semibold">Dominant Condition</div>
            <div className="text-xl">{data.dominant_condition}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};