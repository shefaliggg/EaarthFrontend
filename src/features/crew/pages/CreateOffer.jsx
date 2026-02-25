/**
 * CreateOfferPage.jsx
 *
 * Connected to real backend via createOfferThunk.
 *
 * Flow:
 *   1. User fills form (local state only — never in Redux while typing)
 *   2. "Save Draft" → POST /offers → stays on page with draft offer
 *   3. "Send Offer"  → POST /offers → PATCH /:id/send → success → navigate back
 *   4. "Preview"     → renders PDF-style preview dialog (local only)
 *
 * Form data shape is transformed to match your backend's validateCreateOffer:
 *   {
 *     studioId, projectId,
 *     recipient: { fullName, email, mobileNumber },
 *     representation: { isViaAgent, agentName, agentEmail },
 *     taxStatus: { allowsSelfEmployedOrLoanOut, reason, otherReason },
 *     roles: [ { engagementType, rateType, startDate, endDate, salary: { base: { amount, currency } }, allowances: [...] } ]
 *   }
 *
 * Place at: src/features/crew/pages/CreateOfferPage.jsx
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../../../shared/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "../../../shared/components/ui/dialog";
import { ScrollArea } from "../../../shared/components/ui/scroll-area";
import { ArrowLeft, Save, Send, Eye, CheckCircle, Loader2 } from "lucide-react";

import CreateOfferForm from "../components/roleActions/ProductionAdminActions/createoffer/Createofferform";
import {
  createDefaultRole,
  createDefaultFormData,
  getCurrencySymbol,
} from "../components/roleActions/ProductionAdminActions/createoffer/Constants";

import {
  createOfferThunk,
  sendToCrewThunk,
  clearOfferError,
} from "../store/offer.slice";

// ─── Safe selectors with fallbacks ───────────────────────────────────────────
// Guards against the offers slice not being registered in store yet
const selectIsSubmitting = (state) => state?.offers?.isSubmitting ?? false;
const selectApiError     = (state) => state?.offers?.error ?? null;

// ─── Transform frontend form state → backend payload ─────────────────────────

const buildPayload = (formData, roles, studioId, projectId) => {
  const mapAllowances = (allowances) => {
    const result = [];

    const add = (type, enabled, rateAmount, rateCurrency = "GBP") => {
      if (enabled && rateAmount) {
        result.push({
          type,
          enabled: true,
          rate: { amount: parseFloat(rateAmount) || 0, unit: "WEEKLY" },
          currency: rateCurrency,
        });
      }
    };

    add("BOX_RENTAL",        allowances.boxRental,          allowances.boxRentalFeePerWeek);
    add("COMPUTER",          allowances.computerAllowance,  allowances.computerAllowanceFeePerWeek);
    add("SOFTWARE",          allowances.softwareAllowance,  allowances.softwareAllowanceFeePerWeek);
    add("EQUIPMENT_RENTAL",  allowances.equipmentRental,    allowances.equipmentRentalFeePerWeek);
    add("MOBILE_PHONE",      allowances.mobilePhoneAllowance, allowances.mobilePhoneAllowanceFeePerWeek);
    add("VEHICLE",           allowances.vehicleAllowance,   allowances.vehicleAllowanceFeePerWeek);
    add("PER_DIEM",          allowances.perDiem1,           allowances.perDiem1ShootDayRate, allowances.perDiem1Currency);
    add("LIVING",            allowances.livingAllowance,    allowances.livingAllowanceWeeklyRate, allowances.livingAllowanceCurrency);

    return result;
  };

  const mappedRoles = roles.map((role) => ({
    isPrimary:           role.isPrimaryRole,
    engagementType:      role.engagementType || "PAYE",
    rateType:            role.rateType || "DAILY",
    startDate:           role.startDate,
    endDate:             role.endDate,
    workingWeek:         role.workingWeek || undefined,
    standardWorkingHour: role.shiftHours ? Number(role.shiftHours) : 10,
    customDepartmentName: role.department || undefined,
    customRoleName:       role.jobTitle || undefined,
    roleNameSuffix:       role.jobTitleSuffix || undefined,
    unit:                 role.unit || undefined,
    subDepartment:        role.subDepartment || undefined,
    regularSiteOfWork:    role.regularSiteOfWork || undefined,
    salary: {
      base: {
        amount:   parseFloat(role.rateType === "WEEKLY" ? role.feePerWeek : role.feePerDay) || 0,
        currency: role.currency || "GBP",
        isHolidayPayInclusive: false,
      },
      specialDays: (role.specialDayRates || [])
        .filter((d) => d.amount)
        .map((d) => ({ type: d.type, amount: parseFloat(d.amount), unit: d.unit || "DAILY" })),
      budgetCode: role.budgetCode || undefined,
    },
    allowances: mapAllowances(role.allowances || {}),
  }));

  return {
    studioId:   studioId  || "REPLACE_WITH_REAL_STUDIO_ID",
    projectId:  projectId || "REPLACE_WITH_REAL_PROJECT_ID",
    recipient: {
      fullName:     formData.fullName,
      email:        formData.emailAddress,
      mobileNumber: formData.mobileNumber || undefined,
      isLivingInUk: formData.isLivingInUk,
    },
    representation: {
      isViaAgent: formData.isViaAgent || false,
      agentName:  formData.agentName  || undefined,
      agentEmail: formData.agentEmailAddress || undefined,
    },
    taxStatus: {
      allowsSelfEmployedOrLoanOut: formData.allowAsSelfEmployedOrLoanOut === "YES",
      reason:      formData.statusDeterminationReason  || undefined,
      otherReason: formData.otherStatusDeterminationReason || undefined,
    },
    roles: mappedRoles,
    notes: {
      otherDealProvisions: formData.otherDealProvisions || undefined,
      additionalNotes:     formData.additionalNotes     || undefined,
    },
  };
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function CreateOfferPage() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  // Route params — adjust to your router structure
  const { projectName, projectId, studioId } = useParams();

  const isSubmitting = useSelector(selectIsSubmitting);
  const apiError     = useSelector(selectApiError);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPreview, setShowPreview]           = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    recipient: true, taxStatus: true, roles: true, notes: true,
  });

  const [formData, setFormData] = useState(createDefaultFormData());
  const [roles,    setRoles]    = useState([createDefaultRole(0)]);

  const toggleSection = (s) =>
    setExpandedSections((p) => ({ ...p, [s]: !p[s] }));

  const primaryRole = roles.find((r) => r.isPrimaryRole) || roles[0];

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    if (!formData.fullName?.trim()) {
      toast.error("Recipient full name is required");
      return false;
    }
    if (!formData.emailAddress?.trim()) {
      toast.error("Recipient email is required");
      return false;
    }
    const primary = roles.find((r) => r.isPrimaryRole);
    if (!primary?.engagementType) {
      toast.error("Please select an Engagement Type for the primary role");
      return false;
    }
    if (!primary?.startDate) {
      toast.error("Start date is required for the primary role");
      return false;
    }
    if (!primary?.endDate) {
      toast.error("End date is required for the primary role");
      return false;
    }
    return true;
  };

  // ── Save as Draft ─────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!formData.fullName || !formData.emailAddress) {
      toast.error("Please fill in the recipient's name and email address");
      return;
    }
    dispatch(clearOfferError());
    const payload = buildPayload(formData, roles, studioId, projectId);
    const result  = await dispatch(createOfferThunk(payload));

    if (createOfferThunk.fulfilled.match(result)) {
      toast.success("Offer saved as draft");
      navigate(-1);
    } else {
      const err = result.payload;
      if (err?.errors?.length) {
        err.errors.forEach((e) => toast.error(`${e.field}: ${e.message}`));
      } else {
        toast.error(err?.message || "Failed to save offer");
      }
    }
  };

  // ── Create + Send ─────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!validate()) return;
    dispatch(clearOfferError());

    const payload = buildPayload(formData, roles, studioId, projectId);

    // Step 1: create as DRAFT
    const createResult = await dispatch(createOfferThunk(payload));
    if (!createOfferThunk.fulfilled.match(createResult)) {
      const err = createResult.payload;
      if (err?.errors?.length) {
        err.errors.forEach((e) => toast.error(`${e.field}: ${e.message}`));
      } else {
        toast.error(err?.message || "Failed to create offer");
      }
      return;
    }

    const newOffer = createResult.payload;

    // Step 2: immediately send to crew
    const sendResult = await dispatch(sendToCrewThunk({ offerId: newOffer._id }));
    if (sendToCrewThunk.fulfilled.match(sendResult)) {
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(-1);
      }, 3000);
    } else {
      // Offer was created but send failed — let user retry from list
      toast.warning("Offer created as draft. Please send from the offer list.");
      navigate(-1);
    }
  };

  // ── PDF Preview ───────────────────────────────────────────────────────────

  const PDFPreview = () => (
    <div className="bg-white text-black p-8 min-h-[800px]" style={{ fontFamily: "Georgia, serif" }}>
      <div className="border-b-4 border-primary pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary tracking-wider">EAARTH PRODUCTIONS</h1>
            <p className="text-sm text-gray-600 mt-1">CREW OFFER LETTER</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Date: {new Date().toLocaleDateString("en-GB")}</p>
            <p>Reference: OFFER-{Date.now().toString().slice(-6)}</p>
          </div>
        </div>
      </div>
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b pb-2 mb-4">RECIPIENT DETAILS</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><b>Full Name:</b>  {formData.fullName || "—"}</div>
          <div><b>Email:</b>      {formData.emailAddress || "—"}</div>
          <div><b>Mobile:</b>     {formData.mobileNumber || "—"}</div>
        </div>
      </section>
      {roles.map((role, idx) => (
        <section key={role.id} className="mb-6">
          <h2 className="text-lg font-bold border-b pb-2 mb-4">
            ROLE {idx + 1}{role.isPrimaryRole ? " (PRIMARY)" : ""}: {role.jobTitle || "UNTITLED"}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><b>Department:</b>  {role.department || "—"}</div>
            <div><b>Engagement:</b>  {role.engagementType || "—"}</div>
            <div><b>Rate Type:</b>   {role.rateType || "—"}</div>
            <div><b>Start:</b>       {role.startDate || "TBC"}</div>
            <div><b>End:</b>         {role.endDate || "TBC"}</div>
            <div>
              <b>Fee:</b>{" "}
              {getCurrencySymbol(role.currency)}
              {role.rateType === "WEEKLY" ? (role.feePerWeek || "0.00") : (role.feePerDay || "0.00")}
              {" "}/ {role.rateType?.toLowerCase() || "day"}
            </div>
          </div>
        </section>
      ))}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`@media print { .print-hide { display: none !important; } }`}</style>

      <div className="container mx-auto space-y-6">

        {/* ── Sticky Header ── */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b py-3">
          <div className="flex items-center justify-between container mx-auto px-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold">CREATE NEW OFFER</h1>
                <p className="text-xs text-muted-foreground">
                  {formData.fullName || "New Recipient"}
                  {primaryRole?.jobTitle && ` — ${primaryRole.jobTitle}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="gap-2"
              >
                <Eye className="w-4 h-4" /> Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={handleSend}
                disabled={isSubmitting}
                className="gap-2 bg-primary"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Offer
              </Button>
            </div>
          </div>
        </div>

        {/* ── API validation errors banner ── */}
        {apiError?.errors?.length > 0 && (
          <div className="container mx-auto px-4">
            <div className="border border-destructive/40 bg-destructive/10 rounded-lg p-3 space-y-1">
              <p className="text-xs font-bold text-destructive uppercase">Please fix the following:</p>
              {apiError.errors.map((e, i) => (
                <p key={i} className="text-xs text-destructive">• {e.field}: {e.message}</p>
              ))}
            </div>
          </div>
        )}

        {/* ── Form ── */}
        <div className="container mx-auto px-4">
          <CreateOfferForm
            formData={formData}
            setFormData={setFormData}
            roles={roles}
            setRoles={setRoles}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        </div>
      </div>

      {/* ── Preview Dialog ── */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Offer Preview</DialogTitle>
            <DialogDescription>Tag and Budget Code are hidden in print.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <PDFPreview />
          </ScrollArea>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Success Dialog ── */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md text-center">
          <div className="py-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl mb-2">Offer Sent Successfully!</DialogTitle>
            <DialogDescription>
              Your offer has been sent to {formData.fullName}. They will receive it to review and accept.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}