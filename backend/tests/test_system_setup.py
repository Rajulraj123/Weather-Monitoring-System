# backend/tests/test_system_setup.py
import pytest
from unittest.mock import patch
from ..app.config import Config
from ..app.services.weather_service import WeatherService

def test_api_key_configuration():
    """Verify API key is properly configured"""
    assert Config.OPENWEATHER_API_KEY is not None
    assert len(Config.OPENWEATHER_API_KEY) > 0

@pytest.mark.asyncio
async def test_weather_service_initialization():
    """Test WeatherService initializes successfully"""
    service = WeatherService()
    assert service is not None
    assert service.api_key == Config.OPENWEATHER_API_KEY

@pytest.mark.asyncio
async def test_api_connection():
    """Test connection to OpenWeatherMap API"""
    service = WeatherService()
    response = await service.fetch_weather_data(1273294)  # Delhi
    assert response is not None
    assert 'name' in response
    assert 'main' in response