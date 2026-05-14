// src/features/projects/pages/ProjectDetails.jsx
import { useState } from 'react';
import { Clapperboard, Tv } from 'lucide-react';

import CardWrapper from '../../../shared/components/wrappers/CardWrapper';
import { Stepper } from '../../../shared/components/stepper/Stepper';
import { CardNavigator } from '../../../shared/components/stepper/CardNavigator';
import { ProjectApplications } from '../components/ProjectApplications';
import { OrderSummary } from '../components/OrderSummary';
import { PackageSelection } from '../pages/PackageSelection';

import EditableTextDataField from '../../../shared/components/wrappers/EditableTextDataField';
import EditableSelectField from '../../../shared/components/wrappers/EditableSelectField';
import EditableDateField from '../../../shared/components/wrappers/EditableDateField';

const STEPS = [
  { id: 'details',      label: 'Project Details' },
  { id: 'applications', label: 'Project Applications' },
  { id: 'package',      label: 'Select Package' },
  { id: 'order',        label: 'Order Summary' },
];

const GENRE_ITEMS = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Musical',
  'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western',
].map((g) => ({ label: g, value: g }));

const PROJECT_TYPES = [
  { value: 'Feature Film', icon: Clapperboard },
  { value: 'Television',   icon: Tv },
];

const ProjectTypePills = ({ selected, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
      Project Type
    </label>
    <div className="flex gap-2 flex-wrap">
      {PROJECT_TYPES.map(({ value, icon: Icon }) => {
        const isSelected = selected === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg border text-sm font-medium transition-all ${
              isSelected
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600'
            }`}
          >
            <Icon className="w-4 h-4" />
            {value}
          </button>
        );
      })}
    </div>
  </div>
);

const toISO = (dateStr) => {
  if (!dateStr) return '';
  if (dateStr.includes('T')) return dateStr;
  return new Date(dateStr).toISOString();
};

const splitIntoPhases = (startISO, endISO) => {
  const startMs = new Date(startISO).getTime();
  const endMs   = new Date(endISO).getTime();
  const range   = endMs - startMs;
  if (range <= 0) {
    return {
      prepStartDate: startISO, prepEndDate: startISO,
      shootStartDate: startISO, shootEndDate: startISO,
      wrapStartDate: startISO, wrapEndDate: startISO,
    };
  }
  const third = Math.floor(range / 3);
  return {
    prepStartDate:  new Date(startMs).toISOString(),
    prepEndDate:    new Date(startMs + third).toISOString(),
    shootStartDate: new Date(startMs + third).toISOString(),
    shootEndDate:   new Date(startMs + third * 2).toISOString(),
    wrapStartDate:  new Date(startMs + third * 2).toISOString(),
    wrapEndDate:    new Date(endMs).toISOString(),
  };
};

const ProjectDetails = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const studioId = "69494aa6df29472c2c6b5d8f";

  const [formData, setFormData] = useState({
    projectName:          '',
    genre:                '',
    primaryLocation:      '',
    startDate:            '',
    endDate:              '',
    projectDescription:   '',
    projectType:          'Feature Film',
    selectedApplications: [],
    packageTier:          'studio',
  });

  const [errors] = useState({});

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const canProceed = () => {
    switch (step) {
      case 0:
        return (
          formData.projectName.trim() &&
          formData.projectType &&
          formData.primaryLocation.trim() &&
          formData.startDate &&
          formData.endDate
        );
      case 1: return true;
      case 2: return !!formData.packageTier;
      case 3: return true;
      default: return true;
    }
  };

  const handleNext   = () => { if (canProceed()) setStep((p) => Math.min(p + 1, STEPS.length - 1)); };
  const handleBack   = () => setStep((p) => Math.max(p - 1, 0));

  const handleFinish = () => {
    if (!canProceed() || !onComplete) return;
    const startISO = toISO(formData.startDate);
    const endISO   = toISO(formData.endDate);
    const phases   = splitIntoPhases(startISO, endISO);
    onComplete({
      productionName:  formData.projectName.trim(),
      productionType:  formData.projectType,
      studioId,
      country:         formData.primaryLocation.trim(),
      ...phases,
      applications:    formData.selectedApplications ?? [],
      packageTier:     formData.packageTier ?? 'studio',
      projectContacts: [],
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <Stepper steps={STEPS} activeStep={step} />

      <div className="flex flex-col mt-4">
        <div className="flex-1">
          <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-200">

            {step === 0 && (
              <CardWrapper title="Project Details" subtitle="Tell us about your production" variant="default" showLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  <EditableTextDataField
                    label="Project Name" value={formData.projectName}
                    onChange={(v) => updateField('projectName', v)}
                    placeholder="Project name" isEditing isRequired error={errors.projectName}
                  />
                  <EditableSelectField
                    label="Genre" value={formData.genre} items={GENRE_ITEMS}
                    onChange={(v) => updateField('genre', v)}
                    placeholder="Select genres..." isEditing isRequired={false} error={errors.genre}
                  />
                  <EditableTextDataField
                    label="Location" value={formData.primaryLocation}
                    onChange={(v) => updateField('primaryLocation', v)}
                    placeholder="City, Country" isEditing isRequired error={errors.primaryLocation}
                  />
                  <ProjectTypePills selected={formData.projectType} onChange={(v) => updateField('projectType', v)} />
                  <EditableDateField
                    label="Start Date" value={formData.startDate}
                    onChange={(v) => updateField('startDate', v)}
                    placeholder="dd/mm/yyyy" isEditing isRequired allowPast allowFuture error={errors.startDate}
                  />
                  <EditableDateField
                    label="End Date" value={formData.endDate}
                    onChange={(v) => updateField('endDate', v)}
                    placeholder="dd/mm/yyyy" isEditing isRequired allowPast allowFuture error={errors.endDate}
                  />
                  <div className="md:col-span-2">
                    <EditableTextDataField
                      label="Description" value={formData.projectDescription}
                      onChange={(v) => updateField('projectDescription', v)}
                      placeholder="Describe your project..." isEditing isRequired={false} multiline
                    />
                  </div>
                </div>
              </CardWrapper>
            )}

            {step === 1 && (
              <CardWrapper title="Project Applications" variant="default" showLabel>
                <ProjectApplications
                  selectedApps={formData.selectedApplications}
                  onChange={(apps) => updateField('selectedApplications', apps)}
                />
              </CardWrapper>
            )}

            {step === 2 && (
              <CardWrapper
                title="Select Your Package Tier"
                subtitle="Choose the branding and features level that fits your needs"
                variant="default"
                showLabel
              >
                <PackageSelection
                  selectedPackage={formData.packageTier}
                  onChange={(tier) => updateField('packageTier', tier)}
                />
              </CardWrapper>
            )}

            {step === 3 && (
              <CardWrapper title="Order Summary" variant="default" showLabel>
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
            totalSteps={STEPS.length}
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