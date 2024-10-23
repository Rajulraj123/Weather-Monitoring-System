from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import asyncio
import logging
from contextlib import asynccontextmanager

from .database.database import get_db
from .services.weather_service import WeatherService
from .services.alert_service import AlertService
from .services.aggregation_service import AggregationService
from .utils.helpers import create_error_response, format_timestamp
from .config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Background task for weather updates
async def update_weather_data(app: FastAPI):
    """Background task to periodically update weather data"""
    while True:
        try:
            db = next(get_db())
            weather_service = WeatherService(db)
            alert_service = AlertService(db)
            aggregation_service = AggregationService(db)

            # Update weather data for all cities
            weather_data = await weather_service.update_all_cities()

            # Check for alerts
            for data in weather_data:
                alert_service.check_temperature_alerts(data.city)

            # Generate daily summaries
            aggregation_service.generate_missing_summaries()

            logger.info("Weather data updated successfully")
            await asyncio.sleep(Config.UPDATE_INTERVAL)
        except Exception as e:
            logger.error(f"Error updating weather data: {str(e)}")
            await asyncio.sleep(60)  # Wait before retrying
        finally:
            db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for the FastAPI application"""
    # Startup
    logger.info("Starting weather monitoring system...")
    
    # Set up background task
    task = asyncio.create_task(update_weather_data(app))
    
    yield
    
    # Shutdown
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        logger.info("Background task cancelled")

app = FastAPI(
    title="Weather Monitoring System",
    description="Real-time weather monitoring system for Indian metros",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/weather/current")
async def get_current_weather(city: Optional[str] = None, db: Session = Depends(get_db)):
    """Get current weather data for all cities or a specific city"""
    try:
        weather_service = WeatherService(db)
        if city:
            data = weather_service.get_latest_weather(city)
            if not data:
                raise HTTPException(status_code=404, detail=f"No data found for city: {city}")
            return data
        else:
            return [weather_service.get_latest_weather(city['name']) for city in Config.CITIES]
    except Exception as e:
        logger.error(f"Error fetching current weather: {str(e)}")
        return create_error_response(str(e))

@app.get("/api/weather/summary")
async def get_weather_summary(
    city: str,
    days: int = 7,
    db: Session = Depends(get_db)
):
    """Get daily weather summaries for a city"""
    try:
        aggregation_service = AggregationService(db)
        summaries = aggregation_service.get_city_summaries(city, days)
        if not summaries:
            raise HTTPException(status_code=404, detail=f"No summaries found for city: {city}")
        return summaries
    except Exception as e:
        logger.error(f"Error fetching weather summary: {str(e)}")
        return create_error_response(str(e))

@app.get("/api/alerts")
async def get_alerts(
    city: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get weather alerts"""
    try:
        alert_service = AlertService(db)
        if active_only:
            return alert_service.get_active_alerts(city)
        return []
    except Exception as e:
        logger.error(f"Error fetching alerts: {str(e)}")
        return create_error_response(str(e))

@app.post("/api/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str, db: Session = Depends(get_db)):
    """Resolve a weather alert"""
    try:
        alert_service = AlertService(db)
        alert = alert_service.resolve_alert(alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail=f"Alert not found: {alert_id}")
        return alert
    except Exception as e:
        logger.error(f"Error resolving alert: {str(e)}")
        return create_error_response(str(e))

@app.get("/api/health")
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint"""
    try:
        # Check database connection
        db.execute("SELECT 1")
        return {
            "status": "healthy",
            "timestamp": format_timestamp(datetime.utcnow()),
            "database": "connected"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return create_error_response("Service unhealthy", status_code=503)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)