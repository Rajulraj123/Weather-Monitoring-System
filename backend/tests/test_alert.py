# backend/tests/test_alerts.py
@pytest.mark.asyncio
async def test_temperature_threshold_alert():
    """Test temperature threshold alerts"""
    alert_service = AlertService()
    
    # Simulate temperature exceeding threshold
    mock_readings = [
        {'temperature': 36.0},  # Above threshold
        {'temperature': 36.5},  # Above threshold
    ]
    
    alert = alert_service.check_temperature_alerts('Delhi', mock_readings)
    assert alert is not None
    assert alert.alert_type == 'HIGH_TEMPERATURE'

def test_consecutive_readings_requirement():
    """Test consecutive readings requirement for alerts"""
    mock_readings = [
        {'temperature': 36.0},  # Above
        {'temperature': 34.0},  # Below
        {'temperature': 36.0},  # Above
    ]
    
    alert = alert_service.check_temperature_alerts('Delhi', mock_readings)
    assert alert is None  # Should not trigger alerts