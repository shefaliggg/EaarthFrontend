/**
 * layouts/LayoutSignatory.jsx
 *
 * Layout 5 — UPM / FC / Studio signatory view.
 * Tabs: preview (ContractPreviewIframe) | offer (OfferDetailsPane, read-only)
 * Sidebar: sign button when it's this role's turn, else status message
 *
 * FIX: Sign button now checks BOTH offer.status AND signingStatus.currentStatus
 * so UPM/FC/STUDIO can sign even when offer.status hasn't advanced to match.
 * Contract status (via signingStatus.currentStatus) is the source of truth for signing.
 */

import { useState } from "react";
import { Eye, CheckCircle, XCircle, PenLine, Loader2 } from "lucide-react";

import ContractPreviewIframe  from "../../../pages/ContractPreviewIframe";
import { CreateOfferLayout }  from "../../roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import { defaultEngineSettings } from "../../../utils/rateCalculations";

import {
  SidebarSummaryCard, SidebarSigningCard, SidebarTimelineCard,
  TabBar, InfoBox, SIGN_ROLE_MAP,
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

export default function LayoutSignatory({
  offer, contractData, allowances, calculatedRates,
  signingStatus, previewHtml, isLoadingPrev,
  isSubmitting, role, onSign,
}) {
  const [tab, setTab] = useState("preview");
  const cfg    = SIGN_ROLE_MAP[role];
  const status = offer?.status;

  // FIX: Use contract status (signingStatus.currentStatus) as source of truth.
  // offer.status may lag behind contract.status after a signature is recorded.
  const contractStatus = signingStatus?.currentStatus ?? status;
  const isMyTurn = contractStatus === cfg?.requiredStatus || status === cfg?.requiredStatus;

  const isCompleted = contractStatus === "COMPLETED" || status === "COMPLETED";
  const isCancelled = status === "CANCELLED";

  // Derive signing progress from signatories array
  const mySignatory = signingStatus?.signatories?.find((s) => s.role === role);
  const iHaveSigned = mySignatory?.signed ?? false;

  const accentBg = {
    UPM:    "bg-indigo-600",
    FC:     "bg-pink-600",
    STUDIO: "bg-violet-600",
  }[role] || "bg-purple-600";

  const btnColor = cfg?.btnColor || accentBg;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <TabBar active={tab} onChange={setTab} accentBg={accentBg} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
        <div>
          {tab === "preview" && (
            <ContractPreviewIframe preview={previewHtml} isLoading={isLoadingPrev} />
          )}
          {tab === "offer" && (
            <OfferDetailsPane
              offer={offer} contractData={contractData} allowances={allowances}
              calculatedRates={calculatedRates} locked={isCompleted}
            />
          )}
        </div>

        <div className="space-y-3">
          <SidebarSummaryCard offer={offer} />

          <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-2">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
              {cfg?.label}
            </p>

            {/* ── Already signed ── */}
            {iHaveSigned && !isCompleted && (
              <InfoBox icon={CheckCircle} color="green">
                You have signed. Awaiting remaining signatories.
              </InfoBox>
            )}

            {/* ── My turn to sign ── */}
            {!iHaveSigned && isMyTurn && !isCompleted && !isCancelled && (
              <>
                <InfoBox icon={PenLine} color="purple">
                  Your signature is required to proceed.
                </InfoBox>
                <button
                  disabled={isSubmitting}
                  onClick={() => onSign(role)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-[12px] font-semibold disabled:opacity-60 transition-colors ${btnColor}`}
                >
                  {isSubmitting
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <PenLine className="w-3.5 h-3.5" />
                  }
                  Sign as {role}
                </button>
              </>
            )}

            {/* ── Not my turn yet ── */}
            {!iHaveSigned && !isMyTurn && !isCompleted && !isCancelled && (
              <InfoBox icon={Eye} color="gray">
                No action required at this stage.
              </InfoBox>
            )}

            {/* ── Completed ── */}
            {isCompleted && (
              <InfoBox icon={CheckCircle} color="green">
                Contract fully executed and locked.
              </InfoBox>
            )}

            {/* ── Cancelled ── */}
            {isCancelled && (
              <InfoBox icon={XCircle} color="red">
                Offer was cancelled.
              </InfoBox>
            )}
          </div>

          <SidebarSigningCard signingStatus={signingStatus} />
          <SidebarTimelineCard offer={offer} />
        </div>
      </div>
    </>
  );
}