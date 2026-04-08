import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Progress } from "@/shared/components/ui/progress";
import { useState, useMemo } from "react";
import { PageHeader } from "../../../../shared/components/PageHeader";
import AnimatedCircularProgress from "../components/AnimatedCircularProgress";
import PageRing from "../components/PageRing";
const PROJECT_COLOR = "#7c3aed";
const SETTINGS_PAGES = [
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

function SettingsLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  console.log(pathname);

  const [hoveredPage, setHoveredPage] = useState(null);

  const activeIndex = useMemo(() => {
    const pathSegments = new Set(pathname.split("/"));
    const found = SETTINGS_PAGES.findIndex((page) =>
      pathSegments.has(page.path),
    );
    return found === -1 ? 0 : found;
  }, [pathname]);
  const activePage = SETTINGS_PAGES[activeIndex];
  const previewPage = hoveredPage ?? activePage;
  const previewIndex = hoveredPage
    ? SETTINGS_PAGES.indexOf(hoveredPage)
    : activeIndex;
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < SETTINGS_PAGES.length - 1;

  const goToPrev = () => {
    if (canGoPrev) navigate(SETTINGS_PAGES[activeIndex - 1].path);
  };

  const goToNext = () => {
    if (canGoNext) navigate(SETTINGS_PAGES[activeIndex + 1].path);
  };
  return (
    <>
      <div className="flex flex-col gap-5 overflow-hidden">
        <PageHeader
          title="Project Settings"
          subtitle="AVATAR 1 • 0 / 21"
          icon="Settings"
          extraActions={
            <div className="flex items-center gap-3">
              <AnimatedCircularProgress
                progressPercentage={50}
                projectColor={PROJECT_COLOR}
                size={40}
              />
              <motion.button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[0.76rem] bg-muted text-muted-foreground border border-border opacity-80 cursor-not-allowed"
                disabled
              >
                <Lock className="w-3.5 h-3.5" />
                50% — Lock all to Go Live
              </motion.button>
            </div>
          }
        />
        <div className="rounded-xl bg-card border border-gray-100/80 dark:border-gray-800/50 shadow-sm">
          <div className="flex items-center justify-center py-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToPrev}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3 h-3 text-muted-foreground" />
            </motion.button>
            <AnimatePresence mode="wait">
              <motion.div
                key={previewPage.label}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <span
                  className="flex items-center justify-center w-5 h-5 rounded-full text-[0.55rem] font-semibold"
                  style={{
                    backgroundColor: `${PROJECT_COLOR}15`,
                    color: PROJECT_COLOR,
                  }}
                >
                  {previewIndex + 1}
                </span>

                <span
                  className="text-[0.8rem]"
                  style={{ color: PROJECT_COLOR }}
                >
                  {previewPage.label}
                </span>

                <span
                  className="px-1.5 py-0.5 rounded-md text-[0.6rem]"
                  style={{
                    backgroundColor: `${PROJECT_COLOR}08`,
                    color: `${PROJECT_COLOR}90`,
                  }}
                >
                  20%
                </span>

                <span className="text-muted-foreground text-[0.55rem]">
                  {previewIndex + 1}/{SETTINGS_PAGES.length}
                </span>
              </motion.div>
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToNext}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </motion.button>
          </div>
          <div className="flex flex-col px-5 pb-5 pt-1 gap-1">
            <div className="flex items-center justify-between">
              {SETTINGS_PAGES.map((page, index) => (
                <motion.div
                  key={page.path}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoveredPage(page)}
                  onMouseLeave={() => setHoveredPage(null)}
                  className="relative w-8 h-8 flex items-center justify-center"
                >
                  <NavLink to={page.path} className="contents">
                    {({ isActive }) => (
                      <PageRing isActive={isActive} pageNumber={index + 1} />
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {SETTINGS_PAGES.slice(0, -1).map((page) => (
                <div key={page.path} className="flex-1">
                  <Progress
                    progressColor="bg-green-600"
                    trackColor="bg-muted"
                    value={60}
                    className="h-[5px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 rounded-2xl bg-card border border-gray-100/80 dark:border-gray-800/50 flex items-center justify-between  overflow-hidden"
        >
          <div className="flex items-center gap-4">
            <AnimatedCircularProgress
              progressPercentage={50}
              projectColor={PROJECT_COLOR}
              size={40}
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-foreground font-medium text-[0.95rem]">
                {activePage.label}
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[0.6rem] text-muted-foreground">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Auto-saving changes
              </span>
            </div>
          </div>
        </motion.div>
        <Outlet />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mb-2 rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3.5 bg-card border border-gray-100/80 dark:border-gray-800/60 rounded-2xl">
            <motion.button
              onClick={goToPrev}
              disabled={!canGoPrev}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                fontSize: "0.7rem",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                background: "var(--card)",
              }}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </motion.button>

            {/* Lock + Next — grouped right */}
            <div className="flex items-center gap-2">
              <motion.button
                disabled
                whileHover={undefined}
                whileTap={undefined}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                style={{ fontSize: "0.7rem" }}
              >
                <Lock className="w-3.5 h-3.5" />
                Complete to Lock
              </motion.button>

              <motion.button
                onClick={goToNext}
                disabled={!canGoNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  fontSize: "0.7rem",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  background: "var(--card)",
                }}
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SettingsLayout;
