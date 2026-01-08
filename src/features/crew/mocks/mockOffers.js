// src/crew/mocks/mockOffers.js

/**
 * Mock offer data for development and testing
 * Each offer represents different statuses in the workflow
 */

export const BASE_OFFER_TEMPLATE = {
  id: 1,
  fullName: "John Smith",
  email: "john.smith@example.com",
  mobileNumber: "+44 7700 900000",
  productionName: "The Great Adventure",
  productionType: "Feature Film",
  estimatedShootDates: "March 2026 - June 2026",
  shootDuration: 90,
  studioCompany: "Big Studio Productions",
  holidayPayPercentage: 12.07,
  companyName: "Big Studio Ltd",
  productionAddress: "123 Studio Way, London, UK",
  projectPhone: "+44 20 1234 5678",
  projectEmail: "production@example.com",
  additionalNotes: "Please review carefully and let us know if you have any questions.",
  isViaAgent: false,
  allowSelfEmployedOrLoanOut: true,
  updatedAt: new Date().toISOString(),
  createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  roles: [{
    unit: "Main Unit",
    department: "Camera",
    subDepartment: "Main Unit",
    jobTitle: "Director of Photography",
    regularSiteOfWork: "Pinewood Studios",
    startDate: "2026-02-01",
    endDate: "2026-04-30",
    engagementType: "LOAN_OUT",
    confirmedEmploymentType: "LOAN_OUT",
    dailyOrWeeklyEngagement: "WEEKLY",
    workingWeek: "5 DAY",
    workingInUnitedKingdom: "YES",
    shiftHours: "10",
    productionPhase: "SHOOT",
    currency: "GBP",
    rateType: "WEEKLY",
    rateAmount: 2500,
    contractRate: 2500,
    rateDescription: "Standard weekly rate for 5-day working week",
    overtimeType: "CUSTOM",
    customOvertimeRates: {
      minimumHours6thDay: "8",
      sixthDayHourlyRate: 350,
      minimumHours7thDay: "8",
      seventhDayHourlyRate: 400,
      nonShootOvertimeRate: 250,
      shootOvertimeRate: 300
    },
    allowances: {
      computerAllowance: true,
      computerAllowanceFeePerWeek: 150,
      computerAllowanceCap: 1500,
      computerAllowanceTerms: "Maximum 10 weeks",
      computerAllowancePayableInShoot: true,
      boxRental: true,
      boxRentalFeePerWeek: 200,
      boxRentalCap: 2000,
      boxRentalTerms: "Equipment list to be provided",
      boxRentalPayableInPrep: true,
      boxRentalPayableInShoot: true,
      mobilePhoneAllowance: true,
      mobilePhoneAllowanceFeePerWeek: 50,
      mobilePhoneAllowanceTerms: "UK calls only",
      mobilePhoneAllowancePayableInShoot: true
    }
  }]
};

// Multiple offers with different statuses for the list view
export const MOCK_OFFERS_LIST = [
  {
    ...BASE_OFFER_TEMPLATE,
    id: 1,
    status: "SENT_TO_CREW",
    fullName: "John Smith",
    productionName: "The Great Adventure",
    sentToCrewAt: "2026-01-06T10:00:00Z",
    updatedAt: "2026-01-06T10:00:00Z",
    roles: [{
      ...BASE_OFFER_TEMPLATE.roles[0],
      jobTitle: "Director of Photography",
      department: "Camera",
      contractRate: 2500,
    }]
  },
  {
    ...BASE_OFFER_TEMPLATE,
    id: 2,
    status: "SENT_TO_CREW",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    productionName: "Mystery Project",
    sentToCrewAt: "2026-01-05T09:00:00Z",
    updatedAt: "2026-01-05T09:00:00Z",
    roles: [{
      ...BASE_OFFER_TEMPLATE.roles[0],
      jobTitle: "Camera Operator",
      department: "Camera",
      subDepartment: "B Unit",
      contractRate: 2000,
      rateAmount: 2000,
    }]
  },
  {
    ...BASE_OFFER_TEMPLATE,
    id: 3,
    status: "PENDING_CREW_SIGNATURE",
    fullName: "Mike Davis",
    email: "mike.davis@example.com",
    mobileNumber: "+44 7700 900004",
    productionName: "Action Hero 2",
    productionType: "Feature Film",
    estimatedShootDates: "February 2026 - May 2026",
    shootDuration: 90,
    studioCompany: "Action Studios",
    sentToCrewAt: "2025-12-20T10:00:00Z",
    crewAcceptedAt: "2025-12-28T14:30:00Z",
    productionCheckCompletedAt: "2026-01-02T11:00:00Z",
    accountsCheckCompletedAt: "2026-01-05T16:00:00Z",
    updatedAt: "2026-01-05T16:00:00Z",
    confirmedEmploymentType: "LOAN_OUT",
    roles: [{
      ...BASE_OFFER_TEMPLATE.roles[0],
      jobTitle: "Gaffer",
      department: "Lighting",
      contractRate: 2800,
      rateAmount: 2800,
      startDate: "2026-02-15",
      endDate: "2026-05-15",
      allowances: {
        boxRental: true,
        boxRentalFeePerWeek: 200,
        boxRentalPayableInShoot: true,
      }
    }]
  },
  {
    ...BASE_OFFER_TEMPLATE,
    id: 4,
    status: "CREW_ACCEPTED",
    fullName: "Emma Wilson",
    email: "emma.wilson@example.com",
    productionName: "Drama Series S3",
    sentToCrewAt: "2025-12-15T10:00:00Z",
    crewAcceptedAt: "2025-12-22T14:30:00Z",
    updatedAt: "2025-12-22T14:30:00Z",
    roles: [{
      ...BASE_OFFER_TEMPLATE.roles[0],
      jobTitle: "Sound Mixer",
      department: "Sound",
      contractRate: 2200,
      rateAmount: 2200,
    }]
  },
  {
    ...BASE_OFFER_TEMPLATE,
    id: 5,
    status: "COMPLETED",
    fullName: "David Brown",
    email: "david.brown@example.com",
    mobileNumber: "+44 7700 900011",
    productionName: "Historical Epic",
    productionType: "Feature Film",
    estimatedShootDates: "January 2026 - April 2026",
    shootDuration: 100,
    studioCompany: "Epic Productions",
    companyName: "Epic Productions Ltd",
    productionAddress: "123 Studio Way, London",
    sentToCrewAt: "2025-12-10T09:00:00Z",
    crewAcceptedAt: "2025-12-20T10:00:00Z",
    productionCheckCompletedAt: "2025-12-27T15:00:00Z",
    accountsCheckCompletedAt: "2026-01-02T14:00:00Z",
    crewSignedAt: "2026-01-03T10:00:00Z",
    crewSignature: "David Brown",
    upmSignedAt: "2026-01-04T11:00:00Z",
    upmSignature: "Jane Smith",
    fcSignedAt: "2026-01-05T14:00:00Z",
    fcSignature: "Robert Johnson",
    studioSignedAt: "2026-01-06T09:00:00Z",
    studioSignature: "Sarah Williams",
    completedAt: "2026-01-06T09:00:00Z",
    updatedAt: "2026-01-06T09:00:00Z",
    confirmedEmploymentType: "LOAN_OUT",
    roles: [{
      ...BASE_OFFER_TEMPLATE.roles[0],
      jobTitle: "Key Grip",
      department: "Grip",
      contractRate: 2600,
      rateAmount: 2600,
      startDate: "2026-01-15",
      endDate: "2026-04-15",
      allowances: {
        computerAllowance: true,
        computerAllowanceFeePerWeek: 150,
        computerAllowancePayableInShoot: true,
      }
    }]
  },
  {
    ...BASE_OFFER_TEMPLATE,
    id: 6,
    status: "COMPLETED",
    fullName: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    productionName: "Sci-Fi Adventure",
    sentToCrewAt: "2025-11-20T09:00:00Z",
    crewAcceptedAt: "2025-11-28T10:00:00Z",
    productionCheckCompletedAt: "2025-12-05T15:00:00Z",
    accountsCheckCompletedAt: "2025-12-10T14:00:00Z",
    crewSignedAt: "2025-12-12T10:00:00Z",
    crewSignature: "Lisa Anderson",
    upmSignedAt: "2025-12-13T11:00:00Z",
    upmSignature: "Michael Brown",
    fcSignedAt: "2025-12-14T14:00:00Z",
    fcSignature: "Patricia Davis",
    studioSignedAt: "2025-12-15T09:00:00Z",
    studioSignature: "Christopher Wilson",
    completedAt: "2025-12-15T09:00:00Z",
    updatedAt: "2025-12-15T09:00:00Z",
    confirmedEmploymentType: "LOAN_OUT",
    roles: [{
      ...BASE_OFFER_TEMPLATE.roles[0],
      jobTitle: "VFX Supervisor",
      department: "VFX",
      contractRate: 3500,
      rateAmount: 3500,
    }]
  },
];

/**
 * Get a single offer by ID (for ViewOffer page)
 */
export const getMockOfferById = (id) => {
  const offer = MOCK_OFFERS_LIST.find(o => o.id === parseInt(id));
  return offer || MOCK_OFFERS_LIST[0];
};

/**
 * Get all offers (for MyOffer list page)
 */
export const getMockOffers = () => {
  return MOCK_OFFERS_LIST;
};

/**
 * Filter offers by status
 */
export const getOffersByStatus = (statusArray) => {
  return MOCK_OFFERS_LIST.filter(o => statusArray.includes(o.status));
};

/**
 * Create a lookup object by ID for backward compatibility
 */
export const MOCK_OFFERS = MOCK_OFFERS_LIST.reduce((acc, offer) => {
  acc[offer.id] = offer;
  return acc;
}, {});