import { FileText, Copy, Clock } from "lucide-react";
import { useState } from "react";

const fmtDateTime = (d) => {
  if (!d) return null;
  const date = new Date(d);
  return `${date.toLocaleDateString("en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
  })} at ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
};

export function OfferHeader({ data, offer, offerCollapsed, onToggleCollapse }) {
  const [copied, setCopied] = useState(false);

  const offerId  = offer?._id        || offer?.offerCode || null;
  const created  = offer?.createdAt  || null;
  const updated  = offer?.updatedAt  || null;

  const handleCopy = () => {
    if (!offerId) return;
    navigator.clipboard.writeText(offerId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div
      className="flex items-center justify-between px-3 py-2 bg-white border-b border-neutral-200/80 cursor-pointer select-none"
      onClick={onToggleCollapse}
    >
      {/* Left: icon + title */}
      <div className="flex items-center gap-2">
        <FileText className="h-3.5 w-3.5 text-purple-500 shrink-0" />
        <span className="text-[11px] font-semibold text-neutral-800 uppercase tracking-wide">
          Offer Preview
        </span>
      </div>

      {/* Right: meta — only shown when real data exists */}
      <div className="flex items-center gap-3 text-[9px] text-neutral-400 font-medium">
        {offerId && (
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-purple-600 transition-colors"
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            title="Copy offer ID"
          >
            <span className="text-purple-600 font-semibold">
              OFFER ID: {offer?.offerCode || offerId.slice(-8).toUpperCase()}
            </span>
            <Copy className={`h-2.5 w-2.5 ${copied ? "text-emerald-500" : "text-neutral-300"}`} />
          </div>
        )}

        {created && (
          <div className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            <span>CREATED: {fmtDateTime(created)}</span>
          </div>
        )}

        {updated && updated !== created && (
          <div className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            <span>UPDATED: {fmtDateTime(updated)}</span>
          </div>
        )}
      </div>
    </div>
  );
}