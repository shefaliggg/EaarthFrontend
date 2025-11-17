import { Navigate } from "react-router-dom";
import AuthRoutes from "../features/auth/routes/AuthRoutes";
import ErrorBoundary from "../shared/components/ErrorBoundary";
import NotFound from "../shared/components/NotFound";
import StudioRoutes from "../features/studio/routes/StudioRoutes";

const AppRoutes = [
    {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },
  AuthRoutes,
  StudioRoutes,
  // agencyRoutes,
  // individualRoutes,
  {
    path: '*',
    element: (
      <ErrorBoundary>
        <NotFound/>
      </ErrorBoundary>
    ),
  },
];

export default AppRoutes;
