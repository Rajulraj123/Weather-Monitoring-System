# backend/tests/test_temperature.py
def test_kelvin_to_celsius_conversion():
    """Test temperature conversion from Kelvin to Celsius"""
    test_cases = [
        (273.15, 0),    # Freezing point
        (373.15, 100),  # Boiling point
        (293.15, 20),   # Room temperature
    ]
    
    for kelvin, expected_celsius in test_cases:
        result = weather_service._kelvin_to_celsius(kelvin)
        assert abs(result - expected_celsius) < 0.1

def test_temperature_conversion_edge_cases():
    """Test temperature conversion edge cases"""
    assert weather_service._kelvin_to_celsius(0) == -273.15  # Absolute zero
    assert weather_service._kelvin_to_celsius(-1) is None    # Invalid temperature