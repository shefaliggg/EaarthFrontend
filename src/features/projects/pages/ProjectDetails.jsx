import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { ProjectActivities } from './ProjectActivities';
// import { ProjectAppsSimple } from './ProjectAppsSimple';
// import { CalendarEnhanced } from './CalendarEnhanced';
// import { ProjectCastCrew } from './ProjectCastCrew';
// import { CloudStorage } from './CloudStorage';
// import { ProjectDepartments } from './ProjectDepartments';
// import { NoticeBoard } from './NoticeBoard';
// import { ProjectSections } from './ProjectSections';
// import { ProjectChat } from './ProjectChat';
// import { ProjectTimeline } from './ProjectTimeline';
// import { Tasks } from './Tasks';
import { useFavorites } from '../hooks/useFavorites';
import ProjectActionGridCard from '../components/ProjectActionGridCard';
import { CheckSquare, ChevronRight, Star } from 'lucide-react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ViewToggleButton from '../../../shared/components/ViewToggleButton';
import UrlBreadcrumbs from '../../../shared/components/UrlBasedBreadcrumb';
import ProjectActionListCard from '../components/ProjectActionListCard';
// import { TimesheetsPage } from './TimesheetsPage';
// import { 
//   div, 
//   UniversalPageHeader, 
//   UniversalCard,
//   UniversalButton,
//   div
// } from './UniversalComponents';

export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isFavorite } = useFavorites('project-favorites');
  let isDarkMode = false
  const { projectName } = useParams();
  const isChildRoute = location.pathname.split("/").length > 3;


  const projectData = {
    'avatar1': {
      id: 'project-avatar1',
      name: 'AVATAR 1',
      color: 'from-purple-600 to-purple-700',
      period: 'SHOOT',
      role: 'LEAD ANIMATION ARTIST',
      progress: 70,
      pendingTasks: 12,
      completed: 34,
      upcomingEvents: 8,
      newNotices: 3,
    },
    'avatar2': {
      id: 'project-avatar2',
      name: 'AVATAR 2',
      color: 'from-purple-600 to-purple-700',
      period: 'PREP',
      role: 'CHARACTER DESIGNER',
      progress: 45,
      pendingTasks: 8,
      completed: 22,
      upcomingEvents: 5,
      newNotices: 2,
    },
    'mumbai': {
      id: 'project-mumbai',
      name: 'MUMBAI CHRONICLES',
      color: 'from-purple-600 to-purple-700',
      period: 'WRAP',
      role: 'VFX ARTIST',
      progress: 85,
      pendingTasks: 3,
      completed: 67,
      upcomingEvents: 2,
      newNotices: 1,
    },
  };

  const projectInfo = projectData["avatar1"];

  const mainFeatures = [
    { id: 'activities', label: 'ACTIVITIES', icon: "Activity", subtitle: 'View all project activities and updates' },
    { id: 'apps', label: 'APPS', icon: "Grid", subtitle: 'Access project applications and tools' },
    { id: 'calendar', label: 'CALENDAR', icon: "Calendar", subtitle: 'Manage project schedule and events' },
    { id: 'call-sheets', label: 'CALL SHEETS', icon: "BookOpen", subtitle: 'Daily call sheets and production info' },
    { id: 'cast-crew', label: 'CAST & CREW', icon: "Users", subtitle: 'Manage cast and crew members' },
    { id: 'task-cloud-storage', label: 'CLOUD STORAGE', icon: "Cloud", subtitle: 'Access project files and documents' },
    { id: 'departments', label: 'DEPARTMENTS', icon: "Layers", subtitle: 'Department organization and roles' },
    { id: 'notice-board', label: 'NOTICE BOARD', icon: "Bell", subtitle: 'Important announcements and notices' },
    { id: 'on-boarding', label: 'ON BOARDING', icon: "UserPlus", subtitle: 'Onboard new team members' },
    { id: 'project-chat', label: 'PROJECT CHAT', icon: "MessageSquare", subtitle: 'Team communication and discussions' },
    { id: 'shooting-schedule', label: 'SHOOTING SCHEDULE', icon: "CalendarDays", subtitle: 'Plan and track shooting schedule' },
    { id: 'tasks', label: 'TASKS', icon: "CheckSquare", subtitle: 'Task management and tracking' },
    { id: 'timeline', label: 'TIMELINE', icon: "Clock", subtitle: 'Project timeline and milestones' },
    { id: 'settings', label: 'SETTINGS', icon: "Settings", subtitle: 'Project settings and configuration' },
  ];

  if (isChildRoute) {
    return (
      <div className="min-h-screen">
        <Outlet />
      </div>
    );
  }

  // Overview page with category cards
  return (
    <div className={`min-h-screen`}>
      <UrlBreadcrumbs />

      <div className={`mt-6 mb-4 pb-6 border-b  `}>
        <div className="flex items-center gap-6">

          <div className="flex items-center gap-4 flex-1">
            {/* Project Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-xl bg-purple-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {projectInfo?.name.substring(0, 2) || 'PR'}
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border border-white">
                <CheckSquare className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Project Info */}
            <div>
              <h1 className={`text-2xl font-bold dark:text-white text-gray-900`}>
                {projectInfo?.name || 'PROJECT'}
              </h1>
              <p className={`text-sm mt-1 dark:text-gray-400 text-gray-600`}>
                {projectInfo?.role || 'Project Role'} • {projectInfo?.period || 'Period'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="px-3 py-1 bg-green-500 rounded-full flex items-center gap-1">
                  <CheckSquare className="w-3 h-3 text-white" />
                  <span className="text-xs font-medium text-white">ACTIVE PROJECT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Stats & Actions */}
          <div className="flex items-center gap-6">
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-2xl font-semibold dark:text-white text-gray-900`}>
                  {projectInfo?.pendingTasks || 0}
                </div>
                <div className={`text-xs dark:text-gray-400 text-gray-600`}>
                  PENDING TASKS
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-semibold dark:text-white text-gray-900`}>
                  {projectInfo?.upcomingEvents || 0}
                </div>
                <div className={`text-xs dark:text-gray-400 text-gray-600`}>
                  UPCOMING EVENTS
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-semibold dark:text-white text-gray-900`}>
                  {projectInfo?.progress || 0}%
                </div>
                <div className={`text-xs dark:text-gray-400 text-gray-600`}>
                  COMPLETE
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(projectInfo?.id)}
                className={`p-2 rounded-lg transition-colors ${isFavorite(projectInfo?.id)
                  ? 'bg-purple-600 text-white'
                  : 'dark:text-gray-400 dark:hover:bg-gray-800 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Star className={`w-5 h-5 ${isFavorite(projectInfo?.id) ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>
          <ViewToggleButton view={viewMode} onViewChange={setViewMode} />
        </div>
      </div>

      {/* Grid View - Category Cards */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {mainFeatures.map((feature) => (
            <ProjectActionGridCard feature={feature} key={feature.id} />
          ))}
        </div>
      )}

      {/* List View - Category Cards */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {mainFeatures.map((feature) => (
            <ProjectActionListCard feature={feature} key={feature.id} />
          ))}
        </div>
      )}
    </div>
  );
}



