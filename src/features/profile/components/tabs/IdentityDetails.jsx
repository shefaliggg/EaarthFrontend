import React from "react";
import { FileUpload } from "../common/UnifiedFields";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableDateField from "@/shared/components/wrappers/EditableDateField";
import EditableRadioField from "@/shared/components/wrappers/EditableRadioField";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "../../../../shared/components/buttons/EditToggleButtons";

export default function IdentityDetails({
  profile,
  setProfile,
  isEditing,
  setIsEditing,
  uploads,
  setUploads,
}) {
  return (
    <CardWrapper
      title={"Personal Details"}
      icon={"User2"}
      actions={
        <EditToggleButtons
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EditableSelectField
            label="TITLE"
            value={profile.title}
            isEditing={isEditing}
            items={[
              { label: "MR", value: "MR" },
              { label: "MS", value: "MS" },
              { label: "MRS", value: "MRS" },
              { label: "DR", value: "DR" },
              { label: "PROF", value: "PROF" },
            ]}
            onChange={(val) => setProfile({ ...profile, title: val })}
          />

          <EditableTextDataField
            label="LEGAL FIRST NAME"
            value={profile.firstName}
            onChange={(value) =>
              setProfile({
                ...profile,
                firstName: value.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="LEGAL LAST NAME"
            value={profile.lastName}
            onChange={(value) =>
              setProfile({
                ...profile,
                lastName: value.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="MIDDLE NAMES"
            value={profile.middleNames}
            onChange={(value) =>
              setProfile({
                ...profile,
                middleNames: value.toUpperCase(),
              })
            }
            placeholder="OPTIONAL"
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="ALSO KNOWN AS"
            value={profile.alsoKnownAs}
            onChange={(value) =>
              setProfile({
                ...profile,
                alsoKnownAs: value.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="SCREEN CREDIT NAME"
            value={profile.screenCreditName}
            onChange={(value) =>
              setProfile({
                ...profile,
                screenCreditName: value.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />

          <EditableSelectField
            label="PRONOUNS"
            value={profile.pronouns}
            isEditing={isEditing}
            items={[
              { label: "HE / HIM / HIS", value: "HE / HIM / HIS" },
              { label: "SHE / HER / HERS", value: "SHE / HER / HERS" },
              { label: "THEY / THEM / THEIRS", value: "THEY / THEM / THEIRS" },
              { label: "PREFER NOT TO SAY", value: "PREFER NOT TO SAY" },
            ]}
            onChange={(val) => setProfile({ ...profile, pronouns: val })}
          />

          <EditableSelectField
            label="SEX"
            value={profile.sex}
            isEditing={isEditing}
            items={[
              { label: "MALE", value: "MALE" },
              { label: "FEMALE", value: "FEMALE" },
            ]}
            onChange={(val) => setProfile({ ...profile, sex: val })}
          />

          <EditableDateField
            label="DATE OF BIRTH"
            value={profile.dateOfBirth}
            onChange={(value) => setProfile({ ...profile, dateOfBirth: value })}
            isEditing={isEditing}
          />

          <EditableSelectField
            label="COUNTRY OF RESIDENCE"
            value={profile.countryOfPermanentResidence}
            isEditing={isEditing}
            items={[
              { label: "UNITED KINGDOM", value: "UNITED KINGDOM" },
              { label: "USA", value: "USA" },
              { label: "CANADA", value: "CANADA" },
              { label: "AUSTRALIA", value: "AUSTRALIA" },
              { label: "INDIA", value: "INDIA" },
            ]}
            onChange={(val) =>
              setProfile({
                ...profile,
                countryOfPermanentResidence: val,
              })
            }
          />

          <EditableSelectField
            label="NATIONALITY"
            value={profile.countryOfLegalNationality}
            onChange={(value) =>
              setProfile({
                ...profile,
                countryOfLegalNationality: value,
              })
            }
            items={[
              { label: "UNITED KINGDOM", value: "UNITED KINGDOM" },
              { label: "USA", value: "USA" },
              { label: "CANADA", value: "CANADA" },
              { label: "AUSTRALIA", value: "AUSTRALIA" },
              { label: "INDIA", value: "INDIA" },
            ]}
            isEditing={isEditing}
          />
        </div>

        {/* Proof of Nationality Section */}
        <div className="pt-6 border-t border-border">
          <div className="space-y-4">
            <EditableRadioField
              label="PROOF OF NATIONALITY"
              value={profile.proofOfNationality}
              isEditing={isEditing}
              onChange={(val) =>
                setProfile({
                  ...profile,
                  proofOfNationality: val,
                })
              }
              options={[
                { label: "PASSPORT", value: "PASSPORT" },
                { label: "BIRTH CERTIFICATE", value: "BIRTH CERTIFICATE" },
                {
                  label: "CERTIFICATE OF REGISTRATION OR NATURALISATION",
                  value: "CERTIFICATE OF REGISTRATION OR NATURALISATION",
                },
              ]}
            />

            {/* Passport Fields */}
            {profile.proofOfNationality === "PASSPORT" && (
              <div className="mt-6 space-y-4  rounded-3xl ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableTextDataField
                    label="PASSPORT FIRST NAME"
                    value={profile.passportFirstName}
                    onChange={(value) =>
                      setProfile({
                        ...profile,
                        passportFirstName: value.toUpperCase(),
                      })
                    }
                    isEditing={isEditing}
                  />

                  <EditableTextDataField
                    label="PASSPORT LAST NAME"
                    value={profile.passportLastName}
                    onChange={(value) =>
                      setProfile({
                        ...profile,
                        passportLastName: value.toUpperCase(),
                      })
                    }
                    isEditing={isEditing}
                  />

                  <EditableTextDataField
                    label="PLACE OF BIRTH"
                    value={profile.passportPlaceOfBirth}
                    onChange={(value) =>
                      setProfile({
                        ...profile,
                        passportPlaceOfBirth: value.toUpperCase(),
                      })
                    }
                    isEditing={isEditing}
                  />

                  <EditableSelectField
                    label="PASSPORT ISSUING COUNTRY"
                    value={profile.passportIssuingCountry}
                    onChange={(value) =>
                      setProfile({
                        ...profile,
                        passportIssuingCountry: value,
                      })
                    }
                    items={[
                      { label: "UNITED KINGDOM", value: "UNITED KINGDOM" },
                      { label: "USA", value: "USA" },
                      { label: "CANADA", value: "CANADA" },
                      { label: "AUSTRALIA", value: "AUSTRALIA" },
                      { label: "INDIA", value: "INDIA" },
                    ]}
                    isEditing={isEditing}
                  />

                  <EditableTextDataField
                    label="PASSPORT NUMBER"
                    value={profile.passportNumber}
                    onChange={(value) =>
                      setProfile({
                        ...profile,
                        passportNumber: value.toUpperCase(),
                      })
                    }
                    isEditing={isEditing}
                  />

                  <EditableDateField
                    label="PASSPORT EXPIRY DATE"
                    value={profile.passportExpiryDate}
                    onChange={(value) =>
                      setProfile({
                        ...profile,
                        passportExpiryDate: value,
                      })
                    }
                    isEditing={isEditing}
                  />
                </div>

                <FileUpload
                  label="PASSPORT DOCUMENT"
                  // icon="FileText"
                  infoPillDescription="Upload a clear copy of your passport. This is used to verify your identity and nationality."
                  fileName="Passport.pdf"
                  isUploaded={uploads?.passport}
                  isEditing={isEditing}
                  onUpload={() =>
                    setUploads((prev) => ({ ...prev, passport: true }))
                  }
                  onDelete={() =>
                    setUploads((prev) => ({ ...prev, passport: false }))
                  }
                />
              </div>
            )}

            {/* Birth Certificate Fields */}
            {profile.proofOfNationality === "BIRTH CERTIFICATE" && (
              <div className={`mt-6  grid grid-cols-2 gap-4`}>
                <FileUpload
                  label="BIRTH CERTIFICATE"
                  // icon="FileBadge"
                  infoPillDescription="Upload your birth certificate as proof of nationality."
                  fileName="Birth_Certificate.pdf"
                  isUploaded={uploads?.birthCertificate}
                  isEditing={isEditing}
                  onUpload={() =>
                    setUploads((prev) => ({ ...prev, birthCertificate: true }))
                  }
                  onDelete={() =>
                    setUploads((prev) => ({ ...prev, birthCertificate: false }))
                  }
                />

                <FileUpload
                  label="NATIONAL INSURANCE PROOF"
                  // icon="ShieldCheck"
                  infoPillDescription="Upload a valid NI document to support identity and employment verification."
                  fileName="NI_Proof.pdf"
                  isUploaded={uploads?.niProof}
                  isEditing={isEditing}
                  onUpload={() =>
                    setUploads((prev) => ({ ...prev, niProof: true }))
                  }
                  onDelete={() =>
                    setUploads((prev) => ({ ...prev, niProof: false }))
                  }
                />
              </div>
            )}

            {/* Certificate of Naturalisation */}
            {profile.proofOfNationality ===
              "CERTIFICATE OF REGISTRATION OR NATURALISATION" && (
              <div
                className={`mt-6  grid grid-cols-2 gap-4`}
              >
                <FileUpload
                  label="CERTIFICATE OF NATURALISATION"
                  // icon="Award"
                  infoPillDescription="Upload your certificate of registration or naturalisation as proof of legal nationality."
                  fileName="Certificate_Naturalisation.pdf"
                  isUploaded={uploads?.certificateNaturalisation}
                  isEditing={isEditing}
                  onUpload={() =>
                    setUploads((prev) => ({
                      ...prev,
                      certificateNaturalisation: true,
                    }))
                  }
                  onDelete={() =>
                    setUploads((prev) => ({
                      ...prev,
                      certificateNaturalisation: false,
                    }))
                  }
                />

                <FileUpload
                  label="NATIONAL INSURANCE PROOF"
                  // icon="ShieldCheck"
                  infoPillDescription="Upload a valid NI document to support identity and employment verification."
                  fileName="NI_Proof.pdf"
                  isUploaded={uploads?.niProof}
                  isEditing={isEditing}
                  onUpload={() =>
                    setUploads((prev) => ({ ...prev, niProof: true }))
                  }
                  onDelete={() =>
                    setUploads((prev) => ({ ...prev, niProof: false }))
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
