from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class WeatherData(Base):
    __tablename__ = 'weather_data'
    
    id = Column(Integer, primary_key=True)
    city = Column(String(100), nullable=False, index=True)
    temperature = Column(Float, nullable=False)
    feels_like = Column(Float, nullable=False)
    humidity = Column(Float)
    pressure = Column(Float)
    wind_speed = Column(Float)
    weather_condition = Column(String(100))
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Create indexes for common queries
    __table_args__ = (
        Index('idx_weather_city_timestamp', 'city', 'timestamp'),
    )
    
    def __repr__(self):
        return f"<WeatherData(city='{self.city}', temp={self.temperature}°C, condition='{self.weather_condition}')>"

class DailySummary(Base):
    __tablename__ = 'daily_summaries'
    
    id = Column(Integer, primary_key=True)
    city = Column(String(100), nullable=False)
    date = Column(DateTime, nullable=False)
    avg_temp = Column(Float, nullable=False)
    max_temp = Column(Float, nullable=False)
    min_temp = Column(Float, nullable=False)
    avg_humidity = Column(Float)
    avg_pressure = Column(Float)
    dominant_condition = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_summary_city_date', 'city', 'date', unique=True),
    )
    
    def __repr__(self):
        return f"<DailySummary(city='{self.city}', date='{self.date.date()}', avg_temp={self.avg_temp}°C)>"

class Alert(Base):
    __tablename__ = 'alerts'
    
    id = Column(Integer, primary_key=True)
    alert_id = Column(String(36), default=lambda: str(uuid.uuid4()), unique=True)
    city = Column(String(100), nullable=False)
    alert_type = Column(String(50), nullable=False)
    message = Column(String(500), nullable=False)
    severity = Column(String(20), default='normal')  # normal, warning, critical
    timestamp = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    acknowledged = Column(DateTime, nullable=True)
    
    __table_args__ = (
        Index('idx_alert_city_timestamp', 'city', 'timestamp'),
        Index('idx_alert_type_severity', 'alert_type', 'severity'),
    )
    
    def __repr__(self):
        return f"<Alert(city='{self.city}', type='{self.alert_type}', severity='{self.severity}')>"

    @property
    def is_active(self):
        return self.resolved_at is None

    def resolve(self):
        self.resolved_at = datetime.utcnow()

    def acknowledge(self):
        self.acknowledged = datetime.utcnow()