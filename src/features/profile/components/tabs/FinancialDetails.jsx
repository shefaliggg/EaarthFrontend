import React, { useState } from 'react';
import { Field, FileUpload } from '../common/UnifiedFields';
import { Shield, Wallet, Briefcase } from 'lucide-react';

export default function FinanceDetails({ profile, setProfile, isEditing, isDarkMode, uploads, setUploads }) {
  const [useLoanOutCompany, setUseLoanOutCompany] = useState(true);
  const [isVATRegistered, setIsVATRegistered] = useState(true);

  return (
    <div className={`rounded-xl border p-6 shadow-sm ${isDarkMode ? 'bg-card border-border' : 'bg-card border-border'}`}>
      <div className="space-y-6">
        {/* Personal Tax & NI */}
        <div>
          <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
            <Shield className="w-5 h-5" /> TAX & NATIONAL INSURANCE
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field 
              label="PPS NUMBER (IRELAND)" 
              value={profile.ppsNumber} 
              onChange={(e) => setProfile({ ...profile, ppsNumber: e.target.value.toUpperCase() })} 
              placeholder="OPTIONAL"
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="TAX CLEARANCE ACCESS NUMBER" 
              value={profile.taxClearanceAccessNumber} 
              onChange={(e) => setProfile({ ...profile, taxClearanceAccessNumber: e.target.value.toUpperCase() })} 
              placeholder="OPTIONAL"
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="KT NUMBER (NORWAY)" 
              value={profile.ktNumber} 
              onChange={(e) => setProfile({ ...profile, ktNumber: e.target.value.toUpperCase() })} 
              placeholder="OPTIONAL"
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="NATIONAL INSURANCE NUMBER" 
              value={profile.nationalInsuranceNumber} 
              onChange={(e) => setProfile({ ...profile, nationalInsuranceNumber: e.target.value.toUpperCase() })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="VAT NUMBER" 
              value={profile.vatNumber} 
              onChange={(e) => setProfile({ ...profile, vatNumber: e.target.value })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="STUDENT LOAN" 
              value={profile.studentLoan} 
              onChange={(e) => setProfile({ ...profile, studentLoan: e.target.value })} 
              options={['no', 'Plan 1', 'Plan 2', 'Plan 4', 'Postgraduate Loan']} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="PAYE CONTRACT" 
              value={profile.payeContract} 
              onChange={(e) => setProfile({ ...profile, payeContract: e.target.value.toUpperCase() })} 
              placeholder="OPTIONAL"
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
              cols={2}
            />
          </div>
        </div>

        {/* Document Uploads for Tax */}
        <div className="pt-6 border-t border-border">
          <h5 className={`font-medium mb-4 text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
            TAX DOCUMENTS
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                FS4 (IRISH CREW)
              </label>
              <FileUpload
                fieldLabel="FS4 Document"
                fileName="FS4_Document.pdf"
                isUploaded={uploads?.fs4}
                isEditing={isEditing}
                isDarkMode={isDarkMode}
                onUpload={() => setUploads(prev => ({ ...prev, fs4: true }))}
                onDelete={() => setUploads(prev => ({ ...prev, fs4: false }))}
              />
            </div>
            
            <div>
              <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                MOST RECENT PAYSLIP
              </label>
              <FileUpload
                fieldLabel="Latest Payslip"
                fileName="Payslip_Latest.pdf"
                isUploaded={uploads?.payslip}
                isEditing={isEditing}
                isDarkMode={isDarkMode}
                onUpload={() => setUploads(prev => ({ ...prev, payslip: true }))}
                onDelete={() => setUploads(prev => ({ ...prev, payslip: false }))}
              />
            </div>
            
            <div>
              <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                P45
              </label>
              <FileUpload
                fieldLabel="P45 Document"
                fileName="P45_Document.pdf"
                isUploaded={uploads?.p45}
                isEditing={isEditing}
                isDarkMode={isDarkMode}
                onUpload={() => setUploads(prev => ({ ...prev, p45: true }))}
                onDelete={() => setUploads(prev => ({ ...prev, p45: false }))}
              />
            </div>
            
            <div>
              <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                VAT CERTIFICATE
              </label>
              <FileUpload
                fieldLabel="VAT Certificate"
                fileName="VAT_Certificate.pdf"
                isUploaded={uploads?.vatCert}
                isEditing={isEditing}
                isDarkMode={isDarkMode}
                onUpload={() => setUploads(prev => ({ ...prev, vatCert: true }))}
                onDelete={() => setUploads(prev => ({ ...prev, vatCert: false }))}
              />
            </div>
          </div>
        </div>

        {/* Personal Bank Details */}
        <div className="pt-6 border-t border-border">
          <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
            <Wallet className="w-5 h-5" /> PERSONAL BANK DETAILS
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field 
              label="BANK NAME" 
              value={profile.personalBankName} 
              onChange={(e) => setProfile({ ...profile, personalBankName: e.target.value.toUpperCase() })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="BANK BRANCH" 
              value={profile.personalBankBranch} 
              onChange={(e) => setProfile({ ...profile, personalBankBranch: e.target.value.toUpperCase() })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="ACCOUNT NAME" 
              value={profile.personalBankAccountName} 
              onChange={(e) => setProfile({ ...profile, personalBankAccountName: e.target.value.toUpperCase() })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
              cols={2}
            />
            
            <Field 
              label="SORT CODE" 
              value={profile.personalBankSortCode} 
              onChange={(e) => setProfile({ ...profile, personalBankSortCode: e.target.value })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="ACCOUNT NUMBER" 
              value={profile.personalBankAccountNumber} 
              onChange={(e) => setProfile({ ...profile, personalBankAccountNumber: e.target.value })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="IBAN (OPTIONAL)" 
              value={profile.personalBankIBAN} 
              onChange={(e) => setProfile({ ...profile, personalBankIBAN: e.target.value })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="SWIFT/BIC (OPTIONAL)" 
              value={profile.personalBankSwift} 
              onChange={(e) => setProfile({ ...profile, personalBankSwift: e.target.value })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="BANK NUMBER (ICELAND)" 
              value={profile.personalBankNumberIceland} 
              onChange={(e) => setProfile({ ...profile, personalBankNumberIceland: e.target.value })} 
              placeholder="OPTIONAL"
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="HB (ICELAND)" 
              value={profile.personalBankHBIceland} 
              onChange={(e) => setProfile({ ...profile, personalBankHBIceland: e.target.value })} 
              placeholder="OPTIONAL"
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="ACCOUNT NUMBER (ICELAND)" 
              value={profile.personalBankAccountNumberIceland} 
              onChange={(e) => setProfile({ ...profile, personalBankAccountNumberIceland: e.target.value })} 
              placeholder="OPTIONAL"
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
          </div>
        </div>

        {/* Loan-Out Company Toggle */}
        <div className="pt-6 border-t border-border">
          <label className="flex items-center justify-between cursor-pointer">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
              USE LOAN-OUT COMPANY
            </span>
            <input
              type="checkbox"
              checked={useLoanOutCompany}
              onChange={(e) => setUseLoanOutCompany(e.target.checked)}
              disabled={!isEditing}
              className="w-4 h-4 text-primary accent-primary"
            />
          </label>
        </div>

        {/* Loan-Out Company */}
        {useLoanOutCompany && (
          <div className="pt-6 border-t border-border">
            <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
              <Briefcase className="w-5 h-5" /> LOAN-OUT COMPANY
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field 
                  label="COMPANY NAME" 
                  value={profile.companyName} 
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value.toUpperCase() })} 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
                
                <Field 
                  label="REGISTRATION NUMBER" 
                  value={profile.companyRegistrationNumber} 
                  onChange={(e) => setProfile({ ...profile, companyRegistrationNumber: e.target.value })} 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
                
                <Field 
                  label="KT NUMBER (ICELAND)" 
                  value={profile.companyKtNumber} 
                  onChange={(e) => setProfile({ ...profile, companyKtNumber: e.target.value })} 
                  placeholder="OPTIONAL"
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
                
                <Field 
                  label="COUNTRY OF INCORPORATION" 
                  value={profile.companyCountryOfIncorporation} 
                  onChange={(e) => setProfile({ ...profile, companyCountryOfIncorporation: e.target.value })} 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
                
                <Field 
                  label="TAX REGISTRATION NUMBER (IRELAND)" 
                  value={profile.taxRegistrationNumberIreland} 
                  onChange={(e) => setProfile({ ...profile, taxRegistrationNumberIreland: e.target.value })} 
                  placeholder="OPTIONAL"
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
                
                <Field 
                  label="TAX CLEARANCE ACCESS NUMBER (IRELAND)" 
                  value={profile.taxClearanceAccessNumberIreland} 
                  onChange={(e) => setProfile({ ...profile, taxClearanceAccessNumberIreland: e.target.value })} 
                  placeholder="OPTIONAL"
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
              </div>

              <Field 
                label="COMPANY ADDRESS LINE 1" 
                value={profile.companyAddressLine1} 
                onChange={(e) => setProfile({ ...profile, companyAddressLine1: e.target.value.toUpperCase() })} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
              />
              
              <Field 
                label="COMPANY ADDRESS LINE 2" 
                value={profile.companyAddressLine2} 
                onChange={(e) => setProfile({ ...profile, companyAddressLine2: e.target.value.toUpperCase() })} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
              />
              
              <Field 
                label="COMPANY ADDRESS LINE 3" 
                value={profile.companyAddressLine3} 
                onChange={(e) => setProfile({ ...profile, companyAddressLine3: e.target.value.toUpperCase() })} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field 
                  label="POSTCODE" 
                  value={profile.companyAddressLine4} 
                  onChange={(e) => setProfile({ ...profile, companyAddressLine4: e.target.value.toUpperCase() })} 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
                
                <Field 
                  label="COUNTRY" 
                  value={profile.companyCountry} 
                  onChange={(e) => setProfile({ ...profile, companyCountry: e.target.value })} 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Field 
                  label="REPRESENTATIVE NAME" 
                  value={profile.companyRepresentativeName} 
                  onChange={(e) => setProfile({ ...profile, companyRepresentativeName: e.target.value.toUpperCase() })} 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
                
                <Field 
                  label="COMPANY EMAIL" 
                  value={profile.companyEmailAddress} 
                  onChange={(e) => setProfile({ ...profile, companyEmailAddress: e.target.value })} 
                  type="email"
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
              </div>

              {/* VAT Registration Toggle */}
              <div className="mt-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
                    COMPANY IS VAT REGISTERED
                  </span>
                  <input
                    type="checkbox"
                    checked={isVATRegistered}
                    onChange={(e) => setIsVATRegistered(e.target.checked)}
                    disabled={!isEditing}
                    className="w-4 h-4 text-primary accent-primary"
                  />
                </label>
              </div>

              {/* Company Certificate Upload */}
              <div className="mt-4">
                <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                  CERTIFICATE OF INCORPORATION
                </label>
                <FileUpload
                  fieldLabel="Certificate of Incorporation"
                  fileName="Certificate_of_Incorporation.pdf"
                  isUploaded={uploads?.companyCertificate}
                  isEditing={isEditing}
                  isDarkMode={isDarkMode}
                  onUpload={() => setUploads(prev => ({ ...prev, companyCertificate: true }))}
                  onDelete={() => setUploads(prev => ({ ...prev, companyCertificate: false }))}
                />
              </div>

              {/* VAT Certificate Upload */}
              {isVATRegistered && (
                <div className="mt-4">
                  <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                    VAT REGISTRATION CERTIFICATE
                  </label>
                  <FileUpload
                    fieldLabel="VAT Registration Certificate"
                    fileName="VAT_Registration_Certificate.pdf"
                    isUploaded={uploads?.vatCert}
                    isEditing={isEditing}
                    isDarkMode={isDarkMode}
                    onUpload={() => setUploads(prev => ({ ...prev, vatCert: true }))}
                    onDelete={() => setUploads(prev => ({ ...prev, vatCert: false }))}
                  />
                </div>
              )}

              {/* Company Bank Details */}
              <div className="mt-4 pt-4 border-t border-border">
                <h5 className={`font-medium mb-4 text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                  COMPANY BANK DETAILS
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field 
                    label="BANK NAME" 
                    value={profile.companyBankName} 
                    onChange={(e) => setProfile({ ...profile, companyBankName: e.target.value.toUpperCase() })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="BANK BRANCH" 
                    value={profile.companyBankBranch} 
                    onChange={(e) => setProfile({ ...profile, companyBankBranch: e.target.value.toUpperCase() })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="ACCOUNT NAME" 
                    value={profile.companyBankAccountName} 
                    onChange={(e) => setProfile({ ...profile, companyBankAccountName: e.target.value.toUpperCase() })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                    cols={2}
                  />
                  
                  <Field 
                    label="SORT CODE" 
                    value={profile.companyBankSortCode} 
                    onChange={(e) => setProfile({ ...profile, companyBankSortCode: e.target.value })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="ACCOUNT NUMBER" 
                    value={profile.companyBankAccountNumber} 
                    onChange={(e) => setProfile({ ...profile, companyBankAccountNumber: e.target.value })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="IBAN (OPTIONAL)" 
                    value={profile.companyBankIBAN} 
                    onChange={(e) => setProfile({ ...profile, companyBankIBAN: e.target.value })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="SWIFT/BIC (OPTIONAL)" 
                    value={profile.companyBankSwift} 
                    onChange={(e) => setProfile({ ...profile, companyBankSwift: e.target.value })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="BANK NUMBER (ICELAND)" 
                    value={profile.companyBankNumberIceland} 
                    onChange={(e) => setProfile({ ...profile, companyBankNumberIceland: e.target.value })} 
                    placeholder="OPTIONAL"
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="HB (ICELAND)" 
                    value={profile.companyBankHBIceland} 
                    onChange={(e) => setProfile({ ...profile, companyBankHBIceland: e.target.value })} 
                    placeholder="OPTIONAL"
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="ACCOUNT NUMBER (ICELAND)" 
                    value={profile.companyBankAccountNumberIceland} 
                    onChange={(e) => setProfile({ ...profile, companyBankAccountNumberIceland: e.target.value })} 
                    placeholder="OPTIONAL"
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



