import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ConfettiCelebration } from "./SharedComponents";
import ProjectSettingsNavigator from "./components/ProjectSettingsNavigator";
import { projects } from "@/features/projects/pages/ProjectSettings/data.js";
import DetailsTab from "@/features/projects/pages/ProjectSettings/tabs/DetailsTab";
import {
  AppWindow,
  Bell,
  Bookmark,
  Brain,
  Building,
  CalendarDays,
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
import ContactsTab from "./tabs/ContactsTab";
import DatesTab from "./tabs/DatesTab";
import RatesProjectTab from "./tabs/RatesProjectTab";
import RatesCrewTab from "./tabs/RatesCrewTab";
import RatesConstructionTab from "./tabs/RatesConstructionTab";
import RatesPlacesTab from "./tabs/RatesPlacesTab";
import RatesDepartmentsTab from "./tabs/RatesDepartmentsTab";
import DocSignersTab from "./tabs/DocSignersTab";
import ContractsFormsTab from "./tabs/ContractsFormsTab";
import AdminTab from "./tabs/AdminTab";
import CustomTab from "./tabs/CustomTab";
import NotificationsTab from "./tabs/NotificationsTab";
import TimecardTab from "./tabs/TimecardTab";
import SubscriptionsTab from "./tabs/SubscriptionsTab";

const tabs = [
  { id: "details", label: "Details", icon: Settings2 },
  { id: "contacts", label: "Contacts", icon: Contact },
  { id: "dates", label: "Dates", icon: CalendarDays },
  { id: "rates-project", label: "Project", icon: Bookmark },
  { id: "rates-crew", label: "Standard Crew", icon: Users },
  { id: "rates-construction", label: "Construction", icon: Building },
  { id: "rates-places", label: "Places", icon: MapPin },
  { id: "rates-departments", label: "Departments", icon: Users },
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

// IDs of tabs that are fully implemented and have real progress tracking
const IMPLEMENTED_TAB_IDS = [
  "details",
  "contacts",
  "dates",
  "rates-project",
  "rates-crew",
  "rates-construction",
  "rates-places",
  "rates-departments",
  "doc-signers",
  "contracts-forms",
  "admin",
  "custom", // ← added
  "notifications",
  "timecard", // ← added
  "subscriptions"
];

/* ─────────────────────────────────────────────────────────
   Pre-compute progress for all tabs from localStorage
   so the navigator shows correct fills even for unvisited tabs
───────────────────────────────────────────────────────── */
function computeInitialProgress(projectId) {
  // console.log("[computeProgress] called with projectId:", projectId);
  const load = (key, fallback) => {
    try {
      const stored = localStorage.getItem(`${key}-${projectId}`);
      const result = stored ? JSON.parse(stored) : fallback;
      // console.log(
      //   `[computeProgress] ${key}-${projectId}:`,
      //   stored ? "FOUND" : "FALLBACK",
      //   JSON.stringify(result).slice(0, 80),
      // );
      return result;
    } catch {
      return fallback;
    }
  };

  const pct = (filled, total) => Math.round((filled / total) * 100);
  const count = (arr) => arr.filter(Boolean).length;

  // ── Details ──
  const details = load("proj-details", { title: "", codename: "" });
  const settings = load("proj-settings", {
    projectType: "Feature Film",
    legalTerritory: "United Kingdom",
    defaultWorkingHours: "",
    payrollCompany: "",
  });
  const offer = load("offer-handling", {
    taxStatusHandling: "",
    offerApproval: "",
  });
  const detailsFields = [
    details.title,
    details.codename,
    settings.projectType,
    settings.legalTerritory,
    settings.defaultWorkingHours,
    settings.payrollCompany,
    offer.taxStatusHandling,
    offer.offerApproval,
  ];

  // ── Contacts ──
  const DEFAULT_COMPANIES_FALLBACK = [
    {
      id: "co1",
      name: "Mirage Pictures Limited",
      registrationNumber: "12345678",
      taxId: "GB 987 6543 21",
      addressLine1: "1 Central St Giles",
      addressLine2: "St Giles High Street",
      city: "London",
      postcode: "WC2H 8NU",
      country: "United Kingdom",
      telephone: "+44 20 7946 0958",
      email: "info@miragepictures.co.uk",
      currencies: ["GBP", "EUR"],
      isPrimary: true,
    },
  ];
  const companies = load("contacts-companies", DEFAULT_COMPANIES_FALLBACK);
  const base = load("contacts-base", { addr1: "", city: "", telephone: "" });
  const creator = load("contacts-creator", { name: "", email: "" });
  const billing = load("contacts-billing", {
    contactName: "",
    contactEmails: "",
  });
  const hasCompanyWithName = companies.some((c) => c.name?.trim());
  const hasCompanyAddr = companies.some(
    (c) => c.addressLine1?.trim() && c.city?.trim(),
  );
  const hasCompanyCurrency = companies.some((c) => c.currencies?.length > 0);
  const contactsFields = [
    hasCompanyWithName ? "y" : "",
    hasCompanyAddr ? "y" : "",
    hasCompanyCurrency ? "y" : "",
    base.addr1,
    base.city,
    base.telephone,
    creator.name,
    creator.email,
    billing.contactName,
    billing.contactEmails,
  ];

  // ── Dates ──
  const dates = load("dates-overall", {
    prepStart: "",
    prepEnd: "",
    shootStart: "",
    shootEnd: "",
    shootDurationDays: "",
  });
  const post = load("dates-post", { postStart: "", postEnd: "" });
  const datesFields = [
    dates.prepStart,
    dates.prepEnd,
    dates.shootStart,
    dates.shootEnd,
    dates.shootDurationDays,
    post.postStart,
    post.postEnd,
  ];

  // ── Rates Project ──
  const basic = load("proj-defaults-basic", { workingWeek: "" });
  const notice = load("proj-defaults-notice", { noticePeriod: "" });
  const ratesProjectFields = [basic.workingWeek, notice.noticePeriod];

  // ── Rates Crew — defaults are pre-filled so this starts at 100% ──
  const sixSeven = load("crew-6th7th", {
    sixthDayMultiplier: "1.5",
    seventhDayMultiplier: "2.0",
  });
  const ratesCrewFields = [
    sixSeven.sixthDayMultiplier,
    sixSeven.seventhDayMultiplier,
  ];

  const result = {
    details: pct(count(detailsFields), detailsFields.length),
    contacts: pct(count(contactsFields), contactsFields.length),
    dates: pct(count(datesFields), datesFields.length),
    "rates-project": pct(count(ratesProjectFields), ratesProjectFields.length),
    "rates-crew": pct(count(ratesCrewFields), ratesCrewFields.length),
    "rates-construction": 100, // all fields have defaults
    "rates-places": 100, // default units + workplaces pre-filled
    "rates-departments": 100, // all defaults pre-filled
    "doc-signers": 100, // default signers + workflows pre-filled
    "contracts-forms": 100, // all category + group defaults pre-filled
    "admin": 100, // default roles + assignments pre-filled
    "custom": 100, // all defaults pre-filled
    "notifications": 100, // all defaults pre-filled
    // Not yet implemented tabs
    "timecard": 100,
    "subscriptions": 100,
    "style": 0,
    "layout": 0,
    "apps": 0,
    "chat": 0,
    "calendar": 0,
    "ai-knowledge-base": 0,
  };
  // console.log("[computeProgress] FINAL result:", result);
  return result;
}

function ProjectSettings() {
  const { projectName } = useParams();
  const project = projects.find((p) => p.id === projectName);

  const color = project?.color;

  const [showConfetti, setShowConfetti] = useState(true);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [tabLockStatusById, setTabLockStatusById] = useState({});

  // Pre-initialize progress from localStorage so all tabs show correct fills immediately
  const [tabProgressById, setTabProgressById] = useState(() =>
    project?.id ? computeInitialProgress(project.id) : {},
  );

  // Re-compute whenever projectId changes
  useEffect(() => {
    if (project?.id) {
      setTabProgressById(computeInitialProgress(project.id));
    }
  }, [project?.id]);

  // Derived stats — only count IMPLEMENTED tabs for overallPct
  const lockedCount = Object.values(tabLockStatusById).filter(Boolean).length;

  const implementedProgresses = IMPLEMENTED_TAB_IDS.map(
    (id) => tabProgressById[id] ?? 0,
  );
  const overallPct =
    implementedProgresses.length > 0
      ? Math.round(
          implementedProgresses.reduce((a, b) => a + b, 0) /
            implementedProgresses.length,
        )
      : 0;

  const allLocked = lockedCount === tabs.length;

  return (
    <>
      {/* {showConfetti && <ConfettiCelebration color={project?.color} />} */}
      <div className="flex flex-col gap-5">
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${project?.color}10 0%, ${project?.color}17 100%)`,
          }}
        >
          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
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
                  {lockedCount}/{tabs.length} locked
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
                  <Lock className="w-3.5 h-3.5" /> {overallPct}% — Lock all to
                  Go Live
                </>
              )}
            </motion.button>
          </div>
        </div>

        <ProjectSettingsNavigator
          activeTab={activeTab}
          onTabChange={setActiveTab}
          locks={tabLockStatusById}
          tabProgressById={tabProgressById}
          color={color}
          tabs={tabs}
        />

        <AnimatePresence mode="wait">
          {activeTab === "details" && (
            <DetailsTab
              key="details"
              tabId="details"
              color={color}
              project={project}
              locked={!!tabLockStatusById.details}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {activeTab === "contacts" && (
            <ContactsTab
              key="contacts"
              tabId="contacts"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById.contacts}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {activeTab === "dates" && (
            <DatesTab
              key="dates"
              tabId="dates"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById.dates}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {activeTab === "rates-project" && (
            <RatesProjectTab
              key="rates-project"
              tabId="rates-project"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById["rates-project"]}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {activeTab === "rates-crew" && (
            <RatesCrewTab
              key="rates-crew"
              tabId="rates-crew"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById["rates-crew"]}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {activeTab === "rates-construction" && (
            <RatesConstructionTab
              key="rates-construction"
              tabId="rates-construction"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById["rates-construction"]}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {activeTab === "rates-places" && (
            <RatesPlacesTab
              key="rates-places"
              tabId="rates-places"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById["rates-places"]}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {activeTab === "rates-departments" && (
            <RatesDepartmentsTab
              key="rates-departments"
              tabId="rates-departments"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById["rates-departments"]}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {activeTab === "doc-signers" && (
            <DocSignersTab
              key="doc-signers"
              tabId="doc-signers"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById["doc-signers"]}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {activeTab === "contracts-forms" && (
            <ContractsFormsTab
              key="contracts-forms"
              tabId="contracts-forms"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById["contracts-forms"]}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {activeTab === "admin" && (
            <AdminTab
              key="admin"
              tabId="admin"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById["admin"]}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {/* ── CustomTab ── */}
          {activeTab === "custom" && (
            <CustomTab
              key="custom"
              tabId="custom"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById["custom"]}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {/* ── NotificationsTab ── */}
          {activeTab === "notifications" && (
            <NotificationsTab
              key="notifications"
              tabId="notifications"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById["notifications"]}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {activeTab === "timecard" && (
            <TimecardTab
              key="timecard"
              tabId="timecard"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById["timecard"]}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}

          {activeTab === "subscriptions" && (
            <SubscriptionsTab
              key="subscriptions"
              tabId="subscriptions"
              color={color}
              projectId={project.id}
              locked={!!tabLockStatusById["subscriptions"]}
              setTabLockStatusById={setTabLockStatusById}
              setTabProgressById={setTabProgressById}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default ProjectSettings;
