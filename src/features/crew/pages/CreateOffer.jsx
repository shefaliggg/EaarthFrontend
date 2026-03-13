/**
 * CreateOffer.jsx  (FIXED)
 *
 * FIXES FROM REVIEW:
 *  1. defaultContractData restructured to match offer.model.js nested shape
 *     (recipient, representation, taxStatus, notes all nested correctly)
 *  2. categoryId added to payload (required for backend bundle resolution)
 *  3. buildPayload reads from correct nested paths (cd.recipient.*, cd.taxStatus.*, etc.)
 *  4. dialogPreview jobTitle respects createOwnJobTitle flag
 *  5. Allowance label removed from payload (backend doesn't need it)
 *  6. px- typo fixed → px-6
 *  7. projectSettings passed to CreateOfferLayout → ContractDocument
 *  8. categories fetched from API and passed to ContractForm
 *  9. FIX: fetchCategories and fetchSettings now use axiosConfig (not raw fetch)
 *     so auth headers are automatically included.
 * 10. FIX: fetch URL corrected from /api/studio/.../contract-categories
 *     to /studio/.../categories (axiosConfig has /api/v1 base already)
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

// FIX: use axiosConfig for all API calls so auth token is automatically included
import axiosConfig from "../../auth/config/axiosConfig";

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

// ─── Config — single project/studio for now ───────────────────────────────────
import { APP_CONFIG } from "../config/appConfig";

const STUDIO_ID  = APP_CONFIG.STUDIO_ID;
const PROJECT_ID = APP_CONFIG.PROJECT_ID;

// ─── Default form state — matches offer.model.js nested shape ─────────────────
const defaultContractData = {
  // ── RECIPIENT ──────────────────────────────────────────────────────────────
  recipient: {
    fullName:     "",
    email:        "",
    mobileNumber: "",
  },

  // ── REPRESENTATION ─────────────────────────────────────────────────────────
  representation: {
    isViaAgent: false,
    agentName:  "",
    agentEmail: "",
  },

  // ── TOP-LEVEL FIELDS ───────────────────────────────────────────────────────
  alternativeContract:  "",
  unit:                 "main",
  department:           "",
  subDepartment:        "new",
  jobTitle:             "",
  searchAllDepartments: false,
  createOwnJobTitle:    false,
  newJobTitle:          "",
  jobTitleSuffix:       "",

  // ── TAX STATUS ─────────────────────────────────────────────────────────────
  taxStatus: {
    allowSelfEmployed:              "no",
    statusDeterminationReason:      "hmrc_list",
    otherStatusDeterminationReason: "",
  },

  // ── PLACE OF WORK ──────────────────────────────────────────────────────────
  regularSiteOfWork: "on_set",
  workingInUK:       "yes",

  // ── ENGAGEMENT ─────────────────────────────────────────────────────────────
  startDate:      "",
  endDate:        "",
  dailyOrWeekly:  "daily",
  engagementType: "paye",
  workingWeek:    "5",
  categoryId:     "",   // ObjectId of ContractFormCategory — drives bundle

  // ── RATES ──────────────────────────────────────────────────────────────────
  currency:    "GBP",
  feePerDay:   "",
  overtime:    "calculated",
  otherOT:     "",
  cameraOTSWD: "",
  cameraOTSCWD:"",
  cameraOTCWD: "",

  // ── NOTES ──────────────────────────────────────────────────────────────────
  notes: {
    otherDealProvisions: "",
    additionalNotes:     "",
  },
};

export default function CreateOfferPage() {
  const navigate        = useNavigate();
  const dispatch        = useDispatch();
  const { projectName } = useParams();

  const isSubmitting = useSelector(selectSubmitting);
  const apiError     = useSelector(selectOfferError);

  const [activeField, setActiveField] = useState(null);
  const savedOfferIdRef = useRef(null);
  const [dialog, setDialog] = useState(null);

  // Categories fetched from backend — passed to ContractForm for the dropdown
  const [categories, setCategories] = useState(null);
  // Project settings fetched from backend — passed to ContractDocument via CreateOfferLayout
  const [projectSettings, setProjectSettings] = useState(null);

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

  // ── Fetch categories on mount ────────────────────────────────────────────
  // FIX: was using raw fetch() with wrong URL /api/studio/.../contract-categories
  // NOW:  uses axiosConfig (auth headers automatic) with correct path /studio/.../categories
  // axiosConfig base URL already includes /api/v1 so we only add /studio/...
  useEffect(() => {
    axiosConfig
      .get(`/studio/${STUDIO_ID}/categories`, {
        headers: { "x-view-as-role": localStorage.getItem("viewRole") || "PRODUCTION_ADMIN" },
      })
      .then((res) => {
        if (res.data?.data?.length) setCategories(res.data.data);
      })
      .catch(() => {
        // silently fall back to static list in ContractForm — no error toast needed
      });
  }, []);

  // ── Fetch project settings on mount ─────────────────────────────────────
  // FIX: was using raw fetch() — now uses axiosConfig for consistent auth
  useEffect(() => {
    axiosConfig
      .get(`/project/${PROJECT_ID}/settings`, {
        headers: { "x-view-as-role": localStorage.getItem("viewRole") || "PRODUCTION_ADMIN" },
      })
      .then((res) => {
        if (res.data?.data) setProjectSettings(res.data.data);
      })
      .catch(() => {
        // not fatal — ContractDocument has fallbacks
      });
  }, []);

  // ── API error toast ──────────────────────────────────────────────────────
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
  const buildPayload = (isDraft = false) => {
    const cd = contractData;

    // Only send enabled allowances — no label field (backend doesn't use it)
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

      // categoryId — ObjectId from ContractFormCategory (fetched from API)
      categoryId: cd.categoryId || undefined,

      currency: cd.currency || "GBP",

      // Send undefined (not "") for feePerDay when empty on drafts
      feePerDay: (cd.feePerDay !== "" && cd.feePerDay !== undefined)
        ? cd.feePerDay
        : (isDraft ? undefined : ""),

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

  // ── SAVE DRAFT ───────────────────────────────────────────────────────────
  const handleSaveDraft = async () => {
    if (isSubmitting) return;
    toast.loading("Saving draft…", { id: "offer-save" });

    let result;
    if (savedOfferIdRef.current) {
      result = await dispatch(updateOfferThunk({
        id:   savedOfferIdRef.current,
        data: buildPayload(true),
      }));
    } else {
      result = await dispatch(createOfferThunk(buildPayload(true)));
    }

    toast.dismiss("offer-save");

    if (!result.error && result.payload?._id) {
      savedOfferIdRef.current = result.payload._id;
      toast.success("✅ Draft saved!");
    }
  };

  // ── SEND TO CREW ─────────────────────────────────────────────────────────
  const handleSendToCrewClick = () => {
    if (isSubmitting) return;
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
      const proj = projectName || "demo-project";
      setTimeout(() => {
        dispatch(clearCurrentOffer());
        navigate(`/projects/${proj}/offers/${offerId}/view`);
      }, 800);
    }
  };

  // Dialog preview — respects createOwnJobTitle flag
  const dialogPreview = {
    recipient: {
      fullName: contractData.recipient?.fullName,
      email:    contractData.recipient?.email,
    },
    jobTitle: contractData.createOwnJobTitle
      ? contractData.newJobTitle
      : contractData.jobTitle,
    feePerDay: contractData.feePerDay,
    currency:  contractData.currency,
    startDate: contractData.startDate,
    endDate:   contractData.endDate,
  };

  return (
    <div className="min-h-screen bg-purple-50/40">
      <div className="px-6 pt-6 pb-4">
        <PageHeader
          title="Create Offer"
          icon="FileText"
          secondaryActions={[{
            label:       isSubmitting ? "Saving…" : "Save Draft",
            icon:        "Save",
            variant:     "outline",
            disabled:    isSubmitting,
            clickAction: handleSaveDraft,
          }]}
          primaryAction={{
            label:       isSubmitting ? "Sending…" : "Send to Crew",
            icon:        "Send",
            variant:     "default",
            disabled:    isSubmitting,
            clickAction: handleSendToCrewClick,
          }}
        />
      </div>

      <div className="px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">

          {/* Left panel — ContractForm */}
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
                onSave={handleSaveDraft}
                onPrint={handleSaveDraft}
                // Real categories from API — dropdown uses ObjectIds not slugs
                categories={categories}
              />
            </CardContent>
          </Card>

          {/* Right panel — CreateOfferLayout (preview) */}
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