/**
 * ViewOffer.jsx — FIXED
 *
 * KEY FIX — stage does not advance after all docs signed:
 *
 *   handleAllSigned(role) is now wired to ContractInstancesPanel's onAllSigned prop
 *   (via LayoutCrew and LayoutSignatory). It calls the correct status-advance thunk
 *   depending on which role just finished signing:
 *
 *     CREW   → moveToPendingUpmSignatureThunk
 *     UPM    → moveToPendingFcSignatureThunk
 *     FC     → moveToPendingStudioSignatureThunk
 *     STUDIO → completeOfferThunk
 *
 *   After the thunk resolves the offer is re-fetched so Redux + the UI reflect
 *   the new status immediately, and the viewRole auto-advances to the next
 *   signatory (via the STATUS_TO_ROLE map that was already present).
 *
 * OTHER FIXES (preserved from previous iteration):
 *   1. profileSignature uses ONLY the Redux store selector
 *   2. Version refetch guard: only refetch when version strictly increases
 *   3. clearInstances() removed from post-sign flows — prevents flicker
 *   4. handleRefresh uses offer._id for instance fetch
 *   5. calculatedRates memo depends on offer?.feePerDay
 *   6. offerToAllowances — enabled: false default + robust enabled fallback
 *   7. onSignInstance re-fetches the offer after each document is signed
 *   8. SignDialog completely removed — all roles sign inline
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
  moveToPendingUpmSignatureThunk,
  moveToPendingFcSignatureThunk,
  moveToPendingStudioSignatureThunk,
  completeOfferThunk,
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
  signContractInstanceThunk,
} from "../store/contractInstances.slice";

import { fetchCurrentSignatureThunk } from "../../signature/store/signature.thunk";
import { selectProfileSignatureUrl }  from "../../signature/store/signature.slice";

import OfferStatusProgress from "../components/viewoffer/OfferStatusProgress";

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
  "TERMINATED",
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
    notes: {
      otherDealProvisions: offer.notes?.otherDealProvisions || "",
      additionalNotes:     offer.notes?.additionalNotes     || "",
    },
    workingHours: offer.workingHours ?? 11,
    specialStipulations: Array.isArray(offer.specialStipulations)
      ? offer.specialStipulations
      : [],
  };
}

// ── Allowance normalization ───────────────────────────────────────────────────

function toCamelCase(str) {
  if (!str) return str;
  return str
    .toLowerCase()
    .replace(/[_\s-]([a-z])/g, (_, c) => c.toUpperCase());
}

const ALLOWANCE_KEY_MAP = {
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
  box_rental:        "boxRental",
  equipment_rental:  "equipment",
  mobile_phone:      "mobile",
  per_diem:          "perDiem1",
  per_diem_1:        "perDiem1",
  per_diem_2:        "perDiem2",
};

function offerToAllowances(offer) {
  const result = Object.fromEntries(
    Object.entries(defaultAllowances).map(([k, v]) => [
      k,
      { ...v, enabled: false },
    ])
  );

  if (!Array.isArray(offer?.allowances) || !offer.allowances.length) return result;

  offer.allowances.forEach((a) => {
    if (!a?.key) return;
    const raw = a.key;
    const canonical =
      ALLOWANCE_KEY_MAP[raw] ||
      ALLOWANCE_KEY_MAP[toCamelCase(raw)] ||
      (result[raw] !== undefined ? raw : null);

    if (!canonical) {
      result[raw] = { ...a, key: raw, enabled: !!a.enabled };
      return;
    }

    result[canonical] = {
      ...result[canonical],
      ...a,
      key:     canonical,
      enabled: !!a.enabled,
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

// ── Status → viewRole auto-advance map ────────────────────────────────────────
const STATUS_TO_ROLE = {
  PENDING_CREW_SIGNATURE:   "CREW",
  PENDING_UPM_SIGNATURE:    "UPM",
  PENDING_FC_SIGNATURE:     "FC",
  PENDING_STUDIO_SIGNATURE: "STUDIO",
};

// ── Maps signing role → the thunk that advances the offer to the next stage ──
// Called from handleAllSigned when ContractInstancesPanel reports all docs done.
const ADVANCE_THUNK_FOR_ROLE = {
  CREW:   (offerId, dispatch) => dispatch(moveToPendingUpmSignatureThunk(offerId)),
  UPM:    (offerId, dispatch) => dispatch(moveToPendingFcSignatureThunk(offerId)),
  FC:     (offerId, dispatch) => dispatch(moveToPendingStudioSignatureThunk(offerId)),
  STUDIO: (offerId, dispatch) => dispatch(completeOfferThunk(offerId)),
};

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

  const profileSignature = useSelector(selectProfileSignatureUrl);

  const prevSignRef    = useRef(null);
  const prevVersionRef = useRef(null);
  // Guard: prevent double-firing onAllSigned if component re-renders mid-flight
  const advancingRef   = useRef(false);

  const proj = projectName || "demo-project";

  // ── Fetch offer on mount ───────────────────────────────────────────────────
  useEffect(() => {
    if (id) dispatch(getOfferThunk(id));
  }, [id, dispatch]);

  // ── Fetch user's active identity signature on mount ───────────────────────
  useEffect(() => {
    dispatch(fetchCurrentSignatureThunk());
  }, [dispatch]);

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

  // ── Fetch contract instances on offer._id, status AND version change ──────
  useEffect(() => {
    if (!offer?._id) return;
    if (!INSTANCE_FETCH_STATUSES.includes(offer.status)) return;
    dispatch(clearInstances());
    dispatch(getContractInstancesThunk(offer._id));
  }, [offer?._id, offer?.status, offer?.version, dispatch]);

  // ── Auto-advance viewRole when offer status moves to a new signing stage ──
  useEffect(() => {
    if (!offer?.status) return;
    const targetRole = STATUS_TO_ROLE[offer.status];
    if (targetRole && viewRole !== targetRole) {
      dispatch(setViewRole(targetRole));
    }
  }, [offer?.status, dispatch]); // intentionally omit viewRole to avoid loop

  // ── Only refetch when version strictly increases ───────────────────────────
  useEffect(() => {
    if (!offer?.version || !id) return;
    if (
      prevVersionRef.current !== null &&
      offer.version > prevVersionRef.current
    ) {
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
  const allowances   = useMemo(() => offerToAllowances(offer), [offer]);

  const calculatedRates = useMemo(() => {
    const stored = offer?.calculatedRates;
    const hasStoredSalary   = stored?.salary?.length > 0;
    const hasStoredOvertime = stored?.overtime?.length > 0;

    if (hasStoredSalary || hasStoredOvertime) {
      return {
        salary:   stored.salary   || [],
        overtime: stored.overtime || [],
      };
    }

    const fee = parseFloat(offer?.feePerDay) || 0;
    return calculateRates(fee, defaultEngineSettings);
  }, [offer?.calculatedRates, offer?.version, offer?.feePerDay]);

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

      const fresh = await dispatch(getOfferThunk(oid));
      const cid   = fresh.payload?.contractId ?? contractId;

      if (cid) {
        dispatch(getSigningStatusThunk(cid));
        dispatch(clearContractPreview());
        dispatch(getContractPreviewThunk(cid));
      }

      if (["accept", "accountsCheck", "pendingCrewSignature", "productionCheck"].includes(action)) {
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

  // ── Per-document instance sign handler ────────────────────────────────────
  const handleSignInstance = useCallback(async (instanceId, meta = {}) => {
    const signatureImage = meta.signatureUrl ?? profileSignature ?? undefined;
    try {
      const result = await dispatch(
        signContractInstanceThunk({ instanceId, signatureImage })
      );

      if (result.error) {
        const msg =
          result.payload?.message ||
          result.payload?.error ||
          "Failed to sign document";
        toast.error(msg);
        throw new Error(msg);
      }

      // Delay state refresh so the user sees the signed document before
      // the layout potentially advances to the next signatory stage.
      setTimeout(async () => {
        if (offer?._id) {
          await dispatch(getOfferThunk(offer._id));
          dispatch(getContractInstancesThunk(offer._id));
        }
        if (contractId) {
          dispatch(getSigningStatusThunk(contractId));
          dispatch(clearContractPreview());
          dispatch(getContractPreviewThunk(contractId));
        }
      }, 3000);

    } catch (err) {
      throw err;
    }
  }, [dispatch, offer?._id, contractId, profileSignature]);

  // ── ALL DOCS SIGNED → advance offer to next stage ─────────────────────────
  //
  // Called by ContractInstancesPanel via onAllSigned(role) once every document
  // in the bundle has been signed by the current role.
  //
  // Flow:
  //   CREW   signs all → moveToPendingUpmSignatureThunk  → viewRole auto-sets to UPM
  //   UPM    signs all → moveToPendingFcSignatureThunk   → viewRole auto-sets to FC
  //   FC     signs all → moveToPendingStudioSignatureThunk → viewRole auto-sets to STUDIO
  //   STUDIO signs all → completeOfferThunk              → offer is COMPLETED
  //
  // The STATUS_TO_ROLE useEffect above handles the viewRole switch automatically
  // once the offer refetch returns the new status.
  const handleAllSigned = useCallback(async (role) => {
    const oid = offer?._id;
    if (!oid) return;

    // Prevent double-fire if ContractInstancesPanel emits twice
    if (advancingRef.current) return;
    advancingRef.current = true;

    const advanceFn = ADVANCE_THUNK_FOR_ROLE[role?.toUpperCase()];
    if (!advanceFn) {
      console.warn(`[ViewOffer] handleAllSigned: no advance thunk for role "${role}"`);
      advancingRef.current = false;
      return;
    }

    try {
      toast.loading(`Advancing to next signing stage…`, { id: "advance" });
      const result = await advanceFn(oid, dispatch);
      toast.dismiss("advance");

      if (result.error) {
        toast.error(
          result.payload?.message || "Could not advance to next stage — please refresh"
        );
        advancingRef.current = false;
        return;
      }

      // Re-fetch the offer so Redux gets the new status; STATUS_TO_ROLE
      // useEffect will automatically switch viewRole to the next signatory.
      const fresh = await dispatch(getOfferThunk(oid));
      const newStatus = fresh.payload?.status;
      toast.success(
        newStatus === "COMPLETED"
          ? "Contract fully executed! 🎉"
          : `Moved to ${newStatus?.replace(/_/g, " ")} stage`
      );

      const cid = fresh.payload?.contractId ?? contractId;
      if (cid) {
        dispatch(getSigningStatusThunk(cid));
        dispatch(clearContractPreview());
        dispatch(getContractPreviewThunk(cid));
      }

      // Reload instances for the new stage
      if (fresh.payload?._id) {
        dispatch(clearInstances());
        dispatch(getContractInstancesThunk(fresh.payload._id));
      }

    } catch (err) {
      toast.dismiss("advance");
      toast.error("Failed to advance signing stage");
      console.error("[ViewOffer] handleAllSigned error:", err);
    } finally {
      // Reset guard after a delay so rapid re-renders don't re-fire immediately
      setTimeout(() => { advancingRef.current = false; }, 5000);
    }
  }, [dispatch, offer?._id, contractId]);

  const handleDownloadPdf = async () => {
    if (!contractId) return;
    if (contractPdfUrl) { window.open(contractPdfUrl, "_blank"); return; }
    const r = await dispatch(getContractPdfUrlThunk(contractId));
    if (!r.error && r.payload?.url) window.open(r.payload.url, "_blank");
    else toast.error("Could not get PDF link");
  };

  const handleRefresh = async () => {
    const r   = await dispatch(getOfferThunk(id));
    const freshOffer = r.payload;
    const cid = freshOffer?.contractId ?? contractId;
    if (cid) {
      dispatch(getSigningStatusThunk(cid));
      dispatch(clearContractPreview());
      dispatch(getContractPreviewThunk(cid));
    }
    if (freshOffer?._id) {
      dispatch(clearInstances());
      dispatch(getContractInstancesThunk(freshOffer._id));
    }
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

  const sharedProps = {
    offer,
    contractData,
    allowances,
    calculatedRates,
    isSubmitting,
    onAction: handleAction,
    dispatch,
    profileSignature,
    onSignInstance: handleSignInstance,
    // NEW: every layout that wraps ContractInstancesPanel must forward this
    onAllSigned: handleAllSigned,
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
          />
        )}

      </div>
      {/* SignDialog intentionally removed — all roles sign inline via ContractInstancesPanel */}
    </div>
  );
}