import React from 'react'
import { Outlet } from 'react-router-dom';
import ProjectAppsLayout from '../../components/ProjectAppsLayout';

function ProjectApps() {
  const isChildRoute = location.pathname.split("/").length > 4;

  return (
    <>
    {isChildRoute
        ? <Outlet />
        : <ProjectAppsLayout
          // projectInfo={projectInfo}
          // isFavorite={isFavorite}
          // toggleFavorite={toggleFavorite}
        />
      }
    </>
  )
}

export default ProjectApps