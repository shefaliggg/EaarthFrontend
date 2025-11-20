<<<<<<< HEAD
<<<<<<< HEAD
import { motion, AnimatePresence } from 'framer-motion';
import {
=======
import { motion, AnimatePresence } from 'framer-motion';
import { 
>>>>>>> shanid/auth
  Film, Calendar, Star, Users, Clock, Sparkles,
  Play, Pause, CheckCircle, Archive, Award, TrendingUp,
  Search, SlidersHorizontal
} from 'lucide-react';
import { useState } from 'react';
import UrlBreadcrumbs from '../../../shared/components/UrlBasedBreadcrumb';
<<<<<<< HEAD
import { Button } from '../../../shared/components/ui/button';
import ProjectCard from '../components/ProjectCard';


export function ProjectList() {
=======

export function ProjectList({ onSelectProject, isDarkMode = false }) {
>>>>>>> shanid/auth
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

<<<<<<< HEAD

=======
>>>>>>> shanid/auth
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

<<<<<<< HEAD

=======
>>>>>>> shanid/auth
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

<<<<<<< HEAD

=======
>>>>>>> shanid/auth
  const tabs = [
    { id: 'all', label: 'ALL PROJECTS', icon: Film, color: 'lavender' },
    { id: 'film', label: 'FILMS', icon: Film, color: 'pastel-pink' },
    { id: 'tv', label: 'TELEVISION', icon: Play, color: 'mint' },
    { id: 'commercial', label: 'COMMERCIALS', icon: Award, color: 'peach' },
    { id: 'documentary', label: 'DOCUMENTARIES', icon: TrendingUp, color: 'sky' },
  ];

<<<<<<< HEAD

=======
>>>>>>> shanid/auth
  const displayedProjects = showArchived ? archivedProjects : projects;
  const filteredProjects = displayedProjects.filter(project => {
    const matchesTab = activeTab === 'all' || project.category === activeTab;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
<<<<<<< HEAD
      project.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-3 py-0 space-y-6">
      <UrlBreadcrumbs />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            MY PROJECTS
          </h1>
          <p className="text-sm mt-1 text-gray-700 dark:text-gray-400">
            {filteredProjects.length} {showArchived ? 'ARCHIVED' : 'ACTIVE'} PROJECT{filteredProjects.length !== 1 ? 'S' : ''}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant={"outline"}
            size={"lg"}
            onClick={() => setShowArchived(!showArchived)}
            className={`${showArchived
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 dark:from-lavender-600 dark:to-pastel-pink-600 text-white shadow-lg dark:hover:text-black'
              : 'text-gray-700 dark:text-gray-300 hover:bg-mint-200 dark:hover:text-black dark:hover:bg-lavender-700 border-2 hover:border-mint-200'
              }`}
          >
            <Archive className="w-5 h-5" />
            {showArchived ? 'SHOW ACTIVE' : 'SHOW ARCHIVED'}
          </Button>
        </div>
      </div>


      {/* Search Bar */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl border-2 shadow-md dark:shadow-shadow">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
=======
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
      <UrlBreadcrumbs/>
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
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
              showArchived
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
      <div className={`relative ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-2xl border-2 ${
        isDarkMode ? 'border-gray-700' : 'border-lavender-200'
      } shadow-sm`}>
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
>>>>>>> shanid/auth
        <input
          type="text"
          placeholder="SEARCH PROJECTS, ROLES, STUDIOS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
<<<<<<< HEAD
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
=======
          className={`w-full pl-12 pr-4 py-4 rounded-2xl ${
            isDarkMode 
              ? 'bg-transparent text-white placeholder-gray-400' 
              : 'bg-transparent text-gray-900 placeholder-gray-500'
          } font-bold focus:outline-none`}
        />
        <SlidersHorizontal className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        } cursor-pointer hover:text-lavender-500 transition-colors`} />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const colors = getTabColor(tab.color);
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-3 whitespace-nowrap transition-all ${
                isActive
                  ? `${colors?.active} text-white shadow-lg`
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-800 hover:bg-gray-50 border-2 border-lavender-200'
              }`}
>>>>>>> shanid/auth
            >
              <Icon className="w-5 h-5" />
              {tab.label}
              {isActive && (
<<<<<<< HEAD
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

=======
                <motion.span
                  layoutId="activeTabBadge"
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    isDarkMode ? 'bg-white/20' : 'bg-white/30'
                  }`}
                >
                  {filteredProjects.length}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
>>>>>>> shanid/auth

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + searchQuery}
<<<<<<< HEAD
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500 dark:text-gray-400">
=======
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.length === 0 ? (
            <div className={`col-span-full text-center py-16 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
>>>>>>> shanid/auth
              <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-bold text-lg">NO PROJECTS FOUND</p>
              <p className="text-sm mt-2">TRY ADJUSTING YOUR SEARCH OR FILTERS</p>
            </div>
          ) : (
<<<<<<< HEAD
            filteredProjects.map((project, index) => (
                <ProjectCard project={project} index={index} />
            ))
=======
            filteredProjects.map((project, index) => {
              const PeriodIcon = getPeriodIcon(project.period);
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  onClick={() => onSelectProject?.(project.id)}
                  className={`cursor-pointer rounded-3xl ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-750' 
                      : 'bg-white hover:bg-gray-50'
                  } border-2 ${
                    isDarkMode ? 'border-gray-700' : 'border-lavender-200'
                  } shadow-lg hover:shadow-xl transition-all overflow-hidden`}
                >
                  {/* Project Header with Image */}
                  <div className={`h-32 bg-gradient-to-br ${
                    project.category === 'film' ? 'from-lavender-400 to-pastel-pink-400' :
                    project.category === 'tv' ? 'from-mint-400 to-sky-400' :
                    project.category === 'commercial' ? 'from-peach-400 to-pastel-pink-400' :
                    'from-sky-400 to-lavender-400'
                  } flex items-center justify-center relative`}>
                    <div className="text-6xl">{project.image}</div>
                    {/* Rating Badge */}
                    {project.rating && (
                      <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl ${
                        isDarkMode ? 'bg-gray-900/70' : 'bg-white/90'
                      } backdrop-blur-sm flex items-center gap-1.5`}>
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className={`text-sm font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {project.rating}
                        </span>
                      </div>
                    )}
                    {/* Period Badge */}
                    <div className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-xl border-2 ${getPeriodColor(project.period)} backdrop-blur-sm flex items-center gap-1.5`}>
                      <PeriodIcon className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">{project.period}</span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className={`font-bold text-lg mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {project.title}
                      </h3>
                      <p className={`text-xs font-bold ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                        {project.type}
                      </p>
                    </div>

                    {/* Role */}
                    <div className={`px-4 py-2 rounded-xl ${
                      isDarkMode ? 'bg-gray-700' : 'bg-lavender-50'
                    }`}>
                      <p className={`text-xs font-bold ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                        YOUR ROLE
                      </p>
                      <p className={`font-bold ${
                        isDarkMode ? 'text-lavender-400' : 'text-purple-700'
                      }`}>
                        {project.role}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          PROGRESS
                        </span>
                        <span className={`text-xs font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {project.progress}%
                        </span>
                      </div>
                      <div className={`h-2 rounded-full ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      } overflow-hidden`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                          className={`h-full rounded-full ${
                            project.category === 'film' ? 'bg-gradient-to-r from-lavender-400 to-pastel-pink-400' :
                            project.category === 'tv' ? 'bg-gradient-to-r from-mint-400 to-sky-400' :
                            project.category === 'commercial' ? 'bg-gradient-to-r from-peach-400 to-pastel-pink-400' :
                            'bg-gradient-to-r from-sky-400 to-lavender-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className={`px-3 py-2 rounded-xl ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      } text-center`}>
                        <Users className={`w-4 h-4 mx-auto mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-xs font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {project.teamSize}
                        </p>
                      </div>
                      <div className={`px-3 py-2 rounded-xl ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      } text-center`}>
                        <Calendar className={`w-4 h-4 mx-auto mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-xs font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {project.startDate.split('/')[1]}/{project.startDate.split('/')[2]}
                        </p>
                      </div>
                      <div className={`px-3 py-2 rounded-xl ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      } text-center`}>
                        <Award className={`w-4 h-4 mx-auto mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-xs font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {project.budget}
                        </p>
                      </div>
                    </div>

                    {/* Studios */}
                    <div className="flex flex-wrap gap-2">
                      {project.studios.map((studio, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            isDarkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {studio}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })
>>>>>>> shanid/auth
          )}
        </motion.div>
      </AnimatePresence>

<<<<<<< HEAD

      <style dangerouslySetInnerHTML={{
        __html: `
=======
      <style dangerouslySetInnerHTML={{__html: `
>>>>>>> shanid/auth
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

<<<<<<< HEAD

export default ProjectList
=======
import React from 'react'

function ProjectList() {
  return (
    <div>ProjectList</div>
  )
}

export default ProjectList
>>>>>>> bc8daad (refactor(routes) : refactor routes and add new routes and their pages)
=======
export default ProjectList
>>>>>>> shanid/auth
