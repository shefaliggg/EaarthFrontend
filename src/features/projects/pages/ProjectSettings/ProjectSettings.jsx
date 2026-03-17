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

function ProjectSettings() {
  const { projectName } = useParams();
  const project = projects.find((p) => p.id === projectName);

  const color = project?.color;
  const overallPct = 65;
  const allLocked = false;
  const lockedCount = 9;

  const [showConfetti, setShowConfetti] = useState(true);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const [tabLockStatusById, setTabLockStatusById] = useState({});
  const [tabProgressById, setTabProgressById] = useState({});

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
                  <Lock className="w-3.5 h-3.5" />
                  {overallPct}% — Lock all to Go Live
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
        </AnimatePresence>
      </div>
    </>
  );
}

export default ProjectSettings;
