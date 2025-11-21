import { useFavorites } from '../hooks/useFavorites';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import UrlBreadcrumbs from '../../../shared/components/UrlBasedBreadcrumb';
import ProjectActionsLayout from '../components/ProjectActionsLayout';

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites('project-favorites');
  const isChildRoute = location.pathname.split("/").length > 3;
  const { projectName } = useParams();

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

  return (
    <div className={`min-h-screen px-2`}>
      <UrlBreadcrumbs />

      {isChildRoute
        ? <Outlet />
        : <ProjectActionsLayout
          projectInfo={projectInfo}
          mainFeatures={mainFeatures}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
      }
    </div>
  );
}



