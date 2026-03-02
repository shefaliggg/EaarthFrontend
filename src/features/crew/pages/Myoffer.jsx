// src/features/crew/pages/MyOffer.jsx
//
// Fully connected to backend via Redux.
// Reads flat backend model fields (jobTitle, department, feePerDay, etc.)
// Navigation: view → /projects/:projectName/offers/:id/view

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Card, CardContent } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import {
  FileText, MessageSquare, CheckCircle,
  Loader2, RefreshCw, Plus, Eye, Clock,
  AlertTriangle, ChevronRight,
  Calendar, DollarSign, Briefcase,
} from "lucide-react";

import {
  getProjectOffersThunk,
  getMyOffersThunk,
} from "../store/offer.slice";
import { selectViewRole } from "../store/viewrole.slice";

// ─── Selectors ────────────────────────────────────────────────────────────────
const selectProjectOffers = (s) => s?.offers?.projectOffers ?? [];
const selectMyOffers      = (s) => s?.offers?.myOffers      ?? [];
const selectIsLoading     = (s) => s?.offers?.isLoadingList  ?? false;
const selectError         = (s) => s?.offers?.error          ?? null;

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  DRAFT:                    { label: "Draft",              color: "bg-gray-100 text-gray-600",             dot: "bg-gray-400"    },
  SENT_TO_CREW:             { label: "Awaiting Response",  color: "bg-amber-100 text-amber-700",           dot: "bg-amber-500"   },
  NEEDS_REVISION:           { label: "Needs Revision",     color: "bg-orange-100 text-orange-700",         dot: "bg-orange-500"  },
  CREW_ACCEPTED:            { label: "Accepted",           color: "bg-blue-100 text-blue-700",             dot: "bg-blue-500"    },
  PRODUCTION_CHECK:         { label: "Production Check",   color: "bg-violet-100 text-violet-700",         dot: "bg-violet-500"  },
  ACCOUNTS_CHECK:           { label: "Accounts Check",     color: "bg-indigo-100 text-indigo-700",         dot: "bg-indigo-500"  },
  PENDING_CREW_SIGNATURE:   { label: "Awaiting Signature", color: "bg-purple-100 text-purple-700",         dot: "bg-purple-500"  },
  PENDING_UPM_SIGNATURE:    { label: "UPM Signing",        color: "bg-purple-100 text-purple-700",         dot: "bg-purple-500"  },
  PENDING_FC_SIGNATURE:     { label: "FC Signing",         color: "bg-purple-100 text-purple-700",         dot: "bg-purple-500"  },
  PENDING_STUDIO_SIGNATURE: { label: "Studio Signing",     color: "bg-purple-100 text-purple-700",         dot: "bg-purple-500"  },
  COMPLETED:                { label: "Completed",          color: "bg-emerald-100 text-emerald-700",       dot: "bg-emerald-500" },
  CANCELLED:                { label: "Cancelled",          color: "bg-red-100 text-red-700",               dot: "bg-red-500"     },
};
const getStatusCfg = (s) => STATUS_CONFIG[s] || { label: s, color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

const fmtMoney = (n, currency = "GBP") => {
  const num = parseFloat(n);
  if (!num) return null;
  return new Intl.NumberFormat("en-GB", {
    style: "currency", currency, minimumFractionDigits: 0,
  }).format(num);
};

// Read department label from flat backend field
const deptLabel = (val = "") =>
  val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// Read engagement type label
const engLabel = (val = "") => {
  const map = { loan_out: "Loan Out", paye: "PAYE", schd: "SCHD", long_form: "Long Form" };
  return map[val] || val.replace(/_/g, " ").toUpperCase();
};

// ─── OfferCard ────────────────────────────────────────────────────────────────
function OfferCard({ offer, onView }) {
  const cfg = getStatusCfg(offer.status);

  // ── Read from flat backend model fields ───────────────────────────────────
  const name       = offer.recipient?.fullName || offer.fullName || "—";
  const jobTitle   = offer.createOwnJobTitle && offer.newJobTitle
    ? offer.newJobTitle
    : offer.jobTitle || "—";
  const dept       = offer.department ? deptLabel(offer.department) : null;
  const rate       = offer.feePerDay;
  const currency   = offer.currency || "GBP";
  const rateType   = offer.dailyOrWeekly || "daily";
  const engagement = offer.engagementType ? engLabel(offer.engagementType) : null;
  const startDate  = offer.startDate;
  const endDate    = offer.endDate;

  const requiresAction =
    offer.status === "SENT_TO_CREW" || offer.status === "PENDING_CREW_SIGNATURE";

  return (
    <Card
      className="group border hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={() => onView(offer._id)}
    >
      <CardContent className="p-0">
        {/* Status accent bar */}
        <div className={`h-[3px] w-full ${cfg.dot}`} />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="font-semibold text-sm truncate">{name}</h3>
                {offer.offerCode && (
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {offer.offerCode}
                  </span>
                )}
                {requiresAction && (
                  <span className="text-[10px] font-semibold text-white bg-primary px-1.5 py-0.5 rounded-full animate-pulse">
                    Action Required
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {jobTitle}{dept ? ` · ${dept}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className={`text-[10px] font-medium px-2 py-0.5 border-0 gap-1 ${cfg.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${cfg.dot}`} />
                {cfg.label}
              </Badge>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {rate && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <strong className="text-foreground">{fmtMoney(rate, currency)}</strong>
                &nbsp;/ {rateType}
              </span>
            )}
            {engagement && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {engagement}
              </span>
            )}
            {startDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {fmtDate(startDate)}
                {endDate ? ` → ${fmtDate(endDate)}` : ""}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {offer.updatedAt ? `Updated ${fmtDate(offer.updatedAt)}` : ""}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[11px] gap-1 text-primary hover:text-primary"
              onClick={(e) => { e.stopPropagation(); onView(offer._id); }}
            >
              <Eye className="w-3 h-3" /> View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
function Section({ title, icon: Icon, iconColor, offers, onView }) {
  if (!offers.length) return null;
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        {title}
        <span className="bg-muted text-foreground rounded-full px-2 py-0.5 text-[10px] font-bold">
          {offers.length}
        </span>
      </h2>
      <div className="space-y-2">
        {offers.map((o) => <OfferCard key={o._id} offer={o} onView={onView} />)}
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function Empty({ isProductionAdmin, onCreate }) {
  return (
    <Card className="p-12 text-center border-dashed">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <FileText className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No Offers Yet</h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
        {isProductionAdmin
          ? "No offers have been created for this project yet."
          : "When production sends you an offer, it will appear here."}
      </p>
      {isProductionAdmin && (
        <Button size="sm" className="mt-4 gap-2" onClick={onCreate}>
          <Plus className="w-4 h-4" /> Create First Offer
        </Button>
      )}
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MyOffer() {
  const navigate            = useNavigate();
  const dispatch            = useDispatch();
  const { projectName, projectId } = useParams();

  const viewRole      = useSelector(selectViewRole);
  const projectOffers = useSelector(selectProjectOffers);
  const myOffers      = useSelector(selectMyOffers);
  const isLoading     = useSelector(selectIsLoading);
  const error         = useSelector(selectError);

  const isProductionAdmin = viewRole === "PRODUCTION_ADMIN" || viewRole === "SUPER_ADMIN";
  const offers = isProductionAdmin ? projectOffers : myOffers;

  // Use projectId from URL params — falls back to a known ID for dev
  const resolvedProjectId = projectId || "697c899668977a7ca2b27462";

  const fetchOffers = () => {
    if (isProductionAdmin) {
      dispatch(getProjectOffersThunk({ projectId: resolvedProjectId }));
    } else {
      dispatch(getMyOffersThunk());
    }
  };

  useEffect(() => { fetchOffers(); }, [viewRole, resolvedProjectId, dispatch]);

  // ── Navigation ───────────────────────────────────────────────────────────────
  // Goes to ViewOffer page — path must match your router definition
const handleView = (offerId) => {
  navigate(`/projects/${projectName || "demo-project"}/offers/${offerId}/view`);
};

  const handleCreate = () => {
    navigate(`/projects/${projectName || "demo-project"}/offers/create`);
  };

  // ── Bucket offers by status ───────────────────────────────────────────────
  const actionRequired = offers.filter((o) =>
    ["SENT_TO_CREW", "NEEDS_REVISION", "PENDING_CREW_SIGNATURE"].includes(o.status)
  );
  const drafts = offers.filter((o) => o.status === "DRAFT");
  const inProgress = offers.filter((o) =>
    ["CREW_ACCEPTED", "PRODUCTION_CHECK", "ACCOUNTS_CHECK",
      "PENDING_UPM_SIGNATURE", "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE",
    ].includes(o.status)
  );
  const completed = offers.filter((o) => o.status === "COMPLETED");
  const cancelled = offers.filter((o) => o.status === "CANCELLED");

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Loading offers…</p>
      </div>
    </div>
  );

  if (error && !offers.length) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-destructive mx-auto" />
        <p className="text-sm font-medium text-destructive">
          {error.message || "Failed to load offers"}
        </p>
        <Button size="sm" variant="outline" onClick={fetchOffers} className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto space-y-6 py-2">

      {/* ── Page header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isProductionAdmin ? "Crew Offers" : "My Offers"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isProductionAdmin
              ? "Manage all crew offers for this project"
              : "View and manage your crew offers"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Summary pills */}
          <div className="hidden sm:flex items-center gap-3 mr-2">
            {[
              { label: "Action",    count: actionRequired.length, dot: "bg-primary"     },
              { label: "Progress",  count: inProgress.length,     dot: "bg-blue-500"    },
              { label: "Completed", count: completed.length,       dot: "bg-emerald-500" },
            ].map(({ label, count, dot }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs">
                <div className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-muted-foreground">
                  {label} <strong className="text-foreground">{count}</strong>
                </span>
              </div>
            ))}
          </div>

          <Button size="sm" variant="outline" onClick={fetchOffers} className="h-8 w-8 p-0" title="Refresh">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>

          {isProductionAdmin && (
            <Button size="sm" onClick={handleCreate} className="h-8 gap-2">
              <Plus className="w-4 h-4" /> New Offer
            </Button>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      {offers.length === 0 ? (
        <Empty isProductionAdmin={isProductionAdmin} onCreate={handleCreate} />
      ) : (
        <div className="space-y-8">
          <Section
            title="Action Required"
            icon={AlertTriangle}
            iconColor="text-primary"
            offers={actionRequired}
            onView={handleView}
          />
          <Section
            title="Drafts"
            icon={FileText}
            iconColor="text-gray-400"
            offers={drafts}
            onView={handleView}
          />
          <Section
            title="In Progress"
            icon={Clock}
            iconColor="text-blue-500"
            offers={inProgress}
            onView={handleView}
          />
          <Section
            title="Completed"
            icon={CheckCircle}
            iconColor="text-emerald-500"
            offers={completed}
            onView={handleView}
          />
          <Section
            title="Cancelled"
            icon={AlertTriangle}
            iconColor="text-red-400"
            offers={cancelled}
            onView={handleView}
          />
        </div>
      )}
    </div>
  );
}