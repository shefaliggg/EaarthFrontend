import React from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';


export function WeekCompletionIndicator({ weekEntries, compact = false }) {
  const isDayComplete = (entry) => {
    if (entry.isFlatDay) return true;
    if (entry.inTime && entry.outTime && entry.inTime.trim() !== '' && entry.outTime.trim() !== '') {
      return true;
    }
    return false;
  };

  const completedDays = weekEntries.filter(entry => isDayComplete(entry)).length;
  const totalDays = 7;
  const percentage = Math.round((completedDays / totalDays) * 100);
  const allComplete = completedDays === totalDays;

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border  bg-card`}>
        <div className="flex items-center gap-1">
          {allComplete ? (
            <CheckCircle2 className="size-4 text-green-600" />
          ) : (
            <AlertCircle className="size-4 text-amber-600" />
          )}
          <span className={`text-xs font-bold ${allComplete ? 'text-green-600' : 'text-amber-600'}`}>
            {completedDays}/{totalDays}
          </span>
        </div>
        <div className="flex gap-0.5">
          {weekEntries.map((entry, idx) => {
            const complete = isDayComplete(entry);
            return (
              <div
                key={idx}
                className={`w-1.5 h-4 rounded-full ${complete ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                title={`${dayNames[idx]}: ${complete ? 'Complete' : 'Incomplete'}`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border  bg-card p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {allComplete ? (
            <CheckCircle2 className="size-5 text-green-600" />
          ) : (
            <AlertCircle className="size-5 text-amber-600" />
          )}
          <h3 className={`font-bold `}>
            Week Completion: {completedDays}/{totalDays} Days
          </h3>
        </div>
        <div className={`px-3 py-1 rounded-full font-bold text-sm ${allComplete
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
          {percentage}%
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekEntries.map((entry, idx) => {
          const complete = isDayComplete(entry);
          const date = new Date(entry.date);
          const dayName = dayNames[idx];
          const dayNumber = date.getDate();

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div className={`text-xs font-bold text-muted-foreground`}>
                {dayName}
              </div>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${complete
                    ? 'bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500'
                    : 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600'
                  }`}
              >
                {complete ? (
                  <CheckCircle2 className="size-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Circle className="size-6 text-gray-400" />
                )}
              </div>
              <div className={`text-xs text-muted-foreground`}>
                {dayNumber}
              </div>
            </div>
          );
        })}
      </div>

      {!allComplete && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertCircle className="size-3" />
            Please complete all 7 days before submitting. Each day needs In/Out times or Flat Day marked.
          </p>
        </div>
      )}
    </div>
  );
}
