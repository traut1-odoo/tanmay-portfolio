"use client";

/**
 * Page transition wrapper — cross-fades + slight Y slide between routes.
 * Keyed by pathname so framer-motion AnimatePresence triggers exit/enter
 * on every route change. Reduced-motion respects user pref via CSS.
 */

import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
