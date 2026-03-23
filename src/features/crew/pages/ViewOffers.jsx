/**
 * ViewOffer.jsx — FIXED
 *
 * KEY FIXES:
 * 1. offerToAllowances() — robust key normalization handles camelCase, snake_case,
 *    UPPER_SNAKE_CASE from backend (v1 vs v2 offers may store differently).
 *
 * 2. calculatedRates memo — ALWAYS prefers offer.calculatedRates snapshot when
 *    salary/overtime rows exist. Falls back to live calc only when truly empty.
 *    This ensures v2 contract edits show the AGREED rates, not a recalculation.
 *
 * 3. offerToContractData() — reads allowances budget codes from offer correctly.
 *
 * 4. useEffect for instance fetch — depends on offer._id AND offer.status AND
 *    offer.version so any re-acceptance of v2 triggers a fresh fetch.
 *
 * 5. After crewAccept thunk resolves, immediately refetch offer so memos get
 *    fresh calculatedRates + allowances without waiting for a page reload.
 */

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate }    from "react-router-dom";
import { useDispatch, useSelector }  from "react-redux";
import { toast }                     from "sonner";

import {
  ArrowLeft, AlertTriangle, Loader2, Download, RefreshCw,
} from "lucide-react";
import { Button } from "../../../shared/components/ui/button";

import {
  getOfferThunk, sendToCrewThunk, markViewedThunk,
  crewAcceptThunk, crewRequestChangesThunk, cancelOfferThunk,
  moveToProductionCheckThunk, moveToAccountsCheckThunk,
  moveToPendingCrewSignatureThunk,
  crewSignThunk, upmSignThunk, fcSignThunk, studioSignThunk,
  getSigningStatusThunk, getContractPreviewThunk, getContractPdfUrlThunk,
  updateOfferThunk,
  selectCurrentOffer, selectOfferLoading, selectSubmitting, selectOfferError,
  selectSigningStatus, selectContractPreviewHtml, selectContractPdfUrl,
  selectIsLoadingPreview, selectIsLoadingPdfUrl, selectContractId,
  clearOfferError, clearContractPreview,
} from "../store/offer.slice";

import { selectViewRole, setViewRole } from "../store/viewrole.slice";

import {
  clearInstances,
  getContractInstancesThunk,
} from "../store/contractInstances.slice";

import OfferStatusProgress from "../components/viewoffer/OfferStatusProgress";
import SignDialog          from "../components/SignaturePad/SignDialog";
import { SIGN_ROLE_MAP }   from "../components/viewoffer/layouts/layoutHelpers";

import LayoutProductionAdmin  from "../components/viewoffer/layouts/LayoutProductionAdmin";
import LayoutProductionReview from "../components/viewoffer/layouts/LayoutProductionReview";
import LayoutAccountsReview   from "../components/viewoffer/layouts/LayoutAccountsReview";
import LayoutAccountsReadOnly from "../components/viewoffer/layouts/LayoutAccountsReadOnly";
import LayoutCrew             from "../components/viewoffer/layouts/LayoutCrew";
import LayoutSignatory        from "../components/viewoffer/layouts/LayoutSignatory";

import { calculateRates, defaultEngineSettings } from "../utils/rateCalculations";
import { defaultAllowances }                      from "../utils/Defaultallowance";

// ── Role switcher config ──────────────────────────────────────────────────────

const ROLES = [
  { key: "PRODUCTION_ADMIN", label: "Production" },
  { key: "CREW",             label: "Crew"        },
  { key: "ACCOUNTS_ADMIN",   label: "Accounts"    },
  { key: "UPM",              label: "UPM"         },
  { key: "FC",               label: "FC"          },
  { key: "STUDIO",           label: "Studio"      },
];

// ── Statuses where contract instances should be fetched ───────────────────────

const INSTANCE_FETCH_STATUSES = [
  "SENT_TO_CREW",
  "NEEDS_REVISION",
  "CREW_ACCEPTED",
  "PRODUCTION_CHECK",
  "ACCOUNTS_CHECK",
  "PENDING_CREW_SIGNATURE",
  "PENDING_UPM_SIGNATURE",
  "PENDING_FC_SIGNATURE",
  "PENDING_STUDIO_SIGNATURE",
  "COMPLETED",
];

// ── Data helpers ──────────────────────────────────────────────────────────────

function offerToContractData(offer) {
  if (!offer) return {};
  return {
    fullName:                       offer.recipient?.fullName        || "",
    email:                          offer.recipient?.email           || "",
    mobileNumber:                   offer.recipient?.mobileNumber    || "",
    isViaAgent:                     offer.representation?.isViaAgent || false,
    agentEmail:                     offer.representation?.agentEmail || "",
    alternativeContract:            offer.alternativeContract        || "",
    unit:                           offer.unit                       || "",
    department:                     offer.department                 || "",
    subDepartment:                  offer.subDepartment              || "",
    jobTitle:                       offer.jobTitle                   || "",
    newJobTitle:                    offer.newJobTitle                || "",
    createOwnJobTitle:              offer.createOwnJobTitle          || false,
    jobTitleSuffix:                 offer.jobTitleSuffix             || "",
    allowSelfEmployed:              offer.taxStatus?.allowSelfEmployed              || "",
    statusDeterminationReason:      offer.taxStatus?.statusDeterminationReason      || "",
    otherStatusDeterminationReason: offer.taxStatus?.otherStatusDeterminationReason || "",
    regularSiteOfWork:              offer.regularSiteOfWork || "",
    workingInUK:                    offer.workingInUK       || "yes",
    startDate:                      offer.startDate         || "",
    endDate:                        offer.endDate           || "",
    dailyOrWeekly:                  offer.dailyOrWeekly     || "daily",
    engagementType:                 offer.engagementType    || "paye",
    category:                       offer.category          || "",
    categoryId:                     offer.categoryId        ? String(offer.categoryId) : "",
    workingWeek:                    offer.workingWeek       || "5",
    currency:                       offer.currency          || "GBP",
    feePerDay:                      offer.feePerDay         || "",
    overtime:                       offer.overtime          || "calculated",
    otherOT:      offer.otherOT      || "",
    cameraOTSWD:  offer.cameraOTSWD  || "",
    cameraOTSCWD: offer.cameraOTSCWD || "",
    cameraOTCWD:  offer.cameraOTCWD  || "",
    otherDealProvisions: offer.notes?.otherDealProvisions || "",
    additionalNotes:     offer.notes?.additionalNotes     || "",
    // Pass through for layout components that read notes directly
    notes: {
      otherDealProvisions: offer.notes?.otherDealProvisions || "",
      additionalNotes:     offer.notes?.additionalNotes     || "",
    },
  };
}

// ── FIX: Robust allowance normalization ────────────────────────────────────────
// Backend may store allowance keys as:
//   camelCase:      "boxRental"   (v1 offers, most common)
//   UPPER_SNAKE:    "BOX_RENTAL"  (some legacy paths)
//   lower_snake:    "box_rental"  (rare)
//
// defaultAllowances uses camelCase keys. We normalize ALL variants to camelCase
// before merging so the UI always gets the right data regardless of version.

function toCamelCase(str) {
  if (!str) return str;
  // Already camelCase with no separators — return as-is
  if (!/[_\s-]/.test(str) && str === str.toLowerCase().replace(/./g, (c, i) => i === 0 ? c : c)) {
    return str;
  }
  return str
    .toLowerCase()
    .replace(/[_\s-]([a-z])/g, (_, c) => c.toUpperCase());
}

// Map of all known backend key variants → canonical camelCase key used by UI
const ALLOWANCE_KEY_MAP = {
  // camelCase (canonical)
  boxRental: "boxRental",
  computer:  "computer",
  software:  "software",
  equipment: "equipment",
  vehicle:   "vehicle",
  mobile:    "mobile",
  living:    "living",
  perDiem1:  "perDiem1",
  perDiem2:  "perDiem2",
  breakfast: "breakfast",
  lunch:     "lunch",
  dinner:    "dinner",
  fuel:      "fuel",
  mileage:   "mileage",
  // UPPER_SNAKE variants
  BOX_RENTAL:        "boxRental",
  COMPUTER:          "computer",
  SOFTWARE:          "software",
  EQUIPMENT:         "equipment",
  EQUIPMENT_RENTAL:  "equipment",
  VEHICLE:           "vehicle",
  MOBILE:            "mobile",
  MOBILE_PHONE:      "mobile",
  LIVING:            "living",
  PER_DIEM:          "perDiem1",
  PER_DIEM_1:        "perDiem1",
  PER_DIEM_2:        "perDiem2",
  // lower_snake variants
  box_rental:        "boxRental",
  equipment_rental:  "equipment",
  mobile_phone:      "mobile",
  per_diem:          "perDiem1",
  per_diem_1:        "perDiem1",
  per_diem_2:        "perDiem2",
};

function offerToAllowances(offer) {
  if (!offer?.allowances?.length) return { ...defaultAllowances };

  // Start from a full copy of defaults so every UI key always exists
  const result = JSON.parse(JSON.stringify(defaultAllowances));

  offer.allowances.forEach((a) => {
    if (!a?.key) return;

    const raw = a.key;

    // Resolve to canonical camelCase key
    const canonical =
      ALLOWANCE_KEY_MAP[raw] ||       // exact map lookup first
      ALLOWANCE_KEY_MAP[toCamelCase(raw)] || // try after camelCase conversion
      (result[raw] !== undefined ? raw : null); // direct match in defaults

    if (!canonical) {
      // Unknown key — still add it so nothing is lost
      result[raw] = { ...a, key: raw };
      return;
    }

    result[canonical] = {
      ...result[canonical], // keep default shape
      ...a,                 // overlay stored values
      key: canonical,       // always use canonical key
      enabled: !!a.enabled, // ensure boolean
    };
  });

  return result;
}

// ── Role switcher UI ──────────────────────────────────────────────────────────

function RoleSwitcher({ viewRole, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded-xl px-2 py-1.5 flex-wrap">
      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide mr-1">
        View as
      </span>
      {ROLES.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
            viewRole === key
              ? "bg-purple-600 text-white shadow-sm"
              : "text-neutral-500 hover:bg-white hover:text-neutral-800"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

export default function ViewOffer() {
  const { id, projectName } = useParams();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const offer          = useSelector(selectCurrentOffer);
  const isLoading      = useSelector(selectOfferLoading);
  const isSubmitting   = useSelector(selectSubmitting);
  const apiError       = useSelector(selectOfferError);
  const viewRole       = useSelector(selectViewRole);
  const signingStatus  = useSelector(selectSigningStatus);
  const previewHtml    = useSelector(selectContractPreviewHtml);
  const contractPdfUrl = useSelector(selectContractPdfUrl);
  const isLoadingPrev  = useSelector(selectIsLoadingPreview);
  const isLoadingPdf   = useSelector(selectIsLoadingPdfUrl);
  const contractId     = useSelector(selectContractId);

  const [signRole, setSignRole] = useState(null);
  const prevSignRef    = useRef(null);
  const prevVersionRef = useRef(null);
  const proj = projectName || "demo-project";

  // ── Fetch offer on mount ───────────────────────────────────────────────────
  useEffect(() => {
    if (id) dispatch(getOfferThunk(id));
  }, [id, dispatch]);

  // ── Mark viewed ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (offer?._id && viewRole === "CREW" && offer.status === "SENT_TO_CREW")
      dispatch(markViewedThunk(offer._id));
  }, [offer?._id, viewRole, offer?.status, dispatch]);

  // ── Fetch signing status + preview when contractId available ──────────────
  useEffect(() => {
    if (!contractId) return;
    dispatch(getSigningStatusThunk(contractId));
    dispatch(getContractPreviewThunk(contractId));
  }, [contractId, dispatch]);

  // ── FIX: Fetch contract instances on offer._id, status AND version change ──
  // Previously only depended on offer._id + status. Adding offer.version ensures
  // that when crew accepts v2 (new version), instances are re-fetched even if
  // the status didn't change from the Redux store's perspective.
  useEffect(() => {
    if (!offer?._id) return;
    if (!INSTANCE_FETCH_STATUSES.includes(offer.status)) return;
    dispatch(clearInstances());
    dispatch(getContractInstancesThunk(offer._id));
  }, [offer?._id, offer?.status, offer?.version, dispatch]); // ← added offer.version

  // ── FIX: Re-fetch offer when version changes (e.g. after v2 crew accept) ──
  // This ensures calculatedRates and allowances memos get fresh data from the
  // server rather than the potentially stale Redux state.
  useEffect(() => {
    if (!offer?.version || !id) return;
    if (prevVersionRef.current !== null && prevVersionRef.current !== offer.version) {
      // Version changed — re-fetch to get latest calculatedRates & allowances
      dispatch(getOfferThunk(id));
    }
    prevVersionRef.current = offer.version;
  }, [offer?.version, id, dispatch]);

  // ── Refresh preview after each signature ──────────────────────────────────
  useEffect(() => {
    const curr = signingStatus?.currentStatus;
    if (!contractId || !curr) return;
    if (prevSignRef.current && prevSignRef.current !== curr) {
      dispatch(clearContractPreview());
      dispatch(getContractPreviewThunk(contractId));
      if (offer?._id) {
        dispatch(clearInstances());
        dispatch(getContractInstancesThunk(offer._id));
      }
    }
    prevSignRef.current = curr;
  }, [signingStatus?.currentStatus, contractId, offer?._id, dispatch]);

  // ── API error toast ────────────────────────────────────────────────────────
  useEffect(() => {
    if (apiError) {
      toast.error(
        apiError.errors?.map((e) => e.message).join(" · ") ||
        apiError.message ||
        "Something went wrong"
      );
      dispatch(clearOfferError());
    }
  }, [apiError, dispatch]);

  // ── Derived state ──────────────────────────────────────────────────────────
  const contractData = useMemo(() => offerToContractData(offer), [offer]);

  // FIX: Use the robust normalizer — handles all key variants from any offer version
  const allowances = useMemo(() => offerToAllowances(offer), [offer]);

  // FIX: ALWAYS prefer the stored calculatedRates snapshot when it has data.
  // This is critical for v2+ offers where the agreed rates must not be
  // recalculated (recalculation can drift due to rounding or setting changes).
  // Only fall back to live calculation when snapshot is genuinely empty
  // (e.g. very old offers created before snapshot was implemented).
  const calculatedRates = useMemo(() => {
    const stored = offer?.calculatedRates;
    const hasStoredSalary    = stored?.salary?.length > 0;
    const hasStoredOvertime  = stored?.overtime?.length > 0;

    if (hasStoredSalary || hasStoredOvertime) {
      // Use the snapshot — this is the agreed rate at time of offer creation/edit
      return {
        salary:   stored.salary   || [],
        overtime: stored.overtime || [],
      };
    }

    // Fallback: live calculation (only for legacy offers without snapshots)
    const fee = parseFloat(contractData.feePerDay) || 0;
    return calculateRates(fee, defaultEngineSettings);
  }, [offer?.calculatedRates, offer?.version, contractData.feePerDay]);

  // ── Budget codes — read directly from offer (not contractData) ─────────────
  // These are top-level arrays on the offer document, not inside contractData.
  const salaryBudgetCodes   = useMemo(() => offer?.salaryBudgetCodes   || [], [offer]);
  const salaryTags          = useMemo(() => offer?.salaryTags          || [], [offer]);
  const overtimeBudgetCodes = useMemo(() => offer?.overtimeBudgetCodes || [], [offer]);
  const overtimeTags        = useMemo(() => offer?.overtimeTags        || [], [offer]);

  // ── Action handler ─────────────────────────────────────────────────────────
  const handleAction = async (action, payload = {}) => {
    const oid = offer?._id;
    if (!oid) return;
    toast.loading("Processing…", { id: "va" });

    const THUNKS = {
      sendToCrew:           () => dispatch(sendToCrewThunk(oid)),
      accept:               () => dispatch(crewAcceptThunk(oid)),
      requestChanges:       () => dispatch(crewRequestChangesThunk({ offerId: oid, ...payload })),
      cancel:               () => dispatch(cancelOfferThunk(oid)),
      productionCheck:      () => dispatch(moveToProductionCheckThunk(oid)),
      accountsCheck:        () => dispatch(moveToAccountsCheckThunk(oid)),
      pendingCrewSignature: () => dispatch(moveToPendingCrewSignatureThunk(oid)),
    };

    const fn = THUNKS[action];
    if (!fn) { toast.dismiss("va"); return; }

    const result = await fn();
    toast.dismiss("va");

    if (!result.error) {
      const MSG = {
        sendToCrew:           "Sent to crew!",
        accept:               "Offer accepted!",
        requestChanges:       "Changes requested.",
        cancel:               "Offer cancelled.",
        productionCheck:      "Moved to Production Check",
        accountsCheck:        "Moved to Accounts Check",
        pendingCrewSignature: "Sent for crew signature",
      };
      toast.success(MSG[action] || "Done");

      // FIX: Always re-fetch the full offer after any action so memos
      // (calculatedRates, allowances, budget codes) get fresh server data.
      const fresh = await dispatch(getOfferThunk(oid));
      const cid   = fresh.payload?.contractId ?? contractId;

      if (cid) {
        dispatch(getSigningStatusThunk(cid));
        dispatch(clearContractPreview());
        dispatch(getContractPreviewThunk(cid));
      }

      // FIX: Always clear + refetch instances after accept or any status move
      // This covers v2 crew accept where the offer version changes.
      if (["accept", "accountsCheck", "pendingCrewSignature", "productionCheck"].includes(action)) {
        dispatch(clearInstances());
        dispatch(getContractInstancesThunk(oid));
      }

    } else {
      toast.error(
        result.payload?.errors?.map(e => e.message).join(" · ") ||
        result.payload?.message ||
        "Something went wrong"
      );
    }
  };

  const handleSign = useCallback((role) => setSignRole(role), []);

  // ── Sign confirm ───────────────────────────────────────────────────────────
  const handleSignConfirm = async (dataUrl) => {
    if (!contractId || !signRole) return;

    const thunkMap = {
      CREW:   crewSignThunk,
      UPM:    upmSignThunk,
      FC:     fcSignThunk,
      STUDIO: studioSignThunk,
    };

    const result = await dispatch(thunkMap[signRole]({ contractId, signature: dataUrl }));

    if (!result.error) {
      toast.success(`${signRole} signature recorded!`);
      // FIX: Re-fetch full offer so allowances/rates memos update
      await dispatch(getOfferThunk(offer._id));
      await dispatch(getSigningStatusThunk(contractId));
      dispatch(clearContractPreview());
      dispatch(getContractPreviewThunk(contractId));
      dispatch(clearInstances());
      dispatch(getContractInstancesThunk(offer._id));
    } else {
      toast.error(result.payload?.message || "Failed to sign");
    }

    setSignRole(null);
  };

  const handleDownloadPdf = async () => {
    if (!contractId) return;
    if (contractPdfUrl) { window.open(contractPdfUrl, "_blank"); return; }
    const r = await dispatch(getContractPdfUrlThunk(contractId));
    if (!r.error && r.payload?.url) window.open(r.payload.url, "_blank");
    else toast.error("Could not get PDF link");
  };

  const handleRefresh = async () => {
    // FIX: Re-fetch offer first so memos get fresh data, then fetch instances
    const r   = await dispatch(getOfferThunk(id));
    const cid = r.payload?.contractId ?? contractId;
    if (cid) {
      dispatch(getSigningStatusThunk(cid));
      dispatch(clearContractPreview());
      dispatch(getContractPreviewThunk(cid));
    }
    dispatch(clearInstances());
    if (id) dispatch(getContractInstancesThunk(id));
  };

  // ── Layout routing ─────────────────────────────────────────────────────────
  const isProdAdmin = viewRole === "PRODUCTION_ADMIN" || viewRole === "SUPER_ADMIN";
  const isAcctAdmin = viewRole === "ACCOUNTS_ADMIN";
  const isCrew      = viewRole === "CREW";
  const isSignatory = ["UPM", "FC", "STUDIO"].includes(viewRole);

  const isProdReview = isProdAdmin && offer?.status === "PRODUCTION_CHECK";
  const isAcctReview = isAcctAdmin && offer?.status === "ACCOUNTS_CHECK";

  const tl     = offer?.timeline || {};
  const hasPdf = !!(signingStatus?.pdfS3Key);

  // FIX: Build sharedProps using the memoized values derived from the CURRENT offer.
  // All layout components receive the same set of props so allowances, budget codes,
  // and calculatedRates are always consistent across Production Review, Accounts Review,
  // Crew view, and signing stages regardless of offer version.
  const sharedProps = {
    offer,
    contractData,
    allowances,       // ← from robust offerToAllowances()
    calculatedRates,  // ← always snapshot-first
    isSubmitting,
    onAction: handleAction,
    dispatch,
  };

  // ── Loading / not found ────────────────────────────────────────────────────
  if (isLoading && !offer) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
          <p className="text-sm text-neutral-500">Loading offer…</p>
        </div>
      </div>
    );
  }

  if (!offer && !isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm font-medium text-neutral-700">Offer not found</p>
          <Button size="sm" variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="px-4 space-y-4">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/projects/${proj}/offers`)}
            className="gap-2 text-neutral-500 hover:text-neutral-800 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <RoleSwitcher viewRole={viewRole} onChange={(r) => dispatch(setViewRole(r))} />

          <div className="flex items-center gap-2 shrink-0">
            {offer?.offerCode && (
              <span className="text-xs font-mono text-neutral-400 bg-neutral-100 border border-neutral-200 px-2 py-1 rounded">
                {offer.offerCode}
              </span>
            )}
            {offer?.version > 1 && (
              <span className="text-xs font-mono text-violet-600 bg-violet-50 border border-violet-200 px-2 py-1 rounded">
                v{offer.version}
              </span>
            )}
            {hasPdf && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-8 text-xs"
                disabled={isLoadingPdf}
                onClick={handleDownloadPdf}
              >
                {isLoadingPdf
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Download className="w-3.5 h-3.5" />
                }
                PDF
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              title="Refresh"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Status progress */}
        <OfferStatusProgress
          status={offer?.status}
          sentToCrewAt={tl.sentToCrewAt}
          updatedAt={offer?.updatedAt}
          crewAcceptedAt={tl.crewAcceptedAt}
          productionCheckCompletedAt={tl.productionCheckCompletedAt}
          accountsCheckCompletedAt={tl.accountsCheckCompletedAt}
          crewSignedAt={tl.crewSignedAt}
          upmSignedAt={tl.upmSignedAt}
          fcSignedAt={tl.fcSignedAt}
          studioSignedAt={tl.studioSignedAt}
        />

        {/* Layout routing */}
        {isProdReview && (
          <LayoutProductionReview
            {...sharedProps}
            salaryBudgetCodes={salaryBudgetCodes}
            salaryTags={salaryTags}
            overtimeBudgetCodes={overtimeBudgetCodes}
            overtimeTags={overtimeTags}
          />
        )}

        {isAcctReview && (
          <LayoutAccountsReview
            {...sharedProps}
            salaryBudgetCodes={salaryBudgetCodes}
            salaryTags={salaryTags}
            overtimeBudgetCodes={overtimeBudgetCodes}
            overtimeTags={overtimeTags}
          />
        )}

        {isProdAdmin && !isProdReview && (
          <LayoutProductionAdmin
            {...sharedProps}
            salaryBudgetCodes={salaryBudgetCodes}
            salaryTags={salaryTags}
            overtimeBudgetCodes={overtimeBudgetCodes}
            overtimeTags={overtimeTags}
            signingStatus={signingStatus}
            previewHtml={previewHtml}
            isLoadingPrev={isLoadingPrev}
            onSign={handleSign}
          />
        )}

        {isCrew && (
          <LayoutCrew
            {...sharedProps}
            salaryBudgetCodes={salaryBudgetCodes}
            salaryTags={salaryTags}
            overtimeBudgetCodes={overtimeBudgetCodes}
            overtimeTags={overtimeTags}
            signingStatus={signingStatus}
            previewHtml={previewHtml}
            isLoadingPrev={isLoadingPrev}
            onSign={handleSign}
          />
        )}

        {isAcctAdmin && !isAcctReview && (
          <LayoutAccountsReadOnly
            {...sharedProps}
            salaryBudgetCodes={salaryBudgetCodes}
            salaryTags={salaryTags}
            overtimeBudgetCodes={overtimeBudgetCodes}
            overtimeTags={overtimeTags}
            previewHtml={previewHtml}
            isLoadingPrev={isLoadingPrev}
          />
        )}

        {isSignatory && (
          <LayoutSignatory
            {...sharedProps}
            salaryBudgetCodes={salaryBudgetCodes}
            salaryTags={salaryTags}
            overtimeBudgetCodes={overtimeBudgetCodes}
            overtimeTags={overtimeTags}
            role={viewRole}
            signingStatus={signingStatus}
            previewHtml={previewHtml}
            isLoadingPrev={isLoadingPrev}
            onSign={handleSign}
          />
        )}

      </div>

      {/* Sign dialog */}
      {signRole && (
        <SignDialog
          open={!!signRole}
          onOpenChange={(open) => { if (!open) setSignRole(null); }}
          roleName={SIGN_ROLE_MAP[signRole]?.label || signRole}
          offerCode={offer?.offerCode}
          onSign={handleSignConfirm}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}