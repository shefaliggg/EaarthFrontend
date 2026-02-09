import { useState } from 'react';
import { Info } from 'lucide-react';
import EditableTextDataField from "../../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../../shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "../../../../shared/components/wrappers/EditableCheckboxField";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import { Stepper } from '../../../../shared/components/stepper/Stepper';
import { CardNavigator } from '../../../../shared/components/stepper/CardNavigator';
import { ProjectApplications } from '../../components/ProjectApplications';
import { OrderSummary } from '../../components/OrderSummary';

// Button Toggle Component
const ButtonToggleGroup = ({ label, options, selected, onChange, showInfo = false }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">{label}</label>
        {showInfo && <Info className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
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
        <label className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">{label}</label>
        {showInfo && <Info className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="flex flex-wrap gap-4">
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
    selectedApplications: [],
    packageTier: 'agency',
    billingPeriod: 'weekly',
    promoCode: '',
    financialController: {
      fullName: '',
      email: '',
      permission: false
    },
    productionManager: {
      fullName: '',
      email: '',
      permission: false
    },
    productionAdmin: {
      fullName: '',
      email: '',
      permission: false
    }
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
    { id: 'details', label: 'Project Details' },
    { id: 'applications', label: 'Project Applications' },
    { id: 'package', label: 'Select Package' },
    { id: 'order', label: 'Order Summary' }
  ];

  // Validation logic
  const canProceed = () => {
    switch (step) {
      case 0:
        return formData.projectName.trim() && formData.projectType && formData.legalTerritory;
      case 1:
        return true; // Applications are optional
      case 2:
        return formData.packageTier; // Package tier is required
      case 3:
        return true; // Order summary is final step
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
    <div className="max-w-5xl mx-auto px-4">
      <Stepper steps={steps} activeStep={step} />

      <div className="flex flex-col justify-between mt-4">
        <div className="flex-1">
          <div
            key={step}
            className="animate-in fade-in slide-in-from-right-4 duration-200"
          >
            {/* Step 0: Complete Project Details Form */}
            {step === 0 && (
              <CardWrapper title="Project Details" variant="default" showLabel={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <EditableTextDataField
                    label="Project Name"
                    value={formData.projectName}
                    onChange={(val) => updateField('projectName', val)}
                    isEditing={true}
                    placeholder="Project name"
                    required={true}
                  />

                  <EditableTextDataField
                    label="Genre"
                    value={formData.genre}
                    onChange={(val) => updateField('genre', val)}
                    isEditing={true}
                    placeholder="Drama, Action..."
                  />

                  <EditableTextDataField
                    label="Location"
                    value={formData.primaryLocation}
                    onChange={(val) => updateField('primaryLocation', val)}
                    isEditing={true}
                    placeholder="City, Country"
                  />

                  <div className="space-y-2">
                    <ButtonToggleGroup
                      label="Project Type"
                      options={['Feature Film', 'Television']}
                      selected={formData.projectType}
                      onChange={(val) => updateField('projectType', val)}
                      showInfo={true}
                    />
                  </div>

                  <EditableTextDataField
                    label="Start Date"
                    value={formData.startDate}
                    onChange={(val) => updateField('startDate', val)}
                    isEditing={true}
                    type="date"
                  />

                  <EditableTextDataField
                    label="End Date"
                    value={formData.endDate}
                    onChange={(val) => updateField('endDate', val)}
                    isEditing={true}
                    type="date"
                  />

                  <div className="md:col-span-2">
                    <EditableTextDataField
                      label="Description"
                      value={formData.projectDescription}
                      onChange={(val) => updateField('projectDescription', val)}
                      isEditing={true}
                      placeholder="Project description..."
                    />
                  </div>
                </div>
              </CardWrapper>
            )}

            {/* Step 1: Project Applications */}
            {step === 1 && (
              <CardWrapper title="Project Applications" variant="default" showLabel={true}>
                <ProjectApplications
                  selectedApps={formData.selectedApplications}
                  onChange={(apps) => updateField('selectedApplications', apps)}
                />
              </CardWrapper>
            )}

            {/* Step 2: Select Package Tier */}
            {step === 2 && (
              <CardWrapper title="Select Your Package Tier" variant="default" showLabel={true}>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-6">Choose the branding and features level that fits your needs</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Basic Package */}
                    <button
                      onClick={() => updateField('packageTier', 'basic')}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        formData.packageTier === 'basic'
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic</h3>
                      <p className="text-sm text-gray-600 mb-3">Basic Package</p>
                      <p className="text-sm text-gray-600 mb-4">Earth branding with limited access</p>
                      <p className="text-lg font-bold text-purple-600 mb-4">$20/week base</p>
                      <div className="space-y-2 text-sm text-gray-700 mb-4">
                        <p>🌍 Earth Branding</p>
                        <p>10GB Storage</p>
                        <p>Limited Access</p>
                        <p className="font-semibold mt-3">Includes:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>Earth Branding Only</li>
                          <li>10GB Cloud Storage</li>
                          <li>Limited App Access</li>
                          <li>Basic Features</li>
                          <li>Email Support</li>
                        </ul>
                      </div>
                      <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Select Basic Package
                      </button>
                    </button>

                    {/* Agency Package */}
                    <button
                      onClick={() => updateField('packageTier', 'agency')}
                      className={`p-6 rounded-lg border-2 transition-all relative ${
                        formData.packageTier === 'agency'
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Agency</h3>
                      <p className="text-sm text-gray-600 mb-3">Agency Package</p>
                      <p className="text-sm text-gray-600 mb-4">Earth + Project branding with more flexibility</p>
                      <p className="text-lg font-bold text-purple-600 mb-4">$40/week base</p>
                      <div className="space-y-2 text-sm text-gray-700 mb-4">
                        <p>🌍 Earth + 📁 Project Branding</p>
                        <p>100GB Storage</p>
                        <p>Full Access</p>
                        <p className="font-semibold mt-3">Includes:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>Earth Branding</li>
                          <li>Project-Level Branding</li>
                          <li>100GB Cloud Storage</li>
                          <li>Full App Access</li>
                          <li>Advanced Features</li>
                          <li>Priority Support</li>
                          <li>Custom Templates</li>
                        </ul>
                      </div>
                      <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                        Select Agency Package
                      </button>
                    </button>

                    {/* White Label Package */}
                    <button
                      onClick={() => updateField('packageTier', 'whitelabel')}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        formData.packageTier === 'whitelabel'
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">White Label</h3>
                      <p className="text-sm text-gray-600 mb-3">White Label Package</p>
                      <p className="text-sm text-gray-600 mb-4">Complete studio branding control</p>
                      <p className="text-lg font-bold text-purple-600 mb-4">$70/week base</p>
                      <div className="space-y-2 text-sm text-gray-700 mb-4">
                        <p>🎨 Your Studio Branding</p>
                        <p>Unlimited Storage</p>
                        <p>Complete Control</p>
                        <p className="font-semibold mt-3">Includes:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>Complete White Label</li>
                          <li>Your Studio Branding</li>
                          <li>Unlimited Storage</li>
                          <li>All Apps Included</li>
                          <li>Full API Access</li>
                          <li>Premium Support 24/7</li>
                          <li>Custom Domain</li>
                          <li>Remove All Earth Branding</li>
                          <li>Advanced Analytics</li>
                        </ul>
                      </div>
                      <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Select White Label Package
                      </button>
                    </button>
                  </div>
                </div>
              </CardWrapper>
            )}

            {/* Step 3: Order Summary */}
            {step === 3 && (
              <CardWrapper title="Order Summary" variant="default" showLabel={true}>
                <OrderSummary
                  formData={formData}
                  updateField={updateField}
                  onEdit={setStep}
                  onComplete={handleFinish}
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