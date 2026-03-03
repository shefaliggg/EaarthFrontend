import React from 'react';
import { CheckCircle, Circle, Clock, FileText } from "lucide-react";

const STATUS_STEP = {
  DRAFT:                    0,
  SENT_TO_CREW:             1,
  NEEDS_REVISION:           1,
  CREW_ACCEPTED:            2,
  PRODUCTION_CHECK:         3,
  ACCOUNTS_CHECK:           4,
  PENDING_CREW_SIGNATURE:   5,
  PENDING_UPM_SIGNATURE:    6,
  PENDING_FC_SIGNATURE:     7,
  PENDING_STUDIO_SIGNATURE: 8,
  COMPLETED:                9,
  CANCELLED:                0,
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const day   = String(d.getDate()).padStart(2, '0');
    const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
    const year  = d.getFullYear();
    const hh    = String(d.getHours()).padStart(2, '0');
    const mm    = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hh}:${mm}`;
  } catch { return dateStr; }
};

export default function OfferStatusProgress({
  status = "DRAFT",
  sentToCrewAt,
  crewAcceptedAt,
  productionCheckCompletedAt,
  accountsCheckCompletedAt,
  crewSignedAt,
  upmSignedAt,
  fcSignedAt,
  studioSignedAt,
}) {
  const currentStep = STATUS_STEP[status] ?? 0;

  const steps = [
    { id: 0, label: "Draft",            sublabel: "Production Admin",      date: "" },
    { id: 1, label: "Sent to Crew",     sublabel: "Production Office",     date: sentToCrewAt               ? formatDate(sentToCrewAt)               : "" },
    { id: 2, label: "Crew Accepted",    sublabel: "Crew Member",           date: crewAcceptedAt             ? formatDate(crewAcceptedAt)             : "" },
    { id: 3, label: "Production Check", sublabel: "Production Dept",       date: productionCheckCompletedAt ? formatDate(productionCheckCompletedAt) : "" },
    { id: 4, label: "Accounts Check",   sublabel: "Accounts Team",         date: accountsCheckCompletedAt   ? formatDate(accountsCheckCompletedAt)   : "" },
    { id: 5, label: "Crew Sign",        sublabel: "Crew Member",           date: crewSignedAt               ? formatDate(crewSignedAt)               : "" },
    { id: 6, label: "UPM Sign",         sublabel: "Unit Production Mgr",   date: upmSignedAt                ? formatDate(upmSignedAt)                : "" },
    { id: 7, label: "FC Sign",          sublabel: "Financial Controller",  date: fcSignedAt                 ? formatDate(fcSignedAt)                 : "" },
    { id: 8, label: "Studio Sign",      sublabel: "Studio Executive",      date: studioSignedAt             ? formatDate(studioSignedAt)             : "" },
    { id: 9, label: "Completed",        sublabel: "All Signed",            date: studioSignedAt             ? formatDate(studioSignedAt)             : "" },
  ];

  return (
    <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Status</h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>Progress</span>
          <span className="font-semibold text-purple-600">
            {Math.round((currentStep / (steps.length - 1)) * 100)}%
          </span>
        </div>
      </div>

      <div className="relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" style={{ zIndex: 0 }} />

        {/* Progress line */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-purple-500 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%`, zIndex: 1 }}
        />

        {/* Steps */}
        <div className="relative flex justify-between" style={{ zIndex: 2 }}>
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent   = currentStep === step.id;
            const isPending   = currentStep < step.id;

            return (
              <div key={step.id} className="flex flex-col items-center" style={{ flex: 1 }}>
                <div className="relative mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white shadow
                    ${isCompleted ? "bg-emerald-500"
                    : isCurrent   ? "bg-purple-500"
                    :               "bg-gray-300 dark:bg-gray-600"}`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" fill="white" strokeWidth={1.5} />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4 text-white" strokeWidth={1.5} />
                    ) : (
                      <Circle className="w-2.5 h-2.5 text-gray-400" fill="currentColor" strokeWidth={1.5} />
                    )}
                  </div>
                </div>

                <div className="text-center max-w-[80px]">
                  <p className={`text-[11px] font-semibold leading-tight mb-0.5
                    ${isCompleted || isCurrent ? "text-gray-900 dark:text-gray-100" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  <p className="text-[9px] text-gray-500 leading-tight">{step.sublabel}</p>
                  {step.date && (isCompleted || isCurrent) && (
                    <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{step.date}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}