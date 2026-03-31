import SettingsHeader from "@/features/projects/settings/components/SettingsHeader";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";

function SettingsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const projectColor = "#2563eb";

  const pages = [
    { path: "details", label: "Details" },
    { path: "contacts", label: "Contacts" },
    { path: "dates", label: "Dates" },
    { path: "project", label: "Project" },
    { path: "standard-crew", label: "Standard Crew" },
    { path: "construction", label: "Construction" },
    { path: "places", label: "Places" },
    { path: "departments", label: "Departments" },
    { path: "signatures-workflows", label: "Signatures & Workflow" },
    { path: "contracts-forms", label: "Contracts & Forms" },
    { path: "admin", label: "Admin" },
    { path: "custom", label: "Custom" },
    { path: "notifications", label: "Notifications" },
    { path: "timecard", label: "Timecard" },
    { path: "subscriptions", label: "Subscriptions" },
    { path: "design-style", label: "Design & Style" },
    { path: "layout", label: "Layout" },
    { path: "app-settings", label: "App Settings" },
    { path: "chat", label: "Chat" },
    { path: "calendar", label: "Calendar" },
    { path: "ai-knowledge-base", label: "AI Knowledge Base" },
  ];

  const currentPath = location.pathname.split("/").pop();
  const currentIndex = pages.findIndex((p) => p.path === currentPath);
  const currentPage = pages[currentIndex] || pages[0];

  const MotionNavLink = motion(NavLink);

  const goNext = () => {
    if (currentIndex < pages.length - 1) {
      navigate(pages[currentIndex + 1].path);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      navigate(pages[currentIndex - 1].path);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-5 overflow-hidden">
        <SettingsHeader />
        <div className="rounded-xl bg-card border border-gray-100/80 dark:border-gray-800/50 shadow-sm">
          <div className="flex items-center justify-center py-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goPrev}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-3 h-3 text-muted-foreground" />
            </motion.button>
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <span
                  className="flex items-center justify-center w-5 h-5 rounded-full text-[0.55rem] font-semibold"
                  style={{
                    backgroundColor: `${projectColor}15`,
                    color: projectColor,
                  }}
                >
                  {currentIndex + 1}
                </span>

                <span className="text-[0.8rem]" style={{ color: projectColor }}>
                  {currentPage.label}
                </span>

                <span
                  className="px-1.5 py-0.5 rounded-md text-[0.6rem]"
                  style={{
                    backgroundColor: `${projectColor}08`,
                    color: `${projectColor}90`,
                  }}
                >
                  40%
                </span>

                <span className="text-muted-foreground text-[0.55rem]">
                  {currentIndex + 1}/{pages.length}
                </span>
              </motion.div>
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goNext}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </motion.button>
          </div>
          <div className="flex flex-col px-5 pb-5 pt-1 gap-1">
            <div className="flex items-center justify-between">
              {pages.map((page, index) => (
                <MotionNavLink
                  key={page.path}
                  to={page.path}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative w-8 h-8 flex items-center justify-center"
                >
                  {({ isActive }) => {
                    const size = isActive ? 32 : 26;
                    const strokeWidth = isActive ? 2.5 : 2;
                    const radius = isActive ? (size - strokeWidth) / 2 : 11;
                    const circumference = 2 * Math.PI * radius;

                    if (isActive) {
                      return (
                        <>
                          <svg
                            width={size}
                            height={size}
                            className="absolute -rotate-90"
                          >
                            <circle
                              cx={size / 2}
                              cy={size / 2}
                              r={radius}
                              stroke={`${projectColor}20`}
                              strokeWidth={strokeWidth}
                              fill="none"
                            />

                            <motion.circle
                              cx={size / 2}
                              cy={size / 2}
                              r={radius}
                              stroke={projectColor}
                              strokeWidth={strokeWidth}
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={circumference}
                              initial={{ strokeDashoffset: circumference }}
                              animate={{
                                strokeDashoffset:
                                  circumference - (20 / 100) * circumference,
                              }}
                              transition={{ duration: 0.6 }}
                            />
                          </svg>

                          <div
                            className="rounded-full flex items-center justify-center text-white text-[0.56rem] font-semibold"
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: projectColor,
                            }}
                          >
                            {index + 1}
                          </div>
                        </>
                      );
                    }

                    // inactive
                    return (
                      <>
                        <svg
                          width={size}
                          height={size}
                          className="absolute -rotate-90"
                        >
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={11}
                            stroke={`${projectColor}15`}
                            strokeWidth={strokeWidth}
                            fill="none"
                          />

                          <motion.circle
                            cx={size / 2}
                            cy={size / 2}
                            r={11}
                            stroke={projectColor}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: circumference }}
                            animate={{
                              strokeDashoffset:
                                circumference - (20 / 100) * circumference,
                            }}
                            transition={{ duration: 0.6 }}
                          />
                        </svg>

                        <div
                          className="rounded-full flex items-center justify-center text-[0.48rem]"
                          style={{
                            width: 18,
                            height: 18,
                            backgroundColor: `${projectColor}15`,
                            color: projectColor,
                          }}
                        >
                          {index + 1}
                        </div>
                      </>
                    );
                  }}
                </MotionNavLink>
              ))}
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default SettingsLayout;
