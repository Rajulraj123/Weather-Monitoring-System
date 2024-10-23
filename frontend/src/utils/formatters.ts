import { format } from 'date-fns';

export const formatTemperature = (temp: number): string => {
  return `${temp.toFixed(1)}°C`;
};

export const formatWindSpeed = (speed: number): string => {
  return `${speed.toFixed(1)} m/s`;
};

export const formatTimestamp = (timestamp: string): string => {
  return format(new Date(timestamp), 'PPp');
};

export const formatDate = (date: string): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'text-red-600 bg-red-50';
    case 'warning':
      return 'text-orange-600 bg-orange-50';
    default:
      return 'text-blue-600 bg-blue-50';
  }
};