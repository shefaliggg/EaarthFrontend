import React from 'react';
import { CheckCircle, Circle, Clock, FileText } from "lucide-react";

const STATUS_CONFIG = {
  DRAFT: { label: "Draft", step: 0, color: "blue" },
  SENT_TO_CREW: { label: "Sent to Crew", step: 1, color: "green" },
  CREW_REVIEW: { label: "Crew Review", step: 1, color: "amber" },
  NEEDS_REVISION: { label: "Changes Requested", step: 1, color: "red" },
  CREW_ACCEPTED: { label: "Crew Accepted", step: 2, color: "green" },
  PRODUCTION_CHECK: { label: "Production Review", step: 3, color: "teal" },
  ACCOUNTS_CHECK: { label: "Accounts Review", step: 4, color: "purple" },
  PENDING_CREW_SIGNATURE: { label: "Crew Sign", step: 5, color: "blue" },
  PENDING_UPM_SIGNATURE: { label: "UPM Sign", step: 6, color: "indigo" },
  PENDING_FC_SIGNATURE: { label: "FC Sign", step: 7, color: "pink" },
  PENDING_STUDIO_SIGNATURE: { label: "Studio Sign", step: 8, color: "violet" },
  COMPLETED: { label: "Completed", step: 9, color: "emerald" },
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
};

export default function OfferStatusProgress({
  status = "CREW_ACCEPTED",
  sentToCrewAt,
  updatedAt,
  crewAcceptedAt,
  productionCheckCompletedAt,
  accountsCheckCompletedAt,
  crewSignedAt,
  upmSignedAt,
  fcSignedAt,
  studioSignedAt
}) {
  const currentStatus = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
  const currentStep = currentStatus.step;

  const steps = [
    {
      id: 0,
      key: 'DRAFT',
      label: "Draft",
      sublabel: "Production Admin",
      date: "10 Jan 2026 09:00",
      completed: currentStep >= 0
    },
    {
      id: 1,
      key: 'SENT_TO_CREW',
      label: "Sent to Crew",
      sublabel: "Production Office",
      date: sentToCrewAt ? formatDate(sentToCrewAt) : "10 Jan 2025 06:30",
      completed: currentStep >= 1
    },
    {
      id: 2,
      key: 'CREW_ACCEPTED',
      label: "Crew Accepted",
      sublabel: "Crew Member",
      date: crewAcceptedAt ? formatDate(crewAcceptedAt) : "",
      completed: currentStep >= 2
    },
    {
      id: 3,
      key: 'PRODUCTION_CHECK',
      label: "Production Review",
      sublabel: "Production Dept",
      date: productionCheckCompletedAt ? formatDate(productionCheckCompletedAt) : "",
      completed: currentStep >= 3
    },
    {
      id: 4,
      key: 'ACCOUNTS_CHECK',
      label: "Accounts Review",
      sublabel: "Accounts Team",
      date: accountsCheckCompletedAt ? formatDate(accountsCheckCompletedAt) : "",
      completed: currentStep >= 4
    },
    {
      id: 5,
      key: 'PENDING_CREW_SIGNATURE',
      label: "Crew Sign",
      sublabel: "Crew Member",
      date: crewSignedAt ? formatDate(crewSignedAt) : "",
      completed: currentStep >= 5
    },
    {
      id: 6,
      key: 'PENDING_UPM_SIGNATURE',
      label: "UPM Sign",
      sublabel: "Unit Production Manager",
      date: upmSignedAt ? formatDate(upmSignedAt) : "",
      completed: currentStep >= 6
    },
    {
      id: 7,
      key: 'PENDING_FC_SIGNATURE',
      label: "FC Sign",
      sublabel: "Financial Controller",
      date: fcSignedAt ? formatDate(fcSignedAt) : "",
      completed: currentStep >= 7
    },
    {
      id: 8,
      key: 'PENDING_STUDIO_SIGNATURE',
      label: "Studio Sign",
      sublabel: "Studio Executive",
      date: studioSignedAt ? formatDate(studioSignedAt) : "",
      completed: currentStep >= 8
    },
    {
      id: 9,
      key: 'COMPLETED',
      label: "Completed",
      sublabel: "All Signed",
      date: studioSignedAt ? formatDate(studioSignedAt) : "",
      completed: currentStep >= 9
    },
  ];

  return (
    <div className="  transition-colors duration-400">
      <div className="container mx-auto">
        <div className=" bg-background rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-colors duration-400">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide">
              Status
            </h3>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Audit Log</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {Math.round((currentStep / (steps.length - 1)) * 100)}%
                </span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            {/* Background Line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 transition-colors duration-400" style={{ zIndex: 0 }} />

            {/* Progress Line */}
            <div
              className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-500 to-purple-500 dark:from-emerald-400 dark:via-emerald-400 dark:to-purple-400 transition-all duration-500"
              style={{
                width: `${(currentStep / (steps.length - 1)) * 100}%`,
                zIndex: 1
              }}
            />

            {/* Steps */}
            <div className="relative flex justify-between" style={{ zIndex: 2 }}>
              {steps.map((step, index) => {
                const isCompleted = step.completed;
                const isCurrent = index === currentStep;
                const isPending = index > currentStep;

                return (
                  <div key={step.id} className="flex flex-col items-center" style={{ flex: 1 }}>
                    {/* Circle */}
                    <div className="relative mb-2">
                      <div
                        className={`w-8 h-8 rounded-full border-3 flex items-center justify-center transition-all duration-300 ${isCompleted
                            ? 'bg-emerald-500 dark:bg-emerald-400 border-white dark:border-gray-800 shadow-md'
                            : isCurrent
                              ? 'bg-purple-500 dark:bg-purple-400 border-white dark:border-gray-800 shadow-md'
                              : 'bg-gray-300 dark:bg-gray-600 border-white dark:border-gray-800'
                          }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-white dark:text-gray-900" fill="white" strokeWidth={1.5} />
                        ) : isCurrent ? (
                          <Clock className="w-4 h-4 text-white dark:text-gray-900" strokeWidth={1.5} />
                        ) : (
                          <Circle className="w-2.5 h-2.5 text-gray-400 dark:text-gray-500" fill="currentColor" strokeWidth={1.5} />
                        )}
                      </div>
                    </div>

                    {/* Label */}
                    <div className="text-center min-h-[48px] max-w-[90px]">
                      <p className={`text-[11px] font-semibold mb-0.5 leading-tight transition-colors duration-300 ${isCompleted || isCurrent ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
                        }`}>
                        {step.label}
                      </p>
                      {step.sublabel && (
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight transition-colors duration-300">
                          {step.sublabel}
                        </p>
                      )}
                      {step.date && (isCompleted || isCurrent) && (
                        <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight transition-colors duration-300">
                          {step.date}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}