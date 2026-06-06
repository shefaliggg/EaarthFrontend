import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";
import EditableDocumentField from "@/shared/components/wrappers/EditableDocumentField";
import { AutoHeight } from "@/shared/components/wrappers/AutoHeight";
import { getCountryOptions } from "@/shared/config/countriesDataConfig";
import {
  fetchProfileThunk,
  setupCompanyThunk,
  updateCompanyDetailsThunk,
  updateCompanyContactThunk,
  updateCompanyTaxThunk,
  updateCompanyBankThunk,
} from "../../store/crew/crewProfile.thunk";
import { fetchDocumentsThunk } from "../../../user-documents/store/document.thunk";
import {
  getDocumentsByType,
  getDisplayDocument,
} from "../../../user-documents/store/document.selector";
import ProfileCardLoadingSkelton from "../skeltons/ProfileCardLoadingSkelton";
import ProfileCardErrorSkelton from "../skeltons/ProfileCardErrorSkelton";
import ReuseDocumentPromptPanel from "../common/ReuseDocumentPromptPanel";
import {
  MODAL_TYPES,
  useModalStore,
} from "../../../../shared/stores/useModalStore";
import {
  companySetupSchema,
  companyDetailsSchema,
  companyContactSchema,
  companyTaxSchema,
  companyBankSchema,
} from "../../config/profileValidationShemas";
import {
  companyVerificationConfirmConfig,
  removeCompanyDetailsConfig,
} from "../../../../shared/config/ConfirmActionsConfig";
import { formatFileSize } from "../../../../shared/config/utils";
import { buildDocumentAiExtraction } from "@/features/ai/documents/config/aiDocumentScanner.helper";
import { useDocumentSectionAI } from "@/features/ai/documents/hooks/useDocumentSectionAI";
import {
  AIConflictPanel,
  AIScanBanner,
} from "@/features/ai/documents/components/AIFieldSuggestion";
import { InfoPanel } from "@/shared/components/panels/InfoPanel";
import { BrainCircuit } from "lucide-react";
import { is } from "zod/v4/locales";
import {
  getGovtVerificationStatusLabel,
  resolveAIVerificationStatusLabel,
} from "../../../ai/documents/config/aiDocumentScanner.helper";

// ── Empty state constants ─────────────────────────────────────────────────────

const EMPTY_COMPANY_DETAILS = {
  usesLoanOutCompany: false,
  name: "",
  registrationNumber: "",
  ktNumber: "",
  countryOfIncorporation: "",
};

const EMPTY_COMPANY_CONTACT = {
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  postcode: "",
  country: "",
  representativeName: "",
  representativeEmail: "",
  allowThirdPartyToSignContracts: false,
};

const EMPTY_COMPANY_TAX = {
  isVATRegistered: false,
  vatNumber: "",
  taxRegistrationNumberIreland: "",
  taxClearanceAccessNumberIreland: "",
};

const EMPTY_COMPANY_BANK = {
  bankName: "",
  branch: "",
  accountName: "",
  sortCode: "",
  accountNumber: "",
  iban: "",
  swiftBic: "",
  bankNumberIceland: "",
  bankHBIceland: "",
};

const EMPTY_FILES = {
  certificateOfIncorporation: null,
  vatCertificate: null,
};

const EMPTY_REUSE_IDS = {
  certificateOfIncorporation: null,
  vatCertificate: null,
};

// ─────────────────────────────────────────────────────────────────────────────

export default function CompanyDetails() {
  const [isEditing, setIsEditing] = useState({ section: null });
  const [isSetupStarted, setIsSetupStarted] = useState(false);
  const [formState, setFormState] = useState({
    companyDetails: null,
    companyContact: null,
    companyTax: null,
    companyBank: null,
  });
  const [files, setFiles] = useState(EMPTY_FILES);
  const [initialDocIds, setInitialDocIds] = useState(EMPTY_REUSE_IDS);
  const [reuseDocIds, setReuseDocIds] = useState(EMPTY_REUSE_IDS);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { crewProfile, isFetching, isUpdating, error } = useSelector(
    (state) => state.crewProfile,
  );
  const { userDocuments, isFetching: isFetchingDocs } = useSelector(
    (state) => state.userDocuments,
  );
  const { openModal, closeModal } = useModalStore();

  const certOfIncorpAI = useDocumentSectionAI({
    documentType: "CERTIFICATE_OF_INCORPORATION",
    scanKey: "certOfIncorp",
    getForm: () => formState.companyDetails,
    setForm: (updated) =>
      setFormState((prev) => ({ ...prev, companyDetails: updated })),
  });

  const vatCertAI = useDocumentSectionAI({
    documentType: "VAT_CERTIFICATE",
    scanKey: "vatCert",
    getForm: () => formState.companyTax,
    setForm: (updated) =>
      setFormState((prev) => ({ ...prev, companyTax: updated })),
  });

  useEffect(() => {
    if (!crewProfile && !isFetching) dispatch(fetchProfileThunk());
  }, [crewProfile, isFetching]);

  useEffect(() => {
    if (!userDocuments && !isFetchingDocs) dispatch(fetchDocumentsThunk());
  }, [userDocuments, isFetchingDocs]);

  const company = crewProfile?.company;
  const hasCompanyData = company?.name || company?.registrationNumber;
  const isConfigured = company?.configured === true;
  const isSetupMode = !isConfigured && isSetupStarted;

  // ── Section editing flags ─────────────────────────────────────────────────
  const isEditingDetails =
    isSetupMode || isEditing.section === "companyDetails";
  const isEditingContact =
    isSetupMode || isEditing.section === "companyContact";
  const isEditingTax = isSetupMode || isEditing.section === "companyTax";
  const isEditingBank = isSetupMode || isEditing.section === "companyBank";

  const isSavingSetup = isUpdating && isSetupMode;
  const isSavingDetails = isUpdating && isEditing.section === "companyDetails";
  const isSavingContact = isUpdating && isEditing.section === "companyContact";
  const isSavingTax = isUpdating && isEditing.section === "companyTax";
  const isSavingBank = isUpdating && isEditing.section === "companyBank";

  // ── Document lists for reuse panels ──────────────────────────────────────
  const certOfIncorpDocs = getDocumentsByType(
    userDocuments,
    "CERTIFICATE_OF_INCORPORATION",
  );
  const vatCertDocs = getDocumentsByType(userDocuments, "VAT_CERTIFICATE");

  // ── Display values (read vs edit) ─────────────────────────────────────────
  const cd = isEditingDetails
    ? formState.companyDetails
    : {
        usesLoanOutCompany: company?.usesLoanOutCompany ?? false,
        name: company?.name ?? "",
        registrationNumber: company?.registrationNumber ?? "",
        ktNumber: company?.ktNumber ?? "",
        countryOfIncorporation: company?.countryOfIncorporation ?? "",
      };

  const cc = isEditingContact
    ? formState.companyContact
    : {
        addressLine1: company?.address?.line1 ?? "",
        addressLine2: company?.address?.line2 ?? "",
        addressLine3: company?.address?.line3 ?? "",
        postcode: company?.address?.postcode ?? "",
        country: company?.address?.country ?? "",
        representativeName: company?.representativeName ?? "",
        representativeEmail: company?.representativeEmail ?? "",
        allowThirdPartyToSignContracts:
          company?.allowThirdPartyToSignContracts ?? false,
      };

  const ct = isEditingTax
    ? formState.companyTax
    : {
        isVATRegistered: company?.isVATRegistered ?? false,
        vatNumber: company?.vatNumber ?? "",
        taxRegistrationNumberIreland:
          company?.taxRegistrationNumberIreland ?? "",
        taxClearanceAccessNumberIreland:
          company?.taxClearanceAccessNumberIreland ?? "",
      };

  const cb = isEditingBank
    ? formState.companyBank
    : {
        bankName: company?.bank?.bankName ?? "",
        branch: company?.bank?.branch ?? "",
        accountName: company?.bank?.accountName ?? "",
        sortCode: company?.bank?.sortCode ?? "",
        accountNumber: company?.bank?.accountNumber ?? "",
        iban: company?.bank?.iban ?? "",
        swiftBic: company?.bank?.swiftBic ?? "",
        bankNumberIceland: company?.bank?.bankNumberIceland ?? "",
        bankHBIceland: company?.bank?.bankHBIceland ?? "",
      };

  const usesCompany = cd?.usesLoanOutCompany;
  const companyIsInIreland = cd?.countryOfIncorporation === "IE";
  const companyIsInIceland = cd?.countryOfIncorporation === "IS";

  // ── Resolved documents ────────────────────────────────────────────────────
  const resolvedCertOfIncorp = getDisplayDocument(
    company?.certificateOfIncorporationId,
    reuseDocIds.certificateOfIncorporation,
    files.certificateOfIncorporation,
    userDocuments,
  );

  const resolvedVatCert = getDisplayDocument(
    company?.vatCertificateId,
    reuseDocIds.vatCertificate,
    files.vatCertificate,
    userDocuments,
  );

  // ── AI scan status labels ─────────────────────────────────────────────────
  const certOfIncorpAIStatus =
    resolvedCertOfIncorp?.aiExtraction?.status || "NOT_SCANNED";
  const certOfIncorpAIScanLabel =
    certOfIncorpAIStatus === "NOT_SCANNED" ||
    certOfIncorpAIStatus === "PROCESSING"
      ? "Scan with AI"
      : "Rescan with AI";

  const vatCertAIStatus =
    resolvedVatCert?.aiExtraction?.status || "NOT_SCANNED";
  const vatCertAIScanLabel =
    vatCertAIStatus === "NOT_SCANNED" || vatCertAIStatus === "PROCESSING"
      ? "Scan with AI"
      : "Rescan with AI";

  // ── Editing controls ──────────────────────────────────────────────────────
  const startEditing = (section) => {
    setErrors({});

    const snapshots = {
      companyDetails: {
        usesLoanOutCompany: company?.usesLoanOutCompany ?? false,
        name: company?.name ?? "",
        registrationNumber: company?.registrationNumber ?? "",
        ktNumber: company?.ktNumber ?? "",
        countryOfIncorporation: company?.countryOfIncorporation ?? "",
      },
      companyContact: {
        addressLine1: company?.address?.line1 ?? "",
        addressLine2: company?.address?.line2 ?? "",
        addressLine3: company?.address?.line3 ?? "",
        postcode: company?.address?.postcode ?? "",
        country: company?.address?.country ?? "",
        representativeName: company?.representativeName ?? "",
        representativeEmail: company?.representativeEmail ?? "",
        allowThirdPartyToSignContracts:
          company?.allowThirdPartyToSignContracts ?? false,
      },
      companyTax: {
        isVATRegistered: company?.isVATRegistered ?? false,
        vatNumber: company?.vatNumber ?? "",
        taxRegistrationNumberIreland:
          company?.taxRegistrationNumberIreland ?? "",
        taxClearanceAccessNumberIreland:
          company?.taxClearanceAccessNumberIreland ?? "",
      },
      companyBank: {
        bankName: company?.bank?.bankName ?? "",
        branch: company?.bank?.branch ?? "",
        accountName: company?.bank?.accountName ?? "",
        sortCode: company?.bank?.sortCode ?? "",
        accountNumber: company?.bank?.accountNumber ?? "",
        iban: company?.bank?.iban ?? "",
        swiftBic: company?.bank?.swiftBic ?? "",
        bankNumberIceland: company?.bank?.bankNumberIceland ?? "",
        bankHBIceland: company?.bank?.bankHBIceland ?? "",
      },
    };

    setFormState((prev) => ({ ...prev, [section]: snapshots[section] }));

    if (section === "companyDetails") {
      setInitialDocIds((p) => ({
        ...p,
        certificateOfIncorporation:
          company?.certificateOfIncorporationId ?? null,
      }));
      setReuseDocIds((p) => ({
        ...p,
        certificateOfIncorporation:
          company?.certificateOfIncorporationId ?? null,
      }));
      certOfIncorpAI.resetAIState();
    }

    if (section === "companyTax") {
      setInitialDocIds((p) => ({
        ...p,
        vatCertificate: company?.vatCertificateId ?? null,
      }));
      setReuseDocIds((p) => ({
        ...p,
        vatCertificate: company?.vatCertificateId ?? null,
      }));
      vatCertAI.resetAIState();
    }

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setIsSetupStarted(false);
    setFormState({
      companyDetails: null,
      companyContact: null,
      companyTax: null,
      companyBank: null,
    });
    setFiles(EMPTY_FILES);
    setInitialDocIds(EMPTY_REUSE_IDS);
    setReuseDocIds(EMPTY_REUSE_IDS);
    setErrors({});
    certOfIncorpAI.resetAIState();
    vatCertAI.resetAIState();
  };

  const handleCertOfIncorpUpload = useCallback(
    async (file) => {
      setFiles((f) => ({ ...f, certificateOfIncorporation: file }));
      setReuseDocIds((f) => ({ ...f, certificateOfIncorporation: null }));
      await certOfIncorpAI.processAIScan({
        file,
        currentForm: formState.companyDetails,
      });
    },
    [formState.companyDetails, certOfIncorpAI],
  );

  const handleCertOfIncorpRescan = useCallback(async () => {
    if (!resolvedCertOfIncorp) return;
    if (!isEditingDetails) {
      startEditing("companyDetails");
    }
    try {
      await certOfIncorpAI.processAIScan({
        file: files.certificateOfIncorporation ?? null,
        documentId: resolvedCertOfIncorp._id,
        currentForm: formState.companyDetails ?? cd,
      });
    } catch (err) {
      toast.error("Failed to rescan certificate of incorporation");
      console.error(err);
    }
  }, [
    resolvedCertOfIncorp,
    files.certificateOfIncorporation,
    formState.companyDetails,
    cd,
    certOfIncorpAI,
  ]);

  const handleCertOfIncorpReuseSelect = useCallback(
    (id) => {
      setReuseDocIds((prev) => ({ ...prev, certificateOfIncorporation: id }));
      if (id) setFiles((f) => ({ ...f, certificateOfIncorporation: null }));
      certOfIncorpAI.handleReuseSelect(id, userDocuments);
    },
    [userDocuments, certOfIncorpAI],
  );

  const handleVatCertUpload = useCallback(
    async (file) => {
      setFiles((f) => ({ ...f, vatCertificate: file }));
      setReuseDocIds((f) => ({ ...f, vatCertificate: null }));
      await vatCertAI.processAIScan({
        file,
        currentForm: formState.companyTax,
      });
    },
    [formState.companyTax, vatCertAI],
  );

  const handleVatCertRescan = useCallback(async () => {
    if (!resolvedVatCert) return;

    if (!isEditingTax) {
      startEditing("companyTax");
    }
    try {
      await vatCertAI.processAIScan({
        file: files.vatCertificate ?? null,
        documentId: resolvedVatCert._id,
        currentForm: formState.companyTax ?? ct,
      });
    } catch (err) {
      toast.error("Failed to rescan VAT certificate");
      console.error(err);
    }
  }, [
    resolvedVatCert,
    files.vatCertificate,
    formState.companyTax,
    ct,
    vatCertAI,
  ]);

  const handleVatCertReuseSelect = useCallback(
    (id) => {
      setReuseDocIds((prev) => ({ ...prev, vatCertificate: id }));
      if (id) setFiles((f) => ({ ...f, vatCertificate: null }));
      vatCertAI.handleReuseSelect(id, userDocuments);
    },
    [userDocuments, vatCertAI],
  );

  const buildFormData = (fields, fileMap) => {
    const fd = new FormData();
    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined && val !== null) {
        if (typeof val === "object" && !(val instanceof File)) {
          fd.append(key, JSON.stringify(val));
        } else {
          fd.append(key, val);
        }
      }
    }
    for (const [key, file] of Object.entries(fileMap)) {
      if (file) fd.append(key, file);
    }
    return fd;
  };

  const handleSaveSetup = async () => {
    setErrors({});

    const combined = {
      usesLoanOutCompany: true,
      ...formState.companyDetails,
      ...formState.companyContact,
      ...formState.companyTax,
      ...formState.companyBank,
    };

    const result = companySetupSchema.safeParse({
      ...combined,
      _meta: { files, reuseDocIds },
    });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const fd = buildFormData(
      {
        usesLoanOutCompany: true,
        name: formState.companyDetails.name,
        registrationNumber: formState.companyDetails.registrationNumber,
        ktNumber: formState.companyDetails.ktNumber,
        countryOfIncorporation: formState.companyDetails.countryOfIncorporation,
        address: JSON.stringify({
          line1: formState.companyContact.addressLine1,
          line2: formState.companyContact.addressLine2,
          line3: formState.companyContact.addressLine3,
          postcode: formState.companyContact.postcode,
          country: formState.companyContact.country,
        }),
        representativeName: formState.companyContact.representativeName,
        representativeEmail: formState.companyContact.representativeEmail,
        allowThirdPartyToSignContracts:
          formState.companyContact.allowThirdPartyToSignContracts,
        isVATRegistered: formState.companyTax.isVATRegistered,
        vatNumber: formState.companyTax.vatNumber,
        taxRegistrationNumberIreland:
          formState.companyTax.taxRegistrationNumberIreland,
        taxClearanceAccessNumberIreland:
          formState.companyTax.taxClearanceAccessNumberIreland,
        bank: JSON.stringify(formState.companyBank),
        ...(reuseDocIds.certificateOfIncorporation && {
          certificateOfIncorporationId: reuseDocIds.certificateOfIncorporation,
        }),
        ...(reuseDocIds.vatCertificate && {
          vatCertificateId: reuseDocIds.vatCertificate,
        }),
      },
      {
        certificateOfIncorporation: files.certificateOfIncorporation,
        vatCertificate: files.vatCertificate,
      },
    );

    if (certOfIncorpAI.aiRawFields) {
      fd.append(
        "certOfIncorpAiExtraction",
        JSON.stringify(
          buildDocumentAiExtraction(
            certOfIncorpAI.aiRawFields,
            formState.companyDetails,
            "CERTIFICATE_OF_INCORPORATION",
          ),
        ),
      );
    }
    if (certOfIncorpAI.aiRawVerification) {
      fd.append(
        "certOfIncorpAiVerification",
        JSON.stringify(certOfIncorpAI.aiRawVerification),
      );
    }
    if (vatCertAI.aiRawFields) {
      fd.append(
        "vatCertAiExtraction",
        JSON.stringify(
          buildDocumentAiExtraction(
            vatCertAI.aiRawFields,
            formState.companyTax,
            "VAT_CERTIFICATE",
          ),
        ),
      );
    }
    if (vatCertAI.aiRawVerification) {
      fd.append(
        "vatCertAiVerification",
        JSON.stringify(vatCertAI.aiRawVerification),
      );
    }

    try {
      const response = await dispatch(setupCompanyThunk(fd)).unwrap();

      const incorpVerification =
        response.governmentVerification?.CERTIFICATE_OF_INCORPORATION;

      const vatVerification = response.governmentVerification?.VAT_CERTIFICATE;

      if (
        incorpVerification?.status === "VERIFIED" &&
        vatVerification?.status === "VERIFIED"
      ) {
        toast.success("Company setup complete", {
          description:
            "Your company details were verified against Companies House and HMRC records.",
        });
      } else if (
        incorpVerification?.status === "NEEDS_REVIEW" ||
        vatVerification?.status === "NEEDS_REVIEW"
      ) {
        toast.success("Company setup complete", {
          description:
            "Your company information was saved, but some verification checks require administrator review.",
        });
      } else {
        toast.success("Company setup complete", {
          description:
            "Your company information was saved and verification checks are pending review.",
        });
      }

      cancelEditing();
    } catch (err) {
      toast.error("Failed to complete company setup", {
        description: err?.message || "An unknown error occurred",
      });
    }
  };

  const handleSaveDetails = async () => {
    setErrors({});

    const result = companyDetailsSchema.safeParse(formState.companyDetails);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    if (hasCompanyData && !formState.companyDetails?.usesLoanOutCompany) {
      openModal(MODAL_TYPES.CONFIRM_ACTION, {
        config: removeCompanyDetailsConfig,
        onConfirm: async () => {
          closeModal();
          try {
            await dispatch(
              updateCompanyDetailsThunk({ usesLoanOutCompany: false }),
            ).unwrap();
            toast.success("Loan company details disabled", {
              description:
                "All loan company and financial details have been removed. You can add them again anytime.",
            });
            cancelEditing();
          } catch (err) {
            toast.error("Failed to disable loan out company", {
              description: err?.message || "An unknown error occurred",
            });
          }
        },
        autoClose: true,
      });
      return;
    }

    const hasExisting = company?.certificateOfIncorporationId;
    const hasNew = files.certificateOfIncorporation;
    const hasReuse = reuseDocIds.certificateOfIncorporation;

    if (!hasExisting && !hasNew && !hasReuse) {
      setErrors({
        certificateOfIncorporation: [
          "Certificate of incorporation is required",
        ],
      });
      return;
    }

    const fd = buildFormData(
      {
        usesLoanOutCompany: formState.companyDetails.usesLoanOutCompany,
        name: formState.companyDetails.name,
        registrationNumber: formState.companyDetails.registrationNumber,
        ktNumber: formState.companyDetails.ktNumber,
        countryOfIncorporation: formState.companyDetails.countryOfIncorporation,
        ...(reuseDocIds.certificateOfIncorporation && {
          certificateOfIncorporationId: reuseDocIds.certificateOfIncorporation,
        }),
      },
      { certificateOfIncorporation: files.certificateOfIncorporation },
    );

    if (certOfIncorpAI.aiRawFields) {
      fd.append(
        "certOfIncorpAiExtraction",
        JSON.stringify(
          buildDocumentAiExtraction(
            certOfIncorpAI.aiRawFields,
            formState.companyDetails,
            "CERTIFICATE_OF_INCORPORATION",
          ),
        ),
      );
    }
    if (certOfIncorpAI.aiRawVerification) {
      fd.append(
        "certOfIncorpAiVerification",
        JSON.stringify(certOfIncorpAI.aiRawVerification),
      );
    }

    try {
      const response = await dispatch(updateCompanyDetailsThunk(fd)).unwrap();

      const incorpVerification =
        response.governmentVerification?.CERTIFICATE_OF_INCORPORATION;

      if (!incorpVerification) {
        toast.success("Company details updated", {
          description:
            "Your loan out company details have been successfully updated.",
        });
      } else if (incorpVerification.status === "VERIFIED") {
        toast.success("Company details updated", {
          description:
            "Your company details were successfully verified against Companies House records.",
        });
      } else if (incorpVerification.status === "NEEDS_REVIEW") {
        toast.success("Company details updated", {
          description:
            incorpVerification.actionReason ||
            "Your company details were saved. Companies House found differences that require administrator review.",
        });
      } else {
        toast.success("Company details updated", {
          description:
            incorpVerification.actionReason ||
            "Your company details were saved and are awaiting verification review.",
        });
      }

      cancelEditing();
    } catch (err) {
      toast.error("Failed to update company details", {
        description: err?.message || "An unknown error occurred",
      });
    }
  };

  const handleSaveContact = async () => {
    setErrors({});
    const result = companyContactSchema.safeParse(formState.companyContact);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    try {
      await dispatch(
        updateCompanyContactThunk({
          address: {
            line1: formState.companyContact.addressLine1,
            line2: formState.companyContact.addressLine2,
            line3: formState.companyContact.addressLine3,
            postcode: formState.companyContact.postcode,
            country: formState.companyContact.country,
          },
          representativeName: formState.companyContact.representativeName,
          representativeEmail: formState.companyContact.representativeEmail,
          allowThirdPartyToSignContracts:
            formState.companyContact.allowThirdPartyToSignContracts,
        }),
      ).unwrap();
      toast.success("Company contact updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error("Failed to update company contact", {
        description: err?.message || "An unknown error occurred",
      });
    }
  };

  const handleSaveTax = async () => {
    setErrors({});
    const result = companyTaxSchema.safeParse({
      ...formState.companyTax,
      _meta: { files, reuseDocIds },
    });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const fd = buildFormData(
      {
        isVATRegistered: formState.companyTax.isVATRegistered,
        vatRegisteredName: cd?.name, //for government verification - in case company name was updated but not saved yet
        vatNumber: formState.companyTax.vatNumber,
        taxRegistrationNumberIreland:
          formState.companyTax.taxRegistrationNumberIreland,
        taxClearanceAccessNumberIreland:
          formState.companyTax.taxClearanceAccessNumberIreland,
        ...(reuseDocIds.vatCertificate && {
          vatCertificateId: reuseDocIds.vatCertificate,
        }),
      },
      { vatCertificate: files.vatCertificate },
    );

    if (vatCertAI.aiRawFields) {
      fd.append(
        "vatCertAiExtraction",
        JSON.stringify(
          buildDocumentAiExtraction(
            vatCertAI.aiRawFields,
            formState.companyTax,
            "VAT_CERTIFICATE",
          ),
        ),
      );
    }
    if (vatCertAI.aiRawVerification) {
      fd.append(
        "vatCertAiVerification",
        JSON.stringify(vatCertAI.aiRawVerification),
      );
    }

    try {
      const response = await dispatch(updateCompanyTaxThunk(fd)).unwrap();
      const vatVerification = response.governmentVerification?.VAT_CERTIFICATE;

      if (!vatVerification) {
        toast.success("Company tax updated", {
          description:
            "Your loan company tax details have been successfully updated.",
        });
      } else if (vatVerification.status === "VERIFIED") {
        toast.success("Company tax updated", {
          description:
            "Your VAT details were successfully verified against HMRC records.",
        });
      } else if (vatVerification.status === "NEEDS_REVIEW") {
        toast.success("Company tax updated", {
          description:
            vatVerification?.actionReason ||
            "Your VAT details were saved. HMRC found differences that require administrator review.",
        });
      } else {
        toast.success("Company tax updated", {
          description:
            vatVerification?.actionReason ||
            "Your VAT details were saved and are awaiting verification review.",
        });
      }
      cancelEditing();
    } catch (err) {
      toast.error("Failed to update company tax", {
        description: err?.message || "An unknown error occurred",
      });
    }
  };

  const handleSaveBank = async () => {
    setErrors({});
    const result = companyBankSchema.safeParse(formState.companyBank);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    try {
      await dispatch(updateCompanyBankThunk(formState.companyBank)).unwrap();
      toast.success("Company bank updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error("Failed to update company bank", {
        description: err?.message || "An unknown error occurred",
      });
    }
  };

  const handleViewDocument = ({ url, fileName, mimeType }) => {
    if (!url) return;
    const isImage = mimeType?.startsWith("image/");
    if (isImage) {
      openModal(MODAL_TYPES.IMAGE_PREVIEW, { imageFile: { url } });
    } else {
      openModal(MODAL_TYPES.DOCUMENT_PREVIEW, { fileUrl: url, fileName });
    }
  };

  const shouldShowVerificationModal =
    !!files?.certificateOfIncorporation ||
    formState?.companyDetails?.name !== company?.name ||
    formState?.companyDetails?.registrationNumber !==
      company?.registrationNumber;

  // ── Loading / Error states ────────────────────────────────────────────────
  if (isFetching) {
    return (
      <>
        <ProfileCardLoadingSkelton fields={5} columns={2} />
        <ProfileCardLoadingSkelton fields={4} columns={2} />
        <ProfileCardLoadingSkelton fields={4} columns={2} />
        <ProfileCardLoadingSkelton fields={4} columns={2} />
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

  return (
    <>
      <CardWrapper
        title="Company Details"
        icon="Building2"
        actions={
          <EditToggleButtons
            isEditing={isEditingDetails}
            isLoading={isSetupMode ? isSavingSetup : isSavingDetails}
            onEdit={
              isSetupMode ? undefined : () => startEditing("companyDetails")
            }
            onSave={
              isSetupMode
                ? handleSaveSetup
                : shouldShowVerificationModal
                  ? () =>
                      openModal(MODAL_TYPES.CONFIRM_ACTION, {
                        config: companyVerificationConfirmConfig,
                        onConfirm: async () => {
                          closeModal();
                          await handleSaveDetails();
                        },
                        autoClose: true,
                      })
                  : handleSaveDetails
            }
            onCancel={cancelEditing}
          />
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <EditableSwitchField
            label="Uses loan-out company"
            checked={usesCompany}
            isEditing={isEditingDetails}
            infoPillDescription="Enable if you invoice through a limited company or loan-out structure."
            onChange={(val) => {
              if (!isConfigured && val === true) {
                setIsSetupStarted(true);
                setFormState({
                  companyDetails: {
                    ...EMPTY_COMPANY_DETAILS,
                    usesLoanOutCompany: true,
                  },
                  companyContact: { ...EMPTY_COMPANY_CONTACT },
                  companyTax: { ...EMPTY_COMPANY_TAX },
                  companyBank: { ...EMPTY_COMPANY_BANK },
                });
                setFiles(EMPTY_FILES);
                setReuseDocIds(EMPTY_REUSE_IDS);
              } else {
                setFormState((prev) => ({
                  ...prev,
                  companyDetails: {
                    ...prev.companyDetails,
                    usesLoanOutCompany: val,
                  },
                }));
              }
            }}
            disabled={isSetupMode ? isSavingSetup : isSavingDetails}
          />

          {(isSetupMode || usesCompany) && (
            <div className="space-y-4">
              <AutoHeight className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableTextDataField
                  label="COMPANY NAME"
                  value={cd?.name}
                  isEditing={isEditingDetails}
                  isRequired
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      companyDetails: { ...prev.companyDetails, name: val },
                    }))
                  }
                  error={errors?.name?.[0]}
                  disabled={
                    (isSetupMode ? isSavingSetup : isSavingDetails) ||
                    certOfIncorpAI.scan.status === "scanning"
                  }
                />

                <EditableTextDataField
                  label="REGISTRATION NUMBER"
                  value={cd?.registrationNumber}
                  isEditing={isEditingDetails}
                  isRequired
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      companyDetails: {
                        ...prev.companyDetails,
                        registrationNumber: val,
                      },
                    }))
                  }
                  error={errors?.registrationNumber?.[0]}
                  disabled={
                    (isSetupMode ? isSavingSetup : isSavingDetails) ||
                    certOfIncorpAI.scan.status === "scanning"
                  }
                />

                <EditableTextDataField
                  label="KT NUMBER"
                  value={cd?.ktNumber}
                  isEditing={isEditingDetails}
                  isRequired={false}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      companyDetails: { ...prev.companyDetails, ktNumber: val },
                    }))
                  }
                  disabled={isSetupMode ? isSavingSetup : isSavingDetails}
                />

                <EditableSelectField
                  label="COUNTRY OF INCORPORATION"
                  value={cd?.countryOfIncorporation}
                  isEditing={isEditingDetails}
                  isRequired
                  items={getCountryOptions()}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      companyDetails: {
                        ...prev.companyDetails,
                        countryOfIncorporation: val,
                      },
                    }))
                  }
                  error={errors?.countryOfIncorporation?.[0]}
                  disabled={
                    (isSetupMode ? isSavingSetup : isSavingDetails) ||
                    certOfIncorpAI.scan.status === "scanning"
                  }
                />
              </AutoHeight>

              {/* AI info + status banners — edit mode only */}
              {isEditingDetails && (
                <>
                  <InfoPanel
                    icon={BrainCircuit}
                    title="AI document scan"
                    variant="info"
                    dismissible
                    storageKey="hide-ai-cert-incorp-info"
                  >
                    <p>
                      Upload your certificate of incorporation to auto-fill the
                      company details above using AI.
                    </p>
                    <p className="text-[11px] opacity-80">
                      Please review all extracted details before saving, as AI
                      may occasionally make mistakes.
                    </p>
                  </InfoPanel>

                  <AIScanBanner
                    status={certOfIncorpAI.scan.status}
                    error={certOfIncorpAI.scan.error}
                    autoFilledCount={certOfIncorpAI.autoFilledCount}
                    conflictCount={certOfIncorpAI.aiConflicts.length}
                  />
                </>
              )}

              {/* Conflict resolution */}
              {isEditingDetails && certOfIncorpAI.aiConflicts.length > 0 && (
                <AIConflictPanel
                  conflicts={certOfIncorpAI.aiConflicts}
                  onAccept={certOfIncorpAI.acceptAISuggestion}
                  onReject={certOfIncorpAI.rejectAISuggestion}
                />
              )}

              <EditableDocumentField
                label="CERTIFICATE OF INCORPORATION"
                isEditing={isEditingDetails}
                isLoading={isFetchingDocs}
                fileName={
                  resolvedCertOfIncorp?.originalName ?? "No file uploaded"
                }
                fileUrl={resolvedCertOfIncorp?.url ?? null}
                isUploaded={!!resolvedCertOfIncorp}
                status={resolvedCertOfIncorp?.verificationStatus || "Pending"}
                secondaryStatuses={[
                  {
                    label: "AI Verification :",
                    value: resolveAIVerificationStatusLabel({
                      scanStatus: certOfIncorpAI.scan.status?.toUpperCase(),
                      verificationStatus:
                        resolvedCertOfIncorp?.aiVerification?.status?.toUpperCase(),
                    }),
                    icon: "Brain",
                  },
                  {
                    label: "Companies House Verification :",
                    value: getGovtVerificationStatusLabel({
                      verificationStatus:
                        resolvedCertOfIncorp?.governmentVerification?.status?.toUpperCase(),
                    }),
                    icon: "Landmark",
                  },
                ]}
                uploadedOn={resolvedCertOfIncorp?.createdAt}
                verifiedAt={resolvedCertOfIncorp?.verifiedAt}
                expiresAt={resolvedCertOfIncorp?.expiresAt}
                meta={formatFileSize(resolvedCertOfIncorp?.sizeBytes)}
                isRequired
                onUpload={handleCertOfIncorpUpload}
                onView={(url) =>
                  handleViewDocument({
                    url,
                    fileName: resolvedCertOfIncorp?.originalName,
                    mimeType: resolvedCertOfIncorp?.mimeType,
                  })
                }
                infoPillDescription="Upload your certificate of incorporation as proof of company registration."
                error={errors?.certificateOfIncorporation?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingDetails}
                secondaryActions={[
                  {
                    label: certOfIncorpAIScanLabel,
                    icon: "Sparkles",
                    variant:
                      certOfIncorpAIStatus === "NOT_SCANNED" ||
                      certOfIncorpAIStatus === "PROCESSING"
                        ? "default"
                        : "outline",
                    onClick: handleCertOfIncorpRescan,
                    disabled:
                      !resolvedCertOfIncorp ||
                      certOfIncorpAI.scan.status === "scanning" ||
                      (isSetupMode ? isSavingSetup : isSavingDetails),
                  },
                ]}
                actionSlot={
                  isEditingDetails &&
                  certOfIncorpDocs?.length > 0 && (
                    <ReuseDocumentPromptPanel
                      label="certificate of incorporation"
                      docs={certOfIncorpDocs}
                      selectedId={reuseDocIds.certificateOfIncorporation}
                      docType="CERTIFICATE_OF_INCORPORATION"
                      onSelect={handleCertOfIncorpReuseSelect}
                      disabled={isSetupMode ? isSavingSetup : isSavingDetails}
                      existingDocId={initialDocIds.certificateOfIncorporation}
                    />
                  )
                }
              />
            </div>
          )}
        </div>
      </CardWrapper>

      {(isSetupMode || usesCompany) && (
        <>
          {/* ── Company Contact / Address ──────────────────────────────────── */}
          <CardWrapper
            title="Company Contact"
            icon="MapPin"
            actions={
              !isSetupMode ? (
                <EditToggleButtons
                  isEditing={isEditingContact}
                  isLoading={isSavingContact}
                  onEdit={() => startEditing("companyContact")}
                  onSave={handleSaveContact}
                  onCancel={cancelEditing}
                />
              ) : null
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableTextDataField
                label="ADDRESS LINE 1"
                value={cc?.addressLine1}
                isEditing={isEditingContact}
                isRequired
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyContact: {
                      ...prev.companyContact,
                      addressLine1: val,
                    },
                  }))
                }
                error={errors?.addressLine1?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingContact}
              />

              <EditableTextDataField
                label="ADDRESS LINE 2"
                value={cc?.addressLine2}
                isEditing={isEditingContact}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyContact: {
                      ...prev.companyContact,
                      addressLine2: val,
                    },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingContact}
              />

              <EditableTextDataField
                label="ADDRESS LINE 3"
                value={cc?.addressLine3}
                isEditing={isEditingContact}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyContact: {
                      ...prev.companyContact,
                      addressLine3: val,
                    },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingContact}
              />

              <EditableTextDataField
                label="POSTCODE"
                value={cc?.postcode}
                isEditing={isEditingContact}
                isRequired
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyContact: {
                      ...prev.companyContact,
                      postcode: val.toUpperCase(),
                    },
                  }))
                }
                error={errors?.postcode?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingContact}
              />

              <EditableSelectField
                label="COUNTRY"
                value={cc?.country}
                isEditing={isEditingContact}
                isRequired
                items={getCountryOptions()}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyContact: { ...prev.companyContact, country: val },
                  }))
                }
                error={errors?.country?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingContact}
              />

              <EditableTextDataField
                label="REPRESENTATIVE NAME"
                value={cc?.representativeName}
                isEditing={isEditingContact}
                isRequired
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyContact: {
                      ...prev.companyContact,
                      representativeName: val,
                    },
                  }))
                }
                error={errors?.representativeName?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingContact}
              />

              <EditableTextDataField
                label="REPRESENTATIVE EMAIL"
                value={cc?.representativeEmail}
                isEditing={isEditingContact}
                isRequired
                type="email"
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyContact: {
                      ...prev.companyContact,
                      representativeEmail: val,
                    },
                  }))
                }
                error={errors?.representativeEmail?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingContact}
              />
            </div>

            <div className="mt-4">
              <EditableSwitchField
                label="Allow third party to sign contracts"
                checked={cc?.allowThirdPartyToSignContracts}
                isEditing={isEditingContact}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyContact: {
                      ...prev.companyContact,
                      allowThirdPartyToSignContracts: val,
                    },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingContact}
              />
            </div>
          </CardWrapper>

          {/* ── Company Tax ───────────────────────────────────────────────── */}
          <CardWrapper
            title="Company Tax"
            icon="Receipt"
            actions={
              !isSetupMode ? (
                <EditToggleButtons
                  isEditing={isEditingTax}
                  isLoading={isSavingTax}
                  onEdit={() => startEditing("companyTax")}
                  onSave={handleSaveTax}
                  onCancel={cancelEditing}
                />
              ) : null
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <EditableSwitchField
                  label="VAT registered"
                  checked={ct?.isVATRegistered}
                  isEditing={isEditingTax}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      companyTax: { ...prev.companyTax, isVATRegistered: val },
                    }))
                  }
                  disabled={isSetupMode ? isSavingSetup : isSavingTax}
                />
              </div>

              {ct?.isVATRegistered && (
                <EditableTextDataField
                  label="VAT NUMBER"
                  value={ct?.vatNumber}
                  isEditing={isEditingTax}
                  prettify={false}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      companyTax: {
                        ...prev.companyTax,
                        vatNumber: val,
                      },
                    }))
                  }
                  error={errors?.vatNumber?.[0]}
                  showErrorDescription={false}
                  disabled={isSavingTax}
                  isRequired={ct?.isVATRegistered}
                />
              )}

              {companyIsInIreland && (
                <>
                  <EditableTextDataField
                    label="TAX REGISTRATION NUMBER"
                    badge={"(IRELAND Specific)"}
                    value={ct?.taxRegistrationNumberIreland}
                    isEditing={isEditingTax}
                    isRequired={false}
                    onChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        companyTax: {
                          ...prev.companyTax,
                          taxRegistrationNumberIreland: val,
                        },
                      }))
                    }
                    disabled={isSetupMode ? isSavingSetup : isSavingTax}
                  />

                  <EditableTextDataField
                    label="TAX CLEARANCE ACCESS NUMBER"
                    badge={"(IRELAND Specific)"}
                    value={ct?.taxClearanceAccessNumberIreland}
                    isEditing={isEditingTax}
                    isRequired={false}
                    onChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        companyTax: {
                          ...prev.companyTax,
                          taxClearanceAccessNumberIreland: val,
                        },
                      }))
                    }
                    disabled={isSetupMode ? isSavingSetup : isSavingTax}
                  />
                </>
              )}

              {ct?.isVATRegistered && (
                <div className="col-span-2">
                  {isEditingTax && (
                    <div className="mb-3">
                      <InfoPanel
                        icon={BrainCircuit}
                        title="AI document scan"
                        variant="info"
                        dismissible
                        storageKey="hide-ai-vat-cert-info"
                      >
                        <p>
                          Upload your VAT certificate to auto-fill the VAT
                          details above using AI.
                        </p>
                        <p className="text-[11px] opacity-80">
                          Please review all extracted details before saving, as
                          AI may occasionally make mistakes.
                        </p>
                      </InfoPanel>
                    </div>
                  )}

                  {isEditingTax && vatCertAI.scan.status !== "idle" && (
                    <div className="mb-3">
                      <AIScanBanner
                        status={vatCertAI.scan.status}
                        error={vatCertAI.scan.error}
                        autoFilledCount={vatCertAI.autoFilledCount}
                        conflictCount={vatCertAI.aiConflicts.length}
                      />
                    </div>
                  )}

                  {/* Conflict resolution */}
                  {isEditingTax && vatCertAI.aiConflicts.length > 0 && (
                    <AIConflictPanel
                      conflicts={vatCertAI.aiConflicts}
                      onAccept={vatCertAI.acceptAISuggestion}
                      onReject={vatCertAI.rejectAISuggestion}
                    />
                  )}

                  <EditableDocumentField
                    label="VAT CERTIFICATE"
                    isEditing={isEditingTax}
                    isLoading={isFetchingDocs}
                    fileName={
                      resolvedVatCert?.originalName ?? "No file uploaded"
                    }
                    fileUrl={resolvedVatCert?.url ?? null}
                    isUploaded={!!resolvedVatCert}
                    status={resolvedVatCert?.verificationStatus || "Pending"}
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
                      {
                        label: "HMRC VAT Verification :",
                        value: getGovtVerificationStatusLabel({
                          verificationStatus:
                            resolvedVatCert?.governmentVerification?.status?.toUpperCase(),
                        }),
                        icon: "Landmark",
                        tooltip:
                          resolvedVatCert?.governmentVerification?.status?.toUpperCase() !==
                          "VERIFIED"
                            ? `${resolvedVatCert?.governmentVerification?.actionReason} An administrator will review this verification.`
                            : undefined,
                      },
                    ]}
                    uploadedOn={resolvedVatCert?.createdAt}
                    verifiedAt={resolvedVatCert?.verifiedAt}
                    expiresAt={resolvedVatCert?.expiresAt}
                    meta={formatFileSize(resolvedVatCert?.sizeBytes)}
                    onUpload={handleVatCertUpload}
                    onView={(url) =>
                      handleViewDocument({
                        url,
                        fileName: resolvedVatCert?.originalName,
                        mimeType: resolvedVatCert?.mimeType,
                      })
                    }
                    infoPillDescription="Upload your VAT registration certificate."
                    error={errors?.vatCertificate?.[0]}
                    disabled={isSetupMode ? isSavingSetup : isSavingTax}
                    secondaryActions={[
                      {
                        label: vatCertAIScanLabel,
                        icon: "Sparkles",
                        variant:
                          vatCertAIStatus === "NOT_SCANNED" ||
                          vatCertAIStatus === "PROCESSING"
                            ? "default"
                            : "outline",
                        onClick: handleVatCertRescan,
                        disabled:
                          !resolvedVatCert ||
                          vatCertAI.scan.status === "scanning" ||
                          (isSetupMode ? isSavingSetup : isSavingTax),
                      },
                    ]}
                    actionSlot={
                      isEditingTax &&
                      vatCertDocs?.length > 0 && (
                        <ReuseDocumentPromptPanel
                          label="VAT certificate"
                          docs={vatCertDocs}
                          selectedId={reuseDocIds.vatCertificate}
                          docType="VAT_CERTIFICATE"
                          onSelect={handleVatCertReuseSelect}
                          disabled={isSetupMode ? isSavingSetup : isSavingTax}
                          existingDocId={initialDocIds.vatCertificate}
                        />
                      )
                    }
                  />
                </div>
              )}
            </div>
          </CardWrapper>

          {/* ── Company Bank ──────────────────────────────────────────────── */}
          <CardWrapper
            title="Company Bank Details"
            icon="Landmark"
            actions={
              !isSetupMode ? (
                <EditToggleButtons
                  isEditing={isEditingBank}
                  isLoading={isSavingBank}
                  onEdit={() => startEditing("companyBank")}
                  onSave={handleSaveBank}
                  onCancel={cancelEditing}
                />
              ) : null
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableTextDataField
                label="BANK NAME"
                value={cb?.bankName}
                isEditing={isEditingBank}
                isRequired
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyBank: { ...prev.companyBank, bankName: val },
                  }))
                }
                error={errors?.bankName?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingBank}
              />

              <EditableTextDataField
                label="BRANCH"
                value={cb?.branch}
                isEditing={isEditingBank}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyBank: { ...prev.companyBank, branch: val },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingBank}
              />

              <EditableTextDataField
                label="ACCOUNT NAME"
                value={cb?.accountName}
                isEditing={isEditingBank}
                isRequired
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyBank: { ...prev.companyBank, accountName: val },
                  }))
                }
                error={errors?.accountName?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingBank}
              />

              <EditableTextDataField
                label="ACCOUNT NUMBER"
                value={cb?.accountNumber}
                isEditing={isEditingBank}
                isRequired
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyBank: { ...prev.companyBank, accountNumber: val },
                  }))
                }
                error={errors?.accountNumber?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingBank}
              />

              <EditableTextDataField
                label="SORT CODE"
                value={cb?.sortCode}
                isEditing={isEditingBank}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyBank: { ...prev.companyBank, sortCode: val },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingBank}
              />

              <EditableTextDataField
                label="IBAN"
                value={cb?.iban}
                isEditing={isEditingBank}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyBank: {
                      ...prev.companyBank,
                      iban: val.toUpperCase(),
                    },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingBank}
              />

              <EditableTextDataField
                label="SWIFT / BIC"
                value={cb?.swiftBic}
                isEditing={isEditingBank}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    companyBank: {
                      ...prev.companyBank,
                      swiftBic: val.toUpperCase(),
                    },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingBank}
              />

              {companyIsInIceland && (
                <>
                  <EditableTextDataField
                    label="BANK NUMBER"
                    badge={"(ICELAND Specific)"}
                    value={cb?.bankNumberIceland}
                    isEditing={isEditingBank}
                    isRequired={false}
                    onChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        companyBank: {
                          ...prev.companyBank,
                          bankNumberIceland: val.toUpperCase(),
                        },
                      }))
                    }
                    disabled={isSetupMode ? isSavingSetup : isSavingBank}
                  />

                  <EditableTextDataField
                    label="BANK HB (ICELAND)"
                    badge={"(ICELAND Specific)"}
                    value={cb?.bankHBIceland}
                    isEditing={isEditingBank}
                    isRequired={false}
                    onChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        companyBank: {
                          ...prev.companyBank,
                          bankHBIceland: val.toUpperCase(),
                        },
                      }))
                    }
                    disabled={isSetupMode ? isSavingSetup : isSavingBank}
                  />
                </>
              )}
            </div>
          </CardWrapper>
        </>
      )}
    </>
  );
}
