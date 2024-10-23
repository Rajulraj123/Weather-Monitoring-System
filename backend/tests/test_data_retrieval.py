# backend/tests/test_data_retrieval.py
import pytest
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_weather_data_retrieval_interval():
    """Test data retrieval at configured intervals"""
    start_time = datetime.now()
    updates = []
    
    for _ in range(3):
        data = await weather_service.fetch_weather_data(CITY_ID)
        updates.append(data)
        await asyncio.sleep(Config.UPDATE_INTERVAL)
    
    # Verify timing
    end_time = datetime.now()
    expected_duration = Config.UPDATE_INTERVAL * 2
    assert (end_time - start_time).seconds >= expected_duration

@pytest.mark.asyncio
async def test_response_parsing():
    """Test weather data parsing"""
    data = await weather_service.fetch_weather_data(CITY_ID)
    parsed = weather_service._process_weather_data(data)
    
    assert 'temperature' in parsed
    assert 'humidity' in parsed
    assert 'pressure' in parsed
    assert isinstance(parsed['temperature'], float)