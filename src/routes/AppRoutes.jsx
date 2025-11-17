import AuthRoutes from "../features/auth/routes/AuthRoutes";
import ErrorBoundary from "../shared/components/ErrorBoundary";

const AppRoutes = [
  AuthRoutes,
  // studioRoutes,
  // agencyRoutes,
  // individualRoutes,
  {
    path: '*',
    element: (
      <ErrorBoundary>
        <NotFound />
      </ErrorBoundary>
    ),
  },
];

export default AppRoutes;
