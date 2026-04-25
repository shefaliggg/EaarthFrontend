import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate, useParams }   from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast }                    from "sonner";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";

import {
  getProjectOffersThunk,
  getOfferThunk,
  crewAcceptThunk,
  crewRequestChangesThunk,
  moveToPendingUpmSignatureThunk,
  moveToPendingFcSignatureThunk,
  moveToPendingStudioSignatureThunk,
  completeOfferThunk,
  selectProjectOffers,
  selectListLoading,
} from "../store/offer.slice";

import {
  clearInstances,
  getContractInstancesThunk,
  signContractInstanceThunk,
} from "../store/contractInstances.slice";

import { fetchCurrentSignatureThunk } from "../../signature/store/signature.thunk";
import { selectProfileSignatureUrl }  from "../../signature/store/signature.slice";

// NOTE: We intentionally do NOT import setViewRole here.
// In MyOffer, the viewRole stays as CREW regardless of signing stage.
// Status messages/banners update instead of switching the signing interface role.

import OfferStatusProgress from "../components/viewoffer/OfferStatusProgress";

import { OfferStageFilter }  from "../components/myoffer/OfferStageFilter";
import { OfferList }         from "../components/myoffer/OfferList";
import { OfferDetailsPanel } from "../components/myoffer/OfferDetailPanel";
import {
  OFFER_STAGES,
  getStageForOffer,
  countByStage,
  filterByStage,
} from "../components/myoffer/offerStageConfig";

// ── Constants ─────────────────────────────────────────────────────────────────

const FALLBACK_PROJECT_ID = "697c899668977a7ca2b27462";
const isObjectId = (str) => /^[a-f\d]{24}$/i.test(String(str ?? ""));

// ── Redux selectors ───────────────────────────────────────────────────────────
const selectIsSubmitting = (s) => s?.offers?.isSubmitting ?? false;
const selectListError    = (s) => s?.offers?.error        ?? null;

// ── Statuses where crew can actually accept ───────────────────────────────────
const CREW_ACCEPTABLE_STATUSES = ["SENT_TO_CREW"];

// ── Signing stage advance map ─────────────────────────────────────────────────
const ADVANCE_THUNK = {
  CREW:   (oid, dispatch) => dispatch(moveToPendingUpmSignatureThunk(oid)),
  UPM:    (oid, dispatch) => dispatch(moveToPendingFcSignatureThunk(oid)),
  FC:     (oid, dispatch) => dispatch(moveToPendingStudioSignatureThunk(oid)),
  STUDIO: (oid, dispatch) => dispatch(completeOfferThunk(oid)),
};

// ════════════════════════════════════════════════════════════════════════════════
// MyOffer
// ════════════════════════════════════════════════════════════════════════════════

export default function MyOffer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params   = useParams();

  const selectedProject = useSelector(
    (s) => s.projects?.selectedProject ?? s.project?.current ?? null
  );

  const resolvedProjectId = useMemo(() => {
    if (isObjectId(params.projectId))     return params.projectId;
    if (isObjectId(params.id))            return params.id;
    if (isObjectId(selectedProject?._id)) return String(selectedProject._id);
    console.warn("[MyOffer] Using fallback projectId");
    return FALLBACK_PROJECT_ID;
  }, [params.projectId, params.id, selectedProject]);

  const projectSlug = params.projectName ?? params.projectId ?? "demo-project";

  // ── Redux state ─────────────────────────────────────────────────────────────
  const allOffers        = useSelector(selectProjectOffers);
  const isLoading        = useSelector(selectListLoading);
  const listError        = useSelector(selectListError);
  const isSubmitting     = useSelector(selectIsSubmitting);
  const profileSignature = useSelector(selectProfileSignatureUrl);

  // ── Local state ─────────────────────────────────────────────────────────────
  const [activeStage,   setActiveStage]   = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const advancingRef = useRef(false);

  // ── Data fetching ───────────────────────────────────────────────────────────
  const fetchOffers = useCallback(() => {
    dispatch(getProjectOffersThunk({ projectId: resolvedProjectId }));
  }, [dispatch, resolvedProjectId]);

  useEffect(() => {
    fetchOffers();
    dispatch(fetchCurrentSignatureThunk());
  }, [dispatch, fetchOffers]);

  // Keep selectedOffer in sync with Redux store updates
  useEffect(() => {
    if (!selectedOffer) return;
    const fresh = allOffers.find((o) => o._id === selectedOffer._id);
    if (fresh) setSelectedOffer(fresh);
  }, [allOffers]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear selection when stage filter changes and offer no longer fits
  useEffect(() => {
    if (!selectedOffer || !activeStage) return;
    if (getStageForOffer(selectedOffer) !== activeStage) setSelectedOffer(null);
  }, [activeStage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived data ────────────────────────────────────────────────────────────
  const stageCounts   = useMemo(() => countByStage(allOffers),               [allOffers]);
  const displayOffers = useMemo(() => filterByStage(allOffers, activeStage), [allOffers, activeStage]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleStageChange = (key) => {
    setActiveStage((prev) => (prev === key ? null : key));
    setSelectedOffer(null);
  };

  const handleView = (offerId) =>
    navigate(`/projects/${projectSlug}/offers/${offerId}/view`);

  const handleAccept = useCallback(async (offerId) => {
    const currentOffer = allOffers.find((o) => o._id === offerId);
    if (!currentOffer || !CREW_ACCEPTABLE_STATUSES.includes(currentOffer.status)) {
      toast.error("This offer has already been accepted and is under review.");
      return;
    }

    toast.loading("Accepting offer…", { id: "accept" });
    const result = await dispatch(crewAcceptThunk(offerId));
    toast.dismiss("accept");
    if (result.error) { toast.error(result.payload?.message || "Failed to accept"); return; }
    toast.success("Offer accepted! Contracts will be ready shortly.");
    fetchOffers();
    const fresh = await dispatch(getOfferThunk(offerId));
    if (fresh.payload) setSelectedOffer(fresh.payload);
  }, [dispatch, fetchOffers, allOffers]);

  const handleRequestChanges = useCallback(async (offerId, reason) => {
    toast.loading("Sending request…", { id: "req" });
    const result = await dispatch(crewRequestChangesThunk({ offerId, reason }));
    toast.dismiss("req");
    if (result.error) { toast.error(result.payload?.message || "Failed"); return; }
    toast.success("Change request sent!");
    fetchOffers();
  }, [dispatch, fetchOffers]);

  const handleSignInstance = useCallback(async (instanceId, meta = {}) => {
    const signatureImage = meta.signatureUrl ?? profileSignature ?? undefined;
    const result = await dispatch(signContractInstanceThunk({ instanceId, signatureImage }));
    if (result.error) {
      const msg = result.payload?.message || "Failed to sign";
      toast.error(msg);
      throw new Error(msg);
    }
    // Refresh offer + instances so signed count updates
    setTimeout(async () => {
      if (selectedOffer?._id) {
        const fresh = await dispatch(getOfferThunk(selectedOffer._id));
        if (fresh.payload) setSelectedOffer(fresh.payload);
        dispatch(getContractInstancesThunk(selectedOffer._id));
      }
    }, 2500);
  }, [dispatch, selectedOffer?._id, profileSignature]);

  // ── handleAllSigned ──────────────────────────────────────────────────────────
  // Called when crew signs all documents. Advances offer to PENDING_UPM_SIGNATURE.
  // Does NOT switch viewRole — MyOffer stays in CREW view and shows a status
  // banner instead (handled in ContractSignPanel).
  const handleAllSigned = useCallback(async (role) => {
    const oid = selectedOffer?._id;
    if (!oid || advancingRef.current) return;
    advancingRef.current = true;

    const advanceFn = ADVANCE_THUNK[role?.toUpperCase()];
    if (!advanceFn) {
      console.warn(`[MyOffer] handleAllSigned: no advance thunk for role "${role}"`);
      advancingRef.current = false;
      return;
    }

    try {
      toast.loading("Submitting signatures…", { id: "adv" });
      const result = await advanceFn(oid, dispatch);
      toast.dismiss("adv");

      if (result.error) {
        toast.error(result.payload?.message || "Could not advance stage");
        advancingRef.current = false;
        return;
      }

      const fresh    = await dispatch(getOfferThunk(oid));
      const newOffer = fresh.payload;
      const newStatus = newOffer?.status;

      // Show success toast — but do NOT switch viewRole
      // The ContractSignPanel will show a "sent to UPM" banner based on status
      toast.success(
        newStatus === "COMPLETED"
          ? "🎉 Contract fully executed!"
          : `All documents signed — sent for ${
              newStatus?.replace(/PENDING_|_SIGNATURE/g, "").replace(/_/g, " ")
            } signature`
      );

      if (newOffer) setSelectedOffer(newOffer);

      dispatch(clearInstances());
      dispatch(getContractInstancesThunk(oid));
      fetchOffers();

    } catch {
      toast.dismiss("adv");
      toast.error("Something went wrong — please refresh");
    } finally {
      setTimeout(() => { advancingRef.current = false; }, 5000);
    }
  }, [dispatch, selectedOffer?._id, fetchOffers]);

  // ── Loading / error states ──────────────────────────────────────────────────

  if (isLoading && !allOffers.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-7 h-7 animate-spin text-[#534AB7] mx-auto" />
          <p className="text-sm text-neutral-500">Loading your offers…</p>
        </div>
      </div>
    );
  }

  if (listError && !allOffers.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertTriangle className="w-7 h-7 text-red-400 mx-auto" />
          <p className="text-sm font-medium text-red-600">
            {listError.message || "Failed to load offers"}
          </p>
          <Button size="sm" variant="outline" onClick={fetchOffers} className="gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  // ── Timeline props from selected offer ──────────────────────────────────────
  const tl = selectedOffer?.timeline || {};

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">My Offers</h1>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchOffers}
          className="h-8 w-8 p-0"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Stage filter cards */}
      <OfferStageFilter
        stages={OFFER_STAGES}
        counts={stageCounts}
        activeStage={activeStage}
        onChange={handleStageChange}
      />

      {/* Status progress bar (only when an offer is selected) */}
      {selectedOffer && (
        <OfferStatusProgress
          status={selectedOffer.status}
          sentToCrewAt={tl.sentToCrewAt}
          updatedAt={selectedOffer.updatedAt}
          crewAcceptedAt={tl.crewAcceptedAt}
          productionCheckCompletedAt={tl.productionCheckCompletedAt}
          accountsCheckCompletedAt={tl.accountsCheckCompletedAt}
          crewSignedAt={tl.crewSignedAt}
          upmSignedAt={tl.upmSignedAt}
          fcSignedAt={tl.fcSignedAt}
          studioSignedAt={tl.studioSignedAt}
        />
      )}

      {/* Split view */}
      <div className="flex gap-3 items-start min-h-[560px]">
        {/* Left panel — offer list */}
        <div className="w-[300px] shrink-0 bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-gray-50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              {activeStage
                ? (OFFER_STAGES.find((s) => s.key === activeStage)?.label ?? "Offers")
                : "All Offers"}
            </span>
            <span className="text-[11px] font-medium text-neutral-500 bg-white px-2 py-0.5 rounded-full">
              {displayOffers.length} total
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <OfferList
              offers={displayOffers}
              selectedOffer={selectedOffer}
              onSelect={setSelectedOffer}
              activeStage={activeStage}
            />
          </div>
        </div>

        {/* Right panel — adaptive detail */}
        <OfferDetailsPanel
          offer={selectedOffer}
          profileSignature={profileSignature}
          isSubmitting={isSubmitting}
          onView={handleView}
          onAccept={handleAccept}
          onRequestChanges={handleRequestChanges}
          onSignInstance={handleSignInstance}
          onAllSigned={handleAllSigned}
        />
      </div>
    </div>
  );
}