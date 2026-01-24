// ProjectOnboarding.jsx
import { useState } from 'react';
import { Info } from 'lucide-react';
import EditableTextDataField from "../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../shared/components/wrappers/EditableSelectField";
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

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-purple-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

const ProjectOnboarding = () => {
  const [formData, setFormData] = useState({
    offerEndDate: 'Optional',
    shareStatusDetermination: true,
    taxStatusHandling: 'Accounts approver required for self-employed or loan out',
    taxStatusQueryEmail: 'stuntysturant@icloud.com',
    offerApproval: 'Production > Accounts'
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const offerEndDateOptions = [
    { value: 'Optional', label: 'Optional' },
    { value: 'Mandatory', label: 'Mandatory' }
  ];

  const taxStatusHandlingOptions = [
    { value: 'Accounts approver required for self-employed or loan out', label: 'Accounts approver required for self-employed or loan out' },
    { value: 'Other option 1', label: 'Other option 1' },
    { value: 'Other option 2', label: 'Other option 2' }
  ];

  const offerApprovalOptions = [
    { value: 'Production > Accounts', label: 'Production > Accounts' },
    { value: 'Accounts > Production', label: 'Accounts > Production' },
    { value: 'Direct approval', label: 'Direct approval' }
  ];

  return (
    <div className="space-y-6">
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

      {/* Offer handling */}
      <CardWrapper 
        title="Offer handling" 
        variant="default"
        showLabel={true}
        description="How you'd like offers to be reviewed prior to sending to crew."
      >
        <div className="space-y-6">
          {/* Share status determination with crew members */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Share status determination with crew members?
              </label>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <ToggleSwitch
              checked={formData.shareStatusDetermination}
              onChange={(val) => updateField('shareStatusDetermination', val)}
            />
          </div>

          {/* Tax status handling */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Tax status handling</label>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <EditableSelectField
              value={formData.taxStatusHandling}
              items={taxStatusHandlingOptions.map(opt => ({ value: opt.value, label: opt.label }))}
              isEditing={true}
              onChange={(val) => updateField('taxStatusHandling', val)}
            />
            <p className="text-xs text-gray-500">
              Available options are based on your 'Share status determination with crew members?' selection.
            </p>
          </div>

          {/* Tax status query email */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Tax status query email</label>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <EditableTextDataField
              value={formData.taxStatusQueryEmail}
              onChange={(val) => updateField('taxStatusQueryEmail', val)}
              isEditing={true}
              placeholder="stuntysturant@icloud.com"
            />
          </div>

          {/* Offer approval */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Offer approval</label>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <EditableSelectField
              value={formData.offerApproval}
              items={offerApprovalOptions.map(opt => ({ value: opt.value, label: opt.label }))}
              isEditing={true}
              onChange={(val) => updateField('offerApproval', val)}
            />
            <p className="text-xs text-gray-500">
              Available options are based on your 'Tax status handling' selection.
            </p>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
};

export default ProjectOnboarding;