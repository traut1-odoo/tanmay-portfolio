"use client";

import { motion } from "framer-motion";
import { FlaskConical, Zap, Terminal } from "lucide-react";
import { BackorderDemoCard } from "@/components/labs/demo-card";
import { VendorPortalDemoCard } from "@/components/labs/vendor-portal-card";
import { MCPCoworkDemoCard } from "@/components/labs/mcp-cowork-card";

export default function LabsPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Label */}
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">
              interactive demos
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            <span className="text-foreground">Labs</span>
          </h1>

          <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
            Real tools I&apos;ve built — running live in your browser. Sanitized data, full interactivity.
          </p>
        </motion.div>

        {/* Divider / terminal hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex items-center gap-3"
        >
          <Terminal className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-mono text-text-secondary/60">
            hover to preview · click to explore
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </motion.div>
      </section>

      {/* ── Demo grid ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Demo 1 — Backorder Dashboard */}
          <BackorderDemoCard />

          {/* Demo 2 — Vendor Portal RMA + credit flow */}
          <VendorPortalDemoCard />

          {/* Demo 3 — MCP Cowork Agent */}
          <MCPCoworkDemoCard />
        </div>
      </section>

      {/* ── Bottom note ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border p-6 flex flex-col md:flex-row items-start md:items-center gap-4"
          style={{ borderColor: "var(--border)", background: "var(--surface-hover)" }}
        >
          <Zap className="w-5 h-5 text-accent shrink-0" />
          <div>
            <div className="font-semibold text-sm mb-1">How these are built</div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Each demo started as a Claude Live Artifact — built during a real work session connected to production data via MCP. Sanitized and ported here so you can see the actual interaction model, not a mockup.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
