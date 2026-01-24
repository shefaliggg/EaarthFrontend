import { useState } from 'react';
import { Info } from 'lucide-react';
import EditableTextDataField from "../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "../../../shared/components/wrappers/EditableCheckboxField";
import CardWrapper from "../../../shared/components/wrappers/CardWrapper";
import { Stepper } from '../../../shared/components/stepper/Stepper';
import { CardNavigator } from '../../../shared/components/stepper/CardNavigator';
import { ProjectApplications } from '../components/ProjectApplications';

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
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              selected === option
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

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
              name={label}
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

// Currency Input Component
const CurrencyInput = ({ label, currency, amount, onCurrencyChange, onAmountChange, required = false }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex gap-2">
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="INR">INR</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
        />
      </div>
    </div>
  );
};

const ProjectDetails = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    projectName: '',
    productionCompany: '',
    genre: '',
    primaryLocation: '',
    startDate: '',
    endDate: '',
    projectDescription: '',
    projectType: 'Feature Film',
    showProjectTypeInOffers: true,
    legalTerritory: 'United Kingdom',
    unionAgreement: 'PACT/BECTU Agreement (2021)',
    constructionUnionAgreement: 'None',
    budget: 'Major (over £30 million)',
    showBudgetToCrew: false,
    budgetCurrency: 'GBP',
    budgetAmount: '',
    producer: '',
    director: '',
    productionManager: '',
    selectedApplications: []
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const budgetOptions = [
    { value: 'Major (over £30 million)', label: 'Major (over £30 million)' },
    { value: 'Medium (£10-30 million)', label: 'Medium (£10-30 million)' },
    { value: 'Low (under £10 million)', label: 'Low (under £10 million)' }
  ];

  const steps = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'config', label: 'Project Configuration' },
    { id: 'financial', label: 'Financial & Personnel' },
    { id: 'applications', label: 'Project Applications' }
  ];

  // Validation logic
  const canProceed = () => {
    switch (step) {
      case 0:
        return formData.projectName.trim() && formData.productionCompany.trim();
      case 1:
        return formData.projectType && formData.legalTerritory;
      case 2:
        return formData.budgetAmount && parseFloat(formData.budgetAmount) > 0;
      case 3:
        return true; // Applications are optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      setStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  const handleFinish = () => {
    if (canProceed() && onComplete) {
      onComplete(formData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Stepper steps={steps} activeStep={step} />

      <div className="min-h-[calc(100vh-300px)] flex flex-col justify-between mt-6">
        <div className="flex-1">
          <div
            key={step}
            className="animate-in fade-in slide-in-from-right-4 duration-200"
          >
            {/* Step 0: Basic Information */}
            {step === 0 && (
              <CardWrapper title="Basic Information" variant="default" showLabel={true}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <EditableTextDataField
                      label="Project Name"
                      value={formData.projectName}
                      onChange={(val) => updateField('projectName', val)}
                      isEditing={true}
                      placeholder="Enter project name"
                      required={true}
                    />
                    <EditableTextDataField
                      label="Production Company"
                      value={formData.productionCompany}
                      onChange={(val) => updateField('productionCompany', val)}
                      isEditing={true}
                      placeholder="Enter production company"
                      required={true}
                    />
                    <EditableTextDataField
                      label="Genre"
                      value={formData.genre}
                      onChange={(val) => updateField('genre', val)}
                      isEditing={true}
                      placeholder="e.g., Drama, Action"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <EditableTextDataField
                      label="Primary Location"
                      value={formData.primaryLocation}
                      onChange={(val) => updateField('primaryLocation', val)}
                      isEditing={true}
                      placeholder="City, Country"
                    />
                    <EditableTextDataField
                      label="Start Date"
                      value={formData.startDate}
                      onChange={(val) => updateField('startDate', val)}
                      isEditing={true}
                      placeholder="dd-mm-yyyy"
                      type="date"
                    />
                    <EditableTextDataField
                      label="End Date"
                      value={formData.endDate}
                      onChange={(val) => updateField('endDate', val)}
                      isEditing={true}
                      placeholder="dd-mm-yyyy"
                      type="date"
                    />
                  </div>

                  <EditableTextDataField
                    label="Project Description"
                    value={formData.projectDescription}
                    onChange={(val) => updateField('projectDescription', val)}
                    isEditing={true}
                    multiline={true}
                    placeholder="Enter project description..."
                  />
                </div>
              </CardWrapper>
            )}

            {/* Step 1: Project Configuration */}
            {step === 1 && (
              <CardWrapper title="Project Configuration" variant="default" showLabel={true}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <ButtonToggleGroup
                      label="Project type"
                      options={['Feature Film', 'Television']}
                      selected={formData.projectType}
                      onChange={(val) => updateField('projectType', val)}
                      showInfo={true}
                    />

                    <EditableCheckboxField
                      label="Show project type in offers?"
                      checked={formData.showProjectTypeInOffers}
                      onChange={(val) => updateField('showProjectTypeInOffers', val)}
                      isEditing={true}
                    />

                    <EditableSelectField
                      label="Budget Range"
                      value={formData.budget}
                      items={budgetOptions}
                      isEditing={true}
                      onChange={(val) => updateField('budget', val)}
                    />

                    <EditableCheckboxField
                      label="Show budget level to crew members?"
                      checked={formData.showBudgetToCrew}
                      onChange={(val) => updateField('showBudgetToCrew', val)}
                      isEditing={true}
                    />
                  </div>

                  <div className="space-y-6">
                    <ButtonToggleGroup
                      label="Legal territory"
                      options={['United Kingdom', 'Iceland', 'Ireland', 'Malta']}
                      selected={formData.legalTerritory}
                      onChange={(val) => updateField('legalTerritory', val)}
                    />

                    <RadioGroup
                      label="Union agreement"
                      options={[
                        { value: 'None', label: 'None' },
                        { value: 'PACT/BECTU Agreement (2021)', label: 'PACT/BECTU Agreement (2021)' }
                      ]}
                      selected={formData.unionAgreement}
                      onChange={(val) => updateField('unionAgreement', val)}
                      showInfo={true}
                    />

                    <RadioGroup
                      label="Construction union agreement"
                      options={[
                        { value: 'None', label: 'None' },
                        { value: 'PACT/BECTU Agreement', label: 'PACT/BECTU Agreement' },
                        { value: 'Custom Agreement', label: 'Custom Agreement' }
                      ]}
                      selected={formData.constructionUnionAgreement}
                      onChange={(val) => updateField('constructionUnionAgreement', val)}
                    />
                  </div>
                </div>
              </CardWrapper>
            )}

            {/* Step 2: Financial & Key Personnel */}
            {step === 2 && (
              <CardWrapper title="Financial Details & Key Personnel" variant="default" showLabel={true}>
                <div className="space-y-6">
                  {/* Financial Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Budget Information</h4>
                    <CurrencyInput
                      label="Budget Amount"
                      currency={formData.budgetCurrency}
                      amount={formData.budgetAmount}
                      onCurrencyChange={(val) => updateField('budgetCurrency', val)}
                      onAmountChange={(val) => updateField('budgetAmount', val)}
                      required={true}
                    />
                  </div>

                  {/* Key Personnel Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Key Personnel</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <EditableTextDataField
                        label="Producer"
                        value={formData.producer}
                        onChange={(val) => updateField('producer', val)}
                        isEditing={true}
                        placeholder="Enter producer name"
                      />
                      <EditableTextDataField
                        label="Director"
                        value={formData.director}
                        onChange={(val) => updateField('director', val)}
                        isEditing={true}
                        placeholder="Enter director name"
                      />
                      <EditableTextDataField
                        label="Production Manager"
                        value={formData.productionManager}
                        onChange={(val) => updateField('productionManager', val)}
                        isEditing={true}
                        placeholder="Enter production manager"
                      />
                    </div>
                  </div>
                </div>
              </CardWrapper>
            )}

            {/* Step 3: Project Applications */}
            {step === 3 && (
              <CardWrapper title="Project Applications" variant="default" showLabel={true}>
                <ProjectApplications
                  selectedApps={formData.selectedApplications}
                  onChange={(apps) => updateField('selectedApplications', apps)}
                />
              </CardWrapper>
            )}
          </div>
        </div>

        <div className="py-4 mt-6">
          <CardNavigator
            currentStep={step}
            totalSteps={steps.length}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinish}
            canProceed={canProceed()}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;