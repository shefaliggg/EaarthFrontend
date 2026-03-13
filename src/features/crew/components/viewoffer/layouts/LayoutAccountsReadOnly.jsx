/**
 * layouts/LayoutAccountsReadOnly.jsx
 *
 * Layout — Accounts Admin for all statuses other than ACCOUNTS_CHECK.
 * Read-only: tabs → preview (ContractPreviewIframe) | offer (OfferDetailsPane)
 */

import { useState } from "react";
import { Eye, CheckCircle, XCircle, ClipboardCheck } from "lucide-react";

import ContractPreviewIframe  from "../../../pages/ContractPreviewIframe";
import { CreateOfferLayout }  from "../../roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import { defaultEngineSettings } from "../../../utils/rateCalculations";

import {
  SidebarSummaryCard, SidebarTimelineCard,
  TabBar, InfoBox,
} from "./layoutHelpers";

function OfferDetailsPane({ offer, contractData, allowances, calculatedRates }) {
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
        isDocumentLocked
      />
    </div>
  );
}

export default function LayoutAccountsReadOnly({
  offer, contractData, allowances, calculatedRates,
  previewHtml, isLoadingPrev,
}) {
  const [tab, setTab] = useState("preview");
  const status = offer?.status;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <TabBar active={tab} onChange={setTab} accentBg="bg-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
        <div>
          {tab === "preview" && <ContractPreviewIframe preview={previewHtml} isLoading={isLoadingPrev} />}
          {tab === "offer"   && (
            <OfferDetailsPane offer={offer} contractData={contractData} allowances={allowances} calculatedRates={calculatedRates} />
          )}
        </div>

        <div className="space-y-3">
          <SidebarSummaryCard offer={offer} />
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <InfoBox icon={Eye} color={status==="COMPLETED"?"green":status==="CANCELLED"?"red":"blue"}>
              {status === "COMPLETED" ? "Contract completed and locked."
               : status === "CANCELLED" ? "This offer was cancelled."
               : "No action required at this stage."}
            </InfoBox>
          </div>
          <SidebarTimelineCard offer={offer} />
        </div>
      </div>
    </>
  );
}