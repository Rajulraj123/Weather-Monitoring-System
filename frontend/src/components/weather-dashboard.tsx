import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { ConnectionStatus } from './ui/connection-status';
import { ApiDiagnostic } from './ui/api-diagnostic';  // Add this import
import { LoadingSpinner } from './ui/loading-spinner';
import { ErrorMessage } from './ui/error-message';
import { weatherApi } from '../services/api';
import { format } from 'date-fns';;

// Types
interface WeatherData {
  city: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  weather_condition: string;
  timestamp: string;
}

interface Alert {
  alert_id: string;
  city: string;
  alert_type: string;
  message: string;
  severity: string;
  timestamp: string;
}

const WeatherDashboard = () => {
  // State
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);  // Initialize with empty array
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cities = [
    { name: "Delhi", id: 1273294 },
    { name: "Mumbai", id: 1275339 },
    { name: "Chennai", id: 1264527 },
    { name: "Bangalore", id: 1277333 },
    { name: "Kolkata", id: 1275004 },
    { name: "Hyderabad", id: 1269843 }
  ];

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const [weatherResponse, alertsResponse, historicalResponse] = await Promise.all([
        weatherApi.getCurrentWeather(),
        weatherApi.getAlerts(selectedCity),
        weatherApi.getWeatherSummary(selectedCity, 7) // Updated endpoint
      ]);
  
      console.log('Historical data:', historicalResponse); // For debugging
  
      setWeatherData(weatherResponse || []);
      setAlerts(alertsResponse || []);
      setHistoricalData(historicalResponse || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [selectedCity]);

  // Handlers
  const handleResolveAlert = async (alertId: string) => {
    try {
      await weatherApi.resolveAlert(alertId);
      fetchData(); // Refresh data after resolving alert
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Early return for error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }
  // Get current city data
  const cityData = weatherData?.find(city => city?.city === selectedCity) || null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
    <h1 className="text-3xl font-bold">Weather Monitoring System</h1>
    <div className="flex items-center space-x-4">
      <ConnectionStatus /> 
              <ApiDiagnostic />
              <div className="w-[200px]">
                <select
                  className="w-full p-2 border rounded bg-white"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {cities.map(city => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Weather - with null check */}
          <Card>
            <CardHeader>
              <CardTitle>Current Weather</CardTitle>
            </CardHeader>
            <CardContent>
              {cityData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <div className="text-lg font-semibold">Temperature</div>
                      <div className="text-3xl">{cityData.temperature.toFixed(1)}°C</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <div className="text-lg font-semibold">Feels Like</div>
                      <div className="text-3xl">{cityData.feels_like.toFixed(1)}°C</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <div className="text-lg font-semibold">Condition</div>
                    <div className="text-2xl">{cityData.weather_condition}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <div className="text-lg font-semibold">Humidity</div>
                      <div className="text-2xl">{cityData.humidity}%</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <div className="text-lg font-semibold">Wind Speed</div>
                      <div className="text-2xl">{cityData.wind_speed} m/s</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">
                  No weather data available for {selectedCity}
                </div>
              )}
            </CardContent>
          </Card>
          

          {/* Temperature Trend */}
{historicalData.length > 0 ? (
  <Card>
    <CardHeader>
      <CardTitle>Temperature Trend</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => format(new Date(value), 'MMM dd')}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${value}°C`}
            />
            <Tooltip 
              contentStyle={{ background: 'white', border: '1px solid #ccc' }}
              labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy')}
              formatter={(value: number) => [`${value.toFixed(1)}°C`]}
            />
            <Legend verticalAlign="top" height={36} />
            <Line 
              type="monotone" 
              dataKey="avg_temp" 
              stroke="#8884d8" 
              name="Average"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="max_temp" 
              stroke="#82ca9d" 
              name="Maximum"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="min_temp" 
              stroke="#ff7300" 
              name="Minimum"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
) : (
  <Card>
    <CardHeader>
      <CardTitle>Temperature Trend</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center p-4 text-gray-500">
        No historical data available
      </div>
    </CardContent>
  </Card>
)}

          {/* Daily Summary */}
          {historicalData[0] && (
            <Card>
              <CardHeader>
                <CardTitle>Daily Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <div className="text-sm font-semibold">Average</div>
                      <div className="text-xl">{historicalData[0].avg_temp.toFixed(1)}°C</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <div className="text-sm font-semibold">Maximum</div>
                      <div className="text-xl">{historicalData[0].max_temp.toFixed(1)}°C</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <div className="text-sm font-semibold">Minimum</div>
                      <div className="text-xl">{historicalData[0].min_temp.toFixed(1)}°C</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <div className="text-sm font-semibold">Dominant Condition</div>
                    <div className="text-xl">{historicalData[0].dominant_condition}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.alert_id}
                      className={`p-4 rounded border ${
                        alert.severity === 'critical' 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-orange-50 border-orange-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className={`font-semibold ${
                            alert.severity === 'critical' ? 'text-red-700' : 'text-orange-700'
                          }`}>
                            {alert.alert_type}
                          </div>
                          <div className={
                            alert.severity === 'critical' ? 'text-red-600' : 'text-orange-600'
                          }>
                            {alert.message}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {format(new Date(alert.timestamp), 'PPp')}
                          </div>
                        </div>
                        <button
                          onClick={() => handleResolveAlert(alert.alert_id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">
                  No active weather alerts
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
