/**
 * ViewOffer.jsx
 *
 * Fully connected to real backend via Redux + offer.slice.
 *
 * - Loads offer from backend on mount (via getOfferThunk)
 * - Marks offer as viewed automatically when CREW opens a SENT_TO_CREW offer
 * - Renders role-specific action buttons based on viewRole from Redux
 * - Shows change requests panel when offer is in NEEDS_REVISION
 *
 * Place at: src/features/crew/pages/ViewOffer.jsx
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../../shared/components/ui/button";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Badge } from "../../../shared/components/ui/badge";
import { ArrowLeft, Download, Loader2, AlertTriangle, RefreshCw } from "lucide-react";

// Store
import {
  getOfferThunk,
  markViewedThunk,
  getChangeRequestsThunk,
  resolveChangeRequestThunk,
  selectCurrentOffer,
  selectOfferLoading,
  selectChangeRequests,
  selectSubmitting,
  selectOfferError,
  clearOfferError,
  clearCurrentOffer,
} from "../store/offer.slice";
import { selectViewRole, setViewRole } from "../store/viewrole.slice";

// Sub-components
import OfferStatusProgress from "../components/viewoffer/OfferStatusProgress";
import OfferDocuments from "../components/viewoffer/OfferDocuments";
import OfferDetailsCards from "../components/viewoffer/OfferDetailsCards";
import OfferCompensation from "../components/viewoffer/OfferCompensation";

// Role actions
import ProductionAdminActions from "../components/roleActions/ProductionAdminActions/createoffer/ProductionadminActions";
import CrewActions from "../components/roleActions/CrewActions/CrewActions";
import AccountsAdminActions from "../components/roleActions/AccountsAdminActions/AccountsAdminActions";
import UpmActions from "../components/roleActions/UpmActions/UpmActions";
import FcActions from "../components/roleActions/FcActions.jsx/FcActions";
import StudioActions from "../components/roleActions/StudioActions/StudioActions";

// ─── Available demo roles ──────────────────────────────────────────────────────

const DEMO_ROLES = [
  { value: "PRODUCTION_ADMIN", label: "Production Admin" },
  { value: "CREW",             label: "Crew" },
  { value: "ACCOUNTS_ADMIN",   label: "Accounts Admin" },
  { value: "UPM",              label: "UPM" },
  { value: "FC",               label: "FC" },
  { value: "STUDIO",           label: "Studio" },
  { value: "SUPER_ADMIN",      label: "Super Admin" },
];

// ─── Role action renderer ──────────────────────────────────────────────────────

function RoleActions({ offer, viewRole, onEdit }) {
  switch (viewRole) {
    case "PRODUCTION_ADMIN":
    case "SUPER_ADMIN":
      return <ProductionAdminActions offer={offer} onEdit={onEdit} />;
    case "CREW":
      return <CrewActions offer={offer} />;
    case "ACCOUNTS_ADMIN":
      return <AccountsAdminActions offer={offer} />;
    case "UPM":
      return <UpmActions offer={offer} />;
    case "FC":
      return <FcActions offer={offer} />;
    case "STUDIO":
      return <StudioActions offer={offer} />;
    default:
      return null;
  }
}

// ─── Change requests panel ────────────────────────────────────────────────────

function ChangeRequestsPanel({ offerId, changeRequests, viewRole }) {
  const dispatch = useDispatch();
  const isSubmitting = useSelector(selectSubmitting);
  const [resolveForm, setResolveForm] = useState({ id: null, notes: "" });

  const handleResolve = async (changeRequestId, status) => {
    const result = await dispatch(
      resolveChangeRequestThunk({
        offerId,
        changeRequestId,
        status,
        notes: resolveForm.id === changeRequestId ? resolveForm.notes : "",
      })
    );
    if (resolveChangeRequestThunk.fulfilled.match(result)) {
      toast.success(`Change request ${status.toLowerCase()}`);
      setResolveForm({ id: null, notes: "" });
    } else {
      toast.error("Failed to resolve change request");
    }
  };

  if (!changeRequests?.length) return null;

  return (
    <Card className="border border-amber-200 bg-amber-50/50 dark:border-amber-800/40 dark:bg-amber-900/10 shadow-sm">
      <div className="px-4 py-3 border-b border-amber-200 dark:border-amber-800/40 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300">
          Change Requests ({changeRequests.length})
        </h3>
      </div>
      <CardContent className="p-4 space-y-3">
        {changeRequests.map((cr) => (
          <div key={cr._id} className="bg-white dark:bg-gray-900 rounded-lg border p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="secondary"
                    className={
                      cr.status === "PENDING"
                        ? "bg-amber-100 text-amber-700 text-[10px]"
                        : cr.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-700 text-[10px]"
                        : "bg-red-100 text-red-700 text-[10px]"
                    }
                  >
                    {cr.status}
                  </Badge>
                  {cr.fieldName && (
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                      {cr.fieldName}
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground">{cr.reason}</p>
                {cr.currentValue && cr.requestedValue && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {cr.currentValue} → <span className="font-semibold text-primary">{cr.requestedValue}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Resolve controls — only PRODUCTION_ADMIN sees these */}
            {cr.status === "PENDING" && (viewRole === "PRODUCTION_ADMIN" || viewRole === "SUPER_ADMIN") && (
              <div className="pt-2 border-t space-y-2">
                {resolveForm.id === cr._id && (
                  <textarea
                    value={resolveForm.notes}
                    onChange={(e) => setResolveForm((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Resolution notes (optional)..."
                    className="w-full border rounded px-2 py-1.5 text-xs min-h-[50px] resize-none"
                  />
                )}
                <div className="flex gap-2">
                  {resolveForm.id !== cr._id && (
                    <button
                      onClick={() => setResolveForm({ id: cr._id, notes: "" })}
                      className="text-[10px] text-muted-foreground underline"
                    >
                      Add notes
                    </button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleResolve(cr._id, "APPROVED")}
                    disabled={isSubmitting}
                    className="h-6 px-3 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white ml-auto"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolve(cr._id, "REJECTED")}
                    disabled={isSubmitting}
                    className="h-6 px-3 text-[10px] text-destructive border-destructive/40 hover:bg-destructive/10"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Main ViewOffer component ─────────────────────────────────────────────────

export default function ViewOffer() {
const params = useParams();
const offerId = params.offerId || params.id;// route: /offers/:offerId  (or adjust to your router)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const offer         = useSelector(selectCurrentOffer);
  const isLoading     = useSelector(selectOfferLoading);
  const error         = useSelector(selectOfferError);
  const changeRequests = useSelector(selectChangeRequests);
  const viewRole      = useSelector(selectViewRole);

  // Edit mode state (local — no server call until save)
  const [isEditMode, setIsEditMode]     = useState(false);
  const [editedOffer, setEditedOffer]   = useState(null);

  // ── Load offer on mount ───────────────────────────────────────────────────

  useEffect(() => {
    if (!offerId) return;
    dispatch(clearOfferError());
    dispatch(getOfferThunk(offerId));
  }, [offerId, dispatch]);

  // ── Auto-mark viewed when CREW opens a SENT_TO_CREW offer ─────────────────

  useEffect(() => {
    if (!offer) return;
    if (viewRole === "CREW" && offer.status === "SENT_TO_CREW" && !offer.timeline?.crewViewedAt) {
      dispatch(markViewedThunk(offer._id));
    }
  }, [offer, viewRole, dispatch]);

  // ── Load change requests when offer enters NEEDS_REVISION ─────────────────

  useEffect(() => {
    if (offer?.status === "NEEDS_REVISION" || offer?.status === "CREW_ACCEPTED") {
      dispatch(getChangeRequestsThunk(offer._id));
    }
  }, [offer?.status, offer?._id, dispatch]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────

  useEffect(() => () => { dispatch(clearCurrentOffer()); }, [dispatch]);

  // ── Edit handlers ─────────────────────────────────────────────────────────

  const handleEdit = () => {
    setEditedOffer(JSON.parse(JSON.stringify(offer)));
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditedOffer(null);
    setIsEditMode(false);
  };

  // ── Role switcher ─────────────────────────────────────────────────────────

  const handleRoleChange = (newRole) => {
    dispatch(setViewRole(newRole));
    // Refetch with new role header
    if (offerId) dispatch(getOfferThunk(offerId));
  };

  // ── Download (placeholder) ────────────────────────────────────────────────

  const handleDownload = (docId) => {
    toast.info(`Downloading ${docId}...`);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render states
  // ─────────────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading offer...</p>
        </div>
      </div>
    );
  }

  if (error && !offer) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">{error.message || "Failed to load offer"}</p>
          <Button size="sm" variant="outline" onClick={() => dispatch(getOfferThunk(offerId))}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!offer) return null;

  const displayOffer  = editedOffer || offer;
  const primaryRole   = displayOffer.roles?.find((r) => r.isPrimary) || displayOffer.roles?.[0] || {};

  return (
    <div>
      <div className="container mx-auto p-6 space-y-4">

        {/* ── Demo Role Switcher ── */}
        <Card className="border shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-1">
                  View As Role (Demo)
                </label>
                <select
                  value={viewRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  disabled={isEditMode}
                  className="w-full border rounded-md px-2 py-1.5 text-sm"
                >
                  {DEMO_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-1">
                  Offer Status
                </label>
                <div className="flex items-center gap-2 h-8">
                  <Badge
                    variant="secondary"
                    className="text-xs font-bold"
                  >
                    {offer.status?.replace(/_/g, " ")}
                  </Badge>
                  {offer.offerCode && (
                    <span className="text-xs font-mono text-muted-foreground">{offer.offerCode}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-3 h-3 mr-1" /> Offers
              </Button>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2 flex-wrap">
              {isEditMode && (
                <Badge variant="secondary" className="text-xs">EDITING</Badge>
              )}
              {displayOffer.recipient?.fullName || displayOffer.fullName || "—"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {primaryRole?.jobRoleId?.name || primaryRole?.customRoleName || primaryRole?.jobTitle || "—"}
              {(primaryRole?.jobDepartmentId?.name || primaryRole?.department) && (
                <> • {primaryRole?.jobDepartmentId?.name || primaryRole?.department}</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {offer.status === "COMPLETED" && (
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Download Contract
              </Button>
            )}

            {/* Role-based action buttons */}
            {!isEditMode && (
              <RoleActions
                offer={offer}
                viewRole={viewRole}
                onEdit={handleEdit}
              />
            )}

            {/* Edit mode controls */}
            {isEditMode && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    // TODO: dispatch updateOfferThunk when implemented
                    toast.info("Save offer edit — connect to your update endpoint");
                    setIsEditMode(false);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ── Status Progress ── */}
        <OfferStatusProgress
          status={offer.status}
          sentToCrewAt={offer.timeline?.sentToCrewAt}
          updatedAt={offer.updatedAt}
          crewAcceptedAt={offer.timeline?.crewAcceptedAt}
          productionCheckCompletedAt={offer.timeline?.productionCheckCompletedAt}
          accountsCheckCompletedAt={offer.timeline?.accountsCheckCompletedAt}
          crewSignedAt={offer.timeline?.crewSignedAt}
          upmSignedAt={offer.timeline?.upmSignedAt}
          fcSignedAt={offer.timeline?.fcSignedAt}
          studioSignedAt={offer.timeline?.studioSignedAt}
        />

        {/* ── Change Requests (shown when relevant) ── */}
        {(offer.status === "NEEDS_REVISION" || changeRequests?.length > 0) && (
          <ChangeRequestsPanel
            offerId={offer._id}
            changeRequests={changeRequests}
            viewRole={viewRole}
          />
        )}

        {/* ── Documents ── */}
        <OfferDocuments
          documents={["passport", "right_to_work", "employment_contract", "tax_forms", "bank_details", "nda"]}
          onDownload={handleDownload}
        />

        {/* ── Offer Details ── */}
        <OfferDetailsCards
          offer={{
            // Normalize backend shape → component shape
            fullName:              displayOffer.recipient?.fullName  || displayOffer.fullName,
            email:                 displayOffer.recipient?.email     || displayOffer.email,
            mobileNumber:          displayOffer.recipient?.mobileNumber || displayOffer.mobileNumber,
            isViaAgent:            displayOffer.representation?.isViaAgent,
            agentName:             displayOffer.representation?.agentName,
            agentEmailAddress:     displayOffer.representation?.agentEmail,
            alternativeContractType: displayOffer.roles?.[0]?.alternativeContractType,
            allowAsSelfEmployedOrLoanOut: displayOffer.taxStatus?.allowsSelfEmployedOrLoanOut ? "YES" : "NO",
            statusDeterminationReason: displayOffer.taxStatus?.reason,
            otherStatusDeterminationReason: displayOffer.taxStatus?.otherReason,
            productionName:        displayOffer.productionName,
            productionType:        displayOffer.productionType,
            studioCompany:         displayOffer.studioCompany,
            shootDuration:         displayOffer.shootDuration,
            otherDealProvisions:   displayOffer.notes?.otherDealProvisions,
            additionalNotes:       displayOffer.notes?.additionalNotes,
          }}
          primaryRole={{
            // Normalize role shape
            unit:                    primaryRole?.unit,
            department:              primaryRole?.jobDepartmentId?.name || primaryRole?.customDepartmentName,
            subDepartment:           primaryRole?.subDepartment,
            jobTitle:                primaryRole?.jobRoleId?.name || primaryRole?.customRoleName,
            jobTitleSuffix:          primaryRole?.roleNameSuffix,
            regularSiteOfWork:       primaryRole?.regularSiteOfWork,
            engagementType:          primaryRole?.engagementType,
            startDate:               primaryRole?.startDate,
            endDate:                 primaryRole?.endDate,
            dailyOrWeeklyEngagement: primaryRole?.rateType,
            workingWeek:             primaryRole?.workingWeek,
            shiftHours:              primaryRole?.standardWorkingHour,
          }}
          isEditing={isEditMode}
          onUpdate={(updates) => setEditedOffer((prev) => ({ ...prev, ...updates }))}
        />

        {/* ── Compensation ── */}
        <OfferCompensation
          primaryRole={{
            contractRate:    primaryRole?.salary?.base?.amount,
            budgetCode:      primaryRole?.salary?.budgetCode,
            allowances: {
              boxRental:                    primaryRole?.allowances?.find(a => a.type === "BOX_RENTAL")?.enabled,
              boxRentalFeePerWeek:          primaryRole?.allowances?.find(a => a.type === "BOX_RENTAL")?.rate?.amount,
              boxRentalBudgetCode:          primaryRole?.allowances?.find(a => a.type === "BOX_RENTAL")?.budgetCode,
              computerAllowance:            primaryRole?.allowances?.find(a => a.type === "COMPUTER")?.enabled,
              computerAllowanceFeePerWeek:  primaryRole?.allowances?.find(a => a.type === "COMPUTER")?.rate?.amount,
              computerAllowanceBudgetCode:  primaryRole?.allowances?.find(a => a.type === "COMPUTER")?.budgetCode,
              vehicleAllowance:             primaryRole?.allowances?.find(a => a.type === "VEHICLE")?.enabled,
              vehicleAllowanceFeePerWeek:   primaryRole?.allowances?.find(a => a.type === "VEHICLE")?.rate?.amount,
              vehicleAllowanceBudgetCode:   primaryRole?.allowances?.find(a => a.type === "VEHICLE")?.budgetCode,
            },
            customOvertimeRates: {
              sixthDayHourlyRate:    primaryRole?.salary?.specialDays?.find(d => d.type === "SIXTH_DAY")?.amount,
              seventhDayHourlyRate:  primaryRole?.salary?.specialDays?.find(d => d.type === "SEVENTH_DAY")?.amount,
            },
          }}
          isEditing={isEditMode}
          onUpdate={(updates) => setEditedOffer((prev) => ({
            ...prev,
            roles: [{ ...(prev.roles?.[0] || {}), ...updates }],
          }))}
        />

      </div>
    </div>
  );
}