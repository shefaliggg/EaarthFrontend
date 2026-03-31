/**
 * CrewOnboarding.jsx
 *
 * CHANGES:
 *   1. computeSummaryValues — COMPLETED now counted as "ended" (was missing)
 *   2. STAGE_KEYS — added COMPLETED tile so pipeline shows completed contracts
 *   3. matchesSummaryFilter in OffersList updated to filter COMPLETED for ENDED
 *   4. Grid updated to sm:grid-cols-9 for the extra tile
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

const isObjectId = (str) => /^[a-f\d]{24}$/i.test(String(str ?? ""));

// ─── Static config ────────────────────────────────────────────────────────────

const SUMMARY_STATS_CONFIG = [
  { value: "ALL",      label: "All Contracts", icon: BarChart3,    iconColor: "text-purple-600",  iconBg: "bg-purple-50",  color: "text-purple-700"  },
  { value: "PENDING",  label: "Pending",       icon: Clock,        iconColor: "text-amber-600",   iconBg: "bg-amber-50",   color: "text-amber-700"   },
  { value: "ACCEPTED", label: "Accepted",      icon: CheckCircle2, iconColor: "text-emerald-600", iconBg: "bg-emerald-50", color: "text-emerald-700" },
  { value: "REJECTED", label: "Rejected",      icon: XCircle,      iconColor: "text-red-600",     iconBg: "bg-red-50",     color: "text-red-700"     },
  { value: "ENDED",    label: "Ended",         icon: Users,        iconColor: "text-neutral-500", iconBg: "bg-neutral-50", color: "text-neutral-700" },
];

// UPDATED: added COMPLETED as the 9th tile
const STAGE_KEYS = [
  { key: "DRAFT",                    label: "Drafts",      icon: FileText,    color: "text-neutral-600",  bg: "bg-neutral-50",  border: "border-neutral-200"  },
  { key: "SENT_TO_CREW",             label: "Crew Review", icon: Eye,         color: "text-amber-600",    bg: "bg-amber-50",    border: "border-amber-200"    },
  { key: "PRODUCTION_CHECK",         label: "Production",  icon: AlertCircle, color: "text-purple-600",   bg: "bg-purple-50",   border: "border-purple-200"   },
  { key: "ACCOUNTS_CHECK",           label: "Accounts",    icon: Calculator,  color: "text-blue-600",     bg: "bg-blue-50",     border: "border-blue-200"     },
  { key: "PENDING_CREW_SIGNATURE",   label: "Crew Sign",   icon: PenLine,     color: "text-teal-600",     bg: "bg-teal-50",     border: "border-teal-200"     },
  { key: "PENDING_UPM_SIGNATURE",    label: "UPM Sign",    icon: Stamp,       color: "text-indigo-600",   bg: "bg-indigo-50",   border: "border-indigo-200"   },
  { key: "PENDING_FC_SIGNATURE",     label: "FC Sign",     icon: ShieldCheck, color: "text-violet-600",   bg: "bg-violet-50",   border: "border-violet-200"   },
  { key: "PENDING_STUDIO_SIGNATURE", label: "Studio Sign", icon: Building2,   color: "text-fuchsia-600",  bg: "bg-fuchsia-50",  border: "border-fuchsia-200"  },
  // NEW: completed contracts shown as final pipeline stage
  { key: "COMPLETED",                label: "Completed",   icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-200"  },
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

// UPDATED: COMPLETED now goes to "ended", not "accepted"
function computeSummaryValues(offers) {
  const pendingStatuses = new Set([
    "DRAFT", "SENT_TO_CREW", "NEEDS_REVISION", "PRODUCTION_CHECK",
    "ACCOUNTS_CHECK", "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE",
  ]);

  let pending = 0, accepted = 0, rejected = 0, ended = 0;
  offers.forEach(o => {
    if (pendingStatuses.has(o.status))     pending++;
    else if (o.status === "CREW_ACCEPTED") accepted++;
    else if (o.status === "COMPLETED")     ended++;   // fixed: was never counted before
    else if (o.status === "CANCELLED")     rejected++;
  });

  return { all: offers.length, pending, accepted, rejected, ended };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CrewOnboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params   = useParams();

  const selectedProject = useSelector(
    (s) => s.projects?.selectedProject ?? s.project?.current ?? null
  );

  const resolvedProjectId = useMemo(() => {
    if (isObjectId(params.projectId)) return params.projectId;
    if (isObjectId(params.id))        return params.id;
    if (isObjectId(selectedProject?._id)) return String(selectedProject._id);
    console.warn("[CrewOnboarding] Using fallback projectId");
    return FALLBACK_PROJECT_ID;
  }, [params.projectId, params.id, selectedProject]);

  const projectSlug = params.projectName ?? params.projectId ?? "demo-project";

  const offers    = useSelector(selectProjectOffers);
  const isLoading = useSelector(selectListLoading);

  const [statFilter,  setStatFilter]  = useState("ALL");
  const [stageFilter, setStageFilter] = useState(null);
  const [showCreate,  setShowCreate]  = useState(false);

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

        {/* UPDATED: sm:grid-cols-9 to fit the new Completed tile */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
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