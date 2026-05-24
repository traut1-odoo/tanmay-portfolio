"use client";

/**
 * Featured project card — magazine-cover treatment.
 * Big numbered marker, gradient bg per category, mock visual block,
 * impact bullets, tech chips. Magnetic hover + spotlight follow.
 */

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Project } from "@/data/projects";

const CATEGORY_GRADIENT: Record<string, { from: string; to: string; accent: string }> = {
  Manufacturing: { from: "rgba(245,158,11,0.18)", to: "rgba(245,158,11,0.02)", accent: "#f59e0b" },
  Finance: { from: "rgba(34,197,94,0.16)", to: "rgba(34,197,94,0.02)", accent: "#22c55e" },
  Integrations: { from: "rgba(168,85,247,0.18)", to: "rgba(168,85,247,0.02)", accent: "#a855f7" },
  "AI & Automation": { from: "rgba(14,187,255,0.20)", to: "rgba(14,187,255,0.02)", accent: "#0EBBFF" },
  "Data & Dashboards": { from: "rgba(236,72,153,0.16)", to: "rgba(236,72,153,0.02)", accent: "#ec4899" },
  Operations: { from: "rgba(56,189,248,0.16)", to: "rgba(56,189,248,0.02)", accent: "#38bdf8" },
  Academic: { from: "rgba(255,255,255,0.06)", to: "rgba(255,255,255,0.01)", accent: "#9ca3af" },
};

export function FeaturedProject({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const cat = CATEGORY_GRADIENT[project.category] ?? CATEGORY_GRADIENT.Operations;

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  return (
    <motion.div
      ref={ref}
      initial={reduced ? undefined : { opacity: 0, y: 32, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMove}
      className="group relative overflow-hidden rounded-3xl border transition-all"
      style={{
        background: `linear-gradient(135deg, ${cat.from} 0%, ${cat.to} 100%)`,
        borderColor: hovered ? `${cat.accent}55` : "var(--border)",
        boxShadow: hovered ? `0 20px 60px ${cat.accent}22` : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Spotlight follow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, ${cat.accent}1a, transparent 50%)`,
        }}
      />

      {/* Faint grid behind */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Big number marker */}
      <div
        className="absolute right-6 md:right-10 top-6 md:top-8 serif-display font-normal leading-none select-none pointer-events-none"
        style={{
          fontSize: "clamp(4rem, 10vw, 8rem)",
          color: `${cat.accent}22`,
          letterSpacing: "-0.04em",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      <Link href={`/projects/${project.slug}`} className="relative block p-7 md:p-10 lg:p-12">
        {/* Category + meta */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest"
            style={{
              color: cat.accent,
              background: `${cat.accent}1a`,
              border: `1px solid ${cat.accent}55`,
            }}
          >
            <Sparkles className="w-3 h-3" />
            {project.category}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary/70">
            {project.date}
          </span>
        </div>

        {/* Title */}
        <h3 className="serif-display text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight leading-[1.05] text-foreground mb-4 max-w-2xl">
          {project.title}
        </h3>

        {/* Description */}
        <p className="serif-prose text-base md:text-lg text-text-secondary leading-[1.7] max-w-2xl mb-7">
          {project.description}
        </p>

        {/* Impact bullets */}
        <ul className="space-y-2 mb-7 max-w-2xl">
          {project.impact.slice(0, 3).map((imp, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-foreground/85 leading-snug">
              <span
                className="inline-block w-1 h-1 rounded-full mt-2 shrink-0"
                style={{ background: cat.accent }}
              />
              <span>{imp}</span>
            </li>
          ))}
        </ul>

        {/* Tech chip strip */}
        <div className="flex flex-wrap gap-1.5 mb-7">
          {project.tech.slice(0, 6).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[10px] font-mono rounded-md border border-border text-text-secondary bg-background/40 backdrop-blur"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 6 ? (
            <span className="px-2 py-0.5 text-[10px] font-mono text-text-secondary/60">
              +{project.tech.length - 6}
            </span>
          ) : null}
        </div>

        {/* CTA */}
        <div
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest transition-all"
          style={{
            color: cat.accent,
            gap: hovered ? "16px" : "8px",
          }}
        >
          View case study
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </motion.div>
  );
}
