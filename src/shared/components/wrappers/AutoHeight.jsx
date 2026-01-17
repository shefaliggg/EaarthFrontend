import { motion } from "framer-motion";
import { useRef, useLayoutEffect, useState } from "react";

export function AutoHeight({ children, className = "" }) {
  const ref = useRef(null);
  const [height, setHeight] = useState("auto");

  useLayoutEffect(() => {
    if (!ref.current) return;
    setHeight(ref.current.scrollHeight);
  }, [children]);

  return (
    <motion.div
      animate={{ height }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`overflow-hidden ${className}`}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  );
}
