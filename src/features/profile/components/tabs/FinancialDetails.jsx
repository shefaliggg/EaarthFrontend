import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableRadioField from "@/shared/components/wrappers/EditableRadioField";
import EditableDocumentField from "../../../../shared/components/wrappers/EditableDocumentField";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "../../../../shared/components/buttons/EditToggleButtons";
import ReuseDocumentPromptPanel from "../common/ReuseDocumentPromptPanel";
import ProfileCardLoadingSkelton from "../skeltons/ProfileCardLoadingSkelton";
import ProfileCardErrorSkelton from "../skeltons/ProfileCardErrorSkelton";
import {
  fetchProfileThunk,
  updateFinanceDetailsThunk,
  updatePersonalBankThunk,
} from "../../store/crew/crewProfile.thunk";
import { fetchDocumentsThunk } from "../../../user-documents/store/document.thunk";
import {
  getDisplayDocument,
  getDocumentsByType,
} from "../../../user-documents/store/document.selector";
import {
  financeDetailsSchema,
  personalBankSchema,
} from "../../config/profileValidationShemas";
import { toast } from "sonner";
import {
  MODAL_TYPES,
  useModalStore,
} from "../../../../shared/stores/useModalStore";
import { InfoPanel } from "../../../../shared/components/panels/InfoPanel";
import { XCircle } from "lucide-react";

export default function FinanceDetails() {
  const [isEditing, setIsEditing] = useState({ section: null });
  const [formState, setFormState] = useState({ finance: null, bank: null });
  const [files, setFiles] = useState({
    fs4: null,
    payslip: null,
    p45: null,
    vatCert: null,
  });
  const [initialDocIds, setInitialDocIds] = useState({
    fs4: null,
    payslip: null,
    p45: null,
    vatCert: null,
  });
  const [reuseDocIds, setReuseDocIds] = useState({
    fs4: null,
    payslip: null,
    p45: null,
    vatCert: null,
  });
  const [errors, setErrors] = useState({});
  const { openModal } = useModalStore();
  const dispatch = useDispatch();

  const { crewProfile, isFetching, isUpdating, error } = useSelector(
    (state) => state.crewProfile,
  );
  const { userDocuments, isFetching: isFetchingDocs } = useSelector(
    (state) => state.userDocuments,
  );

  useEffect(() => {
    if (!crewProfile && !isFetching) dispatch(fetchProfileThunk());
  }, [crewProfile, isFetching]);

  useEffect(() => {
    if (!userDocuments && !isFetchingDocs) dispatch(fetchDocumentsThunk());
  }, [userDocuments, isFetchingDocs]);

  const initialFilesState = {
    fs4: null,
    payslip: null,
    p45: null,
    vatCert: null,
  };
  const fin = crewProfile?.finance;
  const countryisIceland = crewProfile?.countryOfPermanentResidence === "IS";

  // ── Document pools from store ──────────────────────────────────────────────
  const fs4Docs = getDocumentsByType(userDocuments, "FS4");
  const payslipDocs = getDocumentsByType(userDocuments, "PAYSLIP");
  const p45Docs = getDocumentsByType(userDocuments, "P45");
  const vatCertDocs = getDocumentsByType(userDocuments, "VAT_CERTIFICATE");

  // ── Resolved display documents (stored id → reuse id → new file) ──────────
  const resolvedFs4 = getDisplayDocument(
    fin?.fs4DocumentId,
    reuseDocIds.fs4,
    files.fs4,
    userDocuments,
  );
  const resolvedPayslip = getDisplayDocument(
    fin?.latestPayslipId,
    reuseDocIds.payslip,
    files.payslip,
    userDocuments,
  );
  const resolvedP45 = getDisplayDocument(
    fin?.p45DocumentId,
    reuseDocIds.p45,
    files.p45,
    userDocuments,
  );
  const resolvedVatCert = getDisplayDocument(
    fin?.vatCertificateId,
    reuseDocIds.vatCert,
    files.vatCert,
    userDocuments,
  );

  const isEditingFinance = isEditing.section === "finance";
  const isEditingBank = isEditing.section === "bank";
  const isSavingFinance = isUpdating && isEditing.section === "finance";
  const isSavingBank = isUpdating && isEditing.section === "bank";

  // ── View data (edit mode uses formState, display mode uses crewProfile) ────
  const fd = isEditingFinance
    ? formState.finance
    : {
        ppsNumber: fin?.ppsNumber ?? "",
        taxClearanceAccessNumber: fin?.taxClearanceAccessNumber ?? "",
        ktNumber: fin?.ktNumber ?? "",
        nationalInsuranceNumber: fin?.nationalInsuranceNumber ?? "",
        vatNumber: fin?.vatNumber ?? "",
        utrNumber: fin?.utrNumber ?? "",
        hasOngoingStudentLoan: fin?.hasOngoingStudentLoan ?? null,
        payeStatus: fin?.payeStatus ?? null,
      };

  const bd = isEditingBank
    ? formState.bank
    : {
        bankName: fin?.personalBank?.bankName ?? "",
        branch: fin?.personalBank?.branch ?? "",
        accountName: fin?.personalBank?.accountName ?? "",
        sortCode: fin?.personalBank?.sortCode ?? "",
        accountNumber: fin?.personalBank?.accountNumber ?? "",
        iban: fin?.personalBank?.iban ?? "",
        swiftBic: fin?.personalBank?.swiftBic ?? "",
        bankNumberIceland: fin?.personalBank?.bankNumberIceland ?? "",
        bankHBIceland: fin?.personalBank?.bankHBIceland ?? "",
      };

  // ── Edit / Cancel ──────────────────────────────────────────────────────────
  const startEditing = (section) => {
    setErrors({});
    if (section === "finance") {
      setFormState((prev) => ({
        ...prev,
        finance: {
          ppsNumber: fin?.ppsNumber ?? "",
          taxClearanceAccessNumber: fin?.taxClearanceAccessNumber ?? "",
          ktNumber: fin?.ktNumber ?? "",
          nationalInsuranceNumber: fin?.nationalInsuranceNumber ?? "",
          vatNumber: fin?.vatNumber ?? "",
          utrNumber: fin?.utrNumber ?? "",
          hasOngoingStudentLoan: fin?.hasOngoingStudentLoan ?? null,
          payeStatus: fin?.payeStatus ?? null,
        },
      }));
      setFiles(initialFilesState);
      setInitialDocIds({
        fs4: fin?.fs4DocumentId ?? null,
        payslip: fin?.latestPayslipId ?? null,
        p45: fin?.p45DocumentId ?? null,
        vatCert: fin?.vatCertificateId ?? null,
      });
      setReuseDocIds({
        fs4: fin?.fs4DocumentId ?? null,
        payslip: fin?.latestPayslipId ?? null,
        p45: fin?.p45DocumentId ?? null,
        vatCert: fin?.vatCertificateId ?? null,
      });
    }
    if (section === "bank") {
      setFormState((prev) => ({
        ...prev,
        bank: {
          bankName: fin?.personalBank?.bankName ?? "",
          branch: fin?.personalBank?.branch ?? "",
          accountName: fin?.personalBank?.accountName ?? "",
          sortCode: fin?.personalBank?.sortCode ?? "",
          accountNumber: fin?.personalBank?.accountNumber ?? "",
          iban: fin?.personalBank?.iban ?? "",
          swiftBic: fin?.personalBank?.swiftBic ?? "",
          bankNumberIceland: fin?.personalBank?.bankNumberIceland ?? "",
          bankHBIceland: fin?.personalBank?.bankHBIceland ?? "",
        },
      }));
    }
    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setFormState({ finance: null, bank: null });
    setErrors({});
    setFiles(initialFilesState);
    setInitialDocIds({ fs4: null, payslip: null, p45: null, vatCert: null });
    setReuseDocIds({ fs4: null, payslip: null, p45: null, vatCert: null });
  };

  // ── Save: Finance Details ──────────────────────────────────────────────────
  const handleSaveFinance = async () => {
    setErrors({});
    const result = financeDetailsSchema.safeParse({
      ...formState.finance,
      _meta: {
        files,
        reuseDocIds,
      },
    });

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const formData = new FormData();
    const data = result.data;

    // Text fields — skip nulls
    const textFields = [
      "ppsNumber",
      "taxClearanceAccessNumber",
      "ktNumber",
      "nationalInsuranceNumber",
      "vatNumber",
      "utrNumber",
      "payeStatus",
    ];
    textFields.forEach((key) => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        formData.append(key, data[key]);
      }
    });
    // Boolean needs explicit string coercion over FormData
    if (
      data.hasOngoingStudentLoan !== null &&
      data.hasOngoingStudentLoan !== undefined
    ) {
      formData.append(
        "hasOngoingStudentLoan",
        String(data.hasOngoingStudentLoan),
      );
    }

    // Files / reuse IDs
    if (files.fs4) formData.append("fs4Document", files.fs4);
    else if (reuseDocIds.fs4) formData.append("fs4DocumentId", reuseDocIds.fs4);

    if (files.payslip) formData.append("latestPayslip", files.payslip);
    else if (reuseDocIds.payslip)
      formData.append("latestPayslipId", reuseDocIds.payslip);

    if (files.p45) formData.append("p45Document", files.p45);
    else if (reuseDocIds.p45) formData.append("p45DocumentId", reuseDocIds.p45);

    if (files.vatCert) formData.append("vatCertificate", files.vatCert);
    else if (reuseDocIds.vatCert)
      formData.append("vatCertificateId", reuseDocIds.vatCert);

    try {
      await dispatch(updateFinanceDetailsThunk(formData)).unwrap();
      toast.success("Financial details updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update financial details");
    }
  };

  // ── Save: Personal Bank ────────────────────────────────────────────────────
  const handleSaveBank = async () => {
    setErrors({});
    const result = personalBankSchema.safeParse(formState.bank);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    try {
      await dispatch(updatePersonalBankThunk(result.data)).unwrap();
      toast.success("Personal bank details updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update bank details");
    }
  };

  const handleViewDocument = ({ url, fileName, mimeType }) => {
    if (!url) return;
    if (mimeType?.startsWith("image/")) {
      openModal(MODAL_TYPES.IMAGE_PREVIEW, { imageFile: { url } });
    } else {
      openModal(MODAL_TYPES.DOCUMENT_PREVIEW, { fileUrl: url, fileName });
    }
  };

  // ── Loading / Error States ─────────────────────────────────────────────────
  if (isFetching) {
    return (
      <>
        <ProfileCardLoadingSkelton fields={8} columns={2} />
        <ProfileCardLoadingSkelton fields={9} columns={2} />
      </>
    );
  }

  if (error) {
    return (
      <ProfileCardErrorSkelton
        message={
          typeof error === "string"
            ? error
            : error?.message || "Something went wrong"
        }
        onRetry={() => dispatch(fetchProfileThunk())}
      />
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── FINANCIAL DETAILS ─────────────────────────────────────────────── */}
      <CardWrapper
        title="Financial Details"
        icon="CreditCard"
        actions={
          <EditToggleButtons
            isEditing={isEditingFinance}
            isLoading={isSavingFinance}
            onEdit={() => startEditing("finance")}
            onSave={handleSaveFinance}
            onCancel={cancelEditing}
          />
        }
      >
        <div className="space-y-6">
          {/* Tax / NI numbers */}
          {errors?.formFields && (
            <InfoPanel variant="danger" title="Missing Details" icon={XCircle}>
              {errors.formFields}
            </InfoPanel>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableTextDataField
              label="PPS NUMBER"
              value={fd?.ppsNumber}
              isEditing={isEditingFinance}
              prettify={false}
              badge="Ireland Specific"
              infoPillDescription="Used for tax and payroll purposes in Ireland. Required if you work on Irish productions."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  finance: { ...prev.finance, ppsNumber: val.toUpperCase() },
                }))
              }
              error={errors?.formFields ? " " : undefined}
              showErrorDescription={false}
              disabled={isSavingFinance}
              isRequired={false}
            />
            <EditableTextDataField
              label="TAX CLEARANCE ACCESS NUMBER"
              value={fd?.taxClearanceAccessNumber}
              isEditing={isEditingFinance}
              prettify={false}
              badge="Ireland Specific"
              infoPillDescription="Used to verify tax clearance status in Ireland. May be required for certain Irish contracts."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  finance: {
                    ...prev.finance,
                    taxClearanceAccessNumber: val.toUpperCase(),
                  },
                }))
              }
              error={errors?.formFields ? " " : undefined}
              showErrorDescription={false}
              disabled={isSavingFinance}
              isRequired={false}
            />
            <EditableTextDataField
              label="KT NUMBER"
              value={fd?.ktNumber}
              isEditing={isEditingFinance}
              prettify={false}
              badge="Iceland Specific"
              infoPillDescription="National identification number used for tax and payroll purposes in Iceland."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  finance: { ...prev.finance, ktNumber: val.toUpperCase() },
                }))
              }
              error={errors?.formFields ? " " : undefined}
              showErrorDescription={false}
              disabled={isSavingFinance}
              isRequired={false}
            />
            <EditableTextDataField
              label="NATIONAL INSURANCE NUMBER"
              value={fd?.nationalInsuranceNumber}
              isEditing={isEditingFinance}
              prettify={false}
              badge="UK PAYE"
              infoPillDescription="Used for PAYE (Pay As You Earn) contracts in the UK for tax and social security tracking."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  finance: {
                    ...prev.finance,
                    nationalInsuranceNumber: val.toUpperCase(),
                  },
                }))
              }
              error={errors?.formFields ? " " : undefined}
              showErrorDescription={false}
              disabled={isSavingFinance}
              isRequired={false}
            />
            <EditableTextDataField
              label="VAT NUMBER"
              value={fd?.vatNumber}
              isEditing={isEditingFinance}
              prettify={false}
              badge="Loan Out / Self-employed"
              infoPillDescription="Needed if you operate as a company or are VAT registered. May be required for loan-out or invoicing contracts."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  finance: { ...prev.finance, vatNumber: val },
                }))
              }
              error={errors?.formFields ? " " : undefined}
              showErrorDescription={false}
              disabled={isSavingFinance}
              isRequired={false}
            />

            <EditableTextDataField
              label="UTR NUMBER"
              value={fd?.utrNumber}
              isEditing={isEditingFinance}
              prettify={false}
              badge="UK Schedule D"
              infoPillDescription="Unique Taxpayer Reference used for self-employed (Schedule D) work in the UK. Required only for certain contract types."
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  finance: { ...prev.finance, utrNumber: val },
                }))
              }
              error={errors?.formFields ? " " : undefined}
              showErrorDescription={false}
              disabled={isSavingFinance}
              isRequired={false}
            />
          </div>

          {/* Student loan */}
          <EditableRadioField
            label="ONGOING STUDENT LOAN"
            value={fd?.hasOngoingStudentLoan}
            infoPillDescription="Do you have a student loan which is not fully repaid?"
            options={[
              { value: true, label: "YES" },
              { value: false, label: "NO" },
            ]}
            isEditing={isEditingFinance}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                finance: { ...prev.finance, hasOngoingStudentLoan: val },
              }))
            }
            disabled={isSavingFinance}
            isRequired={false}
          />

          {/* PAYE status */}
          <EditableRadioField
            label="PAYE CONTRACT STATUS"
            value={fd?.payeStatus}
            badge="UK PAYE Specific"
            infoPillDescription="Only applicable for PAYE contracts. You will be asked for this when working under PAYE payroll."
            options={[
              {
                value: "first_job_since_april",
                label:
                  "This is my first job since last 6th April. I have not been receiving taxable Jobseeker's Allowance, Employment and Support Allowance, taxable Incapacity Benefit, state or occupational pension.",
              },
              {
                value: "only_job_no_other_income",
                label:
                  "This is now my only job, but since last 6 April I have had another job, or received taxable Jobseeker's Allowance, Employment and Support Allowance or Incapacity Benefit. I do not receive a state or occupational pension.",
              },
              {
                value: "has_other_job_or_pension",
                label:
                  "I have another job or receive a state or occupational pension.",
              },
            ]}
            isEditing={isEditingFinance}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                finance: { ...prev.finance, payeStatus: val },
              }))
            }
            disabled={isSavingFinance}
            isRequired={false}
          />

          {errors?.documents && (
            <InfoPanel
              variant="danger"
              title="Missing Documents"
              icon={XCircle}
            >
              {errors.documents}
            </InfoPanel>
          )}
          {/* Tax documents */}
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <EditableDocumentField
              label="FS4 DOCUMENT"
              isEditing={isEditingFinance}
              fileName={resolvedFs4?.originalName ?? "No file uploaded"}
              fileUrl={resolvedFs4?.url ?? null}
              isUploaded={!!resolvedFs4}
              status={resolvedFs4?.verificationStatus || "Pending"}
              expiresAt={resolvedFs4?.expiresAt}
              meta={
                resolvedFs4?.sizeBytes
                  ? `${(resolvedFs4.sizeBytes / 1024 / 1024).toFixed(1)} MB`
                  : null
              }
              onUpload={(file) => {
                setFiles((f) => ({ ...f, fs4: file }));
                setReuseDocIds((f) => ({ ...f, fs4: null }));
              }}
              onRemove={() => {
                setFiles((f) => ({ ...f, fs4: null }));
              }}
              onView={(url) =>
                handleViewDocument({
                  url,
                  fileName: resolvedFs4?.originalName,
                  mimeType: resolvedFs4?.mimeType,
                })
              }
              isNewUpload={!!files.fs4}
              isRequired={false}
              error={errors?.documents}
              showErrorDescription={false}
              disabled={isSavingFinance}
              infoPillDescription="Required for certain Irish payroll setups to confirm tax registration and employment status."
              actionSlot={
                isEditingFinance &&
                fs4Docs?.length > 0 && (
                  <ReuseDocumentPromptPanel
                    label="FS4 document"
                    docs={fs4Docs}
                    selectedId={reuseDocIds.fs4}
                    docType="FS4"
                    onSelect={(id) => {
                      setReuseDocIds((prev) => ({ ...prev, fs4: id }));
                      if (id) setFiles((f) => ({ ...f, fs4: null }));
                    }}
                    disabled={isSavingFinance}
                    existingDocId={initialDocIds.fs4}
                  />
                )
              }
            />

            <EditableDocumentField
              label="LATEST PAYSLIP"
              isEditing={isEditingFinance}
              fileName={resolvedPayslip?.originalName ?? "No file uploaded"}
              fileUrl={resolvedPayslip?.url ?? null}
              isUploaded={!!resolvedPayslip}
              status={resolvedPayslip?.verificationStatus || "Pending"}
              expiresAt={resolvedPayslip?.expiresAt}
              meta={
                resolvedPayslip?.sizeBytes
                  ? `${(resolvedPayslip.sizeBytes / 1024 / 1024).toFixed(1)} MB`
                  : null
              }
              onUpload={(file) => {
                setFiles((f) => ({ ...f, payslip: file }));
                setReuseDocIds((f) => ({ ...f, payslip: null }));
              }}
              onRemove={() => {
                setFiles((f) => ({ ...f, payslip: null }));
              }}
              onView={(url) =>
                handleViewDocument({
                  url,
                  fileName: resolvedPayslip?.originalName,
                  mimeType: resolvedPayslip?.mimeType,
                })
              }
              isNewUpload={!!files.payslip}
              isRequired={false}
              error={
                errors?.payslip?.[0] || (errors?.documents ? " " : undefined)
              }
              showErrorDescription={false}
              disabled={isSavingFinance}
              infoPillDescription="Used for PAYE contracts as proof of previous employment and income."
              actionSlot={
                isEditingFinance &&
                payslipDocs?.length > 0 && (
                  <ReuseDocumentPromptPanel
                    label="payslip"
                    docs={payslipDocs}
                    selectedId={reuseDocIds.payslip}
                    docType="PAYSLIP"
                    onSelect={(id) => {
                      setReuseDocIds((prev) => ({ ...prev, payslip: id }));
                      if (id) setFiles((f) => ({ ...f, payslip: null }));
                    }}
                    disabled={isSavingFinance}
                    existingDocId={initialDocIds.payslip}
                  />
                )
              }
            />

            <EditableDocumentField
              label="P45 DOCUMENT"
              isEditing={isEditingFinance}
              fileName={resolvedP45?.originalName ?? "No file uploaded"}
              fileUrl={resolvedP45?.url ?? null}
              isUploaded={!!resolvedP45}
              status={resolvedP45?.verificationStatus || "Pending"}
              expiresAt={resolvedP45?.expiresAt}
              meta={
                resolvedP45?.sizeBytes
                  ? `${(resolvedP45.sizeBytes / 1024 / 1024).toFixed(1)} MB`
                  : null
              }
              onUpload={(file) => {
                setFiles((f) => ({ ...f, p45: file }));
                setReuseDocIds((f) => ({ ...f, p45: null }));
              }}
              onRemove={() => {
                setFiles((f) => ({ ...f, p45: null }));
              }}
              onView={(url) =>
                handleViewDocument({
                  url,
                  fileName: resolvedP45?.originalName,
                  mimeType: resolvedP45?.mimeType,
                })
              }
              isNewUpload={!!files.p45}
              isRequired={false}
              error={errors?.p45?.[0] || (errors?.documents ? " " : undefined)}
              showErrorDescription={false}
              disabled={isSavingFinance}
              infoPillDescription="Required for PAYE contracts to provide previous employment and tax details."
              actionSlot={
                isEditingFinance &&
                p45Docs?.length > 0 && (
                  <ReuseDocumentPromptPanel
                    label="P45 document"
                    docs={p45Docs}
                    selectedId={reuseDocIds.p45}
                    docType="P45"
                    onSelect={(id) => {
                      setReuseDocIds((prev) => ({ ...prev, p45: id }));
                      if (id) setFiles((f) => ({ ...f, p45: null }));
                    }}
                    disabled={isSavingFinance}
                    existingDocId={initialDocIds.p45}
                  />
                )
              }
            />

            <EditableDocumentField
              label="VAT CERTIFICATE"
              isEditing={isEditingFinance}
              fileName={resolvedVatCert?.originalName ?? "No file uploaded"}
              fileUrl={resolvedVatCert?.url ?? null}
              isUploaded={!!resolvedVatCert}
              status={resolvedVatCert?.verificationStatus || "Pending"}
              expiresAt={resolvedVatCert?.expiresAt}
              meta={
                resolvedVatCert?.sizeBytes
                  ? `${(resolvedVatCert.sizeBytes / 1024 / 1024).toFixed(1)} MB`
                  : null
              }
              onUpload={(file) => {
                setFiles((f) => ({ ...f, vatCert: file }));
                setReuseDocIds((f) => ({ ...f, vatCert: null }));
              }}
              onRemove={() => {
                setFiles((f) => ({ ...f, vatCert: null }));
              }}
              onView={(url) =>
                handleViewDocument({
                  url,
                  fileName: resolvedVatCert?.originalName,
                  mimeType: resolvedVatCert?.mimeType,
                })
              }
              isRequired={false}
              isNewUpload={!!files.vatCert}
              error={
                errors?.vatCert?.[0] || (errors?.documents ? " " : undefined)
              }
              showErrorDescription={errors?.vatCert?.[0] ?? false}
              disabled={isSavingFinance}
              infoPillDescription="Required if you provide a VAT number. Used to verify your VAT registration."
              actionSlot={
                isEditingFinance &&
                vatCertDocs?.length > 0 && (
                  <ReuseDocumentPromptPanel
                    label="VAT certificate"
                    docs={vatCertDocs}
                    selectedId={reuseDocIds.vatCert}
                    docType="VAT_CERTIFICATE"
                    onSelect={(id) => {
                      setReuseDocIds((prev) => ({ ...prev, vatCert: id }));
                      if (id) setFiles((f) => ({ ...f, vatCert: null }));
                    }}
                    disabled={isSavingFinance}
                    existingDocId={initialDocIds.vatCert}
                  />
                )
              }
            />
          </div>
        </div>
      </CardWrapper>

      {/* ── PERSONAL BANK ─────────────────────────────────────────────────── */}
      <CardWrapper
        title="Personal Bank Details"
        icon="Wallet"
        actions={
          <EditToggleButtons
            isEditing={isEditingBank}
            isLoading={isSavingBank}
            onEdit={() => startEditing("bank")}
            onSave={handleSaveBank}
            onCancel={cancelEditing}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "BANK NAME", key: "bankName", upper: false },
            { label: "BRANCH", key: "branch", upper: false },
            { label: "ACCOUNT NAME", key: "accountName", upper: false },
            { label: "SORT CODE", key: "sortCode", upper: true },
            { label: "ACCOUNT NUMBER", key: "accountNumber", upper: true },
            { label: "IBAN", key: "iban", upper: true },
            { label: "SWIFT / BIC", key: "swiftBic", upper: true },
          ].map(({ label, key, upper }) => (
            <EditableTextDataField
              key={key}
              label={label}
              value={bd?.[key]}
              isEditing={isEditingBank}
              prettify={false}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  bank: {
                    ...prev.bank,
                    [key]: upper ? val.toUpperCase() : val,
                  },
                }))
              }
              error={errors?.[key]?.[0]}
              disabled={isSavingBank}
              isRequired={false}
            />
          ))}
          {countryisIceland &&
            [
              {
                label: "BANK NUMBER",
                key: "bankNumberIceland",
                upper: false,
              },
              {
                label: "BANK HB",
                key: "bankHBIceland",
                upper: false,
              },
            ].map(({ label, key, upper }) => (
              <EditableTextDataField
                key={key}
                label={label}
                badge={"(ICELAND Specific)"}
                value={bd?.[key]}
                isEditing={isEditingBank}
                prettify={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    bank: {
                      ...prev.bank,
                      [key]: upper ? val.toUpperCase() : val,
                    },
                  }))
                }
                error={errors?.[key]?.[0]}
                disabled={isSavingBank}
                isRequired={false}
              />
            ))}
        </div>
      </CardWrapper>
    </>
  );
}
