// ProjectTimesheet.jsx
import { useState } from 'react';
import { Info, Plus, Trash2, Edit, X } from 'lucide-react';
import EditableTextDataField from "../../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../../shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "../../../../shared/components/wrappers/EditableCheckboxField";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import { PageHeader } from "../../../../shared/components/PageHeader";

// Radio Group Component
const RadioGroup = ({ label, options, selected, onChange, showInfo = false }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {showInfo && <Info className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={selected === option.value}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const ProjectTimesheet = () => {
  const [activeTab, setActiveTab] = useState('construction');
  const [formData, setFormData] = useState({
    // Construction - Daily rate & hours
    usePactRate: 'Extract holiday pay from gross rate on Rate card',
    defaultWorkingHours: '10.5 hours',
    
    // Construction - Breaks
    unpaidBreaksDuration: '1 hour',
    
    // Construction - 6th day
    sixthDayRateCalculation: 'Multiply net daily by 4/3',
    sixthDayRateApply: 'Consecutive working days',
    sixthDayRatePayment: 'Daily',
    sixthDayHolidayPay: "Pay net, don't calculate holiday pay (per PACT/BECTU)",
    
    // Construction - 7th day
    seventhDayRateCalculation: 'Multiply net daily by 1.5',
    seventhDayRatePayment: 'Daily',
    seventhDayPayUnsocialHours: false,
    seventhDayHolidayPay: "Pay net, don't calculate holiday pay (per PACT/BECTU)",
    
    // Construction - Overtime
    overtimeRateCalculation: 'Multiply net hourly by 1.5',
    overtimeHolidayPay: "Pay net, don't calculate holiday pay (per PACT/BECTU)",
    overtimeCaps: 'Match PACT/BECTU Rate card',
    applyUnsocialHours: 'Per PACT/BECTU Agreement',
    
    // Construction - Travel time
    travelTimePaid: false,
    
    // Construction - Broken turnaround
    brokenTurnaroundPaid: false,
    
    // Payroll company
    payrollCompany: 'Sargent Disc',
    crewDataCSVExport: 'Team Engine',
    payrollCSVExport: 'Sargent Disc',
    
    // Timecards
    timecardsActiveFrom: 'Mon',
    weekEndingDay: 'Monday',
    
    // Scheduled tasks
    crewReminderDay: 'Monday',
    crewReminderTime: '09:00',
    crewSubmissionDay: 'Monday',
    crewSubmissionTime: '17:00',
    departmentReminderDay: 'Monday',
    departmentReminderTime: '09:00',
    departmentApprovalDay: 'Monday',
    departmentApprovalTime: '17:00',
    
    // Working hours
    standardWorkingDay: '10 + 1',
    semiContinuousWorkingDay: '9 + 0.5',
    continuousWorkingDay: '9',
    
    // Rules
    calculateBrokenTurnaround: 'Only between consecutive work days (rest day always resets)',
    useOfficialRestDays: false,
    restDay1Turnaround: '11 hours',
    restDay2Turnaround: '11 hours',
    sixthSeventhDayCount: 'Any consecutive block',
    travelDay: 'Resets day count',
    postWrapOvertimeGrace: 'Expected wrap',
    postWrapOvertimeCamera: 'Uses inclusive minutes',
    dawnCallPreCall: 'Apply dawn call until 5am then pre-call',
    dawnCallInclusive: 'Uses inclusive minutes',
    
    // Preferences
    crewApprovalPDF: 'Auto',
    requireMealTimes: false,
    onlyPrePostTransport: false,
    travelTimeScheduling: 'Travel time happens outside of all worked hours',
    
    // Roundings
    cameraOvertimeRounding: 'Every 15 mins',
    otherOvertimeRounding: 'Every 15 mins'
  });

  const [projectPlaces, setProjectPlaces] = useState({
    units: [
      { id: 1, name: 'Main', dates: '28 Sep 2023 - 17 Dec 2023' },
      { id: 2, name: 'Splinter Camera', dates: '5 Oct 2023 - 10 Dec 2023' },
      { id: 3, name: '2nd Unit (Main)', dates: '12 Oct 2023 - 11 Dec 2023' }
    ],
    regularPlaces: ['Off set', 'Stream'],
    nearbyBases: [
      'West London Studio',
      'Shinfield Studios',
      'Pinewood',
      'Longcross',
      'Arborfield (Main)',
      'Reading (West)',
      'Wokingham',
      'Bracknell Forest',
      'Swallowfield'
    ]
  });

  const [departmentDefaults, setDepartmentDefaults] = useState([
    { id: 1, department: 'Art Dept', regularStartFinish: 'On Set', cameraOvertime: 'Yes', otherOvertime: 'Yes', minutesBefore: '1', minutesAfter: '' },
    { id: 2, department: 'Art Dept', regularStartFinish: 'Off Set', cameraOvertime: '11', otherOvertime: 'Yes', minutesBefore: '1', minutesAfter: '' },
    { id: 3, department: 'Assistant Directors', regularStartFinish: 'On Set', cameraOvertime: 'Yes', otherOvertime: 'Yes', minutesBefore: '30', minutesAfter: '30' },
    { id: 4, department: 'Assistant Directors', regularStartFinish: 'Off Set', cameraOvertime: '11', otherOvertime: 'Yes', minutesBefore: '30', minutesAfter: '30' },
    { id: 5, department: 'Camera', regularStartFinish: 'On Set', cameraOvertime: 'Yes', otherOvertime: 'Yes', minutesBefore: '30', minutesAfter: '30' },
    { id: 6, department: 'Camera', regularStartFinish: 'Off Set', cameraOvertime: '11', otherOvertime: 'Yes', minutesBefore: '30', minutesAfter: '30' },
    { id: 7, department: 'Continuity', regularStartFinish: 'On Set', cameraOvertime: 'Yes', otherOvertime: 'Yes', minutesBefore: '30', minutesAfter: '30' },
    { id: 8, department: 'Continuity', regularStartFinish: 'Off Set', cameraOvertime: '11', otherOvertime: 'Yes', minutesBefore: '30', minutesAfter: '30' },
    { id: 9, department: 'Costume', regularStartFinish: 'On Set', cameraOvertime: 'Yes', otherOvertime: 'Yes', minutesBefore: '30', minutesAfter: '30' },
    { id: 10, department: 'Costume', regularStartFinish: 'Off Set', cameraOvertime: '11', otherOvertime: 'Yes', minutesBefore: '30', minutesAfter: '30' },
    { id: 11, department: 'Hair and Make-up', regularStartFinish: 'On Set', cameraOvertime: 'Yes', otherOvertime: 'Yes', minutesBefore: '30', minutesAfter: '' }
  ]);

  const [allowances, setAllowances] = useState({
    box: false,
    computer: false,
    equipment: false,
    mobile: false,
    software: false,
    vehicle: false
  });

  const [customDays, setCustomDays] = useState([
    { id: 1, type: 'Driver - Cast Travel', paidAs: 'Percentage', dailyRate: '150.00%', holidayPay: 'Accrue', sixthSeventh: 'Resets day count', payAllowances: 'Yes', showToCrew: 'Yes' },
    { id: 2, type: 'Half Day', paidAs: 'Percentage', dailyRate: '50.00%', holidayPay: 'Accrue', sixthSeventh: 'Resets day count', payAllowances: 'Yes', showToCrew: 'Yes' },
    { id: 3, type: 'Sick - Paid', paidAs: 'Percentage', dailyRate: '100.00%', holidayPay: 'Accrue', sixthSeventh: "Don't reset and don't count", payAllowances: 'No', showToCrew: 'No' },
    { id: 4, type: 'Travel & Turnaround', paidAs: 'Percentage', dailyRate: '200.00%', holidayPay: 'Accrue', sixthSeventh: 'Resets day count', payAllowances: 'Yes', showToCrew: 'Yes' },
    { id: 5, type: 'Travel Somerset', paidAs: 'Percentage', dailyRate: '150.00%', holidayPay: 'Accrue', sixthSeventh: 'Resets day count', payAllowances: 'No', showToCrew: 'No' }
  ]);

  const [customFields, setCustomFields] = useState([
    { id: 1, name: 'Special stips 3', value: 'N/A' },
    { id: 2, name: 'Special stips 7', value: 'N/A' },
    { id: 3, name: 'Special stips 1', value: 'N/A' },
    { id: 4, name: 'Special stips 5', value: 'N/A' },
    { id: 5, name: 'Special stips 6', value: 'N/A' },
    { id: 6, name: 'Special stips 9', value: 'N/A' },
    { id: 7, name: 'Special stips 2', value: 'N/A' },
    { id: 8, name: 'Special stips 4', value: 'N/A' }
  ]);

  const [editingCard, setEditingCard] = useState(null);

  const toggleCardEdit = (cardName) => {
    setEditingCard(editingCard === cardName ? null : cardName);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCustomDay = () => {
    setCustomDays([...customDays, {
      id: customDays.length + 1,
      type: '',
      paidAs: 'Percentage',
      dailyRate: '100.00%',
      holidayPay: 'Accrue',
      sixthSeventh: 'Resets day count',
      payAllowances: 'No',
      showToCrew: 'No'
    }]);
  };

  const deleteCustomDay = (id) => {
    setCustomDays(customDays.filter(day => day.id !== id));
  };

  const addPlace = () => {
    // Logic to add new place
  };

  const addDepartmentDefault = () => {
    // Logic to add new department default
  };

  const addCustomField = () => {
    setCustomFields([...customFields, {
      id: customFields.length + 1,
      name: '',
      value: 'N/A'
    }]);
  };

  const weekDayOptions = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' }
  ];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  const turnaroundOptions = [
    { value: '11 hours', label: '11 hours' },
    { value: '10 hours', label: '10 hours' },
    { value: '12 hours', label: '12 hours' }
  ];

  const roundingOptions = [
    { value: 'Every 15 mins', label: 'Every 15 mins' },
    { value: 'Every 30 mins', label: 'Every 30 mins' },
    { value: 'Every 1 hour', label: 'Every 1 hour' }
  ];

  const payrollCompanyOptions = [
    { value: 'Sargent Disc', label: 'Sargent Disc' },
    { value: 'Other Company', label: 'Other Company' }
  ];

  const csvExportOptions = [
    { value: 'Team Engine', label: 'Team Engine' },
    { value: 'Sargent Disc', label: 'Sargent Disc' }
  ];

  // Construction options
  const pactRateOptions = [
    { value: 'Add holiday pay to net rate on Rate card', label: 'Add holiday pay to net rate on Rate card' },
    { value: 'Extract holiday pay from gross rate on Rate card', label: 'Extract holiday pay from gross rate on Rate card' },
    { value: "Don't use Rate card", label: "Don't use Rate card" },
  ];

  const workingHoursOptions = [
    { value: '12 hours (continuous)', label: '12 hours (continuous)' },
    { value: '12 hours', label: '12 hours' },
    { value: '11 hours', label: '11 hours' },
    { value: '10.5 hours', label: '10.5 hours' },
    { value: '10 hours', label: '10 hours' },
    { value: '9 hours', label: '9 hours' },
    { value: '8 hours', label: '8 hours' },
    { value: '7.5 hours', label: '7.5 hours' },
    { value: '7 hours', label: '7 hours' },
    { value: '6 hours', label: '6 hours' },
    { value: '5 hours', label: '5 hours' },
    { value: '4 hours', label: '4 hours' },
    { value: '3 hours', label: '3 hours' },
    { value: '2 hours', label: '2 hours' },
    { value: '1 hour', label: '1 hour' },
  ];

  const unpaidBreaksOptions = [
    { value: '1.5 hours', label: '1.5 hours' },
    { value: '1 hour', label: '1 hour' },
    { value: '0.5 hours', label: '0.5 hours' },
  ];

  const sixthDayCalculationOptions = [
    { value: 'Multiply net daily by 4/3', label: 'Multiply net daily by 4/3' },
    { value: 'Match PACT/BECTU Rate card', label: 'Match PACT/BECTU Rate card' },
    { value: 'Use different multiplier', label: 'Use different multiplier' },
    { value: 'Enter own rate in offer', label: 'Enter own rate in offer' },
  ];

  const whenApplyOptions = [
    { value: 'Consecutive working days', label: 'Consecutive working days' },
    { value: 'The 6th day worked in a timecard week', label: 'The 6th day worked in a timecard week' },
    { value: 'Weekend days', label: 'Weekend days' },
  ];

  const paymentTypeOptions = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Hourly', label: 'Hourly' },
  ];

  const holidayPayOptions = [
    { value: "Pay net, don't calculate holiday pay (per PACT/BECTU)", label: "Pay net, don't calculate holiday pay (per PACT/BECTU)" },
    { value: 'Pay net, calculate holiday pay', label: 'Pay net, calculate holiday pay' },
    { value: 'Pay gross', label: 'Pay gross' },
  ];

  const seventhDayCalculationOptions = [
    { value: 'Multiply net daily by 1.5', label: 'Multiply net daily by 1.5' },
    { value: 'Match PACT/BECTU Rate card', label: 'Match PACT/BECTU Rate card' },
    { value: 'Use different multiplier', label: 'Use different multiplier' },
    { value: 'Enter own rate in offer', label: 'Enter own rate in offer' },
  ];

  const overtimeCalculationOptions = [
    { value: 'Multiply net hourly by 1.5', label: 'Multiply net hourly by 1.5' },
    { value: '1.5x gross hourly rate then extract holiday pay', label: '1.5x gross hourly rate then extract holiday pay' },
    { value: 'Match PACT/BECTU Rate card', label: 'Match PACT/BECTU Rate card' },
    { value: 'Use different multiplier', label: 'Use different multiplier' },
    { value: 'Enter own rate in offer', label: 'Enter own rate in offer' },
  ];

  const overtimeCapsOptions = [
    { value: 'Match PACT/BECTU Rate card', label: 'Match PACT/BECTU Rate card' },
    { value: 'Other cap', label: 'Other cap' },
    { value: 'No cap', label: 'No cap' },
  ];

  const unsocialHoursOptions = [
    { value: 'Per PACT/BECTU Agreement', label: 'Per PACT/BECTU Agreement' },
    { value: 'Custom unsocial hours', label: 'Custom unsocial hours' },
    { value: "Don't apply", label: "Don't apply" },
  ];

  return (
    <div className="space-y-4">
      {/* Title with Tabs */}
      <div className="flex items-center justify-between bg-background border rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-base font-semibold">Timesheet Settings</h2>
          <div className="flex items-center gap-2">
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-300" style={{ width: '60%' }}></div>
            </div>
            <span className="text-sm font-medium text-gray-600">60%</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('construction')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'construction'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-purple-600 hover:bg-gray-200'
            }`}
          >
            Construction
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'payroll'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-purple-600 hover:bg-gray-200'
            }`}
          >
            Payroll & Schedule
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'rules'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-purple-600 hover:bg-gray-200'
            }`}
          >
            Rules & Hours
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'custom'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-purple-600 hover:bg-gray-200'
            }`}
          >
            Custom Settings
          </button>
        </div>
      </div>

      {/* Tab Content - Construction */}
      {activeTab === 'construction' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN (3/12) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Construction - Daily rate & hours */}
          <CardWrapper 
            title="Construction - Daily rate & hours" 
            variant="default"
            showLabel={true}
            actions={
              <button
                onClick={() => toggleCardEdit('constructionDailyRate')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                {editingCard === 'constructionDailyRate' ? (
                  <X className="w-4 h-4 text-gray-600" />
                ) : (
                  <Edit className="w-4 h-4 text-gray-600" />
                )}
              </button>
            }
          >
            <div className="space-y-2">
              <EditableSelectField
                label="Use PACT/BECTU Rate card for Daily rate?"
                value={formData.usePactRate}
                items={pactRateOptions}
                onChange={(val) => updateField('usePactRate', val)}
                isEditing={editingCard === 'constructionDailyRate'}
              />
              
              <div className="flex flex-col gap-1">
                <EditableSelectField
                  label="Default standard working hours"
                  value={formData.defaultWorkingHours}
                  items={workingHoursOptions}
                  onChange={(val) => updateField('defaultWorkingHours', val)}
                  isEditing={editingCard === 'constructionDailyRate'}
                />
                <p className="text-xs text-gray-500">Excluding breaks.</p>
              </div>
            </div>
          </CardWrapper>

          {/* Construction - Breaks */}
          <CardWrapper 
            title="Construction - Breaks" 
            variant="default"
            showLabel={true}
            actions={
              <button
                onClick={() => toggleCardEdit('constructionBreaks')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                {editingCard === 'constructionBreaks' ? (
                  <X className="w-4 h-4 text-gray-600" />
                ) : (
                  <Edit className="w-4 h-4 text-gray-600" />
                )}
              </button>
            }
          >
            <div className="max-w-md">
              <div className="flex items-center gap-2 mb-1">
                <label className="text-sm font-medium text-gray-700">Duration of unpaid breaks</label>
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                    The PACT/BECTU Agreement specifies a 30 minute unpaid morning break and unpaid lunch of 1 hour. You might have agreed different break period(s) for an overall shorter day. This break period duration will only be used to determine when overtime becomes applicable.
                  </div>
                </div>
              </div>
              <EditableSelectField
                value={formData.unpaidBreaksDuration}
                items={unpaidBreaksOptions}
                onChange={(val) => updateField('unpaidBreaksDuration', val)}
                isEditing={editingCard === 'constructionBreaks'}
              />
            </div>
          </CardWrapper>
        </div>

        {/* CENTER COLUMN (6/12) */}
        <div className="lg:col-span-6 space-y-4">
      {/* Construction - 6th day */}
      <CardWrapper 
        title="Construction - 6th day" 
        variant="default"
        showLabel={true}
        actions={
          <button
            onClick={() => toggleCardEdit('construction6thDay')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            {editingCard === 'construction6thDay' ? (
              <X className="w-4 h-4 text-gray-600" />
            ) : (
              <Edit className="w-4 h-4 text-gray-600" />
            )}
          </button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <EditableSelectField
              label="6th day rate calculation"
              value={formData.sixthDayRateCalculation}
              items={sixthDayCalculationOptions}
              onChange={(val) => updateField('sixthDayRateCalculation', val)}
              isEditing={editingCard === 'construction6thDay'}
            />
            
            <EditableSelectField
              label="When does 6th day rate apply?"
              value={formData.sixthDayRateApply}
              items={whenApplyOptions}
              onChange={(val) => updateField('sixthDayRateApply', val)}
              isEditing={editingCard === 'construction6thDay'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <EditableSelectField
              label="6th day rate payment"
              value={formData.sixthDayRatePayment}
              items={paymentTypeOptions}
              onChange={(val) => updateField('sixthDayRatePayment', val)}
              isEditing={editingCard === 'construction6thDay'}
            />

            <EditableSelectField
              label="Holiday pay application"
              value={formData.sixthDayHolidayPay}
              items={holidayPayOptions}
              onChange={(val) => updateField('sixthDayHolidayPay', val)}
              isEditing={editingCard === 'construction6thDay'}
            />
          </div>
        </div>
      </CardWrapper>

      {/* Construction - 7th day */}
      <CardWrapper 
        title="Construction - 7th day" 
        variant="default"
        showLabel={true}
        actions={
          <button
            onClick={() => toggleCardEdit('construction7thDay')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            {editingCard === 'construction7thDay' ? (
              <X className="w-4 h-4 text-gray-600" />
            ) : (
              <Edit className="w-4 h-4 text-gray-600" />
            )}
          </button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 items-end">
            <EditableSelectField
              label="7th day rate calculation"
              value={formData.seventhDayRateCalculation}
              items={seventhDayCalculationOptions}
              onChange={(val) => updateField('seventhDayRateCalculation', val)}
              isEditing={editingCard === 'construction7thDay'}
            />
            
            <div className="pb-2">
              <EditableCheckboxField
                label="Pay Unsocial Hours 2 for all hours worked on 7th day?"
                checked={formData.seventhDayPayUnsocialHours}
                onChange={(val) => updateField('seventhDayPayUnsocialHours', val)}
                isEditing={editingCard === 'construction7thDay'}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <EditableSelectField
              label="7th day rate payment"
              value={formData.seventhDayRatePayment}
              items={paymentTypeOptions}
              onChange={(val) => updateField('seventhDayRatePayment', val)}
              isEditing={editingCard === 'construction7thDay'}
            />

            <EditableSelectField
              label="Holiday pay application"
              value={formData.seventhDayHolidayPay}
              items={holidayPayOptions}
              onChange={(val) => updateField('seventhDayHolidayPay', val)}
              isEditing={editingCard === 'construction7thDay'}
            />
          </div>
        </div>
      </CardWrapper>

      {/* Construction - Overtime */}
      <CardWrapper 
        title="Construction - Overtime" 
        variant="default"
        showLabel={true}
        actions={
          <button
            onClick={() => toggleCardEdit('constructionOvertime')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            {editingCard === 'constructionOvertime' ? (
              <X className="w-4 h-4 text-gray-600" />
            ) : (
              <Edit className="w-4 h-4 text-gray-600" />
            )}
          </button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <EditableSelectField
              label="O/T rate calculation"
              value={formData.overtimeRateCalculation}
              items={overtimeCalculationOptions}
              onChange={(val) => updateField('overtimeRateCalculation', val)}
              isEditing={editingCard === 'constructionOvertime'}
            />
            
            <EditableSelectField
              label="O/T caps"
              value={formData.overtimeCaps}
              items={overtimeCapsOptions}
              onChange={(val) => updateField('overtimeCaps', val)}
              isEditing={editingCard === 'constructionOvertime'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <EditableSelectField
              label="Holiday pay application"
              value={formData.overtimeHolidayPay}
              items={holidayPayOptions}
              onChange={(val) => updateField('overtimeHolidayPay', val)}
              isEditing={editingCard === 'constructionOvertime'}
            />
            
            <EditableSelectField
              label="Apply unsocial hours"
              value={formData.applyUnsocialHours}
              items={unsocialHoursOptions}
              onChange={(val) => updateField('applyUnsocialHours', val)}
              isEditing={editingCard === 'constructionOvertime'}
            />
          </div>
        </div>
      </CardWrapper>
      </div>

        {/* RIGHT COLUMN (3/12) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Travel time */}
          <CardWrapper 
            title="Construction - Travel time" 
            variant="default"
            showLabel={true}
            actions={
              <button
                onClick={() => toggleCardEdit('travelTime')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                {editingCard === 'travelTime' ? (
                  <X className="w-4 h-4 text-gray-600" />
                ) : (
                  <Edit className="w-4 h-4 text-gray-600" />
                )}
              </button>
            }
          >
            <div className="flex items-center justify-between py-1.5">
              <label className="text-sm text-gray-700">Travel time paid?</label>
              <button
                onClick={() => updateField('travelTimePaid', !formData.travelTimePaid)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.travelTimePaid ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  formData.travelTimePaid ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </CardWrapper>

          {/* Broken turnaround */}
          <CardWrapper 
            title="Construction - Broken turnaround" 
            variant="default"
            showLabel={true}
            actions={
              <button
                onClick={() => toggleCardEdit('brokenTurnaround')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                {editingCard === 'brokenTurnaround' ? (
                  <X className="w-4 h-4 text-gray-600" />
                ) : (
                  <Edit className="w-4 h-4 text-gray-600" />
                )}
              </button>
            }
          >
            <div className="flex items-center justify-between py-1.5">
              <label className="text-sm text-gray-700">Broken turnaround paid?</label>
              <button
                onClick={() => updateField('brokenTurnaroundPaid', !formData.brokenTurnaroundPaid)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.brokenTurnaroundPaid ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  formData.brokenTurnaroundPaid ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </CardWrapper>
        </div>
      </div>
      )}

      {/* Tab Content - Payroll & Schedule */}
      {activeTab === 'payroll' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 space-y-4">
          {/* Payroll company */}
          <CardWrapper title="" variant="default" showLabel={false} actions={
            <button
              onClick={() => toggleCardEdit('payrollCompany')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              {editingCard === 'payrollCompany' ? (
                <X className="w-4 h-4 text-gray-600" />
              ) : (
                <Edit className="w-4 h-4 text-gray-600" />
              )}
            </button>
          }>
            <div className="space-y-4">
              <EditableSelectField
                label="Payroll company"
                value={formData.payrollCompany}
                items={payrollCompanyOptions}
                isEditing={editingCard === 'payrollCompany'}
                onChange={(val) => updateField('payrollCompany', val)}
              />

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <EditableSelectField
                    label="Crew Data CSV export layout"
                    value={formData.crewDataCSVExport}
                    items={csvExportOptions}
                    isEditing={editingCard === 'payrollCompany'}
                    onChange={(val) => updateField('crewDataCSVExport', val)}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-6">(Optional)</span>
                <Info className="w-4 h-4 text-gray-400 mt-6" />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <EditableSelectField
                    label="Payroll CSV export layout"
                    value={formData.payrollCSVExport}
                    items={csvExportOptions}
                    isEditing={editingCard === 'payrollCompany'}
                    onChange={(val) => updateField('payrollCSVExport', val)}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-6">(Optional)</span>
                <Info className="w-4 h-4 text-gray-400 mt-6" />
              </div>
            </div>
          </CardWrapper>
        </div>

        {/* CENTER COLUMN */}
        <div className="lg:col-span-6 space-y-4">
          {/* Scheduled tasks */}
          <CardWrapper
            title="Scheduled tasks"
            variant="default"
            showLabel={true}
            actions={
              <button
                onClick={() => toggleCardEdit('scheduledTasks')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                {editingCard === 'scheduledTasks' ? (
                  <X className="w-4 h-4 text-gray-600" />
                ) : (
                  <Edit className="w-4 h-4 text-gray-600" />
                )}
              </button>
            }
          >
            <div className="space-y-4">
              {/* Crew reminder */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Crew reminder</h4>
                <div className="grid grid-cols-2 gap-4">
                  <EditableSelectField
                    label="Crew reminder day"
                    value={formData.crewReminderDay}
                    items={weekDayOptions}
                    isEditing={editingCard === 'scheduledTasks'}
                    onChange={(val) => updateField('crewReminderDay', val)}
                  />
                  <EditableSelectField
                    label="Crew reminder time"
                    value={formData.crewReminderTime}
                    items={timeOptions}
                    isEditing={editingCard === 'scheduledTasks'}
                    onChange={(val) => updateField('crewReminderTime', val)}
                  />
                </div>
              </div>

              {/* Crew submission deadline */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Crew submission deadline</h4>
                <div className="grid grid-cols-2 gap-4">
                  <EditableSelectField
                    label="Crew submission day"
                    value={formData.crewSubmissionDay}
                    items={weekDayOptions}
                    isEditing={editingCard === 'scheduledTasks'}
                    onChange={(val) => updateField('crewSubmissionDay', val)}
                  />
                  <EditableSelectField
                    label="Crew submission time"
                    value={formData.crewSubmissionTime}
                    items={timeOptions}
                    isEditing={editingCard === 'scheduledTasks'}
                    onChange={(val) => updateField('crewSubmissionTime', val)}
                  />
                </div>
              </div>

              {/* Department reminder */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Department reminder</h4>
                <div className="grid grid-cols-2 gap-4">
                  <EditableSelectField
                    label="Department reminder day"
                    value={formData.departmentReminderDay}
                    items={weekDayOptions}
                    isEditing={editingCard === 'scheduledTasks'}
                    onChange={(val) => updateField('departmentReminderDay', val)}
                  />
                  <EditableSelectField
                    label="Department reminder time"
                    value={formData.departmentReminderTime}
                    items={timeOptions}
                    isEditing={editingCard === 'scheduledTasks'}
                    onChange={(val) => updateField('departmentReminderTime', val)}
                  />
                </div>
              </div>

              {/* Department approval deadline */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Department approval deadline</h4>
                <div className="grid grid-cols-2 gap-4">
                  <EditableSelectField
                    label="Department approval deadline day"
                    value={formData.departmentApprovalDay}
                    items={weekDayOptions}
                    isEditing={editingCard === 'scheduledTasks'}
                    onChange={(val) => updateField('departmentApprovalDay', val)}
                  />
                  <EditableSelectField
                    label="Department approval deadline time"
                    value={formData.departmentApprovalTime}
                    items={timeOptions}
                    isEditing={editingCard === 'scheduledTasks'}
                    onChange={(val) => updateField('departmentApprovalTime', val)}
                  />
                </div>
              </div>
            </div>
          </CardWrapper>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 space-y-4">
          {/* Timecards */}
          <CardWrapper title="Timecards" variant="default" showLabel={true} actions={
            <button
              onClick={() => toggleCardEdit('timecards')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              {editingCard === 'timecards' ? (
                <X className="w-4 h-4 text-gray-600" />
              ) : (
                <Edit className="w-4 h-4 text-gray-600" />
              )}
            </button>
          }>
            <div className="space-y-4">
              <EditableTextDataField
                label="Timecards active from"
                value={formData.timecardsActiveFrom}
                onChange={(val) => updateField('timecardsActiveFrom', val)}
                isEditing={editingCard === 'timecards'}
                placeholder="Mon"
              />
              <EditableSelectField
                label="Week ending day"
                value={formData.weekEndingDay}
                items={weekDayOptions}
                isEditing={editingCard === 'timecards'}
                onChange={(val) => updateField('weekEndingDay', val)}
              />
            </div>
          </CardWrapper>
        </div>
      </div>
      )}

      {/* Tab Content - Rules & Hours */}
      {activeTab === 'rules' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* LEFT - Working hours */}
      <div className="lg:col-span-3 flex">
      <CardWrapper
        title="Working hours"
        variant="default"
        showLabel={true}
        actions={
          <button
            onClick={() => toggleCardEdit('workingHours')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            {editingCard === 'workingHours' ? (
              <X className="w-4 h-4 text-gray-600" />
            ) : (
              <Edit className="w-4 h-4 text-gray-600" />
            )}
          </button>
        }
      >
        <div className="space-y-4">
          {/* Standard working day */}
          <div>
            <RadioGroup
              label="Standard working day"
              options={[
                { value: 'Standard working day: 10 + 1', label: 'Standard working day: 10 + 1' },
                { value: 'Standard working day: 10.5 + 1', label: 'Standard working day: 10.5 + 1' },
                { value: 'Standard working day: 11 + 1', label: 'Standard working day: 11 + 1' }
              ]}
              selected={formData.standardWorkingDay}
              onChange={(val) => updateField('standardWorkingDay', val)}
            />
          </div>

          {/* Semi-continuous working day */}
          <div>
            <RadioGroup
              label="Semi-continuous working day"
              options={[
                { value: 'Semi-continuous working day: 9 + 0.5', label: 'Semi-continuous working day: 9 + 0.5' },
                { value: 'Semi-continuous working day: 9.5 + 0.5', label: 'Semi-continuous working day: 9.5 + 0.5' },
                { value: 'Semi-continuous working day: 10 + 0.5', label: 'Semi-continuous working day: 10 + 0.5' },
                { value: 'Semi-continuous working day: 10.5 + 0.5', label: 'Semi-continuous working day: 10.5 + 0.5' }
              ]}
              selected={formData.semiContinuousWorkingDay}
              onChange={(val) => updateField('semiContinuousWorkingDay', val)}
            />
          </div>

          {/* Continuous working day */}
          <div>
            <RadioGroup
              label="Continuous working day"
              options={[
                { value: 'Continuous working day: 9', label: 'Continuous working day: 9' },
                { value: 'Continuous working day: 9.5', label: 'Continuous working day: 9.5' },
                { value: 'Continuous working day: 10', label: 'Continuous working day: 10' }
              ]}
              selected={formData.continuousWorkingDay}
              onChange={(val) => updateField('continuousWorkingDay', val)}
            />
          </div>
        </div>
      </CardWrapper>
      </div>

      {/* Rules - 9 columns */}
      <div className="lg:col-span-9 flex">
      <CardWrapper title="Rules" variant="default" showLabel={true} actions={
        <button
          onClick={() => toggleCardEdit('rules')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
        >
          {editingCard === 'rules' ? (
            <X className="w-4 h-4 text-gray-600" />
          ) : (
            <Edit className="w-4 h-4 text-gray-600" />
          )}
        </button>
      }>
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <RadioGroup
              label="Calculate broken turnaround for dailies"
              options={[
                { value: 'Only between consecutive work days (rest day always resets)', label: 'Only between consecutive work days (rest day always resets)' },
                { value: 'As per weekly crew', label: 'As per weekly crew' }
              ]}
              selected={formData.calculateBrokenTurnaround}
              onChange={(val) => updateField('calculateBrokenTurnaround', val)}
              showInfo={true}
            />

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <EditableSelectField
                  label="1 rest day turnaround period"
                  value={formData.restDay1Turnaround}
                  items={turnaroundOptions}
                  isEditing={true}
                  onChange={(val) => updateField('restDay1Turnaround', val)}
                />
              </div>
              <Info className="w-4 h-4 text-gray-400 mt-6" />
            </div>

            <RadioGroup
              label="6th & 7th day count"
              options={[
                { value: 'Any consecutive block', label: 'Any consecutive block' },
                { value: 'Reset on first day of week', label: 'Reset on first day of week' }
              ]}
              selected={formData.sixthSeventhDayCount}
              onChange={(val) => updateField('sixthSeventhDayCount', val)}
              showInfo={true}
            />

            <RadioGroup
              label="Travel day"
              options={[
                { value: 'Resets day count', label: 'Resets day count' },
                { value: "Don't reset; don't count", label: "Don't reset; don't count" },
                { value: "Don't reset; count", label: "Don't reset; count" }
              ]}
              selected={formData.travelDay}
              onChange={(val) => updateField('travelDay', val)}
              showInfo={true}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <EditableCheckboxField
              label="Use 'Official rest days' in calendar"
              checked={formData.useOfficialRestDays}
              onChange={(val) => updateField('useOfficialRestDays', val)}
              isEditing={true}
            />

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <EditableSelectField
                  label="2 rest day turnaround period"
                  value={formData.restDay2Turnaround}
                  items={turnaroundOptions}
                  isEditing={true}
                  onChange={(val) => updateField('restDay2Turnaround', val)}
                />
              </div>
              <Info className="w-4 h-4 text-gray-400 mt-6" />
            </div>

            <RadioGroup
              label="Post wrap overtime after Grace period applicable from"
              options={[
                { value: 'Expected wrap', label: 'Expected wrap' },
                { value: 'Unit wrap', label: 'Unit wrap' },
                { value: 'After 15 mins Grace', label: 'After 15 mins Grace' }
              ]}
              selected={formData.postWrapOvertimeGrace}
              onChange={(val) => updateField('postWrapOvertimeGrace', val)}
              showInfo={true}
            />

            <RadioGroup
              label="Post wrap overtime after Camera overtime"
              options={[
                { value: 'Uses inclusive minutes', label: 'Uses inclusive minutes' },
                { value: 'Ignores inclusive minutes after', label: 'Ignores inclusive minutes after' },
                { value: 'Ignores inclusive minutes', label: 'Ignores inclusive minutes' }
              ]}
              selected={formData.postWrapOvertimeCamera}
              onChange={(val) => updateField('postWrapOvertimeCamera', val)}
              showInfo={true}
            />
          </div>

          {/* Full width row for Dawn call fields */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <RadioGroup
              label="Dawn call and Pre-call"
              options={[
                { value: 'Apply dawn call until 5am then pre-call', label: 'Apply dawn call until 5am then pre-call' },
                { value: 'Apply dawn call and pre-call from In time (i.e. pay both for hours prior to 5am)', label: 'Apply dawn call and pre-call from In time (i.e. pay both for hours prior to 5am)' }
              ]}
              selected={formData.dawnCallPreCall}
              onChange={(val) => updateField('dawnCallPreCall', val)}
            />

            <RadioGroup
              label="Dawn call and Inclusive minutes"
              options={[
                { value: 'Uses inclusive minutes', label: 'Uses inclusive minutes' },
                { value: 'Uses inclusive minutes for pre-call only', label: 'Uses inclusive minutes for pre-call only' },
                { value: 'Does not use inclusive minutes prior to start of day', label: 'Does not use inclusive minutes prior to start of day' }
              ]}
              selected={formData.dawnCallInclusive}
              onChange={(val) => updateField('dawnCallInclusive', val)}
            />
          </div>
        </div>
      </CardWrapper>
      </div>

      {/* FULL WIDTH - Department defaults */}
      <div className="lg:col-span-12">
      <CardWrapper
        title="Department defaults"
        variant="default"
        showLabel={true}
        actions={
          <>
            <button
              onClick={() => toggleCardEdit('departmentDefaults')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              {editingCard === 'departmentDefaults' ? (
                <X className="w-4 h-4 text-gray-600" />
              ) : (
                <Edit className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={addDepartmentDefault}
              className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
            >
              <Plus className="w-3 h-3" />
              Add department default
            </button>
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Department</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Regular start/finish</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Camera overtime</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Other overtime</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Minutes before</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Minutes after</th>
                <th className="text-right text-xs font-medium text-gray-700 pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {departmentDefaults.map((dept) => (
                <tr key={dept.id} className="border-b border-gray-100">
                  <td className="py-2 text-sm">{dept.department}</td>
                  <td className="py-2 text-sm">{dept.regularStartFinish}</td>
                  <td className="py-2 text-sm">{dept.cameraOvertime}</td>
                  <td className="py-2 text-sm">{dept.otherOvertime}</td>
                  <td className="py-2 text-sm">{dept.minutesBefore}</td>
                  <td className="py-2 text-sm">{dept.minutesAfter}</td>
                  <td className="py-2 text-right">
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardWrapper>
      </div>

      {/* LEFT + CENTER - Project places */}
      <div className="lg:col-span-9">
      <CardWrapper
        title="Project places"
        variant="default"
        showLabel={true}
        actions={
          <>
            <button
              onClick={() => toggleCardEdit('projectPlaces')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              {editingCard === 'projectPlaces' ? (
                <X className="w-4 h-4 text-gray-600" />
              ) : (
                <Edit className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={addPlace}
              className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
            >
              <Plus className="w-3 h-3" />
              Add new place
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Units */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold text-gray-900">Units</h4>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-700 pb-2">Name</th>
                    <th className="text-left text-xs font-medium text-gray-700 pb-2">Dates/notes</th>
                    <th className="text-right text-xs font-medium text-gray-700 pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {projectPlaces.units.map((unit) => (
                    <tr key={unit.id} className="border-b border-gray-100">
                      <td className="py-2 text-sm">{unit.name}</td>
                      <td className="py-2 text-sm text-gray-600">{unit.dates}</td>
                      <td className="py-2 text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regular places */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Regular places</h4>
            <div className="flex flex-wrap gap-2">
              {projectPlaces.regularPlaces.map((place, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                  {place}
                </span>
              ))}
            </div>
          </div>

          {/* Nearby bases */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Nearby bases</h4>
            <div className="space-y-2">
              {projectPlaces.nearbyBases.map((base, index) => (
                <div key={index} className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-700">{base}</span>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardWrapper>
      </div>

      {/* RIGHT - Preferences */}
      <div className="lg:col-span-3 space-y-4">
      <CardWrapper title="Roundings" variant="default" showLabel={true} actions={
        <button
          onClick={() => toggleCardEdit('roundings')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
        >
          {editingCard === 'roundings' ? (
            <X className="w-4 h-4 text-gray-600" />
          ) : (
            <Edit className="w-4 h-4 text-gray-600" />
          )}
        </button>
      }>
        <div className="grid grid-cols-2 gap-4">
          <EditableSelectField
            label="Camera overtime rounding"
            value={formData.cameraOvertimeRounding}
            items={roundingOptions}
            isEditing={editingCard === 'roundings'}
            onChange={(val) => updateField('cameraOvertimeRounding', val)}
          />
          <EditableSelectField
            label="Other overtime rounding"
            value={formData.otherOvertimeRounding}
            items={roundingOptions}
            isEditing={editingCard === 'roundings'}
            onChange={(val) => updateField('otherOvertimeRounding', val)}
          />
        </div>
      </CardWrapper>

      <CardWrapper title="Preferences" variant="default" showLabel={true} actions={
        <button
          onClick={() => toggleCardEdit('preferences')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
        >
          {editingCard === 'preferences' ? (
            <X className="w-4 h-4 text-gray-600" />
          ) : (
            <Edit className="w-4 h-4 text-gray-600" />
          )}
        </button>
      }>
        <div className="space-y-4">
          <RadioGroup
            label="If a timecard is automatically submitted, in the 'crew approval' on the PDF, show"
            options={[
              { value: 'Auto', label: 'Auto' },
              { value: 'pp Department Approver', label: 'pp Department Approver' }
            ]}
            selected={formData.crewApprovalPDF}
            onChange={(val) => updateField('crewApprovalPDF', val)}
          />

          <EditableCheckboxField
            label="Require meal start and end times to be entered on timecard?"
            checked={formData.requireMealTimes}
            onChange={(val) => updateField('requireMealTimes', val)}
            isEditing={editingCard === 'preferences'}
          />

          <div>
            <EditableCheckboxField
              label="Only apply pre and post overtime for Transport department specific offers"
              checked={formData.onlyPrePostTransport}
              onChange={(val) => updateField('onlyPrePostTransport', val)}
              isEditing={editingCard === 'preferences'}
            />
            <p className="text-xs text-gray-500 mt-1">When inactive all overtime and penalties will apply.</p>
          </div>

          <RadioGroup
            label="When including Travel time in your scheduled shooting day"
            options={[
              { value: 'Travel time happens outside of all worked hours', label: 'Travel time happens outside of all worked hours' },
              { value: 'Working hours are always reduced by the Travel time', label: 'Working hours are always reduced by the Travel time' }
            ]}
            selected={formData.travelTimeScheduling}
            onChange={(val) => updateField('travelTimeScheduling', val)}
            showInfo={true}
          />
        </div>
      </CardWrapper>
      </div>
      </div>
      )}

      {/* Tab Content - Custom Settings */}
      {activeTab === 'custom' && (
      <div className="space-y-4">
      {/* Daily Allowances / Overrides */}
      <CardWrapper
        title="Daily Allowances / Overrides"
        variant="default"
        showLabel={true}
        actions={
          <button
            onClick={() => toggleCardEdit('dailyAllowances')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            {editingCard === 'dailyAllowances' ? (
              <X className="w-4 h-4 text-gray-600" />
            ) : (
              <Edit className="w-4 h-4 text-gray-600" />
            )}
          </button>
        }
      >
        <div className="text-center py-6 text-gray-500">
          No overrides set. Click "Add Override" to create one.
        </div>
      </CardWrapper>

      {/* Upgrade Roles */}
      <CardWrapper
        title="Upgrade Roles"
        variant="default"
        showLabel={true}
        actions={
          <button
            onClick={() => toggleCardEdit('upgradeRoles')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            {editingCard === 'upgradeRoles' ? (
              <X className="w-4 h-4 text-gray-600" />
            ) : (
              <Edit className="w-4 h-4 text-gray-600" />
            )}
          </button>
        }
      >
        <div className="text-center py-6 text-gray-500">
          No upgrade roles defined. Click "Add Upgrade Role" to create one.
        </div>
      </CardWrapper>

      {/* Custom days */}
      <CardWrapper
        title="Custom days"
        variant="default"
        showLabel={true}
        actions={
          <>
            <button
              onClick={() => toggleCardEdit('customDays')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              {editingCard === 'customDays' ? (
                <X className="w-4 h-4 text-gray-600" />
              ) : (
                <Edit className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={addCustomDay}
              className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
            >
              <Plus className="w-3 h-3" />
              Add custom day type
            </button>
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Day type</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Paid as</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Daily rate %</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Holiday pay</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">6th and 7th days</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Pay allowances?</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Show to crew?</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customDays.map((day) => (
                <tr key={day.id} className="border-b border-gray-100">
                  <td className="py-2 text-sm">{day.type}</td>
                  <td className="py-2 text-sm">{day.paidAs}</td>
                  <td className="py-2 text-sm">{day.dailyRate}</td>
                  <td className="py-2 text-sm">{day.holidayPay}</td>
                  <td className="py-2 text-sm">{day.sixthSeventh}</td>
                  <td className="py-2 text-sm">{day.payAllowances}</td>
                  <td className="py-2 text-sm">{day.showToCrew}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCustomDay(day.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardWrapper>

      {/* Custom documents */}
      <CardWrapper
        title="Custom documents"
        variant="default"
        showLabel={true}
        actions={
          <button
            onClick={() => toggleCardEdit('customDocuments')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            {editingCard === 'customDocuments' ? (
              <X className="w-4 h-4 text-gray-600" />
            ) : (
              <Edit className="w-4 h-4 text-gray-600" />
            )}
          </button>
        }
      >
      </CardWrapper>

      {/* Custom fields */}
      <CardWrapper
        title="Custom fields"
        variant="default"
        showLabel={true}
        actions={
          <>
            <button
              onClick={() => toggleCardEdit('customFields')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              {editingCard === 'customFields' ? (
                <X className="w-4 h-4 text-gray-600" />
              ) : (
                <Edit className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={addCustomField}
              className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
            >
              <Plus className="w-3 h-3" />
              Add custom field
            </button>
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Name</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Value</th>
                <th className="text-left text-xs font-medium text-gray-700 pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customFields.map((field) => (
                <tr key={field.id} className="border-b border-gray-100">
                  <td className="py-2 text-sm">{field.name}</td>
                  <td className="py-2 text-sm text-gray-600">{field.value}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardWrapper>
      </div>
      )}
    </div>
  );
};

export default ProjectTimesheet;