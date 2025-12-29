import React from 'react';
import { Field, FileUpload } from '../common/UnifiedFields';

export default function IdentityDetails({ profile, setProfile, isEditing, isDarkMode, uploads, setUploads }) {
  return (
    <div className="rounded-3xl border shadow-md p-6 bg-card border-border">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field 
            label="TITLE" 
            value={profile.title} 
            onChange={(e) => setProfile({ ...profile, title: e.target.value })} 
            options={['MR', 'MS', 'MRS', 'DR', 'PROF']} 
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
          />
          
          <Field 
            label="LEGAL FIRST NAME" 
            value={profile.firstName} 
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value.toUpperCase() })} 
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
          />
          
          <Field 
            label="LEGAL LAST NAME" 
            value={profile.lastName} 
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value.toUpperCase() })} 
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
          />

          <Field 
            label="MIDDLE NAMES" 
            value={profile.middleNames} 
            onChange={(e) => setProfile({ ...profile, middleNames: e.target.value.toUpperCase() })} 
            placeholder="OPTIONAL"
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
            cols={3} 
          />
          
          <Field 
            label="ALSO KNOWN AS" 
            value={profile.alsoKnownAs} 
            onChange={(e) => setProfile({ ...profile, alsoKnownAs: e.target.value.toUpperCase() })} 
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
            cols={3} 
          />
          
          <Field 
            label="SCREEN CREDIT NAME" 
            value={profile.screenCreditName} 
            onChange={(e) => setProfile({ ...profile, screenCreditName: e.target.value.toUpperCase() })} 
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
            cols={3} 
          />

          <Field 
            label="PRONOUNS" 
            value={profile.pronouns} 
            onChange={(e) => setProfile({ ...profile, pronouns: e.target.value })} 
            options={['HE / HIM / HIS', 'SHE / HER / HERS', 'THEY / THEM / THEIRS', 'PREFER NOT TO SAY']} 
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
          />

          <Field 
            label="SEX" 
            value={profile.sex} 
            onChange={(e) => setProfile({ ...profile, sex: e.target.value })} 
            options={['MALE', 'FEMALE']} 
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
          />

          <Field 
            label="DATE OF BIRTH" 
            value={profile.dateOfBirth} 
            onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })} 
            type="date" 
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
          />

          <Field 
            label="COUNTRY OF RESIDENCE" 
            value={profile.countryOfPermanentResidence} 
            onChange={(e) => setProfile({ ...profile, countryOfPermanentResidence: e.target.value })} 
            options={['UNITED KINGDOM', 'USA', 'CANADA', 'AUSTRALIA', 'INDIA']} 
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
          />

          <Field 
            label="NATIONALITY" 
            value={profile.countryOfLegalNationality} 
            onChange={(e) => setProfile({ ...profile, countryOfLegalNationality: e.target.value })} 
            options={['UNITED KINGDOM', 'USA', 'CANADA', 'AUSTRALIA', 'INDIA']} 
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
            cols={2} 
          />
        </div>

        {/* Proof of Nationality Section */}
        <div className="pt-6 border-t border-border">
          <h4 className="font-medium mb-4 text-foreground">
            PROOF OF NATIONALITY
          </h4>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="proofOfNationality" 
                  value="PASSPORT" 
                  checked={profile.proofOfNationality === 'PASSPORT'} 
                  onChange={(e) => setProfile({ ...profile, proofOfNationality: e.target.value })} 
                  disabled={!isEditing} 
                  className={`w-4 h-4 ${isDarkMode ? 'accent-lavender-400' : 'accent-primary'}`}
                />
                <span className="text-sm text-foreground">
                  PASSPORT
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="proofOfNationality" 
                  value="BIRTH CERTIFICATE" 
                  checked={profile.proofOfNationality === 'BIRTH CERTIFICATE'} 
                  onChange={(e) => setProfile({ ...profile, proofOfNationality: e.target.value })} 
                  disabled={!isEditing} 
                  className={`w-4 h-4 ${isDarkMode ? 'accent-lavender-400' : 'accent-primary'}`}
                />
                <span className="text-sm text-foreground">
                  BIRTH CERTIFICATE
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="proofOfNationality" 
                  value="CERTIFICATE OF REGISTRATION OR NATURALISATION" 
                  checked={profile.proofOfNationality === 'CERTIFICATE OF REGISTRATION OR NATURALISATION'} 
                  onChange={(e) => setProfile({ ...profile, proofOfNationality: e.target.value })} 
                  disabled={!isEditing} 
                  className={`w-4 h-4 ${isDarkMode ? 'accent-lavender-400' : 'accent-primary'}`}
                />
                <span className="text-sm text-foreground">
                  CERTIFICATE OF REGISTRATION OR NATURALISATION
                </span>
              </label>
            </div>

            {/* Passport Fields */}
            {profile.proofOfNationality === 'PASSPORT' && (
              <div className="mt-6 space-y-4  rounded-3xl ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field 
                    label="PASSPORT FIRST NAME" 
                    value={profile.passportFirstName} 
                    onChange={(e) => setProfile({ ...profile, passportFirstName: e.target.value.toUpperCase() })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="PASSPORT LAST NAME" 
                    value={profile.passportLastName} 
                    onChange={(e) => setProfile({ ...profile, passportLastName: e.target.value.toUpperCase() })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="PLACE OF BIRTH" 
                    value={profile.passportPlaceOfBirth} 
                    onChange={(e) => setProfile({ ...profile, passportPlaceOfBirth: e.target.value.toUpperCase() })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="PASSPORT ISSUING COUNTRY" 
                    value={profile.passportIssuingCountry} 
                    onChange={(e) => setProfile({ ...profile, passportIssuingCountry: e.target.value })} 
                    options={['UNITED KINGDOM', 'UNITED STATES', 'CANADA', 'AUSTRALIA', 'INDIA']} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="PASSPORT NUMBER" 
                    value={profile.passportNumber} 
                    onChange={(e) => setProfile({ ...profile, passportNumber: e.target.value.toUpperCase() })} 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                  
                  <Field 
                    label="PASSPORT EXPIRY DATE" 
                    value={profile.passportExpiryDate} 
                    onChange={(e) => setProfile({ ...profile, passportExpiryDate: e.target.value })} 
                    type="date" 
                    isEditing={isEditing} 
                    isDarkMode={isDarkMode} 
                  />
                </div>

                <FileUpload
                  fieldLabel="Passport"
                  fileName="Passport.pdf"
                  isUploaded={uploads?.passport}
                  isEditing={isEditing}
                  isDarkMode={isDarkMode}
                  onUpload={() => setUploads(prev => ({ ...prev, passport: true }))}
                  onDelete={() => setUploads(prev => ({ ...prev, passport: false }))}
                />
              </div>
            )}

            {/* Birth Certificate Fields */}
            {profile.proofOfNationality === 'BIRTH CERTIFICATE' && (
              <div className={`mt-6 space-y-4 p-6 rounded-2xl ${isDarkMode ? 'bg-muted' : 'bg-muted'}`}>
                <FileUpload
                  fieldLabel="Birth Certificate"
                  fileName="Birth_Certificate.pdf"
                  isUploaded={uploads?.birthCertificate}
                  isEditing={isEditing}
                  isDarkMode={isDarkMode}
                  onUpload={() => setUploads(prev => ({ ...prev, birthCertificate: true }))}
                  onDelete={() => setUploads(prev => ({ ...prev, birthCertificate: false }))}
                />
                
                <FileUpload
                  fieldLabel="NI Proof"
                  fileName="NI_Proof.pdf"
                  isUploaded={uploads?.niProof}
                  isEditing={isEditing}
                  isDarkMode={isDarkMode}
                  onUpload={() => setUploads(prev => ({ ...prev, niProof: true }))}
                  onDelete={() => setUploads(prev => ({ ...prev, niProof: false }))}
                />
              </div>
            )}

            {/* Certificate of Naturalisation */}
            {profile.proofOfNationality === 'CERTIFICATE OF REGISTRATION OR NATURALISATION' && (
              <div className={`mt-6 space-y-4 p-6 rounded-2xl ${isDarkMode ? 'bg-muted' : 'bg-muted'}`}>
                <FileUpload
                  fieldLabel="Certificate of Naturalisation"
                  fileName="Certificate_Naturalisation.pdf"
                  isUploaded={uploads?.certificateNaturalisation}
                  isEditing={isEditing}
                  isDarkMode={isDarkMode}
                  onUpload={() => setUploads(prev => ({ ...prev, certificateNaturalisation: true }))}
                  onDelete={() => setUploads(prev => ({ ...prev, certificateNaturalisation: false }))}
                />
                
                <FileUpload
                  fieldLabel="NI Proof"
                  fileName="NI_Proof.pdf"
                  isUploaded={uploads?.niProof}
                  isEditing={isEditing}
                  isDarkMode={isDarkMode}
                  onUpload={() => setUploads(prev => ({ ...prev, niProof: true }))}
                  onDelete={() => setUploads(prev => ({ ...prev, niProof: false }))}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}







