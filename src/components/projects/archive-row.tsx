"use client";

/**
 * Archive row — compact editorial line per project.
 * Mono year on left, serif title, category pill, tech chips, hover arrow.
 * Hover: left accent stripe slides in, row breathes.
 */

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

const CATEGORY_COLOR: Record<string, string> = {
  Manufacturing: "#f59e0b",
  Finance: "#22c55e",
  Integrations: "#a855f7",
  "AI & Automation": "#0EBBFF",
  "Data & Dashboards": "#ec4899",
  Operations: "#38bdf8",
  Academic: "#9ca3af",
};

export function ArchiveRow({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const color = CATEGORY_COLOR[project.category] ?? "#9ca3af";

  return (
    <motion.div
      ref={ref}
      initial={reduced ? undefined : { opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, delay: index * 0.025, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative border-b border-border/60"
    >
      {/* Left accent stripe — slides in on hover */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: color }}
        initial={false}
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <Link
        href={`/projects/${project.slug}`}
        className="grid grid-cols-[80px_1fr_auto] md:grid-cols-[120px_1fr_auto] gap-4 md:gap-6 items-center py-5 md:py-6 px-4 md:px-6 -mx-4 md:-mx-6 transition-colors"
        style={{
          background: hovered ? `${color}06` : "transparent",
        }}
      >
        {/* Year — mono */}
        <span className="font-mono text-xs md:text-sm text-text-secondary tabular-nums">
          {project.date}
        </span>

        {/* Title + meta */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
            <h3
              className="serif-display text-lg md:text-2xl font-normal tracking-tight leading-tight transition-colors"
              style={{ color: hovered ? color : "var(--foreground)" }}
            >
              {project.title}
            </h3>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest"
              style={{
                color,
                background: `${color}14`,
                border: `1px solid ${color}33`,
              }}
            >
              {project.category}
            </span>
          </div>
          <p className="serif-prose text-sm text-text-secondary mt-1.5 leading-snug line-clamp-2 max-w-2xl">
            {project.description}
          </p>
          {/* Tech chips — only show first 4 */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="px-1.5 py-0.5 text-[9.5px] font-mono rounded border border-border/60 text-text-secondary/80"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 4 ? (
              <span className="text-[9.5px] font-mono text-text-secondary/50 pt-0.5">
                +{project.tech.length - 4}
              </span>
            ) : null}
          </div>
        </div>

        {/* Hover arrow */}
        <motion.div
          className="shrink-0"
          animate={{
            x: hovered ? 4 : 0,
            opacity: hovered ? 1 : 0.4,
          }}
          transition={{ duration: 0.25 }}
        >
          <ArrowUpRight
            className="w-4 h-4 md:w-5 md:h-5"
            style={{ color: hovered ? color : "var(--text-secondary)" }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
