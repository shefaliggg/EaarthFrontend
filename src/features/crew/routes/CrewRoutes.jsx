import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { MyProjectsPage } from '../pages/MyProjectsPag';

const CrewDashboard = lazy(() => import('../pages/CrewDashboard'));
const UpcomingSchedule = lazy(() => import('../components/UpcomingSchedule'));
const RecentTasks = lazy(() => import('../components/RecentTasks'));
const Notifications = lazy(() => import('../components/Notifications'));

// Create placeholder components for new routes
// Replace these with actual components as you build them
const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="mt-4 text-muted-foreground">This page is under construction.</p>
  </div>
);

const CrewRoutes = {
  path: '/crew',
  children: [
    { index: true,  element: <CrewDashboard /> },
    // Projects Routes
    { path: 'projects', element: <MyProjectsPage title="My Projects" /> },
    { path: 'projects/:projectName', element: <PlaceholderPage title="Project Details" /> },
    
    // Applications Routes
    { path: 'calendar', element: <PlaceholderPage title="My Calendar" /> },
    { path: 'call-sheets', element: <PlaceholderPage title="Call Sheets" /> },
    { path: 'shooting-schedule', element: <PlaceholderPage title="Shooting Schedule" /> },
    { path: 'timesheet', element: <PlaceholderPage title="My Timesheet" /> },
    { path: 'tasks', element: <RecentTasks /> },
    { path: 'documents', element: <PlaceholderPage title="Documents" /> },
    { path: 'assets', element: <PlaceholderPage title="Assets" /> },
    { path: 'costume', element: <PlaceholderPage title="Costume" /> },
    { path: 'catering', element: <PlaceholderPage title="Catering" /> },
    { path: 'script', element: <PlaceholderPage title="Script" /> },
    { path: 'transport', element: <PlaceholderPage title="Transport" /> },
    { path: 'eplayer', element: <PlaceholderPage title="E Player" /> },
    { path: 'props', element: <PlaceholderPage title="Props & Assets" /> },
    { path: 'locations', element: <PlaceholderPage title="Locations" /> },
    { path: 'cloud', element: <PlaceholderPage title="Cloud" /> },
    { path: 'notice-board', element: <PlaceholderPage title="Notice Board" /> },
    { path: 'chat', element: <PlaceholderPage title="Crew Chat" /> },
    { path: 'production-reports', element: <PlaceholderPage title="Production Reports" /> },
    { path: 'schedule', element: <UpcomingSchedule /> },
    { path: 'cast', element: <PlaceholderPage title="Cast" /> },
    { path: 'crew-list', element: <PlaceholderPage title="Crew List" /> },
    { path: 'esign', element: <PlaceholderPage title="EAARTH Sign" /> },

    // AI & Analytics Routes
    { path: 'ai-assistant-chat', element: <PlaceholderPage title="AI Assistant Chat" /> },
    { path: 'ai-search-filtering', element: <PlaceholderPage title="AI Search & Filtering" /> },
    { path: 'ai-template-studio', element: <PlaceholderPage title="AI Template Studio" /> },
    { path: 'document-management', element: <PlaceholderPage title="Document Management" /> },
    { path: 'workflow-automation', element: <PlaceholderPage title="Workflow Automation" /> },
    { path: 'analytics', element: <PlaceholderPage title="My Analytics" /> },

    // Settings Routes - Personal
    { path: 'profile', element: <CrewDashboard /> },
    { path: 'contact-info', element: <PlaceholderPage title="Contact Information" /> },
    { path: 'emergency-contacts', element: <PlaceholderPage title="Emergency Contacts" /> },
    { path: 'preferences', element: <PlaceholderPage title="Preferences" /> },

    // Settings Routes - Work
    { path: 'availability', element: <PlaceholderPage title="Availability" /> },
    { path: 'rates', element: <PlaceholderPage title="My Rates" /> },
    { path: 'certifications', element: <PlaceholderPage title="Certifications" /> },
    { path: 'skills', element: <PlaceholderPage title="Skills" /> },

    // Settings Routes - Notifications
    { path: 'notification-settings', element: <PlaceholderPage title="Notification Settings" /> },
    { path: 'email-preferences', element: <PlaceholderPage title="Email Preferences" /> },
    { path: 'notifications', element: <Notifications /> },

    // Settings Routes - Documents
    { path: 'contracts', element: <PlaceholderPage title="My Contracts" /> },
    { path: 'tax-forms', element: <PlaceholderPage title="Tax Forms" /> },
    { path: 'onboarding-docs', element: <PlaceholderPage title="Onboarding Documents" /> },

    // Legacy routes
    { path: 'settings', element: <PlaceholderPage title="Settings" /> },
  ],
};

export default CrewRoutes;