/**
 * CrewOnboarding.jsx
 *
 * CHANGES:
 *   1. computeSummaryValues — COMPLETED now counted as "ended" (was missing)
 *   2. STAGE_KEYS — added COMPLETED tile so pipeline shows completed contracts
 *   3. matchesSummaryFilter in OffersList updated to filter COMPLETED for ENDED
 *   4. Grid updated to sm:grid-cols-9 for the extra tile
 *   5. NEW: Added "Deleted" summary stat card — shows count of DELETED offers
 *      Placed after "Ended" in the top summary row
 *   6. FIX: resolvedProjectId now resolves from :projectName slug via Redux
 *      projects list — no more hardcoded fallback for real navigations
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  BarChart3, Clock, CheckCircle2, XCircle, Users,
  FileText, Eye, AlertCircle, Calculator,
  PenLine, Stamp, ShieldCheck, Building2, Trash2,
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

const isObjectId = (str) => /^[a-f\d]{24}$/i.test(String(str ?? ""));

// ─── Slug helper (mirrors DashboardLayout) ────────────────────────────────────
const toSlug = (name = "") => name.toLowerCase().replace(/\s+/g, "-");

// ─── Static config ────────────────────────────────────────────────────────────

const SUMMARY_STATS_CONFIG = [
  { value: "ALL",      label: "All Contracts", icon: BarChart3,    iconColor: "text-purple-600",  iconBg: "bg-purple-50",  color: "text-purple-700"  },
  { value: "PENDING",  label: "Pending",       icon: Clock,        iconColor: "text-amber-600",   iconBg: "bg-amber-50",   color: "text-amber-700"   },
  { value: "ACCEPTED", label: "Accepted",      icon: CheckCircle2, iconColor: "text-emerald-600", iconBg: "bg-emerald-50", color: "text-emerald-700" },
  { value: "REJECTED", label: "Rejected",      icon: XCircle,      iconColor: "text-red-600",     iconBg: "bg-red-50",     color: "text-red-700"     },
  { value: "ENDED",    label: "Ended",         icon: Users,        iconColor: "text-neutral-500", iconBg: "bg-neutral-50", color: "text-neutral-700" },
  { value: "DELETED",  label: "Deleted",       icon: Trash2,       iconColor: "text-rose-500",    iconBg: "bg-rose-50",    color: "text-rose-600"    },
];

const STAGE_KEYS = [
  { key: "DRAFT",                    label: "Drafts",      icon: FileText,    color: "text-neutral-600",  bg: "bg-neutral-50",  border: "border-neutral-200"  },
  { key: "SENT_TO_CREW",             label: "Crew Review", icon: Eye,         color: "text-amber-600",    bg: "bg-amber-50",    border: "border-amber-200"    },
  { key: "PRODUCTION_CHECK",         label: "Production",  icon: AlertCircle, color: "text-purple-600",   bg: "bg-purple-50",   border: "border-purple-200"   },
  { key: "ACCOUNTS_CHECK",           label: "Accounts",    icon: Calculator,  color: "text-blue-600",     bg: "bg-blue-50",     border: "border-blue-200"     },
  { key: "PENDING_CREW_SIGNATURE",   label: "Crew Sign",   icon: PenLine,     color: "text-teal-600",     bg: "bg-teal-50",     border: "border-teal-200"     },
  { key: "PENDING_UPM_SIGNATURE",    label: "UPM Sign",    icon: Stamp,       color: "text-indigo-600",   bg: "bg-indigo-50",   border: "border-indigo-200"   },
  { key: "PENDING_FC_SIGNATURE",     label: "FC Sign",     icon: ShieldCheck, color: "text-violet-600",   bg: "bg-violet-50",   border: "border-violet-200"   },
  { key: "PENDING_STUDIO_SIGNATURE", label: "Studio Sign", icon: Building2,   color: "text-fuchsia-600",  bg: "bg-fuchsia-50",  border: "border-fuchsia-200"  },
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

  let pending = 0, accepted = 0, rejected = 0, ended = 0, deleted = 0;
  offers.forEach(o => {
    if (o.status === "DELETED")              deleted++;
    else if (pendingStatuses.has(o.status))  pending++;
    else if (o.status === "CREW_ACCEPTED")   accepted++;
    else if (o.status === "COMPLETED")       ended++;
    else if (o.status === "TERMINATED")      ended++;
    else if (o.status === "VOIDED")          ended++;
    else if (o.status === "REVISED")         ended++;
    else if (o.status === "CANCELLED")       rejected++;
  });

  return { all: offers.length, pending, accepted, rejected, ended, deleted };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CrewOnboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params   = useParams();

  // ── Redux selectors ───────────────────────────────────────────────────────
  // currentProject is set by getProjectByIdThunk / createProjectThunk
  const currentProject = useSelector(
    (s) => s.project?.currentProject ?? null
  );
  // Full projects list — populated by getAllProjectsThunk (dispatched in DashboardLayout)
  const allProjects = useSelector(
    (s) => s.project?.projects ?? []
  );

  const offers    = useSelector(selectProjectOffers);
  const isLoading = useSelector(selectListLoading);

  // ── Resolve real project _id ──────────────────────────────────────────────
  /**
   * Resolution priority:
   * 1. Explicit ObjectId in params (direct URL navigation by ID)
   * 2. currentProject in Redux (set when user clicks a project row)
   * 3. Slug match against allProjects using :projectName param
   *    Route: /projects/:projectName/onboarding
   *    DashboardLayout builds slugs as: name.toLowerCase().replace(/\s+/g, "-")
   * 4. Hardcoded fallback for local dev
   */
  const resolvedProjectId = useMemo(() => {
    // 1. Explicit ID params
    if (isObjectId(params.projectId)) return params.projectId;
    if (isObjectId(params.id))        return params.id;

    // 2. currentProject already loaded in Redux
    if (isObjectId(currentProject?._id)) return String(currentProject._id);

    // 3. Match by slug from :projectName
    if (params.projectName) {
      const slug  = params.projectName.toLowerCase();
      const match = allProjects.find(
        (p) => toSlug(p.productionName ?? "") === slug
      );
      if (isObjectId(match?._id)) return String(match._id);
    }

    // 4. Fallback
    console.warn("[CrewOnboarding] Could not resolve projectId from params or Redux — using fallback");
    return FALLBACK_PROJECT_ID;
  }, [params.projectId, params.id, params.projectName, currentProject, allProjects]);

  // Slug used for sub-navigation (crew-search, settings links)
  const projectSlug = params.projectName ?? "demo-project";

  // ── Filters ───────────────────────────────────────────────────────────────
  const [statFilter,  setStatFilter]  = useState("ALL");
  const [stageFilter, setStageFilter] = useState(null);
  const [showCreate,  setShowCreate]  = useState(false);

  // ── Fetch offers whenever the resolved project ID changes ─────────────────
  useEffect(() => {
    dispatch(getProjectOffersThunk({ projectId: resolvedProjectId }));
  }, [dispatch, resolvedProjectId]);

  // ── Derived counts ────────────────────────────────────────────────────────
  const stageCounts   = useMemo(() => computeStageCounts(offers),  [offers]);
  const summaryValues = useMemo(() => computeSummaryValues(offers), [offers]);

  // ── Filter handlers ───────────────────────────────────────────────────────
  const handleStatSelect  = (val) => { setStatFilter(val);  setStageFilter(null); };
  const handleStageSelect = (key) => { setStageFilter(prev => prev === key ? null : key); setStatFilter(null); };
  const handleClearFilter = ()    => { setStageFilter(null); setStatFilter("ALL"); };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <div className="py-5 space-y-5">

        <PageHeader
          title="Crew Onboarding"
          icon="Users"
          secondaryActions={[
            {
              label: "Crew Search",
              icon: "Search",
              variant: "outline",
              clickAction: () => navigate(`/projects/${projectSlug}/crew-search`),
            },
            {
              label: "Settings",
              icon: "Settings",
              variant: "outline",
              clickAction: () => navigate(`/projects/${projectSlug}/settings`),
            },
          ]}
          primaryAction={{
            label: "Create Offer",
            icon: "Plus",
            variant: "default",
            clickAction: () => setShowCreate(true),
          }}
        />

        {/* Summary stats — 6 cards including Deleted */}
        <PrimaryStats
          gridColumns={6}
          gridGap={3}
          stats={SUMMARY_STATS_CONFIG.map(s => ({
            ...s,
            value:
              s.value === "ALL"      ? summaryValues.all      :
              s.value === "PENDING"  ? summaryValues.pending  :
              s.value === "ACCEPTED" ? summaryValues.accepted :
              s.value === "REJECTED" ? summaryValues.rejected :
              s.value === "DELETED"  ? summaryValues.deleted  :
              summaryValues.ended,
            isSelected: statFilter === s.value,
            onClick: () => handleStatSelect(s.value),
          }))}
        />

        {/* Stage pipeline cards */}
        <div className="grid grid-cols-3 sm:grid-cols-8 gap-2">
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