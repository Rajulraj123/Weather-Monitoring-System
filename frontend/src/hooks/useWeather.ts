import { useState, useEffect } from 'react';
import { WeatherData, DailySummary, WeatherAlert } from '../types/weather';
import { weatherApi } from '../services/api';

export function useWeather(city: string) {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [historicalData, setHistoricalData] = useState<DailySummary[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [weatherData, summaryData, alertsData] = await Promise.all([
          weatherApi.getCurrentWeather(city),
          weatherApi.getWeatherSummary(city),
          weatherApi.getAlerts(city)
        ]);

        setCurrentWeather(weatherData[0]);
        setHistoricalData(summaryData);
        setAlerts(alertsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(
      fetchData, 
      Number(process.env.NEXT_PUBLIC_UPDATE_INTERVAL)
    );

    return () => clearInterval(interval);
  }, [city]);

  return { currentWeather, historicalData, alerts, loading, error };
}