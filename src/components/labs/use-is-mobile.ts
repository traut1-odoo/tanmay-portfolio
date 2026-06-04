"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe mobile breakpoint hook for the labs demos (which use inline styles,
 * so CSS media queries aren't available). Defaults to false on the server /
 * first paint, then resolves on mount and on resize.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
