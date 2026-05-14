import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

import { PageHeader } from "../../../shared/components/PageHeader";
import SearchBar from "../../../shared/components/SearchBar";
import FilterPillTabs from "../../../shared/components/FilterPillTabs";
import { SmartIcon } from "../../../shared/components/SmartIcon";
import { getFullName } from "../../../shared/config/utils";
import ProjectCard from "../components/ProjectCard";

import {
  getAllProjectsThunk,
} from "../store/project.thunks";
import {
  setSearch,
  setApprovalStatus,
  setCurrentPage,
  clearAllProjects,
} from "../store/project.slice";

function ProjectList() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Redux state ──────────────────────────────────────────────────────────
  const {
    projects,
    isFetching,
    search: reduxSearch,
    total,
    page,
    pages,
    limit,
  } = useSelector((state) => state.project);

  // ── Local UI state (same as before) ─────────────────────────────────────
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ── Tab options: filter by productionType ────────────────────────────────
  const tabOptions = [
    { value: "all",          label: "ALL PROJECTS",  icon: "LayoutGrid" },
    { value: "Feature Film", label: "FILMS",         icon: "Film" },
    { value: "Television",   label: "TV",            icon: "Tv" },
    { value: "Documentary",  label: "DOCUMENTARY",   icon: "BookOpen" },
    { value: "Commercial",   label: "COMMERCIAL",    icon: "Megaphone" },
    { value: "Music Video",  label: "MUSIC VIDEO",   icon: "Music" },
  ];

  // ── Fetch approved projects whenever filters change ──────────────────────
  useEffect(() => {
    const params = {
      approvalStatus: "approved",
      page: 1,
      limit,
      sort: "newest",
    };

    if (activeTab !== "all") {
      params.productionType = activeTab;
    }

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    dispatch(getAllProjectsThunk(params));
  }, [activeTab, searchQuery, dispatch, limit]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearAllProjects());
    };
  }, [dispatch]);

  // ── Load more (pagination) ───────────────────────────────────────────────
  const handleLoadMore = () => {
    if (page < pages) {
      const params = {
        approvalStatus: "approved",
        page: page + 1,
        limit,
        sort: "newest",
      };
      if (activeTab !== "all") params.productionType = activeTab;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      dispatch(setCurrentPage(page + 1));
      dispatch(getAllProjectsThunk(params));
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={
          <>
            Welcome back,{" "}
            <span className="text-primary">
              {getFullName(currentUser)}
            </span>
          </>
        }
        icon="Film"
        secondaryActions={[
          {
            label: "CREATE PROJECT",
            icon: "Plus",
            variant: "default",
            clickAction: () => navigate("/projects/create"),
          },
        ]}
      />

      {/* Filter Tabs and Search Icon in Same Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Filter Tabs */}
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

        {/* Search Icon/Input */}
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="w-64 lg:w-80">
              <SearchBar
                placeholder="SEARCH PROJECTS OR ROLES..."
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
              <SmartIcon
                icon="Search"
                className="w-5 h-5 text-primary-foreground stroke-[2.5]"
              />
            </button>
          )}
          {isSearchOpen && (
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <SmartIcon icon="X" className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        {isFetching && projects.length === 0 ? (
          /* ── Loading skeleton ── */
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-xl bg-muted animate-pulse"
              />
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
                <p className="font-semibold">NO APPROVED PROJECTS FOUND</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "No approved projects yet. Create and submit one for approval."}
                </p>
              </div>
            ) : (
              projects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={index}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load More — only show if more pages exist */}
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

      {/* Subtle loading indicator when fetching more pages */}
      {isFetching && projects.length > 0 && (
        <div className="flex justify-center py-4">
          <SmartIcon icon="Loader2" className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export default ProjectList;