/**
 * CreateOffer.jsx — Unified Create + Edit page
 *
 * CHANGES:
 *   - totalProductValue removed — replaced by categoryTotals
 *   - categoryTotals computed from inventoryItems grouped by item.category:
 *       { box: number, software: number, equipment: number }
 *     Each allowance uses its own category total for % cap calculations.
 *   - categoryTotals passed to ContractForm → AllowanceRow for live cap preview
 *   - categoryTotals + inventoryItems stored in API payload for edit-mode restore
 *   - offerToAllowances() — base built with enabled: false
 *   - workingHours at contractData level (not schedule)
 *   - subDepartment is a plain string
 *   - department stored as display name string
 *   - specialStipulations included in API payload
 *   - prefillFromUser: production admin enters userId → recipient, representation
 *     and allowances auto-populated from completed crew profile
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

const rh = () => ({
  "x-view-as-role": localStorage.getItem("viewRole") || "PRODUCTION_ADMIN",
});

// ─── Default form state ────────────────────────────────────────────────────────
const defaultContractData = {
  recipient:      { fullName: "", email: "", mobileNumber: "" },
  representation: { isViaAgent: false, agentName: "", agentEmail: "" },
  alternativeContract:  "",
  unit:                 "",
  department:           "",
  subDepartment:        "",
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
  workingHours: 11,
  overtime:    "calculated",
  otherOT:     "",
  cameraOTSWD: "",
  cameraOTSCWD:"",
  cameraOTCWD: "",
  specialStipulations: [],
  notes: { otherDealProvisions: "", additionalNotes: "" },
};

// ─── Default schedule ─────────────────────────────────────────────────────────
const defaultSchedule = {
  hiatus: [{ start: "", end: "", reason: "" }],
  prePrep: { start: "", end: "", notes: "" },
  blocks: [
    {
      name: "BLOCK 1",
      prep: { start: "", end: "", notes: "" },
      start: "",
      end: "",
      notes: "",
    },
  ],
  wrap: { start: "", end: "", notes: "" },
  totalDays: 0,
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
    alternativeContract: offer.alternativeContract || "",
    unit:          offer.unit          || "",
    department:    offer.department    || "",
    subDepartment: offer.subDepartment || "",
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
    workingHours: offer.workingHours ?? 11,
    overtime:    offer.overtime    || "calculated",
    otherOT:     offer.otherOT     || "",
    cameraOTSWD: offer.cameraOTSWD || "",
    cameraOTSCWD:offer.cameraOTSCWD|| "",
    cameraOTCWD: offer.cameraOTCWD || "",
    specialStipulations: Array.isArray(offer.specialStipulations)
      ? offer.specialStipulations
      : [],
    notes: {
      otherDealProvisions: offer.notes?.otherDealProvisions || "",
      additionalNotes:     offer.notes?.additionalNotes     || "",
    },
  };
}

// ─── Transform existing offer → schedule shape ────────────────────────────────
function offerToSchedule(offer) {
  if (!offer?.schedule) return defaultSchedule;
  const s = offer.schedule;
  return {
    hiatus:  Array.isArray(s.hiatus) && s.hiatus.length > 0
      ? s.hiatus
      : [{ start: "", end: "", reason: "" }],
    prePrep: s.prePrep ?? { start: "", end: "", notes: "" },
    blocks:  Array.isArray(s.blocks) && s.blocks.length > 0
      ? s.blocks
      : [{ name: "BLOCK 1", prep: { start: "", end: "", notes: "" }, start: "", end: "", notes: "" }],
    wrap:    s.wrap    ?? { start: "", end: "", notes: "" },
    totalDays: s.totalDays ?? 0,
  };
}

// ─── Transform allowances array → object ─────────────────────────────────────
function offerToAllowances(offer) {
  const result = Object.fromEntries(
    Object.entries(defaultAllowances).map(([k, v]) => [k, { ...v, enabled: false }])
  );

  if (!offer?.allowances?.length) return result;

  offer.allowances.forEach((a) => {
    if (!a?.key) return;
    const key = a.key;
    if (result[key] !== undefined) {
      result[key] = { ...result[key], ...a, key, enabled: !!a.enabled };
    } else {
      result[key] = { ...a, key, enabled: !!a.enabled };
    }
  });

  return result;
}

// ─── computeCategoryTotals ────────────────────────────────────────────────────
function computeCategoryTotals(inventoryItems = []) {
  const totals = { box: 0, software: 0, equipment: 0 };
  inventoryItems.forEach((item) => {
    const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.amount) || 0);
    if (item.category === "box")       totals.box       += lineTotal;
    if (item.category === "software")  totals.software  += lineTotal;
    if (item.category === "equipment") totals.equipment += lineTotal;
  });
  return totals;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CreateOfferPage() {
  const navigate            = useNavigate();
  const dispatch            = useDispatch();
  const { projectName, id } = useParams();
  const [searchParams]      = useSearchParams();

  const isEditMode = Boolean(id);
  const redirectAfterSave = searchParams.get("redirectTo") || "view";

  const isSubmitting  = useSelector(selectSubmitting);
  const apiError      = useSelector(selectOfferError);
  const existingOffer = useSelector(selectCurrentOffer);

  const [activeField,     setActiveField    ] = useState(null);
  const [categories,      setCategories     ] = useState(null);
  const [projectSettings, setProjectSettings] = useState(null);
  const [dialog,          setDialog         ] = useState(null);
  const [editInitialized, setEditInitialized] = useState(false);

  const [inventoryItems, setInventoryItems] = useState([]);

  // ── Prefill state ──────────────────────────────────────────────────────────
  const [prefillUserId, setPrefillUserId] = useState("");
  const [isPrefilling,  setIsPrefilling ] = useState(false);
  const [prefillDone,   setPrefillDone  ] = useState(false);

  const savedOfferIdRef = useRef(null);
  const proj = projectName || "demo-project";

  const [contractData,        setContractData       ] = useState(defaultContractData);
  const [schedule,            setSchedule           ] = useState(defaultSchedule);
  const [allowances,          setAllowances         ] = useState(() =>
    Object.fromEntries(
      Object.entries(defaultAllowances).map(([k, v]) => [k, { ...v, enabled: false }])
    )
  );
  const [salaryBudgetCodes,   setSalaryBudgetCodes  ] = useState([]);
  const [salaryTags,          setSalaryTags         ] = useState([]);
  const [overtimeBudgetCodes, setOvertimeBudgetCodes] = useState([]);
  const [overtimeTags,        setOvertimeTags       ] = useState([]);
  const [engineSettings]                              = useState(defaultEngineSettings);

  const categoryTotals = useMemo(
    () => computeCategoryTotals(inventoryItems),
    [inventoryItems]
  );

  useEffect(() => {
    if (!isEditMode) return;
    dispatch(getOfferThunk(id));
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (!isEditMode || !existingOffer || editInitialized) return;
    if (existingOffer._id !== id) return;

    setContractData(offerToFormData(existingOffer));
    setSchedule(offerToSchedule(existingOffer));
    setAllowances(offerToAllowances(existingOffer));
    setSalaryBudgetCodes(existingOffer.salaryBudgetCodes     || []);
    setSalaryTags(existingOffer.salaryTags                   || []);
    setOvertimeBudgetCodes(existingOffer.overtimeBudgetCodes || []);
    setOvertimeTags(existingOffer.overtimeTags               || []);

    if (Array.isArray(existingOffer.inventoryItems)) {
      setInventoryItems(existingOffer.inventoryItems);
    }

    setEditInitialized(true);
  }, [existingOffer, id, isEditMode, editInitialized]);

  useEffect(() => {
    axiosConfig
      .get(`/studio/${STUDIO_ID}/categories`, { headers: rh() })
      .then((res) => { if (res.data?.data?.length) setCategories(res.data.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    axiosConfig
      .get(`/project/${PROJECT_ID}/settings`, { headers: rh() })
      .then((res) => { if (res.data?.data) setProjectSettings(res.data.data); })
      .catch(() => {});
  }, []);

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

  // ── Prefill from crew profile ──────────────────────────────────────────────
  //
  // Calls GET /offers/prefill/:userId
  // Merges recipient + representation into contractData.
  // Merges profile allowances (box rental, equipment, software, computer, mobile)
  // into allowances state — each enabled with summed feePerWeek + description.
  // Also restores inventoryItems so categoryTotals rehydrates for AllowanceRow caps.

  const handlePrefillFromUser = async () => {
    const uid = prefillUserId.trim();
    if (!uid) return;

    setIsPrefilling(true);
    try {
      const res = await axiosConfig.get(`/offers/prefill/${uid}`, { headers: rh() });
      const {
        recipient,
        representation,
        allowances:     profileAllowances,
        inventoryItems: profileInventory,
      } = res.data.data;

      // Merge recipient + representation
      setContractData((prev) => ({
        ...prev,
        recipient:      { ...prev.recipient,      ...recipient },
        representation: { ...prev.representation, ...representation },
      }));

      // Merge allowances — only overwrite keys that came from profile
      if (profileAllowances?.length > 0) {
        setAllowances((prev) => {
          const next = { ...prev };
          profileAllowances.forEach((a) => {
            if (!a.key) return;
            next[a.key] = {
              ...(next[a.key] || {}),
              ...a,
              enabled: true,
            };
          });
          return next;
        });
      }

      // Restore inventory items so categoryTotals rehydrates
      if (profileInventory?.length > 0) {
        setInventoryItems(profileInventory);
      }

      setPrefillDone(true);
      toast.success("✅ Profile data loaded successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "User not found or profile incomplete"
      );
    } finally {
      setIsPrefilling(false);
    }
  };

  // Allow pressing Enter in the userId input
  const handlePrefillKeyDown = (e) => {
    if (e.key === "Enter") handlePrefillFromUser();
  };

  // Clear prefill — resets recipient + representation + allowances back to defaults
  const handleClearPrefill = () => {
    setContractData((prev) => ({
      ...prev,
      recipient:      defaultContractData.recipient,
      representation: defaultContractData.representation,
    }));
    setAllowances(
      Object.fromEntries(
        Object.entries(defaultAllowances).map(([k, v]) => [k, { ...v, enabled: false }])
      )
    );
    setInventoryItems([]);
    setPrefillUserId("");
    setPrefillDone(false);
    toast.info("Prefill cleared");
  };

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

      unit:          cd.unit          || "",
      department:    cd.department    || "",
      subDepartment: cd.subDepartment || "",

      jobTitle:          cd.jobTitle          || "",
      newJobTitle:       cd.newJobTitle       || "",
      createOwnJobTitle: !!cd.createOwnJobTitle,
      jobTitleSuffix:    cd.jobTitleSuffix    || "",

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

      currency:  cd.currency  || "GBP",
      feePerDay: (cd.feePerDay !== "" && cd.feePerDay !== undefined)
        ? cd.feePerDay : (isDraft ? undefined : ""),

      workingHours: cd.workingHours ?? 11,

      overtime:    cd.overtime    || "calculated",
      otherOT:     cd.otherOT     || "",
      cameraOTSWD: cd.cameraOTSWD || "",
      cameraOTSCWD:cd.cameraOTSCWD|| "",
      cameraOTCWD: cd.cameraOTCWD || "",

      schedule,

      specialStipulations: Array.isArray(cd.specialStipulations)
        ? cd.specialStipulations.filter((s) => s.body?.trim())
        : [],

      calculatedRates,
      salaryBudgetCodes,
      salaryTags,
      overtimeBudgetCodes,
      overtimeTags,
      allowances: allowancesArr,

      inventoryItems,
      categoryTotals,

      notes: {
        otherDealProvisions: cd.notes?.otherDealProvisions || "",
        additionalNotes:     cd.notes?.additionalNotes     || "",
      },
    };
  };

  // ── EDIT: Save & Resend ────────────────────────────────────────────────────
  const handleEditSave = async () => {
    if (isSubmitting) return;

    const offerStatus    = existingOffer?.status;
    const currentVersion = existingOffer?.version || 1;
    const useStandardPut = offerStatus === "NEEDS_REVISION" || offerStatus === "DRAFT";

    toast.loading("Saving changes…", { id: "edit-save" });

    try {
      let saveOk = false;

      if (useStandardPut) {
        const res = await axiosConfig.put(
          `/offers/${id}`,
          { ...buildPayload(false), version: currentVersion + 1 },
          { headers: rh() }
        );
        saveOk = !!res.data?.success;
      } else {
        const res = await axiosConfig.patch(
          `/offers/${id}/production-edit`,
          buildPayload(false),
          { headers: rh() }
        );
        saveOk = !!res.data?.success;
      }

      toast.dismiss("edit-save");

      if (!saveOk) { toast.error("Failed to save offer."); return; }

      toast.loading("Sending to crew…", { id: "edit-send" });
      const sendRes = await axiosConfig.patch(`/offers/${id}/send`, {}, { headers: rh() });
      toast.dismiss("edit-send");

      if (!sendRes.data?.success) {
        toast.error("Offer saved but failed to send to crew.");
        return;
      }

      toast.success(`✅ Offer v${currentVersion + 1} sent to crew for review!`);
      dispatch(getOfferThunk(id));
      dispatch(getProjectOffersThunk({ projectId: PROJECT_ID }));

      const destination = redirectAfterSave === "onboarding"
        ? `/projects/${proj}/onboarding`
        : `/projects/${proj}/offers/${id}/view`;

      setTimeout(() => navigate(destination), 600);

    } catch (err) {
      toast.dismiss("edit-save");
      toast.dismiss("edit-send");
      toast.error(err.response?.data?.message || err.message || "Failed to save");
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

        {isRevisionEdit && (
          <div className="mt-4">
            <ChangeRequestBanner offerId={id} />
          </div>
        )}

        {isEditMode && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <p className="text-[12px] text-amber-800">
              <strong>Editing offer v{existingOffer?.version || 1}</strong>
              {" "}— saving will create version {(existingOffer?.version || 1) + 1}, regenerate contracts, and resend to crew for review.
            </p>
          </div>
        )}

        {/* ── Prefill from crew profile — only shown on create, not edit ── */}
        {!isEditMode && (
          <div className="mt-3 bg-white border border-purple-100 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">

              {/* Left — label + description */}
              <div className="min-w-0">
                <p className="text-xs font-medium text-neutral-700">
                  Load from crew profile
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Enter a crew member's User ID to prefill recipient details, representation and allowances from their completed profile.
                </p>
              </div>

              {/* Right — input + buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {prefillDone && (
                  <button
                    onClick={handleClearPrefill}
                    className="text-[11px] text-neutral-400 hover:text-neutral-600 underline underline-offset-2 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Paste User ID…"
                  value={prefillUserId}
                  onChange={(e) => setPrefillUserId(e.target.value)}
                  onKeyDown={handlePrefillKeyDown}
                  disabled={isPrefilling}
                  className="text-xs border border-neutral-200 rounded-md px-3 py-1.5 w-56 focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:opacity-50 disabled:bg-neutral-50"
                />
                <button
                  onClick={handlePrefillFromUser}
                  disabled={isPrefilling || !prefillUserId.trim()}
                  className="text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-md px-3 py-1.5 disabled:opacity-40 transition-colors whitespace-nowrap"
                >
                  {isPrefilling ? "Loading…" : "Load Profile"}
                </button>
              </div>

            </div>

            {/* Success badge shown after prefill */}
            {prefillDone && (
              <div className="mt-2.5 flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  Profile loaded for <strong>{contractData.recipient?.fullName || prefillUserId}</strong>.
                  Recipient, representation and allowances prefilled — complete the remaining fields below.
                </span>
              </div>
            )}
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
                schedule={schedule}
                setSchedule={setSchedule}
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
                categoryTotals={categoryTotals}
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
                schedule={schedule}
                hideOfferSections={false}
                hideContractDocument={false}
                inventoryItems={inventoryItems}
                onInventoryChange={setInventoryItems}
              />
            </CardContent>
          </Card>

        </div>
      </div>

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