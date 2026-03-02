/**
 * CrewOnboarding.jsx
 *
 * FIXED: The URL param :projectName is a slug like "avatar-1" — NOT a valid
 * MongoDB ObjectId. Sending it to the API causes the 500 error.
 *
 * Resolution priority:
 *   1. params.projectId  (if your router uses :projectId)
 *   2. selectedProject._id from Redux (your project store)
 *   3. FALLBACK_PROJECT_ID (hardcoded known good ID for dev/demo)
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  BarChart3, Clock, CheckCircle2, XCircle, Users,
  FileText, Eye, AlertCircle, Calculator,
  PenLine, Stamp, ShieldCheck, Building2,
} from "lucide-react";

import { PageHeader }        from "../../../shared/components/PageHeader";
import PrimaryStats          from "../../../shared/components/wrappers/PrimaryStats";
import { StageCard }         from "../components/StatCard";
import { OffersList }        from "../components/onboarding/OffersList";
import CreateOfferDialog     from "../components/CreateOfferDialog";

import {
  getProjectOffersThunk,
  selectProjectOffers,
  selectListLoading,
} from "../store/offer.slice";

// ─── Hardcoded fallback (your real project _id) ───────────────────────────────
const FALLBACK_PROJECT_ID = "697c899668977a7ca2b27462";

// ─── Is this string a valid MongoDB ObjectId? ─────────────────────────────────
const isObjectId = (str) => /^[a-f\d]{24}$/i.test(String(str ?? ""));

// ─── Static config ────────────────────────────────────────────────────────────

const SUMMARY_STATS_CONFIG = [
  { value: "ALL",      label: "All Contracts", icon: BarChart3,    iconColor: "text-purple-600",  iconBg: "bg-purple-50",  color: "text-purple-700"  },
  { value: "PENDING",  label: "Pending",       icon: Clock,        iconColor: "text-amber-600",   iconBg: "bg-amber-50",   color: "text-amber-700"   },
  { value: "ACCEPTED", label: "Accepted",      icon: CheckCircle2, iconColor: "text-emerald-600", iconBg: "bg-emerald-50", color: "text-emerald-700" },
  { value: "REJECTED", label: "Rejected",      icon: XCircle,      iconColor: "text-red-600",     iconBg: "bg-red-50",     color: "text-red-700"     },
  { value: "ENDED",    label: "Ended",         icon: Users,        iconColor: "text-neutral-500", iconBg: "bg-neutral-50", color: "text-neutral-700" },
];

const STAGE_KEYS = [
  { key: "DRAFT",                    label: "Drafts",      icon: FileText,    color: "text-neutral-600", bg: "bg-neutral-50", border: "border-neutral-200" },
  { key: "SENT_TO_CREW",             label: "Crew Review", icon: Eye,         color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200"   },
  { key: "PRODUCTION_CHECK",         label: "Production",  icon: AlertCircle, color: "text-purple-600",  bg: "bg-purple-50",  border: "border-purple-200"  },
  { key: "ACCOUNTS_CHECK",           label: "Accounts",    icon: Calculator,  color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200"    },
  { key: "PENDING_CREW_SIGNATURE",   label: "Crew Sign",   icon: PenLine,     color: "text-teal-600",    bg: "bg-teal-50",    border: "border-teal-200"    },
  { key: "PENDING_UPM_SIGNATURE",    label: "UPM Sign",    icon: Stamp,       color: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-indigo-200"  },
  { key: "PENDING_FC_SIGNATURE",     label: "FC Sign",     icon: ShieldCheck, color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-200"  },
  { key: "PENDING_STUDIO_SIGNATURE", label: "Studio Sign", icon: Building2,   color: "text-fuchsia-600", bg: "bg-fuchsia-50", border: "border-fuchsia-200" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeStageCounts(offers) {
  const counts = {};
  STAGE_KEYS.forEach(s => { counts[s.key] = 0; });
  offers.forEach(o => {
    if (counts[o.status] !== undefined) counts[o.status]++;
  });
  return counts;
}

function computeSummaryValues(offers) {
  const pendingStatuses = new Set([
    "DRAFT", "SENT_TO_CREW", "NEEDS_REVISION", "PRODUCTION_CHECK",
    "ACCOUNTS_CHECK", "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE",
  ]);
  const acceptedStatuses = new Set(["CREW_ACCEPTED", "COMPLETED"]);

  let pending = 0, accepted = 0, rejected = 0, ended = 0;
  offers.forEach(o => {
    if (pendingStatuses.has(o.status))       pending++;
    else if (acceptedStatuses.has(o.status)) accepted++;
    else if (o.status === "CANCELLED")       rejected++;
  });

  return { all: offers.length, pending, accepted, rejected, ended };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CrewOnboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params   = useParams();

  // ── Adjust this selector to match YOUR project store shape ──────────────────
  // Common patterns: state.projects.selectedProject  OR  state.project.current
  const selectedProject = useSelector(
    (s) => s.projects?.selectedProject ?? s.project?.current ?? null
  );

  // ── Resolve the real MongoDB _id ─────────────────────────────────────────────
  const resolvedProjectId = useMemo(() => {
    // 1. Router gives us a real ObjectId param directly
    if (isObjectId(params.projectId)) return params.projectId;
    if (isObjectId(params.id))        return params.id;

    // 2. Project already loaded in Redux store
    if (isObjectId(selectedProject?._id)) return String(selectedProject._id);

    // 3. Last resort — hardcoded fallback
    console.warn("[CrewOnboarding] Using fallback projectId — check your router params or project store");
    return FALLBACK_PROJECT_ID;
  }, [params.projectId, params.id, selectedProject]);

  // Keep the slug for navigation links (/projects/avatar-1/...)
  const projectSlug = params.projectName ?? params.projectId ?? "demo-project";

  const offers    = useSelector(selectProjectOffers);
  const isLoading = useSelector(selectListLoading);

  const [statFilter,  setStatFilter]  = useState("ALL");
  const [stageFilter, setStageFilter] = useState(null);
  const [showCreate,  setShowCreate]  = useState(false);

  // ── Fetch on mount and whenever resolvedProjectId changes ───────────────────
  useEffect(() => {
    dispatch(getProjectOffersThunk({ projectId: resolvedProjectId }));
  }, [dispatch, resolvedProjectId]);

  const stageCounts   = useMemo(() => computeStageCounts(offers),  [offers]);
  const summaryValues = useMemo(() => computeSummaryValues(offers), [offers]);

  const handleStatSelect  = (val) => { setStatFilter(val);  setStageFilter(null); };
  const handleStageSelect = (key) => { setStageFilter(prev => prev === key ? null : key); setStatFilter(null); };
  const handleClearFilter = ()    => { setStageFilter(null); setStatFilter("ALL"); };

  return (
    <div className="min-h-screen">
      <div className="py-5 space-y-5">

        {/* ── Header ── */}
        <PageHeader
          title="Crew Onboarding"
          icon="Users"
          secondaryActions={[
            { label: "Crew Search", icon: "Search", variant: "outline", clickAction: () => navigate(`/projects/${projectSlug}/crew-search`) },
            { label: "Settings",    icon: "Settings", variant: "outline", clickAction: () => navigate(`/projects/${projectSlug}/settings`) },
          ]}
          primaryAction={{
            label: "Create Offer", icon: "Plus", variant: "default",
            clickAction: () => setShowCreate(true),
          }}
        />

        {/* ── Summary stats ── */}
        <PrimaryStats
          gridColumns={5}
          gridGap={3}
          stats={SUMMARY_STATS_CONFIG.map(s => ({
            ...s,
            value:
              s.value === "ALL"      ? summaryValues.all      :
              s.value === "PENDING"  ? summaryValues.pending  :
              s.value === "ACCEPTED" ? summaryValues.accepted :
              s.value === "REJECTED" ? summaryValues.rejected :
              summaryValues.ended,
            isSelected: statFilter === s.value,
            onClick: () => handleStatSelect(s.value),
          }))}
        />

        {/* ── Stage pipeline grid ── */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {STAGE_KEYS.map(stage => (
            <StageCard
              key={stage.key}
              stage={stage}
              count={stageCounts[stage.key] || 0}
              isSelected={stageFilter === stage.key}
              onClick={() => handleStageSelect(stage.key)}
            />
          ))}
        </div>

        {/* ── Offers list ── */}
        <OffersList
          offers={offers}
          isLoading={isLoading}
          stageFilter={stageFilter}
          statFilter={statFilter}
          onNavigate={navigate}
          onClearFilter={handleClearFilter}
        />

      </div>

      <CreateOfferDialog open={showCreate} onOpenChange={setShowCreate} />
    </div>
  );
}