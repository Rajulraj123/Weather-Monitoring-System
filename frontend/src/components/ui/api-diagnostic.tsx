// src/components/ui/api-diagnostic.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface EndpointStatus {
  status: 'success' | 'error' | 'pending';
  message?: string;
  timestamp?: string;
  details?: any;
}

export const ApiDiagnostic: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<Record<string, EndpointStatus>>({});
  const [checking, setChecking] = useState(false);

  const endpoints = [
    { 
      path: '/api/health', 
      name: 'Health Check',
      params: {} 
    },
    { 
      path: '/api/weather/current', 
      name: 'Current Weather',
      params: { city: 'Delhi' } // Default city
    },
    { 
      path: '/api/weather/summary', 
      name: 'Weather Summary',
      params: { city: 'Delhi', days: 7 }
    },
    { 
      path: '/api/alerts', 
      name: 'Alerts',
      params: { city: 'Delhi' }
    }
  ];

  const checkEndpoint = async (endpoint: string, params: Record<string, any> = {}): Promise<EndpointStatus> => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
      console.log('Checking endpoint:', url); // Debug log

      const response = await fetch(url);
      const data = await response.json();
      
      return {
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'OK' : `Error: ${response.status}`,
        timestamp: new Date().toISOString(),
        details: data
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  };

  const runDiagnostics = async () => {
    setChecking(true);
    
    for (const endpoint of endpoints) {
      setDiagnostics(prev => ({ 
        ...prev, 
        [endpoint.path]: { status: 'pending' } 
      }));
      
      const status = await checkEndpoint(endpoint.path, endpoint.params);
      console.log(`${endpoint.name} response:`, status); // Debug log
      
      setDiagnostics(prev => ({ 
        ...prev, 
        [endpoint.path]: status 
      }));
    }
    
    setChecking(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>API Diagnostics</span>
          <Button
            onClick={runDiagnostics}
            disabled={checking}
            size="sm"
          >
            {checking ? 'Checking...' : 'Run Diagnostics'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {endpoints.map(({ path, name }) => (
            <div key={path} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                {diagnostics[path]?.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {diagnostics[path]?.status === 'error' && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                {(!diagnostics[path] || diagnostics[path]?.status === 'pending') && (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                <span className="font-medium">{name}</span>
              </div>
              <div className="text-sm text-gray-500">
                {diagnostics[path]?.message || 'Not checked'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};