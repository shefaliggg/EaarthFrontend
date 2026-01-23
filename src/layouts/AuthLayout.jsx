import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import DarkmodeButton from "../shared/components/buttons/DarkmodeButton";
import SuspenseOutlet from "../shared/components/SuspenseOutlet";

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-12 right-32 z-100">
        <DarkmodeButton />
      </div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#faf5ff] dark:bg-lavender-900 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#faf5ff] dark:bg-lavender-900 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content (Width Increased) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full container mx-auto flex items-center justify-center px-4"
        >
          <SuspenseOutlet />
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default AuthLayout;












