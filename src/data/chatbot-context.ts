/**
 * UI-only constants for the portfolio chatbot.
 *
 * The actual system prompt and grounded context live in the Cloudflare
 * Worker at chatbot-worker/src/index.ts + context.generated.md.
 * Keeping them out of the client prevents context drift and shrinks
 * request payloads.
 */

export const INPUT_PLACEHOLDER =
  "Ask about Tanmay's projects, stack, or the Odoo 17 cutover…";

export const SUGGESTED_PROMPTS = [
  "Tell me about the Odoo 16 → 17 cutover",
  "What's the AEI vendor portal?",
  "What's Tanmay's stack?",
  "What was the QC + Vendor RMA module?",
] as const;
