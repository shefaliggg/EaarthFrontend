import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import LoadingScreen from "@/shared/components/LoadingScreen";

export default function SuspenseOutlet() {
  return (
    <Suspense fallback={<LoadingScreen variant="glass" />}>
      <Outlet />
    </Suspense>
  );
}
