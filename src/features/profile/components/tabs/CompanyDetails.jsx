import { useEffect, useState } from "react";
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
import { removeCompanyDetailsConfig } from "../../../../shared/config/ConfirmActionsConfig";

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
  const conpanyisInIreland = cd?.countryOfIncorporation === "IE";
  const conpanyisInIceland = cd?.countryOfIncorporation === "IS";

  // ── Resolved documents ────────────────────────────────────────────────────
  const resolvedCertOfIncorp = getDisplayDocument(
    company?.certificateOfIncorporationId,
    reuseDocIds.certificateOfIncorporation,
    files.certificateOfIncorporation,
    userDocuments,
  );

  console.log("resolvedCertOfIncorp:", resolvedCertOfIncorp);

  const resolvedVatCert = getDisplayDocument(
    company?.vatCertificateId,
    reuseDocIds.vatCertificate,
    files.vatCertificate,
    userDocuments,
  );

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

    // Seed reuse IDs from current profile for document sections
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
  };

  // ── Build FormData helper ─────────────────────────────────────────────────
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

  // ── Save handlers ─────────────────────────────────────────────────────────

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
      _meta: {
        files,
        reuseDocIds,
      },
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

    try {
      await dispatch(setupCompanyThunk(fd)).unwrap();
      toast.success("Company setup complete", {
        description: "You can update each section individually anytime.",
      });
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to complete company setup");
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
      const payload = {
        usesLoanOutCompany: false,
      };

      openModal(MODAL_TYPES.CONFIRM_ACTION, {
        config: removeCompanyDetailsConfig,
        onConfirm: async () => {
          closeModal();
          try {
            await dispatch(updateCompanyDetailsThunk(payload)).unwrap();
            toast.success("Company details updated successfully");
            cancelEditing();
          } catch (err) {
            toast.error(err?.message || "Failed to update company details");
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

    try {
      await dispatch(updateCompanyDetailsThunk(fd)).unwrap();
      toast.success("Company details updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update company details");
    }
  };

  const handleSaveContact = async () => {
    setErrors({});
    const result = companyContactSchema.safeParse(formState.companyContact);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const payload = {
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
    };

    try {
      await dispatch(updateCompanyContactThunk(payload)).unwrap();
      toast.success("Company contact updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update company contact");
    }
  };

  const handleSaveTax = async () => {
    setErrors({});
    const result = companyTaxSchema.safeParse(formState.companyTax);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const fd = buildFormData(
      {
        isVATRegistered: formState.companyTax.isVATRegistered,
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

    try {
      await dispatch(updateCompanyTaxThunk(fd)).unwrap();
      toast.success("Company tax updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update company tax");
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
      toast.error(err?.message || "Failed to update company bank");
    }
  };

  const handleViewDocument = ({ url, fileName, mimeType }) => {
    if (!url) return;

    const isImage = mimeType?.startsWith("image/");

    if (isImage) {
      openModal(MODAL_TYPES.IMAGE_PREVIEW, {
        imageFile: { url },
      });
    } else {
      openModal(MODAL_TYPES.DOCUMENT_PREVIEW, {
        fileUrl: url,
        fileName,
      });
    }
  };

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

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Company Details ──────────────────────────────────────────────── */}
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
            onSave={isSetupMode ? handleSaveSetup : handleSaveDetails}
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
                  disabled={isSetupMode ? isSavingSetup : isSavingDetails}
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
                  disabled={isSetupMode ? isSavingSetup : isSavingDetails}
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
                  disabled={isSetupMode ? isSavingSetup : isSavingDetails}
                />
              </AutoHeight>

              <EditableDocumentField
                label="CERTIFICATE OF INCORPORATION"
                isEditing={isEditingDetails}
                fileName={
                  resolvedCertOfIncorp?.originalName ?? "No file uploaded"
                }
                fileUrl={resolvedCertOfIncorp?.url ?? null}
                isUploaded={!!resolvedCertOfIncorp}
                status={resolvedCertOfIncorp?.verificationStatus || "Pending"}
                expiresAt={resolvedCertOfIncorp?.expiresAt}
                meta={
                  resolvedCertOfIncorp?.sizeBytes
                    ? `${(resolvedCertOfIncorp.sizeBytes / 1024 / 1024).toFixed(1)} MB`
                    : null
                }
                isRequired
                onUpload={(file) => {
                  setFiles((f) => ({ ...f, certificateOfIncorporation: file }));
                  setReuseDocIds((f) => ({
                    ...f,
                    certificateOfIncorporation: null,
                  }));
                }}
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
                actionSlot={
                  isEditingDetails &&
                  certOfIncorpDocs?.length > 0 && (
                    <ReuseDocumentPromptPanel
                      label="certificate of incorporation"
                      docs={certOfIncorpDocs}
                      selectedId={reuseDocIds.certificateOfIncorporation}
                      docType="CERTIFICATE_OF_INCORPORATION"
                      onSelect={(id) => {
                        setReuseDocIds((prev) => ({
                          ...prev,
                          certificateOfIncorporation: id,
                        }));
                        if (id)
                          setFiles((f) => ({
                            ...f,
                            certificateOfIncorporation: null,
                          }));
                      }}
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
              {conpanyisInIreland && (
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
                <div className="xl:col-span-2 2xl:col-span-1">
                  <EditableDocumentField
                    label="VAT CERTIFICATE"
                    isEditing={isEditingTax}
                    fileName={
                      resolvedVatCert?.originalName ?? "No file uploaded"
                    }
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
                      setFiles((f) => ({ ...f, vatCertificate: file }));
                      setReuseDocIds((f) => ({ ...f, vatCertificate: null }));
                    }}
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
                    actionSlot={
                      isEditingTax &&
                      vatCertDocs?.length > 0 && (
                        <ReuseDocumentPromptPanel
                          label="VAT certificate"
                          docs={vatCertDocs}
                          selectedId={reuseDocIds.vatCertificate}
                          docType="VAT_CERTIFICATE"
                          onSelect={(id) => {
                            setReuseDocIds((prev) => ({
                              ...prev,
                              vatCertificate: id,
                            }));
                            if (id)
                              setFiles((f) => ({ ...f, vatCertificate: null }));
                          }}
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

              {conpanyisInIceland && (
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
