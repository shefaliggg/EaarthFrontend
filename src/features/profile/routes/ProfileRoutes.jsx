import { lazy } from "react";
import { Navigate } from "react-router-dom";

const ProfileLayout = lazy(() => import("../components/ProfileLayout"));
const ProfileDashboard = lazy(() => import("../pages/ProfileDashboard"));
const IdentityDetails = lazy(
  () => import("../components/tabs/IdentityDetails"),
);
const ContactDetails = lazy(() => import("../components/tabs/ContactDetails"));
const FinancialDetails = lazy(
  () => import("../components/tabs/FinancialDetails"),
);
const AllowanceDetails = lazy(
  () => import("../components/tabs/allowance-details/AllowancesDetails"),
);
const HealthDetails = lazy(() => import("../components/tabs/HealthDetails"));
const MySignature = lazy(
  () => import("../components/tabs/my-signature/MySignature"),
);

const NotFound = lazy(() => import("@/shared/pages/NotFound"));

const ProfileRoutes = {
  path: "/profile",
  element: <ProfileDashboard />,
  children: [
    // { index: true, element: <ProfileDashboard /> },
    // { path: true, element: <IdentityDetails /> },
    // { path: "contact", element: <ContactDetails /> },
    // { path: "financial", element: <FinancialDetails /> },
    // { path: "allowance", element: <AllowanceDetails /> },
    // { path: "health", element: <HealthDetails /> },
    // { path: "signature", element: <MySignature /> },
    { path: "*", element: <NotFound /> },
  ],
};

export default ProfileRoutes;
