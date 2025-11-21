import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ProfileDashboard from '../pages/ProfileDashboard';

const ProfileLayout = lazy(() => import('../components/ProfileLayout'));

const ProfileGeneral = lazy(() => import('../components/ProfileGenral'));
// const ProfileContact = lazy(() => import('../pages/ProfileContact'));
// const ProfileAllowances = lazy(() => import('../pages/ProfileAllowances'));
// const ProfilePayment = lazy(() => import('../pages/ProfilePayment'));
// const ProfileCompany = lazy(() => import('../pages/ProfileCompany'));
// const ProfileDocuments = lazy(() => import('../pages/ProfileDocuments'));
// const ProfileCalendar = lazy(() => import('../pages/ProfileCalendar'));

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const ProfileRoutes = {
  path: '/profile',
  element: <ProfileDashboard />,
  children: [
    { index: true, element: <Navigate to="general" replace /> },

    { path: 'general', element: <ProfileGeneral /> },
    // { path: 'contact', element: <ProfileContact /> },
    // { path: 'allowances', element: <ProfileAllowances /> },
    // { path: 'payment', element: <ProfilePayment /> },
    // { path: 'company', element: <ProfileCompany /> },
    // { path: 'documents', element: <ProfileDocuments /> },
    // { path: 'calendar', element: <ProfileCalendar /> },

    { path: '*', element: <NotFound /> }
  ],
};

export default ProfileRoutes;




