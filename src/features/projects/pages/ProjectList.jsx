import { motion, AnimatePresence } from 'framer-motion';
import {
  Film, Calendar, Star, Users, Clock, Sparkles,
  Play, Pause, CheckCircle, Archive, Award, TrendingUp,
  Search, SlidersHorizontal
} from 'lucide-react';
import { useState } from 'react';
import UrlBreadcrumbs from '../../../shared/components/UrlBasedBreadcrumb';
import { Button } from '../../../shared/components/ui/button';
import ProjectCard from '../components/ProjectCard';

export function ProjectList({ onSelectProject, isDarkMode = false }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const projects = [
    {
      id: 'project-avatar1',
      title: 'AVATAR 1',
      type: 'Feature Film',
      category: 'film',
      period: 'shoot',
      progress: 60,
      role: 'LEAD ANIMATION ARTIST',
      studios: ['Disney Studios', 'Amazon Prime'],
      startDate: '15/01/2024',
      endDate: '30/12/2024',
      rating: 4.5,
      teamSize: 125,
      budget: '£2.5M',
      image: '🎬',
    },
    {
      id: 'project-avatar2',
      title: 'AVATAR 2',
      type: 'Feature Film',
      category: 'film',
      period: 'prep',
      progress: 45,
      role: 'CHARACTER DESIGNER',
      studios: ['Disney Studios', 'Amazon Prime'],
      startDate: '01/03/2024',
      endDate: '15/01/2025',
      rating: 4.2,
      teamSize: 98,
      budget: '£3.2M',
      image: '🎥',
    },
    {
      id: 'project-mumbai',
      title: 'MUMBAI CHRONICLES',
      type: 'Television Series',
      category: 'tv',
      period: 'wrap',
      progress: 85,
      role: 'ANIMATION ARTIST',
      studios: ['Netflix', 'Hotstar'],
      startDate: '10/06/2023',
      endDate: '20/10/2024',
      rating: 4.9,
      teamSize: 67,
      budget: '£1.8M',
      image: '🎭',
    },
    {
      id: 'project-brand',
      title: 'COCA-COLA SUMMER CAMPAIGN',
      type: 'Commercial',
      category: 'commercial',
      period: 'shoot',
      progress: 70,
      role: 'VFX SUPERVISOR',
      studios: ['WPP Studios'],
      startDate: '05/04/2024',
      endDate: '30/06/2024',
      rating: 4.6,
      teamSize: 32,
      budget: '£850K',
      image: '🎨',
    },
    {
      id: 'project-doc',
      title: 'CLIMATE CRISIS: THE TRUTH',
      type: 'Documentary',
      category: 'documentary',
      period: 'prep',
      progress: 25,
      role: 'MOTION GRAPHICS LEAD',
      studios: ['BBC Studios'],
      startDate: '01/11/2024',
      endDate: '15/03/2025',
      rating: 4.3,
      teamSize: 18,
      budget: '£620K',
      image: '🌍',
    },
  ];

  const archivedProjects = [
    {
      id: 'project-tech-doc',
      title: 'TECH STARTUP DOC',
      type: 'Documentary',
      category: 'documentary',
      period: 'wrap',
      progress: 100,
      role: 'MOTION GRAPHICS',
      studios: ['Sony Pictures'],
      startDate: '05/02/2024',
      endDate: '15/09/2024',
      rating: 4.7,
      teamSize: 15,
      budget: '£480K',
      image: '💼',
    },
  ];

  const tabs = [
    { id: 'all', label: 'ALL PROJECTS', icon: Film, color: 'lavender' },
    { id: 'film', label: 'FILMS', icon: Film, color: 'pastel-pink' },
    { id: 'tv', label: 'TELEVISION', icon: Play, color: 'mint' },
    { id: 'commercial', label: 'COMMERCIALS', icon: Award, color: 'peach' },
    { id: 'documentary', label: 'DOCUMENTARIES', icon: TrendingUp, color: 'sky' },
  ];

  const displayedProjects = showArchived ? archivedProjects : projects;
  const filteredProjects = displayedProjects.filter(project => {
    const matchesTab = activeTab === 'all' || project.category === activeTab;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getPeriodColor = (period) => {
    switch (period) {
      case 'prep': return isDarkMode ? 'bg-sky-900/30 text-sky-400 border-sky-700' : 'bg-sky-100 text-blue-800 border-sky-300';
      case 'shoot': return isDarkMode ? 'bg-mint-900/30 text-mint-400 border-mint-700' : 'bg-mint-100 text-green-800 border-mint-300';
      case 'wrap': return isDarkMode ? 'bg-peach-900/30 text-peach-400 border-peach-700' : 'bg-peach-100 text-orange-800 border-peach-300';
      default: return isDarkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPeriodIcon = (period) => {
    switch (period) {
      case 'prep': return Clock;
      case 'shoot': return Play;
      case 'wrap': return CheckCircle;
      default: return Pause;
    }
  };

  const getTabColor = (color) => {
    return {
      lavender: {
        bg: isDarkMode ? 'bg-lavender-900/30' : 'bg-lavender-100',
        text: isDarkMode ? 'text-lavender-400' : 'text-lavender-700',
        border: isDarkMode ? 'border-lavender-700' : 'border-lavender-300',
        active: isDarkMode ? 'bg-gradient-to-r from-lavender-600 to-pastel-pink-600' : 'bg-gradient-to-r from-purple-700 to-pink-700'
      },
      'pastel-pink': {
        bg: isDarkMode ? 'bg-pastel-pink-900/30' : 'bg-pastel-pink-100',
        text: isDarkMode ? 'text-pastel-pink-400' : 'text-pastel-pink-700',
        border: isDarkMode ? 'border-pastel-pink-700' : 'border-pastel-pink-300',
        active: isDarkMode ? 'bg-gradient-to-r from-pastel-pink-600 to-lavender-600' : 'bg-gradient-to-r from-pink-700 to-purple-700'
      },
      mint: {
        bg: isDarkMode ? 'bg-mint-900/30' : 'bg-mint-100',
        text: isDarkMode ? 'text-mint-400' : 'text-mint-700',
        border: isDarkMode ? 'border-mint-700' : 'border-mint-300',
        active: isDarkMode ? 'bg-gradient-to-r from-mint-600 to-sky-600' : 'bg-gradient-to-r from-emerald-700 to-cyan-700'
      },
      peach: {
        bg: isDarkMode ? 'bg-peach-900/30' : 'bg-peach-100',
        text: isDarkMode ? 'text-peach-400' : 'text-peach-700',
        border: isDarkMode ? 'border-peach-700' : 'border-peach-300',
        active: isDarkMode ? 'bg-gradient-to-r from-peach-600 to-pastel-pink-600' : 'bg-gradient-to-r from-orange-700 to-pink-700'
      },
      sky: {
        bg: isDarkMode ? 'bg-sky-900/30' : 'bg-sky-100',
        text: isDarkMode ? 'text-sky-400' : 'text-sky-700',
        border: isDarkMode ? 'border-sky-700' : 'border-sky-300',
        active: isDarkMode ? 'bg-gradient-to-r from-sky-600 to-lavender-600' : 'bg-gradient-to-r from-blue-700 to-purple-700'
      },
    }[color];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumbs */}
      <UrlBreadcrumbs />
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            MY PROJECTS
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
            {filteredProjects.length} {showArchived ? 'ARCHIVED' : 'ACTIVE'} PROJECT{filteredProjects.length !== 1 ? 'S' : ''}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowArchived(!showArchived)}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${showArchived
              ? isDarkMode
                ? 'bg-gradient-to-r from-lavender-600 to-pastel-pink-600 text-white shadow-lg'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-lavender-200'
              }`}
          >
            <Archive className="w-5 h-5" />
            {showArchived ? 'SHOW ACTIVE' : 'SHOW ARCHIVED'}
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-2xl border-2 ${isDarkMode ? 'border-gray-700' : 'border-lavender-200'
        } shadow-sm`}>
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
        <input
          type="text"
          placeholder="SEARCH PROJECTS, ROLES, STUDIOS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2.5 rounded-2xl border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-bold focus:outline-none"
        />
        <SlidersHorizontal className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-lavender-500 transition-colors" />
      </div>


      {/* Tab Navigation */}
      <motion.div
        layout
        transition={{ duration: 0.75, ease: "easeInOut" }}
        className="flex gap-3 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 whitespace-nowrap transition-all ${isActive
                ? `bg-gradient-to-br from-lavender-600 to-mint-500 text-white shadow-lg`
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-lavender-200 dark:border-transparent'
                }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
              {isActive && (
                <span
                  layoutId="activeTabBadge"
                  className="px-2 py-0.5 rounded-full text-xs bg-background/60 backdrop-blur-2xl text-foreground"
                >
                  {filteredProjects.length}
                </span>
              )}
            </Button>
          );
        })}
      </motion.div>


      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + searchQuery}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500 dark:text-gray-400">
              <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-bold text-lg">NO PROJECTS FOUND</p>
              <p className="text-sm mt-2">TRY ADJUSTING YOUR SEARCH OR FILTERS</p>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <ProjectCard project={project} index={index} />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


export default ProjectList