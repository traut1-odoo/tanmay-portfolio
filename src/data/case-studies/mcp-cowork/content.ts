/**
 * Case Study 03 — Claude + MCP as ERP Co-worker
 *
 * Meta-case-study: how an AI co-worker (Claude) connected to live
 * business systems via the Model Context Protocol (MCP) reshaped how
 * one solo ERP owner runs an 8-department platform.
 *
 * Sensitive info filter: no real vendor names, no real financial
 * figures, no real employee names beyond Tanmay, no transaction IDs.
 * All artifacts described at category level; numbers are anonymized
 * or expressed as relative deltas.
 */

export const META = {
  slug: "mcp-cowork",
  title: "Hired an AI Co-worker. It Doesn't Take PTO.",
  subtitle:
    "How Claude + Model Context Protocol servers turned a single ERP Systems Engineer into a one-person platform team — modules shipped, dashboards built, visibility improved across 8 departments, no headcount added.",
  role: "ERP Systems Engineer — sole internal owner",
  date: "2025–2026 · ongoing",
  partner: "Anthropic Claude (sonnet + opus) + ~10 MCP servers wired to Heckler's stack",
};

export const HERO_NUMBER = {
  big: "10+",
  unit: "MCP servers",
  caption:
    "Live tool access to Odoo, Notion, Slack, Drive, Gmail, Ramp, Avalara, Chrome, and more. Claude doesn't summarize what the systems should look like — it reads the live state, writes the change, and shows the receipt.",
};

export const SITUATION = {
  paragraphs: [
    "I'm the sole internal owner of Heckler's ERP. 8 departments — manufacturing, finance, purchasing, sales, inventory, quality, CRM, shipping — all run on a single Odoo instance. There is no platform team. There is no headcount budget. There is one ERP Systems Engineer, reporting to the CEO, with an external developer on contract for code pushes.",
    "Before Claude + MCP, my day was bottlenecks. A dashboard request meant: read the spec, write the SQL, eyeball it in Odoo Studio, screenshot to the requester, iterate. A module patch meant: open the file, recall the model layout, write the Python, hand it to the external dev, wait. A vendor portal request meant: schedule the call, write the spec, find the time to scaffold the Next.js, write the XML-RPC client, design the schema, hand-test the writes.",
    "Now my day is leverage. Claude reads the live Odoo schema via MCP, drafts the model patch, runs it in a sandbox session, iterates with me in plan mode before any code ships. Dashboard requests get a working prototype back in the same conversation. Module work moves from \"queued for next sprint\" to \"shipped today\". My role didn't change — my throughput did.",
  ],
};

export const PROBLEM = {
  lead:
    "A solo ERP owner has two failure modes: drown in tickets, or starve the business of platform improvements. Both are common. AI co-work makes neither necessary.",
  body: [
    "Every department wants a dashboard. None of them want to write SQL. The historical answer was \"queued\" — which meant never.",
    "Every module change risks production. The historical answer was \"slow it down\" — which meant the platform never improved.",
    "Every vendor relationship leaks information. The historical answer was a Google Sheet — which meant the leak just got bigger.",
    "Every accounting reconciliation eats a week. The historical answer was hire a person — which the budget never funds.",
  ],
};

export interface MCPServer {
  name: string;
  category: "ERP" | "Comms" | "Docs" | "Finance" | "Browser" | "Dev";
  what: string;
  outcome: string;
}

export const MCP_SERVERS: MCPServer[] = [
  {
    name: "odoo19",
    category: "ERP",
    what: "Live XML-RPC to Heckler's Odoo 19 Enterprise — search, read, create, update, delete records across every business module.",
    outcome:
      "Claude reads the live schema before drafting any patch. No more guessing field names. No more dry-runs that drift from prod.",
  },
  {
    name: "notion",
    category: "Docs",
    what: "Workspace search + page CRUD across teamspaces, databases, and connected sources.",
    outcome:
      "SOPs, vendor specs, project plans co-authored in Notion without a tab switch. Decisions get recorded the moment they're made.",
  },
  {
    name: "slack",
    category: "Comms",
    what: "Read + send across channels, threads, search, reactions, canvases.",
    outcome:
      "End-of-day summary across 12 channels in 90 seconds. No-one slips through. Vendor escalations triaged before standup.",
  },
  {
    name: "gmail",
    category: "Comms",
    what: "Drafts, labels, threads — vendor + customer correspondence search and reply.",
    outcome:
      "Vendor returns paperwork drafted from the PO context, not from memory. Tone consistent because the prompt is.",
  },
  {
    name: "drive",
    category: "Docs",
    what: "Read + search Drive files across Heckler workspaces.",
    outcome:
      "Quote sheets and spec PDFs feed into module requirements without manual transcription.",
  },
  {
    name: "ramp",
    category: "Finance",
    what: "Spend categories, vendor agreements, bills, transactions, reimbursements — full read access.",
    outcome:
      "Cross-system reconciliation between Odoo bills and card spend takes minutes instead of half-days. AP exceptions surface daily, not weekly.",
  },
  {
    name: "avalara",
    category: "Finance",
    what: "Tax rate lookups, nexus rules, transaction lookups across companies and locations.",
    outcome:
      "Tax-exempt edge cases resolved at the SO without an accountant ticket. Customer onboarding faster.",
  },
  {
    name: "claude-in-chrome",
    category: "Browser",
    what: "Headed browser automation — navigation, form fills, screenshots, file uploads, console inspection.",
    outcome:
      "End-to-end test runs against the live portal. Vendor onboarding flows audited in minutes. Bugs reproduced once, not three times.",
  },
  {
    name: "claude-preview",
    category: "Dev",
    what: "Live dev-server preview with screenshot, console, network, click, eval, snapshot.",
    outcome:
      "UI iterations land in the same conversation. No \"can you screenshot this\" loop. AI sees what I see.",
  },
  {
    name: "ccd-session-mgmt",
    category: "Dev",
    what: "Search and list every past Claude Code session — full transcript memory.",
    outcome:
      "Decisions and gotchas from 6 months ago retrieved in one query. Nothing learned twice.",
  },
];

export interface Artifact {
  category: "Module" | "Portal" | "Tool" | "Doc" | "Migration";
  title: string;
  description: string;
  outcome: string;
}

export const ARTIFACTS: Artifact[] = [
  {
    category: "Migration",
    title: "Odoo 16 → 17 upgrade",
    description:
      "Plan, risk-map, tiered go-live, stakeholder sign-off, rollback documentation, cutover execution.",
    outcome: "65-hour zero-loss cutover. Detailed in Case Study 01.",
  },
  {
    category: "Portal",
    title: "Vendor returns portal",
    description:
      "Next.js portal replacing an 8,441-row vendor spreadsheet. Odoo XML-RPC sole source of truth.",
    outcome: "Detailed in Case Study 02. Schema designed in conversation; UI shipped same week.",
  },
  {
    category: "Module",
    title: "QC + Vendor RMA Odoo module",
    description:
      "Full quality-control RMA flow inside Odoo — defect → RMA → credit memo (draft) → return shipment → close. 24 module files, 4 dispositions, vendor portal with photos.",
    outcome:
      "Schema designed with Claude reading live PO and stock.picking models. Implementation handed to external dev with full spec.",
  },
  {
    category: "Module",
    title: "Attendance gate module for Odoo 19",
    description:
      "Upgraded a custom HR attendance module from 17 to 19 — field renames, manifest updates, view conversion.",
    outcome: "Shipped without code crossing my keyboard. Tested in sandbox session before push.",
  },
  {
    category: "Module",
    title: "Heckler Headless (PR #62 merged)",
    description:
      "Headless-storefront experiments wiring Odoo as commerce backend.",
    outcome: "Prototype shipped, PR merged into trunk.",
  },
  {
    category: "Tool",
    title: "MCP-grounded portfolio chatbot",
    description:
      "Cloudflare Worker proxy + Anthropic API. ~10K-token grounded context built from src/data/*.ts files. Answers visitor questions about projects, stack, cutover specifics — in third person, refusing hallucination.",
    outcome:
      "Public, free, no client-side key leak. Production cache-hit ratio >90% on a 5-minute TTL.",
  },
  {
    category: "Tool",
    title: "This portfolio site",
    description:
      "Designed, scaffolded, polished, and shipped in conversation. Three case studies. Custom cursor. Cmd+K palette. Cinematic 3D hero. Mountain-journey scroll parallax.",
    outcome: "From blank repo to A-tier portfolio in a fraction of the time hand-coding would take.",
  },
  {
    category: "Doc",
    title: "Live SOP system + cross-system reconciliation reports",
    description:
      "Department SOPs maintained as Notion pages, kept in sync with the live Odoo schema. Daily AP exception report built from Ramp + Odoo cross-join.",
    outcome:
      "Visibility for finance, ops, and the CEO without rebuilding BI infrastructure. Surfaces issues the next morning, not the next month.",
  },
];

export interface DayPhase {
  time: string;
  label: string;
  examples: string[];
}

export const DAY_IN_LIFE: DayPhase[] = [
  {
    time: "07:30",
    label: "Daily scan",
    examples: [
      "Slack across 12 channels — Claude summarizes overnight escalations + vendor messages.",
      "Gmail high-priority — drafts replies grounded in the relevant Odoo records.",
      "Odoo dashboard — flagged exceptions, overdue tasks, missed approvals surfaced as a single list.",
    ],
  },
  {
    time: "09:00",
    label: "Build window",
    examples: [
      "Plan mode in Claude Code — module patches, schema designs, UI iterations.",
      "Live Odoo reads via MCP — Claude verifies field names before writing the patch.",
      "Preview MCP — UI changes screenshot-confirmed before commit.",
    ],
  },
  {
    time: "13:00",
    label: "Cross-system reconciliation",
    examples: [
      "Ramp + Odoo cross-check for AP exceptions.",
      "Avalara tax lookups against pending sales orders.",
      "Drive specs cross-referenced with active BOMs.",
    ],
  },
  {
    time: "16:00",
    label: "Stakeholder hour",
    examples: [
      "In-person walk-arounds — purchasing floor, production floor, accounting desk.",
      "Notion pages updated live with decisions; SOPs re-synced.",
      "Slack canvases drafted with Claude — shared with the relevant department head.",
    ],
  },
  {
    time: "18:00",
    label: "Learning loop",
    examples: [
      "New MCP servers evaluated and added to the toolkit.",
      "Prompt patterns refined.",
      "Past Claude sessions searched for decisions worth promoting into memory.",
    ],
  },
];

export interface OutcomeMetric {
  value: string;
  label: string;
  caption: string;
}

export const OUTCOMES: OutcomeMetric[] = [
  {
    value: "1 → 1",
    label: "Headcount",
    caption:
      "Same role, same title, same payroll line. The throughput change comes from the AI co-worker, not a hire.",
  },
  {
    value: "8 / 8",
    label: "Departments covered",
    caption:
      "Manufacturing, finance, purchasing, sales, inventory, quality, CRM, shipping. One ERP owner, one Claude.",
  },
  {
    value: "10+",
    label: "Live MCP servers",
    caption:
      "Odoo, Notion, Slack, Drive, Gmail, Ramp, Avalara, Chrome, Preview, session memory. The toolkit is the moat.",
  },
  {
    value: "Days → hours",
    label: "Spec → shipped",
    caption:
      "Module patches, dashboards, portal screens — items that used to wait for a sprint now ship inside the same conversation.",
  },
];

export const FOLLOW_ON = [
  "MCP server inventory grows monthly — pace of new integration is now the constraint, not engineering capacity.",
  "Plan-mode-first workflow: every non-trivial change drafted, reviewed in plan, then executed. Fewer regressions, more reversibility.",
  "Memory system (CLAUDE.md + ccd session search) compounds. Year-two productivity is higher than year-one because nothing is learned twice.",
  "The bet: ERP becomes an AI-native system of record. Tools the business uses are the same tools the AI uses — no separate BI stack, no separate ETL.",
];

export interface Lesson {
  title: string;
  body: string;
}

export const LESSONS: Lesson[] = [
  {
    title: "An AI co-worker is a leverage instrument, not a replacement",
    body:
      "The job description didn't change. The owner is still accountable. What changed is the time-cost of every individual decision — schema reads, dashboard builds, vendor responses, reconciliation queries. The AI compresses the cost; the human still chooses what to spend on.",
  },
  {
    title: "MCP makes AI honest",
    body:
      "Without MCP, an AI guesses what the schema looks like. With MCP, it reads the schema. Hallucination rate on real business decisions drops by an order of magnitude because the AI is no longer reasoning about an imagined system — it's reasoning about the live one.",
  },
  {
    title: "Plan-mode is the single biggest workflow change",
    body:
      "Before changes ship, they're drafted. Before drafts ship, they're reviewed. Before reviews ship, the live state is read. The AI doesn't take 10 turns to get to working code — it gets one shot to be right because the plan was right first.",
  },
  {
    title: "The toolkit is the moat",
    body:
      "Anyone can use Claude. Far fewer have wired Claude into ten production systems with role-correct permissions. That stack — the MCP graph — is what makes the throughput claim true, and what makes it portable.",
  },
  {
    title: "Most of my job is now learning",
    body:
      "I spend more time understanding new MCP servers, new Claude features, new prompting patterns, and new business workflows than I do writing code or filling spreadsheets. The compounding curve is real; the people who invest in it pull ahead of the ones who don't.",
  },
];

export const TEAM = [
  { name: "Tanmay Raut", role: "ERP Systems Engineer — sole internal owner, full accountability", internal: true },
  { name: "Claude (Anthropic)", role: "Co-worker — plan, draft, execute, review, never logs off", internal: false },
  { name: "MCP server graph", role: "Live tool surface — Odoo, Notion, Slack, Drive, Gmail, Ramp, Avalara, Chrome, Preview, memory", internal: false },
];

export const STATUS = {
  label: "Status",
  text:
    "Active and compounding. Every quarter the toolkit grows, the prompt patterns mature, and the throughput delta widens. This is the most leveraged seat at the company.",
};
