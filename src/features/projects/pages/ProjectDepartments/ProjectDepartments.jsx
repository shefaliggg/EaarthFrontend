import React from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import ProjectDepartmentsLayout from '../../components/ProjectDepartmentsLayout';

function ProjectDepartments() {
  const location = useLocation();
  const isChildRoute = location.pathname.split("/").length > 4;

  return (
    <>
    {isChildRoute
        ? <Outlet />
        : <ProjectDepartmentsLayout />
      }
    </>
  )
}

export default ProjectDepartments



