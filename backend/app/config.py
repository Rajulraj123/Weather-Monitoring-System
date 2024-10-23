import os
from typing import Dict, List
from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache

class Settings(BaseSettings):
    # API Configuration
    OPENWEATHER_API_KEY: str = Field(
        "d9f2db4b4f2a8e9cb8d9c0db9b9c75e1",
        description="OpenWeatherMap API Key"
    )
    UPDATE_INTERVAL: int = Field(
        300,
        description="Weather update interval in seconds"
    )
    
    # Cities to monitor
    CITIES: List[Dict[str, str | int]] = [
        {"name": "Delhi", "id": 1273294},
        {"name": "Mumbai", "id": 1275339},
        {"name": "Chennai", "id": 1264527},
        {"name": "Bangalore", "id": 1277333},
        {"name": "Kolkata", "id": 1275004},
        {"name": "Hyderabad", "id": 1269843}
    ]
    
    # Alert Configuration
    TEMPERATURE_THRESHOLD: float = Field(
        35.0,
        description="Temperature threshold for alerts in Celsius"
    )
    CONSECUTIVE_ALERTS: int = Field(
        2,
        description="Number of consecutive readings needed for alert"
    )
    
    # Database Configuration
    DATABASE_URL: str = Field(
        "postgresql://postgres:rajul@localhost:5432/weather_db",
        description="PostgreSQL connection URL"
    )
    
    # API Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = Field(
        60,
        description="API rate limit per minute"
    )
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = Field(
        ["http://localhost:3000"],
        description="Allowed CORS origins"
    )

    # Logging Configuration
    LOG_LEVEL: str = Field("INFO", description="Logging level")
    LOG_FILE: str = Field(
        "weather_monitoring.log",
        description="Log file path"
    )

    # Server Configuration
    HOST: str = Field("0.0.0.0", description="Server host")
    PORT: int = Field(8000, description="Server port")
    RELOAD: bool = Field(True, description="Enable auto-reload")
    WORKERS: int = Field(4, description="Number of worker processes")

    # Security
    SECRET_KEY: str = Field(
        "your-super-secret-key-here",
        description="Secret key for security"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        30,
        description="Access token expiration time in minutes"
    )

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # This will ignore extra fields

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()

# Create global config instance
Config = get_settings()