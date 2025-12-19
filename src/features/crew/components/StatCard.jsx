import React from 'react';
import { TrendingUp } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  trendLabel,
  color = 'text-blue-600',
  isDarkMode
}) {
  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all hover:shadow-md",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className={cn(
          "p-2 rounded-lg",
          isDarkMode ? "bg-blue-600/20" : "bg-blue-600/10"
        )}>
          <Icon className={cn("w-4 h-4", color)} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded-full",
            trend >= 0 
              ? "text-green-600 bg-green-500/10" 
              : "text-red-600 bg-red-500/10"
          )}>
            <TrendingUp className={cn("w-3 h-3", trend < 0 && "rotate-180")} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className={cn(
          "text-2xl font-black mb-1",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          {value}
        </p>
        <p className={cn(
          "text-xs uppercase font-bold tracking-wider",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          {label}
        </p>
        {trendLabel && (
          <p className={cn(
            "text-xs mt-0.5",
            isDarkMode ? "text-gray-500" : "text-gray-400"
          )}>
            {trendLabel}
          </p>
        )}
      </div>
    </div>
  );
}