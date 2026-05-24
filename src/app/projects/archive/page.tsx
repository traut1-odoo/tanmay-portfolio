"use client";

/**
 * /projects/archive — full project archive.
 * Year-grouped sections, compact rows, filter chips, year-scale ribbon.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { ArchiveRow } from "@/components/projects/archive-row";
import { YearScale } from "@/components/projects/year-scale";
import { projects, categories, type ProjectCategory } from "@/data/projects";

const archived = projects.filter((p) => !p.featured);

// Extract year for grouping
function yearOf(date: string): number {
  const m = date.match(/(20\d{2})/g);
  return m ? parseInt(m[m.length - 1], 10) : 0;
}

export default function ArchivePage() {
  const [filter, setFilter] = useState<ProjectCategory | "All">("All");

  const filtered = useMemo(
    () => (filter === "All" ? archived : archived.filter((p) => p.category === filter)),
    [filter],
  );

  // Group by year, descending
  const grouped = useMemo(() => {
    const map: Record<number, typeof archived> = {};
    filtered.forEach((p) => {
      const y = yearOf(p.date);
      if (!map[y]) map[y] = [];
      map[y].push(p);
    });
    return Object.keys(map)
      .map((y) => parseInt(y, 10))
      .sort((a, b) => b - a)
      .map((y) => ({ year: y, projects: map[y] }));
  }, [filtered]);

  return (
    <article className="serif-prose-root pb-24">
      {/* ═══ HEADER ═══ */}
      <section className="px-6 md:px-12 lg:px-20 py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to featured
          </Link>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] font-mono uppercase tracking-[0.3em] text-accent mb-4 flex items-center gap-3"
          >
            <span className="w-8 h-px bg-accent/40" />
            Archive
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="serif-display text-5xl md:text-7xl font-normal tracking-tight leading-[0.95] text-foreground max-w-3xl"
          >
            Everything else, by year.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 md:mt-8 serif-prose text-base md:text-lg text-text-secondary max-w-2xl leading-[1.7]"
          >
            {archived.length} projects across {Object.keys(grouped).length || ""} years. Cost
            accounting, integrations, dashboards, workflows, academic foundations. Each one shipped
            something real.
          </motion.p>

          {/* Filter chips */}
          <div className="mt-10 md:mt-14 flex flex-wrap gap-2">
            <FilterChip
              label={`All (${archived.length})`}
              active={filter === "All"}
              onClick={() => setFilter("All")}
            />
            {categories.map((cat) => {
              const count = archived.filter((p) => p.category === cat).length;
              if (count === 0) return null;
              return (
                <FilterChip
                  key={cat}
                  label={`${cat} (${count})`}
                  active={filter === cat}
                  onClick={() => setFilter(cat)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ YEAR-GROUPED ROWS + YEAR SCALE RAIL ═══ */}
      <section className="px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_180px] gap-12 lg:gap-16">
          {/* Main list */}
          <div className="border-t border-border">
            {grouped.length === 0 ? (
              <p className="py-12 text-center text-text-secondary serif-prose">
                No projects in this category yet.
              </p>
            ) : (
              grouped.map(({ year, projects }) => (
                <YearGroup key={year} year={year} projects={projects} />
              ))
            )}
          </div>

          {/* Side scale */}
          <YearScale projects={archived} />
        </div>
      </section>
    </article>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
        active
          ? "bg-foreground text-background border-foreground"
          : "border-border text-text-secondary hover:text-foreground hover:border-foreground/40"
      }`}
    >
      {label}
    </button>
  );
}

function YearGroup({
  year,
  projects,
}: {
  year: number;
  projects: typeof archived;
}) {
  return (
    <div className="border-b border-border/60 last:border-b-0">
      <div className="sticky top-16 z-10 bg-background/85 backdrop-blur-md py-3 -mx-4 md:-mx-6 px-4 md:px-6 border-b border-border/40">
        <div className="flex items-baseline gap-3">
          <h2 className="serif-display text-2xl md:text-3xl font-normal tracking-tight text-foreground tabular-nums">
            {year || "—"}
          </h2>
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </div>
      </div>
      <div>
        {projects.map((p, i) => (
          <ArchiveRow key={p.slug} project={p} index={i} />
        ))}
      </div>
    </div>
  );
}
