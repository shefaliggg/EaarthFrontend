import React from 'react';
import { Check, Clock, Edit3, CheckCircle, AlertCircle, XCircle, FileCheck } from 'lucide-react';

export function TimesheetStatusWatermark({ status, isDarkMode = false, mode = 'watermark' }) {
  const statusConfig = {
    'draft': {
      label: 'DRAFT',
      icon: Edit3,
      color: isDarkMode ? '#6b7280' : '#9ca3af',
      badgeColor: 'text-gray-400',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    'submitted': {
      label: 'SUBMITTED',
      icon: FileCheck,
      color: isDarkMode ? '#60a5fa' : '#3b82f6',
      badgeColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    'partly-approved': {
      label: 'PARTLY APPROVED',
      icon: Clock,
      color: isDarkMode ? '#fb923c' : '#f97316',
      badgeColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    'approved': {
      label: 'APPROVED',
      icon: CheckCircle,
      color: isDarkMode ? '#10b981' : '#059669',
      badgeColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    'revised': {
      label: 'REVISED',
      icon: Edit3,
      color: isDarkMode ? '#a855f7' : '#9333ea',
      badgeColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    'rejected': {
      label: 'REJECTED',
      icon: XCircle,
      color: isDarkMode ? '#ef4444' : '#dc2626',
      badgeColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    'paid': {
      label: 'PAID',
      icon: Check,
      color: isDarkMode ? '#10b981' : '#059669',
      badgeColor: 'text-green-700',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  // Badge mode - small badge in header
  if (mode === 'badge') {
    return (
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-50 pointer-events-none">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 backdrop-blur-sm ${config.bgColor} ${config.borderColor} opacity-90 shadow-lg`}>
          <Icon className={`w-4 h-4 ${config.badgeColor}`} />
          <h4 className={`font-black text-[11px] uppercase tracking-widest ${config.badgeColor}`}>
            {config.label}
          </h4>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden">
      <div 
        className="transform -rotate-12 opacity-10 select-none"
        style={{
          fontSize: '15rem',
          fontWeight: 900,
          lineHeight: 1,
          color: config.color
        }}
      >
        {config.label}
      </div>
    </div>
  );
}