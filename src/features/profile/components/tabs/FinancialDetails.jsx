import { useEffect, useState, useCallback } from "react";
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
import {
  buildDocumentAiExtraction,
  resolveAIVerificationStatusLabel,
} from "../../../ai/documents/config/aiDocumentScanner.helper";
import { useDocumentSectionAI } from "../../../ai/documents/hooks/useDocumentSectionAI";
import {
  AIConflictPanel,
  AIScanBanner,
} from "../../../ai/documents/components/AIFieldSuggestion";
import { BrainCircuit, XCircle } from "lucide-react";
import { formatFileSize } from "../../../../shared/config/utils";

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

  const fs4AI = useDocumentSectionAI({
    documentType: "FS4",
    scanKey: "fs4",
    getForm: () => formState.finance,
    setForm: (updated) =>
      setFormState((prev) => ({ ...prev, finance: updated })),
  });

  const payslipAI = useDocumentSectionAI({
    documentType: "PAYSLIP",
    scanKey: "payslip",
    getForm: () => formState.finance,
    setForm: (updated) =>
      setFormState((prev) => ({ ...prev, finance: updated })),
  });

  const p45AI = useDocumentSectionAI({
    documentType: "P45",
    scanKey: "p45",
    getForm: () => formState.finance,
    setForm: (updated) =>
      setFormState((prev) => ({ ...prev, finance: updated })),
  });

  const vatCertAI = useDocumentSectionAI({
    documentType: "VAT_CERTIFICATE",
    scanKey: "vatCert",
    getForm: () => formState.finance,
    setForm: (updated) =>
      setFormState((prev) => ({ ...prev, finance: updated })),
  });

  const fs4AIStatus = resolvedFs4?.aiExtraction?.status || "NOT_SCANNED";
  const fs4AIScanLabel =
    fs4AIStatus === "NOT_SCANNED" || fs4AIStatus === "PROCESSING"
      ? "Scan with AI"
      : "Rescan with AI";

  const payslipAIStatus =
    resolvedPayslip?.aiExtraction?.status || "NOT_SCANNED";
  const payslipAIScanLabel =
    payslipAIStatus === "NOT_SCANNED" || payslipAIStatus === "PROCESSING"
      ? "Scan with AI"
      : "Rescan with AI";

  const p45AIStatus = resolvedP45?.aiExtraction?.status || "NOT_SCANNED";
  const p45AIScanLabel =
    p45AIStatus === "NOT_SCANNED" || p45AIStatus === "PROCESSING"
      ? "Scan with AI"
      : "Rescan with AI";

  const vatCertAIStatus =
    resolvedVatCert?.aiExtraction?.status || "NOT_SCANNED";
  const vatCertAIScanLabel =
    vatCertAIStatus === "NOT_SCANNED" || vatCertAIStatus === "PROCESSING"
      ? "Scan with AI"
      : "Rescan with AI";

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
      fs4AI.resetAIState();
      payslipAI.resetAIState();
      p45AI.resetAIState();
      vatCertAI.resetAIState();
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
    fs4AI.resetAIState();
    payslipAI.resetAIState();
    p45AI.resetAIState();
    vatCertAI.resetAIState();
  };

  // ── AI scan handlers ───────────────────────────────────────────────────────
  const handleFs4Upload = useCallback(
    async (file) => {
      setFiles((f) => ({ ...f, fs4: file }));
      setReuseDocIds((prev) => ({ ...prev, fs4: null }));
      await fs4AI.processAIScan({ file, currentForm: formState.finance });
    },
    [fs4AI, formState.finance],
  );

  const handleFs4Rescan = useCallback(async () => {
    if (!resolvedFs4) return;
    if (!isEditingFinance) startEditing("finance");
    try {
      await fs4AI.processAIScan({
        file: files.fs4 ?? null,
        documentId: resolvedFs4._id,
        currentForm: formState.finance ?? fd,
      });
    } catch (err) {
      toast.error("Failed to rescan FS4 document");
      console.error(err);
    }
  }, [resolvedFs4, files.fs4, formState.finance, fd, fs4AI, isEditingFinance]);

  const handleFs4ReuseSelect = useCallback(
    (id) => {
      setReuseDocIds((prev) => ({ ...prev, fs4: id }));
      if (id) setFiles((prev) => ({ ...prev, fs4: null }));
      fs4AI.handleReuseSelect(id, userDocuments);
    },
    [fs4AI, userDocuments],
  );

  const handlePayslipUpload = useCallback(
    async (file) => {
      setFiles((f) => ({ ...f, payslip: file }));
      setReuseDocIds((prev) => ({ ...prev, payslip: null }));
      await payslipAI.processAIScan({ file, currentForm: formState.finance });
    },
    [payslipAI, formState.finance],
  );

  const handlePayslipRescan = useCallback(async () => {
    if (!resolvedPayslip) return;
    if (!isEditingFinance) startEditing("finance");
    try {
      await payslipAI.processAIScan({
        file: files.payslip ?? null,
        documentId: resolvedPayslip._id,
        currentForm: formState.finance ?? fd,
      });
    } catch (err) {
      toast.error("Failed to rescan payslip");
      console.error(err);
    }
  }, [
    resolvedPayslip,
    files.payslip,
    formState.finance,
    fd,
    payslipAI,
    isEditingFinance,
  ]);

  const handlePayslipReuseSelect = useCallback(
    (id) => {
      setReuseDocIds((prev) => ({ ...prev, payslip: id }));
      if (id) setFiles((prev) => ({ ...prev, payslip: null }));
      payslipAI.handleReuseSelect(id, userDocuments);
    },
    [payslipAI, userDocuments],
  );

  const handleP45Upload = useCallback(
    async (file) => {
      setFiles((f) => ({ ...f, p45: file }));
      setReuseDocIds((prev) => ({ ...prev, p45: null }));
      await p45AI.processAIScan({ file, currentForm: formState.finance });
    },
    [p45AI, formState.finance],
  );

  const handleP45Rescan = useCallback(async () => {
    if (!resolvedP45) return;
    if (!isEditingFinance) startEditing("finance");
    try {
      await p45AI.processAIScan({
        file: files.p45 ?? null,
        documentId: resolvedP45._id,
        currentForm: formState.finance ?? fd,
      });
    } catch (err) {
      toast.error("Failed to rescan P45 document");
      console.error(err);
    }
  }, [resolvedP45, files.p45, formState.finance, fd, p45AI, isEditingFinance]);

  const handleP45ReuseSelect = useCallback(
    (id) => {
      setReuseDocIds((prev) => ({ ...prev, p45: id }));
      if (id) setFiles((prev) => ({ ...prev, p45: null }));
      p45AI.handleReuseSelect(id, userDocuments);
    },
    [p45AI, userDocuments],
  );

  const handleVatCertUpload = useCallback(
    async (file) => {
      setFiles((f) => ({ ...f, vatCert: file }));
      setReuseDocIds((prev) => ({ ...prev, vatCert: null }));
      await vatCertAI.processAIScan({ file, currentForm: formState.finance });
    },
    [vatCertAI, formState.finance],
  );

  const handleVatCertRescan = useCallback(async () => {
    if (!resolvedVatCert) return;
    if (!isEditingFinance) startEditing("finance");
    try {
      await vatCertAI.processAIScan({
        file: files.vatCert ?? null,
        documentId: resolvedVatCert._id,
        currentForm: formState.finance ?? fd,
      });
    } catch (err) {
      toast.error("Failed to rescan VAT certificate");
      console.error(err);
    }
  }, [
    resolvedVatCert,
    files.vatCert,
    formState.finance,
    fd,
    vatCertAI,
    isEditingFinance,
  ]);

  const handleVatCertReuseSelect = useCallback(
    (id) => {
      setReuseDocIds((prev) => ({ ...prev, vatCert: id }));
      if (id) setFiles((prev) => ({ ...prev, vatCert: null }));
      vatCertAI.handleReuseSelect(id, userDocuments);
    },
    [vatCertAI, userDocuments],
  );

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

    if (fs4AI.aiRawFields) {
      formData.append(
        "fs4AiExtraction",
        JSON.stringify(
          buildDocumentAiExtraction(
            fs4AI.aiRawFields,
            formState.finance,
            "FS4",
          ),
        ),
      );
    }

    if (fs4AI.aiRawVerification) {
      formData.append(
        "fs4AiVerification",
        JSON.stringify(fs4AI.aiRawVerification),
      );
    }

    if (payslipAI.aiRawFields) {
      formData.append(
        "payslipAiExtraction",
        JSON.stringify(
          buildDocumentAiExtraction(
            payslipAI.aiRawFields,
            formState.finance,
            "PAYSLIP",
          ),
        ),
      );
    }

    if (payslipAI.aiRawVerification) {
      formData.append(
        "payslipAiVerification",
        JSON.stringify(payslipAI.aiRawVerification),
      );
    }

    if (p45AI.aiRawFields) {
      formData.append(
        "p45AiExtraction",
        JSON.stringify(
          buildDocumentAiExtraction(
            p45AI.aiRawFields,
            formState.finance,
            "P45",
          ),
        ),
      );
    }

    if (p45AI.aiRawVerification) {
      formData.append(
        "p45AiVerification",
        JSON.stringify(p45AI.aiRawVerification),
      );
    }

    if (vatCertAI.aiRawFields) {
      formData.append(
        "vatCertAiExtraction",
        JSON.stringify(
          buildDocumentAiExtraction(
            vatCertAI.aiRawFields,
            formState.finance,
            "VAT_CERTIFICATE",
          ),
        ),
      );
    }

    if (vatCertAI.aiRawVerification) {
      formData.append(
        "vatCertAiVerification",
        JSON.stringify(vatCertAI.aiRawVerification),
      );
    }

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

          {isEditingFinance && (
            <InfoPanel
              icon={BrainCircuit}
              title="AI document scan"
              variant="info"
              dismissible
              storageKey="hide-ai-finance-info"
            >
              <p>
                Upload your financial documents to auto-fill the respective
                details above using AI when available.
              </p>
              <p className="text-[11px] opacity-80">
                Review any suggested values before saving, especially if AI has
                detected a conflict and ai can make mistakes.
              </p>
            </InfoPanel>
          )}

          {/* Tax documents */}
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div className="space-y-3">
              {isEditingFinance && fs4AI.scan.status !== "idle" && (
                <AIScanBanner
                  status={fs4AI.scan.status}
                  error={fs4AI.scan.error}
                  autoFilledCount={fs4AI.autoFilledCount}
                  conflictCount={fs4AI.aiConflicts.length}
                />
              )}

              {isEditingFinance && fs4AI.aiConflicts.length > 0 && (
                <AIConflictPanel
                  conflicts={fs4AI.aiConflicts}
                  onAccept={fs4AI.acceptAISuggestion}
                  onReject={fs4AI.rejectAISuggestion}
                />
              )}
              <EditableDocumentField
                label="FS4 DOCUMENT"
                isEditing={isEditingFinance}
                isLoading={isFetchingDocs}
                fileName={resolvedFs4?.originalName ?? "No file uploaded"}
                fileUrl={resolvedFs4?.url ?? null}
                isUploaded={!!resolvedFs4}
                status={resolvedFs4?.verificationStatus || "Pending"}
                expiresAt={resolvedFs4?.expiresAt}
                meta={formatFileSize(resolvedFs4?.sizeBytes)}
                onUpload={handleFs4Upload}
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
                secondaryStatuses={[
                  {
                    label: "AI Verification :",
                    value: resolveAIVerificationStatusLabel({
                      scanStatus: fs4AI.scan.status?.toUpperCase(),
                      verificationStatus:
                        resolvedFs4?.aiVerification?.status?.toUpperCase(),
                    }),
                    icon: "Brain",
                  },
                ]}
                uploadedOn={resolvedFs4?.createdAt}
                verifiedAt={resolvedFs4?.verifiedAt}
                secondaryActions={[
                  {
                    label: fs4AIScanLabel,
                    icon: "Sparkles",
                    variant:
                      fs4AIStatus === "NOT_SCANNED" ||
                      fs4AIStatus === "PROCESSING"
                        ? "secondary"
                        : "outline",
                    onClick: handleFs4Rescan,
                    disabled:
                      (!resolvedFs4 && !files.fs4) ||
                      fs4AI.scan.status === "scanning" ||
                      isSavingFinance,
                  },
                ]}
                infoPillDescription="Required for certain Irish payroll setups to confirm tax registration and employment status. AI scan is available for this document."
                actionSlot={
                  isEditingFinance &&
                  fs4Docs?.length > 0 && (
                    <ReuseDocumentPromptPanel
                      label="FS4 document"
                      docs={fs4Docs}
                      selectedId={reuseDocIds.fs4}
                      docType="FS4"
                      onSelect={handleFs4ReuseSelect}
                      disabled={isSavingFinance}
                      existingDocId={initialDocIds.fs4}
                    />
                  )
                }
              />
            </div>

            <div className="space-y-3">
              {isEditingFinance && payslipAI.scan.status !== "idle" && (
                <AIScanBanner
                  status={payslipAI.scan.status}
                  error={payslipAI.scan.error}
                  autoFilledCount={payslipAI.autoFilledCount}
                  conflictCount={payslipAI.aiConflicts.length}
                />
              )}

              {isEditingFinance && payslipAI.aiConflicts.length > 0 && (
                <AIConflictPanel
                  conflicts={payslipAI.aiConflicts}
                  onAccept={payslipAI.acceptAISuggestion}
                  onReject={payslipAI.rejectAISuggestion}
                />
              )}

              <EditableDocumentField
                label="LATEST PAYSLIP"
                isEditing={isEditingFinance}
                isLoading={isFetchingDocs}
                fileName={resolvedPayslip?.originalName ?? "No file uploaded"}
                fileUrl={resolvedPayslip?.url ?? null}
                isUploaded={!!resolvedPayslip}
                status={resolvedPayslip?.verificationStatus || "Pending"}
                expiresAt={resolvedPayslip?.expiresAt}
                meta={formatFileSize(resolvedPayslip?.sizeBytes)}
                onUpload={handlePayslipUpload}
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
                secondaryStatuses={[
                  {
                    label: "AI Verification :",
                    value: resolveAIVerificationStatusLabel({
                      scanStatus: payslipAI.scan.status?.toUpperCase(),
                      verificationStatus:
                        resolvedPayslip?.aiVerification?.status?.toUpperCase(),
                    }),
                    icon: "Brain",
                  },
                ]}
                uploadedOn={resolvedPayslip?.createdAt}
                verifiedAt={resolvedPayslip?.verifiedAt}
                secondaryActions={[
                  {
                    label: payslipAIScanLabel,
                    icon: "Sparkles",
                    variant:
                      payslipAIStatus === "NOT_SCANNED" ||
                      payslipAIStatus === "PROCESSING"
                        ? "secondary"
                        : "outline",
                    onClick: handlePayslipRescan,
                    disabled:
                      (!resolvedPayslip && !files.payslip) ||
                      payslipAI.scan.status === "scanning" ||
                      isSavingFinance,
                  },
                ]}
                infoPillDescription="Used for PAYE contracts as proof of previous employment and income. AI scan is available for this document."
                actionSlot={
                  isEditingFinance &&
                  payslipDocs?.length > 0 && (
                    <ReuseDocumentPromptPanel
                      label="payslip"
                      docs={payslipDocs}
                      selectedId={reuseDocIds.payslip}
                      docType="PAYSLIP"
                      onSelect={handlePayslipReuseSelect}
                      disabled={isSavingFinance}
                      existingDocId={initialDocIds.payslip}
                    />
                  )
                }
              />
            </div>

            <div className="space-y-3">
              {isEditingFinance && p45AI.scan.status !== "idle" && (
                <AIScanBanner
                  status={p45AI.scan.status}
                  error={p45AI.scan.error}
                  autoFilledCount={p45AI.autoFilledCount}
                  conflictCount={p45AI.aiConflicts.length}
                />
              )}

              {isEditingFinance && p45AI.aiConflicts.length > 0 && (
                <AIConflictPanel
                  conflicts={p45AI.aiConflicts}
                  onAccept={p45AI.acceptAISuggestion}
                  onReject={p45AI.rejectAISuggestion}
                />
              )}

              <EditableDocumentField
                label="P45 DOCUMENT"
                isEditing={isEditingFinance}
                isLoading={isFetchingDocs}
                fileName={resolvedP45?.originalName ?? "No file uploaded"}
                fileUrl={resolvedP45?.url ?? null}
                isUploaded={!!resolvedP45}
                status={resolvedP45?.verificationStatus || "Pending"}
                expiresAt={resolvedP45?.expiresAt}
                meta={formatFileSize(resolvedP45?.sizeBytes)}
                onUpload={handleP45Upload}
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
                error={
                  errors?.p45?.[0] || (errors?.documents ? " " : undefined)
                }
                showErrorDescription={false}
                disabled={isSavingFinance}
                secondaryStatuses={[
                  {
                    label: "AI Verification :",
                    value: resolveAIVerificationStatusLabel({
                      scanStatus: p45AI.scan.status?.toUpperCase(),
                      verificationStatus:
                        resolvedP45?.aiVerification?.status?.toUpperCase(),
                    }),
                    icon: "Brain",
                  },
                ]}
                uploadedOn={resolvedP45?.createdAt}
                verifiedAt={resolvedP45?.verifiedAt}
                secondaryActions={[
                  {
                    label: p45AIScanLabel,
                    icon: "Sparkles",
                    variant:
                      p45AIStatus === "NOT_SCANNED" ||
                      p45AIStatus === "PROCESSING"
                        ? "secondary"
                        : "outline",
                    onClick: handleP45Rescan,
                    disabled:
                      (!resolvedP45 && !files.p45) ||
                      p45AI.scan.status === "scanning" ||
                      isSavingFinance,
                  },
                ]}
                infoPillDescription="Required for PAYE contracts to provide previous employment and tax details. AI scan is available for this document."
                actionSlot={
                  isEditingFinance &&
                  p45Docs?.length > 0 && (
                    <ReuseDocumentPromptPanel
                      label="P45 document"
                      docs={p45Docs}
                      selectedId={reuseDocIds.p45}
                      docType="P45"
                      onSelect={handleP45ReuseSelect}
                      disabled={isSavingFinance}
                      existingDocId={initialDocIds.p45}
                    />
                  )
                }
              />
            </div>

            <div className="space-y-3">
              {isEditingFinance && vatCertAI.scan.status !== "idle" && (
                <AIScanBanner
                  status={vatCertAI.scan.status}
                  error={vatCertAI.scan.error}
                  autoFilledCount={vatCertAI.autoFilledCount}
                  conflictCount={vatCertAI.aiConflicts.length}
                />
              )}

              {isEditingFinance && vatCertAI.aiConflicts.length > 0 && (
                <AIConflictPanel
                  conflicts={vatCertAI.aiConflicts}
                  onAccept={vatCertAI.acceptAISuggestion}
                  onReject={vatCertAI.rejectAISuggestion}
                />
              )}

              <EditableDocumentField
                label="VAT CERTIFICATE"
                isEditing={isEditingFinance}
                isLoading={isFetchingDocs}
                fileName={resolvedVatCert?.originalName ?? "No file uploaded"}
                fileUrl={resolvedVatCert?.url ?? null}
                isUploaded={!!resolvedVatCert}
                status={resolvedVatCert?.verificationStatus || "Pending"}
                expiresAt={resolvedVatCert?.expiresAt}
                meta={formatFileSize(resolvedVatCert?.sizeBytes)}
                onUpload={handleVatCertUpload}
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
                secondaryStatuses={[
                  {
                    label: "AI Verification :",
                    value: resolveAIVerificationStatusLabel({
                      scanStatus: vatCertAI.scan.status?.toUpperCase(),
                      verificationStatus:
                        resolvedVatCert?.aiVerification?.status?.toUpperCase(),
                    }),
                    icon: "Brain",
                  },
                ]}
                uploadedOn={resolvedVatCert?.createdAt}
                verifiedAt={resolvedVatCert?.verifiedAt}
                secondaryActions={[
                  {
                    label: vatCertAIScanLabel,
                    icon: "Sparkles",
                    variant:
                      vatCertAIStatus === "NOT_SCANNED" ||
                      vatCertAIStatus === "PROCESSING"
                        ? "secondary"
                        : "outline",
                    onClick: handleVatCertRescan,
                    disabled:
                      (!resolvedVatCert && !files.vatCert) ||
                      vatCertAI.scan.status === "scanning" ||
                      isSavingFinance,
                  },
                ]}
                infoPillDescription="Required if you provide a VAT number. Used to verify your VAT registration. AI scan is available for this document."
                actionSlot={
                  isEditingFinance &&
                  vatCertDocs?.length > 0 && (
                    <ReuseDocumentPromptPanel
                      label="VAT certificate"
                      docs={vatCertDocs}
                      selectedId={reuseDocIds.vatCert}
                      docType="VAT_CERTIFICATE"
                      onSelect={handleVatCertReuseSelect}
                      disabled={isSavingFinance}
                      existingDocId={initialDocIds.vatCert}
                    />
                  )
                }
              />
            </div>
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
