import React, { useState } from "react";
import EditableSwitchField from "../../../../shared/components/wrappers/EditableSwitchField";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import EditToggleButtons from "../../../../shared/components/buttons/EditToggleButtons";
import EditableCheckboxField from "../../../../shared/components/wrappers/EditableCheckboxField";
import EditableTextDataField from "../../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../../shared/components/wrappers/EditableSelectField";
import EditablePhoneField from "../../../../shared/components/wrappers/EditablePhoneField";
import { Banknote } from "lucide-react";

function AgencyDetails({ profile, setProfile, isEditing, setIsEditing }) {
  const [haveAgent, setHaveAgent] = useState(false);
  const [sendEmailToCrewMember, setSendEmailToCrewMember] = useState(false);

  return (
    <>
      <CardWrapper
        title={"Agency Details"}
        icon={"BriefcaseBusiness"}
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
          <EditableSwitchField
            label="I Have An Agent"
            checked={haveAgent}
            isEditing={isEditing}
            onChange={setHaveAgent}
          />
          {haveAgent && (
            <div className="grid grid-cols-1 gap-4">
              <EditableTextDataField
                label="AGENCY NAME"
                value={profile.agencyName}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agencyName: value.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="AGENCY ADDRESS LINE 1"
                value={profile.agencyAddressLine1}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agencyAddressLine1: value.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="AGENCY ADDRESS LINE 2"
                value={profile.agencyAddressLine2}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agencyAddressLine2: value.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="AGENCY ADDRESS LINE 3"
                value={profile.agencyAddressLine3}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agencyAddressLine3: value.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableTextDataField
                  label="AGENCY POSTCODE"
                  value={profile.agencyPostcode}
                  onChange={(value) =>
                    setProfile({
                      ...profile,
                      agencyPostcode: value.toUpperCase(),
                    })
                  }
                  isEditing={isEditing}
                />

                <EditableSelectField
                  label="AGENCY COUNTRY"
                  value={profile.agencyCountry}
                  onChange={(value) =>
                    setProfile({ ...profile, agencyCountry: value })
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
            </div>
          )}
        </div>
      </CardWrapper>
      {haveAgent && (
        <>
          <CardWrapper
            title={"Agent Contact Information"}
            icon={"User"}
            actions={
              <EditToggleButtons
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <EditablePhoneField
                label="Agent Telephone Number"
                value={{
                  countryCode: profile.agentPhoneCountryCode,
                  phoneNumber: profile.agentPhoneNumber,
                }}
                isEditing={isEditing}
                onChange={(val) =>
                  setProfile((prev) => ({
                    ...prev,
                    agentPhoneCountryCode: val.countryCode,
                    agentPhoneNumber: val.phoneNumber,
                  }))
                }
                codeOptions={[
                  { value: "+44", label: "+44" },
                  { value: "+1", label: "+1" },
                  { value: "+91", label: "+91" },
                  { value: "+61", label: "+61" },
                  { value: "+33", label: "+33" },
                  { value: "+49", label: "+49" },
                ]}
              />

              <EditableTextDataField
                label="AGENT CORRESPONDENCE NAME"
                value={profile.agentCorrespondenceName}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agentCorrespondenceName: value.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="AGENT CORRESPONDENCE EMAIL ADDRESS"
                value={profile.agentCorrespondenceEmail}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agentCorrespondenceEmail: value,
                  })
                }
                type="email"
                isEditing={isEditing}
              />

              <EditableSwitchField
                label="Send email to crew member?"
                checked={sendEmailToCrewMember}
                onChange={setSendEmailToCrewMember}
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="AGENT SIGNATORY NAME"
                value={profile.agentSignatoryName}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agentSignatoryName: value.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="AGENT SIGNATORY EMAIL"
                value={profile.agentSignatoryEmail}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agentSignatoryEmail: value,
                  })
                }
                type="email"
                isEditing={isEditing}
              />
            </div>
          </CardWrapper>
          <CardWrapper
            title={"Agent Bank Details"}
            icon={"Banknote"}
            actions={
              <EditToggleButtons
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableTextDataField
                label="AGENT BANK NAME"
                value={profile.agentBankName}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agentBankName: value.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="AGENT BANK BRANCH"
                value={profile.agentBankBranch}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agentBankBranch: value.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="AGENT BANK NAME"
                value={profile.agentBankAccountName}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agentBankAccountName: value.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="AGENT BANK SORT CODE"
                value={profile.agentBankSortCode}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agentBankSortCode: value,
                  })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="AGENT BANK ACCOUNT NUMBER"
                value={profile.agentBankAccountNumber}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    agentBankAccountNumber: value,
                  })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="AGENT BANK IBAN (OPTIONAL)"
                value={profile.agentBankIBAN}
                onChange={(value) =>
                  setProfile({ ...profile, agentBankIBAN: value })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="AGENT BANK SWIFT/BIC (OPTIONAL)"
                value={profile.agentBankSWIFT}
                onChange={(value) =>
                  setProfile({ ...profile, agentBankSWIFT: value })
                }
                isEditing={isEditing}
              />
            </div>
          </CardWrapper>
        </>
      )}
    </>
  );
}

export default AgencyDetails;
