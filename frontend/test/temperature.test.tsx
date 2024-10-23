// frontend/tests/temperature.test.tsx
describe('Temperature Display', () => {
    test('displays temperature in correct format', () => {
      const { getByText } = render(<CurrentWeather data={mockWeatherData} />);
      expect(getByText('25.0°C')).toBeInTheDocument();
    });
  
    test('handles temperature unit conversion', () => {
      const { getByText, rerender } = render(
        <CurrentWeather data={mockWeatherData} unit="F" />
      );
      expect(getByText('77.0°F')).toBeInTheDocument();
    });
  });