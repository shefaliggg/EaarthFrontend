import { FileText, Calendar, RefreshCcw, Hash } from "lucide-react";

const fmtDateTime = (d) => {
  if (!d) return "--";
  const date = new Date(d);
  return `${date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })} at ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

function getEngagementLabel(val) {
  const map = {
    loan_out: "Loan Out",
    LOAN_OUT: "Loan Out",
    paye: "PAYE",
    PAYE: "PAYE",
    schd: "SCHD",
    SCHD: "SCHD",
    long_form: "Long Form",
    LONG_FORM: "Long Form",
  };
  return map[val] || (val ? val.replace(/_/g, " ") : null);
}

function getFreqLabel(val) {
  if (!val) return null;
  return val.toLowerCase() === "weekly" ? "Weekly" : "Daily";
}

export function OfferHeader({ data, offer }) {
  const created = offer?.createdAt;
  const updated = offer?.updatedAt;

  const engLabel = getEngagementLabel(data?.engagementType);
  const freqLabel = getFreqLabel(data?.dailyOrWeekly);

  return (
    <div className="w-full  border-b border-neutral-200 px-4 py-2">
      <div className="flex items-start justify-between">
        
        {/* LEFT SECTION */}
        <div className="flex items-start gap-4">
          
          {/* Purple Icon */}
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <FileText className="h-5 w-5 text-white" />
          </div>

          <div>
            {/* Title */}
            <h1 className="text-[15px] font-semibold text-neutral-900 uppercase tracking-wide">
              OFFICIAL OFFER DOCUMENT
            </h1>

            {/* Subtitle */}
  

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-6 mt-2 text-[11px] text-neutral-500">
              
              <span>
                VERSION:{" "}
                <span className="text-purple-600 font-semibold">
                  {offer?.version || "1.0"}
                </span>
              </span>

              <span className="flex items-center gap-1">
                <Hash className="h-3 w-3 text-purple-500" />
                OFFER ID:{" "}
                <span className="text-purple-600 font-semibold">
                  {offer?.offerCode || offer?._id?.slice(-8)?.toUpperCase()}
                </span>
              </span>

              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-neutral-400" />
                CREATED:{" "}
                <span className="text-neutral-800 font-medium">
                  {fmtDateTime(created)}
                </span>
              </span>

              <span className="flex items-center gap-1">
                <RefreshCcw className="h-3 w-3 text-neutral-400" />
                UPDATED:{" "}
                <span className="text-neutral-800 font-medium">
                  {fmtDateTime(updated)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT BADGES */}
        <div className="flex items-center gap-3 mt-1">
          
          {freqLabel && (
            <span className="bg-purple-600 text-white text-[11px] font-semibold px-6 py-2 rounded-full uppercase tracking-wide shadow-sm">
              {freqLabel}
            </span>
          )}

          {engLabel && (
            <span className="border border-purple-500 text-purple-600 text-[11px] font-semibold px-6 py-2 rounded-full uppercase tracking-wide bg-white">
              {engLabel}
            </span>
          )}

        </div>
      </div>
    </div>
  );
}