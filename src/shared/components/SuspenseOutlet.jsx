import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LoadingScreen from "@/shared/components/LoadingScreen";

export default function SuspenseOutlet() {
  const location = useLocation();

  return (
    <Suspense
      key={location.pathname}
      fallback={<LoadingScreen variant="glass" />}
    >
      <Outlet />
    </Suspense>
  );
}