import { PageHeader } from "@/shared/components/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  Clock,
  Users,
  MessageSquare,
  DollarSign,
  ShoppingCart,
  Truck,
  Play,
  Car,
  MapPin,
  Cloud,
  Star,
  Clapperboard,
  Archive,
  Shirt,
  UtensilsCrossed,
  ScrollText,
  ClipboardList,
  Package,
  PawPrint,
  Megaphone,
  BarChart2,
  FileSearch,
  UserCheck,
  CalendarDays,
  Wallet,
  FolderOpen,
  PenLine,
} from "lucide-react";

function ProjectDashboard() {
  const { projectName } = useParams();
  const MotionLink = motion.create(Link);
  const navigate = useNavigate();
  const color = "#7c3aed"
  const applications = [
    {
      id: "project-calendar",
      name: "CALENDAR",
      icon: Calendar,
      description: "Master production timeline & milestones",
      notifications: 3,
    },
    {
      id: "call-sheets",
      name: "CALL SHEETS",
      icon: FileText,
      description: "Daily call sheets & crew notifications",
      notifications: 7,
    },
    {
      id: "shooting-schedule",
      name: "SHOOTING SCHEDULE",
      icon: Clapperboard,
      description: "Day-by-day shooting plan & scene order",
      notifications: 2,
    },
    {
      id: "asset",
      name: "ASSET",
      icon: Archive,
      description: "Track & manage all production assets",
    },
    {
      id: "costume",
      name: "COSTUME",
      icon: Shirt,
      description: "Wardrobe tracking & fitting schedules",
      notifications: 1,
    },
    {
      id: "catering",
      name: "CATERING",
      icon: UtensilsCrossed,
      description: "Meal planning & dietary requirements",
    },
    {
      id: "accounts",
      name: "ACCOUNTS",
      icon: DollarSign,
      description: "Financial tracking & expense management",
      notifications: 5,
    },
    {
      id: "script",
      name: "SCRIPT",
      icon: ScrollText,
      description: "Script versions, revisions & annotations",
      notifications: 1,
    },
    {
      id: "market",
      name: "MARKET",
      icon: ShoppingCart,
      description: "Equipment & supply procurement",
    },
    {
      id: "transport",
      name: "TRANSPORT",
      icon: Truck,
      description: "Vehicle scheduling & logistics",
    },
    {
      id: "eplayer",
      name: "E PLAYER",
      icon: Play,
      description: "Dailies playback & review platform",
    },
    {
      id: "forms",
      name: "FORMS",
      icon: ClipboardList,
      description: "Custom forms, approvals & sign-offs",
    },
    {
      id: "props-assets",
      name: "PROPS",
      icon: Package,
      description: "Props inventory & continuity tracking",
    },
    {
      id: "animals",
      name: "ANIMALS",
      icon: PawPrint,
      description: "Animal wrangling schedules & welfare",
    },
    {
      id: "vehicles",
      name: "VEHICLES",
      icon: Car,
      description: "Picture vehicles & fleet management",
    },
    {
      id: "locations",
      name: "LOCATIONS",
      icon: MapPin,
      description: "Location scouting, permits & maps",
      notifications: 2,
    },
    {
      id: "cloud",
      name: "CLOUD",
      icon: Cloud,
      description: "Cloud storage & file sharing",
    },
    {
      id: "timesheets",
      name: "TIMESHEETS",
      icon: Clock,
      description: "Crew hours, overtime & payroll data",
      notifications: 12,
    },
    {
      id: "notice-board",
      name: "NOTICE BOARD",
      icon: Megaphone,
      description: "Company-wide announcements & updates",
      notifications: 4,
    },
    {
      id: "project-chat",
      name: "PROJECT CHAT",
      icon: MessageSquare,
      description: "Real-time team messaging & channels",
      notifications: 18,
    },
    {
      id: "script-breakdown",
      name: "SCRIPT BREAKDOWN",
      icon: FileSearch,
      description: "Scene-by-scene element breakdowns",
    },
    {
      id: "production-reports",
      name: "PRODUCTION REPORTS",
      icon: BarChart2,
      description: "Daily progress reports & analytics",
      notifications: 1,
    },
    {
      id: "casting-calls",
      name: "CASTING CALLS",
      icon: Star,
      description: "Casting sessions & talent management",
    },
    {
      id: "crew",
      name: "CREW",
      icon: Users,
      description: "Crew database, roles & availability",
      notifications: 3,
    },
    {
      id: "cast",
      name: "CAST",
      icon: UserCheck,
      description: "Cast contracts, schedules & contacts",
    },
    {
      id: "schedule",
      name: "SCHEDULE",
      icon: CalendarDays,
      description: "Overall project schedule & Gantt view",
    },
    {
      id: "budget",
      name: "BUDGET",
      icon: Wallet,
      description: "Budget tracking, actuals & forecasts",
      notifications: 2,
    },
    {
      id: "documents",
      name: "DOCUMENTS",
      icon: FolderOpen,
      description: "Contracts, releases & legal docs",
    },
    {
      id: "eaarth-sign",
      name: "EAARTH SIGN",
      icon: PenLine,
      description: "Digital signatures & document signing",
    },
  ];
  return (
    <>
      <div className="space-y-6 mx-auto">
        <PageHeader
          title="PROJECT DASHBOARD"
          icon="Film"
          secondaryActions={[
            {
              label: "Settings",
              icon: "Settings",
              variant: "default",
              clickAction: () => navigate(`/projects/${projectName}/settings`),
            },
          ]}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {applications.map((app, i) => {
            const Icon = app.icon;
            const notificationCount = app.notifications || 0;

            return (
              <MotionLink
                key={app.id}
                // to={`/projects/${projectName}/${app.name.toLowerCase()}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                className="relative group flex flex-col items-center justify-center gap-3 p-4 rounded-xl border bg-card shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className="absolute top-0 left-6 right-6 h-0.75 rounded-b-full opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ backgroundColor: color }}
                />

                <div className="relative">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${color}1A`, color: color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {notificationCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                        delay: 0.15 + i * 0.02,
                      }}
                      className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 rounded-full bg-destructive text-primary-foreground text-[10px] font-semibold ring-2 ring-card"
                    >
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </motion.span>
                  )}
                </div>
                <span className="text-xs text-center text-muted-foreground">
                  {app.name}
                </span>
              </MotionLink>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ProjectDashboard;
