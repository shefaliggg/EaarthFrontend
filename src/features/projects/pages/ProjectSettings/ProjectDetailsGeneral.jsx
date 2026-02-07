import { useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableRadioField from "@/shared/components/wrappers/EditableRadioField";
import { Button } from "@/shared/components/ui/button";
import { HelpCircle, Edit, Save, X, Info, Plus, Minus, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

// Button Toggle Component
const ButtonToggleGroup = ({ label, options, selected, onChange, showInfo = false }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {showInfo && <Info className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
              selected === option.value
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Number Input with Plus/Minus Buttons
const NumberInputWithControls = ({ label, value, onChange, showInfo = false }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {showInfo && <Info className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="flex items-center gap-2 max-w-xs">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-purple-300 text-purple-600 hover:bg-purple-50 transition-all"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="h-9 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center flex-1"
        />
        <button
          onClick={() => onChange(value + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-purple-300 text-purple-600 hover:bg-purple-50 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Yes/No Toggle Button Group
const YesNoToggle = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between py-1.5">
      <label className="text-sm text-gray-700">{label}</label>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(true)}
          className={`px-5 py-1 rounded-md text-sm font-medium transition-all ${
            value === true
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-300'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onChange(false)}
          className={`px-5 py-1 rounded-md text-sm font-medium transition-all ${
            value === false
              ? 'bg-gray-100 text-gray-700 border border-gray-300'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-300'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default function ProjectDetailsGeneral() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Project Detail states
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("feature-film");
  const [showProjectTypeInOffers, setShowProjectTypeInOffers] = useState(true);
  const [legalTerritory, setLegalTerritory] = useState("united-kingdom");
  const [unionAgreement, setUnionAgreement] = useState("pact-bectu-2021");
  const [constructionUnionAgreement, setConstructionUnionAgreement] = useState("none");
  const [budgetLevel, setBudgetLevel] = useState("major");
  const [showBudgetToCrew, setShowBudgetToCrew] = useState(false);
  const [genre, setGenre] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [producer, setProducer] = useState("");
  const [director, setDirector] = useState("");
  const [productionManager, setProductionManager] = useState("");
  const [basicCurrency, setBasicCurrency] = useState('USD ($)');
  const [workingWeek, setWorkingWeek] = useState('Standard');
  const [showPrepWrapMins, setShowPrepWrapMins] = useState(false);
  const [breakfastPenalty, setBreakfastPenalty] = useState('5.00');
  const [lunchPenalty, setLunchPenalty] = useState('5.00');
  const [dinnerPenalty, setDinnerPenalty] = useState('10.00');
  const [sixthDayFeeMultiplier, setSixthDayFeeMultiplier] = useState('1.5');
  const [seventhDayFeeMultiplier, setSeventhDayFeeMultiplier] = useState('2.0');
  const [shareMinimumHours, setShareMinimumHours] = useState(true);

  // ProjectGeneral states
  const [formData, setFormData] = useState({
    // Allowances
    allowances: {
      box: false,
      computer: false,
      software: false,
      equipment: false,
      mobile: false,
      carAllowance: false,
      cycleHire: false,
      perDiem: false,
      living: false,
    },
    
    // Mobile allowance settings
    mobileRequireBill: false,
    mobileBillItems: '',
    
    // Car allowance settings
    carRequireInsurance: true,
    carRequireLicense: true,
    
    // Per diem settings
    perDiemCurrency: 'GBP',
    perDiemShootRate: '25.00',
    perDiemNonShootRate: '40.00',
    
    // Overtime
    customOvertimeRates: {
      other: '',
      cameraStandardDay: '',
      cameraContinuousDay: '',
      cameraSemiContinuousDay: '',
    },
    
    // Holiday Pay
    holidayPayPercentage: '12.07%',
    differentHolidayForDailies: false,
    withholdHolidayPay6th7th: false,
    withholdHolidayPayOvertime: false,
    
    // Weekly Rate Display
    showWeeklyRateInOfferView: true,
    showWeeklyRateInDocuments: true,
    
    // Working Hours
    defaultWorkingHours: '11 hours',
    
    // Offer Settings
    offerEndDate: 'Optional',
    
    // Overall dates
    prepStart: '',
    prepEnd: '',
    shootStart: '2025-09-29',
    shootEnd: '2025-02-11',
    shootDurationDays: 74,
    
    // Post Production
    postProductionStart: '',
    postProductionEnd: '',
    
    // Production base
    productionBase: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      postcode: '',
      country: 'United Kingdom',
      telephone: '',
      email: '',
    },
    
    // Company
    companies: [
      {
        id: 1,
        title: '',
        name: '',
        registrationNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postcode: '',
        country: 'United Kingdom',
      }
    ],
  });

  const [hiatuses, setHiatuses] = useState([
    { id: 1, start: '', end: '' }
  ]);

  // Options
  const projectTypeOptions = [
    { label: "Feature Film", value: "feature-film" },
    { label: "Television", value: "television" }
  ];

  const legalTerritoryOptions = [
    { label: "United Kingdom", value: "united-kingdom" },
    { label: "Iceland", value: "iceland" },
    { label: "Ireland", value: "ireland" },
    { label: "Malta", value: "malta" }
  ];

  const unionAgreementOptions = [
    { label: "None", value: "none" },
    { label: "PACT/BECTU Agreement (2021)", value: "pact-bectu-2021" }
  ];

  const constructionUnionAgreementOptions = [
    { label: "None", value: "none" },
    { label: "PACT/BECTU Agreement", value: "pact-bectu" },
    { label: "Custom Agreement", value: "custom" }
  ];

  const budgetLevelOptions = [
    { label: "Major (over £30 million)", value: "major" },
    { label: "Medium (£15-30 million)", value: "medium" },
    { label: "Low (under £15 million)", value: "low" },
    { label: "Micro (under £2 million)", value: "micro" }
  ];

  const currencyOptions = [
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "GBP", value: "GBP" },
    { label: "CAD", value: "CAD" },
    { label: "AUD", value: "AUD" }
  ];

  const basicCurrencyOptions = [
    { value: 'USD ($)', label: 'USD ($)' },
    { value: 'GBP (£)', label: 'GBP (£)' },
    { value: 'EUR (€)', label: 'EUR (€)' },
  ];

  const workingWeekOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: '6 Day', label: '6 Day' },
    { value: 'Continuous', label: 'Continuous' },
  ];

  const multiplierOptions = [
    { value: '1.0', label: '1.0' },
    { value: '1.5', label: '1.5' },
    { value: '2.0', label: '2.0' },
    { value: '2.5', label: '2.5' },
  ];

  const holidayPayOptions = [
    { value: '0%', label: '0%' },
    { value: '10.77%', label: '10.77%' },
    { value: '12.07%', label: '12.07%' }
  ];

  const offerEndDateOptions = [
    { value: 'Optional', label: 'Optional' },
    { value: 'Mandatory', label: 'Mandatory' }
  ];

  const workingHoursOptions = [
    { value: '8 hours', label: '8 hours' },
    { value: '9 hours', label: '9 hours' },
    { value: '10 hours', label: '10 hours' },
    { value: '11 hours', label: '11 hours' },
    { value: '12 hours', label: '12 hours' },
  ];

  const countryOptions = [
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'United States', label: 'United States' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' },
    { value: 'Spain', label: 'Spain' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Ireland', label: 'Ireland' },
    { value: 'New Zealand', label: 'New Zealand' },
    { value: 'Other', label: 'Other' },
  ];

  // Helper functions
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const addHiatus = () => {
    setHiatuses([...hiatuses, { id: Date.now(), start: '', end: '' }]);
  };

  const removeHiatus = (id) => {
    if (hiatuses.length > 1) {
      setHiatuses(hiatuses.filter(h => h.id !== id));
    }
  };

  const addCompany = () => {
    setFormData(prev => ({
      ...prev,
      companies: [
        ...prev.companies,
        {
          id: Date.now(),
          title: '',
          name: '',
          registrationNumber: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          postcode: '',
          country: 'United Kingdom',
        }
      ]
    }));
  };

  const removeCompany = (id) => {
    if (formData.companies.length > 1) {
      setFormData(prev => ({
        ...prev,
        companies: prev.companies.filter(c => c.id !== id)
      }));
    }
  };

  const handleSave = () => {
    console.log("Saving project details...");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Title with Edit/Save/Cancel Buttons */}
      <div className="flex items-center justify-between bg-background border rounded-lg p-4 shadow-sm">
        <h2 className="text-base font-semibold">Project Details</h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="default"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="default"
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Unified 3:6:3 Grid Layout for All Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN (3/12) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Key Personnel Section */}
          <CardWrapper
            title="Key Personnel"
            icon="Users"
          >
            <div className="space-y-2">
              <EditableTextDataField
                label="Producer"
                value={producer}
                onChange={setProducer}
                isEditing={isEditing}
                icon="User"
                placeholder="Enter producer name"
              />
              
              <EditableTextDataField
                label="Director"
                value={director}
                onChange={setDirector}
                isEditing={isEditing}
                icon="Video"
                placeholder="Enter director name"
              />
              
              <EditableTextDataField
                label="Production Manager"
                value={productionManager}
                onChange={setProductionManager}
                isEditing={isEditing}
                icon="Briefcase"
                placeholder="Enter production manager"
              />
            </div>
          </CardWrapper>

          {/* Basic Section */}
          <CardWrapper
            title="Basic"
            variant="default"
            showLabel={true}
          >
            <div className="space-y-2">
              <EditableSelectField
                label="Currency"
                value={basicCurrency}
                items={basicCurrencyOptions}
                onChange={setBasicCurrency}
                isEditing={isEditing}
              />
              
              <EditableSelectField
                label="Working week"
                value={workingWeek}
                items={workingWeekOptions}
                onChange={setWorkingWeek}
                isEditing={isEditing}
              />

              <EditableCheckboxField
                label="Show prep/wrap mins in Offer View?"
                checked={showPrepWrapMins}
                onChange={setShowPrepWrapMins}
                isEditing={isEditing}
              />
            </div>
          </CardWrapper>

          {/* Overall dates */}
          <CardWrapper 
            title="Overall dates" 
            variant="default"
            showLabel={true}
          >
            <div className="space-y-2">
              <EditableTextDataField
                label="Prep start"
                value={formData.prepStart}
                onChange={(val) => updateField('prepStart', val)}
                isEditing={true}
                placeholder="dd-mm-yyyy"
              />
              <EditableTextDataField
                label="Prep end"
                value={formData.prepEnd}
                onChange={(val) => updateField('prepEnd', val)}
                isEditing={true}
                placeholder="dd-mm-yyyy"
              />
              <NumberInputWithControls
                label="Shoot duration days"
                value={formData.shootDurationDays}
                onChange={(val) => updateField('shootDurationDays', val)}
                showInfo={true}
              />
              <EditableTextDataField
                label="Shoot start"
                value={formData.shootStart}
                onChange={(val) => updateField('shootStart', val)}
                isEditing={true}
                placeholder="29-09-2025"
              />
              <EditableTextDataField
                label="Shoot end"
                value={formData.shootEnd}
                onChange={(val) => updateField('shootEnd', val)}
                isEditing={true}
                placeholder="11-02-2025"
              />
            </div>
          </CardWrapper>

          {/* Hiatus Dates */}
          <CardWrapper 
            title="Hiatus Dates" 
            variant="default"
            showLabel={true}
            actions={
              <button
                onClick={addHiatus}
                className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
              >
                <Plus className="w-3 h-3" />
                Add hiatus
              </button>
            }
          >
            <div className="space-y-3">
              {hiatuses.map((hiatus, index) => (
                <div key={hiatus.id} className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Hiatus {index + 1} start</label>
                    <input
                      type="date"
                      value={hiatus.start}
                      onChange={(e) => {
                        const newHiatuses = [...hiatuses];
                        newHiatuses[index].start = e.target.value;
                        setHiatuses(newHiatuses);
                      }}
                      className="w-full h-9 px-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Hiatus {index + 1} end</label>
                    <input
                      type="date"
                      value={hiatus.end}
                      onChange={(e) => {
                        const newHiatuses = [...hiatuses];
                        newHiatuses[index].end = e.target.value;
                        setHiatuses(newHiatuses);
                      }}
                      className="w-full h-9 px-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  {hiatuses.length > 1 && (
                    <button
                      onClick={() => removeHiatus(hiatus.id)}
                      className="h-9 w-9 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardWrapper>

          {/* Post Production Dates */}
          <CardWrapper 
            title="Post Production Dates" 
            variant="default"
            showLabel={true}
          >
            <div className="space-y-2">
              <EditableTextDataField
                label="Post production start"
                value={formData.postProductionStart}
                onChange={(val) => updateField('postProductionStart', val)}
                isEditing={true}
                placeholder="dd-mm-yyyy"
              />
              <EditableTextDataField
                label="Post production end"
                value={formData.postProductionEnd}
                onChange={(val) => updateField('postProductionEnd', val)}
                isEditing={true}
                placeholder="dd-mm-yyyy"
              />
            </div>
          </CardWrapper>

          {/* Overtime */}
          <CardWrapper 
            title="Overtime" 
            variant="default"
            showLabel={true}
          >
            <div className="grid grid-cols-1 gap-4">
              <EditableTextDataField
                label="Other"
                value={formData.customOvertimeRates.other}
                onChange={(val) => updateNestedField('customOvertimeRates', 'other', val)}
                isEditing={true}
                placeholder=""
              />
              <EditableTextDataField
                label="Camera - standard day"
                value={formData.customOvertimeRates.cameraStandardDay}
                onChange={(val) => updateNestedField('customOvertimeRates', 'cameraStandardDay', val)}
                isEditing={true}
                placeholder=""
              />
              <EditableTextDataField
                label="Camera - Continuous day"
                value={formData.customOvertimeRates.cameraContinuousDay}
                onChange={(val) => updateNestedField('customOvertimeRates', 'cameraContinuousDay', val)}
                isEditing={true}
                placeholder=""
              />
              <EditableTextDataField
                label="Camera - semi-continuous day"
                value={formData.customOvertimeRates.cameraSemiContinuousDay}
                onChange={(val) => updateNestedField('customOvertimeRates', 'cameraSemiContinuousDay', val)}
                isEditing={true}
                placeholder=""
              />
            </div>
          </CardWrapper>
        </div>

        {/* CENTER COLUMN (6/12) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Basic Information Section */}
          <CardWrapper
            title="Basic Information"
            icon="Info"
          >
            <div className="space-y-2">
              {/* Row 1: Project Name, Genre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <EditableTextDataField
                  label="Project Name"
                  value={projectName}
                  onChange={setProjectName}
                  isEditing={isEditing}
                  icon="Film"
                  placeholder="Enter project name"
                />

                <EditableTextDataField
                  label="Genre"
                  value={genre}
                  onChange={setGenre}
                  isEditing={isEditing}
                  icon="Tag"
                  placeholder="e.g., Drama, Action"
                />
              </div>

              {/* Row 2: Start Date, End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    <span>Start Date</span>
                  </div>
                  {!isEditing ? (
                    <div className="text-sm font-medium text-foreground h-8 flex items-center">
                      {startDate || <span className="text-muted-foreground">Not Available</span>}
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    <span>End Date</span>
                  </div>
                  {!isEditing ? (
                    <div className="text-sm font-medium text-foreground h-8 flex items-center">
                      {endDate || <span className="text-muted-foreground">Not Available</span>}
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background"
                    />
                  )}
                </div>
              </div>

              {/* Row 3: Primary Location - Full Width */}
              <EditableTextDataField
                label="Primary Location"
                value={location}
                onChange={setLocation}
                isEditing={isEditing}
                icon="MapPin"
                placeholder="City, Country"
              />

              {/* Row 4: Description - Full Width */}
              <EditableTextDataField
                label="Project Description"
                value={description}
                onChange={setDescription}
                isEditing={isEditing}
                icon="FileText"
                placeholder="Enter project description..."
                multiline={true}
              />
            </div>
          </CardWrapper>

          {/* Project Configuration Section */}
          <CardWrapper
            title="Project Configuration"
            icon="Settings"
          >
            <div className="space-y-2">
              {/* Row 1: Project Type, Legal Territory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <EditableRadioField
                    label="Project Type"
                    value={projectType}
                    options={projectTypeOptions}
                    isEditing={isEditing}
                    onChange={setProjectType}
                    icon="Film"
                  />
                  {isEditing && (
                    <div className="mt-1">
                      <EditableCheckboxField
                        label="Show project type in offers?"
                        checked={showProjectTypeInOffers}
                        onChange={setShowProjectTypeInOffers}
                        isEditing={isEditing}
                      />
                    </div>
                  )}
                </div>

                <EditableRadioField
                  label="Legal Territory"
                  value={legalTerritory}
                  options={legalTerritoryOptions}
                  isEditing={isEditing}
                  onChange={setLegalTerritory}
                  icon="Globe"
                />
              </div>

              {/* Row 2: Union Agreement, Construction Union Agreement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    <span>Union Agreement</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Select the applicable union agreement</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <EditableRadioField
                    label=""
                    value={unionAgreement}
                    options={unionAgreementOptions}
                    isEditing={isEditing}
                    onChange={setUnionAgreement}
                  />
                </div>

                <EditableRadioField
                  label="Construction Union Agreement"
                  value={constructionUnionAgreement}
                  options={constructionUnionAgreementOptions}
                  isEditing={isEditing}
                  onChange={setConstructionUnionAgreement}
                  icon="HardHat"
                />
              </div>

              {/* Row 3: Budget Level, Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <EditableSelectField
                    label="Budget Level"
                    value={budgetLevel}
                    items={budgetLevelOptions}
                    isEditing={isEditing}
                    onChange={setBudgetLevel}
                    icon="DollarSign"
                  />
                  {isEditing && (
                    <div className="mt-1">
                      <EditableCheckboxField
                        label="Show budget level to crew members?"
                        checked={showBudgetToCrew}
                        onChange={setShowBudgetToCrew}
                        isEditing={isEditing}
                      />
                    </div>
                  )}
                </div>

                <EditableSelectField
                  label="Currency"
                  value={currency}
                  items={currencyOptions}
                  isEditing={isEditing}
                  onChange={setCurrency}
                  icon="DollarSign"
                />
              </div>
            </div>
          </CardWrapper>

          {/* Allowances */}
          <CardWrapper 
            title="Allowances" 
            variant="default"
            showLabel={true}
          >
            <div className="grid grid-cols-2 gap-x-8">
              {/* Left column */}
              <div className="space-y-0.5">
                <YesNoToggle
                  label="Box"
                  value={formData.allowances.box}
                  onChange={(val) => updateNestedField('allowances', 'box', val)}
                />
                <YesNoToggle
                  label="Computer"
                  value={formData.allowances.computer}
                  onChange={(val) => updateNestedField('allowances', 'computer', val)}
                />
                <YesNoToggle
                  label="Software"
                  value={formData.allowances.software}
                  onChange={(val) => updateNestedField('allowances', 'software', val)}
                />
                <YesNoToggle
                  label="Equipment"
                  value={formData.allowances.equipment}
                  onChange={(val) => updateNestedField('allowances', 'equipment', val)}
                />
                
                {/* Mobile with nested options */}
                <div>
                  <YesNoToggle
                    label="Mobile"
                    value={formData.allowances.mobile}
                    onChange={(val) => updateNestedField('allowances', 'mobile', val)}
                  />
                  {formData.allowances.mobile && (
                    <div className="ml-4 mt-2 pl-3 border-l-2 border-gray-200 space-y-2">
                      <EditableCheckboxField
                        label="Require mobile phone allowance bill?"
                        checked={formData.mobileRequireBill}
                        onChange={(val) => updateField('mobileRequireBill', val)}
                        isEditing={true}
                      />
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Mobile phone bill reimbursement default items</label>
                        <input
                          type="text"
                          value={formData.mobileBillItems}
                          onChange={(e) => updateField('mobileBillItems', e.target.value)}
                          className="w-full h-8 px-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Reimbursement of mobile phone bill"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-0.5">
                {/* Car allowance with nested options */}
                <div>
                  <YesNoToggle
                    label="Car allowance"
                    value={formData.allowances.carAllowance}
                    onChange={(val) => updateNestedField('allowances', 'carAllowance', val)}
                  />
                  {formData.allowances.carAllowance && (
                    <div className="ml-4 mt-2 pl-3 border-l-2 border-gray-200 space-y-1">
                      <EditableCheckboxField
                        label="Require copy of Business Insurance?"
                        checked={formData.carRequireInsurance}
                        onChange={(val) => updateField('carRequireInsurance', val)}
                        isEditing={true}
                      />
                      <EditableCheckboxField
                        label="Require copy of Driving License?"
                        checked={formData.carRequireLicense}
                        onChange={(val) => updateField('carRequireLicense', val)}
                        isEditing={true}
                      />
                    </div>
                  )}
                </div>

                <YesNoToggle
                  label="Cycle hire"
                  value={formData.allowances.cycleHire}
                  onChange={(val) => updateNestedField('allowances', 'cycleHire', val)}
                />

                {/* Per diem with nested options */}
                <div>
                  <YesNoToggle
                    label="Per diem"
                    value={formData.allowances.perDiem}
                    onChange={(val) => updateNestedField('allowances', 'perDiem', val)}
                  />
                  {formData.allowances.perDiem && (
                    <div className="ml-4 mt-2 pl-3 border-l-2 border-gray-200 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">Currency</label>
                          <select
                            value={formData.perDiemCurrency}
                            onChange={(e) => updateField('perDiemCurrency', e.target.value)}
                            className="w-full h-8 px-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="GBP">GBP</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">Shoot rate</label>
                          <input
                            type="number"
                            value={formData.perDiemShootRate}
                            onChange={(e) => updateField('perDiemShootRate', e.target.value)}
                            className="w-full h-8 px-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">Non-shoot rate</label>
                          <input
                            type="number"
                            value={formData.perDiemNonShootRate}
                            onChange={(e) => updateField('perDiemNonShootRate', e.target.value)}
                            className="w-full h-8 px-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <YesNoToggle
                  label="Living"
                  value={formData.allowances.living}
                  onChange={(val) => updateNestedField('allowances', 'living', val)}
                />
              </div>
            </div>
          </CardWrapper>

          {/* Production base */}
          <CardWrapper 
            title="Production base" 
            variant="default"
            showLabel={true}
          >
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Production base address <span className="text-gray-500 font-normal italic">(Optional)</span></div>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.productionBase.addressLine1}
                  onChange={(e) => updateNestedField('productionBase', 'addressLine1', e.target.value)}
                  className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Address line 1"
                />
                <input
                  type="text"
                  value={formData.productionBase.addressLine2}
                  onChange={(e) => updateNestedField('productionBase', 'addressLine2', e.target.value)}
                  className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Address line 2"
                />
                <input
                  type="text"
                  value={formData.productionBase.city}
                  onChange={(e) => updateNestedField('productionBase', 'city', e.target.value)}
                  className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="City"
                />
                <input
                  type="text"
                  value={formData.productionBase.postcode}
                  onChange={(e) => updateNestedField('productionBase', 'postcode', e.target.value)}
                  className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Postcode"
                />
              </div>
              <EditableSelectField
                label="Country"
                value={formData.productionBase.country}
                items={countryOptions}
                onChange={(val) => updateNestedField('productionBase', 'country', val)}
                isEditing={true}
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-700">Telephone number</label>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.productionBase.telephone}
                    onChange={(e) => updateNestedField('productionBase', 'telephone', e.target.value)}
                    className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. 020 3945 9013"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-700">Email address</label>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.productionBase.email}
                    onChange={(e) => updateNestedField('productionBase', 'email', e.target.value)}
                    className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. werewolfproduction@gmail.com"
                  />
                </div>
              </div>
            </div>
          </CardWrapper>

          {/* Company */}
          <CardWrapper 
            title="Company" 
            variant="default"
            showLabel={true}
            actions={
              <button
                onClick={addCompany}
                className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
              >
                <Plus className="w-3 h-3" />
                Add company
              </button>
            }
          >
            <div className="space-y-4">
              {formData.companies.map((company, index) => (
                <div key={company.id} className="p-3 border rounded-lg bg-slate-50/50 relative">
                  {formData.companies.length > 1 && (
                    <button
                      onClick={() => removeCompany(company.id)}
                      className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={company.title}
                        onChange={(e) => {
                          const newCompanies = [...formData.companies];
                          newCompanies[index].title = e.target.value;
                          setFormData({ ...formData, companies: newCompanies });
                        }}
                        className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Company title (e.g. Production Company)"
                      />
                      
                      <input
                        type="text"
                        value={company.name}
                        onChange={(e) => {
                          const newCompanies = [...formData.companies];
                          newCompanies[index].name = e.target.value;
                          setFormData({ ...formData, companies: newCompanies });
                        }}
                        className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Company name (e.g. Werewolf Productions Ltd)"
                      />
                    </div>

                    <input
                      type="text"
                      value={company.registrationNumber}
                      onChange={(e) => {
                        const newCompanies = [...formData.companies];
                        newCompanies[index].registrationNumber = e.target.value;
                        setFormData({ ...formData, companies: newCompanies });
                      }}
                      className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Registration number (e.g. 12345678)"
                    />

                    <div className="text-xs font-medium text-gray-700 mt-2">Company address</div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={company.addressLine1}
                        onChange={(e) => {
                          const newCompanies = [...formData.companies];
                          newCompanies[index].addressLine1 = e.target.value;
                          setFormData({ ...formData, companies: newCompanies });
                        }}
                        className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Address line 1"
                      />

                      <input
                        type="text"
                        value={company.addressLine2}
                        onChange={(e) => {
                          const newCompanies = [...formData.companies];
                          newCompanies[index].addressLine2 = e.target.value;
                          setFormData({ ...formData, companies: newCompanies });
                        }}
                        className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Address line 2"
                      />

                      <input
                        type="text"
                        value={company.city}
                        onChange={(e) => {
                          const newCompanies = [...formData.companies];
                          newCompanies[index].city = e.target.value;
                          setFormData({ ...formData, companies: newCompanies });
                        }}
                        className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="City"
                      />

                      <input
                        type="text"
                        value={company.postcode}
                        onChange={(e) => {
                          const newCompanies = [...formData.companies];
                          newCompanies[index].postcode = e.target.value;
                          setFormData({ ...formData, companies: newCompanies });
                        }}
                        className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Postcode"
                      />
                    </div>

                    <select
                      value={company.country}
                      onChange={(e) => {
                        const newCompanies = [...formData.companies];
                        newCompanies[index].country = e.target.value;
                        setFormData({ ...formData, companies: newCompanies });
                      }}
                      className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {countryOptions.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </CardWrapper>
        </div>

        {/* RIGHT COLUMN (3/12) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Holiday Pay */}
          <CardWrapper 
            title="Holiday Pay" 
            variant="default"
            showLabel={true}
          >
            <div className="space-y-3">
              <ButtonToggleGroup
                label="Holiday pay percentage"
                options={holidayPayOptions}
                selected={formData.holidayPayPercentage}
                onChange={(val) => updateField('holidayPayPercentage', val)}
              />

              <EditableCheckboxField
                label="Different holiday pay percentage for Dailies"
                checked={formData.differentHolidayForDailies}
                onChange={(val) => updateField('differentHolidayForDailies', val)}
                isEditing={true}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Withhold holiday pay on</label>
                <div className="space-y-1">
                  <EditableCheckboxField
                    label="6th and 7th days"
                    checked={formData.withholdHolidayPay6th7th}
                    onChange={(val) => updateField('withholdHolidayPay6th7th', val)}
                    isEditing={true}
                  />
                  <EditableCheckboxField
                    label="Overtime"
                    checked={formData.withholdHolidayPayOvertime}
                    onChange={(val) => updateField('withholdHolidayPayOvertime', val)}
                    isEditing={true}
                  />
                </div>
              </div>
            </div>
          </CardWrapper>

          {/* Meal penalties Section */}
          <CardWrapper
            title="Meal penalties"
            variant="default"
            showLabel={true}
          >
            <div className="space-y-2">
              <EditableTextDataField
                label="Breakfast penalty"
                value={breakfastPenalty}
                onChange={setBreakfastPenalty}
                isEditing={isEditing}
                placeholder="5.00"
              />
              <EditableTextDataField
                label="Lunch penalty"
                value={lunchPenalty}
                onChange={setLunchPenalty}
                isEditing={isEditing}
                placeholder="5.00"
              />
              <EditableTextDataField
                label="Dinner penalty"
                value={dinnerPenalty}
                onChange={setDinnerPenalty}
                isEditing={isEditing}
                placeholder="10.00"
              />
            </div>
          </CardWrapper>

          {/* 6th/7th days Section */}
          <CardWrapper
            title="6th/7th days"
            variant="default"
            showLabel={true}
          >
            <div className="space-y-2">
              <EditableSelectField
                label={
                  <div className="flex items-center gap-2">
                    <span>6th day fee multiplier</span>
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </div>
                }
                value={sixthDayFeeMultiplier}
                items={multiplierOptions}
                onChange={setSixthDayFeeMultiplier}
                isEditing={isEditing}
              />

              <EditableSelectField
                label={
                  <div className="flex items-center gap-2">
                    <span>7th day fee multiplier</span>
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </div>
                }
                value={seventhDayFeeMultiplier}
                items={multiplierOptions}
                onChange={setSeventhDayFeeMultiplier}
                isEditing={isEditing}
              />

              <EditableCheckboxField
                label="Share minimum hours on 6th and 7th days in offers?"
                checked={shareMinimumHours}
                onChange={setShareMinimumHours}
                isEditing={isEditing}
              />
            </div>
          </CardWrapper>

          {/* Working Hours */}
          <CardWrapper 
            title="Working Hours" 
            variant="default"
            showLabel={true}
          >
            <div className="space-y-1">
              <EditableSelectField
                label={
                  <div className="flex items-center gap-2">
                    <span>Default standard working hours</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                }
                value={formData.defaultWorkingHours}
                items={workingHoursOptions}
                onChange={(val) => updateField('defaultWorkingHours', val)}
                isEditing={true}
              />
              <p className="text-xs text-gray-500 mt-1">Excluding lunch.</p>
            </div>
          </CardWrapper>

          {/* Offer Settings */}
          <CardWrapper 
            title="Offer Settings" 
            variant="default"
            showLabel={true}
          >
            <ButtonToggleGroup
              label="Offer end date"
              options={offerEndDateOptions}
              selected={formData.offerEndDate}
              onChange={(val) => updateField('offerEndDate', val)}
              showInfo={true}
            />
          </CardWrapper>

          {/* Weekly Rate Display */}
          <CardWrapper 
            title="Weekly Rate Display" 
            variant="default"
            showLabel={true}
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Show Weekly rate for Daily crew in</label>
              <div className="space-y-2">
                <EditableCheckboxField
                  label="Offer view"
                  checked={formData.showWeeklyRateInOfferView}
                  onChange={(val) => updateField('showWeeklyRateInOfferView', val)}
                  isEditing={true}
                />
                <EditableCheckboxField
                  label="Documents"
                  checked={formData.showWeeklyRateInDocuments}
                  onChange={(val) => updateField('showWeeklyRateInDocuments', val)}
                  isEditing={true}
                />
              </div>
            </div>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
}
