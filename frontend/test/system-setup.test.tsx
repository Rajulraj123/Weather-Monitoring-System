// frontend/tests/system-setup.test.tsx
import { render, screen } from '@testing-library/react';
import { WeatherDashboard } from '../components/weather-dashboard';
import { weatherApi } from '../services/api';

jest.mock('../services/api');

describe('System Setup', () => {
  test('dashboard initializes successfully', () => {
    render(<WeatherDashboard />);
    expect(screen.getByText('Weather Monitoring System')).toBeInTheDocument();
  });

  test('API connection status check', async () => {
    const mockHealth = jest.spyOn(weatherApi, 'checkConnection');
    mockHealth.mockResolvedValue({ status: 'healthy' });
    
    render(<WeatherDashboard />);
    expect(await screen.findByText('Connected')).toBeInTheDocument();
  });
});