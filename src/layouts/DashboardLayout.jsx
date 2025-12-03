import { Outlet } from "react-router-dom";
import Sidebar from "@/shared/components/Sidebar";
import Header from "@/shared/components/Header";
import PageTransition from "../shared/components/PageTransition";

const DashboardLayout = () => {

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      <Sidebar />
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











