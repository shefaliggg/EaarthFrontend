/**
 * CreateOffer.jsx  — Updated
 *
 * BEHAVIOUR:
 *  - "Save Draft"    → saves to backend, stays on the same page (no navigation)
 *  - "Send to Crew"  → opens SendToCrew confirmation dialog first
 *                      → on confirm: saves + sends → navigates to ViewOffer
 *
 * CONTRACT PREVIEW:
 *  - Only shows the main contract document (ISA form)
 *  - No policy acknowledgement / crew info / payout docs
 */

import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ContractForm }       from "../components/roleActions/ProductionAdminActions/createoffer/Contractform";
import { CreateOfferLayout }  from "../components/roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import { PageHeader }         from "../../../shared/components/PageHeader";
import { Card, CardContent }  from "../../../shared/components/ui/card";
import { calculateRates, defaultEngineSettings } from "../utils/rateCalculations";
import { defaultAllowances }  from "../utils/Defaultallowance";
import OfferActionDialog      from "../components/onboarding/OfferActionDialog";

import {
  createOfferThunk,
  sendToCrewThunk,
  updateOfferThunk,
  selectSubmitting,
  selectOfferError,
  selectCurrentOffer,
  clearOfferError,
  clearCurrentOffer,
} from "../store/offer.slice";

// ─── Real IDs ─────────────────────────────────────────────────────────────────
const STUDIO_ID  = "69494aa6df29472c2c6b5d8f";
const PROJECT_ID = "697c899668977a7ca2b27462";

// ─── Default form data ────────────────────────────────────────────────────────
const defaultContractData = {
  fullName: "", email: "", mobileNumber: "",
  isViaAgent: false, agentEmail: "", agentName: "",
  alternativeContract: "",
  unit: "main", department: "", subDepartment: "new",
  jobTitle: "", searchAllDepartments: false,
  createOwnJobTitle: false, newJobTitle: "", jobTitleSuffix: "",
  allowSelfEmployed: "no", statusDeterminationReason: "hmrc_list",
  otherStatusDeterminationReason: "",
  regularSiteOfWork: "on_set", workingInUK: "yes",
  startDate: "", endDate: "",
  dailyOrWeekly: "daily", engagementType: "paye", workingWeek: "5",
  currency: "GBP", feePerDay: "",
  overtime: "calculated",
  otherOT: "", cameraOTSWD: "", cameraOTSCWD: "", cameraOTCWD: "",
  otherDealProvisions: "", additionalNotes: "",
};

export default function CreateOfferPage() {
  const navigate        = useNavigate();
  const dispatch        = useDispatch();
  const { projectName } = useParams();

  const isSubmitting = useSelector(selectSubmitting);
  const apiError     = useSelector(selectOfferError);

  const [activeField, setActiveField] = useState(null);
  const savedOfferIdRef = useRef(null);
  const [dialog, setDialog] = useState(null); // null | "sendToCrew"

  const [offer, setOffer] = useState({
    contractData:        defaultContractData,
    engineSettings:      defaultEngineSettings,
    salaryBudgetCodes:   [],
    salaryTags:          [],
    overtimeBudgetCodes: [],
    overtimeTags:        [],
    allowances:          defaultAllowances,
  });

  const { contractData, engineSettings, salaryBudgetCodes, salaryTags,
          overtimeBudgetCodes, overtimeTags, allowances } = offer;

  const calculatedRates = useMemo(() => {
    const fee = parseFloat(contractData?.feePerDay) || 0;
    return calculateRates(fee, engineSettings);
  }, [contractData, engineSettings]);

  const makeArraySetter = (field) => (val) =>
    setOffer((p) => ({ ...p, [field]: typeof val === "function" ? val(p[field]) : val }));

  const setSalaryBudgetCodes   = makeArraySetter("salaryBudgetCodes");
  const setSalaryTags          = makeArraySetter("salaryTags");
  const setOvertimeBudgetCodes = makeArraySetter("overtimeBudgetCodes");
  const setOvertimeTags        = makeArraySetter("overtimeTags");
  const setAllowances = (val) =>
    setOffer((p) => ({ ...p, allowances: typeof val === "function" ? val(p.allowances) : val }));

  // ── API errors ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (apiError) {
      const msg = apiError.errors?.length
        ? apiError.errors.map((e) => e.message).join(" · ")
        : apiError.message || "Something went wrong";
      toast.error(msg);
      dispatch(clearOfferError());
    }
  }, [apiError, dispatch]);

  // ── Build payload ────────────────────────────────────────────────────────
  const buildPayload = () => {
    const cd = contractData;
    const allowancesArr = Object.entries(allowances).map(([key, a]) => ({
      key,
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim(),
      ...a,
    }));
    return {
      studioId: STUDIO_ID, projectId: PROJECT_ID,
      recipient: { fullName: cd.fullName || "", email: cd.email || "", mobileNumber: cd.mobileNumber || undefined },
      representation: { isViaAgent: !!cd.isViaAgent, agentName: cd.agentName || undefined, agentEmail: cd.agentEmail || undefined },
      alternativeContract: cd.alternativeContract || "",
      unit: cd.unit || "", department: cd.department || "", subDepartment: cd.subDepartment || "",
      jobTitle: cd.jobTitle || "", newJobTitle: cd.newJobTitle || "",
      createOwnJobTitle: !!cd.createOwnJobTitle, jobTitleSuffix: cd.jobTitleSuffix || "",
      taxStatus: {
        allowSelfEmployed: cd.allowSelfEmployed || "",
        statusDeterminationReason: cd.statusDeterminationReason || "",
        otherStatusDeterminationReason: cd.otherStatusDeterminationReason || "",
      },
      regularSiteOfWork: cd.regularSiteOfWork || "", workingInUK: cd.workingInUK || "yes",
      startDate: cd.startDate || "", endDate: cd.endDate || "",
      dailyOrWeekly: cd.dailyOrWeekly || "daily", engagementType: cd.engagementType || "paye",
      workingWeek: cd.workingWeek || "5", currency: cd.currency || "GBP",
      feePerDay: cd.feePerDay || "", overtime: cd.overtime || "calculated",
      otherOT: cd.otherOT || "", cameraOTSWD: cd.cameraOTSWD || "",
      cameraOTSCWD: cd.cameraOTSCWD || "", cameraOTCWD: cd.cameraOTCWD || "",
      calculatedRates, salaryBudgetCodes, salaryTags, overtimeBudgetCodes, overtimeTags,
      allowances: allowancesArr,
      notes: { otherDealProvisions: cd.otherDealProvisions || "", additionalNotes: cd.additionalNotes || "" },
    };
  };

  // ── SAVE DRAFT — stays on this page ─────────────────────────────────────
  const handleSaveDraft = async () => {
    if (isSubmitting) return;
    toast.loading("Saving draft…", { id: "offer-save" });

    let result;
    if (savedOfferIdRef.current) {
      result = await dispatch(updateOfferThunk({ id: savedOfferIdRef.current, data: buildPayload() }));
    } else {
      result = await dispatch(createOfferThunk(buildPayload()));
    }

    toast.dismiss("offer-save");

    if (!result.error && result.payload?._id) {
      savedOfferIdRef.current = result.payload._id;
      toast.success("✅ Draft saved!");
      // No navigation — stay on create page
    }
  };

  // ── SEND TO CREW — open dialog first ────────────────────────────────────
  const handleSendToCrewClick = () => {
    if (isSubmitting) return;
    setDialog("sendToCrew");
  };

  const handleDialogConfirm = async () => {
    setDialog(null);
    toast.loading("Sending offer to crew…", { id: "offer-send" });

    let offerId = savedOfferIdRef.current;

    if (!offerId) {
      const createResult = await dispatch(createOfferThunk(buildPayload()));
      if (createResult.error || !createResult.payload?._id) {
        toast.dismiss("offer-send");
        return;
      }
      offerId = createResult.payload._id;
      savedOfferIdRef.current = offerId;
    }

    const sendResult = await dispatch(sendToCrewThunk(offerId));
    toast.dismiss("offer-send");

    if (!sendResult.error) {
      toast.success("📤 Offer sent to crew!");
      const proj = projectName || "demo-project";
      setTimeout(() => {
        dispatch(clearCurrentOffer());
        navigate(`/projects/${proj}/offers/${offerId}/view`);
      }, 800);
    }
  };

  // Preview object for dialog summary
  const dialogPreview = {
    recipient:         { fullName: contractData.fullName, email: contractData.email },
    jobTitle:          contractData.jobTitle,
    newJobTitle:       contractData.newJobTitle,
    createOwnJobTitle: contractData.createOwnJobTitle,
    feePerDay:         contractData.feePerDay,
    currency:          contractData.currency,
    startDate:         contractData.startDate,
    endDate:           contractData.endDate,
  };

  return (
    <div className="min-h-screen bg-purple-50/40">
      <div className="px- pt-6 pb-4">
        <PageHeader
          title="Create Offer"
          icon="FileText"
          secondaryActions={[{
            label: isSubmitting ? "Saving…" : "Save Draft",
            icon: "Save", variant: "outline", disabled: isSubmitting,
            clickAction: handleSaveDraft,
          }]}
          primaryAction={{
            label: isSubmitting ? "Sending…" : "Send to Crew",
            icon: "Send", variant: "default", disabled: isSubmitting,
            clickAction: handleSendToCrewClick,
          }}
        />
      </div>

      <div className="px- pb-">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
          <Card>
            <CardContent className="p-4">
              <ContractForm
                data={contractData}
                onChange={(val) => setOffer((p) => ({ ...p, contractData: val }))}
                calculatedRates={calculatedRates}
                engineSettings={engineSettings}
                salaryBudgetCodes={salaryBudgetCodes}
                setSalaryBudgetCodes={setSalaryBudgetCodes}
                salaryTags={salaryTags}
                setSalaryTags={setSalaryTags}
                overtimeBudgetCodes={overtimeBudgetCodes}
                setOvertimeBudgetCodes={setOvertimeBudgetCodes}
                overtimeTags={overtimeTags}
                setOvertimeTags={setOvertimeTags}
                allowances={allowances}
                setAllowances={setAllowances}
                onFieldFocus={(f) => setActiveField(f)}
                onFieldBlur={() => setActiveField(null)}
                onPrint={handleSaveDraft}
              />
            </CardContent>
          </Card>

          {/* Preview — only shows ContractDocument, no other docs */}
          <Card>
            <CardContent className="p-0">
              <CreateOfferLayout
                data={contractData}
                activeField={activeField}
                onFieldFocus={(f) => setActiveField(f)}
                onFieldBlur={() => setActiveField(null)}
                calculatedRates={calculatedRates}
                engineSettings={engineSettings}
                salaryBudgetCodes={salaryBudgetCodes}
                setSalaryBudgetCodes={setSalaryBudgetCodes}
                salaryTags={salaryTags}
                setSalaryTags={setSalaryTags}
                overtimeBudgetCodes={overtimeBudgetCodes}
                setOvertimeBudgetCodes={setOvertimeBudgetCodes}
                overtimeTags={overtimeTags}
                setOvertimeTags={setOvertimeTags}
                allowances={allowances}
                hideOfferSections={false}
                hideContractDocument={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <OfferActionDialog
        type="sendToCrew"
        offer={dialogPreview}
        open={dialog === "sendToCrew"}
        onConfirm={handleDialogConfirm}
        onClose={() => setDialog(null)}
        isLoading={isSubmitting}
      />
    </div>
  );
}