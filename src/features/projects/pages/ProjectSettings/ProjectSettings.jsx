<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ConfettiCelebration } from "./SharedComponents";
import { projects } from "@/features/projects/pages/ProjectSettings/data.js";
import {
  loadS,
  saveS,
  GlassSection,
  ModInput,
  ModSelect,
  PillToggle,
  TooltipIcon,
  ModTextarea,
  ModRadio,
  TabHeader,
  ActionFooter,
} from "./settings-shared";
import {
  AppWindow,
  Bell,
  Bookmark,
  Brain,
  Building,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Contact,
  CreditCard,
  FileCheck,
  FileText,
  LayoutGrid,
  Lock,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Palette,
  Rocket,
  Settings,
  Settings2,
  Sliders,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { CircularProgress } from "@/shared/components/ui/circular-progress";
import { cn } from "@/shared/config/utils";

const PROJECT_SETTINGS_STEPS = [
  { id: "details", label: "Details", icon: Settings2 },
  { id: "contacts", label: "Contacts", icon: Contact },
  { id: "dates", label: "Dates", icon: CalendarDays },

  { id: "rates-project", label: "Project", icon: Bookmark },
  { id: "rates-crew", label: "Standard Crew", icon: Users },
  { id: "rates-construction", label: "Construction", icon: Building },
  { id: "rates-places", label: "Places", icon: MapPin },
  { id: "rates-departments", label: "Departments", icon: Users },
=======
/**
 * ProjectSettings.jsx  (UPDATED — adds Contract Templates tab)
 *
 * Adds "Contract Templates" as a new settings section alongside existing ones.
 * All other existing tabs unchanged.
 */

import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { PageHeader } from '@/shared/components/PageHeader'
import {
  Settings,
  FileText,
  HardHat,
  Clock,
  Users,
  Bell,
  FileSignature,
  Workflow,
  CreditCard,
  UserCog,
  CheckCircle2,
  LayoutTemplate,   // ← new icon for Contract Templates
} from 'lucide-react'

// Import all settings components
import ProjectDetailsGeneral from './ProjectDetailsGeneral'
import ProjectOnboarding from './ProjectOnboarding'
import ProjectTimesheet from './ProjectTimesheet'
import ProjectRoles from './ProjectRoles'
import ProjectNotifications from './ProjectNotifications'
import SignersRecipients from './SignersRecipients'
import ApprovalWorkflows from './ApprovalWorkflows'
import Billing from './Billing'
import ProjectContractTemplates from './ProjectContractTemplates'   // ← NEW

const settingsMenuItems = [
  {
    id: 'details-general',
    label: 'Project Details',
    icon: FileText,
    component: ProjectDetailsGeneral,
    completed: true,
  },
  {
    id: 'onboarding',
    label: 'Onboarding',
    icon: UserCog,
    component: ProjectOnboarding,
    completed: false,
  },
  {
    id: 'contract-templates',        // ← NEW
    label: 'Contract Templates',
    icon: LayoutTemplate,
    component: ProjectContractTemplates,
    completed: false,
  },
  {
    id: 'timesheet',
    label: 'Timesheet',
    icon: Clock,
    component: ProjectTimesheet,
    completed: false,
  },
  {
    id: 'roles',
    label: 'Roles',
    icon: Users,
    component: ProjectRoles,
    completed: true,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    component: ProjectNotifications,
    completed: true,
  },
  {
    id: 'signers-recipients',
    label: 'Signers & Recipients',
    icon: FileSignature,
    component: SignersRecipients,
    completed: false,
  },
  {
    id: 'approval-workflows',
    label: 'Approval Workflows',
    icon: Workflow,
    component: ApprovalWorkflows,
    completed: true,
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    component: Billing,
    completed: false,
  },
]
>>>>>>> shanid/contract

  { id: "doc-signers", label: "Signatures & Workflow", icon: FileCheck },
  { id: "contracts-forms", label: "Contracts & Forms", icon: FileText },

  { id: "admin", label: "Admin", icon: LockKeyhole },
  { id: "custom", label: "Custom", icon: Sliders },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "timecard", label: "Timecard", icon: Clock },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },

  { id: "style", label: "Design & Style", icon: Palette },
  { id: "layout", label: "Layout", icon: LayoutGrid },
  { id: "apps", label: "App Settings", icon: AppWindow },

  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "ai-knowledge-base", label: "AI Knowledge Base", icon: Brain },
];
 function ProjectSettingsStepper({
    activeTab,
    onTabChange,
    locks,
    tabProgress,
    color,
  }) {
    const [hoveredTab, setHoveredTab] = useState(null);
    console.log(activeTab);
    console.log(onTabChange);

    const totalSteps = PROJECT_SETTINGS_STEPS.length;
  const currentStepIndex = PROJECT_SETTINGS_STEPS.findIndex(
  step => step.id === activeTab
);

    const activeStepItem = PROJECT_SETTINGS_STEPS.find(
      (f) => f.id === activeTab,
    );
    const hoveredStepItem = hoveredTab
      ? PROJECT_SETTINGS_STEPS.find((f) => f.id === hoveredTab)
      : null;
    const displayLabel = hoveredStepItem?.label || activeStepItem?.label || "";
const displayStepIndex = hoveredTab
  ? PROJECT_SETTINGS_STEPS.findIndex(step => step.id === hoveredTab)
  : currentStepIndex;
    const displayIsLocked = hoveredTab
      ? !!locks[hoveredTab]
      : !!locks[activeTab];
    const displayProgressPct = hoveredTab
      ? (tabProgress[hoveredTab] ?? 0)
      : (tabProgress[activeTab] ?? 0);

const prevTab =
  currentStepIndex > 0
    ? PROJECT_SETTINGS_STEPS[currentStepIndex - 1].id
    : null;

const nextTab =
  currentStepIndex < totalSteps - 1
    ? PROJECT_SETTINGS_STEPS[currentStepIndex + 1].id
    : null;

    return (
      <>
        <div className="mb-5 rounded-2xl bg-white/80 dark:bg-[#13111d]/80 backdrop-blur-xl border border-gray-100/80 dark:border-gray-800/50 shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-1 flex items-center justify-center gap-2">
            {prevTab ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onTabChange(prevTab)}
                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="w-3 h-3 text-gray-400" />
              </motion.button>
            ) : (
              <div className="w-5" />
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={displayLabel}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <span
                  className="flex items-center justify-center w-5 h-5 rounded-full"
                  style={{
                    backgroundColor: displayIsLocked ? "#22c55e" : `${color}15`,
                    fontSize: "0.44rem",
                    fontFamily: "var(--font-mono)",
                    color: displayIsLocked ? "#fff" : color,
                  }}
                >
                  {displayIsLocked ? (
                    <Check style={{ width: 10, height: 10 }} />
                  ) : (
                    displayStepIndex + 1
                  )}
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: displayIsLocked ? "#22c55e" : color,
                  }}
                >
                  {displayLabel}
                </span>
                {!displayIsLocked && displayProgressPct > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-md"
                    style={{
                      fontSize: "0.44rem",
                      fontFamily: "var(--font-mono)",
                      backgroundColor: `${color}08`,
                      color: `${color}90`,
                    }}
                  >
                    {displayProgressPct}%
                  </span>
                )}
                {displayIsLocked && (
                  <span
                    className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"
                    style={{ fontSize: "0.44rem" }}
                  >
                    Locked
                  </span>
                )}
                <span
                  className="text-gray-300 dark:text-gray-600"
                  style={{
                    fontSize: "0.44rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {currentStepIndex + 1}/{totalSteps}
                </span>
              </motion.div>
            </AnimatePresence>

            {nextTab ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onTabChange(nextTab)}
                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </motion.button>
            ) : (
              <div className="w-5" />
            )}
          </div>

          <div className="px-5 pb-3.5 pt-1">
            <div className="flex items-center w-full gap-0">
              {PROJECT_SETTINGS_STEPS.map((step, i) => {
                const tid = step.id;
                const isActive = tid === activeTab;
                const isHovered = tid === hoveredTab;
                const isLocked = !!locks[tid];
                const progressPct = tabProgress[tid] ?? 0;
                const isPast = i < currentStepIndex;
  const prevLocked =
  i > 0 && !!locks[PROJECT_SETTINGS_STEPS[i - 1].id];

                return (
                  <div key={tid} className="contents">
                    {i > 0 && (
                      <div
                        className="h-[2px] rounded-full"
                        style={{
                          flex: 1,
                          minWidth: 2,
                          backgroundColor:
                            isLocked && prevLocked
                              ? "#22c55e"
                              : isPast
                                ? `${color}30`
                                : "#e5e7eb",
                          transition: "background-color 0.3s",
                        }}
                      />
                    )}
                    <motion.button
                      onClick={() => onTabChange(tid)}
                      onMouseEnter={() => setHoveredTab(tid)}
                      onMouseLeave={() => setHoveredTab(null)}
                      className="relative flex items-center justify-center rounded-full cursor-pointer"
                      style={{
                        width: isActive ? 18 : 10,
                        height: isActive ? 18 : 10,
                        flexShrink: 0,
                        backgroundColor: isLocked
                          ? "#22c55e"
                          : isActive
                            ? color
                            : progressPct > 0
                              ? `${color}30`
                              : "#e5e7eb",
                        boxShadow: isActive
                          ? `0 0 0 3px ${isLocked ? "#22c55e25" : color + "20"}`
                          : "none",
                        transition: "all 0.2s ease",
                        zIndex: isActive ? 10 : isHovered ? 5 : 1,
                      }}
                      whileHover={{ scale: 1.4 }}
                      whileTap={{ scale: 0.85 }}
                    >
                      {isActive &&
                        (isLocked ? (
                          <Check
                            className="text-white"
                            style={{ width: 9, height: 9 }}
                          />
                        ) : (
                          <span
                            className="text-white"
                            style={{
                              fontSize: "0.38rem",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            {i + 1}
                          </span>
                        ))}
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
   function DetailsTab({
    color,
    projectName,
    projectId,
    studioId,
    locked,
    onLock,
    onProgress,
  }) {
    const d = locked;

    const [details, setDetails] = useState(() =>
      loadS(
        projectId,
        "proj-details",
        {
          title: projectName,
          codename: projectName,
          description: "",
          locations: "",
          additionalNotes: "",
        },
        studioId,
      ),
    );

    const [settings, setSettings] = useState(() =>
      loadS(
        projectId,
        "proj-settings",
        {
          projectType: "Feature Film",
          showProjectTypeInOffers: true,
          legalTerritory: "United Kingdom",
          unionAgreement: "None",
          constructionUnionAgreement: "None",
          budget: "",
          showBudgetToCrew: false,
          holidayPayPct: "0%",
          differentHolidayForDailies: false,
          withholdHolidayOn6th7th: false,
          overtime: false,
          showWeeklyRateOfferView: false,
          showWeeklyRateDocuments: false,
          defaultWorkingHours: "",
          offerEndDate: "Optional",
          payrollCompany: "",
          crewDataCsvLayout: "",
          payrollCsvLayout: "",
        },
        studioId,
      ),
    );

    const [offer, setOffer] = useState(() =>
      loadS(
        projectId,
        "offer-handling",
        {
          shareStatusDetermination: false,
          taxStatusHandling: "",
          taxStatusQueryEmail: "",
          offerApproval: "",
        },
        studioId,
      ),
    );

    const up = (key, val, setter) => {
      setter(val);
      saveS(projectId, key, val, studioId);
    };

    const reqFields = [
      details.title,
      details.codename,
      settings.projectType,
      settings.legalTerritory,
      settings.defaultWorkingHours,
      settings.payrollCompany,
      offer.taxStatusHandling,
      offer.offerApproval,
    ];
    const pct = Math.round(
      (reqFields.filter(Boolean).length / reqFields.length) * 100,
    );
    useEffect(() => {
      onProgress?.(pct);
    }, []);

    return (
      <motion.div
        key="details"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <TabHeader label="Details" pct={pct} color={color} locked={locked} />
        <div className={d ? "opacity-50 pointer-events-none select-none" : ""}>
          <GlassSection
            title="Project Details"
            desc="Helpful information which is shown to crew and can be updated any time."
            color={color}
            delay={0.05}
          >
            <div className="grid grid-cols-2 gap-3 mb-3">
              <ModInput
                label="Title"
                value={details.title}
                onChange={(v) =>
                  up("proj-details", { ...details, title: v }, setDetails)
                }
                color={color}
                disabled={d}
                required
              />
              <div>
                <ModInput
                  label="Codename"
                  value={details.codename}
                  onChange={(v) =>
                    up("proj-details", { ...details, codename: v }, setDetails)
                  }
                  color={color}
                  disabled={d}
                  required
                />
                <span
                  className="text-gray-400 dark:text-gray-500 mt-1 block px-1"
                  style={{ fontSize: "0.48rem" }}
                >
                  If your project has an alternative name for secrecy, enter
                  that. Otherwise enter the Project title. The Codename will be
                  used in all emails and pages.
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <ModTextarea
                label="Description (Optional)"
                value={details.description}
                onChange={(v) =>
                  up("proj-details", { ...details, description: v }, setDetails)
                }
                maxLength={300}
                color={color}
                disabled={d}
                helpText="A brief synopsis of the project which is helpful for crew joining the production."
              />
              <ModTextarea
                label="Locations (Optional)"
                value={details.locations}
                onChange={(v) =>
                  up("proj-details", { ...details, locations: v }, setDetails)
                }
                maxLength={300}
                color={color}
                disabled={d}
                helpText="Useful information, if known, which might help crew decide if they can accept the job."
              />
              <ModTextarea
                label="Additional Notes (Optional)"
                value={details.additionalNotes}
                onChange={(v) =>
                  up(
                    "proj-details",
                    { ...details, additionalNotes: v },
                    setDetails,
                  )
                }
                maxLength={300}
                color={color}
                disabled={d}
                helpText="Use this to convey general project-wide information to crew."
              />
            </div>
          </GlassSection>

          <GlassSection
            title="Project Settings"
            desc="Essential settings which will govern how rates are calculated."
            color={color}
            delay={0.1}
          >
            <div className="space-y-4">
              <ModRadio
                label="Project Type"
                value={settings.projectType}
                onChange={(v) =>
                  up(
                    "proj-settings",
                    { ...settings, projectType: v },
                    setSettings,
                  )
                }
                options={["Feature Film", "Television"]}
                color={color}
                disabled={d}
                tooltip="Select Television for SVOD 'streaming' projects."
              />
              <PillToggle
                label="Show project type in offers?"
                value={settings.showProjectTypeInOffers}
                onChange={(v) =>
                  up(
                    "proj-settings",
                    { ...settings, showProjectTypeInOffers: v },
                    setSettings,
                  )
                }
                color={color}
                disabled={d}
              />
              <ModRadio
                label="Legal Territory"
                value={settings.legalTerritory}
                onChange={(v) =>
                  up(
                    "proj-settings",
                    { ...settings, legalTerritory: v },
                    setSettings,
                  )
                }
                options={["United Kingdom", "Iceland", "Ireland", "Malta"]}
                color={color}
                disabled={d}
              />
              <ModRadio
                label="Union Agreement"
                value={settings.unionAgreement}
                onChange={(v) =>
                  up(
                    "proj-settings",
                    { ...settings, unionAgreement: v },
                    setSettings,
                  )
                }
                options={["None", "PACT/BECTU Agreement (2021)"]}
                color={color}
                disabled={d}
                tooltip="Select 'None' if you will use terms which vary from the current Union Agreement."
              />
              <ModRadio
                label="Construction Union Agreement"
                value={settings.constructionUnionAgreement}
                onChange={(v) =>
                  up(
                    "proj-settings",
                    { ...settings, constructionUnionAgreement: v },
                    setSettings,
                  )
                }
                options={["None", "PACT/BECTU Agreement", "Custom Agreement"]}
                color={color}
                disabled={d}
              />
              <div className="grid grid-cols-2 gap-3">
                <ModSelect
                  label="Budget"
                  value={settings.budget}
                  onChange={(v) =>
                    up("proj-settings", { ...settings, budget: v }, setSettings)
                  }
                  options={[
                    "Low (under £10 million)",
                    "Mid (between £10 - £30 million)",
                    "Major (over £30 million)",
                  ]}
                  color={color}
                  disabled={d}
                />
                <div className="flex items-end pb-1">
                  <PillToggle
                    label="Show budget level to crew members?"
                    value={settings.showBudgetToCrew}
                    onChange={(v) =>
                      up(
                        "proj-settings",
                        { ...settings, showBudgetToCrew: v },
                        setSettings,
                      )
                    }
                    color={color}
                    disabled={d}
                  />
                </div>
              </div>
              <ModRadio
                label="Holiday Pay Percentage"
                value={settings.holidayPayPct}
                onChange={(v) =>
                  up(
                    "proj-settings",
                    { ...settings, holidayPayPct: v },
                    setSettings,
                  )
                }
                options={["0%", "10.77%", "12.07%"]}
                color={color}
                disabled={d}
              />
              <PillToggle
                label="Different holiday pay percentage for Dailies"
                value={settings.differentHolidayForDailies}
                onChange={(v) =>
                  up(
                    "proj-settings",
                    { ...settings, differentHolidayForDailies: v },
                    setSettings,
                  )
                }
                color={color}
                disabled={d}
              />
              <PillToggle
                label="Withhold holiday pay on 6th and 7th days"
                value={settings.withholdHolidayOn6th7th}
                onChange={(v) =>
                  up(
                    "proj-settings",
                    { ...settings, withholdHolidayOn6th7th: v },
                    setSettings,
                  )
                }
                color={color}
                disabled={d}
              />
              <PillToggle
                label="Overtime"
                value={settings.overtime}
                onChange={(v) =>
                  up("proj-settings", { ...settings, overtime: v }, setSettings)
                }
                color={color}
                disabled={d}
              />
              <div className="pt-1">
                <span
                  className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2"
                  style={{ fontSize: "0.5rem" }}
                >
                  Show Weekly rate for Daily crew in
                </span>
                <div className="space-y-1">
                  <PillToggle
                    label="Offer view"
                    value={settings.showWeeklyRateOfferView}
                    onChange={(v) =>
                      up(
                        "proj-settings",
                        { ...settings, showWeeklyRateOfferView: v },
                        setSettings,
                      )
                    }
                    color={color}
                    disabled={d}
                  />
                  <PillToggle
                    label="Documents"
                    value={settings.showWeeklyRateDocuments}
                    onChange={(v) =>
                      up(
                        "proj-settings",
                        { ...settings, showWeeklyRateDocuments: v },
                        setSettings,
                      )
                    }
                    color={color}
                    disabled={d}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <ModSelect
                    label="Default Standard Working Hours"
                    value={settings.defaultWorkingHours}
                    onChange={(v) =>
                      up(
                        "proj-settings",
                        { ...settings, defaultWorkingHours: v },
                        setSettings,
                      )
                    }
                    options={[
                      "12 hours (continuous)",
                      "12 hours",
                      "11 hours",
                      "10.5 hours",
                      "10 hours",
                      "9 hours",
                      "8 hours",
                      "7.5 hours",
                      "7 hours",
                      "6 hours",
                      "5 hours",
                      "4 hours",
                      "3 hours",
                      "2 hours",
                      "1 hour",
                    ]}
                    color={color}
                    disabled={d}
                  />
                  <span
                    className="text-gray-400 dark:text-gray-500 mt-1 block px-1"
                    style={{ fontSize: "0.48rem" }}
                  >
                    Excluding lunch. This is for standard crew contracts. You
                    can still specify different hours in each offer.
                  </span>
                </div>
                <ModRadio
                  label="Offer End Date"
                  value={settings.offerEndDate}
                  onChange={(v) =>
                    up(
                      "proj-settings",
                      { ...settings, offerEndDate: v },
                      setSettings,
                    )
                  }
                  options={["Optional", "Mandatory"]}
                  color={color}
                  disabled={d}
                  tooltip="Dictated by whether the Company wants end dates in crew contracts."
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <ModSelect
                  label="Payroll Company"
                  value={settings.payrollCompany}
                  onChange={(v) =>
                    up(
                      "proj-settings",
                      { ...settings, payrollCompany: v },
                      setSettings,
                    )
                  }
                  options={[
                    "Dataplan",
                    "Entertainment Payroll Services",
                    "Hargenant",
                    "In-house",
                    "Moneypenny",
                    "Sargent Disc",
                    "TPH",
                  ]}
                  color={color}
                  disabled={d}
                />
                <div>
                  <ModSelect
                    label="Crew Data CSV Export Layout"
                    value={settings.crewDataCsvLayout}
                    onChange={(v) =>
                      up(
                        "proj-settings",
                        { ...settings, crewDataCsvLayout: v },
                        setSettings,
                      )
                    }
                    options={["EAARTH", "Moneypenny"]}
                    color={color}
                    disabled={d}
                  />
                  <span
                    className="text-gray-400 dark:text-gray-500 mt-1 block px-1"
                    style={{ fontSize: "0.48rem" }}
                  >
                    Start form data in CSV format for sharing with the payroll
                    company.
                  </span>
                </div>
                <div>
                  <ModSelect
                    label="Payroll CSV Export Layout"
                    value={settings.payrollCsvLayout}
                    onChange={(v) =>
                      up(
                        "proj-settings",
                        { ...settings, payrollCsvLayout: v },
                        setSettings,
                      )
                    }
                    options={[
                      "Dataplan",
                      "Entertainment Payroll Services",
                      "Hargenant",
                      "In-house",
                      "Moneypenny",
                      "Sargent Disc",
                      "TPH",
                    ]}
                    color={color}
                    disabled={d}
                  />
                  <span
                    className="text-gray-400 dark:text-gray-500 mt-1 block px-1"
                    style={{ fontSize: "0.48rem" }}
                  >
                    Money calculation data in a layout similar to your payroll
                    company's spreadsheet.
                  </span>
                </div>
              </div>
            </div>
          </GlassSection>

          <GlassSection
            title="Offer Handling"
            desc="How you'd like offers to be reviewed prior to sending to crew."
            color={color}
            delay={0.15}
          >
            <div className="space-y-4">
              <PillToggle
                label="Share status determination with crew members?"
                value={offer.shareStatusDetermination}
                onChange={(v) =>
                  up(
                    "offer-handling",
                    { ...offer, shareStatusDetermination: v },
                    setOffer,
                  )
                }
                color={color}
                disabled={d}
              />
              <span
                className="text-gray-400 dark:text-gray-500 block px-1 -mt-2"
                style={{ fontSize: "0.48rem" }}
              >
                Inform the crew member of your IR35 status determination within
                their offer.
              </span>
              <div>
                <ModSelect
                  label="Tax Status Handling"
                  value={offer.taxStatusHandling}
                  onChange={(v) =>
                    up(
                      "offer-handling",
                      { ...offer, taxStatusHandling: v },
                      setOffer,
                    )
                  }
                  options={[
                    "Do not allow loan outs",
                    "Accounts approval required for self-employed or loan out",
                    "Accounts approval required for loan out",
                    "Allow loan out if grade is self-employed",
                    "Allow all loan outs (not recommended after 5 Apr, 2021)",
                  ]}
                  color={color}
                  disabled={d}
                />
                <span
                  className="text-gray-400 dark:text-gray-500 mt-1 block px-1"
                  style={{ fontSize: "0.48rem" }}
                >
                  Available options are based on your 'Share status
                  determination with crew members?' selection.
                </span>
              </div>
              <ModInput
                label="Tax Status Query Email"
                value={offer.taxStatusQueryEmail}
                onChange={(v) =>
                  up(
                    "offer-handling",
                    { ...offer, taxStatusQueryEmail: v },
                    setOffer,
                  )
                }
                type="email"
                color={color}
                disabled={d}
              />
              <span
                className="text-gray-400 dark:text-gray-500 block px-1 -mt-2"
                style={{ fontSize: "0.48rem" }}
              >
                The person to whom all tax status questions will be directed.
              </span>
              <div>
                <ModSelect
                  label="Offer Approval"
                  value={offer.offerApproval}
                  onChange={(v) =>
                    up(
                      "offer-handling",
                      { ...offer, offerApproval: v },
                      setOffer,
                    )
                  }
                  options={[
                    "Accounts",
                    "Accounts > Production",
                    "Production",
                    "Production > Accounts",
                  ]}
                  color={color}
                  disabled={d}
                />
                <span
                  className="text-gray-400 dark:text-gray-500 mt-1 block px-1"
                  style={{ fontSize: "0.48rem" }}
                >
                  Order of people who will approve offers before being sent to
                  crew.
                </span>
              </div>
            </div>
          </GlassSection>
        </div>
        <ActionFooter locked={locked} onLock={onLock} color={color} pct={pct} />
      </motion.div>
    );
  }
function ProjectSettings() {
<<<<<<< HEAD
  const { projectName } = useParams();
  const project = projects.find((p) => p.id === projectName);

  const color = project?.color;
  const overallPct = 65;
  const allLocked = false;
  const lockedCount = 9;

  const [showConfetti, setShowConfetti] = useState(true);
  const [activeTab, setActiveTab] = useState(PROJECT_SETTINGS_STEPS[0].id);

  const onTabChange = (tab) => {
    setActiveTab(tab);
  };

const [tabProgress, setTabProgress] = useState({});
const [locks, setLocks] = useState({});
const toggleLock = (tab) => {
  setLocks(prev => ({
    ...prev,
    [tab]: !prev[tab]
  }));
};

const reportProgress = (tab, pct) => {
  setTabProgress(prev => ({
    ...prev,
    [tab]: pct
  }));
};

 

 

  return (
    <>
      {/* {showConfetti && <ConfettiCelebration color={project?.color} />} */}
      <div className="flex flex-col gap-5">
        <div
          className="rounded-2xl p-4 flex items-center justify-between "
          style={{
            background: `linear-gradient(135deg, ${project?.color}10 0%, ${project?.color}17 100%)`,
          }}
        >
          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
            {/* Icon */}
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0"
              style={{ backgroundColor: `${project?.color}15` }}
              whileHover={{ scale: 1.05 }}
            >
              <Settings className="w-5 h-5" style={{ color: project?.color }} />
            </motion.div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-extrabold leading-none text-foreground">
                Project Settings
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{project?.name}</span>

                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />

                <span>
                  {lockedCount}/{PROJECT_SETTINGS_STEPS.length} locked
                </span>
              </div>
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            <CircularProgress
              value={overallPct}
              size={40}
              strokeWidth={3}
              color={color}
            />

            <motion.button
              whileHover={allLocked ? { scale: 1.03 } : undefined}
              whileTap={allLocked ? { scale: 0.97 } : undefined}
              disabled={!allLocked}
              onClick={() => {
                setShowConfetti(true);
                toast.success("Project is now LIVE!", { duration: 5000 });
                setTimeout(() => setShowConfetti(false), 3000);
              }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-[0.76rem]",
                allLocked
                  ? "text-white shadow-lg hover:shadow-xl"
                  : "bg-muted text-muted-foreground border border-border opacity-80 cursor-not-allowed",
              )}
              style={
                allLocked
                  ? {
                      background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                    }
                  : undefined
              }
            >
              {allLocked ? (
                <>
                  <Rocket className="w-4 h-4" /> Go Live
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  {overallPct}% — Lock all to Go Live
                </>
              )}
            </motion.button>
          </div>
=======
  // projectId may come from the URL (e.g. /projects/:projectId/settings)
  const { projectId: projectIdParam, studioId: studioIdParam } = useParams()

  // studioId lives on the user's active affiliation in Redux — more reliable
  // than URL params since most routes don't include :studioId
  const user = useSelector((state) => state.user)
  const studioIdFromStore =
    user?.activeAffiliation?.studioId ||
    user?.currentUser?.activeAffiliation?.studioId ||
    user?.profile?.studioId ||
    user?.studioId

  const studioId = studioIdFromStore || studioIdParam
  const projectId = projectIdParam
  const [activeTab, setActiveTab] = useState('details-general')

  const activeItem = settingsMenuItems.find((item) => item.id === activeTab)
  const ActiveComponent = activeItem?.component || ProjectDetailsGeneral

  // Pass studioId and projectId to Contract Templates
  const componentProps =
    activeTab === 'contract-templates'
      ? { studioId, projectId }
      : {}

  return (
    <div className="space-y-4">
      <PageHeader title="Project Settings" icon="Settings" />

      <div className="flex gap-6">
        {/* ── Vertical Tabs ── */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {settingsMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                  <CheckCircle2
                    className={`w-5 h-5 flex-shrink-0 ${
                      item.completed ? 'text-green-500' : 'text-gray-300'
                    }`}
                  />
                </button>
              )
            })}
          </nav>
        </div>

        {/* ── Content Area ── */}
        <div className="flex-1 min-w-0">
          <ActiveComponent {...componentProps} />
>>>>>>> shanid/contract
        </div>
        <ProjectSettingsStepper
          activeTab={activeTab}
          onTabChange={onTabChange}
          locks={locks}
          tabProgress={tabProgress}
          color={color}
        />
        <AnimatePresence mode="wait"></AnimatePresence>
        {/* ── DETAILS ── */}
        {activeTab === "details" && (
          <DetailsTab
            key="details"
            color={color}
            projectName={project.name}
            projectId={project.id}
        studioId={project.id}
            locked={!!locks.details}
            onLock={() => toggleLock("details")}
            onProgress={(p) => reportProgress("details", p)}
          />
        )}
      </div>
    </>
  );
}

<<<<<<< HEAD
export default ProjectSettings;
=======
export default ProjectSettings
>>>>>>> shanid/contract
