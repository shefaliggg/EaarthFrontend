// utils/getExpiryStatus.js

import { AlertCircle, CheckCircle } from 'lucide-react';

export const getExpiryStatus = (expiryDate) => {
  const parts = expiryDate.split('/');
  const expiry = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  const today = new Date();
  
  const daysUntil = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntil <= 0) {
    return { 
      status: 'expired', 
      color: 'text-red-600', 
      bg: 'bg-red-50', 
      icon: AlertCircle 
    };
  } else if (daysUntil <= 180) {
    return { 
      status: 'expiring', 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      icon: AlertCircle 
    };
  } else {
    return { 
      status: 'valid', 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      icon: CheckCircle 
    };
  }
};