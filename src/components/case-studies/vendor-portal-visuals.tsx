"use client";

/**
 * Visual components for the Vendor Portal case study.
 * - Architecture diagram (SVG, animated stroke draw)
 * - Before/After spreadsheet vs portal comparison
 * - Permissions matrix (interactive hover)
 * - Route map (16 pages, hover for detail)
 * - Animated scope ticker
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Sheet,
  Database,
  Users,
  Shield,
  Check,
  X,
  ArrowRight,
  Layers,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

/* ════════════════════════════════════════════════════════
   ARCHITECTURE DIAGRAM
   ════════════════════════════════════════════════════════ */

export function ArchitectureDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="my-12 md:my-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-6">
        Architecture · sole-source-of-truth
      </p>
      <div
        className="relative rounded-2xl border border-border bg-surface/40 p-6 md:p-10 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(var(--accent-rgb),0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <svg
          viewBox="0 0 800 460"
          className="w-full h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* User cards top */}
          <motion.g
            initial={reduced ? undefined : { opacity: 0, y: -10 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.0 }}
          >
            <rect x="60" y="20" width="200" height="60" rx="10" fill="rgba(14,187,255,0.08)" stroke="rgba(14,187,255,0.5)" />
            <text x="160" y="46" textAnchor="middle" fill="currentColor" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
              Heckler Ops
            </text>
            <text x="160" y="64" textAnchor="middle" fill="currentColor" opacity="0.55" fontSize="10" fontFamily="JetBrains Mono, monospace">
              write · admin
            </text>
          </motion.g>

          <motion.g
            initial={reduced ? undefined : { opacity: 0, y: -10 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <rect x="540" y="20" width="200" height="60" rx="10" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.5)" />
            <text x="640" y="46" textAnchor="middle" fill="currentColor" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
              Partner Production
            </text>
            <text x="640" y="64" textAnchor="middle" fill="currentColor" opacity="0.55" fontSize="10" fontFamily="JetBrains Mono, monospace">
              read · comment
            </text>
          </motion.g>

          {/* Connecting lines from users to portal */}
          <motion.path
            d="M 160 80 L 280 180"
            stroke="rgba(14,187,255,0.5)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={reduced ? undefined : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 0.9, delay: 0.3 }}
          />
          <motion.path
            d="M 640 80 L 520 180"
            stroke="rgba(168,85,247,0.5)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={reduced ? undefined : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 0.9, delay: 0.3 }}
          />

          {/* /admin and /portal labels on lines */}
          <text x="195" y="120" fontSize="11" fill="rgba(14,187,255,0.95)" fontFamily="JetBrains Mono, monospace">
            /admin
          </text>
          <text x="565" y="120" fontSize="11" fill="rgba(168,85,247,0.95)" fontFamily="JetBrains Mono, monospace">
            /portal
          </text>

          {/* Portal layer (Next.js + TanStack) */}
          <motion.g
            initial={reduced ? undefined : { opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <rect x="120" y="170" width="560" height="80" rx="14" fill="rgba(255,255,255,0.04)" stroke="currentColor" strokeOpacity="0.25" />
            <text x="400" y="196" textAnchor="middle" fill="currentColor" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
              Next.js 16 portal + TanStack Query
            </text>
            <text x="400" y="218" textAnchor="middle" fill="currentColor" opacity="0.55" fontSize="10" fontFamily="JetBrains Mono, monospace">
              same schema · two roles · 10s stale ceiling · optimistic mutations
            </text>
            <text x="400" y="236" textAnchor="middle" fill="rgba(14,187,255,0.85)" fontSize="10" fontFamily="JetBrains Mono, monospace">
              shadcn/ui · Heckler brand tokens
            </text>
          </motion.g>

          {/* XML-RPC line down */}
          <motion.path
            d="M 400 250 L 400 320"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.5"
            initial={reduced ? undefined : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 0.7, delay: 0.7 }}
          />
          <motion.circle
            cx="400"
            cy="285"
            r="3"
            fill="rgba(14,187,255,0.9)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ delay: 1 }}
          />
          <text x="412" y="290" fontSize="10" fill="currentColor" opacity="0.7" fontFamily="JetBrains Mono, monospace">
            XML-RPC · ~150ms
          </text>

          {/* Odoo cylinder bottom */}
          <motion.g
            initial={reduced ? undefined : { opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.85 }}
          >
            <ellipse cx="400" cy="335" rx="160" ry="18" fill="rgba(34,197,94,0.18)" stroke="rgba(34,197,94,0.7)" />
            <rect x="240" y="335" width="320" height="80" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.7)" />
            <ellipse cx="400" cy="415" rx="160" ry="18" fill="rgba(34,197,94,0.18)" stroke="rgba(34,197,94,0.7)" />
            <text x="400" y="385" textAnchor="middle" fill="currentColor" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="600">
              Odoo 19 Enterprise
            </text>
            <text x="400" y="403" textAnchor="middle" fill="currentColor" opacity="0.6" fontSize="10" fontFamily="JetBrains Mono, monospace">
              sole source of truth · 0 nightly syncs
            </text>
          </motion.g>

          {/* Crossed-out spreadsheet badge */}
          <motion.g
            initial={reduced ? undefined : { opacity: 0, x: -10 }}
            animate={inView ? { opacity: 0.55, x: 0 } : undefined}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <rect x="40" y="350" width="120" height="48" rx="6" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.45)" strokeDasharray="3 3" />
            <text x="100" y="372" textAnchor="middle" fill="rgba(239,68,68,0.95)" fontSize="11" fontFamily="JetBrains Mono, monospace">
              Google Sheet
            </text>
            <text x="100" y="388" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="10" fontFamily="JetBrains Mono, monospace">
              retired
            </text>
            <line x1="46" y1="354" x2="156" y2="394" stroke="rgba(239,68,68,0.7)" strokeWidth="2" />
          </motion.g>
        </svg>
      </div>
      <p className="text-[11px] text-text-secondary/70 mt-3 max-w-2xl">
        Two roles, one schema. Every read and write hits Odoo via XML-RPC — no shadow database, no
        sync job. The 10-second TanStack stale ceiling masks API latency without lying about
        freshness.
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   BEFORE / AFTER
   ════════════════════════════════════════════════════════ */

export function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();

  const messyCols = [
    "SKU?",
    "Old name",
    "Hecker SKU",
    "Vendor code",
    "Qty",
    "Ready??",
    "Date",
    "Notes",
    "Color",
    "Hold?",
    "Returned",
    "Cr memo",
  ];

  return (
    <div ref={ref} className="my-12 md:my-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-6">
        Schema, not chaos · before / after
      </p>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-center">
        {/* BEFORE — messy spreadsheet */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-xl border border-red-500/30 bg-red-500/[0.025] p-5 overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sheet className="w-3.5 h-3.5 text-red-500/80" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-500/90">
              Before — 8,441 rows × 50 cols
            </span>
          </div>

          <div className="bg-background/40 rounded border border-red-500/20 overflow-hidden">
            <div className="grid grid-cols-6 gap-px bg-red-500/10">
              {messyCols.slice(0, 6).map((c, i) => (
                <div
                  key={i}
                  className="bg-background/80 text-[9px] font-mono px-1.5 py-1 truncate text-red-500/80"
                >
                  {c}
                </div>
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, r) => (
              <div key={r} className="grid grid-cols-6 gap-px bg-red-500/10">
                {messyCols.slice(0, 6).map((_, c) => {
                  const broken = (r + c) % 4 === 0;
                  return (
                    <div
                      key={c}
                      className="bg-background/60 text-[8px] font-mono px-1.5 py-1 truncate"
                      style={{
                        color: broken ? "rgba(239,68,68,0.85)" : "rgba(255,255,255,0.45)",
                        textDecoration: broken && c === 1 ? "line-through" : undefined,
                      }}
                    >
                      {broken
                        ? c === 0
                          ? "??"
                          : c === 1
                            ? "TBD"
                            : c === 3
                              ? "see col AH"
                              : "—"
                        : c === 4
                          ? Math.floor(Math.random() * 200)
                          : c === 5
                            ? "yes"
                            : "x"}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <ul className="mt-4 space-y-1.5 text-[11px] text-text-secondary">
            <li className="flex gap-2"><AlertTriangle className="w-3 h-3 text-red-500/70 mt-0.5 shrink-0" /> Free-form notes columns</li>
            <li className="flex gap-2"><AlertTriangle className="w-3 h-3 text-red-500/70 mt-0.5 shrink-0" /> SKU drift between systems</li>
            <li className="flex gap-2"><AlertTriangle className="w-3 h-3 text-red-500/70 mt-0.5 shrink-0" /> No audit, no permissions, no schema</li>
          </ul>
        </motion.div>

        {/* ARROW */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-2 py-4"
        >
          <ArrowRight className="w-6 h-6 text-accent rotate-90 md:rotate-0" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent/80">
            normalize
          </span>
        </motion.div>

        {/* AFTER — clean record */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.025] p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-3.5 h-3.5 text-emerald-500/80" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500/90">
              After — typed Odoo record
            </span>
          </div>

          <div className="bg-background/40 rounded border border-emerald-500/20 p-3 font-mono text-[11px] space-y-1">
            <Row k="product.id" v="prd-08842" />
            <Row k="default_code" v="HD-LCT-114-B" />
            <Row k="partner_sku" v="AEI-1140" />
            <Row k="qty_on_hand" v="142" />
            <Row k="x_studio_ready_date" v="2026-06-04" />
            <Row k="x_studio_ready_on_shelf" v="true" />
            <Row k="x_studio_inventory_held_at_vendor" v="68" />
            <Row k="state" v="confirmed" />
          </div>

          <ul className="mt-4 space-y-1.5 text-[11px] text-text-secondary">
            <li className="flex gap-2"><Check className="w-3 h-3 text-emerald-500/80 mt-0.5 shrink-0" /> Typed fields, audit trail</li>
            <li className="flex gap-2"><Check className="w-3 h-3 text-emerald-500/80 mt-0.5 shrink-0" /> Permissions per role</li>
            <li className="flex gap-2"><Check className="w-3 h-3 text-emerald-500/80 mt-0.5 shrink-0" /> Same record both teams see</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-emerald-500/70 truncate">{k}</span>
      <span className="text-foreground/80 text-right truncate">{v}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PERMISSIONS MATRIX
   ════════════════════════════════════════════════════════ */

const PERMS: { capability: string; ops: boolean; partner: boolean; note?: string }[] = [
  { capability: "View products", ops: true, partner: true },
  { capability: "View purchase orders", ops: true, partner: true },
  { capability: "Edit partner SKU", ops: true, partner: false, note: "master-data integrity" },
  { capability: "Update ready-to-ship date", ops: true, partner: true },
  { capability: "Update shipped quantity", ops: true, partner: true },
  { capability: "Mark inventory held at vendor", ops: true, partner: true },
  { capability: "Confirm vendor returns", ops: true, partner: false },
  { capability: "Create credit memo links", ops: true, partner: false },
  { capability: "View pricing history", ops: true, partner: false, note: "internal margin data" },
];

export function PermissionsMatrix() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="my-12 md:my-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-6">
        Permissions matrix · why master-data drift stops at the role boundary
      </p>
      <div className="rounded-xl border border-border bg-surface/40 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_120px_120px] gap-4 px-4 md:px-6 py-3 border-b border-border bg-background/60">
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">
            Capability
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary text-center flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-cyan-400" />
            Heckler Ops
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary text-center flex items-center justify-center gap-1.5">
            <Users className="w-3 h-3 text-purple-400" />
            Partner
          </span>
        </div>

        {/* Rows */}
        {PERMS.map((row, i) => (
          <motion.div
            key={row.capability}
            initial={reduced ? undefined : { opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, delay: 0.06 * i }}
            className="grid grid-cols-[1fr_120px_120px] gap-4 px-4 md:px-6 py-3 border-b border-border/40 hover:bg-surface-hover/40 transition-colors"
          >
            <div>
              <p className="text-sm text-foreground">{row.capability}</p>
              {row.note ? (
                <p className="text-[10px] text-text-secondary/70 mt-0.5">{row.note}</p>
              ) : null}
            </div>
            <PermCell allowed={row.ops} color="cyan" />
            <PermCell allowed={row.partner} color="purple" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PermCell({ allowed, color }: { allowed: boolean; color: "cyan" | "purple" }) {
  const tint =
    color === "cyan"
      ? allowed
        ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
        : "bg-red-500/10 border-red-500/30 text-red-400"
      : allowed
        ? "bg-purple-500/15 border-purple-500/40 text-purple-300"
        : "bg-red-500/10 border-red-500/30 text-red-400";
  return (
    <div className="flex items-center justify-center">
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-md border ${tint}`}
      >
        {allowed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ROUTE MAP (sitemap of admin + portal pages)
   ════════════════════════════════════════════════════════ */

const ADMIN_ROUTES = [
  { path: "/admin", label: "Dashboard" },
  { path: "/admin/products", label: "Products · inline SKU edit" },
  { path: "/admin/orders", label: "Orders · tabbed + paginated" },
  { path: "/admin/orders/[id]", label: "Order detail · timeline + pickings" },
  { path: "/admin/pricing", label: "Pricing · margin thresholds" },
  { path: "/admin/deliveries", label: "Deliveries · overdue alerts" },
  { path: "/admin/returns", label: "Returns · list + stats" },
  { path: "/admin/returns/[id]", label: "Return detail · pipeline" },
  { path: "/admin/returns/new", label: "New return wizard" },
  { path: "/admin/analytics", label: "Analytics · Recharts" },
];

const PORTAL_ROUTES = [
  { path: "/portal", label: "Welcome dashboard" },
  { path: "/portal/products", label: "Products · read-only" },
  { path: "/portal/orders", label: "Orders · vendor update form" },
  { path: "/portal/orders/[id]", label: "Order detail" },
  { path: "/portal/deliveries", label: "Deliveries · view-only" },
  { path: "/portal/returns", label: "Returns · request portal" },
];

export function RouteMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="my-12 md:my-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-6">
        Route map · 10 admin + 6 portal = 16 pages, shipped
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RouteColumn
          title="/admin"
          color="cyan"
          icon={<Shield className="w-3.5 h-3.5" />}
          routes={ADMIN_ROUTES}
          inView={inView}
          reduced={!!reduced}
        />
        <RouteColumn
          title="/portal"
          color="purple"
          icon={<Users className="w-3.5 h-3.5" />}
          routes={PORTAL_ROUTES}
          inView={inView}
          reduced={!!reduced}
        />
      </div>
    </div>
  );
}

function RouteColumn({
  title,
  color,
  icon,
  routes,
  inView,
  reduced,
}: {
  title: string;
  color: "cyan" | "purple";
  icon: React.ReactNode;
  routes: { path: string; label: string }[];
  inView: boolean;
  reduced: boolean;
}) {
  const dot =
    color === "cyan" ? "bg-cyan-400/70" : "bg-purple-400/70";
  const border =
    color === "cyan" ? "border-cyan-500/30" : "border-purple-500/30";
  const text = color === "cyan" ? "text-cyan-300" : "text-purple-300";

  return (
    <div className={`rounded-xl border ${border} bg-surface/40 p-5 md:p-6`}>
      <p
        className={`text-[11px] font-mono uppercase tracking-widest ${text} mb-4 flex items-center gap-2`}
      >
        {icon}
        {title}
      </p>
      <ul className="space-y-2">
        {routes.map((r, i) => (
          <motion.li
            key={r.path}
            initial={reduced ? undefined : { opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.4, delay: 0.04 * i }}
            className="flex items-start gap-2 text-sm group"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dot} mt-2 shrink-0`} />
            <div className="min-w-0">
              <p className="font-mono text-[11px] text-foreground/80 truncate">{r.path}</p>
              <p className="text-[11px] text-text-secondary/80 leading-tight">{r.label}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ANIMATED SCOPE TICKER (counter that animates on view)
   ════════════════════════════════════════════════════════ */

export function ScopeTicker({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
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
    const duration = 1400;
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

  return (
    <div ref={ref}>
      <p className="serif-display text-3xl md:text-4xl font-normal text-foreground leading-none tabular-nums">
        {v.toLocaleString()}
        {suffix}
      </p>
      <p className="text-xs text-text-secondary uppercase tracking-wider mt-2">{label}</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   STATE PIPELINE (return lifecycle)
   ════════════════════════════════════════════════════════ */

const PIPELINE = [
  { label: "Draft", note: "ops creates" },
  { label: "Requested", note: "partner reviews" },
  { label: "In Transit", note: "ShipStation pickup" },
  { label: "Received", note: "stock.picking confirms" },
  { label: "Credit Note", note: "DRAFT until vendor memo lands" },
  { label: "Closed", note: "GL posted" },
];

export function ReturnPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="my-12 md:my-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-6">
        Return pipeline · 6 stages, all visible to both teams
      </p>
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-stretch gap-2 md:gap-0">
          {PIPELINE.map((s, i) => {
            const isLast = i === PIPELINE.length - 1;
            return (
              <motion.div
                key={s.label}
                initial={reduced ? undefined : { opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex-1 relative"
              >
                <div className="rounded-lg border border-border bg-surface/50 p-3 md:p-4 h-full">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent/15 text-accent text-[10px] font-mono">
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-2 leading-tight">{s.note}</p>
                </div>
                {!isLast && (
                  <ChevronRight
                    className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 text-accent/60 z-10"
                    aria-hidden
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   STACK CAKE (layered visual)
   ════════════════════════════════════════════════════════ */

export function StackCake() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  const layers = [
    { label: "UI · shadcn/ui + Heckler brand tokens", color: "rgba(14,187,255,0.18)", border: "rgba(14,187,255,0.5)" },
    { label: "App · Next.js 16 App Router + TanStack Query", color: "rgba(168,85,247,0.18)", border: "rgba(168,85,247,0.5)" },
    { label: "Edge · 8 API routes · XML-RPC marshalling", color: "rgba(236,72,153,0.18)", border: "rgba(236,72,153,0.5)" },
    { label: "Data · Odoo 19 Enterprise — sole source of truth", color: "rgba(34,197,94,0.22)", border: "rgba(34,197,94,0.6)" },
  ];

  return (
    <div ref={ref} className="my-12 md:my-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-6">
        Stack cake · UI → data, four layers, no detours
      </p>
      <div className="flex items-center gap-6 md:gap-10">
        <Layers className="w-6 h-6 text-text-secondary/50 shrink-0 hidden md:block" />
        <div className="flex-1 space-y-2">
          {layers.map((l, i) => (
            <motion.div
              key={i}
              initial={reduced ? undefined : { opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-lg border px-4 md:px-5 py-3 md:py-3.5"
              style={{
                background: l.color,
                borderColor: l.border,
              }}
            >
              <p className="text-sm md:text-base text-foreground">{l.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
