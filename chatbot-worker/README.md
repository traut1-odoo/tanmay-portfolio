# Tanmay Portfolio Chatbot — Cloudflare Worker

Proxy worker for the portfolio AI chatbot. Holds the Anthropic API key (never exposed to browser), prepends grounded portfolio context (~30K tokens) with prompt caching, and returns the model response.

**Model:** `claude-haiku-4-5` ($1 / $5 per 1M tokens, cache read $0.10 / 1M)
**Cost target:** ~$1–5/month at typical portfolio traffic. Hard-capped via Anthropic Console spend limit.

## Architecture

```
browser → Worker (this) → Anthropic API → Worker → browser
                ↑
        context.generated.md (~30K tokens, cached server-side)
```

## One-time setup

### 1. Install + login

```bash
npm install -g wrangler
wrangler login          # OAuth Cloudflare in browser
```

### 2. Install worker deps

```bash
cd chatbot-worker
npm install
```

### 3. Set Anthropic API key (secret)

Create key at https://console.anthropic.com → Settings → API Keys.

```bash
wrangler secret put ANTHROPIC_API_KEY
# paste key when prompted
```

### 4. Set spend cap (Anthropic Console)

- Settings → Usage Limits → Monthly limit → **$5** (or your comfort level)
- Settings → Billing → ensure $5+ credit added

### 5. Build context + deploy

```bash
npm run build:context   # generates src/context.generated.md (~30K tokens)
npm run deploy          # outputs https://tanmay-portfolio-chatbot.YOUR-CF-NAME.workers.dev
```

### 6. Wire frontend

Set `NEXT_PUBLIC_CHAT_API_URL` in the portfolio environment to the Worker URL from step 5. Add to `next.config.ts` for static export builds:

```ts
env: {
  NEXT_PUBLIC_CHAT_API_URL: "https://tanmay-portfolio-chatbot.YOUR-CF-NAME.workers.dev",
}
```

Or set in your build environment / GitHub Actions secrets. Redeploy portfolio.

## Context refresh

Whenever portfolio data changes (new project, updated skills, case-study tweaks), refresh the context:

```bash
cd chatbot-worker
npm run build:context   # regenerates src/context.generated.md
npm run deploy          # pushes new context + Worker code
```

The build script reads from an **explicit allowlist** of paths — no glob walks, no `~/.claude/` access. See `scripts/build-context.mjs` and `scripts/memory-allowlist.ts` for what's included.

## Privacy / what the bot knows

**Included:**
- All 20 portfolio projects (description, tech, problem, role, solution, impact + case-study narrative for featured)
- All 22 skills + levels (6 categories)
- 4 roles (titles, locations, periods, highlights)
- Full Odoo 16→17 case study (situation, problem, approach, tiers, sign-off, Ramp gap, outcomes, lessons)
- Identity prose from about page ("Things about me" cards + bio)
- Education + certifications + contact
- Curated philosophies (working standards — third-person rewrites in `scripts/memory-allowlist.ts`)

**Explicitly excluded:**
- Personal trading positions or strategies
- Vendor portal internal state
- Anything not in `scripts/memory-allowlist.ts` or the public portfolio source files

**Privacy firewall:** `scripts/memory-allowlist.ts` is the only path personal philosophies can enter the bot. Edit it directly before commit — what's in that file is what the bot knows.

## Verifying cache hits

```bash
wrangler tail   # tails Worker logs
# trigger a request, then a second identical request within 5 min
# look for "cache_read" > 0 in the second log line
```

## Optional — rate limiting

Cloudflare dashboard → Security → WAF → Rate limiting rules:
- Field: IP source
- Threshold: 20 requests / 1 minute
- Action: Block for 1 hour
- Path: `/*`

Free tier allows 1 rate limit rule.

## Optional — custom domain

If you own a domain at Cloudflare:
- Workers & Pages → tanmay-portfolio-chatbot → Triggers → Custom Domains → Add
- e.g. `chat.tanmayraut.com`

Update `NEXT_PUBLIC_CHAT_API_URL` to the custom domain. Free if domain already at CF.

## Files

| File | Purpose |
|---|---|
| `src/index.ts` | Worker fetch handler — proxies to Anthropic API w/ cache_control |
| `src/context.generated.md` | Generated context (~30K tokens) — committed to git |
| `scripts/build-context.mjs` | Generator — reads allowlist, writes context.generated.md |
| `scripts/about-extract.ts` | Curated identity prose (manual copy from about page) |
| `scripts/memory-allowlist.ts` | Privacy firewall — curated philosophies |
| `wrangler.toml` | Worker config (model irrelevant — set in src/index.ts) |

## Troubleshooting

- **CORS errors in browser**: confirm `ALLOWED_ORIGIN` in `wrangler.toml` matches your portfolio URL exactly (`https://`, no trailing slash).
- **"Anthropic API error: 401"**: re-run `wrangler secret put ANTHROPIC_API_KEY`.
- **"Anthropic API error: 429"**: rate limited on Anthropic side — wait, or upgrade Console tier.
- **Bot gives generic answers**: rebuild context (`npm run build:context`) and redeploy. Check `context.generated.md` was regenerated.
- **Cache always reads 0**: confirm context.generated.md is ≥4096 tokens (Haiku cache minimum). Build script warns if below.
