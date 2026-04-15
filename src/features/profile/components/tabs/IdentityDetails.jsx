import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileUpload } from "../common/UnifiedFields";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableDateField from "@/shared/components/wrappers/EditableDateField";
import EditableRadioField from "@/shared/components/wrappers/EditableRadioField";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "../../../../shared/components/buttons/EditToggleButtons";
import {
  fetchProfileThunk,
  updatePersonalDetailsThunk,
  updateNationalityProofThunk,
} from "../../store/crew/crewProfile.thunk";
import { fetchDocumentsThunk } from "../../../user-documents/store/document.thunk";
import {
  getDisplayDocument,
  getDocumentsByType,
  getResolvedDocument,
} from "../../../user-documents/store/document.selector";
import ProfileCardLoadingSkelton from "../skeltons/ProfileCardLoadingSkelton";
import ProfileCardErrorSkelton from "../skeltons/ProfileCardErrorSkelton";
import {
  nationalityProofSchema,
  personalDetailsSchema,
} from "../../config/profileValidationShemas";
import { toast } from "sonner";
import { CheckCircle, FileText, Info, Paperclip } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { convertToPrettyText } from "../../../../shared/config/utils";

const ReuseDocumentPrompt = ({ label, docs, selectedId, onSelect }) => {
  if (!docs?.length) return null;
  const isSelected = (docId) => String(docId) === String(selectedId);
  const selectedDoc = docs.find(
    (doc) => String(doc._id) === String(selectedId),
  );
  return (
    <div className="border rounded-xl p-3 bg-gray-50 space-y-2">
      <p className="text-sm font-medium">
        Already uploaded {label} before. Would You like to reuse one?
      </p>

      <div className="flex flex-wrap gap-2">
        {docs.map((doc) => (
          <Button
            key={doc._id}
            type="button"
            variant={"outline"}
            onClick={() => {
              isSelected(doc._id) ? onSelect(null) : onSelect(doc._id);
            }}
            className={`${
              isSelected(doc._id) ? "bg-primary text-white" : "bg-white"
            }`}
          >
            <Paperclip />
            {convertToPrettyText(doc.originalName)}
          </Button>
        ))}
      </div>
      {selectedId && (
        <p className="text-xs font-medium flex items-center gap-1 text-green-500">
          <Info className="size-3" />
          Reusing Existing {label}:{" "}
          {convertToPrettyText(selectedDoc?.originalName)}
        </p>
      )}
    </div>
  );
};

export default function IdentityDetails() {
  const [isEditing, setIsEditing] = useState({ section: null });
  const [formState, setFormState] = useState({
    personal: null,
    identity: null,
  });
  const [files, setFiles] = useState({
    passport: null,
    birthCertificate: null,
    niProof: null,
    certificateNaturalisation: null,
  });
  const [reuseDocIds, setReuseDocIds] = useState({
    passport: null,
    birthCertificate: null,
    niProof: null,
    certificateNaturalisation: null,
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { crewProfile, isFetching, isUpdating, error } = useSelector(
    (state) => state.crewProfile,
  );
  const { userDocuments, isFetching: isFetchingDocs } = useSelector(
    (state) => state.userDocuments,
  );
  const { currentUser } = useSelector((state) => state.user);

  const appendIfExists = (fd, key, value) => {
    if (value !== undefined && value !== null && value !== "") {
      fd.append(key, value);
    }
  };

  useEffect(() => {
    if (!crewProfile && !isFetching) {
      dispatch(fetchProfileThunk());
    }
  }, [crewProfile, isFetching]);

  useEffect(() => {
    if (!userDocuments && !isFetchingDocs) {
      dispatch(fetchDocumentsThunk());
    }
  }, [userDocuments, isFetchingDocs]);

  console.log("crew profile", crewProfile);
  console.log("user documents", userDocuments);

  const initialFilesState = {
    passport: null,
    birthCertificate: null,
    niProof: null,
    certificateNaturalisation: null,
  };
  const np = crewProfile?.nationalityProof;

  const passportDocs = getDocumentsByType(userDocuments, "PASSPORT");
  const birthDocs = getDocumentsByType(userDocuments, "BIRTH_CERTIFICATE");
  const niDocs = getDocumentsByType(userDocuments, "NI_PROOF");
  const naturalisationDocs = getDocumentsByType(
    userDocuments,
    "CERTIFICATE_NATURALISATION",
  );

  const resolvedPassport = getDisplayDocument(
    np?.passport?.passportDocumentId,
    reuseDocIds.passport,
    files.passport,
    userDocuments,
  );
  const resolvedBirthCert = getResolvedDocument(
    userDocuments,
    np?.birthCertificateId,
  );
  const resolvedNiProof = getResolvedDocument(userDocuments, np?.niProofId);
  const resolvedNaturalisation = getResolvedDocument(
    userDocuments,
    np?.certificateNaturalisationId,
  );

  const isEditingPersonal = isEditing.section === "personal";
  const isEditingIdentity = isEditing.section === "identity";
  const isSavingPersonal = isUpdating && isEditing.section === "personal";
  const isSavingIdentity = isUpdating && isEditing.section === "identity";

  const pd = isEditingPersonal
    ? formState.personal
    : {
        title: crewProfile?.title ?? null,
        legalFirstName: currentUser?.legalFirstName ?? "",
        legalLastName: currentUser?.legalLastName ?? "",
        middleNames: crewProfile?.middleNames ?? "",
        screenCreditName: crewProfile?.screenCreditName ?? "",
        displayNamePreference:
          crewProfile?.displayNamePreference ?? "FIRST_NAME",
        customDisplayName: crewProfile?.customDisplayName ?? "",
        pronouns: crewProfile?.pronouns ?? null,
        sex: crewProfile?.sex ?? null,
        dateOfBirth: crewProfile?.dateOfBirth ?? null,
        countryOfPermanentResidence:
          crewProfile?.countryOfPermanentResidence ?? "",
        countryOfLegalNationality: crewProfile?.countryOfLegalNationality ?? "",
      };

  const nd = isEditingIdentity
    ? formState.identity
    : {
        type: np?.type ?? null,

        passport: {
          firstName: np?.passport?.firstName ?? "",
          lastName: np?.passport?.lastName ?? "",
          number: np?.passport?.number ?? "",
          issuingCountry: np?.passport?.issuingCountry ?? "",
          expiryDate: np?.passport?.expiryDate ?? null,
          passportDocumentId: np?.passport?.passportDocumentId ?? null,
        },

        birthCertificateId: np?.birthCertificateId ?? null,
        niProofId: np?.niProofId ?? null,
        certificateNaturalisationId: np?.certificateNaturalisationId ?? null,
      };

  const startEditing = (section) => {
    setErrors({});

    if (section === "personal") {
      setFormState((prev) => ({
        ...prev,
        personal: {
          title: crewProfile?.title ?? null,
          legalFirstName: currentUser?.legalFirstName ?? "",
          legalLastName: currentUser?.legalLastName ?? "",
          middleNames: crewProfile?.middleNames ?? "",
          screenCreditName: crewProfile?.screenCreditName ?? "",
          displayNamePreference:
            crewProfile?.displayNamePreference ?? "FIRST_NAME",
          customDisplayName: crewProfile?.customDisplayName ?? "",
          pronouns: crewProfile?.pronouns ?? null,
          sex: crewProfile?.sex ?? null,
          dateOfBirth: crewProfile?.dateOfBirth ?? null,
          countryOfPermanentResidence:
            crewProfile?.countryOfPermanentResidence ?? "",
          countryOfLegalNationality:
            crewProfile?.countryOfLegalNationality ?? "",
        },
      }));
    }

    if (section === "identity") {
      setFormState((prev) => ({
        ...prev,
        identity: {
          type: np?.type ?? null,
          passport: {
            firstName: np?.passport?.firstName ?? "",
            lastName: np?.passport?.lastName ?? "",
            number: np?.passport?.number ?? "",
            issuingCountry: np?.passport?.issuingCountry ?? "",
            expiryDate: np?.passport?.expiryDate ?? null,
          },
        },
      }));

      setFiles(initialFilesState);
      setReuseDocIds({
        passport: null,
        birthCertificate: null,
        niProof: null,
        certificateNaturalisation: null,
      });
    }

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setFormState({ personal: null, identity: null });
    setErrors({});
    setFiles(initialFilesState);
    setReuseDocIds({
      passport: null,
      birthCertificate: null,
      niProof: null,
      certificateNaturalisation: null,
    });
  };

  const handleSavePersonal = async () => {
    const result = personalDetailsSchema.safeParse(formState.personal);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    try {
      await dispatch(updatePersonalDetailsThunk(result.data)).unwrap();
      toast.success("Personal details updated successfully");

      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update personal details");
    }
  };

  const handleSaveNationality = async () => {
    const result = nationalityProofSchema.safeParse(formState.identity);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const fd = new FormData();
    const data = formState.identity;

    if (data.type) {
      fd.append("type", data.type);
    }

    if (data.type === "PASSPORT") {
      const p = data.passport ?? {};

      fd.append("passport", JSON.stringify(p));

      if (files.passport) {
        fd.append("passport", files.passport);
      } else if (reuseDocIds.passport) {
        fd.append("passportDocumentId", reuseDocIds.passport);
      }
    }

    if (data.type === "BIRTH_CERTIFICATE") {
      if (files.birthCertificate) {
        fd.append("birthCertificate", files.birthCertificate);
      } else if (reuseDocIds.birthCertificate) {
        fd.append("birthCertificateId", reuseDocIds.birthCertificate);
      }
      if (files.niProof) {
        fd.append("niProof", files.niProof);
      } else if (reuseDocIds.niProof) {
        fd.append("niProofId", reuseDocIds.niProof);
      }
    }

    if (data.type === "CERTIFICATE_OF_NATURALISATION") {
      if (files.certificateNaturalisation) {
        fd.append("certificateNaturalisation", files.certificateNaturalisation);
      } else if (reuseDocIds.certificateNaturalisation) {
        fd.append(
          "certificateNaturalisationId",
          reuseDocIds.certificateNaturalisation,
        );
      }
      if (files.niProof) {
        fd.append("niProof", files.niProof);
      } else if (reuseDocIds.niProof) {
        fd.append("niProofId", reuseDocIds.niProof);
      }
    }

    try {
      await dispatch(updateNationalityProofThunk(fd)).unwrap();
      toast.success("Nationality proof updated successfully");

      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update identity proof");
    }
  };

  if (isFetching) {
    return (
      <>
        <ProfileCardLoadingSkelton fields={11} columns={3} />
        <ProfileCardLoadingSkelton fields={11} columns={3} />
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
        title="Personal Details"
        icon="User2"
        actions={
          <EditToggleButtons
            isEditing={isEditingPersonal}
            isLoading={isSavingPersonal}
            onEdit={() => startEditing("personal")}
            onSave={handleSavePersonal}
            onCancel={cancelEditing}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EditableSelectField
            label="TITLE"
            value={pd?.title}
            isEditing={isEditingPersonal}
            items={[
              { label: "MR", value: "MR" },
              { label: "MS", value: "MS" },
              { label: "MRS", value: "MRS" },
              { label: "DR", value: "DR" },
              { label: "PROF", value: "PROF" },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                personal: { ...prev.personal, title: val },
              }))
            }
            error={errors?.title?.[0]}
          />

          <EditableTextDataField
            label="LEGAL FIRST NAME"
            value={pd?.legalFirstName}
            isEditing={isEditingPersonal}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  legalFirstName: val,
                },
              }))
            }
            error={errors?.legalFirstName?.[0]}
          />

          <EditableTextDataField
            label="LEGAL LAST NAME"
            value={pd?.legalLastName}
            isEditing={isEditingPersonal}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  legalLastName: val,
                },
              }))
            }
            error={errors?.legalLastName?.[0]}
          />

          <EditableTextDataField
            label="MIDDLE NAMES"
            value={pd?.middleNames}
            placeholder="OPTIONAL"
            isEditing={isEditingPersonal}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  middleNames: val,
                },
              }))
            }
            error={errors?.middleNames?.[0]}
            isRequired={false}
          />

          <EditableTextDataField
            label="SCREEN CREDIT NAME"
            value={pd?.screenCreditName}
            isEditing={isEditingPersonal}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  screenCreditName: val,
                },
              }))
            }
            error={errors?.screenCreditName?.[0]}
            isRequired={false}
          />

          <EditableSelectField
            label="DISPLAY NAME PREFERENCE"
            value={pd?.displayNamePreference}
            isEditing={isEditingPersonal}
            items={[
              { label: "FIRST NAME", value: "FIRST_NAME" },
              { label: "LAST NAME", value: "LAST_NAME" },
              { label: "FULL NAME", value: "FULL_NAME" },
              { label: "SCREEN CREDIT NAME", value: "SCREEN_NAME" },
              { label: "CUSTOM", value: "CUSTOM" },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  displayNamePreference: val,
                },
              }))
            }
            error={errors?.displayNamePreference?.[0]}
          />

          {pd?.displayNamePreference === "CUSTOM" && (
            <EditableTextDataField
              label="DISPLAY NAME"
              value={pd?.customDisplayName}
              isEditing={isEditingPersonal}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    customDisplayName: val,
                  },
                }))
              }
              error={errors?.customDisplayName?.[0]}
            />
          )}

          <EditableSelectField
            label="PRONOUNS"
            value={pd?.pronouns}
            isEditing={isEditingPersonal}
            items={[
              { label: "HE / HIM / HIS", value: "HE / HIM / HIS" },
              { label: "SHE / HER / HERS", value: "SHE / HER / HERS" },
              { label: "THEY / THEM / THEIRS", value: "THEY / THEM / THEIRS" },
              { label: "PREFER NOT TO SAY", value: "PREFER NOT TO SAY" },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                personal: { ...prev.personal, pronouns: val },
              }))
            }
            error={errors?.pronouns?.[0]}
          />

          <EditableSelectField
            label="SEX"
            value={pd?.sex}
            isEditing={isEditingPersonal}
            items={[
              { label: "MALE", value: "MALE" },
              { label: "FEMALE", value: "FEMALE" },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                personal: { ...prev.personal, sex: val },
              }))
            }
            error={errors?.sex?.[0]}
          />

          <EditableDateField
            label="DATE OF BIRTH"
            value={pd?.dateOfBirth}
            isEditing={isEditingPersonal}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                personal: { ...prev.personal, dateOfBirth: val },
              }))
            }
            error={errors?.dateOfBirth?.[0]}
          />

          <EditableSelectField
            label="COUNTRY OF RESIDENCE"
            value={pd?.countryOfPermanentResidence}
            isEditing={isEditingPersonal}
            items={[
              { label: "UNITED KINGDOM", value: "UNITED KINGDOM" },
              { label: "USA", value: "USA" },
              { label: "CANADA", value: "CANADA" },
              { label: "AUSTRALIA", value: "AUSTRALIA" },
              { label: "INDIA", value: "INDIA" },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  countryOfPermanentResidence: val,
                },
              }))
            }
            error={errors?.countryOfPermanentResidence?.[0]}
          />

          <EditableSelectField
            label="NATIONALITY"
            value={pd?.countryOfLegalNationality}
            isEditing={isEditingPersonal}
            items={[
              { label: "UNITED KINGDOM", value: "UNITED KINGDOM" },
              { label: "USA", value: "USA" },
              { label: "CANADA", value: "CANADA" },
              { label: "AUSTRALIA", value: "AUSTRALIA" },
              { label: "INDIA", value: "INDIA" },
            ]}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  countryOfLegalNationality: val,
                },
              }))
            }
            error={errors?.countryOfLegalNationality?.[0]}
          />
        </div>
      </CardWrapper>

      <CardWrapper
        title="Proof of Identity"
        icon="IdCard"
        actions={
          <EditToggleButtons
            isEditing={isEditingIdentity}
            isLoading={isSavingIdentity}
            onEdit={() => startEditing("identity")}
            onSave={handleSaveNationality}
            onCancel={cancelEditing}
          />
        }
      >
        <div className="space-y-4">
          <EditableRadioField
            label="PROOF OF NATIONALITY"
            value={nd?.type}
            isEditing={isEditingIdentity}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                identity: { ...prev.identity, type: val },
              }))
            }
            options={[
              { label: "PASSPORT", value: "PASSPORT" },
              { label: "BIRTH CERTIFICATE", value: "BIRTH_CERTIFICATE" },
              {
                label: "CERTIFICATE OF REGISTRATION OR NATURALISATION",
                value: "CERTIFICATE_OF_NATURALISATION",
              },
            ]}
          />
          {nd?.type === "PASSPORT" && (
            <div className="mt-6 space-y-4 rounded-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <EditableTextDataField
                  label="PASSPORT FIRST NAME"
                  value={nd?.passport?.firstName}
                  isEditing={isEditingIdentity}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      identity: {
                        ...prev.identity,
                        passport: {
                          ...prev.identity.passport,
                          firstName: val,
                        },
                      },
                    }))
                  }
                  error={errors?.passport?.firstName?.[0]}
                />
                <EditableTextDataField
                  label="PASSPORT LAST NAME"
                  value={nd?.passport?.lastName}
                  isEditing={isEditingIdentity}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      identity: {
                        ...prev.identity,
                        passport: {
                          ...prev.identity.passport,
                          lastName: val,
                        },
                      },
                    }))
                  }
                  error={errors?.passport?.lastName?.[0]}
                />
                <EditableSelectField
                  label="PASSPORT ISSUING COUNTRY"
                  value={nd?.passport?.issuingCountry}
                  isEditing={isEditingIdentity}
                  items={[
                    { label: "UNITED KINGDOM", value: "UNITED KINGDOM" },
                    { label: "USA", value: "USA" },
                    { label: "CANADA", value: "CANADA" },
                    { label: "AUSTRALIA", value: "AUSTRALIA" },
                    { label: "INDIA", value: "INDIA" },
                  ]}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      identity: {
                        ...prev.identity,
                        passport: {
                          ...prev.identity.passport,
                          issuingCountry: val,
                        },
                      },
                    }))
                  }
                  error={errors?.passport?.issuingCountry?.[0]}
                />
                <EditableTextDataField
                  label="PASSPORT NUMBER"
                  value={nd?.passport?.number}
                  isEditing={isEditingIdentity}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      identity: {
                        ...prev.identity,
                        passport: {
                          ...prev.identity.passport,
                          number: val.toUpperCase(),
                        },
                      },
                    }))
                  }
                  error={errors?.passport?.number?.[0]}
                />
                <EditableDateField
                  label="PASSPORT EXPIRY DATE"
                  value={nd?.passport?.expiryDate}
                  isEditing={isEditingIdentity}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      identity: {
                        ...prev.identity,
                        passport: {
                          ...prev.identity.passport,
                          expiryDate: val,
                        },
                      },
                    }))
                  }
                  error={errors?.passport?.expiryDate?.[0]}
                />
              </div>

              {isEditingIdentity && passportDocs?.length > 0 && (
                <ReuseDocumentPrompt
                  label="passport document"
                  docs={userDocuments}
                  selectedId={reuseDocIds.passport}
                  onSelect={(id) => {
                    setReuseDocIds((prev) => ({ ...prev, passport: id }));
                    if (id) setFiles((f) => ({ ...f, passport: null }));
                  }}
                />
              )}

              <FileUpload
                label="PASSPORT DOCUMENT"
                infoPillDescription="Upload a clear copy of your passport. This is used to verify your identity and nationality."
                fileName={resolvedPassport?.originalName ?? "No file uploaded"}
                fileUrl={resolvedPassport?.url ?? null}
                isUploaded={!!resolvedPassport}
                isEditing={isEditingIdentity && !reuseDocIds.passport}
                onUpload={(file) => setFiles((f) => ({ ...f, passport: file }))}
                onDelete={() => setFiles((f) => ({ ...f, passport: null }))}
              />
            </div>
          )}
          {nd?.type === "BIRTH_CERTIFICATE" && (
            <div className="mt-6 grid grid-cols-1 gap-4">
              {isEditingIdentity &&
                !resolvedBirthCert &&
                birthDocs?.length > 0 && (
                  <ReuseDocumentPrompt
                    label="birth certificate"
                    docs={birthDocs}
                    selectedId={reuseDocIds.birthCertificate}
                    onSelect={(id) => {
                      setReuseDocIds((prev) => ({
                        ...prev,
                        birthCertificate: id,
                      }));

                      if (id) {
                        setFiles((f) => ({
                          ...f,
                          birthCertificate: null,
                        }));
                      }
                    }}
                  />
                )}

              <FileUpload
                label="BIRTH CERTIFICATE"
                infoPillDescription="Upload your birth certificate as proof of nationality."
                fileName={resolvedBirthCert?.originalName ?? "No file uploaded"}
                fileUrl={resolvedBirthCert?.url ?? null}
                isUploaded={!!resolvedBirthCert}
                isEditing={isEditingIdentity && !reuseDocIds.birthCertificate}
                onUpload={(file) =>
                  setFiles((f) => ({ ...f, birthCertificate: file }))
                }
                onDelete={() =>
                  setFiles((f) => ({ ...f, birthCertificate: null }))
                }
              />

              {isEditingIdentity && !resolvedNiProof && niDocs?.length > 0 && (
                <ReuseDocumentPrompt
                  label="national insurance proof"
                  docs={niDocs}
                  selectedId={reuseDocIds.niProof}
                  onSelect={(id) => {
                    setReuseDocIds((prev) => ({
                      ...prev,
                      niProof: id,
                    }));

                    if (id) {
                      setFiles((f) => ({
                        ...f,
                        niProof: null,
                      }));
                    }
                  }}
                />
              )}

              <FileUpload
                label="NATIONAL INSURANCE PROOF"
                infoPillDescription="Upload a valid NI document to support identity and employment verification."
                fileName={resolvedNiProof?.originalName ?? "No file uploaded"}
                fileUrl={resolvedNiProof?.url ?? null}
                isUploaded={!!resolvedNiProof}
                isEditing={isEditingIdentity && !reuseDocIds.niProof}
                onUpload={(file) => setFiles((f) => ({ ...f, niProof: file }))}
                onDelete={() => setFiles((f) => ({ ...f, niProof: null }))}
              />
            </div>
          )}{" "}
          {/* ── Certificate of Naturalisation ─────────────────────────────── */}{" "}
          {nd?.type === "CERTIFICATE_OF_NATURALISATION" && (
            <div className="mt-6 grid grid-cols-1 gap-4">
              {isEditingIdentity &&
                !resolvedNaturalisation &&
                naturalisationDocs?.length > 0 && (
                  <ReuseDocumentPrompt
                    label="certificate of naturalisation"
                    docs={naturalisationDocs}
                    selectedId={reuseDocIds.certificateNaturalisation}
                    onSelect={(id) => {
                      setReuseDocIds((prev) => ({
                        ...prev,
                        certificateNaturalisation: id,
                      }));

                      if (id) {
                        setFiles((f) => ({
                          ...f,
                          certificateNaturalisation: null,
                        }));
                      }
                    }}
                  />
                )}

              <FileUpload
                label="CERTIFICATE OF NATURALISATION"
                infoPillDescription="Upload your certificate of registration or naturalisation as proof of legal nationality."
                fileName={
                  resolvedNaturalisation?.originalName ?? "No file uploaded"
                }
                fileUrl={resolvedNaturalisation?.url ?? null}
                isUploaded={!!resolvedNaturalisation}
                isEditing={
                  isEditingIdentity && !reuseDocIds.certificateNaturalisation
                }
                onUpload={(file) =>
                  setFiles((f) => ({ ...f, certificateNaturalisation: file }))
                }
                onDelete={() =>
                  setFiles((f) => ({ ...f, certificateNaturalisation: null }))
                }
              />

              {isEditingIdentity && !resolvedNiProof && niDocs?.length > 0 && (
                <ReuseDocumentPrompt
                  label="national insurance proof"
                  docs={niDocs}
                  selectedId={reuseDocIds.niProof}
                  onSelect={(id) => {
                    setReuseDocIds((prev) => ({
                      ...prev,
                      niProof: id,
                    }));

                    if (id) {
                      setFiles((f) => ({
                        ...f,
                        niProof: null,
                      }));
                    }
                  }}
                />
              )}
              <FileUpload
                label="NATIONAL INSURANCE PROOF"
                infoPillDescription="Upload a valid NI document to support identity and employment verification."
                fileName={resolvedNiProof?.originalName ?? "No file uploaded"}
                fileUrl={resolvedNiProof?.url ?? null}
                isUploaded={!!resolvedNiProof}
                isEditing={isEditingIdentity && !reuseDocIds.niProof}
                onUpload={(file) => setFiles((f) => ({ ...f, niProof: file }))}
                onDelete={() => setFiles((f) => ({ ...f, niProof: null }))}
              />
            </div>
          )}{" "}
        </div>{" "}
      </CardWrapper>
    </>
  );
}
