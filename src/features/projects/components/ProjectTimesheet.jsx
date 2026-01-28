// ProjectTimesheet.jsx
import { useState } from 'react';
import { Info, Plus, Trash2, Edit } from 'lucide-react';
import EditableTextDataField from "../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "../../../shared/components/wrappers/EditableCheckboxField";
import CardWrapper from "../../../shared/components/wrappers/CardWrapper";

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
  const [formData, setFormData] = useState({
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Configure timecard settings for your project</h1>
        </div>
        <button className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all">
          Update timecard settings
        </button>
      </div>

      {/* Payroll company */}
      <CardWrapper title="" variant="default" showLabel={false}>
        <div className="space-y-4">
          <EditableSelectField
            label="Payroll company"
            value={formData.payrollCompany}
            items={payrollCompanyOptions}
            isEditing={true}
            onChange={(val) => updateField('payrollCompany', val)}
          />

          <div className="flex items-center gap-2">
            <EditableSelectField
              label="Crew Data CSV export layout"
              value={formData.crewDataCSVExport}
              items={csvExportOptions}
              isEditing={true}
              onChange={(val) => updateField('crewDataCSVExport', val)}
            />
            <span className="text-xs text-gray-500 mt-6">(Optional)</span>
            <Info className="w-4 h-4 text-gray-400 mt-6" />
          </div>

          <div className="flex items-center gap-2">
            <EditableSelectField
              label="Payroll CSV export layout"
              value={formData.payrollCSVExport}
              items={csvExportOptions}
              isEditing={true}
              onChange={(val) => updateField('payrollCSVExport', val)}
            />
            <span className="text-xs text-gray-500 mt-6">(Optional)</span>
            <Info className="w-4 h-4 text-gray-400 mt-6" />
          </div>
        </div>
      </CardWrapper>

      {/* Timecards */}
      <CardWrapper title="Timecards" variant="default" showLabel={true}>
        <div className="grid grid-cols-2 gap-4">
          <EditableTextDataField
            label="Timecards active from"
            value={formData.timecardsActiveFrom}
            onChange={(val) => updateField('timecardsActiveFrom', val)}
            isEditing={true}
            placeholder="Mon"
          />
          <EditableSelectField
            label="Week ending day"
            value={formData.weekEndingDay}
            items={weekDayOptions}
            isEditing={true}
            onChange={(val) => updateField('weekEndingDay', val)}
          />
        </div>
      </CardWrapper>

      {/* Scheduled tasks */}
      <CardWrapper
        title="Scheduled tasks"
        variant="default"
        showLabel={true}
        description="Reminder and deadline notifications sent to crew."
      >
        <div className="space-y-6">
          {/* Crew reminder */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Crew reminder</h4>
            <div className="grid grid-cols-2 gap-4">
              <EditableSelectField
                label="Crew reminder day"
                value={formData.crewReminderDay}
                items={weekDayOptions}
                isEditing={true}
                onChange={(val) => updateField('crewReminderDay', val)}
              />
              <EditableSelectField
                label="Crew reminder time"
                value={formData.crewReminderTime}
                items={timeOptions}
                isEditing={true}
                onChange={(val) => updateField('crewReminderTime', val)}
              />
            </div>
          </div>

          {/* Crew submission deadline */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Crew submission deadline</h4>
            <div className="grid grid-cols-2 gap-4">
              <EditableSelectField
                label="Crew submission day"
                value={formData.crewSubmissionDay}
                items={weekDayOptions}
                isEditing={true}
                onChange={(val) => updateField('crewSubmissionDay', val)}
              />
              <EditableSelectField
                label="Crew submission time"
                value={formData.crewSubmissionTime}
                items={timeOptions}
                isEditing={true}
                onChange={(val) => updateField('crewSubmissionTime', val)}
              />
            </div>
          </div>

          {/* Department reminder */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Department reminder</h4>
            <div className="grid grid-cols-2 gap-4">
              <EditableSelectField
                label="Department reminder day"
                value={formData.departmentReminderDay}
                items={weekDayOptions}
                isEditing={true}
                onChange={(val) => updateField('departmentReminderDay', val)}
              />
              <EditableSelectField
                label="Department reminder time"
                value={formData.departmentReminderTime}
                items={timeOptions}
                isEditing={true}
                onChange={(val) => updateField('departmentReminderTime', val)}
              />
            </div>
          </div>

          {/* Department approval deadline */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Department approval deadline</h4>
            <div className="grid grid-cols-2 gap-4">
              <EditableSelectField
                label="Department approval deadline day"
                value={formData.departmentApprovalDay}
                items={weekDayOptions}
                isEditing={true}
                onChange={(val) => updateField('departmentApprovalDay', val)}
              />
              <EditableSelectField
                label="Department approval deadline time"
                value={formData.departmentApprovalTime}
                items={timeOptions}
                isEditing={true}
                onChange={(val) => updateField('departmentApprovalTime', val)}
              />
            </div>
          </div>
        </div>
      </CardWrapper>

      {/* Working hours */}
      <CardWrapper
        title="Working hours"
        variant="default"
        showLabel={true}
        description="The variations of your standard working hours. Selections will be made available in the Calendar."
      >
        <div className="grid grid-cols-3 gap-6">
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

      {/* Project places */}
      <CardWrapper
        title="Project places"
        variant="default"
        showLabel={true}
        description="Groups & areas in which your crew might work."
        actions={
          <button
            onClick={addPlace}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add new place
          </button>
        }
      >
        <div className="space-y-6">
          {/* Units */}
          <div>
            <div className="flex items-center gap-2 mb-3">
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
                      <td className="py-3 text-sm">{unit.name}</td>
                      <td className="py-3 text-sm text-gray-600">{unit.dates}</td>
                      <td className="py-3 text-right">
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
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Regular places</h4>
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
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Nearby bases</h4>
            <div className="space-y-2">
              {projectPlaces.nearbyBases.map((base, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
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

      {/* Department defaults */}
      <CardWrapper
        title="Department defaults"
        variant="default"
        showLabel={true}
        description="Default overtime settings per department and regular site."
        actions={
          <button
            onClick={addDepartmentDefault}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add department default
          </button>
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
                  <td className="py-3 text-sm">{dept.department}</td>
                  <td className="py-3 text-sm">{dept.regularStartFinish}</td>
                  <td className="py-3 text-sm">{dept.cameraOvertime}</td>
                  <td className="py-3 text-sm">{dept.otherOvertime}</td>
                  <td className="py-3 text-sm">{dept.minutesBefore}</td>
                  <td className="py-3 text-sm">{dept.minutesAfter}</td>
                  <td className="py-3 text-right">
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

      {/* Rules */}
      <CardWrapper title="Rules" variant="default" showLabel={true}>
        <div className="space-y-6">
          {/* Calculate broken turnaround for dailies */}
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

          <EditableCheckboxField
            label="Use 'Official rest days' in calendar"
            checked={formData.useOfficialRestDays}
            onChange={(val) => updateField('useOfficialRestDays', val)}
            isEditing={true}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <EditableSelectField
                label="1 rest day turnaround period"
                value={formData.restDay1Turnaround}
                items={turnaroundOptions}
                isEditing={true}
                onChange={(val) => updateField('restDay1Turnaround', val)}
              />
              <Info className="w-4 h-4 text-gray-400 mt-6" />
            </div>
            <div className="flex items-center gap-2">
              <EditableSelectField
                label="2 rest day turnaround period"
                value={formData.restDay2Turnaround}
                items={turnaroundOptions}
                isEditing={true}
                onChange={(val) => updateField('restDay2Turnaround', val)}
              />
              <Info className="w-4 h-4 text-gray-400 mt-6" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
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
            </div>

            {/* Right Column */}
            <div className="space-y-6">
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
        </div>
      </CardWrapper>

      {/* Preferences */}
      <CardWrapper title="Preferences" variant="default" showLabel={true}>
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
            isEditing={true}
          />

          <div>
            <EditableCheckboxField
              label="Only apply pre and post overtime for Transport department specific offers"
              checked={formData.onlyPrePostTransport}
              onChange={(val) => updateField('onlyPrePostTransport', val)}
              isEditing={true}
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

      {/* Roundings */}
      <CardWrapper title="Roundings" variant="default" showLabel={true}>
        <div className="grid grid-cols-2 gap-4">
          <EditableSelectField
            label="Camera overtime rounding"
            value={formData.cameraOvertimeRounding}
            items={roundingOptions}
            isEditing={true}
            onChange={(val) => updateField('cameraOvertimeRounding', val)}
          />
          <EditableSelectField
            label="Other overtime rounding"
            value={formData.otherOvertimeRounding}
            items={roundingOptions}
            isEditing={true}
            onChange={(val) => updateField('otherOvertimeRounding', val)}
          />
        </div>
      </CardWrapper>

      {/* Allowances */}
      <CardWrapper
        title="Allowances"
        variant="default"
        showLabel={true}
        description="Allowances to be paid when Public Holiday is not worked."
      >
        <div className="grid grid-cols-3 gap-4">
          <EditableCheckboxField
            label="Box"
            checked={allowances.box}
            onChange={(val) => setAllowances(prev => ({ ...prev, box: val }))}
            isEditing={true}
          />
          <EditableCheckboxField
            label="Computer"
            checked={allowances.computer}
            onChange={(val) => setAllowances(prev => ({ ...prev, computer: val }))}
            isEditing={true}
          />
          <EditableCheckboxField
            label="Equipment"
            checked={allowances.equipment}
            onChange={(val) => setAllowances(prev => ({ ...prev, equipment: val }))}
            isEditing={true}
          />
          <EditableCheckboxField
            label="Mobile"
            checked={allowances.mobile}
            onChange={(val) => setAllowances(prev => ({ ...prev, mobile: val }))}
            isEditing={true}
          />
          <EditableCheckboxField
            label="Software"
            checked={allowances.software}
            onChange={(val) => setAllowances(prev => ({ ...prev, software: val }))}
            isEditing={true}
          />
          <EditableCheckboxField
            label="Vehicle"
            checked={allowances.vehicle}
            onChange={(val) => setAllowances(prev => ({ ...prev, vehicle: val }))}
            isEditing={true}
          />
        </div>
      </CardWrapper>

      {/* Daily Allowances / Overrides */}
      <CardWrapper
        title="Daily Allowances / Overrides"
        variant="default"
        showLabel={true}
        description="Set specific values for any field (Mileage, Travel, Per Diem, etc.) for selected crew on specific days."
        actions={
          <button className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all">
            <Plus className="w-4 h-4" />
            Add Override
          </button>
        }
      >
        <div className="text-center py-8 text-gray-500">
          No overrides set. Click "Add Override" to create one.
        </div>
      </CardWrapper>

      {/* Upgrade Roles */}
      <CardWrapper
        title="Upgrade Roles"
        variant="default"
        showLabel={true}
        description="Define available upgrade roles and their default daily rates."
        actions={
          <button className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-all">
            <Plus className="w-4 h-4" />
            Add Upgrade Role
          </button>
        }
      >
        <div className="text-center py-8 text-gray-500">
          No upgrade roles defined. Click "Add Upgrade Role" to create one.
        </div>
      </CardWrapper>

      {/* Custom days */}
      <CardWrapper
        title="Custom days"
        variant="default"
        showLabel={true}
        actions={
          <button
            onClick={addCustomDay}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add custom day type
          </button>
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
                  <td className="py-3 text-sm">{day.type}</td>
                  <td className="py-3 text-sm">{day.paidAs}</td>
                  <td className="py-3 text-sm">{day.dailyRate}</td>
                  <td className="py-3 text-sm">{day.holidayPay}</td>
                  <td className="py-3 text-sm">{day.sixthSeventh}</td>
                  <td className="py-3 text-sm">{day.payAllowances}</td>
                  <td className="py-3 text-sm">{day.showToCrew}</td>
                  <td className="py-3">
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
        description={
          <span>
            To add or remove custom documents,{' '}
            <a href="#" className="text-purple-600 hover:text-purple-800">please contact Team Engine</a>
          </span>
        }
      >
      </CardWrapper>

      {/* Custom fields */}
      <CardWrapper
        title="Custom fields"
        variant="default"
        showLabel={true}
        description="Create custom fields for basic pay, overtime, or allowance categories"
        actions={
          <button
            onClick={addCustomField}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add custom field
          </button>
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
                  <td className="py-3 text-sm">{field.name}</td>
                  <td className="py-3 text-sm text-gray-600">{field.value}</td>
                  <td className="py-3">
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

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all">
          Update timecard settings
        </button>
      </div>
    </div>
  );
};

export default ProjectTimesheet;