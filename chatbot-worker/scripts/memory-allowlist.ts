/**
 * Memory allowlist — curated third-person philosophies from Tanmay's personal
 * memory files. Acts as the privacy firewall: ONLY content in this file flows
 * into the chatbot context.
 *
 * EXPLICITLY EXCLUDED from this allowlist (do not add):
 *   - Anything from `feedback_etf_first_strategy.md`, `feedback_fomo_framework.md`,
 *     `feedback_roth_vs_tod_role.md`, `feedback_watchlist_rebuy.md` (personal trading)
 *   - `project_trading_system.md` (personal positions + risk)
 *   - `project_vendor_portal_state.md`, `project_vendor_returns_portal.md` (vendor
 *     portal internal state, not for public)
 *   - `feedback_sku_access.md` (access-control internals)
 *   - Anything from the local Claude memory dirs not listed here
 *
 * Review this file carefully before commit. If a line feels too personal,
 * remove it. The bot only knows what you allow.
 */

export interface PhilosophyEntry {
  title: string;
  body: string;
}

export const PHILOSOPHIES: PhilosophyEntry[] = [
  {
    title: "Complete work end-to-end",
    body:
      "Tanmay's operating standard is to finish the loop on every system: build the feature, wire it into the daily run, verify it fires, log the result, commit, then report status. He pushes back on half-shipped work — listing options when one is correct, or asking permission for obvious next steps. The exception is genuinely destructive operations, which need explicit confirmation.",
  },
  {
    title: "Check state before advising",
    body:
      "Before advising on a system Tanmay reads the current state — positions, configs, recent notes — rather than making the human re-state what the system already knows. Generic advice without grounding gets flagged; specific advice rooted in the live record is the bar.",
  },
  {
    title: "Quality bar — production-ready, not scaffolds",
    body:
      "Tanmay won't ship rough scaffolds. Production UI needs professional table styling (striped rows, monospace for codes, tabular-nums for numbers), loading skeletons matched to the actual layout, comprehensive filter/search, staggered row animations, detailed empty states, status badges with proper color mapping, and mobile responsiveness. 'It works' isn't enough.",
  },
  {
    title: "Design taste — monochrome, restrained",
    body:
      "Heckler's branding aesthetic: monochrome palette, LL Medium typography, 24px grid, 0–2px border radius. Tanmay applies the same restrained, premium taste to his portfolio and the systems he builds for Heckler.",
  },
  {
    title: "AI as dev team",
    body:
      "Tanmay treats AI as a development partner — he brings the manufacturing judgment, ERP architecture, and business context no model has; AI accelerates execution. He's shipped multiple production systems with this split, including the MCP-to-Odoo connector and the AEI vendor portal.",
  },
  {
    title: "Honesty over polish in communication",
    body:
      "When Tanmay doesn't know something he says so plainly and asks for the source data, rather than inventing details. Same standard applies to systems he builds — they should never hallucinate or paper over gaps.",
  },
];
