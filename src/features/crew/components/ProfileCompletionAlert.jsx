import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function ProfileCompletionAlert({ profileCompletion, isDarkMode }) {
  if (profileCompletion >= 100) return null;
  
  return (
    <div className={cn(
      "p-4 rounded-xl border flex items-center justify-between",
      isDarkMode 
        ? "bg-amber-900/20 border-amber-500/30" 
        : "bg-amber-50 border-amber-200"
    )}>
      <div className="flex items-center gap-3">
        <AlertCircle className={cn(
          "w-5 h-5",
          isDarkMode ? "text-amber-400" : "text-amber-600"
        )} />
        <div>
          <p className={cn(
            "font-bold text-sm",
            isDarkMode ? "text-amber-300" : "text-amber-900"
          )}>
            Profile {profileCompletion}% Complete
          </p>
          <p className={cn(
            "text-xs",
            isDarkMode ? "text-amber-200/70" : "text-amber-800"
          )}>
            Complete your profile to receive more job opportunities
          </p>
        </div>
      </div>
      <button 
        className={cn(
          "px-4 py-2 rounded-lg font-bold text-sm transition-colors",
          isDarkMode 
            ? "bg-amber-600 hover:bg-amber-700 text-white" 
            : "bg-amber-600 hover:bg-amber-700 text-white"
        )}
      >
        COMPLETE PROFILE
      </button>
    </div>
  );
}