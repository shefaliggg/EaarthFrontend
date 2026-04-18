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
import ReuseDocumentPromptPanel from "../common/ReuseDocumentPromptPanel";
import { getCountryOptions } from "../../../../shared/config/countriesDataConfig";
import EditableDocumentField from "../../../../shared/components/wrappers/EditableDocumentField";
import {
  MODAL_TYPES,
  useModalStore,
} from "../../../../shared/stores/useModalStore";

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
  const [initialDocIds, setInitialDocIds] = useState({
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
  const { openModal, closeModal } = useModalStore();

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
  console.log("resolved passport:", resolvedPassport)
  const resolvedBirthCert = getDisplayDocument(
    np?.birthCertificateId,
    reuseDocIds.birthCertificate,
    files.birthCertificate,
    userDocuments,
  );
  const resolvedNiProof = getDisplayDocument(
    np?.niProofId,
    reuseDocIds.niProof,
    files.niProof,
    userDocuments,
  );
  const resolvedNaturalisation = getDisplayDocument(
    np?.certificateNaturalisationId,
    reuseDocIds.certificateNaturalisation,
    files.certificateNaturalisation,
    userDocuments,
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

      setInitialDocIds({
        passport: np?.passport?.passportDocumentId ?? null,
        birthCertificate: np?.birthCertificateId ?? null,
        niProof: np?.niProofId ?? null,
        certificateNaturalisation: np?.certificateNaturalisationId ?? null,
      });
      setReuseDocIds({
        passport: np?.passport?.passportDocumentId ?? null,
        birthCertificate: np?.birthCertificateId ?? null,
        niProof: np?.niProofId ?? null,
        certificateNaturalisation: np?.certificateNaturalisationId ?? null,
      });
    }

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setFormState({ personal: null, identity: null });
    setErrors({});
    setFiles(initialFilesState);
    setInitialDocIds({
      passport: null,
      birthCertificate: null,
      niProof: null,
      certificateNaturalisation: null,
    });
    setReuseDocIds({
      passport: null,
      birthCertificate: null,
      niProof: null,
      certificateNaturalisation: null,
    });
  };

  const handleSavePersonal = async () => {
    setErrors({});
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
    setErrors({});

    const result = nationalityProofSchema.safeParse({
      ...formState.identity,
      _meta: {
        legalFirstName: currentUser.legalFirstName,
        legalLastName: currentUser.legalLastName,
        files,
        reuseDocIds,
      },
    });

    if (!result.success) {
      setErrors(result.error.format());
      console.log("Validation failed:", errors);
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

    console.log("Sending identity payload:");
    for (let [key, value] of fd.entries()) {
      console.log(key, value);
    }

    try {
      await dispatch(updateNationalityProofThunk(fd)).unwrap();
      toast.success("Nationality proof updated successfully");

      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update identity proof");
    }
  };

  const handleViewDocument = ({ url, fileName }) => {
    if (!url) return;

    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(url);

    if (isImage) {
      openModal(MODAL_TYPES.IMAGE_PREVIEW, {
        imageFile: url,
      });
    } else {
      openModal(MODAL_TYPES.DOCUMENT_PREVIEW, {
        fileUrl: url,
        fileName,
      });
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
            disabled={isSavingPersonal}
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
            disabled={isSavingPersonal}
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
            disabled={isSavingPersonal}
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
            disabled={isSavingPersonal}
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
            disabled={isSavingPersonal}
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
            disabled={isSavingPersonal}
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
              disabled={isSavingPersonal}
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
            disabled={isSavingPersonal}
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
            disabled={isSavingPersonal}
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
            disabled={isSavingPersonal}
          />

          <EditableSelectField
            label="COUNTRY OF RESIDENCE"
            value={pd?.countryOfPermanentResidence}
            isEditing={isEditingPersonal}
            items={getCountryOptions()}
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
            disabled={isSavingPersonal}
          />

          <EditableSelectField
            label="NATIONALITY"
            value={pd?.countryOfLegalNationality}
            isEditing={isEditingPersonal}
            items={getCountryOptions()}
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
            disabled={isSavingPersonal}
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
            disabled={isSavingIdentity}
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
                  error={errors?.passport?.firstName?._errors?.[0]}
                  disabled={isSavingIdentity}
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
                  error={errors?.passport?.lastName?._errors?.[0]}
                  disabled={isSavingIdentity}
                />
                <EditableSelectField
                  label="PASSPORT ISSUING COUNTRY"
                  value={nd?.passport?.issuingCountry}
                  isEditing={isEditingIdentity}
                  items={getCountryOptions()}
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
                  error={errors?.passport?.issuingCountry?._errors?.[0]}
                  disabled={isSavingIdentity}
                />
                <EditableTextDataField
                  label="PASSPORT NUMBER"
                  value={nd?.passport?.number}
                  isEditing={isEditingIdentity}
                  prettify={false}
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
                  error={errors?.passport?.number?._errors?.[0]}
                  disabled={isSavingIdentity}
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
                  error={errors?.passport?.expiryDate?._errors?.[0]}
                  disabled={isSavingIdentity}
                />
              </div>

              <EditableDocumentField
                label="PASSPORT DOCUMENT"
                isEditing={isEditingIdentity}
                fileName={resolvedPassport?.originalName ?? "No file uploaded"}
                fileUrl={resolvedPassport?.url ?? null}
                isUploaded={!!resolvedPassport}
                status={resolvedPassport?.verificationStatus || "Pending"}
                meta={ resolvedPassport?.sizeBytes ? `${(resolvedPassport.sizeBytes / 1024 / 1024).toFixed(1)} MB` : null }
                onUpload={(file) => {
                  setFiles((f) => ({ ...f, passport: file }));
                  setReuseDocIds((f) => ({ ...f, passport: null }));
                }}
                onView={(url) =>
                  handleViewDocument({
                    url,
                    fileName: resolvedPassport?.originalName,
                  })
                }
                isRequired
                error={errors?.passportDocument?._errors?.[0]}
                disabled={isSavingIdentity}
                infoPillDescription="Upload a clear copy of your passport. This is used to verify your identity and nationality."
                actionSlot={
                  isEditingIdentity &&
                  passportDocs?.length > 0 && (
                    <ReuseDocumentPromptPanel
                      label="passport document"
                      docs={passportDocs}
                      selectedId={reuseDocIds.passport}
                      docType="PASSPORT"
                      onSelect={(id) => {
                        setReuseDocIds((prev) => ({ ...prev, passport: id }));
                        if (id) setFiles((f) => ({ ...f, passport: null }));
                      }}
                      disabled={isSavingIdentity}
                      existingDocId={initialDocIds.passport}
                    />
                  )
                }
              />
            </div>
          )}
          {nd?.type === "BIRTH_CERTIFICATE" && (
            <div className="mt-6 grid grid-cols-1 gap-4">
              <EditableDocumentField
                label="BIRTH CERTIFICATE"
                fileName={resolvedBirthCert?.originalName ?? "No file uploaded"}
                fileUrl={resolvedBirthCert?.url ?? null}
                isUploaded={!!resolvedBirthCert}
                isEditing={isEditingIdentity}
                onUpload={(file) => {
                  setFiles((f) => ({ ...f, birthCertificate: file }));
                  setReuseDocIds((f) => ({ ...f, birthCertificate: null }));
                }}
                onView={(url) =>
                  handleViewDocument({
                    url,
                    fileName: resolvedBirthCert?.originalName,
                  })
                }
                isRequired
                error={errors?.birthCertificate?._errors?.[0]}
                disabled={isSavingIdentity}
                infoPillDescription="Upload your birth certificate as proof of nationality."
                actionSlot={
                  isEditingIdentity &&
                  birthDocs?.length > 0 && (
                    <ReuseDocumentPromptPanel
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
                      disabled={isSavingIdentity}
                      existingDocId={initialDocIds.birthCertificate}
                    />
                  )
                }
              />

              <EditableDocumentField
                label="NATIONAL INSURANCE PROOF"
                fileName={resolvedNiProof?.originalName ?? "No file uploaded"}
                fileUrl={resolvedNiProof?.url ?? null}
                isUploaded={!!resolvedNiProof}
                isEditing={isEditingIdentity}
                onUpload={(file) => {
                  setFiles((f) => ({ ...f, niProof: file }));
                  setReuseDocIds((f) => ({ ...f, niProof: null }));
                }}
                onView={(url) =>
                  handleViewDocument({
                    url,
                    fileName: resolvedNiProof?.originalName,
                  })
                }
                isRequired
                error={errors?.niProof?._errors?.[0]}
                disabled={isSavingIdentity}
                infoPillDescription="Upload a valid NI document to support identity and employment verification."
                actionSlot={
                  isEditingIdentity &&
                  niDocs?.length > 0 && (
                    <ReuseDocumentPromptPanel
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
                      disabled={isSavingIdentity}
                      existingDocId={initialDocIds.niProof}
                    />
                  )
                }
              />
            </div>
          )}
          {/* ── Certificate of Naturalisation ─────────────────────────────── */}
          {nd?.type === "CERTIFICATE_OF_NATURALISATION" && (
            <div className="mt-6 grid grid-cols-1 gap-4">
              <EditableDocumentField
                label="CERTIFICATE OF NATURALISATION"
                infoPillDescription="Upload your certificate of registration or naturalisation as proof of legal nationality."
                fileName={
                  resolvedNaturalisation?.originalName ?? "No file uploaded"
                }
                fileUrl={resolvedNaturalisation?.url ?? null}
                isUploaded={!!resolvedNaturalisation}
                isEditing={isEditingIdentity}
                onUpload={(file) => {
                  setFiles((f) => ({ ...f, certificateNaturalisation: file }));
                  setReuseDocIds((f) => ({
                    ...f,
                    certificateNaturalisation: null,
                  }));
                }}
                onView={(url) =>
                  handleViewDocument({
                    url,
                    fileName: resolvedNaturalisation?.originalName,
                  })
                }
                isRequired
                error={errors?.certificateNaturalisation?._errors?.[0]}
                disabled={isSavingIdentity}
                actionSlot={
                  isEditingIdentity &&
                  naturalisationDocs?.length > 0 && (
                    <ReuseDocumentPromptPanel
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
                      disabled={isSavingIdentity}
                      existingDocId={initialDocIds.certificateNaturalisation}
                    />
                  )
                }
              />

              <EditableDocumentField
                label="NATIONAL INSURANCE PROOF"
                infoPillDescription="Upload a valid NI document to support identity and employment verification."
                fileName={resolvedNiProof?.originalName ?? "No file uploaded"}
                fileUrl={resolvedNiProof?.url ?? null}
                isUploaded={!!resolvedNiProof}
                isEditing={isEditingIdentity}
                onUpload={(file) => {
                  setFiles((f) => ({ ...f, niProof: file }));
                  setReuseDocIds((f) => ({ ...f, niProof: null }));
                }}
                onView={(url) =>
                  handleViewDocument({
                    url,
                    fileName: resolvedNiProof?.originalName,
                  })
                }
                isRequired
                error={errors?.niProof?._errors?.[0]}
                disabled={isSavingIdentity}
                actionSlot={
                  isEditingIdentity &&
                  niDocs?.length > 0 && (
                    <ReuseDocumentPromptPanel
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
                      disabled={isSavingIdentity}
                      existingDocId={initialDocIds.niProof}
                    />
                  )
                }
              />
            </div>
          )}
        </div>
      </CardWrapper>
    </>
  );
}
