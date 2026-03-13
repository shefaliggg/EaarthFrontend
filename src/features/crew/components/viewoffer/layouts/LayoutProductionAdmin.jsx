/**
 * layouts/LayoutProductionAdmin.jsx
 *
 * Layout 1 — Production Admin for all statuses EXCEPT PRODUCTION_CHECK.
 * (PRODUCTION_CHECK uses LayoutProductionReview instead.)
 *
 * Left: tabs → "preview" (ContractInstancesPanel) | "offer" (OfferDetailsPane)
 * Right: crew identity card + action buttons + summary/signing/timeline sidebar
 * Overlay: slide-out ContractForm edit panel
 *
 * Props:
 *   offer, contractData, allowances, calculatedRates
 *   signingStatus, isSubmitting
 *   onAction(actionKey, payload?)  — calls offer workflow thunks
 *   onSign(role)                   — opens SignDialog
 *   dispatch
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit2, X, Send, ClipboardCheck, PenLine, Loader2,
  CheckCircle, XCircle, Eye, FileText, Users,
} from "lucide-react";

import { Button } from "../../../../../shared/components/ui/button";
import { ContractForm }      from "../../roleActions/ProductionAdminActions/createoffer/Contractform";
import { CreateOfferLayout } from "../../roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import ContractInstancesPanel from "../../../pages/ContractInstancesPanel";
import OfferActionDialog      from "../../onboarding/OfferActionDialog";

import {
  updateOfferThunk,
} from "../../../store/offer.slice";

import { defaultEngineSettings } from "../../../utils/rateCalculations";
import {
  SidebarSummaryCard,
  SidebarSigningCard,
  SidebarTimelineCard,
  InfoBox,
  TabBar,
  getDeptLabel,
  getInitials,
} from "./layoutHelpers";

// ── Offer details pane (tab "offer") ────────────────────────────────────────

function OfferDetailsPane({ offer, contractData, allowances, calculatedRates, locked }) {
  const [af, setAf] = useState(null);
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <CreateOfferLayout
        data={contractData} offer={offer}
        activeField={af} onFieldFocus={setAf} onFieldBlur={() => setAf(null)}
        calculatedRates={calculatedRates} engineSettings={defaultEngineSettings}
        salaryBudgetCodes={offer?.salaryBudgetCodes     || []} setSalaryBudgetCodes={() => {}}
        salaryTags={offer?.salaryTags                   || []} setSalaryTags={() => {}}
        overtimeBudgetCodes={offer?.overtimeBudgetCodes || []} setOvertimeBudgetCodes={() => {}}
        overtimeTags={offer?.overtimeTags               || []} setOvertimeTags={() => {}}
        allowances={allowances}
        hideOfferSections={false} hideContractDocument={false}
        isDocumentLocked={locked}
      />
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function LayoutProductionAdmin({
  offer, contractData, allowances, calculatedRates,
  signingStatus, isSubmitting,
  onAction, onSign, dispatch,
}) {
  const [tab,      setTab     ] = useState("preview");
  const [showEdit, setShowEdit] = useState(false);
  const [dialog,   setDialog  ] = useState(null);

  const status    = offer?.status;
  const jobTitle  = offer?.createOwnJobTitle && offer?.newJobTitle ? offer.newJobTitle : offer?.jobTitle || "—";

  const canSendToCrew  = status === "DRAFT" || status === "NEEDS_REVISION";
  const canMoveToCheck = status === "CREW_ACCEPTED";
  const canCancel      = !["COMPLETED", "CANCELLED"].includes(status);
  const isSigning      = status?.startsWith("PENDING_") && status?.endsWith("_SIGNATURE");
  const isCompleted    = status === "COMPLETED";

  return (
    <>
      {/* ── Overlay backdrop ── */}
      <AnimatePresence>
        {showEdit && (
          <motion.div key="overlay-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowEdit(false)} />
        )}
      </AnimatePresence>

      {/* ── Slide-out edit panel ── */}
      <AnimatePresence>
        {showEdit && (
          <motion.div key="overlay-panel"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-[420px] bg-white shadow-2xl border-l border-violet-100 flex flex-col">
            <div className="bg-violet-700 px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-white" />
                <span className="text-white text-[13px] font-semibold">Edit Offer</span>
              </div>
              <button onClick={() => setShowEdit(false)} className="text-violet-300 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ContractForm
                data={contractData}
                onChange={(val) => {
                  if (offer?._id) dispatch(updateOfferThunk({
                    id: offer._id,
                    data: { ...val, studioId: offer.studioId, projectId: offer.projectId },
                  }));
                }}
                onPrint={() => {}} onFieldFocus={() => {}} onFieldBlur={() => {}}
                calculatedRates={calculatedRates} engineSettings={defaultEngineSettings}
                salaryBudgetCodes={offer?.salaryBudgetCodes || []}     setSalaryBudgetCodes={() => {}}
                salaryTags={offer?.salaryTags || []}                   setSalaryTags={() => {}}
                overtimeBudgetCodes={offer?.overtimeBudgetCodes || []} setOvertimeBudgetCodes={() => {}}
                overtimeTags={offer?.overtimeTags || []}               setOvertimeTags={() => {}}
                allowances={allowances} setAllowances={() => {}}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top toolbar ── */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <TabBar active={tab} onChange={setTab} accentBg="bg-violet-600" />
        {!isCompleted && (
          <Button size="sm" variant="outline" onClick={() => setShowEdit(true)}
            className="gap-1.5 h-8 text-xs border-violet-200 text-violet-700 hover:bg-violet-50">
            <Edit2 className="h-3.5 w-3.5" /> Edit Offer
          </Button>
        )}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-4 items-start">

        {/* Left: tab content */}
        <div>
          {tab === "preview" && (
            <ContractInstancesPanel offerId={offer?._id} offerStatus={offer?.status} />
          )}
          {tab === "offer" && (
            <OfferDetailsPane
              offer={offer} contractData={contractData}
              allowances={allowances} calculatedRates={calculatedRates}
              locked={isCompleted}
            />
          )}
        </div>

        {/* Right: sidebar */}
        <div className="space-y-3">

          {/* Crew identity */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center text-white text-[13px] font-bold shrink-0">
                {getInitials(contractData.fullName)}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-neutral-800 truncate">{contractData.fullName || "—"}</p>
                <p className="text-[10px] text-neutral-500 truncate">{jobTitle}</p>
                <p className="text-[10px] text-neutral-400 truncate">{getDeptLabel(contractData.department)}</p>
              </div>
            </div>
            {contractData.email && (
              <p className="text-[10px] text-neutral-400 truncate">{contractData.email}</p>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-2">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Actions</p>

            {canSendToCrew && (
              <button disabled={isSubmitting} onClick={() => setDialog("sendToCrew")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-[12px] font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors">
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {status === "NEEDS_REVISION" ? "Resend to Crew" : "Send to Crew"}
              </button>
            )}

            {canMoveToCheck && (
              <button disabled={isSubmitting} onClick={() => onAction("productionCheck")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-[12px] font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors">
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ClipboardCheck className="w-3.5 h-3.5" />}
                Move to Production Check
              </button>
            )}

            {status === "PENDING_CREW_SIGNATURE" && (
              <button disabled={isSubmitting} onClick={() => onSign("CREW")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white text-[12px] font-semibold hover:bg-purple-700 disabled:opacity-60 transition-colors">
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PenLine className="w-3.5 h-3.5" />}
                Sign as Crew
              </button>
            )}

            {isSigning && status !== "PENDING_CREW_SIGNATURE" && (
              <InfoBox icon={PenLine} color="purple">Awaiting signatures — use the signing view for your role.</InfoBox>
            )}
            {isCompleted    && <InfoBox icon={CheckCircle} color="green">Contract fully executed and locked.</InfoBox>}
            {status === "SENT_TO_CREW"    && <InfoBox icon={Eye}          color="amber">Awaiting crew response.</InfoBox>}
            {status === "ACCOUNTS_CHECK"  && <InfoBox icon={ClipboardCheck} color="indigo">Under Accounts review.</InfoBox>}

            {canCancel && !isCompleted && (
              <button disabled={isSubmitting} onClick={() => setDialog("cancel")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-500 text-[11px] font-medium hover:bg-red-50 transition-colors mt-1">
                <XCircle className="w-3 h-3" /> Cancel Offer
              </button>
            )}
          </div>

          <SidebarSummaryCard offer={offer} />
          <SidebarSigningCard signingStatus={signingStatus} />
          <SidebarTimelineCard offer={offer} />
        </div>
      </div>

      {/* Dialogs */}
      {dialog === "sendToCrew" && (
        <OfferActionDialog type="sendToCrew" offer={offer} open
          onConfirm={async () => { setDialog(null); await onAction("sendToCrew"); }}
          onClose={() => setDialog(null)} isLoading={isSubmitting} />
      )}
      {dialog === "cancel" && (
        <OfferActionDialog type="cancel" offer={offer} open
          onConfirm={async () => { setDialog(null); await onAction("cancel"); }}
          onClose={() => setDialog(null)} isLoading={isSubmitting} />
      )}
    </>
  );
}