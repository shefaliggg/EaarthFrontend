import { motion } from "framer-motion";
import { useRef, useLayoutEffect, useState } from "react";

export function AutoHeight({ children, className = "" }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const newHeight = ref.current.scrollHeight;
    setHeight(newHeight);
  }, [children]);

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height }}
      exit={{ height: 0 }}
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
