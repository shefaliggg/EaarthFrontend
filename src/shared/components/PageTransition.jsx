import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const PageTransition = ({ children }) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{filter: "blur(6px)" }}
                animate={{filter: "blur(0px)" }}
                transition={{ duration: 0.30 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default PageTransition;











