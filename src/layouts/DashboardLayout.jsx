import { Outlet } from "react-router-dom";
import Header from "@/shared/components/header/Header";
import PageTransition from "../shared/components/PageTransition";

const DashboardLayout = () => {

  return (
    <div className="flex-1 min-h-screen">
      <Header />
      <div className="p-6">
        {/* <PageTransition> */}
        <Outlet />
        {/* </PageTransition> */}
      </div>
    </div>
  );
};

export default DashboardLayout;











