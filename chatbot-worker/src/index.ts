/**
 * Cloudflare Worker — Anthropic API proxy for Tanmay's portfolio chatbot.
 *
 * Architecture:
 *   browser → Worker (this file) → Anthropic API → Worker → browser
 *
 * The Worker is authoritative on system prompt: it loads the rich
 * context.generated.md (built from src/data/*.ts via scripts/build-context.mjs)
 * and prepends it to every Anthropic API call with cache_control: ephemeral.
 * Client `body.system` is ignored to prevent context drift.
 *
 * Model: claude-haiku-4-5 (fast, cheap, $1/$5 per 1M tokens).
 * Caching: 5-minute TTL ephemeral cache on the ~30K-token system block.
 */

// @ts-expect-error — wrangler [[rules]] type="Text" loads .md as string at build time
import CONTEXT from "./context.generated.md";

export interface Env {
  ANTHROPIC_API_KEY: string;
  ALLOWED_ORIGIN?: string;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

interface RequestBody {
  messages?: ChatMessage[];
}

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 512;

const CONTEXT_HEADER = `You are Tanmay Raut's portfolio assistant. You answer questions about Tanmay in the third person ("Tanmay built…", "He led…"). You are an AI assistant, not Tanmay himself — if a user asks if you are Tanmay, say plainly that you are an AI trained on his portfolio data.

Ground every answer in the CONTEXT block below. When citing facts, use the specific numbers and project names from CONTEXT (e.g. "the 65-hour Odoo 17 cutover", "the 4,762 SKUs", "the AEI vendor portal that replaced an 8,441-row spreadsheet"). Never invent project names, employers, dates, or metrics that aren't in CONTEXT.

If a question isn't covered by CONTEXT (favorite movie, opinions on unrelated topics, predictions), say so plainly and suggest the contact page (tanmay.rautwork@gmail.com) for anything personal.

Style:
- Default to 2–4 sentence answers. Expand only when the user asks for detail.
- Concrete > general. Cite specific projects, numbers, or roles.
- Honest > polished. If you don't have the info, say so.
- Conversational tone, but no excessive hedging. No "based on the context provided" filler.

---

CONTEXT:
`;

function corsHeaders(origin: string | null, allowed: string | undefined): HeadersInit {
  // Use configured ALLOWED_ORIGIN if set; otherwise allow any origin (fine for public portfolio).
  const allowedOrigin = allowed || "*";
  const allow =
    allowed && origin && (origin === allowed || origin === "null") ? origin : allowedOrigin;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    let body: RequestBody;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Cap history to keep token usage bounded.
    const cappedMessages = messages.slice(-20).map((m) => ({
      role: m.role,
      content: String(m.content).slice(0, 4000),
    }));

    try {
      const apiResp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: [
            {
              type: "text",
              text: CONTEXT_HEADER + (CONTEXT as unknown as string),
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: cappedMessages,
        }),
      });

      if (!apiResp.ok) {
        const errText = await apiResp.text();
        return new Response(
          JSON.stringify({ error: `Anthropic API error: ${apiResp.status}`, detail: errText }),
          {
            status: 502,
            headers: { ...cors, "Content-Type": "application/json" },
          },
        );
      }

      const data = (await apiResp.json()) as {
        content?: Array<{ type: string; text?: string }>;
        usage?: {
          input_tokens?: number;
          output_tokens?: number;
          cache_creation_input_tokens?: number;
          cache_read_input_tokens?: number;
        };
      };

      // Log cache effectiveness — visible via `wrangler tail`. Disable in production by
      // commenting out if it becomes too noisy.
      if (data.usage) {
        console.log(
          JSON.stringify({
            in: data.usage.input_tokens,
            out: data.usage.output_tokens,
            cache_write: data.usage.cache_creation_input_tokens,
            cache_read: data.usage.cache_read_input_tokens,
          }),
        );
      }

      const textBlocks = (data.content || []).filter((b) => b.type === "text");
      const responseText = textBlocks.map((b) => b.text || "").join("");

      return new Response(JSON.stringify({ content: responseText }), {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return new Response(JSON.stringify({ error: "Worker error", detail: msg }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
  },
};
