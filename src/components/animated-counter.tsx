"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  target: string;
  className?: string;
}

export function AnimatedCounter({ target, className = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [displayNum, setDisplayNum] = useState(0);

  const match = target.match(/^(\d+)(.*)$/);
  const numericTarget = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  // Map to a percentage for the ring (out of a sensible max)
  const maxMap: Record<number, number> = { 18: 20, 1: 1, 3: 5, 8: 10 };
  const max = maxMap[numericTarget] || numericTarget;
  const targetProgress = numericTarget / max;

  // Animate on mount, regardless of viewport. Stats often sit just below the
  // fold — waiting for IntersectionObserver leaves "0+" stuck until scroll.
  useEffect(() => {
    const duration = 1400;
    let rafId = 0;
    const run = () => {
      cancelAnimationFrame(rafId);
      let startTime: number | null = null;
      const tick = (now: number) => {
        if (startTime === null) startTime = now;
        const t = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        setProgress(eased * targetProgress);
        setDisplayNum(Math.round(eased * numericTarget));
        if (t < 1) rafId = requestAnimationFrame(tick);
      };
      // Reset to 0 first so the count-up is visible on each replay.
      setProgress(0);
      setDisplayNum(0);
      rafId = requestAnimationFrame(tick);
    };

    // First play on mount — covers initial load even if element is below fold.
    run();

    // Replay every time the element re-enters viewport from offscreen.
    // Multi-threshold so we see the transitions (default threshold:0 keeps it
    // "intersecting" as long as 1px is visible — no replay on normal scroll).
    let wasInView = true; // suppress the first IO callback after mount-run
    const el = ref.current;
    let io: IntersectionObserver | null = null;
    if (el) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const inNow = entry.intersectionRatio > 0.5;
            if (inNow && !wasInView) run();
            wasInView = inNow;
          }
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] },
      );
      io.observe(el);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (io) io.disconnect();
    };
  }, [numericTarget, targetProgress]);

  const size = 72;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div ref={ref} className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background ring */}
        <svg width={size} height={size} className="absolute inset-0 -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-border opacity-30"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="rgba(168,85,247,0.8)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xl font-bold text-text tabular-nums"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
          >
            {displayNum}{suffix}
          </motion.span>
        </div>
      </div>
    </div>
  );
}
