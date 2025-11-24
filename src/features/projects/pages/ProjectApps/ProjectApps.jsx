import React from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import ProjectAppsLayout from '../../components/ProjectAppsLayout';

function ProjectApps() {
  const location = useLocation();
  const isChildRoute = location.pathname.split("/").length > 4;

  return (
    <>
      {isChildRoute
        ? <Outlet />
        : <ProjectAppsLayout />
      }
    </>
  )
}

export default ProjectApps



