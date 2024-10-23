// frontend/tests/data-retrieval.test.tsx
import { renderHook } from '@testing-library/react-hooks';
import { useWeather } from '../hooks/use-weather';

describe('Data Retrieval', () => {
  test('fetches weather data at regular intervals', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useWeather('Delhi'));
    expect(result.current.loading).toBe(true);
    
    jest.advanceTimersByTime(300000); // 5 minutes
    expect(weatherApi.getCurrentWeather).toHaveBeenCalledTimes(2);
  });

  test('handles API errors gracefully', async () => {
    weatherApi.getCurrentWeather.mockRejectedValue(new Error('API Error'));
    
    const { result } = renderHook(() => useWeather('Delhi'));
    expect(result.current.error).toBeTruthy();
  });
});