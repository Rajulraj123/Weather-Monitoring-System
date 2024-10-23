# backend/tests/test_summary.py
@pytest.mark.asyncio
async def test_daily_summary_calculation():
    """Test daily summary calculations"""
    mock_data = [
        {'temperature': 20, 'timestamp': '2024-02-23T10:00:00'},
        {'temperature': 25, 'timestamp': '2024-02-23T14:00:00'},
        {'temperature': 22, 'timestamp': '2024-02-23T18:00:00'}
    ]
    
    summary = aggregation_service.calculate_daily_summary('Delhi', mock_data)
    assert summary['avg_temp'] == 22.3
    assert summary['max_temp'] == 25
    assert summary['min_temp'] == 20

def test_dominant_condition_calculation():
    """Test dominant weather condition determination"""
    conditions = ['Clear', 'Rain', 'Clear', 'Clear', 'Clouds']
    dominant = aggregation_service._calculate_dominant_condition(conditions)
    assert dominant == 'Clear'