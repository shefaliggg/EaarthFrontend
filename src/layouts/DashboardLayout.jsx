import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/shared/components/Sidebar";
import Header from "@/shared/components/Header";
// import { useAuth } from "@/context/AuthContext";

const DashboardLayout = () => {
  const location = useLocation();
  // const { user } = useAuth(); // Uncomment when AuthContext is available

  // Temporary user object for demonstration purposes
  const user = { userType: "studio-admin" };

  return (
    <div className="flex min-h-screen">
      <Sidebar userRole={user?.userType} />

      <div className="flex-1">
        <Header />

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;