import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/shared/components/Sidebar"; // your sidebar component
import Header from "../shared/components/Header";

const StudioLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarType="studio" />

      <div  className="flex-1 ">
        <Header />
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StudioLayout;