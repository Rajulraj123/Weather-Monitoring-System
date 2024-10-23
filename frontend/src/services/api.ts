import { WeatherData, HistoricalData } from '@/types/weather';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface HealthCheckResponse {
  status: string;
  timestamp: string;
  database: string;
  services: {
    weather: boolean;
    database: boolean;
    alerts: boolean;
  };
}

export const weatherApi = {
  async getCurrentWeather(city?: string): Promise<WeatherData[]> {
    try {
      const url = city 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/weather/current?city=${encodeURIComponent(city)}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/weather/current`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return [];
    }
  },

  async getWeatherSummary(city: string, days: number = 7): Promise<HistoricalData[]> {
    try {
      // Updated to match backend endpoint
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/weather/summary?city=${encodeURIComponent(city)}&days=${days}`;
      console.log('Fetching summary from:', url); // Debug log
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch weather summary: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching weather summary:', error);
      return [];
    }
  },

  async getAlerts(city?: string): Promise<any[]> {
    try {
      const url = city
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/alerts?city=${encodeURIComponent(city)}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/alerts`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  },

  async resolveAlert(alertId: string): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/${alertId}/resolve`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to resolve alert');
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
      throw error;
    }
  }
};
export const debugAPI = {
  async checkEndpoint(endpoint: string): Promise<boolean> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
      console.log(`Endpoint ${endpoint} status:`, response.status);
      console.log('Response:', await response.json());
      return response.ok;
    } catch (error) {
      console.error(`Error checking endpoint ${endpoint}:`, error);
      return false;
    }
  },
  async debugEndpoint(endpoint: string): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
      console.log(`Endpoint ${endpoint} status:`, response.status);
      const data = await response.json();
      console.log('Response data:', data);
    } catch (error) {
      console.error(`Error with endpoint ${endpoint}:`, error);
    }
  }
};

export const healthApi = {
  async checkConnection(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`);
      if (!response.ok) {
        throw new Error('Backend connection failed');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Connection failed');
    }
  },

  async checkEndpoints(): Promise<Record<string, boolean>> {
    const endpoints = {
      health: '/api/health',
      weather: '/api/weather/current',
      summary: '/api/weather/summary',
      alerts: '/api/alerts'
    };

    const results: Record<string, boolean> = {};

    for (const [key, endpoint] of Object.entries(endpoints)) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
        results[key] = response.ok;
      } catch (error) {
        results[key] = false;
      }
    }

    return results;
  }
};