import React from 'react';
import { useWeather } from './hooks/useWeather';
import { CurrentWeather } from './components/weather/CurrentWeather';
import { TemperatureTrend } from './components/weather/TemperatureTrend';
import { DailySummary } from './components/weather/DailySummary';
import { WeatherAlerts } from './components/weather/WeatherAlerts';
import { CitySelector } from './components/weather/CitySelector';
import { weatherApi } from './services/api';
import { CITIES } from './config/constants';

function App() {
  const [selectedCity, setSelectedCity] = React.useState(CITIES[0].name);
  const { currentWeather, historicalData, alerts, loading, error } = useWeather(selectedCity);

  const handleResolveAlert = async (alertId: string) => {
    try {
      await weatherApi.resolveAlert(alertId);
      // Refresh alerts after resolving
      await weatherApi.getAlerts(selectedCity);
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  if (loading) {
    return <div className="text-center p-8">Loading weather data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Weather Monitoring System</h1>
          <CitySelector
            cities={CITIES}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentWeather && <CurrentWeather data={currentWeather} />}
          {historicalData.length > 0 && <TemperatureTrend data={historicalData} />}
          {historicalData[0] && <DailySummary data={historicalData[0]} />}
          <WeatherAlerts alerts={alerts} onResolve={handleResolveAlert} />
        </div>
      </div>
    </div>
  );
}

export default App;