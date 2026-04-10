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
        title="Tax & National Insurance"
        icon="Shield"
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
            label="PPS NUMBER (IRELAND)"
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
            label="KT NUMBER (NORWAY)"
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

          <EditableSelectField
            label="STUDENT LOAN"
            value={profile.studentLoan}
            onChange={(v) => setProfile({ ...profile, studentLoan: v })}
            items={[
              { label: "No", value: "no" },
              { label: "Plan 1", value: "Plan 1" },
              { label: "Plan 2", value: "Plan 2" },
              { label: "Plan 4", value: "Plan 4" },
              { label: "Postgraduate Loan", value: "Postgraduate Loan" },
            ]}
            isEditing={isEditing}
          />

          <EditableTextDataField
            label="PAYE CONTRACT"
            value={profile.payeContract}
            onChange={(v) =>
              setProfile({ ...profile, payeContract: v.toUpperCase() })
            }
            isEditing={isEditing}
          />
        </div>

        {/* TAX DOCUMENTS */}
        <div className="mt-6 border-t pt-4 grid md:grid-cols-1 gap-3">
          <FileUpload
            label="FS4 DOCUMENT"
            // icon="FileText"
            infoPillDescription="Upload your FS4 form to confirm your tax registration and employment status."
            fileName="FS4.pdf"
            isUploaded={true}
            isEditing={isEditing}
            onUpload={() => setUploads((p) => ({ ...p, fs4: true }))}
            onDelete={() => setUploads((p) => ({ ...p, fs4: false }))}
          />
          <FileUpload
            label="LATEST PAYSLIP"
            // icon="Receipt"
            infoPillDescription="Upload your most recent payslip as proof of income and employment."
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
            label="BANK NAME"
            value={profile.personalBankName}
            onChange={(v) =>
              setProfile({ ...profile, personalBankName: v.toUpperCase() })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="BANK BRANCH"
            value={profile.personalBankBranch}
            onChange={(v) =>
              setProfile({ ...profile, personalBankBranch: v.toUpperCase() })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="ACCOUNT NAME"
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
            label="SORT CODE"
            value={profile.personalBankSortCode}
            onChange={(v) =>
              setProfile({ ...profile, personalBankSortCode: v })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="ACCOUNT NUMBER"
            value={profile.personalBankAccountNumber}
            onChange={(v) =>
              setProfile({ ...profile, personalBankAccountNumber: v })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="IBAN"
            value={profile.personalBankIBAN}
            onChange={(v) => setProfile({ ...profile, personalBankIBAN: v })}
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="SWIFT/BIC"
            value={profile.personalBankSwift}
            onChange={(v) => setProfile({ ...profile, personalBankSwift: v })}
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="BANK NUMBER (ICELAND)"
            value={profile.personalBankNumberIceland}
            onChange={(v) =>
              setProfile({ ...profile, personalBankNumberIceland: v })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="HB (ICELAND)"
            value={profile.personalBankHBIceland}
            onChange={(v) =>
              setProfile({ ...profile, personalBankHBIceland: v })
            }
            isEditing={isEditing}
          />
          <EditableTextDataField
            label="ACCOUNT NUMBER (ICELAND)"
            value={profile.personalBankAccountNumberIceland}
            onChange={(v) =>
              setProfile({ ...profile, personalBankAccountNumberIceland: v })
            }
            isEditing={isEditing}
          />
        </div>
      </CardWrapper>

      {/* LOAN OUT */}
      <CardWrapper
        title="Loan-Out Company"
        icon="Briefcase"
        actions={
          <EditToggleButtons
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        }
      >
        <EditableCheckboxField
          label="Use Loan-Out Company"
          checked={useLoanOutCompany}
          onChange={setUseLoanOutCompany}
          isEditing={isEditing}
        />

        {useLoanOutCompany && (
          <div className="mt-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <EditableTextDataField
                label="Company Name"
                value={profile.companyName}
                onChange={(v) =>
                  setProfile({ ...profile, companyName: v.toUpperCase() })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="Registration Number"
                value={profile.companyRegistrationNumber}
                onChange={(v) =>
                  setProfile({ ...profile, companyRegistrationNumber: v })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="KT Number"
                value={profile.companyKtNumber}
                onChange={(v) => setProfile({ ...profile, companyKtNumber: v })}
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="Country of Incorporation"
                value={profile.companyCountryOfIncorporation}
                onChange={(v) =>
                  setProfile({ ...profile, companyCountryOfIncorporation: v })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="Tax Reg Number (Ireland)"
                value={profile.taxRegistrationNumberIreland}
                onChange={(v) =>
                  setProfile({ ...profile, taxRegistrationNumberIreland: v })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="Tax Clearance Access Number"
                value={profile.taxClearanceAccessNumberIreland}
                onChange={(v) =>
                  setProfile({ ...profile, taxClearanceAccessNumberIreland: v })
                }
                isEditing={isEditing}
              />
            </div>

            <EditableTextDataField
              label="Company Address Line 1"
              value={profile.companyAddressLine1}
              onChange={(v) =>
                setProfile({ ...profile, companyAddressLine1: v.toUpperCase() })
              }
              isEditing={isEditing}
            />
            <EditableTextDataField
              label="Company Address Line 2"
              value={profile.companyAddressLine2}
              onChange={(v) =>
                setProfile({ ...profile, companyAddressLine2: v.toUpperCase() })
              }
              isEditing={isEditing}
            />
            <EditableTextDataField
              label="Company Address Line 3"
              value={profile.companyAddressLine3}
              onChange={(v) =>
                setProfile({ ...profile, companyAddressLine3: v.toUpperCase() })
              }
              isEditing={isEditing}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <EditableTextDataField
                label="Postcode"
                value={profile.companyAddressLine4}
                onChange={(v) =>
                  setProfile({
                    ...profile,
                    companyAddressLine4: v.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="Country"
                value={profile.companyCountry}
                onChange={(v) => setProfile({ ...profile, companyCountry: v })}
                isEditing={isEditing}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <EditableTextDataField
                label="Representative Name"
                value={profile.companyRepresentativeName}
                onChange={(v) =>
                  setProfile({
                    ...profile,
                    companyRepresentativeName: v.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="Company Email"
                value={profile.companyEmailAddress}
                onChange={(v) =>
                  setProfile({ ...profile, companyEmailAddress: v })
                }
                isEditing={isEditing}
              />
            </div>

            <FileUpload
              label="CERTIFICATE OF INCORPORATION"
              // icon="Building2"
              infoPillDescription="Upload your company’s certificate of incorporation to verify its legal registration."
              fileName="certificate.pdf"
              isUploaded={uploads?.companyCertificate}
              isEditing={isEditing}
              onUpload={() =>
                setUploads((p) => ({ ...p, companyCertificate: true }))
              }
              onDelete={() =>
                setUploads((p) => ({ ...p, companyCertificate: false }))
              }
            />

            <EditableCheckboxField
              label="VAT Registered"
              checked={isVATRegistered}
              onChange={setIsVATRegistered}
              isEditing={isEditing}
            />
            {isVATRegistered && (
              <FileUpload
                label="VAT CERTIFICATE"
                // icon="BadgePercent"
                infoPillDescription="Upload your company VAT certificate to confirm VAT registration status."
                fileName="vat.pdf"
                isUploaded={uploads?.vatCert}
                isEditing={isEditing}
                onUpload={() => setUploads((p) => ({ ...p, vatCert: true }))}
                onDelete={() => setUploads((p) => ({ ...p, vatCert: false }))}
              />
            )}

            {/* COMPANY BANK */}
            <div className="pt-4 border-t">
              <h5 className="flex items-center gap-2 text-sm font-medium">
                <Banknote className="size-4" /> Company Bank Details
              </h5>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <EditableTextDataField
                  label="BANK NAME"
                  value={profile.companyBankName}
                  onChange={(v) =>
                    setProfile({ ...profile, companyBankName: v.toUpperCase() })
                  }
                  isEditing={isEditing}
                />
                <EditableTextDataField
                  label="BANK BRANCH"
                  value={profile.companyBankBranch}
                  onChange={(v) =>
                    setProfile({
                      ...profile,
                      companyBankBranch: v.toUpperCase(),
                    })
                  }
                  isEditing={isEditing}
                />
                <EditableTextDataField
                  label="ACCOUNT NAME"
                  value={profile.companyBankAccountName}
                  onChange={(v) =>
                    setProfile({
                      ...profile,
                      companyBankAccountName: v.toUpperCase(),
                    })
                  }
                  isEditing={isEditing}
                />
                <EditableTextDataField
                  label="SORT CODE"
                  value={profile.companyBankSortCode}
                  onChange={(v) =>
                    setProfile({ ...profile, companyBankSortCode: v })
                  }
                  isEditing={isEditing}
                />
                <EditableTextDataField
                  label="ACCOUNT NUMBER"
                  value={profile.companyBankAccountNumber}
                  onChange={(v) =>
                    setProfile({ ...profile, companyBankAccountNumber: v })
                  }
                  isEditing={isEditing}
                />
                <EditableTextDataField
                  label="IBAN"
                  value={profile.companyBankIBAN}
                  onChange={(v) =>
                    setProfile({ ...profile, companyBankIBAN: v })
                  }
                  isEditing={isEditing}
                />
                <EditableTextDataField
                  label="SWIFT/BIC"
                  value={profile.companyBankSwift}
                  onChange={(v) =>
                    setProfile({ ...profile, companyBankSwift: v })
                  }
                  isEditing={isEditing}
                />
                <EditableTextDataField
                  label="BANK NUMBER (ICELAND)"
                  value={profile.companyBankNumberIceland}
                  onChange={(v) =>
                    setProfile({ ...profile, companyBankNumberIceland: v })
                  }
                  isEditing={isEditing}
                />
                <EditableTextDataField
                  label="HB (ICELAND)"
                  value={profile.companyBankHBIceland}
                  onChange={(v) =>
                    setProfile({ ...profile, companyBankHBIceland: v })
                  }
                  isEditing={isEditing}
                />
                <EditableTextDataField
                  label="ACCOUNT NUMBER (ICELAND)"
                  value={profile.companyBankAccountNumberIceland}
                  onChange={(v) =>
                    setProfile({
                      ...profile,
                      companyBankAccountNumberIceland: v,
                    })
                  }
                  isEditing={isEditing}
                />
              </div>
            </div>
          </div>
        )}
      </CardWrapper>
    </>
  );
}
