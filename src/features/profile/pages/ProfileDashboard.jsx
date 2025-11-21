import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Sparkles, BadgeCheck, Upload, Edit3, Save, User, 
  MapPin, Phone, Mail, DollarSign, CreditCard, Building, Shield,
  Calendar, Globe, Heart, Utensils, AlertCircle, FileText, Camera,
  Briefcase, Wallet, Car, Home, ChevronDown, ChevronUp, Check, Download, Trash2, HelpCircle,
  QrCode, Smartphone, X, CheckCircle, Zap
} from 'lucide-react';

// Mock QRCode component (replace with actual library in production)
const QRCode = ({ value, size, level }) => (
  <div style={{ width: size, height: size, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #000' }}>
    <div style={{ fontSize: '10px', textAlign: 'center', padding: '10px' }}>QR Code<br/>{value}</div>
  </div>
);

const getCountryFlag = (country) => {
  const flags = {
    'INDIA': '🇮🇳', 'USA': '🇺🇸', 'UK': '🇬🇧', 'UNITED KINGDOM': '🇬🇧',
    'CANADA': '🇨🇦', 'AUSTRALIA': '🇦🇺', 'FRANCE': '🇫🇷', 'GERMANY': '🇩🇪',
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
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
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

// File Upload Component
const FileUploadBox = ({ 
  fileName, 
  isUploaded, 
  isEditing, 
  isDarkMode, 
  onUpload, 
  onDelete,
  fieldLabel
}) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleFileSelect = () => {
    if (!isEditing) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setIsScanning(true);
        alert(`🤖 Eaarth AI is scanning ${fieldLabel || 'document'}...`);
        
        setTimeout(() => {
          setIsScanning(false);
          alert(`✅ ${fieldLabel || 'Document'} scanned and verified!`);
          onUpload();
        }, 2000);
      }
    };
    input.click();
  };

  if (isUploaded) {
    return (
      <div className={`border rounded-lg p-4 flex items-center justify-between ${
        isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <FileText className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {fileName}
            </p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              AI VERIFIED & SAVED
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className={`p-2 rounded hover:bg-opacity-80 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
            <Download className="w-4 h-4 text-[#7e57c2]" />
          </button>
          <button
            disabled={!isEditing}
            onClick={onDelete}
            className="p-2 rounded hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className={`border rounded-lg p-4 text-center ${
        isDarkMode ? 'border-[#7e57c2] bg-transparent' : 'border-[#7e57c2] bg-transparent'
      }`}>
        <div className="w-6 h-6 mx-auto mb-2 animate-spin">
          <Sparkles className="w-6 h-6 text-[#7e57c2]" />
        </div>
        <p className="text-sm font-medium text-[#7e57c2]">
          EAARTH AI SCANNING...
        </p>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Extracting and verifying data
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`border border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
        isDarkMode ? 'border-gray-600 bg-gray-700/30 hover:border-[#7e57c2]' : 'border-gray-300 bg-[#ede7f6]/30 hover:border-[#7e57c2]'
      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`} 
      onClick={handleFileSelect}
    >
      <Upload className={`w-6 h-6 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-[#7e57c2]'}`} />
      <button
        disabled={!isEditing}
        className={`text-sm font-medium ${isDarkMode ? 'text-[#9575cd]' : 'text-[#7e57c2]'} disabled:opacity-50`}
      >
        SELECT A FILE
      </button>
      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        PDF, JPG, PNG - Up to 5MB • AI Powered
      </p>
    </div>
  );
};

export default function ProfileDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [uploadedPassportFile, setUploadedPassportFile] = useState({ name: 'Passport.pdf', expiry: '30/04/2030' });
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeTab, setActiveTab] = useState('identity');
  
  // Toggles
  const [haveAgent, setHaveAgent] = useState(true);
  const [sendEmailsToCrewMember, setSendEmailsToCrewMember] = useState(true);
  const [useLoanOutCompany, setUseLoanOutCompany] = useState(true);
  const [isVATRegistered, setIsVATRegistered] = useState(true);
  const [useOwnVehicle, setUseOwnVehicle] = useState(true);

  // File upload states
  const [uploadedBirthCertificate, setUploadedBirthCertificate] = useState(false);
  const [uploadedNIProof, setUploadedNIProof] = useState(false);
  const [uploadedCertificateOfNaturalisation, setUploadedCertificateOfNaturalisation] = useState(false);
  const [uploadedDrivingLicence, setUploadedDrivingLicence] = useState(true);
  const [uploadedVehicleInsurance, setUploadedVehicleInsurance] = useState(false);
  const [uploadedBoxInventory, setUploadedBoxInventory] = useState(false);
  const [uploadedSoftwareLicence, setUploadedSoftwareLicence] = useState(false);
  const [uploadedEquipmentInventory, setUploadedEquipmentInventory] = useState(false);
  const [uploadedMobileBill, setUploadedMobileBill] = useState(false);
  const [uploadedFS4, setUploadedFS4] = useState(false);
  const [uploadedPayslip, setUploadedPayslip] = useState(false);
  const [uploadedP45, setUploadedP45] = useState(false);
  const [uploadedVATCert, setUploadedVATCert] = useState(true);
  const [uploadedCompanyCertificate, setUploadedCompanyCertificate] = useState(true);

  const [profile, setProfile] = useState({
    // IDENTITY & PERSONAL
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
    
    // PASSPORT
    passportFirstName: 'SUNNY',
    passportLastName: 'SURESH',
    passportPlaceOfBirth: 'VITHON KACHCHH',
    passportNumber: '527804794',
    passportExpiryDate: '2030-04-30',
    passportIssuingCountry: 'UNITED KINGDOM',
    
    // CONTACT & ADDRESS
    addressLine1: 'LITTLE MEAD HOUSE',
    addressLine2: 'LEIGHTON ROAD, OPP CHOAKES YARD, GREAT BILLINGTON,',
    addressLine3: 'LEIGHTON BUZZARD, BEDFORDSHIRE',
    postcode: 'LU7 9BJ',
    country: 'UNITED KINGDOM',
    mobileCountryCode: '+44',
    mobileNumber: '7377 005 116',
    otherCountryCode: '+44',
    otherNumber: '7498 510238',
    email: 'ssunny.surani@icloud.com',
    emailPayslip: 'ssunny.surani@icloud.com',
    emailPension: 'ssunny.surani@icloud.com',
    
    // EMERGENCY CONTACT
    emergencyName: 'DIKSHA SURANI',
    emergencyRelationship: 'WIFE',
    emergencyCountryCode: '+44',
    emergencyNumber: '7499510238',
    
    // AGENT/AGENCY
    agencyName: 'MARGOO STUDIOS LTD',
    agencyAddressLine1: 'LITTLE MEAD HOUSE',
    agencyAddressLine2: 'LEIGHTON ROAD',
    agencyAddressLine3: 'GREAT BILLINGTON, LEIGHTON BUZZARD',
    agencyPostcode: 'LU7 9BJ',
    agencyCountry: 'UNITED KINGDOM',
    agentPhoneCountryCode: '+44',
    agentPhoneNumber: '2773009116',
    agentCorrespondenceName: 'MARGOO STUDIOS',
    agentCorrespondenceEmail: 'hello@margoostudios.com',
    agentSignatoryName: 'SUNNEY SURANI',
    agentSignatoryEmail: 'hello@margoostudios.com',
    
    // AGENT BANK
    agentBankName: 'STARLING BANK',
    agentBankBranch: 'LONDON',
    agentBankAccountName: 'MARGOO STUDIOS LTD',
    agentBankSortCode: '608371',
    agentBankAccountNumber: '18896647',
    agentBankIBAN: 'GB34SRLG06087718896647',
    agentBankSWIFT: 'SRLGGB2L',
    
    // HEALTH & DIETARY
    dietaryRequirements: 'VEGETARIAN',
    allergies: 'PEANUTS, SHELLFISH',
    
    // PAYMENT & TAX
    ppsNumber: '',
    taxClearanceAccessNumber: '',
    ktNumber: '',
    nationalInsuranceNumber: 'SK349982C',
    vatNumber: '425147119',
    studentLoan: 'no',
    payeContract: '',
    
    // PERSONAL BANK
    personalBankName: 'HSBC',
    personalBankBranch: 'LONDON',
    personalBankAccountName: 'SUNNY SURANI',
    personalBankSortCode: '40-02-40',
    personalBankAccountNumber: '01517988',
    personalBankIBAN: '',
    personalBankSwift: '',
    personalBankNumberIceland: '',
    personalBankHBIceland: '',
    personalBankAccountNumberIceland: '',
    
    // COMPANY DETAILS
    companyName: 'SUNNY SURANI LIMITED',
    companyRegistrationNumber: '08279633',
    companyKtNumber: '',
    companyCountryOfIncorporation: 'England & Wales',
    taxRegistrationNumberIreland: '425147119',
    taxClearanceAccessNumberIreland: 'UK',
    companyAddressLine1: 'Little Mead House',
    companyAddressLine2: 'Leighton Road',
    companyAddressLine3: 'Great Billington, Leighton Buzzard',
    companyAddressLine4: 'LU7 9BJ',
    companyCountry: 'United Kingdom',
    companyRepresentativeName: 'Sunny Surani',
    companyEmailAddress: 'sunnysurani@icloud.com',
    
    // COMPANY BANK
    companyBankName: 'HSBC',
    companyBankBranch: 'Online',
    companyBankAccountName: 'SUNNY SURANI LIMITED',
    companyBankSortCode: '40-18-00',
    companyBankAccountNumber: '80723762',
    companyBankIBAN: '',
    companyBankSwift: '',
    companyBankNumberIceland: '',
    companyBankHBIceland: '',
    companyBankAccountNumberIceland: '',
    
    // ALLOWANCES - BOX
    boxInsuranceValue: '1.00',
    
    // ALLOWANCES - COMPUTER
    computerDescription: 'MAC BOOK PRO',
    computerInsuranceValue: '4,000.00',
    
    // ALLOWANCES - SOFTWARE
    softwareDescription: '',
    softwareTotalAnnualCost: '',
    
    // ALLOWANCES - EQUIPMENT
    equipmentInsuranceValue: '',
    
    // ALLOWANCES - VEHICLE
    vehicleMake: 'KIA',
    vehicleModel: 'NIRO',
    vehicleColour: 'GREY',
    vehicleRegistration: 'DK17 SHA',
    vehicleInsuranceExpiryDate: '2026-01-01',
  });

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    alert('Changes cancelled');
  };

  const handlePassportUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      alert('🔍 AI is scanning your passport...');
      
      setTimeout(() => {
        const expiryDate = '30/04/2030';
        setProfile({
          ...profile,
          passportFirstName: 'SUNNY',
          passportLastName: 'SURESH',
          passportPlaceOfBirth: 'VITHON KACHCHH',
          passportNumber: '527804794',
          passportExpiryDate: '2030-04-30',
          passportIssuingCountry: 'UNITED KINGDOM',
          firstName: 'SUNNY',
          lastName: 'SURESH',
          dateOfBirth: '1988-05-04',
          countryOfLegalNationality: 'UNITED KINGDOM',
        });
        setUploadedPassportFile({ name: 'Passport.pdf', expiry: expiryDate });
        setIsScanning(false);
        setIsVerified(true);
        alert('✅ Passport verified! Eaarth Studios verification badge awarded.');
      }, 2000);
    }
  };

  const handleRemovePassportFile = () => {
    setUploadedPassportFile(null);
    alert('Document removed');
  };

  const handleFileUpload = (field, file) => {
    alert('File uploaded successfully!');
  };

  const Field = ({ label, value, onChange, type = 'text', options, cols = 1, placeholder = '', tooltip = '' }) => (
    <div className={cols === 2 ? 'md:col-span-2' : cols === 3 ? 'md:col-span-3' : ''}>
      <label className={`block text-xs font-medium mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
        {tooltip && <Tooltip text={tooltip} isDarkMode={isDarkMode} />}
      </label>
      {options ? (
        <select
          value={value}
          onChange={onChange}
          disabled={!isEditing}
          className={`w-full px-4 py-3 border rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-[#7e57c2] ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-700 text-white disabled:opacity-50' 
              : 'bg-gray-50 border-gray-200 text-gray-900 disabled:opacity-50'
          }`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          disabled={!isEditing}
          placeholder={placeholder}
          rows={3}
          className={`w-full px-4 py-3 border rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-[#7e57c2] resize-none ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-700 text-white disabled:opacity-50 placeholder:text-gray-600' 
              : 'bg-gray-50 border-gray-200 text-gray-900 disabled:opacity-50 placeholder:text-gray-400'
          }`}
        />
      ) : type === 'radio' ? (
        <div className="flex gap-4">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={label}
                value={opt}
                checked={value === opt}
                onChange={onChange}
                disabled={!isEditing}
                className="w-4 h-4 text-[#7e57c2] focus:ring-[#7e57c2]"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{opt}</span>
            </label>
          ))}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={!isEditing}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-[#7e57c2] ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-700 text-white disabled:opacity-50 placeholder:text-gray-600' 
              : 'bg-gray-50 border-gray-200 text-gray-900 disabled:opacity-50 placeholder:text-gray-400'
          }`}
        />
      )}
    </div>
  );

  const PhoneField = ({ label, codeValue, numberValue, onCodeChange, onNumberChange }) => (
    <div>
      <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </label>
      <div className="flex gap-2">
        <select
          value={codeValue}
          onChange={onCodeChange}
          disabled={!isEditing}
          className={`w-24 px-2 py-3 border rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-[#7e57c2] ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-700 text-white disabled:opacity-50' 
              : 'bg-gray-50 border-gray-200 text-gray-900 disabled:opacity-50'
          }`}
        >
          {['+44', '+1', '+91', '+61', '+33', '+49'].map(code => (
            <option key={code}>{code}</option>
          ))}
        </select>
        <input
          type="tel"
          value={numberValue}
          onChange={onNumberChange}
          disabled={!isEditing}
          className={`flex-1 px-4 py-3 border rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-[#7e57c2] ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-700 text-white disabled:opacity-50' 
              : 'bg-gray-50 border-gray-200 text-gray-900 disabled:opacity-50'
          }`}
        />
      </div>
    </div>
  );

  const Toggle = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between">
      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={!isEditing}
          className="sr-only peer"
        />
        <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
          checked 
            ? 'bg-[#7e57c2]' 
            : isDarkMode 
            ? 'bg-gray-600' 
            : 'bg-gray-300'
        }`}></div>
      </label>
    </div>
  );

  const Section = ({ id, icon: Icon, title, subtitle, color, children }) => {
    return (
      <div
        id={`section-${id}`}
        className={`rounded-xl border p-6 shadow-md dark:shadow-shadow ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-whit border-gray-200'
        }`}
      >
        {children}
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-0 ${isDarkMode ? '' : 'bg-gray-5'}`}>
      <div className="max-w-7xl mx-auto p- space-y-6">
        {/* Header */}
        <div className={`rounded-xl border p-6 shadow-md dark:shadow-shadow ${isDarkMode ? 'bg-gray-80 border-gray-700' : 'bg-whit border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-[#7e57c2]" />
              <div>
                <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  MY PROFILE
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your personal information and preferences
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setShowQRModal(!showQRModal)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  showQRModal 
                    ? 'bg-[#7e57c2] text-white' 
                    : isDarkMode 
                    ? 'bg-gray-700 text-white border border-gray-600' 
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <QrCode className="w-4 h-4" />
                {showQRModal ? 'HIDE QR CODE' : 'SHOW QR CODE'}
              </button>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-[#7e57c2] text-white flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    SAVE CHANGES
                  </button>
                  <button
                    onClick={handleCancel}
                    className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}
                  >
                    CANCEL
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg bg-[#7e57c2] text-white flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  EDIT PROFILE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className={`rounded-xl border p-6 shadow-md dark:shadow-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl bg-[#7e57c2] flex items-center justify-center text-white font-medium text-2xl">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                {isVerified && (
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                    <BadgeCheck className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              <div>
                <h2 className={`text-lg font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  DIRECTOR OF PHOTOGRAPHY
                </p>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500 text-white text-xs font-medium">
                    <BadgeCheck className="w-3 h-3" />
                    EAARTH VERIFIED
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <div className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  12
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  PROJECTS
                </div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  36
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  PENDING DOCS
                </div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  100%
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  COMPLETE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        {showQRModal && (
          <div className={`rounded-xl border border-purple-300 p-6 shadow-md dark:shadow-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#7e57c2] flex items-center justify-center text-white font-medium text-xl">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className={`font-medium text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.firstName.toUpperCase()} {profile.lastName.toUpperCase()}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    DIRECTOR OF PHOTOGRAPHY
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-[#7e57c2]">
                <QRCode
                  value="https://eaarth.app/crew/js-2024-dop"
                  size={180}
                  level="H"
                />
                <div className="text-center mt-3">
                  <div className="font-medium text-xs text-gray-900 bg-purple-100 px-2 py-1 rounded-full border border-purple-300">
                    ID: JS-2024-DOP
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  SCAN TO ACCESS MY PROFILE
                </h4>
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Use the <strong>Eaarth Phone App</strong> to scan this QR code for:
                </p>
                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#7e57c2]">●</span>
                    <span><strong>Quick Login</strong> - Access your profile on mobile devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#7e57c2]">●</span>
                    <span><strong>Digital Crew Pass</strong> - Show your credentials on set</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#7e57c2]">●</span>
                    <span><strong>Contact Card</strong> - Share your professional info instantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#7e57c2]">●</span>
                    <span><strong>Schedule Sync</strong> - View your call times and bookings</span>
                  </li>
                </ul>
                <div className={`mt-3 p-2 rounded-lg text-xs ${
                  isDarkMode ? 'bg-gray-700' : 'bg-[#ede7f6]'
                }`}>
                  <strong className={isDarkMode ? 'text-[#9575cd]' : 'text-purple-700'}>Profile URL:</strong>
                  <span className={`ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#7e57c2]'}`}>
                    https://eaarth.app/crew/js-2024-dop
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className={`rounded-xl border p-4 ${isDarkMode ? 'bg-gray-50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'identity', label: 'IDENTITY', icon: User },
              { value: 'contact', label: 'CONTACT', icon: MapPin },
              { value: 'financial', label: 'FINANCIAL', icon: DollarSign },
              { value: 'allowances', label: 'ALLOWANCES', icon: Car },
              { value: 'health', label: 'HEALTH', icon: Heart },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === value
                    ? 'bg-[#7e57c2] text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* IDENTITY & PERSONAL Section */}
        {activeTab === 'identity' && (
          <Section
            id="identity"
            icon={User}
            title="IDENTITY & PERSONAL"
            subtitle="Basic information, passport, and identification"
            color="bg-[#7e57c2] "
          >
            <div className="space-y-6 bg-white p-6 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="TITLE" value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} options={['MR', 'MS', 'MRS', 'DR', 'PROF']} />
                <Field label="FIRST NAME" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value.toUpperCase() })} />
                <Field label="LAST NAME" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value.toUpperCase() })} />
                <Field label="MIDDLE NAMES" value={profile.middleNames} onChange={(e) => setProfile({ ...profile, middleNames: e.target.value.toUpperCase() })} placeholder="OPTIONAL" cols={3} />
                <Field label="ALSO KNOWN AS" value={profile.alsoKnownAs} onChange={(e) => setProfile({ ...profile, alsoKnownAs: e.target.value.toUpperCase() })} tooltip="A different name you are also known as" cols={3} />
                <Field label="SCREEN CREDIT NAME" value={profile.screenCreditName} onChange={(e) => setProfile({ ...profile, screenCreditName: e.target.value.toUpperCase() })} tooltip="How you would like your name to appear should the Company/Producer give you a credit on the production" cols={3} />
                <Field label="PRONOUNS" value={profile.pronouns} onChange={(e) => setProfile({ ...profile, pronouns: e.target.value })} options={['HE / HIM / HIS', 'SHE / HER / HERS', 'THEY / THEM / THEIRS', 'PREFER NOT TO SAY']} />
                <Field label="SEX" value={profile.sex} onChange={(e) => setProfile({ ...profile, sex: e.target.value })} type="radio" options={['MALE', 'FEMALE']} tooltip="This information is collected for HMRC (UK) purposes" />
                <Field label="DATE OF BIRTH" value={profile.dateOfBirth} onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })} type="date" />
                <Field label="COUNTRY OF RESIDENCE" value={profile.countryOfPermanentResidence} onChange={(e) => setProfile({ ...profile, countryOfPermanentResidence: e.target.value })} options={['UNITED KINGDOM', 'USA', 'CANADA', 'AUSTRALIA', 'INDIA']} />
                <Field label="NATIONALITY" value={profile.countryOfLegalNationality} onChange={(e) => setProfile({ ...profile, countryOfLegalNationality: e.target.value })} options={['UNITED KINGDOM', 'USA', 'CANADA', 'AUSTRALIA', 'INDIA']} cols={2} />
              </div>

              {/* PROOF OF NATIONALITY */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  PROOF OF NATIONALITY
                  <Tooltip text="If you don't have a passport, please select & provide the alternative proof of nationality." isDarkMode={isDarkMode} />
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
                        className="w-4 h-4 text-[#7e57c2] focus:ring-[#7e57c2]"
                      />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>PASSPORT</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="proofOfNationality"
                        value="BIRTH CERTIFICATE"
                        checked={profile.proofOfNationality === 'BIRTH CERTIFICATE'}
                        onChange={(e) => setProfile({ ...profile, proofOfNationality: e.target.value })}
                        disabled={!isEditing}
                        className="w-4 h-4 text-[#7e57c2] focus:ring-[#7e57c2]"
                      />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>BIRTH CERTIFICATE</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="proofOfNationality"
                        value="CERTIFICATE OF REGISTRATION OR NATURALISATION"
                        checked={profile.proofOfNationality === 'CERTIFICATE OF REGISTRATION OR NATURALISATION'}
                        onChange={(e) => setProfile({ ...profile, proofOfNationality: e.target.value })}
                        disabled={!isEditing}
                        className="w-4 h-4 text-[#7e57c2] focus:ring-[#7e57c2]"
                      />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>CERTIFICATE OF REGISTRATION OR NATURALISATION</span>
                    </label>
                  </div>

                  {/* Passport Fields */}
                  {profile.proofOfNationality === 'PASSPORT' && (
                    <div className="mt-6 space-y-4 bg-white p-6 rounded-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="PASSPORT FIRST NAME" value={profile.passportFirstName} onChange={(e) => setProfile({ ...profile, passportFirstName: e.target.value.toUpperCase() })} />
                        <Field label="PASSPORT LAST NAME" value={profile.passportLastName} onChange={(e) => setProfile({ ...profile, passportLastName: e.target.value.toUpperCase() })} />
                        <Field label="PLACE OF BIRTH" value={profile.passportPlaceOfBirth} onChange={(e) => setProfile({ ...profile, passportPlaceOfBirth: e.target.value.toUpperCase() })} />
                        <Field label="PASSPORT ISSUING COUNTRY" value={profile.passportIssuingCountry} onChange={(e) => setProfile({ ...profile, passportIssuingCountry: e.target.value })} options={['UNITED KINGDOM', 'UNITED STATES', 'CANADA', 'AUSTRALIA', 'INDIA']} />
                        <Field label="PASSPORT NUMBER" value={profile.passportNumber} onChange={(e) => setProfile({ ...profile, passportNumber: e.target.value.toUpperCase() })} />
                        <Field label="PASSPORT EXPIRY DATE" value={profile.passportExpiryDate} onChange={(e) => setProfile({ ...profile, passportExpiryDate: e.target.value })} type="date" />
                      </div>

                      {/* Passport Upload */}
                      <div>
                        <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          UPLOAD A FILE OF YOUR PASSPORT
                        </label>
                        {uploadedPassportFile ? (
                          <div className={`p-4 rounded-lg border flex items-center justify-between ${
                            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              <FileText className="w-6 h-6 text-blue-500" />
                              <div>
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {uploadedPassportFile.name}
                                </p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  expires {uploadedPassportFile.expiry}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={handleRemovePassportFile}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="relative">
                            <input
                              type="file"
                              id="passport-upload"
                              accept="image/*,.pdf"
                              onChange={handlePassportUpload}
                              disabled={!isEditing || isScanning}
                              className="hidden"
                            />
                            <label
                              htmlFor="passport-upload"
                              className={`w-full px-4 py-8 border border-dashed rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer ${
                                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                              }`}
                            >
                              {isScanning ? (
                                <>
                                  <div className="w-12 h-12 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                                  <span className="text-[#7e57c2] font-medium">AI is scanning...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-12 h-12 text-[#7e57c2]" />
                                  <span className="text-[#7e57c2] font-medium">UPLOAD PASSPORT</span>
                                </>
                              )}
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Birth Certificate */}
                  {profile.proofOfNationality === 'BIRTH CERTIFICATE' && (
                    <div className="mt-6 space-y-4 bg-white p-6 rounded-2xl">
                      <FileUploadBox
                        fileName="Birth_Certificate.pdf"
                        isUploaded={uploadedBirthCertificate}
                        isEditing={isEditing}
                        isDarkMode={isDarkMode}
                        onUpload={() => setUploadedBirthCertificate(true)}
                        onDelete={() => setUploadedBirthCertificate(false)}
                        fieldLabel="Birth Certificate"
                      />
                      <FileUploadBox
                        fileName="NI_Proof.pdf"
                        isUploaded={uploadedNIProof}
                        isEditing={isEditing}
                        isDarkMode={isDarkMode}
                        onUpload={() => setUploadedNIProof(true)}
                        onDelete={() => setUploadedNIProof(false)}
                        fieldLabel="National Insurance Proof"
                      />
                    </div>
                  )}

                  {/* Certificate of Naturalisation */}
                  {profile.proofOfNationality === 'CERTIFICATE OF REGISTRATION OR NATURALISATION' && (
                    <div className="mt-6 space-y-4">
                      <FileUploadBox
                        fileName="Certificate_Naturalisation.pdf"
                        isUploaded={uploadedCertificateOfNaturalisation}
                        isEditing={isEditing}
                        isDarkMode={isDarkMode}
                        onUpload={() => setUploadedCertificateOfNaturalisation(true)}
                        onDelete={() => setUploadedCertificateOfNaturalisation(false)}
                        fieldLabel="Certificate of Naturalisation"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* CONTACT & ADDRESS Section */}
        {activeTab === 'contact' && (
          <Section id="contact" icon={MapPin} title="CONTACT & LOCATION" subtitle="Address, phone, email, emergency contact">
            <div className="space-y-6 bg-white p-6 rounded-2xl">
              <div>
                <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Home className="w-5 h-5" />
                  HOME ADDRESS
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <Field label="ADDRESS LINE 1" value={profile.addressLine1} onChange={(e) => setProfile({ ...profile, addressLine1: e.target.value.toUpperCase() })} />
                  <Field label="ADDRESS LINE 2" value={profile.addressLine2} onChange={(e) => setProfile({ ...profile, addressLine2: e.target.value.toUpperCase() })} />
                  <Field label="ADDRESS LINE 3" value={profile.addressLine3} onChange={(e) => setProfile({ ...profile, addressLine3: e.target.value.toUpperCase() })} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="POSTCODE" value={profile.postcode} onChange={(e) => setProfile({ ...profile, postcode: e.target.value.toUpperCase() })} />
                    <Field label="COUNTRY" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} options={['UNITED KINGDOM', 'UNITED STATES', 'CANADA', 'AUSTRALIA', 'INDIA']} />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Phone className="w-5 h-5" />
                  CONTACT INFORMATION
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PhoneField 
                    label="MOBILE TELEPHONE" 
                    codeValue={profile.mobileCountryCode} 
                    numberValue={profile.mobileNumber}
                    onCodeChange={(e) => setProfile({ ...profile, mobileCountryCode: e.target.value })}
                    onNumberChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
                  />
                  <PhoneField 
                    label="OTHER TELEPHONE" 
                    codeValue={profile.otherCountryCode} 
                    numberValue={profile.otherNumber}
                    onCodeChange={(e) => setProfile({ ...profile, otherCountryCode: e.target.value })}
                    onNumberChange={(e) => setProfile({ ...profile, otherNumber: e.target.value })}
                  />
                  <Field label="EMAIL ADDRESS" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} type="email" />
                  <Field label="EMAIL FOR PAYSLIP" value={profile.emailPayslip} onChange={(e) => setProfile({ ...profile, emailPayslip: e.target.value })} type="email" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <AlertCircle className="w-5 h-5" />
                  EMERGENCY CONTACT
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="EMERGENCY CONTACT NAME" value={profile.emergencyName} onChange={(e) => setProfile({ ...profile, emergencyName: e.target.value.toUpperCase() })} />
                  <Field label="RELATIONSHIP" value={profile.emergencyRelationship} onChange={(e) => setProfile({ ...profile, emergencyRelationship: e.target.value.toUpperCase() })} />
                  <PhoneField 
                    label="EMERGENCY TELEPHONE" 
                    codeValue={profile.emergencyCountryCode} 
                    numberValue={profile.emergencyNumber}
                    onCodeChange={(e) => setProfile({ ...profile, emergencyCountryCode: e.target.value })}
                    onNumberChange={(e) => setProfile({ ...profile, emergencyNumber: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* FINANCIAL Section */}
        {activeTab === 'financial' && (
          <Section id="financial" icon={DollarSign} title="FINANCIAL & TAX" subtitle="Banking, tax, NI, company details">
            <div className="space-y-6 bg-white p-6 rounded-2xl">
              <div>
                <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  TAX & NATIONAL INSURANCE
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="NATIONAL INSURANCE NUMBER" value={profile.nationalInsuranceNumber} onChange={(e) => setProfile({ ...profile, nationalInsuranceNumber: e.target.value.toUpperCase() })} />
                  <Field label="VAT NUMBER" value={profile.vatNumber} onChange={(e) => setProfile({ ...profile, vatNumber: e.target.value })} />
                  <Field label="STUDENT LOAN" value={profile.studentLoan} onChange={(e) => setProfile({ ...profile, studentLoan: e.target.value })} options={['no', 'Plan 1', 'Plan 2', 'Plan 4']} />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  PERSONAL BANK DETAILS
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="BANK NAME" value={profile.personalBankName} onChange={(e) => setProfile({ ...profile, personalBankName: e.target.value.toUpperCase() })} />
                  <Field label="BANK BRANCH" value={profile.personalBankBranch} onChange={(e) => setProfile({ ...profile, personalBankBranch: e.target.value.toUpperCase() })} />
                  <Field label="ACCOUNT NAME" value={profile.personalBankAccountName} onChange={(e) => setProfile({ ...profile, personalBankAccountName: e.target.value.toUpperCase() })} cols={2} />
                  <Field label="SORT CODE" value={profile.personalBankSortCode} onChange={(e) => setProfile({ ...profile, personalBankSortCode: e.target.value })} />
                  <Field label="ACCOUNT NUMBER" value={profile.personalBankAccountNumber} onChange={(e) => setProfile({ ...profile, personalBankAccountNumber: e.target.value })} />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <Toggle 
                  label="USE LOAN-OUT COMPANY" 
                  checked={useLoanOutCompany} 
                  onChange={(e) => setUseLoanOutCompany(e.target.checked)} 
                />
              </div>

              {useLoanOutCompany && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    LOAN-OUT COMPANY
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="COMPANY NAME" value={profile.companyName} onChange={(e) => setProfile({ ...profile, companyName: e.target.value.toUpperCase() })} />
                    <Field label="REGISTRATION NUMBER" value={profile.companyRegistrationNumber} onChange={(e) => setProfile({ ...profile, companyRegistrationNumber: e.target.value })} />
                    <Field label="COMPANY ADDRESS" value={profile.companyAddressLine1} onChange={(e) => setProfile({ ...profile, companyAddressLine1: e.target.value.toUpperCase() })} cols={2} />
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ALLOWANCES Section */}
        {activeTab === 'allowances' && (
          <Section id="allowances" icon={Car} title="ALLOWANCES & EXPENSES" subtitle="Vehicle, computer, equipment">
            <div className="space-y-6 bg-white p-6 rounded-2xl">
              <Toggle 
                label="I USE MY OWN VEHICLE" 
                checked={useOwnVehicle} 
                onChange={(e) => setUseOwnVehicle(e.target.checked)} 
              />

              {useOwnVehicle && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    PERSONAL VEHICLE
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="VEHICLE MAKE" value={profile.vehicleMake} onChange={(e) => setProfile({ ...profile, vehicleMake: e.target.value.toUpperCase() })} />
                    <Field label="VEHICLE MODEL" value={profile.vehicleModel} onChange={(e) => setProfile({ ...profile, vehicleModel: e.target.value.toUpperCase() })} />
                    <Field label="VEHICLE COLOUR" value={profile.vehicleColour} onChange={(e) => setProfile({ ...profile, vehicleColour: e.target.value.toUpperCase() })} />
                    <Field label="VEHICLE REGISTRATION" value={profile.vehicleRegistration} onChange={(e) => setProfile({ ...profile, vehicleRegistration: e.target.value.toUpperCase() })} />
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  💻 COMPUTER
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="COMPUTER DESCRIPTION" value={profile.computerDescription} onChange={(e) => setProfile({ ...profile, computerDescription: e.target.value.toUpperCase() })} />
                  <Field label="INSURANCE VALUE (£)" value={profile.computerInsuranceValue} onChange={(e) => setProfile({ ...profile, computerInsuranceValue: e.target.value })} />
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* HEALTH Section */}
        {activeTab === 'health' && (
          <Section id="health" icon={Heart} title="HEALTH & DIETARY" subtitle="Dietary requirements and allergies">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="DIETARY REQUIREMENTS" value={profile.dietaryRequirements} onChange={(e) => setProfile({ ...profile, dietaryRequirements: e.target.value.toUpperCase() })} type="textarea" placeholder="E.G. VEGETARIAN, VEGAN" />
              <Field label="ALLERGIES" value={profile.allergies} onChange={(e) => setProfile({ ...profile, allergies: e.target.value.toUpperCase() })} type="textarea" placeholder="E.G. PEANUTS, SHELLFISH" />
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}




