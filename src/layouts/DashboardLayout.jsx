import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/shared/components/Sidebar";
import Header from "@/shared/components/Header";
import PageTransition from "../shared/components/PageTransition";
// import { useAuth } from "@/context/AuthContext";

const DashboardLayout = () => {
  // const { user } = useAuth(); // Uncomment when AuthContext is available

  // Temporary user object for demonstration purposes
  const user = { userType: "studio-admin" };

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen bg-[#f1edf5] dark:bg-[#111012]">
      <Sidebar userRole={user?.userType} />
      <div className="flex-1">
        <Header />
        <div className="p-6">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;



