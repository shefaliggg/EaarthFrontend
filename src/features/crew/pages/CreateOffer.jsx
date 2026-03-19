/**
 * CreateOffer.jsx — Unified Create + Edit page
 *
 * REDIRECT LOGIC:
 *   Edit from ViewOffer (NEEDS_REVISION monitoring) → ?redirectTo=view  → back to ViewOffer
 *   Edit from ProductionAdmin (PRODUCTION_CHECK)    → ?redirectTo=onboarding → Onboarding
 *   Accounts return → production edits              → ?redirectTo=onboarding → Onboarding
 *
 * Default (no param) = "view"
 */

import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ContractForm }      from "../components/roleActions/ProductionAdminActions/createoffer/Contractform";
import { CreateOfferLayout } from "../components/roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import { PageHeader }        from "../../../shared/components/PageHeader";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { calculateRates, defaultEngineSettings } from "../utils/rateCalculations";
import { defaultAllowances } from "../utils/Defaultallowance";
import OfferActionDialog     from "../components/onboarding/OfferActionDialog";
import ChangeRequestBanner   from "../components/viewoffer/layouts/ChangeRequestBanner";

import axiosConfig from "../../auth/config/axiosConfig";

import {
  createOfferThunk,
  sendToCrewThunk,
  updateOfferThunk,
  getOfferThunk,
  getProjectOffersThunk,
  selectSubmitting,
  selectOfferError,
  selectCurrentOffer,
  clearOfferError,
  clearCurrentOffer,
} from "../store/offer.slice";

import { APP_CONFIG } from "../config/appConfig";

const STUDIO_ID  = APP_CONFIG.STUDIO_ID;
const PROJECT_ID = APP_CONFIG.PROJECT_ID;

// ─── Role header helper ────────────────────────────────────────────────────────
const rh = () => ({
  "x-view-as-role": localStorage.getItem("viewRole") || "PRODUCTION_ADMIN",
});

// ─── Default form state ────────────────────────────────────────────────────────
const defaultContractData = {
  recipient:      { fullName: "", email: "", mobileNumber: "" },
  representation: { isViaAgent: false, agentName: "", agentEmail: "" },
  alternativeContract:  "",
  unit:                 "main",
  department:           "",
  subDepartment:        "new",
  jobTitle:             "",
  searchAllDepartments: false,
  createOwnJobTitle:    false,
  newJobTitle:          "",
  jobTitleSuffix:       "",
  taxStatus: {
    allowSelfEmployed:              "no",
    statusDeterminationReason:      "hmrc_list",
    otherStatusDeterminationReason: "",
  },
  regularSiteOfWork: "on_set",
  workingInUK:       "yes",
  startDate:      "",
  endDate:        "",
  dailyOrWeekly:  "daily",
  engagementType: "paye",
  workingWeek:    "5",
  categoryId:     "",
  currency:    "GBP",
  feePerDay:   "",
  overtime:    "calculated",
  otherOT:     "",
  cameraOTSWD: "",
  cameraOTSCWD:"",
  cameraOTCWD: "",
  notes: { otherDealProvisions: "", additionalNotes: "" },
};

// ─── Transform existing offer → ContractForm shape ────────────────────────────
function offerToFormData(offer) {
  if (!offer) return defaultContractData;
  return {
    recipient: {
      fullName:     offer.recipient?.fullName     || "",
      email:        offer.recipient?.email        || "",
      mobileNumber: offer.recipient?.mobileNumber || "",
    },
    representation: {
      isViaAgent: offer.representation?.isViaAgent || false,
      agentName:  offer.representation?.agentName  || "",
      agentEmail: offer.representation?.agentEmail || "",
    },
    alternativeContract:  offer.alternativeContract  || "",
    unit:                 offer.unit                 || "main",
    department:           offer.department           || "",
    subDepartment:        offer.subDepartment        || "new",
    jobTitle:             offer.jobTitle             || "",
    searchAllDepartments: false,
    createOwnJobTitle:    offer.createOwnJobTitle    || false,
    newJobTitle:          offer.newJobTitle          || "",
    jobTitleSuffix:       offer.jobTitleSuffix       || "",
    taxStatus: {
      allowSelfEmployed:              offer.taxStatus?.allowSelfEmployed              || "",
      statusDeterminationReason:      offer.taxStatus?.statusDeterminationReason      || "hmrc_list",
      otherStatusDeterminationReason: offer.taxStatus?.otherStatusDeterminationReason || "",
    },
    regularSiteOfWork: offer.regularSiteOfWork || "on_set",
    workingInUK:       offer.workingInUK       || "yes",
    startDate:      offer.startDate      || "",
    endDate:        offer.endDate        || "",
    dailyOrWeekly:  offer.dailyOrWeekly  || "daily",
    engagementType: offer.engagementType || "paye",
    workingWeek:    offer.workingWeek    || "5",
    categoryId:     offer.categoryId     ? String(offer.categoryId) : "",
    currency:    offer.currency    || "GBP",
    feePerDay:   offer.feePerDay   || "",
    overtime:    offer.overtime    || "calculated",
    otherOT:     offer.otherOT     || "",
    cameraOTSWD: offer.cameraOTSWD || "",
    cameraOTSCWD:offer.cameraOTSCWD|| "",
    cameraOTCWD: offer.cameraOTCWD || "",
    notes: {
      otherDealProvisions: offer.notes?.otherDealProvisions || "",
      additionalNotes:     offer.notes?.additionalNotes     || "",
    },
  };
}

// ─── Transform allowances array → object for ContractForm ─────────────────────
function offerToAllowances(offer) {
  if (!offer?.allowances?.length) return defaultAllowances;
  const result = { ...defaultAllowances };
  offer.allowances.forEach((a) => {
    if (a.key && result[a.key] !== undefined) result[a.key] = { ...result[a.key], ...a };
  });
  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CreateOfferPage() {
  const navigate            = useNavigate();
  const dispatch            = useDispatch();
  const { projectName, id } = useParams();
  const [searchParams]      = useSearchParams();

  const isEditMode = Boolean(id);

  // Where to navigate after a successful edit save:
  //   "view"       → back to ViewOffer (default — used from NEEDS_REVISION monitoring)
  //   "onboarding" → back to onboarding list (used from PRODUCTION_CHECK edit)
  const redirectAfterSave = searchParams.get("redirectTo") || "view";

  const isSubmitting  = useSelector(selectSubmitting);
  const apiError      = useSelector(selectOfferError);
  const existingOffer = useSelector(selectCurrentOffer);

  const [activeField,     setActiveField    ] = useState(null);
  const [categories,      setCategories     ] = useState(null);
  const [projectSettings, setProjectSettings] = useState(null);
  const [dialog,          setDialog         ] = useState(null);
  const [editInitialized, setEditInitialized] = useState(false);

  const savedOfferIdRef = useRef(null);
  const proj = projectName || "demo-project";

  // ── Form state ─────────────────────────────────────────────────────────────
  const [contractData,        setContractData       ] = useState(defaultContractData);
  const [allowances,          setAllowances         ] = useState(defaultAllowances);
  const [salaryBudgetCodes,   setSalaryBudgetCodes  ] = useState([]);
  const [salaryTags,          setSalaryTags         ] = useState([]);
  const [overtimeBudgetCodes, setOvertimeBudgetCodes] = useState([]);
  const [overtimeTags,        setOvertimeTags       ] = useState([]);
  const [engineSettings]                              = useState(defaultEngineSettings);

  // ── EDIT MODE: load existing offer ────────────────────────────────────────
  useEffect(() => {
    if (!isEditMode) return;
    dispatch(getOfferThunk(id));
  }, [id, isEditMode, dispatch]);

  // ── EDIT MODE: pre-fill form once offer is loaded ─────────────────────────
  useEffect(() => {
    if (!isEditMode || !existingOffer || editInitialized) return;
    if (existingOffer._id !== id) return;

    setContractData(offerToFormData(existingOffer));
    setAllowances(offerToAllowances(existingOffer));
    setSalaryBudgetCodes(existingOffer.salaryBudgetCodes     || []);
    setSalaryTags(existingOffer.salaryTags                   || []);
    setOvertimeBudgetCodes(existingOffer.overtimeBudgetCodes || []);
    setOvertimeTags(existingOffer.overtimeTags               || []);
    setEditInitialized(true);
  }, [existingOffer, id, isEditMode, editInitialized]);

  // ── Fetch categories ──────────────────────────────────────────────────────
  useEffect(() => {
    axiosConfig
      .get(`/studio/${STUDIO_ID}/categories`, { headers: rh() })
      .then((res) => { if (res.data?.data?.length) setCategories(res.data.data); })
      .catch(() => {});
  }, []);

  // ── Fetch project settings ────────────────────────────────────────────────
  useEffect(() => {
    axiosConfig
      .get(`/project/${PROJECT_ID}/settings`, { headers: rh() })
      .then((res) => { if (res.data?.data) setProjectSettings(res.data.data); })
      .catch(() => {});
  }, []);

  // ── API error toast ────────────────────────────────────────────────────────
  useEffect(() => {
    if (apiError) {
      const msg = apiError.errors?.length
        ? apiError.errors.map((e) => e.message).join(" · ")
        : apiError.message || "Something went wrong";
      toast.error(msg);
      dispatch(clearOfferError());
    }
  }, [apiError, dispatch]);

  const calculatedRates = useMemo(() => {
    const fee = parseFloat(contractData?.feePerDay) || 0;
    return calculateRates(fee, engineSettings);
  }, [contractData?.feePerDay, engineSettings]);

  // ── Build API payload ──────────────────────────────────────────────────────
  const buildPayload = (isDraft = false) => {
    const cd = contractData;
    const allowancesArr = Object.entries(allowances)
      .filter(([, a]) => a.enabled)
      .map(([key, a]) => ({ key, ...a }));

    return {
      studioId:    STUDIO_ID,
      projectId:   PROJECT_ID,
      saveAsDraft: isDraft,

      recipient: {
        fullName:     cd.recipient?.fullName     || "",
        email:        cd.recipient?.email        || "",
        mobileNumber: cd.recipient?.mobileNumber || undefined,
      },
      representation: {
        isViaAgent: !!cd.representation?.isViaAgent,
        agentName:  cd.representation?.agentName  || undefined,
        agentEmail: cd.representation?.agentEmail || undefined,
      },

      alternativeContract: cd.alternativeContract || "",
      unit:                cd.unit                || "",
      department:          cd.department          || "",
      subDepartment:       cd.subDepartment       || "",
      jobTitle:            cd.jobTitle            || "",
      newJobTitle:         cd.newJobTitle         || "",
      createOwnJobTitle:   !!cd.createOwnJobTitle,
      jobTitleSuffix:      cd.jobTitleSuffix      || "",

      taxStatus: {
        allowSelfEmployed:              cd.taxStatus?.allowSelfEmployed              || "",
        statusDeterminationReason:      cd.taxStatus?.statusDeterminationReason      || "",
        otherStatusDeterminationReason: cd.taxStatus?.otherStatusDeterminationReason || "",
      },

      regularSiteOfWork: cd.regularSiteOfWork || "",
      workingInUK:       cd.workingInUK       || "yes",
      startDate:         cd.startDate         || "",
      endDate:           cd.endDate           || "",
      dailyOrWeekly:     cd.dailyOrWeekly     || "daily",
      engagementType:    cd.engagementType    || "paye",
      workingWeek:       cd.workingWeek       || "5",
      categoryId:        cd.categoryId        || undefined,

      currency:    cd.currency    || "GBP",
      feePerDay:   (cd.feePerDay !== "" && cd.feePerDay !== undefined)
        ? cd.feePerDay : (isDraft ? undefined : ""),
      overtime:    cd.overtime    || "calculated",
      otherOT:     cd.otherOT     || "",
      cameraOTSWD: cd.cameraOTSWD || "",
      cameraOTSCWD:cd.cameraOTSCWD|| "",
      cameraOTCWD: cd.cameraOTCWD || "",

      calculatedRates,
      salaryBudgetCodes,
      salaryTags,
      overtimeBudgetCodes,
      overtimeTags,
      allowances: allowancesArr,

      notes: {
        otherDealProvisions: cd.notes?.otherDealProvisions || "",
        additionalNotes:     cd.notes?.additionalNotes     || "",
      },
    };
  };

  // ── EDIT: Save & Resend ────────────────────────────────────────────────────
  //
  // After saving + sending to crew, navigate based on redirectAfterSave param:
  //   "view"       → /offers/:id/view  (default — came from monitoring ViewOffer)
  //   "onboarding" → /onboarding       (came from ProductionReview or AccountsReview edit)
  //
  const handleEditSave = async () => {
    if (isSubmitting) return;

    const offerStatus    = existingOffer?.status;
    const currentVersion = existingOffer?.version || 1;
    const useStandardPut = offerStatus === "NEEDS_REVISION" || offerStatus === "DRAFT";

    toast.loading("Saving changes…", { id: "edit-save" });

    try {
      // ── Step 1: Save the offer ────────────────────────────────────────────
      let saveOk = false;

      if (useStandardPut) {
        // NEEDS_REVISION / DRAFT → standard PUT
        const res = await axiosConfig.put(
          `/offers/${id}`,
          { ...buildPayload(false), version: currentVersion + 1 },
          { headers: rh() }
        );
        saveOk = !!res.data?.success;
      } else {
        // PRODUCTION_CHECK / ACCOUNTS_CHECK / PENDING_* → production-edit
        const res = await axiosConfig.patch(
          `/offers/${id}/production-edit`,
          buildPayload(false),
          { headers: rh() }
        );
        saveOk = !!res.data?.success;
      }

      toast.dismiss("edit-save");

      if (!saveOk) {
        toast.error("Failed to save offer.");
        return;
      }

      // ── Step 2: Resend to crew ─────────────────────────────────────────────
      toast.loading("Sending to crew…", { id: "edit-send" });
      const sendRes = await axiosConfig.patch(
        `/offers/${id}/send`,
        {},
        { headers: rh() }
      );
      toast.dismiss("edit-send");

      if (!sendRes.data?.success) {
        toast.error("Offer saved but failed to send to crew.");
        return;
      }

      toast.success(`✅ Offer v${currentVersion + 1} sent to crew for review!`);

      // Refresh current offer in Redux
      dispatch(getOfferThunk(id));

      // Always refresh the onboarding list so status row updates
      dispatch(getProjectOffersThunk({ projectId: PROJECT_ID }));

      // ── Step 3: Navigate based on who triggered the edit ──────────────────
      //   "view"       → back to ViewOffer (NEEDS_REVISION flow from monitoring)
      //   "onboarding" → back to onboarding list (PRODUCTION_CHECK / ACCOUNTS flow)
      const destination =
        redirectAfterSave === "onboarding"
          ? `/projects/${proj}/onboarding`
          : `/projects/${proj}/offers/${id}/view`;

      setTimeout(() => navigate(destination), 600);

    } catch (err) {
      toast.dismiss("edit-save");
      toast.dismiss("edit-send");
      const msg = err.response?.data?.message || err.message || "Failed to save";
      toast.error(msg);
    }
  };

  // ── CREATE: Save draft ─────────────────────────────────────────────────────
  const handleSaveDraft = async () => {
    if (isSubmitting) return;
    if (isEditMode) { handleEditSave(); return; }

    toast.loading("Saving draft…", { id: "offer-save" });

    let result;
    if (savedOfferIdRef.current) {
      result = await dispatch(updateOfferThunk({ id: savedOfferIdRef.current, data: buildPayload(true) }));
    } else {
      result = await dispatch(createOfferThunk(buildPayload(true)));
    }

    toast.dismiss("offer-save");
    if (!result.error && result.payload?._id) {
      savedOfferIdRef.current = result.payload._id;
      toast.success("✅ Draft saved!");
    }
  };

  // ── CREATE: Send to crew ───────────────────────────────────────────────────
  const handleSendToCrewClick = () => {
    if (isSubmitting || isEditMode) return;
    setDialog("sendToCrew");
  };

  const handleDialogConfirm = async () => {
    setDialog(null);
    toast.loading("Sending offer to crew…", { id: "offer-send" });

    let offerId = savedOfferIdRef.current;
    if (!offerId) {
      const createResult = await dispatch(createOfferThunk(buildPayload(false)));
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
      setTimeout(() => {
        dispatch(clearCurrentOffer());
        navigate(`/projects/${proj}/offers/${offerId}/view`);
      }, 800);
    }
  };

  // ── Header actions ─────────────────────────────────────────────────────────
  const secondaryActions = isEditMode
    ? [{
        label:       "Cancel",
        icon:        "X",
        variant:     "outline",
        disabled:    isSubmitting,
        clickAction: () => navigate(`/projects/${proj}/offers/${id}/view`),
      }]
    : [{
        label:       isSubmitting ? "Saving…" : "Save Draft",
        icon:        "Save",
        variant:     "outline",
        disabled:    isSubmitting,
        clickAction: handleSaveDraft,
      }];

  const isRevisionEdit = isEditMode && (
    existingOffer?.status === "NEEDS_REVISION" || existingOffer?.status === "DRAFT"
  );

  const primaryAction = isEditMode
    ? {
        label:       isSubmitting ? "Saving…" : "Save & Resend to Crew",
        icon:        "Send",
        variant:     "default",
        disabled:    isSubmitting,
        clickAction: handleEditSave,
      }
    : {
        label:       isSubmitting ? "Sending…" : "Send to Crew",
        icon:        "Send",
        variant:     "default",
        disabled:    isSubmitting,
        clickAction: handleSendToCrewClick,
      };

  // ── Loading state (edit mode only) ─────────────────────────────────────────
  if (isEditMode && !editInitialized) {
    return (
      <div className="min-h-screen bg-purple-50/40 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-neutral-500">Loading offer…</p>
        </div>
      </div>
    );
  }

  const dialogPreview = {
    recipient: { fullName: contractData.recipient?.fullName, email: contractData.recipient?.email },
    jobTitle:  contractData.createOwnJobTitle ? contractData.newJobTitle : contractData.jobTitle,
    feePerDay: contractData.feePerDay,
    currency:  contractData.currency,
    startDate: contractData.startDate,
    endDate:   contractData.endDate,
  };

  return (
    <div className="min-h-screen bg-purple-50/40">
      <div className="px-6 pt-6 pb-4">
        <PageHeader
          title={isEditMode
            ? `Edit Offer — ${existingOffer?.offerCode || ""}`
            : "Create Offer"
          }
          icon={isEditMode ? "Edit" : "FileText"}
          secondaryActions={secondaryActions}
          primaryAction={primaryAction}
        />

        {/* Change request banner — shown when editing a NEEDS_REVISION offer */}
        {isRevisionEdit && (
          <div className="mt-4">
            <ChangeRequestBanner offerId={id} />
          </div>
        )}

        {/* Edit mode info banner */}
        {isEditMode && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <p className="text-[12px] text-amber-800">
              <strong>Editing offer v{existingOffer?.version || 1}</strong>
              {" "}— saving will create version {(existingOffer?.version || 1) + 1}, regenerate contracts, and resend to crew for review.
            </p>
          </div>
        )}
      </div>

      <div className="px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">

          {/* Left — ContractForm */}
          <Card>
            <CardContent className="p-4">
              <ContractForm
                data={contractData}
                onChange={setContractData}
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
                onSave={isEditMode ? handleEditSave : handleSaveDraft}
                onPrint={isEditMode ? handleEditSave : handleSaveDraft}
                categories={categories}
              />
            </CardContent>
          </Card>

          {/* Right — Preview */}
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
                projectSettings={projectSettings}
                offer={isEditMode ? existingOffer : null}
                hideOfferSections={false}
                hideContractDocument={false}
              />
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Send to Crew dialog — CREATE mode only */}
      {!isEditMode && (
        <OfferActionDialog
          type="sendToCrew"
          offer={dialogPreview}
          open={dialog === "sendToCrew"}
          onConfirm={handleDialogConfirm}
          onClose={() => setDialog(null)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}