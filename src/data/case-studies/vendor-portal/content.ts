/**
 * Case Study 02 — Vendor Returns Portal
 *
 * All prose / data in one place. Self-contained page (does not reuse
 * the hardcoded odoo-17 components). Mirrors visual rhythm via shared
 * serif typography utilities.
 *
 * Privacy: the partner manufacturer's real name is withheld. Numbers
 * are real but anonymized at the partner level.
 */

export const META = {
  slug: "vendor-portal",
  title: "Replaced an 8,441-Row Vendor Spreadsheet With a Live Portal",
  subtitle:
    "The relationship with Heckler's largest contract manufacturer lived in a Google Sheet for years. The new portal runs on Odoo as the sole system of record — no SQLite, no parallel database — with collaborative access for both teams.",
  role: "ERP Systems Engineer — solo build. Schema, UI, API, integrations.",
  date: "Q4 2025 → Q1 2026",
  partner: "Contract manufacturing partner (name withheld)",
};

export const HERO_NUMBER = {
  big: "8,441",
  unit: "rows",
  caption:
    "Rows in the legacy spreadsheet — SKU mappings, multi-year pricing, kanban quantities, PO history, delivery state, production holds, returns — collapsed into a single live Odoo-backed portal.",
};

export const SITUATION = {
  paragraphs: [
    "Heckler's largest contract manufacturer ships hundreds of SKUs against thousands of POs. The full relationship — 399 product supplier records, 3,292 historical POs, 3,583 stock pickings, 21 vendor returns — was tracked in a single 50-column Google Sheet that had grown to 8,441 rows.",
    "Heckler ops, the partner's production lead, and our procurement team all edited the same sheet — different columns, different filters, frequent merge conflicts, no audit trail. SKU mappings drifted. PO numbers were transcribed by hand. Returns escaped accounting because the row never made it past column AH.",
    "The constraint: Heckler runs everything on Odoo 19. A standalone portal with its own database would have created two sources of truth and the same drift the spreadsheet already had. The portal had to read and write Odoo via XML-RPC live — no caching layer, no SQLite, no nightly sync.",
  ],
};

export const PROBLEM = {
  lead:
    "The spreadsheet wasn't broken because it was a spreadsheet. It was broken because three teams in two companies were editing the same source of truth without permissions, audit, or schema.",
  body: [
    "Every kanban replenishment cycle started with someone DM'ing 'is the sheet up to date?' before placing the actual PO.",
    "Supplier-info product codes in Odoo were empty — partner SKUs only existed in the spreadsheet. The two systems never agreed.",
    "Vendor returns used the standard Odoo stock-picking reverse flow, but no one tracked them in the sheet, so credit memos lagged.",
    "Critical fields — ready-to-ship date, inventory held at vendor, ready-on-shelf — lived in 'free-form notes' columns. Filtering on them was guesswork.",
  ],
};

export interface ApproachPillar {
  title: string;
  body: string;
}

export const APPROACH: ApproachPillar[] = [
  {
    title: "Odoo 19 as the only data store",
    body:
      "Every screen reads + writes through XML-RPC. No nightly sync, no shadow database. If Odoo doesn't know it, the portal doesn't show it. Trade-off: ~150ms latency on hot pages — accepted, masked with optimistic UI + 10-second TanStack Query stale time.",
  },
  {
    title: "Two front doors, one schema",
    body:
      "/admin/* for Heckler ops (write access, can edit partner SKUs, can confirm returns). /portal/* for the partner's production lead (read + comment, can update ready-to-ship date and shipped quantities). Same Odoo records under the hood — no separate vendor table.",
  },
  {
    title: "Custom fields, not custom modules",
    body:
      "Used Odoo Studio to add ready-date, inventory-held-at-vendor, and ready-on-shelf fields to the existing models. No XML manifest, no upgrade migration to manage. Studio fields survived the Odoo 16→17 cutover (Case Study 01) without rework.",
  },
  {
    title: "Vendors cannot edit SKUs — only Heckler can",
    body:
      "The partner sees their products. They cannot rename, recode, or remap them. Master-data integrity is the single biggest reason the spreadsheet was a mess; the portal closes that loophole at the permissions layer, not the UI layer.",
  },
  {
    title: "shadcn/ui + Heckler brand tokens — not a generic admin theme",
    body:
      "Built on shadcn primitives but every token re-mapped to Heckler's brand CSS (warm white #FDFCF8, black #2F3234, CTA blue #0EBBFF). The portal looks like it belongs to the same company as hecklerdesign.com. Vendors notice; ops trusts it; the spreadsheet got retired without a fight.",
  },
];

export interface StackEntry {
  group: string;
  items: { name: string; note?: string }[];
}

export const STACK: StackEntry[] = [
  {
    group: "App",
    items: [
      { name: "Next.js 16.2 (App Router)" },
      { name: "TypeScript 5" },
      { name: "Tailwind CSS 4" },
      { name: "shadcn/ui", note: "remapped to Heckler tokens" },
      { name: "Lucide React" },
    ],
  },
  {
    group: "Data",
    items: [
      { name: "Odoo 19 Enterprise", note: "sole source of truth" },
      { name: "XML-RPC client", note: "src/lib/odoo.ts" },
      { name: "TanStack Query v5", note: "10s staleTime" },
      { name: "Custom hooks", note: "useProducts, useOrders, useReturns" },
    ],
  },
  {
    group: "Auth + Ops",
    items: [
      { name: "NextAuth (scaffolded)" },
      { name: "Recharts", note: "analytics" },
      { name: "Gmail SMTP + Slack webhooks", note: "scoped, stubbed in v1" },
    ],
  },
];

export interface ScopeEntry {
  label: string;
  value: string;
  caption?: string;
}

export const SCOPE: ScopeEntry[] = [
  { label: "Suppliers in scope", value: "1", caption: "Largest contract manufacturer. Pattern extends to all suppliers in v2." },
  { label: "Product records", value: "398" },
  { label: "Supplier mappings", value: "399" },
  { label: "Purchase orders surfaced", value: "3,292+" },
  { label: "Stock pickings exposed", value: "3,583" },
  { label: "Vendor returns tracked", value: "21" },
  { label: "API routes shipped", value: "8" },
  { label: "Admin pages shipped", value: "10" },
  { label: "Portal pages shipped", value: "6" },
];

export interface OutcomeMetric {
  value: string;
  label: string;
  caption: string;
}

export const OUTCOMES: OutcomeMetric[] = [
  {
    value: "1 source of truth",
    label: "Spreadsheet retired",
    caption:
      "8,441 rows × 50+ columns collapsed into normalized Odoo records. Schema is the schema; no parallel state.",
  },
  {
    value: "0 nightly syncs",
    label: "Live data, every read",
    caption:
      "Every page hits XML-RPC. No staleness window. No reconciliation job. No 2am-pager.",
  },
  {
    value: "10s",
    label: "Staleness ceiling",
    caption:
      "TanStack Query staleTime — masks API latency without lying about freshness. Mutations invalidate keys immediately.",
  },
  {
    value: "2",
    label: "Companies, same schema",
    caption:
      "Heckler ops + partner production lead see the same record, filtered by role. Comments, not chat threads. Audit, not memory.",
  },
];

export const FOLLOW_ON = [
  "Pattern extends to every other supplier — the contract manufacturer was the proof, not the limit.",
  "Two-bin kanban planned for v2 — Heckler ops set bin thresholds, portal sends pickup signals automatically.",
  "Auth + notifications (Gmail SMTP, Slack) staged behind AUTH_BYPASS=true until credentials are ready.",
  "QC + Vendor RMA Odoo module (separate repo) plugs into the same portal — returns escape spreadsheet for good.",
];

export interface Lesson {
  title: string;
  body: string;
}

export const LESSONS: Lesson[] = [
  {
    title: "Single source of truth is a permissions question, not a database question",
    body:
      "The spreadsheet was a single file. It was still many sources of truth, because three teams edited overlapping columns with no schema. Moving to Odoo only fixed it because the portal locks edit rights to roles — vendors can't rename SKUs, ops can't fake a delivery date.",
  },
  {
    title: "Live XML-RPC is fast enough if you stop pretending you need 50ms",
    body:
      "I almost shipped a Redis layer. Killed it before launch. Odoo XML-RPC at 150ms feels instant once you stage the UI with skeleton states + optimistic mutations. Saved a service, kept the architecture honest.",
  },
  {
    title: "shadcn + brand tokens beat a custom design system",
    body:
      "Two weeks pre-portal I tried to roll a custom component library. Cost: 4 days, output: 6 buttons. Switched to shadcn, remapped CSS variables to Heckler's brand, shipped 18 components in one afternoon. Bespoke ≠ better; bespoke = slower.",
  },
  {
    title: "Most of the work was face-to-face",
    body:
      "I built the schema by walking the partner's shop floor with their production lead, then walking Heckler's procurement floor with our procurement team. The Sheet wasn't documentation; it was a fossil of every conversation the two teams had ever had. The portal is the conversation, normalized.",
  },
];

export const TEAM = [
  { name: "Tanmay Raut", role: "ERP architect / sole builder — schema, UI, API, integrations", internal: true },
  { name: "Partner production lead", role: "Stakeholder — daily user, SKU + delivery validator", internal: false },
  { name: "Heckler Procurement Lead", role: "Primary admin user, kanban owner", internal: true },
];

export const STATUS = {
  label: "Status",
  text:
    "V2 complete. All admin + portal pages live. Auth + notifications staged behind feature flags pending credential rollout. Partner invited to a private preview Q1 2026; full retirement of the spreadsheet planned for the same quarter.",
};
