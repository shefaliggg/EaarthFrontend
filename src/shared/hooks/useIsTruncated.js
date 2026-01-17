import { useLayoutEffect, useRef, useState } from "react";

export function useIsTruncated() {
  const ref = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    setIsTruncated(el.scrollWidth > el.clientWidth);
  });

  return { ref, isTruncated };
}
