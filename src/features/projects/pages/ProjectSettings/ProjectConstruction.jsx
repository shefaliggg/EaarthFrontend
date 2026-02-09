// ProjectConstruction.jsx
import { useState } from 'react';
import { Info, Edit, Save, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import EditableSelectField from "../../../../shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "../../../../shared/components/wrappers/EditableCheckboxField";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";

// Radio Button Group Component
const RadioButtonGroup = ({ label, options, selected, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
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

// Toggle Switch Component
const ToggleSwitch = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between py-1">
      <label className="text-sm text-gray-700">{label}</label>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
      </label>
    </div>
  );
};

const ProjectConstruction = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Daily rate & hours
    usePactRate: 'Extract holiday pay from gross rate on Rate card',
    defaultWorkingHours: '10.5 hours',
    
    // Breaks
    unpaidBreaksDuration: '1 hour',
    
    // 6th day
    sixthDayRateCalculation: 'Multiply net daily by 4/3',
    sixthDayRateApply: 'Consecutive working days',
    sixthDayRatePayment: 'Daily',
    sixthDayHolidayPay: "Pay net, don't calculate holiday pay (per PACT/BECTU)",
    
    // 7th day
    seventhDayRateCalculation: 'Multiply net daily by 1.5',
    seventhDayRatePayment: 'Daily',
    seventhDayPayUnsocialHours: false,
    seventhDayHolidayPay: "Pay net, don't calculate holiday pay (per PACT/BECTU)",
    
    // Overtime
    overtimeRateCalculation: 'Multiply net hourly by 1.5',
    overtimeHolidayPay: "Pay net, don't calculate holiday pay (per PACT/BECTU)",
    overtimeCaps: 'Match PACT/BECTU Rate card',
    applyUnsocialHours: 'Per PACT/BECTU Agreement',
    
    // Travel time
    travelTimePaid: false,
    
    // Broken turnaround
    brokenTurnaroundPaid: false,
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Options for dropdowns
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

  const handleSave = () => {
    console.log("Saving construction settings...");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Title with Edit/Save/Cancel Buttons */}
      <div className="flex items-center justify-between bg-background border rounded-lg p-4 shadow-sm">
        <h2 className="text-base font-semibold">Project Construction</h2>
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
          {/* Travel time */}
          <CardWrapper 
            title="Travel time" 
            variant="default"
            showLabel={true}
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
            title="Broken turnaround" 
            variant="default"
            showLabel={true}
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

        {/* CENTER COLUMN (6/12) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Daily rate & hours */}
          <CardWrapper 
            title="Daily rate & hours" 
            variant="default"
            showLabel={true}
          >
            <div className="space-y-2">
              <EditableSelectField
                label="Use PACT/BECTU Rate card for Daily rate?"
                value={formData.usePactRate}
                items={pactRateOptions}
                onChange={(val) => updateField('usePactRate', val)}
                isEditing={isEditing}
              />
              
              <div className="flex flex-col gap-1">
                <EditableSelectField
                  label="Default standard working hours"
                  value={formData.defaultWorkingHours}
                  items={workingHoursOptions}
                  onChange={(val) => updateField('defaultWorkingHours', val)}
                  isEditing={isEditing}
                />
                <p className="text-xs text-gray-500">Excluding breaks.</p>
              </div>
            </div>
          </CardWrapper>

          {/* Breaks */}
          <CardWrapper 
            title="Breaks" 
            variant="default"
            showLabel={true}
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
                isEditing={isEditing}
              />
            </div>
          </CardWrapper>

          {/* 6th day */}
          <CardWrapper 
            title="6th day" 
            variant="default"
            showLabel={true}
          >
            <div className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <EditableSelectField
                  label="6th day rate calculation"
                  value={formData.sixthDayRateCalculation}
                  items={sixthDayCalculationOptions}
                  onChange={(val) => updateField('sixthDayRateCalculation', val)}
                  isEditing={isEditing}
                />
                
                <EditableSelectField
                  label="When does 6th day rate apply?"
                  value={formData.sixthDayRateApply}
                  items={whenApplyOptions}
                  onChange={(val) => updateField('sixthDayRateApply', val)}
                  isEditing={isEditing}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <EditableSelectField
                  label="6th day rate payment"
                  value={formData.sixthDayRatePayment}
                  items={paymentTypeOptions}
                  onChange={(val) => updateField('sixthDayRatePayment', val)}
                  isEditing={isEditing}
                />

                <EditableSelectField
                  label="Holiday pay application"
                  value={formData.sixthDayHolidayPay}
                  items={holidayPayOptions}
                  onChange={(val) => updateField('sixthDayHolidayPay', val)}
                  isEditing={isEditing}
                />
              </div>
            </div>
          </CardWrapper>

          {/* 7th day */}
          <CardWrapper 
            title="7th day" 
            variant="default"
            showLabel={true}
          >
            <div className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4 items-end">
                <EditableSelectField
                  label="7th day rate calculation"
                  value={formData.seventhDayRateCalculation}
                  items={seventhDayCalculationOptions}
                  onChange={(val) => updateField('seventhDayRateCalculation', val)}
                  isEditing={isEditing}
                />
                
                <div className="pb-2">
                  <EditableCheckboxField
                    label="Pay Unsocial Hours 2 for all hours worked on 7th day?"
                    checked={formData.seventhDayPayUnsocialHours}
                    onChange={(val) => updateField('seventhDayPayUnsocialHours', val)}
                    isEditing={isEditing}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <EditableSelectField
                  label="7th day rate payment"
                  value={formData.seventhDayRatePayment}
                  items={paymentTypeOptions}
                  onChange={(val) => updateField('seventhDayRatePayment', val)}
                  isEditing={isEditing}
                />

                <EditableSelectField
                  label="Holiday pay application"
                  value={formData.seventhDayHolidayPay}
                  items={holidayPayOptions}
                  onChange={(val) => updateField('seventhDayHolidayPay', val)}
                  isEditing={isEditing}
                />
              </div>
            </div>
          </CardWrapper>

          {/* Overtime */}
          <CardWrapper 
            title="Overtime" 
            variant="default"
            showLabel={true}
          >
            <div className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <EditableSelectField
                  label="O/T rate calculation"
                  value={formData.overtimeRateCalculation}
                  items={overtimeCalculationOptions}
                  onChange={(val) => updateField('overtimeRateCalculation', val)}
                  isEditing={isEditing}
                />
                
                <EditableSelectField
                  label="O/T caps"
                  value={formData.overtimeCaps}
                  items={overtimeCapsOptions}
                  onChange={(val) => updateField('overtimeCaps', val)}
                  isEditing={isEditing}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <EditableSelectField
                  label="Holiday pay application"
                  value={formData.overtimeHolidayPay}
                  items={holidayPayOptions}
                  onChange={(val) => updateField('overtimeHolidayPay', val)}
                  isEditing={isEditing}
                />
                
                <EditableSelectField
                  label="Apply unsocial hours"
                  value={formData.applyUnsocialHours}
                  items={unsocialHoursOptions}
                  onChange={(val) => updateField('applyUnsocialHours', val)}
                  isEditing={isEditing}
                />
              </div>
            </div>
          </CardWrapper>
        </div>

        {/* RIGHT COLUMN (3/12) */}
        <div className="lg:col-span-3 space-y-4">
        </div>
      </div>
    </div>
  );
};

export default ProjectConstruction;