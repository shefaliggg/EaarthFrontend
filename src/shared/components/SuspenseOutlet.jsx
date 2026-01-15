import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LoadingScreen from "@/shared/components/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion"

export default function SuspenseOutlet() {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingScreen variant="glass" />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          className="relative"
          initial={{
            opacity: 50,
            filter: "blur(8px)",
            scale: 0.998,
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
          }}
          exit={{
            opacity: 50,
            filter: "blur(6px)",
            scale: 0.998,
          }}
          transition={{
            duration: 0.20,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
}