import React, { useState } from "react";
import {
  Shield,
  Wallet,
  Briefcase,
  X,
  Check,
  Pen,
  Banknote,
} from "lucide-react";

import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/config/utils";

import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";
import { FileUpload } from "../common/UnifiedFields";
import EditToggleButtons from "../../../../shared/components/buttons/EditToggleButtons";
import EditableRadioField from "../../../../shared/components/wrappers/EditableRadioField";

export default function FinanceDetails({
  profile,
  setProfile,
  isEditing,
  setIsEditing,
  uploads,
  setUploads,
}) {
  const [useLoanOutCompany, setUseLoanOutCompany] = useState(true);
  const [isVATRegistered, setIsVATRegistered] = useState(true);

  return (
    <>
      {/* TAX & NI */}
      <CardWrapper
        title="Financial Details"
        icon="CreditCard"
        actions={
          <EditToggleButtons
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        }
      >
        <div className="grid md:grid-cols-2 gap-4">
          <EditableTextDataField
            label="PPS NUMBER"
            value={profile.ppsNumber}
            onChange={(v) =>
              setProfile({ ...profile, ppsNumber: v.toUpperCase() })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="TAX CLEARANCE ACCESS NUMBER"
            value={profile.taxClearanceAccessNumber}
            onChange={(v) =>
              setProfile({
                ...profile,
                taxClearanceAccessNumber: v.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="KT NUMBER"
            value={profile.ktNumber}
            onChange={(v) =>
              setProfile({ ...profile, ktNumber: v.toUpperCase() })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="NATIONAL INSURANCE NUMBER"
            value={profile.nationalInsuranceNumber}
            onChange={(v) =>
              setProfile({
                ...profile,
                nationalInsuranceNumber: v.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="VAT NUMBER"
            value={profile.vatNumber}
            onChange={(v) => setProfile({ ...profile, vatNumber: v })}
            isEditing={isEditing}
          />
          <EditableRadioField
            label="Student Loan"
            value={profile.payeStatus}
            infoPillDescription={
              "Do you have a student loan which is not fully repaid?"
            }
            options={[
              {
                value: true,
                label: "Yes",
              },
              {
                value: false,
                label: "No",
              },
            ]}
            isEditing={isEditing}
            onChange={(val) => setProfile({ ...profile, payeStatus: val })}
          />
        </div>

        {/* TAX DOCUMENTS */}
        <div className="my-6 grid md:grid-cols-1 gap-3">
          <FileUpload
            label="FS4 DOCUMENT"
            // icon="FileText"
            infoPillDescription="Upload your complete FS4 form to confirm your tax registration and employment status."
            fileName="FS4.pdf"
            isUploaded={true}
            isEditing={isEditing}
            onUpload={() => setUploads((p) => ({ ...p, fs4: true }))}
            onDelete={() => setUploads((p) => ({ ...p, fs4: false }))}
          />
          <FileUpload
            label="LATEST PAYSLIP"
            // icon="Receipt"
            infoPillDescription="Upload your most recent payslip from previous job as proof of income and employment."
            fileName="Payslip.pdf"
            isUploaded={uploads?.payslip}
            isEditing={isEditing}
            onUpload={() => setUploads((p) => ({ ...p, payslip: true }))}
            onDelete={() => setUploads((p) => ({ ...p, payslip: false }))}
          />
          <FileUpload
            label="P45 DOCUMENT"
            // icon="FileCheck"
            infoPillDescription="Upload your P45 to provide details of your previous employment and tax contributions."
            fileName="P45.pdf"
            isUploaded={uploads?.p45}
            isEditing={isEditing}
            onUpload={() => setUploads((p) => ({ ...p, p45: true }))}
            onDelete={() => setUploads((p) => ({ ...p, p45: false }))}
          />
          <FileUpload
            label="VAT CERTIFICATE"
            // icon="BadgePercent"
            infoPillDescription="Upload your VAT registration certificate to confirm your VAT status."
            fileName="VAT.pdf"
            isUploaded={uploads?.vatCert}
            isEditing={isEditing}
            onUpload={() => setUploads((p) => ({ ...p, vatCert: true }))}
            onDelete={() => setUploads((p) => ({ ...p, vatCert: false }))}
          />
        </div>
        <EditableRadioField
          label="PAYE contract status"
          value={profile.payeStatus}
          infoPillDescription={"For PAYE contracts only"}
          options={[
            {
              value: "first_job_since_april",
              label:
                "This is my first job since last 6th April. I have not been receiving taxable Jobseeker’s Allowance, Employment and Support Allowance, taxable Incapacity Benefit, state or occupational pension.",
            },
            {
              value: "only_job_no_other_income",
              label:
                "This is now my only job, but since last 6 April I have had another job, or received taxable Jobseeker’s Allowance, Employment and Support Allowance or Incapacity Benefit. I do not receive a state or occupational pension.",
            },
            {
              value: "has_other_job_or_pension",
              label:
                "I have another job or receive a state or occupational pension.",
            },
          ]}
          isEditing={isEditing}
          onChange={(val) => setProfile({ ...profile, payeStatus: val })}
        />
      </CardWrapper>

      {/* PERSONAL BANK */}
      <CardWrapper
        title="Personal Bank Details"
        icon="Wallet"
        actions={
          <EditToggleButtons
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        }
      >
        <div className="grid md:grid-cols-2 gap-4">
          <EditableTextDataField
            label="PERSONAL BANK NAME"
            value={profile.personalBankName}
            onChange={(v) =>
              setProfile({ ...profile, personalBankName: v.toUpperCase() })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="PERSONAL BANK BRANCH"
            value={profile.personalBankBranch}
            onChange={(v) =>
              setProfile({ ...profile, personalBankBranch: v.toUpperCase() })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="PERSONAL BANK ACCOUNT NAME"
            value={profile.personalBankAccountName}
            onChange={(v) =>
              setProfile({
                ...profile,
                personalBankAccountName: v.toUpperCase(),
              })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="PERSONAL BANK SORT CODE"
            value={profile.personalBankSortCode}
            onChange={(v) =>
              setProfile({ ...profile, personalBankSortCode: v })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="PERSONAL BANK ACCOUNT NUMBER"
            value={profile.personalBankAccountNumber}
            onChange={(v) =>
              setProfile({ ...profile, personalBankAccountNumber: v })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="PERSONAL BANK IBAN"
            value={profile.personalBankIBAN}
            onChange={(v) => setProfile({ ...profile, personalBankIBAN: v })}
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="PERSONAL BANK SWIFT/BIC"
            value={profile.personalBankSwift}
            onChange={(v) => setProfile({ ...profile, personalBankSwift: v })}
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="PERSONAL BANK NUMBER (ICELAND)"
            value={profile.personalBankNumberIceland}
            onChange={(v) =>
              setProfile({ ...profile, personalBankNumberIceland: v })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="PERSONAL BANK HB (ICELAND)"
            value={profile.personalBankHBIceland}
            onChange={(v) =>
              setProfile({ ...profile, personalBankHBIceland: v })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="PERSONAL BANK ACCOUNT NUMBER (ICELAND)"
            value={profile.personalBankAccountNumberIceland}
            onChange={(v) =>
              setProfile({ ...profile, personalBankAccountNumberIceland: v })
            }
            isEditing={isEditing}
          />
        </div>
      </CardWrapper>
    </>
  );
}
