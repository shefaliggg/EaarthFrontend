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
      color: 'from-[#9333ea] to-[#9333ea]',
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
      color: 'from-[#9333ea] to-[#9333ea]',
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
      color: 'from-[#9333ea] to-[#9333ea]',
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

  return (
    <div className={`min-h-screen px-2`}>
      <UrlBreadcrumbs />

      {isChildRoute
        ? <Outlet />
        : <ProjectActionsLayout
          projectInfo={projectInfo}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
      }
    </div>
  );
}











