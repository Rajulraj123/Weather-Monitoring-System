import requests
import logging
from datetime import datetime
from typing import Dict, Optional, List
from sqlalchemy.orm import Session
from ..config import Config
from ..database.models import WeatherData

logger = logging.getLogger(__name__)

class WeatherService:
    def __init__(self, session: Session):
        self.api_key = Config.OPENWEATHER_API_KEY
        self.session = session
        self.base_url = "http://api.openweathermap.org/data/2.5"

    async def fetch_weather_data(self, city_id: int) -> Optional[Dict]:
        """
        Fetch weather data from OpenWeatherMap API for a specific city
        """
        try:
            url = f"{self.base_url}/weather?id={city_id}&appid={self.api_key}"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return self._process_weather_data(response.json())
        except requests.RequestException as e:
            logger.error(f"Error fetching weather data for city {city_id}: {str(e)}")
            return None

    def _process_weather_data(self, data: Dict) -> Dict:
        """
        Process raw weather data from API response
        """
        return {
            'city': data['name'],
            'temperature': self._kelvin_to_celsius(data['main']['temp']),
            'feels_like': self._kelvin_to_celsius(data['main']['feels_like']),
            'humidity': data['main']['humidity'],
            'pressure': data['main']['pressure'],
            'wind_speed': data['wind']['speed'],
            'weather_condition': data['weather'][0]['main'],
            'timestamp': datetime.fromtimestamp(data['dt'])
        }

    @staticmethod
    def _kelvin_to_celsius(kelvin: float) -> float:
        """Convert temperature from Kelvin to Celsius"""
        return kelvin - 273.15

    async def update_all_cities(self) -> List[WeatherData]:
        """
        Update weather data for all configured cities
        """
        results = []
        for city in Config.CITIES:
            data = await self.fetch_weather_data(city['id'])
            if data:
                weather_data = self.save_weather_data(data)
                results.append(weather_data)
        return results

    def save_weather_data(self, data: Dict) -> WeatherData:
        """
        Save weather data to database
        """
        weather_data = WeatherData(**data)
        self.session.add(weather_data)
        self.session.commit()
        return weather_data

    def get_latest_weather(self, city: str) -> Optional[WeatherData]:
        """
        Get the latest weather data for a specific city
        """
        return self.session.query(WeatherData)\
            .filter(WeatherData.city == city)\
            .order_by(WeatherData.timestamp.desc())\
            .first()