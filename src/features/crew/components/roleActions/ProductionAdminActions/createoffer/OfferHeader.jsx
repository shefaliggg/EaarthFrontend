import { FileText, Hash, Calendar, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";

export function OfferHeader({ data, offerCollapsed, onToggleCollapse }) {
  const getEngagementType = () => {
    const typeMap = {
      loan_out: "LOAN OUT",
      paye: "PAYE",
      schd: "SCHD (DAILY/WEEKLY)",
      long_form: "LONG FORM",
    };
    return typeMap[data.engagementType] || data.allowSelfEmployed === "yes" ? "LOAN OUT" : "PAYE";
  };

  const now = new Date();
  const createdDate = now.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  const createdTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="bg-white border-b border-purple-100 px-4 pt-2.5 pb-2 cursor-pointer select-none"
      onClick={onToggleCollapse}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-purple-700 flex items-center justify-center">
            <FileText className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-neutral-900 tracking-tight">Official Offer Document</h2>
            <p className="text-[10px] text-neutral-400">Crew contract offer summary</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] px-3 py-1 rounded-md font-semibold tracking-wider border ${
            data.dailyOrWeekly === "weekly"
              ? "bg-white text-purple-700 border-purple-200"
              : "bg-purple-700 text-white border-purple-700"
          }`}>
            {data.dailyOrWeekly ? data.dailyOrWeekly.toUpperCase() : "DAILY"}
          </span>
          <span className={`text-[10px] px-3 py-1 rounded-md font-semibold tracking-wider border ${
            data.engagementType === "loan_out"
              ? "bg-white text-purple-700 border-purple-200"
              : "bg-purple-700 text-white border-purple-700"
          }`}>
            {getEngagementType()}
          </span>
          {offerCollapsed
            ? <ChevronRight className="h-4 w-4 text-neutral-400 ml-1" />
            : <ChevronDown className="h-4 w-4 text-neutral-400 ml-1" />
          }
        </div>
      </div>

      <div className="flex items-center gap-4 text-[10px] text-neutral-500">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-400">Version:</span>
          <span className="font-semibold text-purple-700">1.0</span>
        </div>
        <div className="h-3 w-px bg-purple-100" />
        <div className="flex items-center gap-1.5">
          <Hash className="h-3 w-3 text-purple-300" />
          <span className="text-neutral-400">Offer ID:</span>
          <span className="font-mono font-semibold text-purple-700">8492-3021</span>
        </div>
        <div className="h-3 w-px bg-purple-100" />
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3 text-purple-300" />
          <span className="text-neutral-400">Created:</span>
          <span className="font-semibold text-neutral-700">{createdDate} at {createdTime}</span>
        </div>
        <div className="h-3 w-px bg-purple-100" />
        <div className="flex items-center gap-1.5">
          <RefreshCw className="h-3 w-3 text-purple-300" />
          <span className="text-neutral-400">Updated:</span>
          <span className="font-semibold text-neutral-700">{createdDate} at {createdTime}</span>
        </div>
      </div>
    </div>
  );
}