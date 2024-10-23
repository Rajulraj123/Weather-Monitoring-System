export interface HistoricalData {
  date: string;
  avg_temp: number;
  max_temp: number;
  min_temp: number;
  dominant_condition: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  weather_condition: string;
  timestamp: string;
}
  
  export interface DailySummary {
    date: string;
    avg_temp: number;
    max_temp: number;
    min_temp: number;
    avg_humidity: number;
    dominant_condition: string;
  }
  
  export interface WeatherAlert {
    alert_id: string;
    city: string;
    alert_type: string;
    message: string;
    severity: 'normal' | 'warning' | 'critical';
    timestamp: string;
  }