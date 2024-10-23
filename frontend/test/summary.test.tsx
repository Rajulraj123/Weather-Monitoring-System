// frontend/tests/summary.test.tsx
describe('Daily Summary', () => {
    test('displays correct summary statistics', () => {
      const mockSummary = {
        avg_temp: 22.3,
        max_temp: 25,
        min_temp: 20,
        dominant_condition: 'Clear'
      };
      
      const { getByText } = render(<DailySummary data={mockSummary} />);
      expect(getByText('22.3°C')).toBeInTheDocument();
      expect(getByText('Clear')).toBeInTheDocument();
    });
  });