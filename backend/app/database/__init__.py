from .database import SessionLocal, engine
from .models import Base, WeatherData, DailySummary, Alert

# Initialize database tables
Base.metadata.create_all(bind=engine)