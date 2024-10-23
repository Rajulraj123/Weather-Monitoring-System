import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { healthApi } from '@/services/api';
import { format } from 'date-fns';

type ServiceStatus = 'unchecked' | 'checking' | 'connected' | 'error';

interface ServiceCheck {
  status: ServiceStatus;
  lastChecked: string | null;
  error?: string;
}

export const ConnectionStatus: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [services, setServices] = useState<Record<string, ServiceCheck>>({
    backend: { status: 'unchecked', lastChecked: null },
    weather: { status: 'unchecked', lastChecked: null },
    summary: { status: 'unchecked', lastChecked: null },
    alerts: { status: 'unchecked', lastChecked: null }
  });

  const checkConnections = async () => {
    // Update all services to checking state
    setServices(prev => 
      Object.keys(prev).reduce((acc, key) => ({
        ...acc,
        [key]: { ...prev[key], status: 'checking' }
      }), {})
    );

    try {
      // Check health endpoint
      const health = await healthApi.checkConnection();
      setServices(prev => ({
        ...prev,
        backend: {
          status: 'connected',
          lastChecked: new Date().toISOString(),
        }
      }));

      // Check other endpoints
      const endpoints = await healthApi.checkEndpoints();
      const now = new Date().toISOString();

      setServices(prev => ({
        ...prev,
        weather: {
          status: endpoints.weather ? 'connected' : 'error',
          lastChecked: now,
          error: endpoints.weather ? undefined : 'Weather service unavailable'
        },
        summary: {
          status: endpoints.summary ? 'connected' : 'error',
          lastChecked: now,
          error: endpoints.summary ? undefined : 'Summary service unavailable'
        },
        alerts: {
          status: endpoints.alerts ? 'connected' : 'error',
          lastChecked: now,
          error: endpoints.alerts ? undefined : 'Alerts service unavailable'
        }
      }));
    } catch (error) {
      setServices(prev => ({
        ...prev,
        backend: {
          status: 'error',
          lastChecked: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Connection failed'
        }
      }));
    }
  };

  useEffect(() => {
    checkConnections();
    const interval = setInterval(checkConnections, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            {getStatusIcon(services.backend.status)}
            <span>Backend Connection</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </Button>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-2">
            {Object.entries(services).map(([key, service]) => (
              <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(service.status)}
                  <span className="capitalize">{key}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {service.lastChecked && (
                    <span>
                      {format(new Date(service.lastChecked), 'HH:mm:ss')}
                    </span>
                  )}
                  {service.error && (
                    <span className="text-red-500 ml-2">
                      {service.error}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <Button
              className="w-full mt-4"
              onClick={checkConnections}
              disabled={Object.values(services).some(s => s.status === 'checking')}
            >
              Refresh Status
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};