// src/features/projects/pages/ProjectList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

import { PageHeader }      from "../../../shared/components/PageHeader";
import SearchBar           from "../../../shared/components/SearchBar";
import FilterPillTabs      from "../../../shared/components/FilterPillTabs";
import { SmartIcon }       from "../../../shared/components/SmartIcon";
import { getFullName }     from "../../../shared/config/utils";
import ProjectCard         from "../components/ProjectCard";
import { useAuth }         from "../../auth/context/AuthContext";
import { getAllProjectsThunk } from "../store/project.thunks";
import { setCurrentPage, clearAllProjects } from "../store/project.slice";

// ── Role helper — affiliations[] is the source of truth ──────────────────────
// Mirrors DashboardLayout and the backend check exactly.
// Do NOT use user.userType — it's deprecated.

function checkIsStudioAdmin(user) {
  if (!Array.isArray(user?.affiliations)) return false;
  return user.affiliations.some(
    (a) => a.orgType === "studio" && a.role === "studio_admin" && a.status === "active"
  );
}

function ProjectList() {
  const { user }  = useAuth();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  // Determine role once — used for UI gating and empty state messaging
  const isStudioAdmin = checkIsStudioAdmin(user);

  // ── Redux state ───────────────────────────────────────────────────────────
  const { projects, isFetching, total, page, pages, limit } =
    useSelector((state) => state.project);

  // ── Local UI state ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]       = useState("all");
  const [searchQuery, setSearchQuery]   = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const tabOptions = [
    { value: "all",          label: "ALL PROJECTS", icon: "LayoutGrid" },
    { value: "Feature Film", label: "FILMS",        icon: "Film"       },
    { value: "Television",   label: "TV",           icon: "Tv"         },
  ];

  // ── Fetch projects whenever filters change ────────────────────────────────
  //
  // The thunk decides which endpoint to call based on the user's role
  // (reads affiliations[] from Redux auth state):
  //
  //   Studio Admin → GET /productions        (all studio productions)
  //   Crew         → GET /my-projects        (only completed-contract projects)
  //
  // Crew users never see filters applied on the client side — the backend
  // already scopes by ProjectMember records.
  useEffect(() => {
    const params = { page: 1, limit, sort: "newest" };

    if (activeTab !== "all")   params.productionType = activeTab;
    if (searchQuery.trim())    params.search         = searchQuery.trim();

    dispatch(getAllProjectsThunk(params));
  }, [activeTab, searchQuery, dispatch, limit]);

  useEffect(() => {
    return () => { dispatch(clearAllProjects()); };
  }, [dispatch]);

  // ── Load more (pagination — studio admin only, crew gets all at once) ─────
  const handleLoadMore = () => {
    if (page < pages) {
      const params = { page: page + 1, limit, sort: "newest" };
      if (activeTab !== "all") params.productionType = activeTab;
      if (searchQuery.trim())  params.search         = searchQuery.trim();
      dispatch(setCurrentPage(page + 1));
      dispatch(getAllProjectsThunk(params));
    }
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  const emptyMessage = searchQuery
    ? "Try adjusting your search query."
    : isStudioAdmin
      ? "No projects yet. Create and submit one for approval."
      : "No projects assigned to you yet. Your project will appear here once your contract is fully signed.";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/*
       * Page header
       *
       * CREATE PROJECT — STUDIO ADMIN ONLY.
       * Crew users see no action buttons.
       * Source of truth: affiliations[] via checkIsStudioAdmin().
       */}
      <PageHeader
        title={
          <>
            Welcome back,{" "}
            <span className="text-primary">{getFullName(user)}</span>
          </>
        }
        icon="Film"
        secondaryActions={
          isStudioAdmin
            ? [
                {
                  label:       "CREATE PROJECT",
                  icon:        "Plus",
                  variant:     "default",
                  clickAction: () => navigate("/projects/create"),
                },
              ]
            : []
        }
      />

      {/* Filter row — only show type filter for studio admins; crew has no filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="flex-shrink-0">
            <FilterPillTabs
              options={tabOptions}
              value={activeTab}
              onChange={(val) => {
                setActiveTab(val);
                dispatch(setCurrentPage(1));
              }}
              transparentBg={true}
            />
          </div>

        {/* Search — available to both roles */}
        <div className="flex items-center gap-2 ml-auto">
          {isSearchOpen ? (
            <div className="w-64 lg:w-80">
              <SearchBar
                placeholder={isStudioAdmin ? "SEARCH PROJECTS OR ROLES..." : "SEARCH PROJECTS..."}
                value={searchQuery}
                onValueChange={setSearchQuery}
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              <SmartIcon icon="Search" className="w-5 h-5 text-primary-foreground stroke-[2.5]" />
            </button>
          )}
          {isSearchOpen && (
            <button
              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <SmartIcon icon="X" className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Projects grid */}
      <AnimatePresence mode="wait">
        {isFetching && projects.length === 0 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={activeTab + searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <Sparkles className="w-14 h-14 mx-auto mb-4 opacity-50" />
                <p className="font-semibold">
                  {isStudioAdmin ? "NO PROJECTS FOUND" : "NO PROJECTS ASSIGNED"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{emptyMessage}</p>
              </div>
            ) : (
              projects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load more — only relevant for studio admin (paginated endpoint) */}
      {!isFetching && page < pages && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm"
          >
            LOAD MORE ({total - projects.length} remaining)
          </button>
        </div>
      )}

      {isFetching && projects.length > 0 && (
        <div className="flex justify-center py-4">
          <SmartIcon icon="Loader2" className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export default ProjectList;