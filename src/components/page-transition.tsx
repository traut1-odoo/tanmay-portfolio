"use client";

/**
 * Page transition wrapper: opacity fades between routes.
 * Keyed by pathname so framer-motion AnimatePresence triggers exit/enter
 * on every route change. MotionConfig follows the visitor’s reduced-motion preference.
 */

import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useSound } from "@/hooks/use-sound";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const { play } = useSound();

  // Play whoosh on route change (skip first paint)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    play("whoosh");
  }, [pathname, play]);

  return (
    <MotionConfig reducedMotion="user">
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
    </MotionConfig>
  );
}
