"use client";

/**
 * Year scale visualization — vertical timeline ribbon at the side of
 * the archive page. Shows project density per year as dots; current
 * year highlighted. Pure visual, doesn't drive selection.
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/data/projects";

export function YearScale({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduced = useReducedMotion();

  // Extract year from project.date (handle "2024", "2023–2024", "2023 (ASU)")
  const yearOf = (d: string): number => {
    const m = d.match(/(20\d{2})/g);
    if (!m) return 0;
    return parseInt(m[m.length - 1], 10);
  };

  const counts: Record<number, number> = {};
  projects.forEach((p) => {
    const y = yearOf(p.date);
    if (y) counts[y] = (counts[y] ?? 0) + 1;
  });

  const years = Object.keys(counts)
    .map((y) => parseInt(y, 10))
    .sort((a, b) => b - a);

  const max = Math.max(...Object.values(counts), 1);

  return (
    <div ref={ref} className="sticky top-24 hidden lg:block">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-4">
        Timeline
      </p>
      <ul className="space-y-3 relative pl-3 border-l border-border">
        {years.map((y, i) => {
          const c = counts[y];
          const density = c / max; // 0..1
          return (
            <motion.li
              key={y}
              initial={reduced ? undefined : { opacity: 0, x: -4 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="flex items-center gap-3 group"
            >
              <span className="absolute -left-[5px] w-2 h-2 rounded-full bg-border group-hover:bg-accent transition-colors" />
              <span className="font-mono text-xs text-foreground/80 tabular-nums w-10">{y}</span>
              <div className="flex-1 h-1 rounded-full bg-border/40 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--accent)" }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${density * 100}%` } : undefined}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.04 }}
                />
              </div>
              <span className="font-mono text-[10px] text-text-secondary/70 w-4 text-right tabular-nums">
                {c}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
