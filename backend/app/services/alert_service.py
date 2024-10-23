from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from ..database.models import Alert, WeatherData
from ..config import Config

class AlertService:
    def __init__(self, session: Session):
        self.session = session
        self.temperature_threshold = Config.TEMPERATURE_THRESHOLD
        self.consecutive_alerts = Config.CONSECUTIVE_ALERTS

    def check_temperature_alerts(self, city: str) -> Optional[Alert]:
        """
        Check for temperature threshold violations
        """
        recent_readings = self.session.query(WeatherData)\
            .filter(WeatherData.city == city)\
            .order_by(WeatherData.timestamp.desc())\
            .limit(self.consecutive_alerts)\
            .all()

        if len(recent_readings) < self.consecutive_alerts:
            return None

        if all(reading.temperature > self.temperature_threshold for reading in recent_readings):
            return self._create_temperature_alert(city)

        return None

    def _create_temperature_alert(self, city: str) -> Alert:
        """
        Create a new temperature alert
        """
        alert = Alert(
            city=city,
            alert_type='HIGH_TEMPERATURE',
            message=f'Temperature exceeded {self.temperature_threshold}°C for '
                   f'{self.consecutive_alerts} consecutive readings',
            severity='warning'
        )
        self.session.add(alert)
        self.session.commit()
        return alert

    def get_active_alerts(self, city: Optional[str] = None) -> List[Alert]:
        """
        Get all active (unresolved) alerts, optionally filtered by city
        """
        query = self.session.query(Alert)\
            .filter(Alert.resolved_at.is_(None))
        
        if city:
            query = query.filter(Alert.city == city)
        
        return query.order_by(Alert.timestamp.desc()).all()

    def resolve_alert(self, alert_id: str) -> Optional[Alert]:
        """
        Mark an alert as resolved
        """
        alert = self.session.query(Alert).filter(Alert.alert_id == alert_id).first()
        if alert and not alert.resolved_at:
            alert.resolve()
            self.session.commit()
            return alert
        return None