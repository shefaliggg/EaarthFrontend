import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/shared/components/Sidebar";
import Header from "@/shared/components/Header";
import PageTransition from "../shared/components/PageTransition";
import { useAuth } from "@/features/auth/context/AuthContext";

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar userRole={user?.userType || "studio-admin"} />
      <div className="flex-1">
        <Header />
        <div className="p-6">
          {/* <PageTransition> */}
            <Outlet />
          {/* </PageTransition> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;











