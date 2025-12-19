import React from 'react';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  trendLabel,
  color = 'text-primary',
  isDarkMode
}) {
  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all hover:shadow-lg hover:border-primary/50",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      {/* Top Section: Icon and Trend */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-2 rounded-xl transition-all",
          isDarkMode ? "bg-primary/20" : "bg-primary/10"
        )}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
        
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            trend >= 0 
              ? "text-green-600 bg-green-500/10" 
              : "text-red-600 bg-red-500/10"
          )}>
            <TrendingUp className={cn("w-3 h-3", trend < 0 && "rotate-180")} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Bottom Section: Value and Label */}
      <div className="space-y-1">
        <p className={cn(
          "text-3xl font-black leading-none",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          {value}
        </p>
        
        <p className={cn(
          "text-xs uppercase font-bold tracking-wider leading-none",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          {label}
        </p>
        
        {trendLabel && (
          <p className={cn(
            "text-xs mt-2 leading-tight",
            isDarkMode ? "text-gray-500" : "text-gray-400"
          )}>
            {trendLabel}
          </p>
        )}
      </div>
    </div>
  );
}