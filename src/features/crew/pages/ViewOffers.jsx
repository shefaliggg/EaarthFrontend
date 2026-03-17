import { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
  };
}

function offerToAllowances(offer) {
  if (!offer?.allowances?.length) return defaultAllowances;
  const result = { ...defaultAllowances };
  offer.allowances.forEach((a) => {
    if (a.key && result[a.key] !== undefined) result[a.key] = { ...result[a.key], ...a };
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
  const prevSignRef = useRef(null);
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

  // ── Fetch contract instances when offer reaches review/signing stages ──────
  useEffect(() => {
    if (!offer?._id) return;
    if (!INSTANCE_FETCH_STATUSES.includes(offer.status)) return;

    dispatch(clearInstances());
    dispatch(getContractInstancesThunk(offer._id));
  }, [offer?._id, offer?.status, dispatch]);

  // ── Refresh preview after each signature ──────────────────────────────────
  useEffect(() => {
    const curr = signingStatus?.currentStatus;
    if (!contractId || !curr) return;
    if (prevSignRef.current && prevSignRef.current !== curr) {
      dispatch(clearContractPreview());
      dispatch(getContractPreviewThunk(contractId));
      // Also refresh instances so signature images appear
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
  const allowances   = useMemo(() => offerToAllowances(offer),   [offer]);
  const calculatedRates = useMemo(
    () => calculateRates(parseFloat(contractData.feePerDay) || 0, defaultEngineSettings),
    [contractData.feePerDay]
  );

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

      // Refresh offer
      const fresh = await dispatch(getOfferThunk(oid));
      const cid   = fresh.payload?.contractId ?? contractId;

      if (cid) {
        dispatch(getSigningStatusThunk(cid));
        dispatch(clearContractPreview());
        dispatch(getContractPreviewThunk(cid));
      }

      // After crew accepts → fetch instances immediately
      // (backend creates them synchronously before returning)
      if (action === "accept") {
        dispatch(clearInstances());
        dispatch(getContractInstancesThunk(oid));
      }

      // After accounts approves → refresh instances (status changes to PENDING_CREW_SIGNATURE)
      if (action === "accountsCheck" || action === "pendingCrewSignature") {
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

      await dispatch(getOfferThunk(offer._id));
      await dispatch(getSigningStatusThunk(contractId));

      dispatch(clearContractPreview());
      dispatch(getContractPreviewThunk(contractId));

      // Refresh instances so signature images appear in document viewer
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
    const r   = await dispatch(getOfferThunk(id));
    const cid = r.payload?.contractId ?? contractId;
    if (cid) {
      dispatch(getSigningStatusThunk(cid));
      dispatch(clearContractPreview());
      dispatch(getContractPreviewThunk(cid));
    }
    // Always refresh instances on manual refresh
    dispatch(clearInstances());
    dispatch(getContractInstancesThunk(id));
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
    offer, contractData, allowances, calculatedRates,
    isSubmitting, onAction: handleAction, dispatch,
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
          <LayoutProductionReview {...sharedProps} />
        )}

        {isAcctReview && (
          <LayoutAccountsReview {...sharedProps} />
        )}

        {isProdAdmin && !isProdReview && (
          <LayoutProductionAdmin
            {...sharedProps}
            signingStatus={signingStatus}
            previewHtml={previewHtml}
            isLoadingPrev={isLoadingPrev}
            onSign={handleSign}
          />
        )}

        {isCrew && (
          <LayoutCrew
            {...sharedProps}
            signingStatus={signingStatus}
            previewHtml={previewHtml}
            isLoadingPrev={isLoadingPrev}
            onSign={handleSign}
          />
        )}

        {isAcctAdmin && !isAcctReview && (
          <LayoutAccountsReadOnly
            {...sharedProps}
            previewHtml={previewHtml}
            isLoadingPrev={isLoadingPrev}
          />
        )}

        {isSignatory && (
          <LayoutSignatory
            {...sharedProps}
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