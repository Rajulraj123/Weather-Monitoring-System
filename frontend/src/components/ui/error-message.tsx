import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  message: string;
}

export const ErrorMessage: React.FC<Props> = ({ message }) => (
  <div className="flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-lg">
    <AlertCircle className="w-5 h-5 mr-2" />
    <span>{message}</span>
  </div>
);