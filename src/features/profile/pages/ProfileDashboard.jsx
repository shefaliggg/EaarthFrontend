import React, { useState } from "react";
import ProfileSummary from "../components/ProfileSummary";
import ProfileTabs from "../components/ProfileTabs";
import IdentityDetails from "../components/tabs/IdentityDetails";
import ContactDetails from "../components/tabs/ContactDetails";
import FinanceDetails from "../components/tabs/FinancialDetails";
import AllowanceDetails from "../components/tabs/AllowancesDetails";
import HealthDetails from "../components/tabs/HealthDetails";
import MySignature from "../components/tabs/MySignature";

export default function ProfileDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");

  // Shared file upload state
  const [uploads, setUploads] = useState({
    passport: false,
    birthCertificate: false,
    niProof: false,
    certificateNaturalisation: false,
    visa: false,
    aadharFront: false,
    aadharBack: false,
    panCard: false,
  });

  // Full profile stored here
  const [profile, setProfile] = useState({
    // Identity
    title: "MR",
    firstName: "SUNNY",
    lastName: "SURESH",
    middleNames: "",
    alsoKnownAs: "SUNNEY SURESH!",
    screenCreditName: "SUNNEY SURESH!",
    pronouns: "HE / HIM / HIS",
    sex: "MALE",
    dateOfBirth: "1988-05-04",
    countryOfPermanentResidence: "UNITED KINGDOM",
    countryOfLegalNationality: "UNITED KINGDOM",

    // Proof of Nationality
    proofOfNationality: "PASSPORT",
    passportFirstName: "SUNNY",
    passportLastName: "SURESH",
    passportPlaceOfBirth: "VITHON KACHCHH",
    passportNumber: "527804794",
    passportExpiryDate: "2030-04-30",
    passportIssuingCountry: "UNITED KINGDOM",

    // Contact - Address
    addressLine1: "LITTLE MEAD HOUSE",
    addressLine2: "LEIGHTON ROAD, OPP CHOAKES YARD, GREAT BILLINGTON,",
    addressLine3: "LEIGHTON BUZZARD, BEDFORDSHIRE",
    postcode: "LU7 9BJ",
    country: "UNITED KINGDOM",

    // Contact - Phone & Email
    mobileCountryCode: "+44",
    mobileNumber: "7377 005 116",
    otherCountryCode: "+44",
    otherNumber: "7498 510238",
    email: "ssunny.surani@icloud.com",
    emailPayslip: "ssunny.surani@icloud.com",
    emailPension: "ssunny.surani@icloud.com",

    // Emergency Contact
    emergencyName: "DIKSHA SURANI",
    emergencyRelationship: "WIFE",
    emergencyCountryCode: "+44",
    emergencyNumber: "7499510238",

    // Finance - Tax
    nationalInsuranceNumber: "",
    vatNumber: "",
    studentLoan: "no",

    // Finance - Bank
    personalBankName: "HSBC",
    personalBankBranch: "LONDON",
    personalBankAccountName: "SUNNY SURANI",
    personalBankSortCode: "40-02-40",
    personalBankAccountNumber: "01517988",

    // Finance - Loan-Out Company
    companyName: "",
    companyRegistrationNumber: "",
    companyAddressLine1: "",

    // Allowances
    vehicleMake: "",
    vehicleModel: "",
    vehicleColour: "",
    vehicleRegistration: "",
    computerDescription: "MAC BOOK PRO",
    computerInsuranceValue: "",

    // Health
    dietaryRequirements: "",
    allergies: "",
    
    // Signature
    signature: null,
  });

  // Save button action
  const handleSave = () => {
    console.log("Saving data...", profile, uploads);
    alert("Profile saved successfully!");
    setIsEditing(false);
  };

  // Cancel button action
  const handleCancel = () => {
    console.log("Cancelled changes");
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto space-y-6">
      {/* HEADER + SUMMARY */}
      <ProfileSummary
        profile={profile}
        isDarkMode={isDarkMode}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />

      {/* TABS */}
      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
      />

      {/* TAB CONTENTS */}
      {activeTab === "identity" && (
        <IdentityDetails
          profile={profile}
          setProfile={setProfile}
          isEditing={isEditing}
          isDarkMode={isDarkMode}
          uploads={uploads}
          setUploads={setUploads}
        />
      )}

      {activeTab === "contact" && (
        <ContactDetails
          profile={profile}
          setProfile={setProfile}
          isEditing={isEditing}
          isDarkMode={isDarkMode}
        />
      )}

      {activeTab === "financial" && (
        <FinanceDetails
          profile={profile}
          setProfile={setProfile}
          isEditing={isEditing}
          isDarkMode={isDarkMode}
        />
      )}

      {activeTab === "allowances" && (
        <AllowanceDetails
          profile={profile}
          setProfile={setProfile}
          isEditing={isEditing}
          isDarkMode={isDarkMode}
        />
      )}

      {activeTab === "health" && (
        <HealthDetails
          profile={profile}
          setProfile={setProfile}
          isEditing={isEditing}
          isDarkMode={isDarkMode}
        />
      )}

      {activeTab === "signature" && (
        <MySignature
          profile={profile}
          setProfile={setProfile}
          isEditing={isEditing}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
