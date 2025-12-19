import React from 'react';
import { Star, Briefcase, Calendar, Camera } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toast } from 'sonner';

export function QuickActions({ isDarkMode }) {
  return (
    <div className={cn(
      "p-6 rounded-xl border",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <h2 className={cn(
        "text-lg font-black mb-4 flex items-center gap-2",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>
        <Star className="w-5 h-5 text-blue-600" />
        Quick Actions
      </h2>

      <div className="space-y-2">
        <button 
          onClick={() => toast.info('Opening profile editor...')}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Briefcase className="w-4 h-4" />
          EDIT PROFILE
        </button>
        <button 
          onClick={() => toast.info('Opening availability calendar...')}
          className={cn(
            "w-full px-4 py-3 rounded-lg font-bold transition-colors border flex items-center justify-center gap-2",
            isDarkMode 
              ? "border-gray-700 hover:bg-gray-800 text-white" 
              : "border-gray-300 hover:bg-gray-50 text-gray-900"
          )}
        >
          <Calendar className="w-4 h-4" />
          UPDATE AVAILABILITY
        </button>
        <button 
          onClick={() => toast.info('Opening portfolio...')}
          className={cn(
            "w-full px-4 py-3 rounded-lg font-bold transition-colors border flex items-center justify-center gap-2",
            isDarkMode 
              ? "border-gray-700 hover:bg-gray-800 text-white" 
              : "border-gray-300 hover:bg-gray-50 text-gray-900"
          )}
        >
          <Camera className="w-4 h-4" />
          MANAGE PORTFOLIO
        </button>
      </div>
    </div>
  );
}