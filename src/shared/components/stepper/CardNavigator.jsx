import React from 'react';
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export const CardNavigator = ({ 
  currentStep, 
  totalSteps,
  onNext, 
  onBack, 
  onFinish, 
  canProceed = true 
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        disabled={isFirstStep}
        className={cn(
          "group flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 font-medium transition-all duration-200",
          isFirstStep
            ? "opacity-40 cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
            : "border-gray-300 bg-white text-gray-700 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 active:scale-95"
        )}
      >
        <ArrowLeft className={cn(
          "w-4 h-4 transition-transform",
          !isFirstStep && "group-hover:-translate-x-1"
        )} />
        <span>Back</span>
      </button>

      {/* Progress Indicator (Desktop) */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-sm text-gray-500">
          Step <strong className="text-purple-600">{currentStep + 1}</strong> of {totalSteps}
        </span>
        <div className="flex gap-1.5 ml-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentStep
                  ? "w-8 bg-purple-600"
                  : idx < currentStep
                  ? "w-1.5 bg-purple-400"
                  : "w-1.5 bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>

      {/* Next/Finish Button */}
      {!isLastStep ? (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "group flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200",
            canProceed
              ? "bg-purple-600 text-white hover:bg-purple-700 active:scale-95 shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300"
              : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
          )}
        >
          <span>Next Step</span>
          <ArrowRight className={cn(
            "w-4 h-4 transition-transform",
            canProceed && "group-hover:translate-x-1"
          )} />
        </button>
      ) : (
        <button
          onClick={onFinish}
          disabled={!canProceed}
          className={cn(
            "group flex items-center gap-2.5 px-8 py-3 rounded-lg font-semibold text-base transition-all duration-200",
            canProceed
              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 active:scale-95 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300"
              : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
          )}
        >
          <Rocket className={cn(
            "w-5 h-5 transition-transform",
            canProceed && "group-hover:rotate-12 group-hover:-translate-y-0.5"
          )} />
          <span>Initialize Project</span>
        </button>
      )}
    </div>
  );
};