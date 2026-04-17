import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Card, CardContent } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import {
  FileText,
  CheckCircle,
  Loader2,
  RefreshCw,
  Plus,
  Eye,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { OfferStatusBadge } from "../components/onboarding/OfferStatusBadge";

import {
  getProjectOffersThunk,
  getMyOffersThunk,
} from "../store/offer.slice";
import { selectViewRole } from "../store/viewrole.slice";

const selectProjectOffers = (s) => s?.offers?.projectOffers ?? [];
const selectMyOffers = (s) => s?.offers?.myOffers ?? [];
const selectIsLoading = (s) => s?.offers?.isLoadingList ?? false;
const selectError = (s) => s?.offers?.error ?? null;

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

const fmtMoney = (n, currency = "GBP") => {
  const num = parseFloat(n);
  if (!num) return null;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(num);
};

const deptLabel = (val = "") =>
  val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const engLabel = (val = "") => {
  const map = {
    loan_out: "Loan Out",
    paye: "PAYE",
    schd: "SCHD",
    long_form: "Long Form",
  };
  return map[val] || val.replace(/_/g, " ").toUpperCase();
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

function OfferRow({ offer, onView, isLast }) {
  const id = offer._id;
  const name = offer.recipient?.fullName || offer.fullName || "—";
  const jobTitle =
    offer.createOwnJobTitle && offer.newJobTitle
      ? offer.newJobTitle
      : offer.jobTitle || "—";
  const dept = offer.department ? deptLabel(offer.department) : null;
  const rate = offer.feePerDay;
  const currency = offer.currency || "GBP";
  const rateType = offer.dailyOrWeekly || "daily";
  const engagement = offer.engagementType ? engLabel(offer.engagementType) : null;

  return (
    <div
      onClick={() => onView(id)}
      className={`
        flex items-center gap-4 px-4 py-3 group cursor-pointer transition-colors hover:bg-purple-50/30
        ${!isLast ? "border-b border-neutral-100" : ""}
      `}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[13px] font-semibold text-neutral-800 truncate">{name}</span>
          <OfferStatusBadge status={offer.status} />
          {offer.offerCode && (
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
              {offer.offerCode}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-400 flex-wrap">
          <span className="font-medium text-neutral-500">{jobTitle}</span>
          {dept && (
            <>
              <span>·</span>
              <span>{dept}</span>
            </>
          )}
          {rate && (
            <>
              <span>·</span>
              <span>
                {fmtMoney(rate, currency)} / {rateType}
              </span>
            </>
          )}
          {engagement && (
            <>
              <span>·</span>
              <span>{engagement}</span>
            </>
          )}
        </div>

        {(offer.startDate || offer.endDate) && (
          <p className="text-[10px] text-neutral-400 mt-0.5">
            {offer.startDate ? fmtDate(offer.startDate) : ""}
            {offer.endDate ? ` → ${fmtDate(offer.endDate)}` : ""}
          </p>
        )}
      </div>

      <div className="text-right shrink-0 mr-2 hidden md:block">
        <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Updated</p>
        <p className="text-[11px] text-neutral-600 font-medium">
          {offer.updatedAt ? timeAgo(offer.updatedAt) : "-"}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1.5 px-3 text-[11px] border-neutral-200 text-neutral-600 hover:bg-neutral-50"
          onClick={(e) => {
            e.stopPropagation();
            onView(id);
          }}
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </Button>
      </div>
    </div>
  );
}

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

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {offers.map((offer, idx) => (
          <OfferRow
            key={offer._id}
            offer={offer}
            onView={onView}
            isLast={idx === offers.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

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

export default function MyOffer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projectName, projectId } = useParams();

  const viewRole = useSelector(selectViewRole);
  const projectOffers = useSelector(selectProjectOffers);
  const myOffers = useSelector(selectMyOffers);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const isProductionAdmin =
    viewRole === "PRODUCTION_ADMIN" || viewRole === "SUPER_ADMIN";
  const offers = isProductionAdmin ? projectOffers : myOffers;
  const resolvedProjectId = projectId || "697c899668977a7ca2b27462";

  const fetchOffers = () => {
    if (isProductionAdmin) {
      dispatch(getProjectOffersThunk({ projectId: resolvedProjectId }));
    } else {
      dispatch(getMyOffersThunk());
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [viewRole, resolvedProjectId, dispatch]);

  const handleView = (offerId) => {
    navigate(`/projects/${projectName || "demo-project"}/offers/${offerId}/view`);
  };

  const handleCreate = () => {
    navigate(`/projects/${projectName || "demo-project"}/offers/create`);
  };

  const actionRequired = offers.filter((o) =>
    ["SENT_TO_CREW", "NEEDS_REVISION", "PENDING_CREW_SIGNATURE"].includes(o.status)
  );
  const drafts = offers.filter((o) => o.status === "DRAFT");
  const inProgress = offers.filter((o) =>
    [
      "CREW_ACCEPTED",
      "PRODUCTION_CHECK",
      "ACCOUNTS_CHECK",
      "PENDING_UPM_SIGNATURE",
      "PENDING_FC_SIGNATURE",
      "PENDING_STUDIO_SIGNATURE",
    ].includes(o.status)
  );
  const completed = offers.filter((o) => o.status === "COMPLETED");
  const cancelled = offers.filter((o) => o.status === "CANCELLED");

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading offers…</p>
        </div>
      </div>
    );
  }

  if (error && !offers.length) {
    return (
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
  }

  return (
    <div className="space-y-6 py-2">
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
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total", value: offers.length, icon: FileText, tone: "text-slate-600", bg: "bg-slate-50" },
          { label: "Action Required", value: actionRequired.length, icon: AlertTriangle, tone: "text-amber-600", bg: "bg-amber-50" },
          { label: "Drafts", value: drafts.length, icon: FileText, tone: "text-neutral-600", bg: "bg-neutral-50" },
          { label: "In Progress", value: inProgress.length, icon: Clock, tone: "text-blue-600", bg: "bg-blue-50" },
          { label: "Completed", value: completed.length, icon: CheckCircle, tone: "text-emerald-600", bg: "bg-emerald-50" },
        ].map(({ label, value, icon: Icon, tone, bg }) => (
          <Card key={label} className="border">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="text-2xl font-semibold leading-none mt-1">{value}</p>
                </div>
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${bg}`}>
                  <Icon className={`w-4 h-4 ${tone}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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