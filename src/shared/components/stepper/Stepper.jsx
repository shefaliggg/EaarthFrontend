import React from 'react';
import { CheckCircle } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export const Stepper = ({ steps, activeStep }) => {
  return (
    <div className="w-full flex justify-center mb-8">
      <div className="flex items-start justify-center max-w-4xl w-full">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;

          return (
            <div key={step.id} className="flex items-start">
              <div className="flex flex-col items-center min-w-[140px]">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                    (isCompleted || isActive) && "bg-purple-600 text-white shadow-lg",
                    !isCompleted && !isActive && "bg-gray-100 text-gray-400"
                  )}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs text-center leading-tight max-w-[120px]",
                    isActive && "text-purple-600 font-semibold",
                    !isActive && "text-gray-500"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div className="w-32 h-1 mt-4 -mx-8">
                  <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        isCompleted ? "w-full bg-purple-600" : "w-0 bg-purple-600"
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};