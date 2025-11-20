import React, { useState } from 'react';
import { 
  Edit3, 
  Save, 
  Upload, 
  FileText, 
  Trash2, 
  BadgeCheck, 
  HelpCircle 
} from 'lucide-react';

// Country to flag emoji mapping
const getCountryFlag = (country) => {
  const flags = {
    'INDIA': '🇮🇳',
    'USA': '🇺🇸',
    'UK': '🇬🇧',
    'UNITED KINGDOM': '🇬🇧',
    'CANADA': '🇨🇦',
    'AUSTRALIA': '🇦🇺',
    'FRANCE': '🇫🇷',
    'GERMANY': '🇩🇪',
  };
  return flags[country.toUpperCase()] || '🌍';
};

// Tooltip component
const Tooltip = ({ text, isDarkMode }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <HelpCircle
        className="w-4 h-4 text-gray-400 cursor-help"
        // onMouseEnter={() => setShow(true)}
        // onMouseLeave={() => setShow(false)}
      />
      {show && (
        <div className={`absolute z-50 w-64 p-3 rounded-lg shadow-lg text-xs left-0 top-6 ${
          isDarkMode ? 'bg-gray-700 text-gray-200 border border-gray-600' : 'bg-white text-gray-700 border border-gray-200'
        }`}>
          {text}
        </div>
      )}
    </div>
  );
};

export function ProfileGeneral({ isDarkMode = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [uploadedFile, setUploadedFile] = useState({ name: 'Passport.pdf', expiry: '30/04/2030' });
  
  const [profile, setProfile] = useState({
    title: 'MR',
    firstName: 'SUNNY',
    lastName: 'SURESH',
    middleNames: '',
    alsoKnownAs: 'SUNNEY SURESH!',
    screenCreditName: 'SUNNEY SURESH!',
    pronouns: 'HE / HIM / HIS',
    sex: 'MALE',
    dateOfBirth: '1988-05-04',
    countryOfPermanentResidence: 'UNITED KINGDOM',
    countryOfLegalNationality: 'UNITED KINGDOM',
    proofOfNationality: 'PASSPORT',
    dietaryRequirements: '',
    allergies: '',
    passportFirstName: 'SUNNY',
    passportLastName: 'SURESH',
    passportPlaceOfBirth: 'VITHON KACHCHH',
    passportNumber: '527804794',
    passportExpiryDate: '2030-04-30',
    passportIssuingCountry: 'UNITED KINGDOM',
  });

  // const handleSave = () => {
  //   setIsEditing(false);
  //   toast.success('Profile updated successfully!');
  // };

  // const handlePassportUpload = (e) => {
  //   // File upload logic commented out
  // };

  // const handleRemoveFile = () => {
  //   setUploadedFile(null);
  // };

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-end gap-4 mb-6">
        {isEditing ? (
          <button
            // onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>SAVE</span>
          </button>
        ) : (
          <button
            // onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-bold"
          >
            EDIT
          </button>
        )}
      </div>

      {/* Names Section */}
      <div className={`rounded-xl p-4 md:p-6 shadow-sm border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg md:text-xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            NAMES
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCountryFlag(profile.countryOfLegalNationality)}</span>
            <div className="text-right">
              <div className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {profile.passportLastName}, {profile.passportFirstName}
                {isVerified && (
                  <div className="flex items-center gap-1">
                    <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500" />
                  </div>
                )}
              </div>
              {isVerified && (
                <p className="text-xs text-blue-600 font-medium">Eaarth Verified</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              TITLE
            </label>
            <select
              value={profile.title}
              // onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 transition-all text-sm md:text-base ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              <option>MR</option>
              <option>MS</option>
              <option>MRS</option>
              <option>DR</option>
              <option>PROF</option>
            </select>
          </div>

          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                FIRST NAME
              </label>
              <input
                type="text"
                value={profile.firstName}
                // onChange={(e) => setProfile({ ...profile, firstName: e.target.value.toUpperCase() })}
                disabled={!isEditing}
                placeholder="SUNNY"
                className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 transition-all text-sm md:text-base ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                LAST NAME
              </label>
              <input
                type="text"
                value={profile.lastName}
                // onChange={(e) => setProfile({ ...profile, lastName: e.target.value.toUpperCase() })}
                disabled={!isEditing}
                placeholder="SURESH"
                className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 transition-all text-sm md:text-base ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                }`}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              MIDDLE NAMES
            </label>
            <input
              type="text"
              value={profile.middleNames}
              disabled={!isEditing}
              placeholder="OPTIONAL"
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 transition-all text-sm md:text-base ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              ALSO KNOWN AS
              <Tooltip text="A different name you are also known as" isDarkMode={isDarkMode} />
            </label>
            <input
              type="text"
              value={profile.alsoKnownAs}
              disabled={!isEditing}
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 transition-all text-sm md:text-base ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              SCREEN CREDIT NAME
              <Tooltip text="How you would like your name to appear on screen credits" isDarkMode={isDarkMode} />
            </label>
            <input
              type="text"
              value={profile.screenCreditName}
              disabled={!isEditing}
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 transition-all text-sm md:text-base ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              PRONOUNS
            </label>
            <select
              value={profile.pronouns}
              disabled={!isEditing}
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 transition-all text-sm md:text-base ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              <option>HE / HIM / HIS</option>
              <option>SHE / HER / HERS</option>
              <option>THEY / THEM / THEIRS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Personal Section */}
      <div className={`rounded-xl p-4 md:p-6 shadow-sm border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <h2 className={`text-lg md:text-xl font-bold mb-4 md:mb-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
          PERSONAL
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              SEX
              <Tooltip text="Required for HMRC purposes" isDarkMode={isDarkMode} />
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  value="MALE"
                  checked={profile.sex === 'MALE'}
                  disabled={!isEditing}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>MALE</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  value="FEMALE"
                  checked={profile.sex === 'FEMALE'}
                  disabled={!isEditing}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>FEMALE</span>
              </label>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              DATE OF BIRTH
            </label>
            <input
              type="date"
              value={profile.dateOfBirth}
              disabled={!isEditing}
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 transition-all text-sm md:text-base ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              COUNTRY OF PERMANENT RESIDENCE
            </label>
            <select
              value={profile.countryOfPermanentResidence}
              disabled={!isEditing}
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 transition-all text-sm md:text-base ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              <option>UNITED KINGDOM</option>
              <option>UNITED STATES</option>
              <option>CANADA</option>
              <option>AUSTRALIA</option>
              <option>INDIA</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              DIETARY REQUIREMENTS
            </label>
            <textarea
              value={profile.dietaryRequirements}
              disabled={!isEditing}
              placeholder="E.G. VEGETARIAN, VEGAN, GLUTEN-FREE"
              rows={3}
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 transition-all text-sm md:text-base resize-none ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              ALLERGIES
            </label>
            <textarea
              value={profile.allergies}
              disabled={!isEditing}
              placeholder="E.G. PEANUTS, DAIRY, SHELLFISH"
              rows={3}
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 transition-all text-sm md:text-base resize-none ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Proof of Nationality Section */}
      <div className={`rounded-xl p-4 md:p-6 shadow-sm border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <h2 className={`text-lg md:text-xl font-bold mb-4 md:mb-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
          PROOF OF NATIONALITY
        </h2>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="proofOfNationality"
                value="PASSPORT"
                checked={profile.proofOfNationality === 'PASSPORT'}
                disabled={!isEditing}
                className="w-4 h-4 text-purple-600"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>PASSPORT</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="proofOfNationality"
                value="BIRTH CERTIFICATE"
                checked={profile.proofOfNationality === 'BIRTH CERTIFICATE'}
                disabled={!isEditing}
                className="w-4 h-4 text-purple-600"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>BIRTH CERTIFICATE</span>
            </label>
          </div>

          {/* Passport Upload Section */}
          {profile.proofOfNationality === 'PASSPORT' && uploadedFile && (
            <div className={`p-4 rounded-lg border flex items-center justify-between ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-600' : 'bg-white'
                }`}>
                  <FileText className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {uploadedFile.name}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    expires {uploadedFile.expiry}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={`px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}>
                  CHANGE FILE
                </button>
                <button className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}