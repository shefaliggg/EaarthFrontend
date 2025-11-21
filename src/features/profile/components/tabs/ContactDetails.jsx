import React, { useState } from 'react';
import { Field, PhoneField, FileUpload } from '../common/UnifiedFields';
import { Home, Phone, AlertCircle, Briefcase } from 'lucide-react';

export default function ContactDetails({ profile, setProfile, isEditing, isDarkMode, uploads, setUploads }) {
  const [haveAgent, setHaveAgent] = useState(true);
  const [sendEmailsToCrewMember, setSendEmailsToCrewMember] = useState(true);

  return (
    <div className={`rounded-xl border p-6 shadow-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="space-y-6">
        {/* Home Address Section */}
        <div>
          <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Home className="w-5 h-5" /> HOME ADDRESS
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <Field 
              label="ADDRESS LINE 1" 
              value={profile.addressLine1} 
              onChange={(e) => setProfile({ ...profile, addressLine1: e.target.value.toUpperCase() })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="ADDRESS LINE 2" 
              value={profile.addressLine2} 
              onChange={(e) => setProfile({ ...profile, addressLine2: e.target.value.toUpperCase() })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="ADDRESS LINE 3" 
              value={profile.addressLine3} 
              onChange={(e) => setProfile({ ...profile, addressLine3: e.target.value.toUpperCase() })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field 
                label="POSTCODE" 
                value={profile.postcode} 
                onChange={(e) => setProfile({ ...profile, postcode: e.target.value.toUpperCase() })} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
              />
              
              <Field 
                label="COUNTRY" 
                value={profile.country} 
                onChange={(e) => setProfile({ ...profile, country: e.target.value })} 
                options={['UNITED KINGDOM', 'UNITED STATES', 'CANADA', 'AUSTRALIA', 'INDIA']} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Phone className="w-5 h-5" /> CONTACT INFORMATION
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PhoneField 
              label="MOBILE TELEPHONE NUMBER" 
              codeValue={profile.mobileCountryCode} 
              numberValue={profile.mobileNumber} 
              onCodeChange={(e) => setProfile({ ...profile, mobileCountryCode: e.target.value })} 
              onNumberChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <PhoneField 
              label="OTHER TELEPHONE NUMBER" 
              codeValue={profile.otherCountryCode} 
              numberValue={profile.otherNumber} 
              onCodeChange={(e) => setProfile({ ...profile, otherCountryCode: e.target.value })} 
              onNumberChange={(e) => setProfile({ ...profile, otherNumber: e.target.value })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="EMAIL ADDRESS" 
              value={profile.email} 
              onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
              type="email" 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="EMAIL FOR PAYSLIP" 
              value={profile.emailPayslip} 
              onChange={(e) => setProfile({ ...profile, emailPayslip: e.target.value })} 
              type="email" 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />

            <Field 
              label="EMAIL FOR PENSION" 
              value={profile.emailPension} 
              onChange={(e) => setProfile({ ...profile, emailPension: e.target.value })} 
              type="email" 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
              cols={2}
            />
          </div>

          {/* Send emails toggle */}
          <div className="mt-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                SEND PROJECT EMAILS TO CREW MEMBER
              </span>
              <input
                type="checkbox"
                checked={sendEmailsToCrewMember}
                onChange={(e) => setSendEmailsToCrewMember(e.target.checked)}
                disabled={!isEditing}
                className="w-4 h-4 text-[#7e57c2]"
              />
            </label>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <AlertCircle className="w-5 h-5" /> EMERGENCY CONTACT
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field 
              label="EMERGENCY CONTACT FULL NAME" 
              value={profile.emergencyName} 
              onChange={(e) => setProfile({ ...profile, emergencyName: e.target.value.toUpperCase() })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="RELATIONSHIP" 
              value={profile.emergencyRelationship} 
              onChange={(e) => setProfile({ ...profile, emergencyRelationship: e.target.value.toUpperCase() })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <PhoneField 
              label="EMERGENCY CONTACT TELEPHONE" 
              codeValue={profile.emergencyCountryCode} 
              numberValue={profile.emergencyNumber} 
              onCodeChange={(e) => setProfile({ ...profile, emergencyCountryCode: e.target.value })} 
              onNumberChange={(e) => setProfile({ ...profile, emergencyNumber: e.target.value })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
          </div>
        </div>

        {/* Agent toggle */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <label className="flex items-center justify-between cursor-pointer">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              I HAVE AN AGENT
            </span>
            <input
              type="checkbox"
              checked={haveAgent}
              onChange={(e) => setHaveAgent(e.target.checked)}
              disabled={!isEditing}
              className="w-4 h-4 text-[#7e57c2]"
            />
          </label>
        </div>

        {/* Agent/Agency Details */}
        {haveAgent && (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Briefcase className="w-5 h-5" /> AGENT / AGENCY
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <Field 
                label="AGENCY NAME" 
                value={profile.agencyName} 
                onChange={(e) => setProfile({ ...profile, agencyName: e.target.value.toUpperCase() })} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
                cols={2}
              />
              
              <Field 
                label="AGENCY ADDRESS LINE 1" 
                value={profile.agencyAddressLine1} 
                onChange={(e) => setProfile({ ...profile, agencyAddressLine1: e.target.value.toUpperCase() })} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
              />
              
              <Field 
                label="AGENCY ADDRESS LINE 2" 
                value={profile.agencyAddressLine2} 
                onChange={(e) => setProfile({ ...profile, agencyAddressLine2: e.target.value.toUpperCase() })} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
              />
              
              <Field 
                label="AGENCY ADDRESS LINE 3" 
                value={profile.agencyAddressLine3} 
                onChange={(e) => setProfile({ ...profile, agencyAddressLine3: e.target.value.toUpperCase() })} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field 
                  label="AGENCY POSTCODE" 
                  value={profile.agencyPostcode} 
                  onChange={(e) => setProfile({ ...profile, agencyPostcode: e.target.value.toUpperCase() })} 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
                
                <Field 
                  label="AGENCY COUNTRY" 
                  value={profile.agencyCountry} 
                  onChange={(e) => setProfile({ ...profile, agencyCountry: e.target.value })} 
                  options={['UNITED KINGDOM', 'UNITED STATES', 'CANADA', 'AUSTRALIA']} 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <PhoneField 
                  label="AGENT TELEPHONE NUMBER" 
                  codeValue={profile.agentPhoneCountryCode} 
                  numberValue={profile.agentPhoneNumber} 
                  onCodeChange={(e) => setProfile({ ...profile, agentPhoneCountryCode: e.target.value })} 
                  onNumberChange={(e) => setProfile({ ...profile, agentPhoneNumber: e.target.value })} 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
                
                <Field 
                  label="AGENT CORRESPONDENCE NAME" 
                  value={profile.agentCorrespondenceName} 
                  onChange={(e) => setProfile({ ...profile, agentCorrespondenceName: e.target.value.toUpperCase() })} 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
                
                <Field 
                  label="AGENT CORRESPONDENCE EMAIL" 
                  value={profile.agentCorrespondenceEmail} 
                  onChange={(e) => setProfile({ ...profile, agentCorrespondenceEmail: e.target.value })} 
                  type="email" 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
                
                <Field 
                  label="AGENT SIGNATORY NAME" 
                  value={profile.agentSignatoryName} 
                  onChange={(e) => setProfile({ ...profile, agentSignatoryName: e.target.value.toUpperCase() })} 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                />
                
                <Field 
                  label="AGENT SIGNATORY EMAIL" 
                  value={profile.agentSignatoryEmail} 
                  onChange={(e) => setProfile({ ...profile, agentSignatoryEmail: e.target.value })} 
                  type="email" 
                  isEditing={isEditing} 
                  isDarkMode={isDarkMode} 
                  cols={2}
                />
              </div>

              {/* Agent Bank Details */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h5 className={`font-medium mb-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  AGENT BANK DETAILS
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field 
                    label="BANK NAME" 
                    value={profile.agentBankName} 
                    onChange={(e) => setProfile({ ...profile, agentBankName: e.target.value.toUpperCase() })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="BANK BRANCH" 
                    value={profile.agentBankBranch} 
                    onChange={(e) => setProfile({ ...profile, agentBankBranch: e.target.value.toUpperCase() })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="ACCOUNT NAME" 
                    value={profile.agentBankAccountName} 
                    onChange={(e) => setProfile({ ...profile, agentBankAccountName: e.target.value.toUpperCase() })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                    cols={2}
                  />
                  
                  <Field 
                    label="SORT CODE" 
                    value={profile.agentBankSortCode} 
                    onChange={(e) => setProfile({ ...profile, agentBankSortCode: e.target.value })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="ACCOUNT NUMBER" 
                    value={profile.agentBankAccountNumber} 
                    onChange={(e) => setProfile({ ...profile, agentBankAccountNumber: e.target.value })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="IBAN (OPTIONAL)" 
                    value={profile.agentBankIBAN} 
                    onChange={(e) => setProfile({ ...profile, agentBankIBAN: e.target.value })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="SWIFT/BIC (OPTIONAL)" 
                    value={profile.agentBankSWIFT} 
                    onChange={(e) => setProfile({ ...profile, agentBankSWIFT: e.target.value })} 
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