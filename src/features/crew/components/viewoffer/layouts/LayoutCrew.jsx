/**
 * layouts/LayoutCrew.jsx
 *
 * Layout 4 — Crew member view.
 * Tabs: preview (ContractPreviewIframe) | offer (OfferDetailsPane, read-only)
 * Sidebar: accept / request changes / sign actions based on status
 */

import { useState } from "react";
import {
  Eye, CheckCircle, XCircle, PenLine, ClipboardCheck,
  Loader2, MessageSquare,
} from "lucide-react";

import ContractPreviewIframe  from "../../../pages/ContractPreviewIframe";
import { CreateOfferLayout }  from "../../roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import OfferActionDialog      from "../../onboarding/OfferActionDialog";
import { defaultEngineSettings } from "../../../utils/rateCalculations";

import {
  SidebarSummaryCard, SidebarSigningCard, SidebarTimelineCard,
  TabBar, InfoBox,
} from "./layoutHelpers";

function OfferDetailsPane({ offer, contractData, allowances, calculatedRates, locked }) {
  const [af, setAf] = useState(null);
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <CreateOfferLayout
        data={contractData} offer={offer}
        activeField={af} onFieldFocus={setAf} onFieldBlur={() => setAf(null)}
        calculatedRates={calculatedRates} engineSettings={defaultEngineSettings}
        salaryBudgetCodes={offer?.salaryBudgetCodes||[]}     setSalaryBudgetCodes={() => {}}
        salaryTags={offer?.salaryTags||[]}                   setSalaryTags={() => {}}
        overtimeBudgetCodes={offer?.overtimeBudgetCodes||[]} setOvertimeBudgetCodes={() => {}}
        overtimeTags={offer?.overtimeTags||[]}               setOvertimeTags={() => {}}
        allowances={allowances}
        hideOfferSections={false} hideContractDocument={false}
        isDocumentLocked={locked}
      />
    </div>
  );
}

export default function LayoutCrew({
  offer, contractData, allowances, calculatedRates,
  signingStatus, previewHtml, isLoadingPrev,
  isSubmitting, onAction, onSign,
}) {
  const [tab,    setTab   ] = useState("preview");
  const [dialog, setDialog] = useState(null);
  const status = offer?.status;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <TabBar active={tab} onChange={setTab} accentBg="bg-teal-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
        <div>
          {tab === "preview" && <ContractPreviewIframe preview={previewHtml} isLoading={isLoadingPrev} />}
          {tab === "offer"   && (
            <OfferDetailsPane offer={offer} contractData={contractData} allowances={allowances}
              calculatedRates={calculatedRates} locked={status==="COMPLETED"} />
          )}
        </div>

        <div className="space-y-3">
          <SidebarSummaryCard offer={offer} />

          <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-2">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Your Response</p>

            {(status === "SENT_TO_CREW" || status === "NEEDS_REVISION") && (
              <>
                <InfoBox icon={Eye} color="blue">Review the contract carefully before responding.</InfoBox>
                <button disabled={isSubmitting} onClick={() => setDialog("acceptOffer")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 text-white text-[12px] font-semibold hover:bg-teal-700 disabled:opacity-60 transition-colors">
                  {isSubmitting?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<CheckCircle className="w-3.5 h-3.5"/>}
                  Accept Offer
                </button>
                <button disabled={isSubmitting} onClick={() => setDialog("requestChanges")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 text-[12px] font-semibold hover:bg-red-50 transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> Request Changes
                </button>
              </>
            )}

            {status === "CREW_ACCEPTED" && <InfoBox icon={CheckCircle} color="green">You accepted this offer. Under production review.</InfoBox>}

            {status === "PENDING_CREW_SIGNATURE" && (
              <button disabled={isSubmitting} onClick={() => onSign("CREW")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white text-[12px] font-semibold hover:bg-purple-700 disabled:opacity-60 transition-colors">
                {isSubmitting?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<PenLine className="w-3.5 h-3.5"/>}
                Sign Contract
              </button>
            )}

            {["PENDING_UPM_SIGNATURE","PENDING_FC_SIGNATURE","PENDING_STUDIO_SIGNATURE"].includes(status) && (
              <InfoBox icon={PenLine} color="purple">You have signed. Awaiting further signatories.</InfoBox>
            )}

            {status === "DRAFT"            && <InfoBox icon={Eye}          color="gray">Offer has not been sent to you yet.</InfoBox>}
            {status === "COMPLETED"        && <InfoBox icon={CheckCircle}  color="green">Contract fully executed. Welcome to the production!</InfoBox>}
            {status === "CANCELLED"        && <InfoBox icon={XCircle}      color="red">This offer has been cancelled.</InfoBox>}
            {["PRODUCTION_CHECK","ACCOUNTS_CHECK"].includes(status) && (
              <InfoBox icon={ClipboardCheck} color="blue">Offer is under internal review.</InfoBox>
            )}
          </div>

          <SidebarSigningCard signingStatus={signingStatus} />
          <SidebarTimelineCard offer={offer} />
        </div>
      </div>

      {dialog === "acceptOffer" && (
        <OfferActionDialog type="acceptOffer" offer={offer} open
          onConfirm={async (p) => { setDialog(null); await onAction("accept", p); }}
          onClose={() => setDialog(null)} isLoading={isSubmitting} />
      )}
      {dialog === "requestChanges" && (
        <OfferActionDialog type="requestChanges" offer={offer} open
          onConfirm={async (p) => { setDialog(null); await onAction("requestChanges", p); }}
          onClose={() => setDialog(null)} isLoading={isSubmitting} />
      )}
    </>
  );
}