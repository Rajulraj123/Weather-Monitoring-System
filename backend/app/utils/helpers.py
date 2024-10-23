import logging
from datetime import datetime, timezone
from typing import Dict, Optional, Tuple, Union
import math

logger = logging.getLogger(__name__)

def format_temperature(temp: float, unit: str = 'C') -> str:
    """
    Format temperature with proper unit
    
    Args:
        temp: Temperature value
        unit: Temperature unit ('C' for Celsius, 'F' for Fahrenheit)
    
    Returns:
        Formatted temperature string
    """
    try:
        if unit.upper() == 'F':
            temp = (temp * 9/5) + 32
        return f"{temp:.1f}°{unit.upper()}"
    except Exception as e:
        logger.error(f"Error formatting temperature: {str(e)}")
        return f"{temp}°{unit.upper()}"

def calculate_heat_index(temperature: float, humidity: float) -> float:
    """
    Calculate heat index based on temperature and humidity
    
    Args:
        temperature: Temperature in Celsius
        humidity: Relative humidity percentage
    
    Returns:
        Heat index in Celsius
    """
    try:
        # Convert Celsius to Fahrenheit for the standard heat index formula
        temp_f = (temperature * 9/5) + 32
        
        # Rothfusz regression formula
        hi = -42.379 + (2.04901523 * temp_f) + (10.14333127 * humidity)
        hi = hi - (0.22475541 * temp_f * humidity)
        hi = hi - (6.83783e-3 * temp_f**2)
        hi = hi - (5.481717e-2 * humidity**2)
        hi = hi + (1.22874e-3 * temp_f**2 * humidity)
        hi = hi + (8.5282e-4 * temp_f * humidity**2)
        hi = hi - (1.99e-6 * temp_f**2 * humidity**2)
        
        # Convert back to Celsius
        return (hi - 32) * 5/9
    except Exception as e:
        logger.error(f"Error calculating heat index: {str(e)}")
        return temperature

def format_timestamp(timestamp: Union[datetime, int], format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    Format timestamp to string
    
    Args:
        timestamp: Datetime object or Unix timestamp
        format_str: Desired output format
    
    Returns:
        Formatted timestamp string
    """
    try:
        if isinstance(timestamp, int):
            timestamp = datetime.fromtimestamp(timestamp)
        return timestamp.strftime(format_str)
    except Exception as e:
        logger.error(f"Error formatting timestamp: {str(e)}")
        return str(timestamp)

def validate_city_data(city_data: Dict) -> Tuple[bool, str]:
    """
    Validate city data from API response
    
    Args:
        city_data: Dictionary containing city weather data
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    required_fields = ['name', 'main', 'weather']
    
    try:
        # Check required fields
        for field in required_fields:
            if field not in city_data:
                return False, f"Missing required field: {field}"
        
        # Validate temperature data
        if 'temp' not in city_data['main']:
            return False, "Missing temperature data"
        
        # Validate weather conditions
        if not city_data['weather'] or 'main' not in city_data['weather'][0]:
            return False, "Invalid weather conditions data"
        
        return True, ""
    except Exception as e:
        return False, f"Validation error: {str(e)}"

def parse_api_response(response_data: Dict) -> Dict:
    """
    Parse and standardize API response data
    
    Args:
        response_data: Raw API response data
    
    Returns:
        Standardized weather data dictionary
    """
    try:
        return {
            'city': response_data.get('name', ''),
            'temperature': response_data['main'].get('temp', 0),
            'feels_like': response_data['main'].get('feels_like', 0),
            'humidity': response_data['main'].get('humidity', 0),
            'pressure': response_data['main'].get('pressure', 0),
            'wind_speed': response_data.get('wind', {}).get('speed', 0),
            'weather_condition': response_data.get('weather', [{}])[0].get('main', ''),
            'description': response_data.get('weather', [{}])[0].get('description', ''),
            'timestamp': datetime.fromtimestamp(response_data.get('dt', 0))
        }
    except Exception as e:
        logger.error(f"Error parsing API response: {str(e)}")
        return {}

def calculate_time_difference(timestamp: datetime) -> str:
    """
    Calculate human-readable time difference from now
    
    Args:
        timestamp: Datetime to compare
    
    Returns:
        Human-readable time difference string
    """
    try:
        now = datetime.now(timezone.utc)
        diff = now - timestamp.replace(tzinfo=timezone.utc)
        
        seconds = diff.total_seconds()
        
        if seconds < 60:
            return "just now"
        elif seconds < 3600:
            minutes = int(seconds / 60)
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        elif seconds < 86400:
            hours = int(seconds / 3600)
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        else:
            days = int(seconds / 86400)
            return f"{days} day{'s' if days != 1 else ''} ago"
    except Exception as e:
        logger.error(f"Error calculating time difference: {str(e)}")
        return str(timestamp)

def get_severity_level(temperature: float, threshold: float) -> str:
    """
    Determine severity level based on temperature
    
    Args:
        temperature: Current temperature
        threshold: Temperature threshold
    
    Returns:
        Severity level string
    """
    try:
        diff = temperature - threshold
        if diff <= 0:
            return "normal"
        elif diff <= 5:
            return "warning"
        else:
            return "critical"
    except Exception as e:
        logger.error(f"Error calculating severity level: {str(e)}")
        return "normal"

def format_wind_speed(speed: float, unit: str = 'm/s') -> str:
    """
    Format wind speed with proper unit
    
    Args:
        speed: Wind speed value
        unit: Speed unit ('m/s' or 'km/h')
    
    Returns:
        Formatted wind speed string
    """
    try:
        if unit == 'km/h':
            speed = speed * 3.6
        return f"{speed:.1f} {unit}"
    except Exception as e:
        logger.error(f"Error formatting wind speed: {str(e)}")
        return f"{speed} {unit}"

def create_error_response(error_message: str, status_code: int = 500) -> Dict:
    """
    Create standardized error response
    
    Args:
        error_message: Error message
        status_code: HTTP status code
    
    Returns:
        Error response dictionary
    """
    return {
        'error': True,
        'message': error_message,
        'status_code': status_code,
        'timestamp': datetime.utcnow().isoformat()
    }