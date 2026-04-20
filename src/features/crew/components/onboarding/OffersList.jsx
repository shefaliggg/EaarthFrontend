/**
 * OffersList.jsx
 *
 * CHANGES:
 *   - Loading state shows a skeleton card box (rounded-xl, same shape as real list)
 *     with animated pulse rows — not a plain spinner.
 *   - Delete is now available for ALL offer statuses (DRAFT, SENT_TO_CREW,
 *     PRODUCTION_CHECK, ACCOUNTS_CHECK, PENDING_*_SIGNATURE, COMPLETED, etc.)
 *   - Delete confirmation uses OfferActionDialog (type="deleteOffer").
 *   - Clone → cloneOfferThunk → navigate to new offer edit page (unchanged).
 *   - statFilter / stageFilter filtering unchanged.
 *   - NEW: supports statFilter === "DELETED" to show deleted offers.
 */

import { useState, useMemo } from "react";
import { useDispatch }       from "react-redux";
import { useParams }         from "react-router-dom";
import { toast }             from "sonner";

import { OffersListRow }  from "./OffersListRow";
import OfferActionDialog  from "./OfferActionDialog";
import {
  cloneOfferThunk,
  deleteOfferThunk,
} from "../../store/offer.slice";

// ── Status → summary filter bucket ───────────────────────────────────────────

const PENDING_STATUSES = new Set([
  "DRAFT", "SENT_TO_CREW", "NEEDS_REVISION", "PRODUCTION_CHECK",
  "ACCOUNTS_CHECK", "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE",
  "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE",
]);

const DELETED_STATUSES = new Set(["DELETED"]);

function matchesSummaryFilter(offer, statFilter) {
  if (!statFilter || statFilter === "ALL") return true;
  if (statFilter === "PENDING")  return PENDING_STATUSES.has(offer.status);
  if (statFilter === "ACCEPTED") return offer.status === "CREW_ACCEPTED";
  if (statFilter === "REJECTED") return offer.status === "CANCELLED";
  if (statFilter === "ENDED")    return offer.status === "COMPLETED" ||
                                        offer.status === "TERMINATED" ||
                                        offer.status === "VOIDED"     ||
                                        offer.status === "REVISED";
  if (statFilter === "DELETED")  return DELETED_STATUSES.has(offer.status);
  return true;
}

// ── Skeleton — one pulse row matching the real row's layout ──────────────────

function SkeletonRow({ isLast }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${!isLast ? "border-b border-neutral-100" : ""}`}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse shrink-0" />

      {/* Name + meta */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-36 rounded-md bg-neutral-200 animate-pulse" />
          <div className="h-4 w-16 rounded-full bg-neutral-100 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-20 rounded bg-neutral-100 animate-pulse" />
          <div className="h-2.5 w-1.5 rounded bg-neutral-100 animate-pulse" />
          <div className="h-2.5 w-24 rounded bg-neutral-100 animate-pulse" />
          <div className="h-2.5 w-1.5 rounded bg-neutral-100 animate-pulse" />
          <div className="h-2.5 w-14 rounded bg-neutral-100 animate-pulse" />
        </div>
      </div>

      {/* Action button ghosts */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="h-7 w-14 rounded-lg bg-neutral-100 animate-pulse" />
        <div className="h-7 w-14 rounded-lg bg-neutral-100 animate-pulse" />
        <div className="h-7 w-7 rounded-lg bg-neutral-100 animate-pulse" />
      </div>

      {/* Next action — desktop only, now on the right */}
      <div className="text-right shrink-0 hidden md:flex md:flex-col md:items-end gap-1 min-w-[120px]">
        <div className="h-2 w-16 rounded bg-neutral-100 animate-pulse" />
        <div className="h-3 w-28 rounded bg-neutral-200 animate-pulse" />
        <div className="h-2 w-10 rounded bg-neutral-100 animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonList({ count = 5 }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} isLast={i === count - 1} />
      ))}
    </div>
  );
}

// ── Empty state — keep inside the card box ────────────────────────────────────

function EmptyState({ hasFilter, onClearFilter }) {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col items-center justify-center py-20 text-center"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
        style={{ background: "var(--lavender-50)", border: "1px solid var(--lavender-100)" }}
      >
        <svg className="w-5 h-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-neutral-500">
        {hasFilter ? "No offers match this filter" : "No offers yet"}
      </p>
      <p className="text-[12px] text-neutral-400 mt-1">
        {hasFilter
          ? "Try adjusting or clearing your filter."
          : "Create an offer to get started."}
      </p>
      {hasFilter && (
        <button
          onClick={onClearFilter}
          className="mt-3 text-[12px] text-purple-600 underline underline-offset-2 hover:text-purple-800 transition-colors"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function OffersList({
  offers = [],
  isLoading,
  stageFilter,
  statFilter,
  onNavigate,
  onClearFilter,
  projectName: projectNameProp,
}) {
  const dispatch = useDispatch();
  const params   = useParams();
  const proj     = projectNameProp || params.projectName || "demo-project";

  const [cloningId,  setCloningId ] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [dialog,     setDialog    ] = useState(null);   // { type, offer }
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter offers — when DELETED filter is active, show only deleted offers
  const filtered = useMemo(() => {
    return offers.filter((o) => {
      if (stageFilter && o.status !== stageFilter) return false;
      if (!matchesSummaryFilter(o, statFilter))    return false;
      return true;
    });
  }, [offers, stageFilter, statFilter]);

  const hasFilter = !!(stageFilter || (statFilter && statFilter !== "ALL"));

  // ── Loading — show the skeleton card while fetching ────────────────────────
  if (isLoading && offers.length === 0) {
    return <SkeletonList count={5} />;
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (!filtered.length) {
    return <EmptyState hasFilter={hasFilter} onClearFilter={onClearFilter} />;
  }

  // ── Clone ──────────────────────────────────────────────────────────────────
  const handleClone = async (offer) => {
    const offerId = offer._id || offer.id;
    if (!offerId || cloningId) return;

    setCloningId(offerId);
    toast.loading("Cloning offer…", { id: "clone" });

    try {
      const result = await dispatch(cloneOfferThunk(offerId));
      toast.dismiss("clone");

      if (!result.error && result.payload?._id) {
        toast.success("Offer cloned — fill in the new crew member's details");
        onNavigate(`/projects/${proj}/offers/${result.payload._id}/edit`);
      } else {
        toast.error(
          result.payload?.message ||
          result.payload?.errors?.map((e) => e.message).join(" · ") ||
          "Failed to clone offer"
        );
      }
    } catch (err) {
      toast.dismiss("clone");
      toast.error(err.message || "Failed to clone offer");
    } finally {
      setCloningId(null);
    }
  };

  // ── Delete request — opens confirmation dialog ─────────────────────────────
  // Available for ALL statuses — no restriction.
  const handleDeleteRequest = (offer) => {
    setDialog({ type: "deleteOffer", offer });
  };

  // ── Delete confirmed ───────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!dialog?.offer) return;
    const offer   = dialog.offer;
    const offerId = offer._id || offer.id;

    setIsDeleting(true);
    setDeletingId(offerId);
    toast.loading("Deleting offer…", { id: "delete" });

    try {
      const result = await dispatch(deleteOfferThunk(offerId));
      toast.dismiss("delete");

      if (!result.error) {
        toast.success("Offer deleted");
        setDialog(null);
      } else {
        toast.error(
          result.payload?.message ||
          result.payload?.errors?.map((e) => e.message).join(" · ") ||
          "Failed to delete offer"
        );
      }
    } catch (err) {
      toast.dismiss("delete");
      toast.error(err.message || "Failed to delete offer");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const closeDialog = () => {
    if (!isDeleting) setDialog(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        {filtered.map((offer, idx) => {
          const offerId = offer._id || offer.id;
          return (
            <OffersListRow
              key={offerId}
              offer={offer}
              onNavigate={onNavigate}
              onClone={handleClone}
              onDeleteRequest={handleDeleteRequest}
              isLast={idx === filtered.length - 1}
              projectName={proj}
              isDeleting={deletingId === offerId}
            />
          );
        })}
      </div>

      {/* Shared delete confirmation dialog */}
      <OfferActionDialog
        type={dialog?.type}
        offer={dialog?.offer}
        open={!!dialog}
        onClose={closeDialog}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </>
  );
}