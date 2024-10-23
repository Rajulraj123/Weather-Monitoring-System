// frontend/tests/alerts.test.tsx
describe('Weather Alerts', () => {
  test('displays active alerts', () => {
    const mockAlerts = [{
      alert_id: '1',
      type: 'HIGH_TEMPERATURE',
      message: 'Temperature exceeded threshold',
      severity: 'warning'
    }];
    
    const { getByText } = render(<WeatherAlerts alerts={mockAlerts} />);
    expect(getByText('Temperature exceeded threshold')).toBeInTheDocument();
  });

  test('handles alert resolution', async () => {
    const mockResolve = jest.fn();
    const { getByText } = render(
      <WeatherAlerts alerts={mockAlerts} onResolve={mockResolve} />
    );
    
    fireEvent.click(getByText('Resolve'));
    expect(mockResolve).toHaveBeenCalled();
  });
});