import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { AlertCircle, XCircle } from 'lucide-react';
import { WeatherAlert } from '../../types/weather';
import { format } from 'date-fns';

interface Props {
  alerts: WeatherAlert[];
  onResolve: (alertId: string) => void;
}

export const WeatherAlerts: React.FC<Props> = ({ alerts, onResolve }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Weather Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert
                key={alert.alert_id}
                variant={getSeverityColor(alert.severity)}
                className="relative"
              >
                <AlertTitle className="flex items-center">
                  {alert.alert_type}
                  <button
                    onClick={() => onResolve(alert.alert_id)}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </AlertTitle>
                <AlertDescription>
                  <div>{alert.message}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {format(new Date(alert.timestamp), 'PPp')}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500">
            No active weather alerts
          </div>
        )}
      </CardContent>
    </Card>
  );
};