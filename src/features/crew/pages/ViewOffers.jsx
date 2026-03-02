/**
 * ViewOffer.jsx
 *
 * Layout:
 *   Top bar  → Back + Offer code + Refresh + ROLE SWITCHER
 *   Progress → OfferStatusProgress bar
 *   Body     → [3fr contract preview] [1fr action panel]
 *
 * Role switcher shows pill tabs:
 *   PRODUCTION_ADMIN · CREW · ACCOUNTS · UPM · FC · STUDIO
 *
 * Action panel changes completely based on active role + offer status.
 */

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  ArrowLeft, CheckCircle, XCircle, MessageSquare,
  Loader2, AlertTriangle, Send, ClipboardCheck,
  Calculator, PenLine, RefreshCw, Trash2, Eye,
  Users, ShieldCheck, Landmark, Film, User,
} from "lucide-react";

import { Card, CardContent } from "../../../shared/components/ui/card";
import { Button }            from "../../../shared/components/ui/button";
import { Badge }             from "../../../shared/components/ui/badge";

import {
  getOfferThunk,
  sendToCrewThunk,
  markViewedThunk,
  crewAcceptThunk,
  crewRequestChangesThunk,
  cancelOfferThunk,
  moveToProductionCheckThunk,
  moveToAccountsCheckThunk,
  moveToPendingCrewSignatureThunk,
  selectCurrentOffer,
  selectOfferLoading,
  selectSubmitting,
  selectOfferError,
  clearOfferError,
} from "../store/offer.slice";

import { selectViewRole, setViewRole } from "../store/viewrole.slice";

import OfferStatusProgress   from "../components/viewoffer/OfferStatusProgress";
import { CreateOfferLayout } from "../components/roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import OfferActionDialog     from "../components/onboarding/OfferActionDialog";
import { calculateRates, defaultEngineSettings } from "../utils/rateCalculations";
import { defaultAllowances } from "../utils/Defaultallowance";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

const fmtMoney = (n, currency = "GBP") => {
  const num = parseFloat(n);
  if (!num) return null;
  return new Intl.NumberFormat("en-GB", { style: "currency", currency, minimumFractionDigits: 0 }).format(num);
};

const STATUS_CONFIG = {
  DRAFT:                    { label: "Draft",              color: "bg-gray-100 text-gray-600",       dot: "bg-gray-400"    },
  SENT_TO_CREW:             { label: "Sent to Crew",       color: "bg-amber-100 text-amber-700",     dot: "bg-amber-500"   },
  NEEDS_REVISION:           { label: "Needs Revision",     color: "bg-orange-100 text-orange-700",   dot: "bg-orange-500"  },
  CREW_ACCEPTED:            { label: "Crew Accepted",      color: "bg-blue-100 text-blue-700",       dot: "bg-blue-500"    },
  PRODUCTION_CHECK:         { label: "Production Check",   color: "bg-violet-100 text-violet-700",   dot: "bg-violet-500"  },
  ACCOUNTS_CHECK:           { label: "Accounts Check",     color: "bg-indigo-100 text-indigo-700",   dot: "bg-indigo-500"  },
  PENDING_CREW_SIGNATURE:   { label: "Crew Signature",     color: "bg-purple-100 text-purple-700",   dot: "bg-purple-500"  },
  PENDING_UPM_SIGNATURE:    { label: "UPM Signing",        color: "bg-purple-100 text-purple-700",   dot: "bg-purple-500"  },
  PENDING_FC_SIGNATURE:     { label: "FC Signing",         color: "bg-purple-100 text-purple-700",   dot: "bg-purple-500"  },
  PENDING_STUDIO_SIGNATURE: { label: "Studio Signing",     color: "bg-purple-100 text-purple-700",   dot: "bg-purple-500"  },
  COMPLETED:                { label: "Completed",          color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  CANCELLED:                { label: "Cancelled",          color: "bg-red-100 text-red-700",         dot: "bg-red-500"     },
};

// ─── Role switcher config ─────────────────────────────────────────────────────

const ROLES = [
  { key: "PRODUCTION_ADMIN", label: "Production",  Icon: Film       },
  { key: "CREW",             label: "Crew",         Icon: User       },
  { key: "ACCOUNTS_ADMIN",   label: "Accounts",     Icon: Calculator },
  { key: "UPM",              label: "UPM",          Icon: ShieldCheck},
  { key: "FC",               label: "FC",           Icon: Landmark   },
  { key: "STUDIO",           label: "Studio",       Icon: Eye        },
];

// ─── Role Switcher Panel ──────────────────────────────────────────────────────

function RoleSwitcher({ viewRole, onChange }) {
  return (
    <div className="flex items-center gap-1.5 bg-muted/60 border border-border rounded-xl px-2 py-1.5">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mr-1 whitespace-nowrap">
        View as
      </span>
      {ROLES.map(({ key, label, Icon }) => {
        const active = viewRole === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold
              transition-all duration-150 whitespace-nowrap
              ${active
                ? "bg-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-sm"
              }
            `}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Data mappers ─────────────────────────────────────────────────────────────

function offerToContractData(offer) {
  if (!offer) return {};
  return {
    fullName:                       offer.recipient?.fullName        || "",
    email:                          offer.recipient?.email           || "",
    mobileNumber:                   offer.recipient?.mobileNumber    || "",
    isViaAgent:                     offer.representation?.isViaAgent || false,
    agentEmail:                     offer.representation?.agentEmail || "",
    agentName:                      offer.representation?.agentName  || "",
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

// ─── Offer summary card (shared across all panels) ───────────────────────────

function OfferSummaryCard({ offer }) {
  const status  = offer?.status;
  const cfg     = STATUS_CONFIG[status] || { label: status, color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };
  const jobTitle= offer?.createOwnJobTitle && offer?.newJobTitle ? offer.newJobTitle : offer?.jobTitle || "—";
  const dept    = offer?.department?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";
  const rate    = offer?.feePerDay;
  const currency= offer?.currency || "GBP";
  const rateType= offer?.dailyOrWeekly || "daily";
  const engType = { loan_out:"Loan Out", paye:"PAYE", schd:"SCHD", long_form:"Long Form" }[offer?.engagementType] || "";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Offer Summary</h3>
          <Badge className={`text-[10px] font-medium px-2 py-0.5 border-0 gap-1.5 ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${cfg.dot}`} />
            {cfg.label}
          </Badge>
        </div>
        {offer?.offerCode && (
          <p className="text-[10px] font-mono text-muted-foreground mb-2">{offer.offerCode}</p>
        )}
        <div className="space-y-1.5 text-xs text-muted-foreground border-t pt-3">
          {[
            { label: "Recipient",   value: offer?.recipient?.fullName },
            { label: "Role",        value: jobTitle },
            dept     && { label: "Department", value: dept },
            rate     && { label: "Rate",       value: `${fmtMoney(rate, currency)} / ${rateType}` },
            engType  && { label: "Engagement", value: engType },
            offer?.startDate && { label: "Start",  value: fmtDate(offer.startDate) },
            offer?.endDate   && { label: "End",    value: fmtDate(offer.endDate) },
          ].filter(Boolean).map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-2">
              <span>{label}</span>
              <span className="font-medium text-foreground truncate max-w-[150px] text-right">{value || "—"}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Timeline card (shared) ───────────────────────────────────────────────────

function TimelineCard({ offer }) {
  const tl = offer?.timeline || {};
  const entries = [
    { label: "Created",          date: offer?.createdAt },
    { label: "Sent to Crew",     date: tl.sentToCrewAt },
    { label: "Crew Viewed",      date: tl.crewViewedAt },
    { label: "Crew Accepted",    date: tl.crewAcceptedAt },
    { label: "Production Check", date: tl.productionCheckCompletedAt },
    { label: "Accounts Check",   date: tl.accountsCheckCompletedAt },
    { label: "Pending Signature",date: tl.pendingCrewSignatureAt },
    { label: "Crew Signed",      date: tl.crewSignedAt },
    { label: "UPM Signed",       date: tl.upmSignedAt },
    { label: "FC Signed",        date: tl.fcSignedAt },
    { label: "Studio Signed",    date: tl.studioSignedAt },
    { label: "Completed",        date: tl.completedAt },
    { label: "Cancelled",        date: tl.cancelledAt },
  ].filter(e => e.date);

  if (!entries.length) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold mb-3">Timeline</h3>
        <div className="space-y-1.5 text-xs">
          {entries.map((e, i) => (
            <div key={i} className="flex justify-between gap-2">
              <span className="text-muted-foreground">{e.label}</span>
              <span className="font-medium text-right">{fmtDate(e.date)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Role-specific action panels ─────────────────────────────────────────────

function ActionButton({ onClick, disabled, className = "", icon: Icon, label, variant = "default" }) {
  return (
    <Button
      variant={variant}
      className={`w-full gap-2 justify-start h-10 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
      {label}
    </Button>
  );
}

// — Production Admin panel —
function ProductionAdminPanel({ offer, onAction, isSubmitting }) {
  const status = offer?.status;

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
          <h3 className="text-sm font-semibold">Production Actions</h3>
        </div>

        {(status === "DRAFT" || status === "NEEDS_REVISION") && (
          <ActionButton
            icon={Send} disabled={isSubmitting}
            label={status === "NEEDS_REVISION" ? "Re-send to Crew" : "Send to Crew"}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => onAction("sendToCrew")}
          />
        )}
        {status === "CREW_ACCEPTED" && (
          <ActionButton
            icon={ClipboardCheck} disabled={isSubmitting}
            label="Move to Production Check"
            className="bg-violet-600 hover:bg-violet-700 text-white"
            onClick={() => onAction("productionCheck")}
          />
        )}
        {status === "PRODUCTION_CHECK" && (
          <ActionButton
            icon={Calculator} disabled={isSubmitting}
            label="Move to Accounts Check"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => onAction("accountsCheck")}
          />
        )}
        {status === "ACCOUNTS_CHECK" && (
          <ActionButton
            icon={PenLine} disabled={isSubmitting}
            label="Send for Crew Signature"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => onAction("pendingCrewSignature")}
          />
        )}

        {/* Awaiting states — read-only info */}
        {status === "SENT_TO_CREW" && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-start gap-2">
            <Eye className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Offer sent. Awaiting crew response.</span>
          </div>
        )}
        {["PENDING_CREW_SIGNATURE","PENDING_UPM_SIGNATURE","PENDING_FC_SIGNATURE","PENDING_STUDIO_SIGNATURE"].includes(status) && (
          <div className="rounded-xl bg-purple-50 border border-purple-200 p-3 text-xs text-purple-800 flex items-start gap-2">
            <PenLine className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Contract is in the signing workflow.</span>
          </div>
        )}
        {status === "COMPLETED" && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Contract fully signed and completed.</span>
          </div>
        )}
        {status === "CANCELLED" && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-800 flex items-start gap-2">
            <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>This offer has been cancelled.</span>
          </div>
        )}

        {/* Cancel — available on most active statuses */}
        {["DRAFT","SENT_TO_CREW","NEEDS_REVISION","CREW_ACCEPTED","PRODUCTION_CHECK","ACCOUNTS_CHECK","PENDING_CREW_SIGNATURE"].includes(status) && (
          <div className="pt-1 border-t mt-2">
            <ActionButton
              icon={Trash2} disabled={isSubmitting} variant="outline"
              label="Cancel Offer"
              className="text-destructive border-destructive/30 hover:bg-destructive/5"
              onClick={() => onAction("cancel")}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// — Crew panel —
function CrewPanel({ offer, onAction, isSubmitting }) {
  const status = offer?.status;

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <h3 className="text-sm font-semibold">Your Response</h3>
        </div>

        {(status === "SENT_TO_CREW" || status === "NEEDS_REVISION") && (
          <>
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800 mb-3">
              Please review the contract and either accept or request changes.
            </div>
            <ActionButton
              icon={CheckCircle} disabled={isSubmitting}
              label="Accept Offer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onAction("openAccept")}
            />
            <ActionButton
              icon={MessageSquare} disabled={isSubmitting} variant="outline"
              label="Request Changes"
              className="border-red-300 text-red-700 hover:bg-red-50"
              onClick={() => onAction("openRequestChanges")}
            />
          </>
        )}

        {status === "CREW_ACCEPTED" && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>You accepted this offer. Production is reviewing.</span>
          </div>
        )}
        {status === "PENDING_CREW_SIGNATURE" && (
          <ActionButton
            icon={PenLine} disabled={isSubmitting}
            label="Sign Contract"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => onAction("crewSign")}
          />
        )}
        {["PENDING_UPM_SIGNATURE","PENDING_FC_SIGNATURE","PENDING_STUDIO_SIGNATURE"].includes(status) && (
          <div className="rounded-xl bg-purple-50 border border-purple-200 p-3 text-xs text-purple-800 flex items-start gap-2">
            <PenLine className="w-4 h-4 mt-0.5 shrink-0" />
            <span>You've signed. Awaiting further approvals.</span>
          </div>
        )}
        {status === "COMPLETED" && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Contract fully executed. Welcome to the production!</span>
          </div>
        )}
        {status === "DRAFT" && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600">
            This offer hasn't been sent to you yet.
          </div>
        )}
        {status === "CANCELLED" && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-800 flex items-start gap-2">
            <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>This offer has been cancelled by production.</span>
          </div>
        )}
        {["PRODUCTION_CHECK","ACCOUNTS_CHECK"].includes(status) && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800 flex items-start gap-2">
            <ClipboardCheck className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Your offer is being reviewed internally.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// — Accounts panel —
function AccountsPanel({ offer, onAction, isSubmitting }) {
  const status = offer?.status;
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          <h3 className="text-sm font-semibold">Accounts Actions</h3>
        </div>
        {status === "ACCOUNTS_CHECK" && (
          <>
            <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3 text-xs text-indigo-800 mb-2">
              Review the rates and budget codes, then approve to send for signatures.
            </div>
            <ActionButton
              icon={PenLine} disabled={isSubmitting}
              label="Approve & Send for Signature"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => onAction("pendingCrewSignature")}
            />
          </>
        )}
        {status !== "ACCOUNTS_CHECK" && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600">
            {status === "COMPLETED" ? "Contract completed." :
             status === "CANCELLED" ? "Offer was cancelled." :
             "No action required at this stage."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// — UPM panel —
function UPMPanel({ offer, onAction, isSubmitting }) {
  const status = offer?.status;
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
          <h3 className="text-sm font-semibold">UPM Actions</h3>
        </div>
        {status === "PENDING_UPM_SIGNATURE" && (
          <>
            <div className="rounded-xl bg-violet-50 border border-violet-200 p-3 text-xs text-violet-800 mb-2">
              Crew has signed. Your signature is required.
            </div>
            <ActionButton
              icon={PenLine} disabled={isSubmitting}
              label="Sign Contract"
              className="bg-violet-600 hover:bg-violet-700 text-white"
              onClick={() => onAction("upmSign")}
            />
          </>
        )}
        {status !== "PENDING_UPM_SIGNATURE" && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600">
            {status === "COMPLETED" ? "Contract completed." :
             status === "CANCELLED" ? "Offer was cancelled." :
             "No action required at this stage."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// — FC panel —
function FCPanel({ offer, onAction, isSubmitting }) {
  const status = offer?.status;
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-pink-600" />
          <h3 className="text-sm font-semibold">Finance Controller</h3>
        </div>
        {status === "PENDING_FC_SIGNATURE" && (
          <>
            <div className="rounded-xl bg-pink-50 border border-pink-200 p-3 text-xs text-pink-800 mb-2">
              UPM has signed. Your sign-off is required.
            </div>
            <ActionButton
              icon={PenLine} disabled={isSubmitting}
              label="Sign Contract"
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => onAction("fcSign")}
            />
          </>
        )}
        {status !== "PENDING_FC_SIGNATURE" && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600">
            {status === "COMPLETED" ? "Contract completed." :
             status === "CANCELLED" ? "Offer was cancelled." :
             "No action required at this stage."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// — Studio panel —
function StudioPanel({ offer, onAction, isSubmitting }) {
  const status = offer?.status;
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
          <h3 className="text-sm font-semibold">Studio Actions</h3>
        </div>
        {status === "PENDING_STUDIO_SIGNATURE" && (
          <>
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 mb-2">
              Final studio signature required to complete the contract.
            </div>
            <ActionButton
              icon={PenLine} disabled={isSubmitting}
              label="Final Sign-off"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => onAction("studioSign")}
            />
          </>
        )}
        {status !== "PENDING_STUDIO_SIGNATURE" && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600">
            {status === "COMPLETED" ? "Contract completed." :
             status === "CANCELLED" ? "Offer was cancelled." :
             "No action required at this stage."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Unified right panel ──────────────────────────────────────────────────────

function RightPanel({ offer, viewRole, onAction, isSubmitting }) {
  return (
    <div className="space-y-3">
      <OfferSummaryCard offer={offer} />

      {viewRole === "PRODUCTION_ADMIN" || viewRole === "SUPER_ADMIN"
        ? <ProductionAdminPanel offer={offer} onAction={onAction} isSubmitting={isSubmitting} />
        : viewRole === "CREW"
        ? <CrewPanel offer={offer} onAction={onAction} isSubmitting={isSubmitting} />
        : viewRole === "ACCOUNTS_ADMIN"
        ? <AccountsPanel offer={offer} onAction={onAction} isSubmitting={isSubmitting} />
        : viewRole === "UPM"
        ? <UPMPanel offer={offer} onAction={onAction} isSubmitting={isSubmitting} />
        : viewRole === "FC"
        ? <FCPanel offer={offer} onAction={onAction} isSubmitting={isSubmitting} />
        : viewRole === "STUDIO"
        ? <StudioPanel offer={offer} onAction={onAction} isSubmitting={isSubmitting} />
        : null
      }

      <TimelineCard offer={offer} />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ViewOffer() {
  const { id, projectName } = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();

  const offer        = useSelector(selectCurrentOffer);
  const isLoading    = useSelector(selectOfferLoading);
  const isSubmitting = useSelector(selectSubmitting);
  const apiError     = useSelector(selectOfferError);
  const viewRole     = useSelector(selectViewRole);

  const [dialog, setDialog] = useState(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (id) dispatch(getOfferThunk(id));
  }, [id, dispatch]);

  // ── Mark viewed ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (offer?._id && viewRole === "CREW" && offer.status === "SENT_TO_CREW") {
      dispatch(markViewedThunk(offer._id));
    }
  }, [offer?._id, viewRole, offer?.status, dispatch]);

  // ── Errors ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (apiError) {
      const msg = apiError.errors?.length
        ? apiError.errors.map(e => e.message).join(" · ")
        : apiError.message || "Something went wrong";
      toast.error(msg);
      dispatch(clearOfferError());
    }
  }, [apiError, dispatch]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const contractData    = useMemo(() => offerToContractData(offer), [offer]);
  const allowances      = useMemo(() => offerToAllowances(offer),   [offer]);
  const calculatedRates = useMemo(() => {
    const fee = parseFloat(contractData.feePerDay) || 0;
    return calculateRates(fee, defaultEngineSettings);
  }, [contractData.feePerDay]);

  const salaryBudgetCodes   = offer?.salaryBudgetCodes   || [];
  const salaryTags          = offer?.salaryTags          || [];
  const overtimeBudgetCodes = offer?.overtimeBudgetCodes || [];
  const overtimeTags        = offer?.overtimeTags        || [];

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleAction = async (action, payload = {}) => {
    const offerId = offer?._id;
    if (!offerId) return;

    if (action === "openAccept")         { setDialog("acceptOffer");    return; }
    if (action === "openRequestChanges") { setDialog("requestChanges"); return; }

    toast.loading("Processing…", { id: "va" });
    let result;
    switch (action) {
      case "sendToCrew":           result = await dispatch(sendToCrewThunk(offerId));                          break;
      case "accept":               result = await dispatch(crewAcceptThunk(offerId));                         break;
      case "requestChanges":       result = await dispatch(crewRequestChangesThunk({ offerId, ...payload })); break;
      case "cancel":               result = await dispatch(cancelOfferThunk(offerId));                        break;
      case "productionCheck":      result = await dispatch(moveToProductionCheckThunk(offerId));              break;
      case "accountsCheck":        result = await dispatch(moveToAccountsCheckThunk(offerId));                break;
      case "pendingCrewSignature": result = await dispatch(moveToPendingCrewSignatureThunk(offerId));         break;
      // Signature actions — wire up thunks when ready
      case "crewSign":
      case "upmSign":
      case "fcSign":
      case "studioSign":
        toast.dismiss("va");
        toast.info("Signature flow coming soon");
        return;
      default:
        toast.dismiss("va");
        return;
    }
    toast.dismiss("va");
    if (!result.error) {
      const msgs = {
        sendToCrew: "📤 Sent to crew!", accept: "✅ Offer accepted!",
        requestChanges: "📝 Change request submitted!", cancel: "❌ Offer cancelled.",
        productionCheck: "✅ Moved to Production Check",
        accountsCheck: "✅ Moved to Accounts Check",
        pendingCrewSignature: "✅ Sent for signature",
      };
      toast.success(msgs[action] || "Done");
      dispatch(getOfferThunk(offerId));
    }
  };

  const handleDialogConfirm = async (payload) => {
    const action = dialog === "acceptOffer" ? "accept" : "requestChanges";
    setDialog(null);
    await handleAction(action, payload);
  };

  // ── Loading / error ───────────────────────────────────────────────────────
  if (isLoading && !offer) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading offer…</p>
        </div>
      </div>
    );
  }

  if (!offer && !isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm font-medium">Offer not found</p>
          <Button size="sm" variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const tl   = offer?.timeline || {};
  const proj = projectName || "demo-project";

  return (
    <div className="min-h-screen">
      <div className=" py-5 space-y-4">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button variant="ghost" size="sm"
            onClick={() => navigate(`/projects/${proj}/offers`)}
            className="gap-2 text-muted-foreground hover:text-foreground shrink-0">
            <ArrowLeft className="w-4 h-4" /> Back to Offers
          </Button>

          {/* Role Switcher — centre */}
          <RoleSwitcher
            viewRole={viewRole}
            onChange={(role) => dispatch(setViewRole(role))}
          />

          {/* Right: offer code + refresh */}
          <div className="flex items-center gap-2 shrink-0">
            {offer?.offerCode && (
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                {offer.offerCode}
              </span>
            )}
            <Button size="sm" variant="outline"
              onClick={() => dispatch(getOfferThunk(id))}
              className="h-8 w-8 p-0" title="Refresh">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* ── Status Progress ── */}
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

        {/* ── Body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4 items-start">

          {/* Left: contract preview */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <CreateOfferLayout
                data={contractData}
                offer={offer}
                activeField={null}
                calculatedRates={calculatedRates}
                engineSettings={defaultEngineSettings}
                salaryBudgetCodes={salaryBudgetCodes}
                setSalaryBudgetCodes={() => {}}
                salaryTags={salaryTags}
                setSalaryTags={() => {}}
                overtimeBudgetCodes={overtimeBudgetCodes}
                setOvertimeBudgetCodes={() => {}}
                overtimeTags={overtimeTags}
                setOvertimeTags={() => {}}
                allowances={allowances}
                hideOfferSections={false}
                hideContractDocument={false}
                isDocumentLocked={offer?.status === "COMPLETED"}
              />
            </CardContent>
          </Card>

          {/* Right: role-based panel */}
          <RightPanel
            offer={offer}
            viewRole={viewRole}
            onAction={handleAction}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Dialogs */}
      {dialog === "acceptOffer" && (
        <OfferActionDialog
          type="acceptOffer"
          offer={offer}
          open={true}
          onConfirm={handleDialogConfirm}
          onClose={() => setDialog(null)}
          isLoading={isSubmitting}
        />
      )}
      {dialog === "requestChanges" && (
        <OfferActionDialog
          type="requestChanges"
          offer={offer}
          open={true}
          onConfirm={handleDialogConfirm}
          onClose={() => setDialog(null)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}