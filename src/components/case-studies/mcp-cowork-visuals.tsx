"use client";

/**
 * Visual components for Case Study 03 — Claude × MCP as ERP co-worker.
 *
 * - MCPGraph        — central Claude node with radial MCP server nodes,
 *                     animated connection lines + glow.
 * - WorkflowBeforeAfter — split: manual bottlenecked flow vs MCP-mediated.
 * - DayInLife       — 5-phase timeline with examples per phase.
 * - ArtifactGallery — categorized list with icons + outcomes.
 * - ToolkitMoat     — visual layered defense (Anyone can use Claude → Few can ...)
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import {
  Bot,
  Database,
  FileText,
  MessageSquare,
  Mail,
  HardDrive,
  CreditCard,
  Receipt,
  Globe,
  Eye,
  Brain,
  Sun,
  Clock,
  ListChecks,
  Users,
  Sparkles,
  Wrench,
  FolderKanban,
  GitBranch,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import type { MCPServer, Artifact, DayPhase } from "@/data/case-studies/mcp-cowork/content";

/* ════════════════════════════════════════════════════════
   MCP GRAPH — Claude in center, ~10 MCP nodes radiating
   ════════════════════════════════════════════════════════ */

const SERVER_ICONS: Record<string, React.ReactNode> = {
  odoo19: <Database className="w-5 h-5" />,
  notion: <FileText className="w-5 h-5" />,
  slack: <MessageSquare className="w-5 h-5" />,
  gmail: <Mail className="w-5 h-5" />,
  drive: <HardDrive className="w-5 h-5" />,
  ramp: <CreditCard className="w-5 h-5" />,
  avalara: <Receipt className="w-5 h-5" />,
  "claude-in-chrome": <Globe className="w-5 h-5" />,
  "claude-preview": <Eye className="w-5 h-5" />,
  "ccd-session-mgmt": <Brain className="w-5 h-5" />,
};

const CATEGORY_COLOR: Record<MCPServer["category"], string> = {
  ERP: "#22c55e",
  Docs: "#0EBBFF",
  Comms: "#a855f7",
  Finance: "#f59e0b",
  Browser: "#ec4899",
  Dev: "#38bdf8",
};

export function MCPGraph({ servers }: { servers: MCPServer[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  const n = servers.length;
  const cx = 400;
  const cy = 280;
  const r = 200;

  const placed = servers.map((s, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return {
      ...s,
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      color: CATEGORY_COLOR[s.category],
    };
  });

  const active = hovered ? placed.find((p) => p.name === hovered) : null;

  return (
    <div ref={ref} className="my-12 md:my-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-6">
        MCP graph · live tool surface · hover a node
      </p>
      <div
        className="relative rounded-2xl border border-border bg-surface/40 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(var(--accent-rgb),0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <svg viewBox="0 0 800 560" className="w-full h-auto">
          {/* Connection lines */}
          {placed.map((p, i) => (
            <motion.line
              key={p.name + "-line"}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke={p.color}
              strokeOpacity={hovered && hovered !== p.name ? 0.12 : 0.45}
              strokeWidth={hovered === p.name ? 2.2 : 1.2}
              strokeDasharray="3 5"
              initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.06 }}
            />
          ))}

          {/* Central Claude node */}
          <motion.g
            initial={reduced ? undefined : { opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <circle cx={cx} cy={cy} r="60" fill="rgba(14,187,255,0.15)" stroke="rgba(14,187,255,0.7)" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r="46" fill="rgba(14,187,255,0.08)" />
            <foreignObject x={cx - 18} y={cy - 30} width="36" height="36">
              <div className="flex items-center justify-center w-full h-full text-cyan-300">
                <Bot className="w-7 h-7" />
              </div>
            </foreignObject>
            <text x={cx} y={cy + 18} textAnchor="middle" fill="currentColor" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
              Claude
            </text>
            <text x={cx} y={cy + 34} textAnchor="middle" fill="currentColor" opacity="0.55" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
              co-worker
            </text>
          </motion.g>

          {/* MCP nodes */}
          {placed.map((p, i) => {
            const isHover = hovered === p.name;
            const dim = hovered && !isHover ? 0.45 : 1;
            return (
              <motion.g
                key={p.name}
                style={{ cursor: "pointer", opacity: dim }}
                onMouseEnter={() => setHovered(p.name)}
                onMouseLeave={() => setHovered(null)}
                initial={reduced ? undefined : { opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: dim, scale: 1 } : undefined}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHover ? 38 : 32}
                  fill={`${p.color}22`}
                  stroke={p.color}
                  strokeWidth={isHover ? 2 : 1.2}
                />
                <foreignObject x={p.x - 12} y={p.y - 24} width="24" height="24">
                  <div className="flex items-center justify-center w-full h-full" style={{ color: p.color }}>
                    {SERVER_ICONS[p.name] ?? <Wrench className="w-5 h-5" />}
                  </div>
                </foreignObject>
                <text
                  x={p.x}
                  y={p.y + 18}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  opacity="0.85"
                >
                  {p.name}
                </text>
              </motion.g>
            );
          })}

          {/* Category legend bottom */}
          <g transform="translate(20, 525)">
            {(["ERP", "Docs", "Comms", "Finance", "Browser", "Dev"] as MCPServer["category"][]).map((c, i) => (
              <g key={c} transform={`translate(${i * 120}, 0)`}>
                <circle cx="6" cy="0" r="5" fill={CATEGORY_COLOR[c]} opacity="0.85" />
                <text x="18" y="4" fill="currentColor" opacity="0.7" fontSize="10" fontFamily="JetBrains Mono, monospace">
                  {c}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* Hover detail card */}
        <div className="px-5 md:px-8 py-5 border-t border-border bg-background/40 min-h-[110px]">
          {active ? (
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest"
                  style={{
                    color: active.color,
                    background: `${active.color}1f`,
                    border: `1px solid ${active.color}55`,
                  }}
                >
                  {active.category}
                </span>
                <p className="text-sm font-mono text-foreground">{active.name}</p>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{active.what}</p>
              <p className="text-[12px] text-foreground/80 mt-2 leading-relaxed">
                <span className="text-accent">→</span> {active.outcome}
              </p>
            </motion.div>
          ) : (
            <p className="text-[12px] text-text-secondary/70 leading-relaxed">
              Hover a server to see what it does. Connection lines = live tool calls between Claude and the system.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   WORKFLOW BEFORE / AFTER — bottlenecked vs MCP-mediated
   ════════════════════════════════════════════════════════ */

export function WorkflowBeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();

  const beforeSteps = [
    "Stakeholder asks for dashboard",
    "Read spec, draft SQL, open Odoo Studio",
    "Iterate via screenshots over Slack",
    "Schedule call to confirm",
    "Queue for next sprint",
    "Ship in 2–3 weeks (or never)",
  ];

  const afterSteps = [
    "Stakeholder asks in Slack",
    "Claude reads live Odoo schema via MCP",
    "Drafts UI + queries in plan mode",
    "Preview MCP confirms render",
    "Iterate in conversation",
    "Ship same day",
  ];

  return (
    <div ref={ref} className="my-12 md:my-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-6">
        Workflow shift · request → shipped
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.6 }}
          className="rounded-xl border border-red-500/30 bg-red-500/[0.025] p-5 md:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500/80" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-500/90">
              Before — manual, bottlenecked
            </span>
          </div>
          <ol className="space-y-2.5">
            {beforeSteps.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-mono shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-red-400/70 mt-4 font-mono uppercase tracking-widest">
            Days–weeks
          </p>
        </motion.div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, x: 16 }}
          animate={inView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.025] p-5 md:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-500/80" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500/90">
              After — Claude + MCP
            </span>
          </div>
          <ol className="space-y-2.5">
            {afterSteps.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-emerald-400/70 mt-4 font-mono uppercase tracking-widest">
            Same-day
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   DAY IN LIFE — 5-phase timeline
   ════════════════════════════════════════════════════════ */

const PHASE_ICONS: Record<string, React.ReactNode> = {
  "07:30": <Sun className="w-4 h-4" />,
  "09:00": <Clock className="w-4 h-4" />,
  "13:00": <ListChecks className="w-4 h-4" />,
  "16:00": <Users className="w-4 h-4" />,
  "18:00": <Sparkles className="w-4 h-4" />,
};

export function DayInLife({ phases }: { phases: DayPhase[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="my-12 md:my-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-6">
        A day in the life · the AI co-worker doesn&apos;t take PTO
      </p>
      <div className="relative">
        {/* vertical timeline rail */}
        <div className="absolute left-[26px] md:left-[44px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/30 via-accent/50 to-accent/10" />
        <ul className="space-y-6">
          {phases.map((p, i) => (
            <motion.li
              key={p.time}
              initial={reduced ? undefined : { opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pl-[60px] md:pl-[100px]"
            >
              {/* dot */}
              <div className="absolute left-[14px] md:left-[32px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 border border-accent/60 text-accent">
                {PHASE_ICONS[p.time] ?? <Clock className="w-4 h-4" />}
              </div>
              {/* time label */}
              <p className="font-mono text-[10px] text-accent uppercase tracking-widest">
                {p.time} · {p.label}
              </p>
              <ul className="mt-2 space-y-1.5">
                {p.examples.map((ex, j) => (
                  <li
                    key={j}
                    className="text-sm text-text-secondary leading-relaxed flex gap-2"
                  >
                    <span className="text-accent/60 mt-1 shrink-0">·</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ARTIFACT GALLERY — cards by category
   ════════════════════════════════════════════════════════ */

const CAT_ICONS: Record<Artifact["category"], React.ReactNode> = {
  Module: <Boxes className="w-4 h-4" />,
  Portal: <FolderKanban className="w-4 h-4" />,
  Tool: <Wrench className="w-4 h-4" />,
  Doc: <FileText className="w-4 h-4" />,
  Migration: <GitBranch className="w-4 h-4" />,
};

const CAT_COLORS: Record<Artifact["category"], string> = {
  Module: "rgba(34,197,94,0.7)",
  Portal: "rgba(14,187,255,0.7)",
  Tool: "rgba(168,85,247,0.7)",
  Doc: "rgba(245,158,11,0.7)",
  Migration: "rgba(236,72,153,0.7)",
};

export function ArtifactGallery({ artifacts }: { artifacts: Artifact[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="my-12 md:my-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-6">
        Real artifacts · shipped in conversation
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {artifacts.map((a, i) => (
          <motion.div
            key={a.title}
            initial={reduced ? undefined : { opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="rounded-xl border border-border bg-surface/40 p-5 hover:bg-surface-hover/60 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest"
                style={{
                  color: CAT_COLORS[a.category],
                  background: CAT_COLORS[a.category].replace("0.7", "0.12"),
                  border: `1px solid ${CAT_COLORS[a.category].replace("0.7", "0.4")}`,
                }}
              >
                {CAT_ICONS[a.category]}
                {a.category}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-medium text-foreground leading-tight">
              {a.title}
            </h3>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">{a.description}</p>
            <p className="text-[12px] text-foreground/80 mt-3 leading-relaxed flex gap-2">
              <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent" />
              <span>{a.outcome}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   TOOLKIT MOAT — layered visual
   ════════════════════════════════════════════════════════ */

export function ToolkitMoat() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  const layers = [
    { label: "Anyone can use Claude", note: "free tier · web · IDE plugin", weight: "common" },
    { label: "Some run Claude Code locally", note: "agentic edits · plan mode · slash skills", weight: "few" },
    { label: "Fewer wire it to one MCP server", note: "Odoo, Notion, etc. · single integration", weight: "fewer" },
    { label: "Heckler runs 10+ MCP servers concurrently", note: "ERP + Comms + Finance + Browser + Memory · role-correct permissions", weight: "rare" },
  ];

  const tint: Record<string, string> = {
    common: "rgba(255,255,255,0.04)",
    few: "rgba(14,187,255,0.10)",
    fewer: "rgba(168,85,247,0.14)",
    rare: "rgba(34,197,94,0.18)",
  };
  const border: Record<string, string> = {
    common: "rgba(255,255,255,0.10)",
    few: "rgba(14,187,255,0.40)",
    fewer: "rgba(168,85,247,0.55)",
    rare: "rgba(34,197,94,0.70)",
  };

  return (
    <div ref={ref} className="my-12 md:my-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-6">
        Toolkit is the moat · the funnel narrows fast
      </p>
      <div className="space-y-2">
        {layers.map((l, i) => (
          <motion.div
            key={i}
            initial={reduced ? undefined : { opacity: 0, x: -12, width: "60%" }}
            animate={inView ? { opacity: 1, x: 0, width: `${100 - i * 12}%` } : undefined}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="rounded-lg border px-5 py-3.5"
            style={{
              background: tint[l.weight],
              borderColor: border[l.weight],
            }}
          >
            <p className="text-sm md:text-base text-foreground font-medium">{l.label}</p>
            <p className="text-[11px] text-text-secondary/80 mt-1">{l.note}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
