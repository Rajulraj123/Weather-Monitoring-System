from datetime import datetime, timedelta
from typing import List, Optional, Dict
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..database.models import WeatherData, DailySummary

class AggregationService:
    def __init__(self, session: Session):
        self.session = session

    def calculate_daily_summary(self, city: str, date: datetime) -> Optional[DailySummary]:
        """
        Calculate daily weather summary for a specific city and date
        """
        start_date = date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date + timedelta(days=1)
        
        # Query for daily aggregates
        result = self.session.query(
            func.avg(WeatherData.temperature).label('avg_temp'),
            func.max(WeatherData.temperature).label('max_temp'),
            func.min(WeatherData.temperature).label('min_temp'),
            func.avg(WeatherData.humidity).label('avg_humidity'),
            func.avg(WeatherData.pressure).label('avg_pressure'),
            func.mode().within_group(WeatherData.weather_condition).label('dominant_condition')
        ).filter(
            WeatherData.city == city,
            WeatherData.timestamp >= start_date,
            WeatherData.timestamp < end_date
        ).first()

        if result and result.avg_temp is not None:
            return self._create_daily_summary(city, start_date, result)
        return None

    def _create_daily_summary(self, city: str, date: datetime, result: Dict) -> DailySummary:
        """
        Create and save daily summary from aggregation results
        """
        summary = DailySummary(
            city=city,
            date=date,
            avg_temp=result.avg_temp,
            max_temp=result.max_temp,
            min_temp=result.min_temp,
            avg_humidity=result.avg_humidity,
            avg_pressure=result.avg_pressure,
            dominant_condition=result.dominant_condition
        )
        self.session.add(summary)
        self.session.commit()
        return summary

    def get_city_summaries(self, city: str, days: int = 7) -> List[DailySummary]:
        """
        Get daily summaries for a city for the last n days
        """
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        return self.session.query(DailySummary)\
            .filter(
                DailySummary.city == city,
                DailySummary.date >= start_date,
                DailySummary.date <= end_date
            )\
            .order_by(DailySummary.date.asc())\
            .all()

    def generate_missing_summaries(self, days: int = 1):
        """
        Generate missing daily summaries for all cities
        """
        from ..config import Config
        
        end_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        start_date = end_date - timedelta(days=days)
        
        for city in Config.CITIES:
            current_date = start_date
            while current_date < end_date:
                existing_summary = self.session.query(DailySummary)\
                    .filter(
                        DailySummary.city == city['name'],
                        DailySummary.date == current_date
                    ).first()
                
                if not existing_summary:
                    self.calculate_daily_summary(city['name'], current_date)
                
                current_date += timedelta(days=1)