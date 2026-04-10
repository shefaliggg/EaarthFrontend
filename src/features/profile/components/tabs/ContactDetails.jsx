import React, { useState } from "react";
import { Field, PhoneField, FileUpload } from "../common/UnifiedFields";
import {
  Home,
  Phone,
  AlertCircle,
  Briefcase,
  X,
  Check,
  Pen,
  Banknote,
} from "lucide-react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/config/utils";
import EditableSelectField from "../../../../shared/components/wrappers/EditableSelectField";
import EditableTextDataField from "../../../../shared/components/wrappers/EditableTextDataField";
import EditableCheckboxField from "../../../../shared/components/wrappers/EditableCheckboxField";
import EditablePhoneField from "../../../../shared/components/wrappers/EditablePhoneField";
import EditToggleButtons from "../../../../shared/components/buttons/EditToggleButtons";
export default function ContactDetails({
  profile,
  setProfile,
  isEditing,
  setIsEditing,
  uploads,
  setUploads,
}) {
  const [sendEmailsToCrewMember, setSendEmailsToCrewMember] = useState(true);

  return (
    <>
      <CardWrapper
        title={"Home Address"}
        icon={"Home"}
        actions={
          <EditToggleButtons
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <EditableTextDataField
            label="ADDRESS LINE 1"
            value={profile.addressLine1}
            onChange={(value) =>
              setProfile({
                ...profile,
                addressLine1: value.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="ADDRESS LINE 2"
            value={profile.addressLine2}
            onChange={(value) =>
              setProfile({
                ...profile,
                addressLine2: value.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="ADDRESS LINE 3"
            value={profile.addressLine3}
            onChange={(value) =>
              setProfile({
                ...profile,
                addressLine3: value.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableTextDataField
              label="POSTCODE"
              value={profile.postcode}
              onChange={(value) =>
                setProfile({
                  ...profile,
                  postcode: value.toUpperCase(),
                })
              }
              isEditing={isEditing}
            />

            <EditableSelectField
              label="COUNTRY"
              value={profile.country}
              onChange={(value) => setProfile({ ...profile, country: value })}
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
      </CardWrapper>
      <CardWrapper
        title={"Contact Information"}
        icon={"Phone"}
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
          <EditablePhoneField
            label="Mobile Telephone Number"
            value={{
              countryCode: profile.mobileCountryCode,
              phoneNumber: profile.mobileNumber,
            }}
            isEditing={isEditing}
            onChange={(val) =>
              setProfile((prev) => ({
                ...prev,
                mobileCountryCode: val.countryCode,
                mobileNumber: val.phoneNumber,
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

          <EditablePhoneField
            label="Other Telephone Number"
            value={{
              countryCode: profile.otherCountryCode,
              phoneNumber: profile.otherNumber,
            }}
            isEditing={isEditing}
            onChange={(val) =>
              setProfile((prev) => ({
                ...prev,
                otherCountryCode: val.countryCode,
                otherNumber: val.phoneNumber,
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
            label="EMAIL ADDRESS"
            value={profile.email}
            onChange={(value) => setProfile({ ...profile, email: value })}
            type="email"
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="EMAIL FOR PAYSLIP"
            value={profile.emailPayslip}
            onChange={(value) =>
              setProfile({ ...profile, emailPayslip: value })
            }
            type="email"
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="EMAIL FOR PENSION"
            value={profile.emailPension}
            onChange={(value) =>
              setProfile({ ...profile, emailPension: value })
            }
            type="email"
            isEditing={isEditing}
          />
        </div>
        <div className="mt-6 border-t border-border">
          <div className="mt-4">
            <EditableCheckboxField
              label="Send Project Emails to Crew Member"
              // description="Auto-generate meeting agendas."
              checked={sendEmailsToCrewMember}
              isEditing={isEditing}
              onChange={setSendEmailsToCrewMember}
            />
          </div>
        </div>
      </CardWrapper>

      <CardWrapper
        title={"Emergency Contact"}
        icon={"AlertCircle"}
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
            label="EMERGENCY CONTACT FULL NAME"
            value={profile.emergencyName}
            onChange={(value) =>
              setProfile({
                ...profile,
                emergencyName: value.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="RELATIONSHIP"
            value={profile.emergencyRelationship}
            onChange={(value) =>
              setProfile({
                ...profile,
                emergencyRelationship: value.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />

          <EditablePhoneField
            label="Emergency Contact Telephone"
            value={{
              countryCode: profile.emergencyCountryCode,
              phoneNumber: profile.emergencyNumber,
            }}
            isEditing={isEditing}
            onChange={(val) =>
              setProfile((prev) => ({
                ...prev,
                emergencyCountryCode: val.countryCode,
                emergencyNumber: val.phoneNumber,
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
        </div>
      </CardWrapper>
      
    </>
  );
}
