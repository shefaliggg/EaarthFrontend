import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams, useNavigate }   from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  ArrowLeft, CheckCircle, XCircle, MessageSquare,
  Loader2, AlertTriangle, Send, ClipboardCheck,
  Calculator, PenLine, RefreshCw, Trash2,
  Eye, FileText, Download, Users,
} from "lucide-react";

import { Card, CardContent }  from "../../../shared/components/ui/card";
import { Button }             from "../../../shared/components/ui/button";
import { Badge }              from "../../../shared/components/ui/badge";

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
  crewSignThunk,
  upmSignThunk,
  fcSignThunk,
  studioSignThunk,
  getSigningStatusThunk,
  getContractPreviewThunk,
  getContractPdfUrlThunk,
  selectCurrentOffer,
  selectOfferLoading,
  selectSubmitting,
  selectOfferError,
  selectSigningStatus,
  selectContractPreviewHtml,
  selectContractPdfUrl,
  selectIsLoadingPreview,
  selectIsLoadingPdfUrl,
  selectContractId,
  clearOfferError,
  clearContractPreview,
  clearContractPdfUrl,
} from "../store/offer.slice";

import { selectViewRole, setViewRole } from "../store/viewrole.slice";

import OfferStatusProgress   from "../components/viewoffer/OfferStatusProgress";
import { CreateOfferLayout } from "../components/roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import OfferActionDialog     from "../components/onboarding/OfferActionDialog";
import SignDialog            from "../components/SignaturePad/SignDialog";
import ContractPreviewIframe from "../pages/ContractPreviewIframe";
import { calculateRates, defaultEngineSettings } from "../utils/rateCalculations";
import { defaultAllowances } from "../utils/Defaultallowance";

// ─── Constants ────────────────────────────────────────────────────────────────

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

const ROLES = [
  { key: "PRODUCTION_ADMIN", label: "Production" },
  { key: "CREW",             label: "Crew"        },
  { key: "ACCOUNTS_ADMIN",   label: "Accounts"    },
  { key: "UPM",              label: "UPM"         },
  { key: "FC",               label: "FC"          },
  { key: "STUDIO",           label: "Studio"      },
];

const SIGN_ROLE_MAP = {
  CREW:   { thunk: crewSignThunk,   requiredStatus: "PENDING_CREW_SIGNATURE",   label: "Crew Member",          color: "bg-teal-600 hover:bg-teal-700"    },
  UPM:    { thunk: upmSignThunk,    requiredStatus: "PENDING_UPM_SIGNATURE",    label: "Unit Production Mgr",  color: "bg-indigo-600 hover:bg-indigo-700" },
  FC:     { thunk: fcSignThunk,     requiredStatus: "PENDING_FC_SIGNATURE",     label: "Financial Controller", color: "bg-pink-600 hover:bg-pink-700"     },
  STUDIO: { thunk: studioSignThunk, requiredStatus: "PENDING_STUDIO_SIGNATURE", label: "Production Executive", color: "bg-violet-600 hover:bg-violet-700" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

const fmtMoney = (n, currency = "GBP") => {
  const num = parseFloat(n);
  if (!num) return null;
  return new Intl.NumberFormat("en-GB", { style: "currency", currency, minimumFractionDigits: 0 }).format(num);
};

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleSwitcher({ viewRole, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-muted/60 border border-border rounded-xl px-2 py-1.5">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mr-1 whitespace-nowrap">
        View as
      </span>
      {ROLES.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap
            ${viewRole === key
              ? "bg-purple-600 text-white shadow-sm"
              : "text-muted-foreground hover:bg-background hover:text-foreground"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SigningProgressCard({ signingStatus }) {
  if (!signingStatus) return null;
  const ORDER  = ["CREW", "UPM", "FC", "STUDIO"];
  const labels = { CREW: "Crew", UPM: "UPM", FC: "Finance", STUDIO: "Studio" };
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Signatures</h3>
          {signingStatus.isLocked && (
            <Badge className="text-[9px] bg-emerald-100 text-emerald-700 border-0">Locked</Badge>
          )}
        </div>
        <div className="space-y-1.5">
          {ORDER.map((role) => {
            const sig    = signingStatus.signatories?.find((s) => s.role === role);
            const signed = sig?.signed ?? false;
            return (
              <div key={role} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${signed ? "bg-emerald-500" : "bg-gray-300"}`} />
                  <span className={signed ? "text-foreground font-medium" : "text-muted-foreground"}>
                    {labels[role]}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {signed && sig.signedAt ? fmtDate(sig.signedAt) : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function OfferSummaryCard({ offer }) {
  const cfg      = STATUS_CONFIG[offer?.status] || { label: offer?.status, color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };
  const jobTitle = offer?.createOwnJobTitle && offer?.newJobTitle ? offer.newJobTitle : offer?.jobTitle || "—";
  const dept     = offer?.department?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "";
  const rate     = offer?.feePerDay;
  const currency = offer?.currency || "GBP";
  const rateType = offer?.dailyOrWeekly || "daily";
  const engType  = { loan_out: "Loan Out", paye: "PAYE", schd: "SCHD", long_form: "Long Form" }[offer?.engagementType] || "";

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
            { label: "Recipient",  value: offer?.recipient?.fullName },
            { label: "Role",       value: jobTitle },
            dept    && { label: "Department", value: dept },
            rate    && { label: "Rate",       value: `${fmtMoney(rate, currency)} / ${rateType}` },
            engType && { label: "Engagement", value: engType },
            offer?.startDate && { label: "Start", value: fmtDate(offer.startDate) },
            offer?.endDate   && { label: "End",   value: fmtDate(offer.endDate) },
          ].filter(Boolean).map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-2">
              <span>{label}</span>
              <span className="font-medium text-foreground truncate max-w-[150px] text-right">
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineCard({ offer }) {
  const tl = offer?.timeline || {};
  const entries = [
    { label: "Created",           date: offer?.createdAt },
    { label: "Sent to Crew",      date: tl.sentToCrewAt },
    { label: "Crew Viewed",       date: tl.crewViewedAt },
    { label: "Crew Accepted",     date: tl.crewAcceptedAt },
    { label: "Production Check",  date: tl.productionCheckCompletedAt },
    { label: "Accounts Check",    date: tl.accountsCheckCompletedAt },
    { label: "Pending Signature", date: tl.pendingCrewSignatureAt },
    { label: "Crew Signed",       date: tl.crewSignedAt },
    { label: "UPM Signed",        date: tl.upmSignedAt },
    { label: "FC Signed",         date: tl.fcSignedAt },
    { label: "Studio Signed",     date: tl.studioSignedAt },
    { label: "Completed",         date: tl.completedAt },
    { label: "Cancelled",         date: tl.cancelledAt },
  ].filter((e) => e.date);

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

function ActionBtn({ onClick, disabled, className = "", icon: Icon, label }) {
  return (
    <Button
      className={`w-full gap-2 justify-start h-10 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
      {label}
    </Button>
  );
}

function InfoBox({ icon: Icon, children, color = "blue" }) {
  const colors = {
    blue:   "bg-blue-50 border-blue-200 text-blue-800",
    amber:  "bg-amber-50 border-amber-200 text-amber-800",
    green:  "bg-emerald-50 border-emerald-200 text-emerald-800",
    red:    "bg-red-50 border-red-200 text-red-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
    gray:   "bg-gray-50 border-gray-200 text-gray-600",
  };
  return (
    <div className={`rounded-xl border p-3 text-xs flex items-start gap-2 ${colors[color]}`}>
      {Icon && <Icon className="w-4 h-4 mt-0.5 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}

function ProductionAdminPanel({ offer, onAction, isSubmitting }) {
  const status  = offer?.status;
  const signing = [
    "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE",   "PENDING_STUDIO_SIGNATURE",
  ];
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
          <h3 className="text-sm font-semibold">Production Actions</h3>
        </div>

        {(status === "DRAFT" || status === "NEEDS_REVISION") && (
          <ActionBtn
            icon={Send}
            disabled={isSubmitting}
            label={status === "NEEDS_REVISION" ? "Re-send to Crew" : "Send to Crew"}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => onAction("sendToCrew")}
          />
        )}
        {status === "CREW_ACCEPTED" && (
          <ActionBtn
            icon={ClipboardCheck}
            disabled={isSubmitting}
            label="Move to Production Check"
            className="bg-violet-600 hover:bg-violet-700 text-white"
            onClick={() => onAction("productionCheck")}
          />
        )}
        {status === "PRODUCTION_CHECK" && (
          <ActionBtn
            icon={Calculator}
            disabled={isSubmitting}
            label="Move to Accounts Check"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => onAction("accountsCheck")}
          />
        )}
        {status === "ACCOUNTS_CHECK" && (
          <ActionBtn
            icon={PenLine}
            disabled={isSubmitting}
            label="Send for Crew Signature"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => onAction("pendingCrewSignature")}
          />
        )}

        {status === "SENT_TO_CREW"    && <InfoBox icon={Eye}         color="amber">Offer sent. Awaiting crew response.</InfoBox>}
        {signing.includes(status)     && <InfoBox icon={PenLine}     color="purple">Contract is in the signing workflow.</InfoBox>}
        {status === "COMPLETED"       && <InfoBox icon={CheckCircle} color="green">Contract fully signed and completed.</InfoBox>}
        {status === "CANCELLED"       && <InfoBox icon={XCircle}     color="red">This offer has been cancelled.</InfoBox>}

        {[
          "DRAFT", "SENT_TO_CREW", "NEEDS_REVISION", "CREW_ACCEPTED",
          "PRODUCTION_CHECK", "ACCOUNTS_CHECK", "PENDING_CREW_SIGNATURE",
        ].includes(status) && (
          <div className="pt-1 border-t mt-2">
            <ActionBtn
              icon={Trash2}
              disabled={isSubmitting}
              label="Cancel Offer"
              className="text-destructive border border-destructive/30 bg-transparent hover:bg-destructive/5"
              onClick={() => onAction("cancel")}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CrewPanel({ offer, onAction, isSubmitting, onSign }) {
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
            <InfoBox icon={Eye} color="blue">
              Please review the contract and either accept or request changes.
            </InfoBox>
            <ActionBtn
              icon={CheckCircle}
              disabled={isSubmitting}
              label="Accept Offer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onAction("openAccept")}
            />
            <ActionBtn
              icon={MessageSquare}
              disabled={isSubmitting}
              label="Request Changes"
              className="border border-red-300 text-red-700 bg-transparent hover:bg-red-50"
              onClick={() => onAction("openRequestChanges")}
            />
          </>
        )}

        {status === "CREW_ACCEPTED" && (
          <InfoBox icon={CheckCircle} color="green">
            You accepted this offer. Production is reviewing.
          </InfoBox>
        )}

        {status === "PENDING_CREW_SIGNATURE" && (
          <ActionBtn
            icon={PenLine}
            disabled={isSubmitting}
            label="Sign Contract"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => onSign("CREW")}
          />
        )}

        {["PENDING_UPM_SIGNATURE", "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE"].includes(status) && (
          <>
            <InfoBox icon={PenLine} color="purple">
              You have signed. Awaiting further approvals.
            </InfoBox>
            {status === "PENDING_UPM_SIGNATURE" && (
              <ActionBtn
                icon={Users}
                label="Switch to UPM to Sign"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isSubmitting}
                onClick={() => onAction("switchToUPM")}
              />
            )}
            {status === "PENDING_FC_SIGNATURE" && (
              <ActionBtn
                icon={Users}
                label="Switch to FC to Sign"
                className="bg-pink-600 hover:bg-pink-700 text-white"
                disabled={isSubmitting}
                onClick={() => onAction("switchToFC")}
              />
            )}
            {status === "PENDING_STUDIO_SIGNATURE" && (
              <ActionBtn
                icon={Users}
                label="Switch to Studio to Sign"
                className="bg-violet-600 hover:bg-violet-700 text-white"
                disabled={isSubmitting}
                onClick={() => onAction("switchToSTUDIO")}
              />
            )}
          </>
        )}

        {status === "COMPLETED"  && <InfoBox icon={CheckCircle} color="green">Contract fully executed. Welcome to the production!</InfoBox>}
        {status === "DRAFT"      && <InfoBox icon={Eye} color="gray">This offer has not been sent to you yet.</InfoBox>}
        {status === "CANCELLED"  && <InfoBox icon={XCircle} color="red">This offer has been cancelled.</InfoBox>}
        {["PRODUCTION_CHECK", "ACCOUNTS_CHECK"].includes(status) && (
          <InfoBox icon={ClipboardCheck} color="blue">Your offer is being reviewed internally.</InfoBox>
        )}
      </CardContent>
    </Card>
  );
}

function SignatoryPanel({ offer, role, isSubmitting, onSign }) {
  const cfg    = SIGN_ROLE_MAP[role];
  const status = offer?.status;
  const signingStatuses = [
    "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE",   "PENDING_STUDIO_SIGNATURE", "COMPLETED",
  ];

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
          <h3 className="text-sm font-semibold">{cfg.label}</h3>
        </div>

        {status === cfg.requiredStatus && (
          <>
            <InfoBox icon={PenLine} color="purple">Your signature is required to proceed.</InfoBox>
            <ActionBtn
              icon={PenLine}
              disabled={isSubmitting}
              label={`Sign as ${role}`}
              className={`${cfg.color} text-white`}
              onClick={() => onSign(role)}
            />
          </>
        )}

        {signingStatuses.includes(status) && status !== cfg.requiredStatus && status !== "COMPLETED" && (
          <InfoBox icon={Eye} color="gray">
            {signingStatuses.indexOf(status) < signingStatuses.indexOf(cfg.requiredStatus)
              ? "Not yet your turn to sign."
              : "You have signed. Awaiting further approvals."}
          </InfoBox>
        )}

        {status === "COMPLETED" && (
          <InfoBox icon={CheckCircle} color="green">Contract completed and locked.</InfoBox>
        )}

        {!signingStatuses.includes(status) && (
          <InfoBox icon={Eye} color="gray">No action required at this stage.</InfoBox>
        )}
      </CardContent>
    </Card>
  );
}

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
            <InfoBox icon={Calculator} color="blue">
              Review rates and budget codes, then approve.
            </InfoBox>
            <ActionBtn
              icon={PenLine}
              disabled={isSubmitting}
              label="Approve and Send for Signature"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => onAction("pendingCrewSignature")}
            />
          </>
        )}

        {status !== "ACCOUNTS_CHECK" && (
          <InfoBox icon={Eye} color="gray">
            {status === "COMPLETED"
              ? "Contract completed."
              : status === "CANCELLED"
              ? "Offer was cancelled."
              : "No action required at this stage."}
          </InfoBox>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ViewOffer() {
  const { id, projectName } = useParams();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();

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

  const [dialog,    setDialog]    = useState(null);
  const [signRole,  setSignRole]  = useState(null);
  const [activeTab, setActiveTab] = useState("preview");

  const proj = projectName || "demo-project";

  // ── Load offer on mount ────────────────────────────────────────────────────
  useEffect(() => {
    if (id) dispatch(getOfferThunk(id));
  }, [id, dispatch]);

  // ── Mark viewed when crew opens a sent offer ───────────────────────────────
  useEffect(() => {
    if (offer?._id && viewRole === "CREW" && offer.status === "SENT_TO_CREW") {
      dispatch(markViewedThunk(offer._id));
    }
  }, [offer?._id, viewRole, offer?.status, dispatch]);

  // ── Load signing status + preview when contractId is known ────────────────
  useEffect(() => {
    if (!contractId) return;
    dispatch(getSigningStatusThunk(contractId));
    dispatch(getContractPreviewThunk(contractId));
  }, [contractId, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Refresh preview after each signing step ────────────────────────────────
  const prevSignStatusRef = useRef(null);
  useEffect(() => {
    const curr = signingStatus?.currentStatus;
    if (!contractId || !curr) return;
    if (prevSignStatusRef.current && prevSignStatusRef.current !== curr) {
      dispatch(clearContractPreview());
      dispatch(getContractPreviewThunk(contractId));
    }
    prevSignStatusRef.current = curr;
  }, [signingStatus?.currentStatus, contractId, dispatch]);

  // ── Surface API errors as toasts ──────────────────────────────────────────
  useEffect(() => {
    if (apiError) {
      const msg = apiError.errors?.length
        ? apiError.errors.map((e) => e.message).join(" · ")
        : apiError.message || "Something went wrong";
      toast.error(msg);
      dispatch(clearOfferError());
    }
  }, [apiError, dispatch]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const contractData    = useMemo(() => offerToContractData(offer), [offer]);
  const allowances      = useMemo(() => offerToAllowances(offer),   [offer]);
  const calculatedRates = useMemo(() => {
    const fee = parseFloat(contractData.feePerDay) || 0;
    return calculateRates(fee, defaultEngineSettings);
  }, [contractData.feePerDay]);

  // ── Action handler ────────────────────────────────────────────────────────
  const handleAction = async (action, payload = {}) => {
    const offerId = offer?._id;
    if (!offerId) return;

    // UI-only transitions
    if (action === "openAccept")         { setDialog("acceptOffer");        return; }
    if (action === "openRequestChanges") { setDialog("requestChanges");     return; }
    if (action === "switchToUPM")        { dispatch(setViewRole("UPM"));    return; }
    if (action === "switchToFC")         { dispatch(setViewRole("FC"));     return; }
    if (action === "switchToSTUDIO")     { dispatch(setViewRole("STUDIO")); return; }

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
      default:
        toast.dismiss("va");
        return;
    }

    toast.dismiss("va");

    if (!result.error) {
      const msgs = {
        sendToCrew:           "Sent to crew!",
        accept:               "Offer accepted!",
        requestChanges:       "Change request submitted!",
        cancel:               "Offer cancelled.",
        productionCheck:      "Moved to Production Check",
        accountsCheck:        "Moved to Accounts Check",
        pendingCrewSignature: "Sent for crew signature",
      };
      toast.success(msgs[action] || "Done");

      const freshOfferResult = await dispatch(getOfferThunk(offerId));
      const freshContractId  = freshOfferResult.payload?.contractId ?? contractId;

      if (freshContractId) {
        dispatch(getSigningStatusThunk(freshContractId));
        dispatch(clearContractPreview());
        dispatch(getContractPreviewThunk(freshContractId));
      }
    }
  };

  // ── Sign handler ──────────────────────────────────────────────────────────
  const handleSign = useCallback((role) => setSignRole(role), []);

  const handleSignConfirm = async (dataUrl) => {
    if (!contractId || !signRole) return;
    const { thunk } = SIGN_ROLE_MAP[signRole];
    const result = await dispatch(thunk({ contractId, signature: dataUrl }));
    if (!result.error) {
      toast.success(`${signRole} signature recorded!`);
      await dispatch(getOfferThunk(offer._id));
      await dispatch(getSigningStatusThunk(contractId));
      dispatch(clearContractPreview());
      dispatch(getContractPreviewThunk(contractId));
    } else {
      toast.error(result.payload?.message || "Failed to sign");
    }
    setSignRole(null);
  };

  // ── PDF download ──────────────────────────────────────────────────────────
  const handleDownloadPdf = async () => {
    if (!contractId) return;
    if (contractPdfUrl) { window.open(contractPdfUrl, "_blank"); return; }
    const result = await dispatch(getContractPdfUrlThunk(contractId));
    if (!result.error && result.payload?.url) window.open(result.payload.url, "_blank");
    else toast.error("Could not get PDF download link");
  };

  // ── Dialog confirm ────────────────────────────────────────────────────────
  const handleDialogConfirm = async (payload) => {
    const action = dialog === "acceptOffer" ? "accept" : "requestChanges";
    setDialog(null);
    await handleAction(action, payload);
  };

  // ── Right panel by role ───────────────────────────────────────────────────
  const renderRightPanel = () => {
    const props = { offer, isSubmitting, onAction: handleAction, onSign: handleSign };
    switch (viewRole) {
      case "PRODUCTION_ADMIN":
      case "SUPER_ADMIN":    return <ProductionAdminPanel {...props} />;
      case "CREW":           return <CrewPanel {...props} />;
      case "ACCOUNTS_ADMIN": return <AccountsPanel {...props} />;
      case "UPM":            return <SignatoryPanel {...props} role="UPM" />;
      case "FC":             return <SignatoryPanel {...props} role="FC" />;
      case "STUDIO":         return <SignatoryPanel {...props} role="STUDIO" />;
      default:               return null;
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
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

  // ── Not found ─────────────────────────────────────────────────────────────
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

  const tl     = offer?.timeline || {};
  const hasPdf = !!(signingStatus?.pdfS3Key);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <div className="py-5 space-y-4">

        {/* ── Top bar: back / role switcher / actions ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/projects/${proj}/offers`)}
            className="gap-2 text-muted-foreground hover:text-foreground shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <RoleSwitcher viewRole={viewRole} onChange={(r) => dispatch(setViewRole(r))} />

          <div className="flex items-center gap-2 shrink-0">
            {offer?.offerCode && (
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
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
              onClick={async () => {
                const freshOfferResult = await dispatch(getOfferThunk(id));
                const freshContractId  = freshOfferResult.payload?.contractId ?? contractId;
                if (freshContractId) {
                  dispatch(getSigningStatusThunk(freshContractId));
                  dispatch(clearContractPreview());
                  dispatch(getContractPreviewThunk(freshContractId));
                }
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* ── Status progress bar ── */}
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

        {/* ── Tab switcher (above both columns) ── */}
        <div className="flex gap-1">
          {[
            { key: "preview", label: "Contract Preview", icon: FileText },
            { key: "offer",   label: "Offer Details",    icon: Users    },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${activeTab === key
                  ? "bg-purple-600 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Main grid: content + sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">

          {/* Left: preview or offer details */}
          <div>
            {activeTab === "preview" && (
              <ContractPreviewIframe preview={previewHtml} isLoading={isLoadingPrev} />
            )}

            {activeTab === "offer" && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <CreateOfferLayout
                    data={contractData}
                    offer={offer}
                    activeField={null}
                    calculatedRates={calculatedRates}
                    engineSettings={defaultEngineSettings}
                    salaryBudgetCodes={offer?.salaryBudgetCodes     || []}
                    setSalaryBudgetCodes={() => {}}
                    salaryTags={offer?.salaryTags                   || []}
                    setSalaryTags={() => {}}
                    overtimeBudgetCodes={offer?.overtimeBudgetCodes || []}
                    setOvertimeBudgetCodes={() => {}}
                    overtimeTags={offer?.overtimeTags               || []}
                    setOvertimeTags={() => {}}
                    allowances={allowances}
                    hideOfferSections={false}
                    hideContractDocument={false}
                    isDocumentLocked={offer?.status === "COMPLETED"}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right sidebar — always visible */}
          <div className="space-y-3">
            <OfferSummaryCard offer={offer} />
            {renderRightPanel()}
            <SigningProgressCard signingStatus={signingStatus} />
            <TimelineCard offer={offer} />
          </div>
        </div>

      </div>

      {/* ── Dialogs ── */}
      {dialog === "acceptOffer" && (
        <OfferActionDialog
          type="acceptOffer"
          offer={offer}
          open
          onConfirm={handleDialogConfirm}
          onClose={() => setDialog(null)}
          isLoading={isSubmitting}
        />
      )}
      {dialog === "requestChanges" && (
        <OfferActionDialog
          type="requestChanges"
          offer={offer}
          open
          onConfirm={handleDialogConfirm}
          onClose={() => setDialog(null)}
          isLoading={isSubmitting}
        />
      )}

      {signRole && (
        <SignDialog
          open={!!signRole}
          onOpenChange={(o) => { if (!o) setSignRole(null); }}
          roleName={SIGN_ROLE_MAP[signRole]?.label || signRole}
          offerCode={offer?.offerCode}
          onSign={handleSignConfirm}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}