import { forwardRef, useRef, useImperativeHandle, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "../../../shared/components/ui/button";
import { Trash2, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/shared/config/utils";

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "N/A";
  return `£${parseFloat(amount).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return dateStr;
    }
    return format(new Date(dateStr), "dd/MM/yyyy");
  } catch {
    return dateStr;
  }
};

const SignaturePad = forwardRef(({ label, name, existingSignature, signedAt, isActive, onSign, disabled, mode }, ref) => {
  const sigPadRef = useRef(null);
  const [signatureData, setSignatureData] = useState(existingSignature || null);

  const isViewMode = mode === "view";

  useImperativeHandle(ref, () => ({
    getSignatureData: () => signatureData,
    clear: () => {
      sigPadRef.current?.clear();
      setSignatureData(null);
    }
  }));

  const handleClear = () => {
    sigPadRef.current?.clear();
    setSignatureData(null);
  };

  const handleEnd = () => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      const data = sigPadRef.current.toDataURL("image/png");
      setSignatureData(data);
    }
  };

  const handleConfirmSign = () => {
    if (signatureData && onSign) {
      onSign(signatureData);
    }
  };

  return (
    <div className={cn(
      "border-2 rounded-lg p-4 bg-white",
      isActive && !isViewMode ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200",
      existingSignature ? "bg-green-50 border-green-300" : ""
    )}>
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">{label}</div>
      {name && <div className="text-sm text-gray-700 mb-2">{name}</div>}
      
      <div className="h-24 border-b-2 border-gray-400 bg-gray-50 relative">
        {existingSignature ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {existingSignature.startsWith("data:image") ? (
              <img src={existingSignature} alt="Signature" className="max-h-20 max-w-full object-contain" />
            ) : (
              <span className="text-xl italic text-gray-800" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                {existingSignature}
              </span>
            )}
          </div>
        ) : isActive && !disabled && !isViewMode ? (
          <SignatureCanvas
            ref={sigPadRef}
            penColor="black"
            canvasProps={{
              className: "w-full h-full cursor-crosshair",
              style: { width: "100%", height: "100%" }
            }}
            onEnd={handleEnd}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm italic">
            {disabled || isViewMode ? "Not yet required" : "Awaiting signature..."}
          </div>
        )}
      </div>
      
      {isActive && !disabled && !existingSignature && !isViewMode && (
        <div className="flex gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClear}
            disabled={!signatureData}
            data-testid="button-clear-signature"
          >
            <Trash2 className="w-3 h-3 mr-1" /> Clear
          </Button>
          <Button 
            size="sm" 
            onClick={handleConfirmSign}
            disabled={!signatureData}
            className="bg-purple-600 hover:bg-purple-700"
            data-testid="button-confirm-signature"
          >
            <Check className="w-3 h-3 mr-1" /> Sign
          </Button>
        </div>
      )}
      
      {signedAt && (
        <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <Check className="w-3 h-3 text-green-600" />
          Signed on {format(new Date(signedAt), "dd/MM/yyyy 'at' HH:mm")}
        </div>
      )}
    </div>
  );
});

SignaturePad.displayName = "SignaturePad";

const ContractDocument = forwardRef(({ offer, currentSigner, onSign, isPending, minimal, mode = "sign" }, ref) => {
  const documentRef = useRef(null);
  const crewSigRef = useRef(null);
  const upmSigRef = useRef(null);
  const fcSigRef = useRef(null);
  const studioSigRef = useRef(null);

  const isViewMode = mode === "view";

  useImperativeHandle(ref, () => ({
    getDocumentElement: () => documentRef.current,
    getSignatureRefs: () => ({
      crew: crewSigRef.current,
      upm: upmSigRef.current,
      fc: fcSigRef.current,
      studio: studioSigRef.current
    })
  }));

  if (!offer) return null;

  if (minimal) {
    return (
      <div className="space-y-4">
        <SignaturePad
          label="Your Signature"
          name={offer.fullName}
          isActive={true}
          onSign={(data) => onSign && onSign(currentSigner, data)}
          disabled={isPending}
          mode={mode}
        />
      </div>
    );
  }

  const primaryRole = offer.roles?.[0] || {};
  const engagementType = offer.confirmedEmploymentType || primaryRole.engagementType || "LOAN_OUT";
  const isLoanOut = engagementType === "LOAN_OUT";
  const isPAYE = engagementType === "PAYE";
  const isSelfEmployed = engagementType === "SELF_EMPLOYED";

  const calculateTotalWeeklyAllowances = () => {
    const allowances = [
      parseFloat(primaryRole.boxRental) || 0,
      parseFloat(primaryRole.mobileAllowance) || 0,
      parseFloat(primaryRole.carAllowance) || 0,
      parseFloat(primaryRole.travelAllowance) || 0,
      parseFloat(primaryRole.housingAllowance) || 0,
      parseFloat(primaryRole.computerAllowance) || 0,
      parseFloat(primaryRole.perDiem) || 0,
      parseFloat(primaryRole.otherAllowance) || 0,
    ];
    return allowances.reduce((a, b) => a + b, 0);
  };

  return (
    <div 
      ref={documentRef} 
      className="bg-white text-black p-8 max-w-4xl mx-auto shadow-2xl print:shadow-none"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      data-testid="contract-document"
    >
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-2xl font-bold text-purple-700 mb-2" style={{ letterSpacing: "0.1em" }}>
          {offer.productionName || "PRODUCTION"}
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {isLoanOut ? "LOAN-OUT AGREEMENT" : isPAYE ? "EMPLOYMENT CONTRACT" : "SELF-EMPLOYED AGREEMENT"}
        </h2>
        <p className="text-sm text-gray-500">Contract Reference: {offer.id}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          1. PARTIES
        </h3>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold text-gray-600">Production Company:</p>
            <p className="text-gray-800">{offer.productionName} Productions Ltd</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">{isLoanOut ? "Lender Company:" : "Crew Member:"}</p>
            <p className="text-gray-800">{offer.fullName}</p>
            <p className="text-gray-600 text-xs">{offer.email}</p>
            <p className="text-gray-600 text-xs">{offer.mobileNumber}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          2. ENGAGEMENT DETAILS
        </h3>
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-600 w-1/3">Position:</td>
              <td className="py-2 text-gray-800">{primaryRole.jobTitle || "N/A"}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-600">Department:</td>
              <td className="py-2 text-gray-800">
                {primaryRole.department}
                {primaryRole.subDepartment && ` - ${primaryRole.subDepartment}`}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-600">Unit:</td>
              <td className="py-2 text-gray-800">{primaryRole.unit || "Main Unit"}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-600">Production Phase:</td>
              <td className="py-2 text-gray-800">{primaryRole.productionPhase?.replace(/_/g, " ") || "N/A"}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-600">Start Date:</td>
              <td className="py-2 text-gray-800">{formatDate(primaryRole.startDate)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-600">End Date:</td>
              <td className="py-2 text-gray-800">{formatDate(primaryRole.endDate)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-600">Working Week:</td>
              <td className="py-2 text-gray-800">{primaryRole.workingWeek?.replace(/_/g, " ") || "5 Day"}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-600">Location:</td>
              <td className="py-2 text-gray-800">{primaryRole.regularSiteOfWork?.replace(/_/g, " ") || "N/A"}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-600">Working in UK:</td>
              <td className="py-2 text-gray-800">{primaryRole.workingInUnitedKingdom === "YES" ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          3. REMUNERATION
        </h3>
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b border-gray-200 bg-purple-50">
              <td className="py-2 font-bold text-purple-800 w-1/3">Contract Rate:</td>
              <td className="py-2 font-bold text-purple-800">
                {formatCurrency(primaryRole.contractRate)} / {primaryRole.rateType?.toLowerCase() || "week"}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-600">Overtime:</td>
              <td className="py-2 text-gray-800">
                {primaryRole.overtimeType?.replace(/_/g, " ") || "As per BECTU agreement"}
              </td>
            </tr>
            {primaryRole.overtimeDetails && (
              <tr className="border-b border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Overtime Details:</td>
                <td className="py-2 text-gray-800">{primaryRole.overtimeDetails}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          4. ALLOWANCES
        </h3>
        <table className="w-full text-sm border-collapse">
          <tbody>
            {parseFloat(primaryRole.boxRental) > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 font-semibold text-gray-600 w-1/3">Box Rental:</td>
                <td className="py-2 text-gray-800">{formatCurrency(primaryRole.boxRental)} / week</td>
              </tr>
            )}
            {parseFloat(primaryRole.mobileAllowance) > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Mobile Allowance:</td>
                <td className="py-2 text-gray-800">{formatCurrency(primaryRole.mobileAllowance)} / week</td>
              </tr>
            )}
            {parseFloat(primaryRole.carAllowance) > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Car Allowance:</td>
                <td className="py-2 text-gray-800">{formatCurrency(primaryRole.carAllowance)} / week</td>
              </tr>
            )}
            {parseFloat(primaryRole.travelAllowance) > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Travel Allowance:</td>
                <td className="py-2 text-gray-800">{formatCurrency(primaryRole.travelAllowance)} / week</td>
              </tr>
            )}
            {parseFloat(primaryRole.housingAllowance) > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Housing Allowance:</td>
                <td className="py-2 text-gray-800">{formatCurrency(primaryRole.housingAllowance)} / week</td>
              </tr>
            )}
            {parseFloat(primaryRole.computerAllowance) > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Computer Allowance:</td>
                <td className="py-2 text-gray-800">{formatCurrency(primaryRole.computerAllowance)} / week</td>
              </tr>
            )}
            {parseFloat(primaryRole.perDiem) > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Per Diem:</td>
                <td className="py-2 text-gray-800">{formatCurrency(primaryRole.perDiem)} / day</td>
              </tr>
            )}
            <tr className="border-b border-gray-200 bg-gray-100">
              <td className="py-2 font-bold text-gray-800">Total Weekly Allowances:</td>
              <td className="py-2 font-bold text-gray-800">{formatCurrency(calculateTotalWeeklyAllowances())}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {primaryRole.additionalTerms && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
            5. ADDITIONAL TERMS
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{primaryRole.additionalTerms}</p>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          {primaryRole.additionalTerms ? "6" : "5"}. STANDARD TERMS
        </h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>This agreement is subject to the standard terms and conditions of engagement for film and television production crew members.</p>
          <p>The {isLoanOut ? "Lender" : "Crew Member"} agrees to provide services in accordance with the Production's schedule and reasonable instructions.</p>
          <p>All intellectual property created during the engagement shall vest in the Production Company.</p>
          <p>Both parties agree to maintain confidentiality regarding all aspects of the production.</p>
          {isPAYE && (
            <p>As a PAYE employee, statutory deductions will be made from payments including Income Tax and National Insurance contributions.</p>
          )}
          {isLoanOut && (
            <p>The Lender is responsible for their own tax affairs and shall invoice the Production Company for services rendered.</p>
          )}
        </div>
      </div>

      {offer.budgetCodes && (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Budget Information (Internal Use)</h3>
          <div className="text-xs text-gray-600 grid grid-cols-2 gap-2">
            {offer.budgetCodes.main && <div>Main Code: {offer.budgetCodes.main}</div>}
            {offer.budgetCodes.department && <div>Department: {offer.budgetCodes.department}</div>}
          </div>
        </div>
      )}

      <div className="mt-12 pt-8 border-t-2 border-gray-300">
        <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">SIGNATURES</h3>
        <p className="text-sm text-gray-600 text-center mb-6">
          {isViewMode 
            ? "This contract has been executed by all parties."
            : "By signing below, all parties agree to the terms and conditions set forth in this agreement."
          }
        </p>
        
        <div className="grid grid-cols-2 gap-6">
          <SignaturePad
            ref={crewSigRef}
            label={isLoanOut ? "Lender Signature" : "Crew Member Signature"}
            name={offer.fullName}
            existingSignature={offer.crewSignature}
            signedAt={offer.crewSignedAt}
            isActive={!isViewMode && currentSigner === "crew"}
            onSign={!isViewMode ? ((sig) => onSign?.("crew", sig)) : undefined}
            disabled={isViewMode || (currentSigner !== "crew" && !offer.crewSignature)}
            mode={mode}
          />
          
          <SignaturePad
            ref={upmSigRef}
            label="Unit Production Manager"
            existingSignature={offer.upmSignature}
            signedAt={offer.upmSignedAt}
            isActive={!isViewMode && currentSigner === "upm"}
            onSign={!isViewMode ? ((sig) => onSign?.("upm", sig)) : undefined}
            disabled={isViewMode || (currentSigner !== "upm" && !offer.upmSignature)}
            mode={mode}
          />
          
          <SignaturePad
            ref={fcSigRef}
            label="Financial Controller"
            existingSignature={offer.fcSignature}
            signedAt={offer.fcSignedAt}
            isActive={!isViewMode && currentSigner === "fc"}
            onSign={!isViewMode ? ((sig) => onSign?.("fc", sig)) : undefined}
            disabled={isViewMode || (currentSigner !== "fc" && !offer.fcSignature)}
            mode={mode}
          />
          
          <SignaturePad
            ref={studioSigRef}
            label="Production Executive / Studio"
            existingSignature={offer.studioSignature}
            signedAt={offer.studioSignedAt}
            isActive={!isViewMode && currentSigner === "studio"}
            onSign={!isViewMode ? ((sig) => onSign?.("studio", sig)) : undefined}
            disabled={isViewMode || (currentSigner !== "studio" && !offer.studioSignature)}
            mode={mode}
          />
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>Document generated on {format(new Date(), "dd MMMM yyyy 'at' HH:mm")}</p>
        <p className="mt-1">This is a legally binding document. Please read all terms carefully before signing.</p>
      </div>
    </div>
  );
});

ContractDocument.displayName = "ContractDocument";

export default ContractDocument;