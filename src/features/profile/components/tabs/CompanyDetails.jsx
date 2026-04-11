import React, { useState } from "react";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import EditToggleButtons from "../../../../shared/components/buttons/EditToggleButtons";
import EditableCheckboxField from "../../../../shared/components/wrappers/EditableCheckboxField";
import EditableTextDataField from "../../../../shared/components/wrappers/EditableTextDataField";
import EditableSwitchField from "../../../../shared/components/wrappers/EditableSwitchField";
import { FileUpload } from "../common/UnifiedFields";

function CompanyDetails({
  profile,
  setProfile,
  isEditing,
  setIsEditing,
  uploads,
  setUploads,
}) {
  const [useLoanOutCompany, setUseLoanOutCompany] = useState(true);
  const [isVATRegistered, setIsVATRegistered] = useState(true);
  const [allowOtherToSignContract, setAllowOtherToSignContract] =
    useState(true);

  return (
    <>
      <CardWrapper
        title="Loan-Out Company Details"
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
        <div className="space-y-6">
          <EditableSwitchField
            label="I Use A limited (Loan out) company"
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
                  label="Company Registration Number"
                  value={profile.companyRegistrationNumber}
                  onChange={(v) =>
                    setProfile({ ...profile, companyRegistrationNumber: v })
                  }
                  isEditing={isEditing}
                />
                <EditableTextDataField
                  label="KT Number"
                  value={profile.companyKtNumber}
                  onChange={(v) =>
                    setProfile({ ...profile, companyKtNumber: v })
                  }
                  isEditing={isEditing}
                />
                <EditableTextDataField
                  label="Company Country of Incorporation"
                  value={profile.companyCountryOfIncorporation}
                  onChange={(v) =>
                    setProfile({ ...profile, companyCountryOfIncorporation: v })
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
            </div>
          )}
        </div>
      </CardWrapper>
      {useLoanOutCompany && (
        <>
          <CardWrapper
            title="Company Contact Details"
            icon="Phone"
            actions={
              <EditToggleButtons
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            }
          >
            <div className="space-y-4">
              <EditableTextDataField
                label="Company Address Line 1"
                value={profile.companyAddressLine1}
                onChange={(v) =>
                  setProfile({
                    ...profile,
                    companyAddressLine1: v.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="Company Address Line 2"
                value={profile.companyAddressLine2}
                onChange={(v) =>
                  setProfile({
                    ...profile,
                    companyAddressLine2: v.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="Company Address Line 3"
                value={profile.companyAddressLine3}
                onChange={(v) =>
                  setProfile({
                    ...profile,
                    companyAddressLine3: v.toUpperCase(),
                  })
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
                  onChange={(v) =>
                    setProfile({ ...profile, companyCountry: v })
                  }
                  isEditing={isEditing}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <EditableTextDataField
                  label="Company Representative Name"
                  infoPillDescription={
                    "Person who will sign contract on behalf of company"
                  }
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
                  label="Company Representative Email"
                  infoPillDescription={
                    "Email address of person who will sign contract on behalf of company"
                  }
                  value={profile.companyEmailAddress}
                  onChange={(v) =>
                    setProfile({ ...profile, companyEmailAddress: v })
                  }
                  isEditing={isEditing}
                />

                <EditableSwitchField
                  label="Have someone else sign contracts on behalf of company (e.g. agent)"
                  checked={allowOtherToSignContract}
                  onChange={setAllowOtherToSignContract}
                  isEditing={isEditing}
                  className={"col-span-2"}
                />
              </div>
            </div>
          </CardWrapper>
          <CardWrapper
            title="Company Tax Details"
            icon="Banknote"
            actions={
              <EditToggleButtons
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            }
          >
            <div className="space-y-4">
              <EditableSwitchField
                label="Company is VAT Registered"
                checked={isVATRegistered}
                onChange={setIsVATRegistered}
                isEditing={isEditing}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <EditableTextDataField
                  label="Tax Registration Number (Ireland)"
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
                    setProfile({
                      ...profile,
                      taxClearanceAccessNumberIreland: v,
                    })
                  }
                  isEditing={isEditing}
                />
              </div>
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
            </div>
          </CardWrapper>
          <CardWrapper
            title="Company Bank Details"
            icon="Banknote"
            actions={
              <EditToggleButtons
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            }
          >
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <EditableTextDataField
                label="COMPANY BANK NAME"
                value={profile.companyBankName}
                onChange={(v) =>
                  setProfile({
                    ...profile,
                    companyBankName: v.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="COMPANY BANK BRANCH"
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
                label="COMPANY BANK ACCOUNT NAME"
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
                label="COMPANY BANK SORT CODE"
                value={profile.companyBankSortCode}
                onChange={(v) =>
                  setProfile({ ...profile, companyBankSortCode: v })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="COMPANY BANK ACCOUNT NUMBER"
                value={profile.companyBankAccountNumber}
                onChange={(v) =>
                  setProfile({ ...profile, companyBankAccountNumber: v })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="COMPANY BANK IBAN"
                value={profile.companyBankIBAN}
                onChange={(v) => setProfile({ ...profile, companyBankIBAN: v })}
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="COMPANY BANK SWIFT/BIC"
                value={profile.companyBankSwift}
                onChange={(v) =>
                  setProfile({ ...profile, companyBankSwift: v })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="COMPANY BANK NUMBER (ICELAND)"
                value={profile.companyBankNumberIceland}
                onChange={(v) =>
                  setProfile({ ...profile, companyBankNumberIceland: v })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="COMPANY BANK HB (ICELAND)"
                value={profile.companyBankHBIceland}
                onChange={(v) =>
                  setProfile({ ...profile, companyBankHBIceland: v })
                }
                isEditing={isEditing}
              />
              <EditableTextDataField
                label="COMPANY BANK ACCOUNT NUMBER (ICELAND)"
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
          </CardWrapper>
        </>
      )}
    </>
  );
}

export default CompanyDetails;
