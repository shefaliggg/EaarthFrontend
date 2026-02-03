// ProjectGeneral.jsx
import { useState } from 'react';
import { Info, Plus, Minus, Trash2 } from 'lucide-react';
import EditableTextDataField from "../../../../shared/components/wrappers/EditableTextDataField";
import EditableCheckboxField from "../../../../shared/components/wrappers/EditableCheckboxField";
import EditableSelectField from "../../../../shared/components/wrappers/EditableSelectField";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import { PageHeader } from "../../../../shared/components/PageHeader";

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

const ProjectGeneral = () => {
  const [formData, setFormData] = useState({
    // Basic
    currency: 'USD ($)',
    workingWeek: 'Standard',
    showPrepWrapMins: false,
    
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
    
    // Meal penalties
    breakfastPenalty: '5.00',
    lunchPenalty: '5.00',
    dinnerPenalty: '10.00',
    
    // 6th/7th days
    sixthDayFeeMultiplier: '1.5',
    seventhDayFeeMultiplier: '2.0',
    shareMinimumHours: true,
    
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

  const currencyOptions = [
    { value: 'USD ($)', label: 'USD ($)' },
    { value: 'GBP (£)', label: 'GBP (£)' },
    { value: 'EUR (€)', label: 'EUR (€)' },
  ];

  const workingWeekOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: '6 Day', label: '6 Day' },
    { value: 'Continuous', label: 'Continuous' },
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

  const multiplierOptions = [
    { value: '1.0', label: '1.0' },
    { value: '1.5', label: '1.5' },
    { value: '2.0', label: '2.0' },
    { value: '2.5', label: '2.5' },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Basic */}
      <CardWrapper 
        title="Basic" 
        variant="default"
        showLabel={true}
      >
        <div className="grid grid-cols-3 gap-4">
          <EditableSelectField
            label="Currency"
            value={formData.currency}
            items={currencyOptions}
            onChange={(val) => updateField('currency', val)}
            isEditing={true}
          />
          
          <EditableSelectField
            label="Working week"
            value={formData.workingWeek}
            items={workingWeekOptions}
            onChange={(val) => updateField('workingWeek', val)}
            isEditing={true}
          />

          <div className="flex items-end pb-2">
            <EditableCheckboxField
              label="Show prep/wrap mins in Offer View?"
              checked={formData.showPrepWrapMins}
              onChange={(val) => updateField('showPrepWrapMins', val)}
              isEditing={true}
            />
          </div>
        </div>
      </CardWrapper>

      {/* 2. Allowances */}
      <CardWrapper 
        title="Allowances" 
        variant="default"
        showLabel={true}
        description="Which of these allowances might you pay?"
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

      {/* 3. Meal penalties */}
      <CardWrapper 
        title="Meal penalties" 
        variant="default"
        showLabel={true}
      >
        <div className="grid grid-cols-3 gap-4">
          <EditableTextDataField
            label="Breakfast penalty"
            value={formData.breakfastPenalty}
            onChange={(val) => updateField('breakfastPenalty', val)}
            isEditing={true}
            placeholder="5.00"
          />
          <EditableTextDataField
            label="Lunch penalty"
            value={formData.lunchPenalty}
            onChange={(val) => updateField('lunchPenalty', val)}
            isEditing={true}
            placeholder="5.00"
          />
          <EditableTextDataField
            label="Dinner penalty"
            value={formData.dinnerPenalty}
            onChange={(val) => updateField('dinnerPenalty', val)}
            isEditing={true}
            placeholder="10.00"
          />
        </div>
      </CardWrapper>

      {/* 4. 6th/7th days */}
      <CardWrapper 
        title="6th/7th days" 
        variant="default"
        showLabel={true}
      >
        <div className="grid grid-cols-3 gap-4 items-end">
          <EditableSelectField
            label={
              <div className="flex items-center gap-2">
                <span>6th day fee multiplier</span>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
            }
            value={formData.sixthDayFeeMultiplier}
            items={multiplierOptions}
            onChange={(val) => updateField('sixthDayFeeMultiplier', val)}
            isEditing={true}
          />

          <EditableSelectField
            label={
              <div className="flex items-center gap-2">
                <span>7th day fee multiplier</span>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
            }
            value={formData.seventhDayFeeMultiplier}
            items={multiplierOptions}
            onChange={(val) => updateField('seventhDayFeeMultiplier', val)}
            isEditing={true}
          />

          <div className="pb-2">
            <EditableCheckboxField
              label="Share minimum hours on 6th and 7th days in offers?"
              checked={formData.shareMinimumHours}
              onChange={(val) => updateField('shareMinimumHours', val)}
              isEditing={true}
            />
          </div>
        </div>
      </CardWrapper>

      {/* 5. Overtime */}
      <CardWrapper 
        title="Overtime" 
        variant="default"
        showLabel={true}
        description="Custom overtime rates which we offer within each role if you choose not to pay Overtime as 'Calculated pro-rata rate'."
        actions={
          <button 
            onClick={() => console.log("Update standard crew defaults")}
            className="px-4 py-1.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all text-sm"
          >
            Update standard crew defaults
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-4">
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

      {/* 6. Holiday Pay */}
      <CardWrapper 
        title="Holiday Pay" 
        variant="default"
        showLabel={true}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
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
          </div>

          {/* Right Column */}
          <div className="space-y-3">
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
        </div>
      </CardWrapper>

      {/* 7. Weekly Rate Display */}
      <CardWrapper 
        title="Weekly Rate Display" 
        variant="default"
        showLabel={true}
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Show Weekly rate for Daily crew in</label>
          <div className="grid grid-cols-2 gap-4">
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

      {/* 8. Working Hours & 9. Offer Settings - Combined */}
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* 10. Overall dates */}
      <CardWrapper 
        title="Overall dates" 
        variant="default"
        showLabel={true}
      >
        <div className="grid grid-cols-3 gap-4">
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
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
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

      {/* 11. Hiatus Dates & 12. Post Production - Combined */}
      <div className="grid grid-cols-2 gap-4">
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
          <div className="space-y-2">
            {hiatuses.map((hiatus, index) => (
              <div key={hiatus.id} className="flex gap-2 items-end">
                <div className="flex-1">
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
                <div className="flex-1">
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

        <CardWrapper 
          title="Post Production Dates" 
          variant="default"
          showLabel={true}
        >
          <div className="space-y-3">
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
      </div>

      {/* 13. Production base */}
      <CardWrapper 
        title="Production base" 
        variant="default"
        showLabel={true}
        description="Shown to crew in their offer so they can contact you for help, and possibly in documents regarding mileage."
      >
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">Production base address <span className="text-gray-500 font-normal italic">(Optional)</span></div>
          
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={formData.productionBase.addressLine1}
              onChange={(e) => updateNestedField('productionBase', 'addressLine1', e.target.value)}
              className="h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Address line 1"
            />
            <input
              type="text"
              value={formData.productionBase.addressLine2}
              onChange={(e) => updateNestedField('productionBase', 'addressLine2', e.target.value)}
              className="h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Address line 2"
            />
            <input
              type="text"
              value={formData.productionBase.city}
              onChange={(e) => updateNestedField('productionBase', 'city', e.target.value)}
              className="h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="City"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={formData.productionBase.postcode}
              onChange={(e) => updateNestedField('productionBase', 'postcode', e.target.value)}
              className="h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Postcode"
            />
            <EditableSelectField
              label="Country"
              value={formData.productionBase.country}
              items={countryOptions}
              onChange={(val) => updateNestedField('productionBase', 'country', val)}
              isEditing={true}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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

      {/* 14. Company */}
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
              
              <div className="grid grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  value={company.title}
                  onChange={(e) => {
                    const newCompanies = [...formData.companies];
                    newCompanies[index].title = e.target.value;
                    setFormData({ ...formData, companies: newCompanies });
                  }}
                  className="h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Company name (e.g. Werewolf Productions Ltd)"
                />

                <input
                  type="text"
                  value={company.registrationNumber}
                  onChange={(e) => {
                    const newCompanies = [...formData.companies];
                    newCompanies[index].registrationNumber = e.target.value;
                    setFormData({ ...formData, companies: newCompanies });
                  }}
                  className="h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Registration number (e.g. 12345678)"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">Company address</div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={company.addressLine1}
                    onChange={(e) => {
                      const newCompanies = [...formData.companies];
                      newCompanies[index].addressLine1 = e.target.value;
                      setFormData({ ...formData, companies: newCompanies });
                    }}
                    className="h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="City"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={company.postcode}
                    onChange={(e) => {
                      const newCompanies = [...formData.companies];
                      newCompanies[index].postcode = e.target.value;
                      setFormData({ ...formData, companies: newCompanies });
                    }}
                    className="h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Postcode"
                  />

                  <select
                    value={company.country}
                    onChange={(e) => {
                      const newCompanies = [...formData.companies];
                      newCompanies[index].country = e.target.value;
                      setFormData({ ...formData, companies: newCompanies });
                    }}
                    className="h-9 px-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {countryOptions.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardWrapper>
    </div>
  );
};

export default ProjectGeneral;