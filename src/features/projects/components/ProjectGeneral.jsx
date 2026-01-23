// ProjectGeneral.jsx
import { useState } from 'react';
import { Info, Plus, Minus } from 'lucide-react';
import EditableTextDataField from "../../../shared/components/wrappers/EditableTextDataField";
import EditableCheckboxField from "../../../shared/components/wrappers/EditableCheckboxField";
import CardWrapper from "../../../shared/components/wrappers/CardWrapper";

// Button Toggle Component
const ButtonToggleGroup = ({ label, options, selected, onChange, showInfo = false }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {showInfo && <Info className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {showInfo && <Info className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-purple-300 text-purple-600 hover:bg-purple-50 transition-all"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center flex-1"
        />
        <button
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-purple-300 text-purple-600 hover:bg-purple-50 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ProjectGeneral = () => {
  const [formData, setFormData] = useState({
    holidayPayPercentage: '12.07%',
    differentHolidayForDailies: false,
    withholdHolidayPay6th7th: false,
    withholdHolidayPayOvertime: false,
    showWeeklyRateInOfferView: true,
    showWeeklyRateInDocuments: true,
    defaultWorkingHours: 11,
    offerEndDate: 'Optional',
    prepStart: '',
    prepEnd: '',
    shootStart: '29-09-2025',
    shootEnd: '11-02-2025',
    shootDurationDays: 74,
    hiatus1Start: '',
    hiatus1End: '',
    postProductionStart: '',
    postProductionEnd: ''
  });

  const [hiatuses, setHiatuses] = useState([
    { id: 1, start: '', end: '' }
  ]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addHiatus = () => {
    setHiatuses([...hiatuses, { id: hiatuses.length + 1, start: '', end: '' }]);
  };

  const holidayPayOptions = [
    { value: '0%', label: '0%' },
    { value: '10.77%', label: '10.77%' },
    { value: '12.07%', label: '12.07%' }
  ];

  const offerEndDateOptions = [
    { value: 'Optional', label: 'Optional' },
    { value: 'Mandatory', label: 'Mandatory' }
  ];

  return (
    <div className="space-y-6">
      {/* Holiday Pay */}
      <CardWrapper 
        title="Holiday Pay" 
        variant="default"
        showLabel={true}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
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
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Withhold holiday pay on</label>
              <div className="space-y-2">
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

      {/* Weekly Rate Display */}
      <CardWrapper 
        title="Weekly Rate Display" 
        variant="default"
        showLabel={true}
      >
        <div className="flex flex-col gap-2">
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

      {/* Working Hours */}
      <CardWrapper 
        title="Working Hours" 
        variant="default"
        showLabel={true}
      >
        <EditableTextDataField
          label="Default standard working hours"
          value={formData.defaultWorkingHours}
          onChange={(val) => updateField('defaultWorkingHours', val)}
          isEditing={true}
          placeholder="11 hours"
        />
        <p className="text-sm text-gray-500">Excluding lunch.</p>
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

      {/* Overall dates */}
      <CardWrapper 
        title="Overall dates" 
        variant="default"
        showLabel={true}
      >
        {/* Row 1: Prep start, Prep end, Shoot start */}
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
          <EditableTextDataField
            label="Shoot start"
            value={formData.shootStart}
            onChange={(val) => updateField('shootStart', val)}
            isEditing={true}
            placeholder="29-09-2025"
          />
        </div>

        {/* Row 2: Shoot end, Shoot duration days */}
        <div className="grid grid-cols-2 gap-4">
          <EditableTextDataField
            label="Shoot end"
            value={formData.shootEnd}
            onChange={(val) => updateField('shootEnd', val)}
            isEditing={true}
            placeholder="11-02-2025"
          />
          <NumberInputWithControls
            label="Shoot duration days"
            value={formData.shootDurationDays}
            onChange={(val) => updateField('shootDurationDays', val)}
            showInfo={true}
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
            className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Hiatus
          </button>
        }
      >
        <div className="space-y-4">
          {hiatuses.map((hiatus, index) => (
            <div key={hiatus.id} className="grid grid-cols-2 gap-4">
              <EditableTextDataField
                label={`Hiatus ${index + 1} start`}
                value={hiatus.start}
                onChange={(val) => {
                  const newHiatuses = [...hiatuses];
                  newHiatuses[index].start = val;
                  setHiatuses(newHiatuses);
                }}
                isEditing={true}
                placeholder="dd-mm-yyyy"
              />
              <EditableTextDataField
                label={`Hiatus ${index + 1} end`}
                value={hiatus.end}
                onChange={(val) => {
                  const newHiatuses = [...hiatuses];
                  newHiatuses[index].end = val;
                  setHiatuses(newHiatuses);
                }}
                isEditing={true}
                placeholder="dd-mm-yyyy"
              />
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
        <div className="grid grid-cols-2 gap-4">
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
  );
};

export default ProjectGeneral;