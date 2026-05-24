"use client";

/**
 * /projects — curated front page.
 * Only 3 featured projects, magazine-cover treatment.
 * Stats strip, bridge to /projects/archive for the rest.
 */

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { FeaturedProject } from "@/components/projects/featured-project";
import { projects } from "@/data/projects";

const featured = projects.filter((p) => p.featured);
const archived = projects.filter((p) => !p.featured);

const STATS = [
  { label: "Projects shipped", value: projects.length },
  { label: "Featured deep-dives", value: featured.length },
  { label: "Years active", value: 8 }, // 2018 → 2026
  { label: "Categories", value: 7 },
];

function StatNumber({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setV(target);
      return;
    }
    const start = performance.now();
    const duration = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduced]);

  return <span ref={ref}>{v}</span>;
}

export default function ProjectsPage() {
  return (
    <article className="serif-prose-root pb-24">
      {/* ═══ EDITORIAL HEADER ═══ */}
      <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[11px] font-mono uppercase tracking-[0.3em] text-accent mb-5 flex items-center gap-3"
          >
            <span className="w-8 h-px bg-accent/40" />
            Selected work
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="serif-display text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[0.95] text-foreground max-w-4xl"
          >
            The thinking behind recent builds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 md:mt-10 serif-prose text-lg md:text-xl text-text-secondary max-w-3xl leading-[1.7]"
          >
            Every shipped system started as a constraint, a sketch, and a sequence of decisions.
            These deep dives walk through the planning — what the problem actually was, what got
            traded off, and how the build went. The rest of the work lives in the archive.
          </motion.p>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 border-t border-border pt-8"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="serif-display text-3xl md:text-4xl font-normal text-foreground leading-none tabular-nums">
                  <StatNumber target={s.value} />
                </p>
                <p className="text-[11px] font-mono uppercase tracking-widest text-text-secondary mt-2">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURED 3 ═══ */}
      <section className="px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {featured.map((p, i) => (
              <div key={p.slug} className={i === 0 ? "lg:col-span-2" : ""}>
                <FeaturedProject project={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ARCHIVE BRIDGE ═══ */}
      <section className="px-6 md:px-12 lg:px-20 mt-20 md:mt-28">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/projects/archive"
            className="group block relative overflow-hidden rounded-3xl border border-border hover:border-accent/40 transition-colors p-8 md:p-12"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)",
            }}
          >
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-accent mb-3">
                  More work
                </p>
                <h3 className="serif-display text-3xl md:text-5xl font-normal tracking-tight leading-tight text-foreground max-w-2xl">
                  {archived.length} more in the archive.
                </h3>
                <p className="serif-prose text-base text-text-secondary mt-4 max-w-xl leading-[1.7]">
                  Cost accounting builds, Stripe integration, dashboards, RMA workflows,
                  the Odoo 16 → 17 cutover, the academic foundations. Compact list, year-grouped.
                </p>
              </div>
              <motion.div
                className="flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-foreground shrink-0"
                whileHover={{ gap: "20px" }}
                transition={{ duration: 0.25 }}
              >
                Browse archive
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </div>

            {/* Decorative timeline strip */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-1.5 pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity">
              {[...new Set(archived.map((p) => p.date.match(/20\d{2}/)?.[0]).filter(Boolean))]
                .sort()
                .map((y) => (
                  <span key={y} className="text-[9px] font-mono text-text-secondary tabular-nums">
                    {y}
                  </span>
                ))}
            </div>
          </Link>
        </div>
      </section>
    </article>
  );
}
