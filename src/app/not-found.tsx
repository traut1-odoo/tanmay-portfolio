"use client";

/**
 * Branded 404 page — typography-led, faint mountain silhouette, looping
 * scroll-byte ticker, return-home CTA + cmd+K hint.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Command, Mountain } from "lucide-react";
import { useEffect, useState } from "react";

const ERROR_LINES = [
  "// route not on the climbing path",
  "// the summit is elsewhere",
  "// trail markers missing here",
  "// you scrolled too far off-map",
  "// this checkpoint never existed",
];

export default function NotFound() {
  const [line, setLine] = useState(ERROR_LINES[0]);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % ERROR_LINES.length;
      setLine(ERROR_LINES[i]);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-6">
      {/* Background mountain glyph */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Mountain className="w-[60vmin] h-[60vmin] text-foreground" strokeWidth={0.5} />
      </motion.div>

      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(var(--accent-rgb),0.10), transparent 60%)",
        }}
      />

      <div className="relative z-10 text-center max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-accent mb-4">
            404 · Off-trail
          </p>
          <h1 className="text-7xl md:text-9xl font-bold tracking-[-0.04em] leading-[0.85] gradient-text animated-gradient">
            Lost.
          </h1>
        </motion.div>

        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-xs md:text-sm text-text-secondary mt-6"
        >
          {line}
        </motion.p>

        <motion.p
          className="text-base text-text-secondary mt-4 max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          This page doesn&apos;t exist on the route. Head back to base camp or
          ask the assistant where the trail picks up.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link
            href="/"
            className="link-arrow px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity inline-flex"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to base camp
          </Link>
          <kbd className="px-3 py-2 rounded-full border border-border text-xs text-text-secondary font-mono inline-flex items-center gap-2">
            <Command className="w-3 h-3" />
            +K to search
          </kbd>
        </motion.div>
      </div>
    </div>
  );
}
