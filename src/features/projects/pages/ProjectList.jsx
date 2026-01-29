import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

import { PageHeader } from "../../../shared/components/PageHeader";
import SearchBar from "../../../shared/components/SearchBar";
import FilterPillTabs from "../../../shared/components/FilterPillTabs";
import { SmartIcon } from "../../../shared/components/SmartIcon";
import { getFullName } from "../../../shared/config/utils";
import ProjectCard from "../components/ProjectCard";

function ProjectList() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  /* -------------------- DATA -------------------- */
  const projects = [
    {
      id: "project-avatar1",
      title: "AVATAR 1",
      type: "Feature Film",
      category: "film",
      period: "shoot",
      progress: 60,
      role: "LEAD ANIMATION ARTIST",
      studios: ["Disney Studios", "Amazon Prime"],
      startDate: "15/01/2024",
      endDate: "30/12/2024",
      rating: 4.5,
      teamSize: 125,
      budget: "£2.5M",
      image: "🎬",
      projectCode: "AVT1"
    },
    {
      id: "project-avatar2",
      title: "AVATAR 2",
      type: "Feature Film",
      category: "film",
      period: "prep",
      progress: 45,
      role: "CHARACTER DESIGNER",
      studios: ["Disney Studios", "Amazon Prime"],
      startDate: "01/03/2024",
      endDate: "15/01/2025",
      rating: 4.2,
      teamSize: 98,
      budget: "£3.2M",
      image: "🎥",
      projectCode: "AVT2"
    },
    {
      id: "project-mumbai",
      title: "MUMBAI CHRONICLES",
      type: "Television Series",
      category: "tv",
      period: "post",
      progress: 85,
      role: "ANIMATION ARTIST",
      studios: ["Netflix", "Hotstar"],
      startDate: "10/06/2023",
      endDate: "20/10/2024",
      rating: 4.9,
      teamSize: 67,
      budget: "£1.8M",
      image: "🎭",
      projectCode: "MBC1"
    },
    {
      id: "project-avatar3",
      title: "AVATAR 3",
      type: "Feature Film",
      category: "film",
      period: "prep",
      progress: 30,
      role: "LEAD ANIMATOR",
      studios: ["20th Century Studios"],
      startDate: "10/02/2024",
      endDate: "15/12/2025",
      rating: 4.0,
      teamSize: 110,
      budget: "£2.8M",
      image: "🎬",
      projectCode: "AVT3"
    },
    {
      id: "project-scifi-series",
      title: "THE EXPANSE REBORN",
      type: "Television Series",
      category: "tv",
      period: "shoot",
      progress: 55,
      role: "VFX SUPERVISOR",
      studios: ["Amazon Studios"],
      startDate: "05/03/2024",
      endDate: "20/11/2024",
      rating: 4.7,
      teamSize: 85,
      budget: "£2.1M",
      image: "🚀",
      projectCode: "EXP1"
    },
  ];

  const archivedProjects = [
    {
      id: "project-tech-doc",
      title: "TECH STARTUP DOC",
      type: "Documentary",
      category: "documentary",
      period: "wrap",
      progress: 100,
      role: "MOTION GRAPHICS",
      studios: ["Sony Pictures"],
      startDate: "05/02/2024",
      endDate: "15/09/2024",
      rating: 4.7,
      teamSize: 15,
      budget: "£480K",
      image: "💼",
      projectCode: "TSD1"
    },
    {
      id: "project-old-film",
      title: "LEGACY PROJECT",
      type: "Feature Film",
      category: "film",
      period: "wrap",
      progress: 100,
      role: "SENIOR ANIMATOR",
      studios: ["Universal Pictures"],
      startDate: "10/01/2023",
      endDate: "25/08/2023",
      rating: 4.4,
      teamSize: 95,
      budget: "£1.9M",
      image: "🎞️",
      projectCode: "LEG1"
    },
  ];

  const tabOptions = [
    { value: "all", label: "ALL PROJECTS", icon: "LayoutGrid" },
    { 
      value: "archived", 
      label: showArchived ? "SHOW ACTIVE" : "SHOW ARCHIVED", 
      icon: "Archive",
      onClick: () => setShowArchived(!showArchived)
    },
  ];

  /* -------------------- FILTERING -------------------- */
  const displayedProjects = showArchived ? archivedProjects : projects;

  const filteredProjects = displayedProjects.filter((project) => {
    const matchesTab =
      activeTab === "all" || project.category === activeTab;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.role.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  /* -------------------- UI -------------------- */
  return (
    <div className=" space-y-6">
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
            onChange={setActiveTab}
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
                onValueChange={(e) => setSearchQuery(e.target.value)}
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
        <motion.div
          key={activeTab + searchQuery}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <Sparkles className="w-14 h-14 mx-auto mb-4 opacity-50" />
              <p className="font-semibold">NO PROJECTS FOUND</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ProjectList;