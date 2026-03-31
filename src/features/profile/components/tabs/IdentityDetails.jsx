import React from "react";
import { Field, FileUpload } from "../common/UnifiedFields";
import EditableTextDataField from "../../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../../shared/components/wrappers/EditableSelectField";
import EditableDateField from "../../../../shared/components/wrappers/EditableDateField";
import EditableRadioField from "../../../../shared/components/wrappers/EditableRadioField";

export default function IdentityDetails({
  profile,
  setProfile,
  isEditing,
  isDarkMode,
  uploads,
  setUploads,
}) {
  return (
    <div className="rounded-3xl border shadow-md p-6 bg-card border-border">
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
            onChange={(e) =>
              setProfile({
                ...profile,
                firstName: e.target.value.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="LEGAL LAST NAME"
            value={profile.lastName}
            onChange={(e) =>
              setProfile({
                ...profile,
                lastName: e.target.value.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="MIDDLE NAMES"
            value={profile.middleNames}
            onChange={(e) =>
              setProfile({
                ...profile,
                middleNames: e.target.value.toUpperCase(),
              })
            }
            placeholder="OPTIONAL"
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="ALSO KNOWN AS"
            value={profile.alsoKnownAs}
            onChange={(e) =>
              setProfile({
                ...profile,
                alsoKnownAs: e.target.value.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="SCREEN CREDIT NAME"
            value={profile.screenCreditName}
            onChange={(e) =>
              setProfile({
                ...profile,
                screenCreditName: e.target.value.toUpperCase(),
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
            onChange={(e) =>
              setProfile({ ...profile, dateOfBirth: e.target.value })
            }
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
            onChange={(e) =>
              setProfile({
                ...profile,
                countryOfLegalNationality: e.target.value,
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
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        passportFirstName: e.target.value.toUpperCase(),
                      })
                    }
                    isEditing={isEditing}
                  />

                  <EditableTextDataField
                    label="PASSPORT LAST NAME"
                    value={profile.passportLastName}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        passportLastName: e.target.value.toUpperCase(),
                      })
                    }
                    isEditing={isEditing}
                  />

                  <EditableTextDataField
                    label="PLACE OF BIRTH"
                    value={profile.passportPlaceOfBirth}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        passportPlaceOfBirth: e.target.value.toUpperCase(),
                      })
                    }
                    isEditing={isEditing}
                  />

                  <EditableSelectField
                    label="PASSPORT ISSUING COUNTRY"
                    value={profile.passportIssuingCountry}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        passportIssuingCountry: e.target.value,
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
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        passportNumber: e.target.value.toUpperCase(),
                      })
                    }
                    isEditing={isEditing}
                  />

                  <EditableDateField
                    label="PASSPORT EXPIRY DATE"
                    value={profile.passportExpiryDate}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        passportExpiryDate: e.target.value,
                      })
                    }
                    isEditing={isEditing}
                  />
                </div>

                <FileUpload
                  fieldLabel="Passport"
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
              <div
                className={`mt-6  grid grid-cols-2 gap-4 p-6 rounded-2xl bg-background`}
              >
                <FileUpload
                  fieldLabel="Birth Certificate"
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
                  fieldLabel="NI Proof"
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
                className={`mt-6  grid grid-cols-2 gap-4 p-6 rounded-2xl bg-background`}
              >
                <FileUpload
                  fieldLabel="Certificate of Naturalisation"
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
                  fieldLabel="NI Proof"
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
    </div>
  );
}
