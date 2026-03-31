import { lazy } from "react";
import SettingsLayout from "../layout/SettingsLayout";
import { Navigate } from "react-router-dom";

const DetailsSettings = lazy(
  () => import("@/features/projects/settings/pages/details/DetailsSettings"),
);
const ContactsSettings = lazy(
  () => import("@/features/projects/settings/pages/contacts/ContactsSettings"),
);
const DatesSettings = lazy(
  () => import("@/features/projects/settings/pages/dates/DatesSettings"),
);
const ProjectSettings = lazy(
  () => import("@/features/projects/settings/pages/project/ProjectSettings"),
);
const StandardCrewSettings = lazy(
  () =>
    import("@/features/projects/settings/pages/standard-crew/StandardCrewSettings"),
);
const ConstructionSettings = lazy(
  () =>
    import("@/features/projects/settings/pages/construction/ConstructionSettings"),
);
const PlacesSettings = lazy(
  () => import("@/features/projects/settings/pages/places/PlacesSettings"),
);
const DepartmentSettings = lazy(
  () =>
    import("@/features/projects/settings/pages/departments/DepartmentSettings"),
);
const SignaturesWorkflowsSettings = lazy(
  () =>
    import("@/features/projects/settings/pages/signatures-workflows/SignaturesWorkflowsSettings"),
);
const ContractsFormsSettings = lazy(
  () =>
    import("@/features/projects/settings/pages/contracts-forms/ContractsFormsSettings"),
);
const AdminSettings = lazy(
  () => import("@/features/projects/settings/pages/admin/AdminSettings"),
);
const CustomSettings = lazy(
  () => import("@/features/projects/settings/pages/custom/CustomSettings"),
);
const NotificationsSettings = lazy(
  () =>
    import("@/features/projects/settings/pages/notifications/NotificationsSettings"),
);
const TimeCardSettings = lazy(
  () => import("@/features/projects/settings/pages/timecard/TimeCardSettings"),
);
const SubscriptionsSettings = lazy(
  () =>
    import("@/features/projects/settings/pages/subscriptions/SubscriptionsSettings"),
);
const DesignStyleSettings = lazy(
  () =>
    import("@/features/projects/settings/pages/design-style/DesignStyleSettings"),
);
const LayoutSettings = lazy(
  () => import("@/features/projects/settings/pages/layout/LayoutSettings"),
);
const AppSettings = lazy(
  () => import("@/features/projects/settings/pages/app-settings/AppSettings"),
);
const ChatSettings = lazy(
  () => import("@/features/projects/settings/pages/chat/ChatSettings"),
);
const CalendarSettings = lazy(
  () => import("@/features/projects/settings/pages/calendar/CalendarSettings"),
);
const AiKnowledgeBaseSettings = lazy(
  () => import("@/features/projects/settings/pages/ai-knowledge-base/AiKnowledgeBaseSettings"),
);

const NotFound = lazy(() => import("@/shared/pages/NotFound"));

const SettingsRoutes = {
  path: "settings",
  element: <SettingsLayout />,
  children: [
    { index: true, element: <Navigate to="details" replace /> },
    { path: "details", element: <DetailsSettings /> },
    { path: "contacts", element: <ContactsSettings /> },
    { path: "dates", element: <DatesSettings /> },
    { path: "project", element: <ProjectSettings /> },
    { path: "standard-crew", element: <StandardCrewSettings /> },
    { path: "construction", element: <ConstructionSettings /> },
    { path: "places", element: <PlacesSettings /> },
    { path: "departments", element: <DepartmentSettings /> },
    { path: "signatures-workflows", element: <SignaturesWorkflowsSettings /> },
    { path: "contracts-forms", element: <ContractsFormsSettings /> },
    { path: "admin", element: <AdminSettings /> },
    { path: "custom", element: <CustomSettings /> },
    { path: "notifications", element: <NotificationsSettings /> },
    { path: "timecard", element: <TimeCardSettings /> },
    { path: "subscriptions", element: <SubscriptionsSettings /> },
    { path: "design-style", element: <DesignStyleSettings /> },
    { path: "layout", element: <LayoutSettings /> },
    { path: "app-settings", element: <AppSettings /> },
    { path: "chat", element: <ChatSettings /> },
    { path: "calendar", element: <CalendarSettings /> },
    { path: "ai-knowledge-base", element: <AiKnowledgeBaseSettings /> },
  ],
};

export default SettingsRoutes;
