import { useState } from "react";
import { PageHeader } from "@/shared/components/PageHeader";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableRadioField from "@/shared/components/wrappers/EditableRadioField";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/shared/components/ui/tooltip";

export function ProjectDetails() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [projectName, setProjectName] = useState("");
  const [productionCompany, setProductionCompany] = useState("");
  const [projectType, setProjectType] = useState("feature-film");
  const [showProjectTypeInOffers, setShowProjectTypeInOffers] = useState(true);
  const [legalTerritory, setLegalTerritory] = useState("united-kingdom");
  const [unionAgreement, setUnionAgreement] = useState("pact-bectu-2021");
  const [constructionUnionAgreement, setConstructionUnionAgreement] = useState("none");
  const [budgetLevel, setBudgetLevel] = useState("major");
  const [showBudgetToCrew, setShowBudgetToCrew] = useState(false);
  const [genre, setGenre] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [producer, setProducer] = useState("");
  const [director, setDirector] = useState("");
  const [productionManager, setProductionManager] = useState("");

  const projectTypeOptions = [
    { label: "Feature Film", value: "feature-film" },
    { label: "Television", value: "television" }
  ];

  const legalTerritoryOptions = [
    { label: "United Kingdom", value: "united-kingdom" },
    { label: "Iceland", value: "iceland" },
    { label: "Ireland", value: "ireland" },
    { label: "Malta", value: "malta" }
  ];

  const unionAgreementOptions = [
    { label: "None", value: "none" },
    { label: "PACT/BECTU Agreement (2021)", value: "pact-bectu-2021" }
  ];

  const constructionUnionAgreementOptions = [
    { label: "None", value: "none" },
    { label: "PACT/BECTU Agreement", value: "pact-bectu" },
    { label: "Custom Agreement", value: "custom" }
  ];

  const budgetLevelOptions = [
    { label: "Major (over £30 million)", value: "major" },
    { label: "Medium (£15-30 million)", value: "medium" },
    { label: "Low (under £15 million)", value: "low" },
    { label: "Micro (under £2 million)", value: "micro" }
  ];

  const currencyOptions = [
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "GBP", value: "GBP" },
    { label: "CAD", value: "CAD" },
    { label: "AUD", value: "AUD" }
  ];

  const handleSave = () => {
    console.log("Saving project details...");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-3 pb-6">
        {/* Page Header */}
        <PageHeader
          title="Project Details"
          subtitle="Manage your project information and settings"
          icon="FolderOpen"
          primaryAction={
            isEditing
              ? {
                  label: "Save Changes",
                  icon: "Save",
                  clickAction: handleSave,
                }
              : {
                  label: "Edit",
                  icon: "Pencil",
                  clickAction: () => setIsEditing(true),
                }
          }
          secondaryActions={
            isEditing
              ? [
                  {
                    label: "Cancel",
                    icon: "X",
                    variant: "outline",
                    clickAction: handleCancel,
                  },
                ]
              : []
          }
        />

        {/* Basic Information Section */}
        <CardWrapper
          title="Basic Information"
          icon="Info"
          description="Project name, company, and core details"
        >
          <div className="space-y-2">
            {/* Row 1: Project Name, Production Company, Genre */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <EditableTextDataField
                label="Project Name"
                value={projectName}
                onChange={setProjectName}
                isEditing={isEditing}
                icon="Film"
                placeholder="Enter project name"
              />
              
              <EditableTextDataField
                label="Production Company"
                value={productionCompany}
                onChange={setProductionCompany}
                isEditing={isEditing}
                icon="Building"
                placeholder="Enter production company"
              />
              
              <EditableTextDataField
                label="Genre"
                value={genre}
                onChange={setGenre}
                isEditing={isEditing}
                icon="Tag"
                placeholder="e.g., Drama, Action"
              />
            </div>

            {/* Row 2: Location, Start Date, End Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <EditableTextDataField
                label="Primary Location"
                value={location}
                onChange={setLocation}
                isEditing={isEditing}
                icon="MapPin"
                placeholder="City, Country"
              />
              
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  <span>Start Date</span>
                </div>
                {!isEditing ? (
                  <div className="text-sm font-medium text-foreground bg-muted/30 px-3 py-1.5 rounded-md border h-8 flex items-center">
                    {startDate || <span className="italic text-muted-foreground text-xs">Not Available</span>}
                  </div>
                ) : (
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background"
                  />
                )}
              </div>
              
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  <span>End Date</span>
                </div>
                {!isEditing ? (
                  <div className="text-sm font-medium text-foreground bg-muted/30 px-3 py-1.5 rounded-md border h-8 flex items-center">
                    {endDate || <span className="italic text-muted-foreground text-xs">Not Available</span>}
                  </div>
                ) : (
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background"
                  />
                )}
              </div>
            </div>

            {/* Row 3: Description - Full Width */}
            <EditableTextDataField
              label="Project Description"
              value={description}
              onChange={setDescription}
              isEditing={isEditing}
              icon="FileText"
              placeholder="Enter project description..."
              multiline={true}
            />
          </div>
        </CardWrapper>

        {/* Project Configuration Section */}
        <CardWrapper
          title="Project Configuration"
          icon="Settings"
          description="Type, territory, and union agreements"
        >
          <div className="space-y-2">
            {/* Row 1: Project Type, Legal Territory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <EditableRadioField
                  label="Project Type"
                  value={projectType}
                  options={projectTypeOptions}
                  isEditing={isEditing}
                  onChange={setProjectType}
                  icon="Film"
                />
                {isEditing && (
                  <div className="mt-1">
                    <EditableCheckboxField
                      label="Show project type in offers?"
                      checked={showProjectTypeInOffers}
                      onChange={setShowProjectTypeInOffers}
                      isEditing={isEditing}
                    />
                  </div>
                )}
              </div>

              <EditableRadioField
                label="Legal Territory"
                value={legalTerritory}
                options={legalTerritoryOptions}
                isEditing={isEditing}
                onChange={setLegalTerritory}
                icon="Globe"
              />
            </div>

            {/* Row 2: Union Agreement, Construction Union Agreement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  <span>Union Agreement</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Select the applicable union agreement</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <EditableRadioField
                  label=""
                  value={unionAgreement}
                  options={unionAgreementOptions}
                  isEditing={isEditing}
                  onChange={setUnionAgreement}
                />
              </div>

              <EditableRadioField
                label="Construction Union Agreement"
                value={constructionUnionAgreement}
                options={constructionUnionAgreementOptions}
                isEditing={isEditing}
                onChange={setConstructionUnionAgreement}
                icon="HardHat"
              />
            </div>

            {/* Row 3: Budget Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <EditableSelectField
                  label="Budget Level"
                  value={budgetLevel}
                  items={budgetLevelOptions}
                  isEditing={isEditing}
                  onChange={setBudgetLevel}
                  icon="DollarSign"
                />
                {isEditing && (
                  <div className="mt-1">
                    <EditableCheckboxField
                      label="Show budget level to crew members?"
                      checked={showBudgetToCrew}
                      onChange={setShowBudgetToCrew}
                      isEditing={isEditing}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardWrapper>

        {/* Financial Details Section */}
        <CardWrapper
          title="Financial Details"
          icon="Banknote"
          description="Budget amount and currency"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <EditableSelectField
              label="Currency"
              value={currency}
              items={currencyOptions}
              isEditing={isEditing}
              onChange={setCurrency}
              icon="DollarSign"
            />
            
            <div className="md:col-span-2">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  <span>Budget Amount</span>
                </div>
                {!isEditing ? (
                  <div className="text-sm font-medium text-foreground bg-muted/30 px-3 py-1.5 rounded-md border h-8 flex items-center">
                    {budget ? `${currency} ${budget}` : <span className="italic text-muted-foreground text-xs">Not Available</span>}
                  </div>
                ) : (
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background"
                  />
                )}
              </div>
            </div>
          </div>
        </CardWrapper>

        {/* Key Personnel Section */}
        <CardWrapper
          title="Key Personnel"
          icon="Users"
          description="Producer, director, and production manager"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <EditableTextDataField
              label="Producer"
              value={producer}
              onChange={setProducer}
              isEditing={isEditing}
              icon="User"
              placeholder="Enter producer name"
            />
            
            <EditableTextDataField
              label="Director"
              value={director}
              onChange={setDirector}
              isEditing={isEditing}
              icon="Video"
              placeholder="Enter director name"
            />
            
            <EditableTextDataField
              label="Production Manager"
              value={productionManager}
              onChange={setProductionManager}
              isEditing={isEditing}
              icon="Briefcase"
              placeholder="Enter production manager"
            />
          </div>
        </CardWrapper>
      </div>
    </TooltipProvider>
  );
}

export default ProjectDetails;