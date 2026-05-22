import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import ErrorBoundary from "../shared/components/wrappers/ErrorBoundary";

// const GuardRoute = ({ allowedRoles = "all", children }) => {
//   const { user, initialLoading } = useAuth();
//   const location = useLocation();
//   const userType = user?.userType;

//   if (initialLoading) return null;

//   if (
//     allowedRoles !== "all" &&
//     !allowedRoles.includes(userType)
//   ) {
//     return (
//       <Navigate
//         to="/unauthorized"
//         state={{ from: location.pathname }}
//         replace
//       />
//     );
//   }

//   return (
//     <ErrorBoundary>
//       {children ? children : <Outlet />}
//     </ErrorBoundary>
//   );
// };

// export default GuardRoute;

function resolveUserRole(user) {
  if (!Array.isArray(user?.affiliations)) return "individual";
  
  const studioAffiliation = user.affiliations.find(
    (a) => a.orgType === "studio" && a.status === "active"
  );
  if (studioAffiliation) return studioAffiliation.role; // "studio_admin", etc.

  // Fallback for crew — they have no studio affiliation, 
  // but they have active ProjectMember records
  return user?.activeAffiliation?.role ?? "individual";
}

const GuardRoute = ({ allowedRoles = "all", children }) => {
  const { user, initialLoading } = useAuth();
  const location = useLocation();

  if (initialLoading) return null;

  if (allowedRoles !== "all") {
    const role = resolveUserRole(user);
    if (!allowedRoles.includes(role)) {
      return (
        <Navigate
          to="/unauthorized"
          state={{ from: location.pathname }}
          replace
        />
      );
    }
  }

  return (
    <ErrorBoundary>
      {children ? children : <Outlet />}
    </ErrorBoundary>
  );
};

export default GuardRoute;
