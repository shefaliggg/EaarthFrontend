// src/features/chat/hooks/useInfiniteScroll.js
// ✅ Hook for infinite scroll in messages

import { useEffect } from "react";

export const useInfiniteScroll = (ref, callback, hasMore, isLoading) => {
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current || !hasMore || isLoading) return;
      
      if (ref.current.scrollTop === 0) {
        callback();
      }
    };

    const el = ref.current;
    if (!el) return;
    
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [ref, callback, hasMore, isLoading]);
};