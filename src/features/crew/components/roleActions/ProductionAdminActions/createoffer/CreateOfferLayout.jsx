import { useState } from "react";
import { OfferHeader } from "./OfferHeader";
import { RecipientSection } from "./RecipientSection";
import { OfferDetailsSection } from "./OfferDetailsSection";
import { ContractTermsSection } from "./ContractTermsSection";
import { SalaryTable } from "./FeeStructure/SalaryTable";
import { OvertimeTable } from "./FeeStructure/OvertimeTable";
import { AllowancesGrid } from "./FeeStructure/AllowancesGrid";
import { ProjectInfoSection } from "./ProjectInfoSection";
import { ApprovalHistory } from "./ApprovalHistory";
import { PdfFilenameCard } from "./PdfFilenameCard";
import { TemplateBundleCard } from "./TemplateBundleCard";
import { HighlightField } from "../shared/HighlightField";
import { ContractDocument } from "../document/ContractDocument";
import { getMatchedBundle } from "../../../../utils/bundleMatcher";

const allowanceLabelMap = [
  { key: "boxRental", label: "Box Rental" },
  { key: "computer", label: "Computer" },
  { key: "software", label: "Software" },
  { key: "equipment", label: "Equipment" },
  { key: "vehicle", label: "Vehicle" },
  { key: "mobile", label: "Mobile" },
  { key: "living", label: "Living" },
  { key: "perDiem1", label: "Per Diem 1" },
  { key: "perDiem2", label: "Per Diem 2" },
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
  { key: "fuel", label: "Fuel" },
  { key: "mileage", label: "Mileage" },
];

export function CreateOfferLayout({
  data,
  activeField,
  onFieldClick,
  onFieldFocus,
  onFieldBlur,
  calculatedRates,
  engineSettings,
  salaryBudgetCodes,
  setSalaryBudgetCodes,
  salaryTags,
  setSalaryTags,
  overtimeBudgetCodes,
  setOvertimeBudgetCodes,
  overtimeTags,
  setOvertimeTags,
  allowances,
  initialOfferCollapsed = false,
  isDocumentLocked = false,
  hideContractDocument = false,
  hideOfferSections = false,
  signatures = {},
  activeSigningRole = null,
  onSignatureClick,
}) {
  const [offerCollapsed, setOfferCollapsed] = useState(initialOfferCollapsed);

  const getCurrencySymbol = () => {
    switch (data.currency) {
      case "GBP": return "£";
      case "USD": return "$";
      case "EUR": return "€";
      case "AUD": return "A$";
      case "CAD": return "C$";
      case "NZD": return "NZ$";
      case "DKK": return "kr";
      case "ISK": return "kr";
      default: return "£";
    }
  };
  const cs = getCurrencySymbol();

  const enabledAllowances = allowanceLabelMap.filter((a) => allowances[a.key]?.enabled);

  return (
    <div className="bg-purple-50/30 uppercase">
      {!hideOfferSections && (
        <OfferHeader
          data={data}
          offerCollapsed={offerCollapsed}
          onToggleCollapse={() => setOfferCollapsed((p) => !p)}
        />
      )}

      <div className="px-3 py-2.5 space-y-2">
        {!offerCollapsed && !hideOfferSections && (
          <>
            {/* Row 1: Recipient + Offer Details */}
            <div className="grid grid-cols-2 gap-2">
              <RecipientSection data={data} activeField={activeField} onFieldClick={onFieldClick} />
              <OfferDetailsSection data={data} activeField={activeField} onFieldClick={onFieldClick} />
            </div>

            {/* Row 2: Contract Terms */}
            <ContractTermsSection
              data={data}
              activeField={activeField}
              onFieldClick={onFieldClick}
              engineSettings={engineSettings}
            />

            {/* Other Deal Provisions & Internal Notes */}
            {(data.otherDealProvisions || data.additionalNotes) && (
              <div className="grid grid-cols-2 gap-2">
                {data.otherDealProvisions && (
                  <div className="bg-amber-50/80 rounded-lg border border-amber-200/60 px-2 py-1">
                    <div className="flex items-center gap-1">
                      <div className="w-[2px] h-3 bg-amber-400 rounded-full" />
                      <p className="text-[10px] font-semibold text-amber-800 tracking-wide uppercase">Other Deal Provisions</p>
                    </div>
                    <HighlightField fieldName="otherDealProvisions" active={activeField === "otherDealProvisions"} onClick={onFieldClick}>
                      <p className="text-[10px] text-neutral-700 leading-snug">{data.otherDealProvisions}</p>
                    </HighlightField>
                  </div>
                )}
                {data.additionalNotes && (
                  <div className="bg-purple-50/60 rounded-lg border border-purple-200/60 px-2 py-1">
                    <div className="flex items-center gap-1">
                      <div className="w-[2px] h-3 bg-purple-400 rounded-full" />
                      <p className="text-[10px] font-semibold text-purple-800 tracking-wide uppercase">Internal Notes</p>
                    </div>
                    <HighlightField fieldName="additionalNotes" active={activeField === "additionalNotes"} onClick={onFieldClick}>
                      <p className="text-[10px] text-neutral-600 leading-snug">{data.additionalNotes}</p>
                    </HighlightField>
                  </div>
                )}
              </div>
            )}

            {/* Fee Structure */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-[3px] h-4 bg-purple-600 rounded-full" />
                  <h3 className="text-[11px] font-semibold text-purple-900 tracking-wide uppercase">Fee Structure</h3>
                </div>
                <span className="text-[9px] text-neutral-400 font-medium">
                  Base {cs}{data.feePerDay || "0.00"}/day · {(engineSettings.holidayUplift * 100).toFixed(2)}% holiday · {engineSettings.agreementMode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 items-start">
                {/* SalaryTable — now receives setters for editing */}
                <SalaryTable
                  calculatedRates={calculatedRates}
                  salaryBudgetCodes={salaryBudgetCodes}
                  setSalaryBudgetCodes={setSalaryBudgetCodes}
                  salaryTags={salaryTags}
                  setSalaryTags={setSalaryTags}
                  activeField={activeField}
                  onFieldFocus={onFieldFocus}
                  onFieldBlur={onFieldBlur}
                  currencySymbol={cs}
                />
                {/* OvertimeTable — now receives setters for editing */}
                <OvertimeTable
                  calculatedRates={calculatedRates}
                  overtimeBudgetCodes={overtimeBudgetCodes}
                  setOvertimeBudgetCodes={setOvertimeBudgetCodes}
                  overtimeTags={overtimeTags}
                  setOvertimeTags={setOvertimeTags}
                  activeField={activeField}
                  onFieldFocus={onFieldFocus}
                  onFieldBlur={onFieldBlur}
                  currencySymbol={cs}
                  overtimeMode={data.overtime}
                />
              </div>

              <AllowancesGrid
                enabledAllowances={enabledAllowances}
                allowances={allowances}
                activeField={activeField}
                currencySymbol={cs}
              />
            </div>

            {/* Approval History */}
            <ApprovalHistory />
          </>
        )}

        {/* PDF + Bundle cards */}
        {!hideContractDocument && !hideOfferSections && (
          <>
            {/* <PdfFilenameCard data={data} /> */}
            {/* <TemplateBundleCard data={data} /> */}
          </>
        )}

        {/* Contract Document A4 Preview */}
        {!hideContractDocument && (() => {
          const bundle = getMatchedBundle(data);
          const defaultForms = bundle.forms.filter((f) => f.isDefault);
          return (
            <div className="space-y-2">
              {defaultForms.map((form, index) => (
                <div key={index}>
                  {!hideOfferSections && (
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-[3px] h-4 bg-purple-600 rounded-full" />
                        <h3 className="text-[11px] font-semibold text-purple-900 tracking-wide uppercase">
                          {form.name}
                        </h3>
                      </div>
                      <span className="text-[9px] text-neutral-400 font-medium">
                        A4 · Document {index + 1} of {defaultForms.length}
                      </span>
                    </div>
                  )}
                  <ContractDocument
                    data={data}
                    calculatedRates={calculatedRates}
                    engineSettings={engineSettings}
                    allowances={allowances}
                    activeField={activeField}
                    isLocked={isDocumentLocked}
                    signatures={signatures}
                    activeSigningRole={activeSigningRole}
                    onSignatureClick={onSignatureClick}
                  />
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}