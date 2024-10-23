import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { WeatherData } from '../../types/weather';

interface Props {
  data: WeatherData;
}

export const CurrentWeather: React.FC<Props> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-lg font-semibold">Temperature</div>
              <div className="text-3xl">{data.temperature.toFixed(1)}°C</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-lg font-semibold">Feels Like</div>
              <div className="text-3xl">{data.feels_like.toFixed(1)}°C</div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-lg font-semibold">Condition</div>
            <div className="text-2xl">{data.weather_condition}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-lg font-semibold">Humidity</div>
              <div className="text-2xl">{data.humidity}%</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-lg font-semibold">Wind Speed</div>
              <div className="text-2xl">{data.wind_speed} m/s</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};