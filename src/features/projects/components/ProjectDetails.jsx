
import { useState } from 'react';
import { Info } from 'lucide-react';
import EditableTextDataField from "../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "../../../shared/components/wrappers/EditableCheckboxField";
import CardWrapper from "../../../shared/components/wrappers/CardWrapper";

// Button Toggle Component for Project Type and Legal Territory
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
const CurrencyInput = ({ label, currency, amount, onCurrencyChange, onAmountChange }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.00"
          className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
        />
      </div>
    </div>
  );
};

const ProjectDetails = () => {
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
    budgetCurrency: 'USD',
    budgetAmount: '0.00',
    producer: '',
    director: '',
    productionManager: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const budgetOptions = [
    { value: 'Major (over £30 million)', label: 'Major (over £30 million)' },
    { value: 'Medium (£10-30 million)', label: 'Medium (£10-30 million)' },
    { value: 'Low (under £10 million)', label: 'Low (under £10 million)' }
  ];

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <CardWrapper 
        title="Basic Information" 
        variant="default"
        showLabel={true}
      >
        {/* Row 1: Project Name, Production Company, Genre */}
        <div className="grid grid-cols-3 gap-4">
          <EditableTextDataField
            label="Project Name"
            value={formData.projectName}
            onChange={(val) => updateField('projectName', val)}
            isEditing={true}
            placeholder="Enter project name"
          />
          <EditableTextDataField
            label="Production Company"
            value={formData.productionCompany}
            onChange={(val) => updateField('productionCompany', val)}
            isEditing={true}
            placeholder="Enter production company"
          />
          <EditableTextDataField
            label="Genre"
            value={formData.genre}
            onChange={(val) => updateField('genre', val)}
            isEditing={true}
            placeholder="e.g., Drama, Action, Comedy"
          />
        </div>

        {/* Row 2: Primary Location, Start Date, End Date */}
        <div className="grid grid-cols-3 gap-4">
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
          />
          <EditableTextDataField
            label="End Date"
            value={formData.endDate}
            onChange={(val) => updateField('endDate', val)}
            isEditing={true}
            placeholder="dd-mm-yyyy"
          />
        </div>

        {/* Row 3: Project Description - Full Width */}
        <EditableTextDataField
          label="Project Description"
          value={formData.projectDescription}
          onChange={(val) => updateField('projectDescription', val)}
          isEditing={true}
          multiline={true}
          placeholder="Enter project description..."
        />
      </CardWrapper>

      {/* Project Configuration */}
      <CardWrapper 
        title="Project Configuration" 
        variant="default"
        showLabel={true}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
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
              label="Budget"
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

          {/* Right Column */}
          <div className="space-y-4">
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

      {/* Financial Details */}
      <CardWrapper 
        title="Financial Details" 
        variant="default"
        showLabel={true}
      >
        <CurrencyInput
          label="Budget Amount"
          currency={formData.budgetCurrency}
          amount={formData.budgetAmount}
          onCurrencyChange={(val) => updateField('budgetCurrency', val)}
          onAmountChange={(val) => updateField('budgetAmount', val)}
        />
      </CardWrapper>

      {/* Key Personnel */}
      <CardWrapper 
        title="Key Personnel" 
        variant="default"
        showLabel={true}
      >
        <div className="grid grid-cols-3 gap-4">
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
            placeholder="Enter production manager name"
          />
        </div>
      </CardWrapper>
    </div>
  );
};

export default ProjectDetails;