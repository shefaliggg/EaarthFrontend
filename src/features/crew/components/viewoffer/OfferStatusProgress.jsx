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
    const hh    = String(d.getHours()).padStart(2, '0');
    const mm    = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${hh}:${mm}`;
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
    { id: 0, label: "Draft",            sublabel: "Production Admin",     date: "" },
    { id: 1, label: "Sent to Crew",     sublabel: "Production Office",    date: sentToCrewAt               ? formatDate(sentToCrewAt)               : "" },
    { id: 2, label: "Crew Accepted",    sublabel: "Crew Member",          date: crewAcceptedAt             ? formatDate(crewAcceptedAt)             : "" },
    { id: 3, label: "Production Check", sublabel: "Production Dept",      date: productionCheckCompletedAt ? formatDate(productionCheckCompletedAt) : "" },
    { id: 4, label: "Accounts Check",   sublabel: "Accounts Team",        date: accountsCheckCompletedAt   ? formatDate(accountsCheckCompletedAt)   : "" },
    { id: 5, label: "Crew Sign",        sublabel: "Crew Member",          date: crewSignedAt               ? formatDate(crewSignedAt)               : "" },
    { id: 6, label: "UPM Sign",         sublabel: "Unit Production Mgr",  date: upmSignedAt                ? formatDate(upmSignedAt)                : "" },
    { id: 7, label: "FC Sign",          sublabel: "Financial Controller", date: fcSignedAt                 ? formatDate(fcSignedAt)                 : "" },
    { id: 8, label: "Studio Sign",      sublabel: "Studio Executive",     date: studioSignedAt             ? formatDate(studioSignedAt)             : "" },
    { id: 9, label: "Completed",        sublabel: "All Signed",           date: studioSignedAt             ? formatDate(studioSignedAt)             : "" },
  ];

  const pct = Math.round((currentStep / (steps.length - 1)) * 100);

  return (
    <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-4 py-2.5">

      {/* Top row — title + % */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-semibold uppercase text-gray-400 tracking-wide">Status</h3>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <FileText className="w-3 h-3" strokeWidth={1.75} />
          <span>Progress</span>
          <span className="font-semibold text-purple-600">{pct}%</span>
        </div>
      </div>

      <div className="relative">
        {/* Background line */}
        <div className="absolute top-3 left-0 right-0 h-px bg-gray-200 dark:bg-gray-700" style={{ zIndex: 0 }} />

        {/* Progress line */}
        <div
          className="absolute top-3 left-0 h-px bg-gradient-to-r from-emerald-500 to-purple-500 transition-all duration-500"
          style={{ width: `${pct}%`, zIndex: 1 }}
        />

        {/* Steps */}
        <div className="relative flex justify-between" style={{ zIndex: 2 }}>
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent   = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center" style={{ flex: 1 }}>
                {/* Bubble — smaller */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm mb-1.5 transition-all duration-300
                  ${isCompleted ? "bg-emerald-500" : isCurrent ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-600"}`}>
                  {isCompleted ? (
                    <CheckCircle className="w-3 h-3 text-white" fill="white" strokeWidth={1.5} />
                  ) : isCurrent ? (
                    <Clock className="w-3 h-3 text-white" strokeWidth={1.5} />
                  ) : (
                    <Circle className="w-2 h-2 text-gray-400" fill="currentColor" strokeWidth={1.5} />
                  )}
                </div>

                {/* Labels */}
                <div className="text-center max-w-[72px]">
                  <p className={`text-[10px] font-semibold leading-tight
                    ${isCompleted || isCurrent ? "text-gray-900 dark:text-gray-100" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  <p className="text-[8px] text-gray-400 leading-tight">{step.sublabel}</p>
                  {step.date && (isCompleted || isCurrent) && (
                    <p className="text-[8px] text-gray-400 leading-tight mt-px">{step.date}</p>
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