---
title: "Data-Driven SEO with the SISTRIX MCP: A HalloCasa Case Study"
show: "no"
date: "2026-06-20"
image: "index.png"
tags: ["eng", "2026", "mcp", "seo", "sistrix", "hallocasa", "cursor", "ai"]
pruneLength: 50
---

I co-founded [HalloCasa](https://hallocasa.com) — a global real estate broker directory with listings, profiles, subscriptions, and courses. Organic search should be a major channel for us. But when I sat down to build an SEO strategy, I did not want to spend a day clicking through dashboards, exporting CSVs, and stitching screenshots into a doc.

Instead I paired my AI **Cursor** with the **[SISTRIX MCP](https://www.sistrix.com/api/connection-to-chatbot-ai/)** and ran a full audit in one agent session: multi-market visibility baseline, ranking URLs, keyword opportunities, competitor overlap, backlink profile — cross-referenced against our Next.js codebase for canonical tags, hreflang, and sitemaps. The output was a prioritized roadmap with real numbers, not gut feel.

The whole thing started with one prompt:

> Use the SISTRIX MCP to develop a sophisticated SEO strategy for https://hallocasa.com/

No keyword spreadsheets, no elaborate system prompt — just the domain and the tool. From there the agent pulled SISTRIX data market by market, read our repo, and turned it into a strategy doc with prioritized tiers.

This post is about that workflow: what SISTRIX and its MCP are, why MCP matters for SEO, and what the data actually told us about hallocasa.com.

---

## What is SISTRIX?

[SISTRIX](https://www.sistrix.com/) is a German SEO platform widely used in the DACH market and beyond. Its headline metric is the **Visibility Index (Sichtbarkeitsindex)** — a score derived from ranking positions and search volume across all keywords a domain ranks for. You also get keyword rankings, backlink data, competitor overlap, search intent, and (newer) AI visibility tooling.

For a site like HalloCasa — global broker directory, LatAm-heavy country list, German expat content on the blog — SISTRIX is useful because you can slice by **country** (`de`, `us`, `co`, `es`, `mx`, …) and compare markets in one session instead of assuming one Google index fits all.

---

## Why MCP for SEO tools?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open standard that lets AI assistants call external tools through a unified interface. Without it, chatbots guess or hallucinate metrics. With it, they pull **live data** from your SEO platform.

| Without MCP | With MCP |
| ----------- | -------- |
| Tab-hopping, manual exports | Agent queries live data in conversation |
| Stale screenshots in strategy docs | Reproducible, dated API pulls |
| SEO analyst and developer in separate tools | Agent cross-references rankings **and** your repo |

In **Cursor → Settings → Tools & MCP**, you wire the SISTRIX server once. The agent then calls tools like `domain_visindex` or `keyword_domain_seo` as part of normal chat — same as reading files or running terminal commands.

**Workflow (Cursor + SISTRIX MCP + codebase):**

| Step | You | Agent |
| ---- | --- | ----- |
| 1 | Ask for SEO audit of your domain | Calls SISTRIX MCP tools per market |
| 2 | Point agent at your repo | Reads `seo.ts`, `MetaData.tsx`, `robots.txt`, sitemaps |
| 3 | Ask for strategy + priorities | Synthesizes data + code findings into actionable doc |

---

## Setting up the SISTRIX MCP

SISTRIX ships an official MCP server. Docs and setup guides:

| Resource | Link |
| -------- | ---- |
| Main hub | [Connection to AI with MCP](https://www.sistrix.com/api/connection-to-chatbot-ai/) |
| OAuth for all plans (2025+) | [SISTRIX MCP Servers changelog](https://www.sistrix.com/changelog/sistrix-mcp-servers/) |
| Technical reference | [Technical Information MCP](https://www.sistrix.com/api/connection-to-chatbot-ai/technical-information-mcp/) |
| ChatGPT setup | [Setting up ChatGPT](https://www.sistrix.com/api/connection-to-chatbot-ai/setting-up-chatgpt/) |
| Claude setup | [Setting up Claude](https://www.sistrix.com/api/connection-to-chatbot-ai/setting-up-claude/) |

**Endpoint:** `https://api.sistrix.com/mcp/`

**Auth:** OAuth now works on **all SISTRIX plans** — log in, no API key required. API keys still work on Plus+ if you prefer. Per [SISTRIX docs](https://www.sistrix.com/api/connection-to-chatbot-ai/technical-information-mcp/), MCP requests currently **do not consume API credits** (unlike direct API calls). For Cursor, configure the MCP server with the same endpoint plus OAuth or an API key in your MCP config.

---

## SISTRIX MCP tool surface

The MCP exposes dozens of tools. In the HalloCasa audit we leaned on these groups:

| Category | Example tools | What you learn |
| -------- | ------------- | -------------- |
| Domain visibility | `domain_visindex`, `domain_kwcount_seo`, `domain_ranking_distribution` | Footprint per market, page-1 keyword count |
| Keywords | `keyword_domain_seo`, `domain_opportunities`, `keyword_seo_metrics` | What ranks, near-wins, volume and intent |
| Competition | `domain_competitors_seo`, `domain_ideas` | Overlap and content gaps |
| Links | `links_list` | Toxic vs legitimate backlinks |
| AI visibility | `ai_entity` | AEO baseline (our HalloCasa entity call returned HTTP 500) |
| Projects | `project_ranking`, `project_visibilityindex`, … | Ongoing tracking once a project exists |

Pass **`country`** as an ISO code (`de`, `us`, `co`, `es`, `mx`, …) to audit multiple markets in one session. That is how we discovered Germany has history while Colombia and Mexico have essentially zero visibility today.

---

## HalloCasa case study: what the data showed

Research date: **2026-06-15**. Domain: **hallocasa.com**.

### Baseline snapshot

| Market | Visibility Index | Ranking keywords | Notes |
| ------ | ---------------- | ---------------- | ----- |
| **DE** | 0.0014 | 30 | Peak 0.0309 in Dec 2019 (~95% decline) |
| **US** | 0 | 5 | Mostly Spanish legal-doc queries on blog |
| **ES** | ~0 | 3 | Negligible |
| **CO** | 0 | 0 | No keyword data |
| **MX** | 0 | 0 | No keyword data |

Germany is the only market with meaningful history. Core LatAm business markets are invisible in organic search today.

### Where rankings actually live

| URL pattern | Example keywords | Typical position |
| ----------- | ---------------- | ---------------- |
| `blog.hallocasa.com/de/...` | immobilien chile, immobilien medellin, investieren in kolumbien | 4–22 |
| `hallocasa.com/profile/{id}` | Broker name queries | 5–9 |
| `hallocasa.com/associations` | asociaciones inmobiliarias | ~19 (US) |
| `blog.hallocasa.com/...` (ES legal) | contrato de promesa de compraventa | 11–20 |

**Headline finding:** the **directory** (`www.hallocasa.com`) barely ranks — about **one page-1 keyword** in DE. Almost all SEO value sits on **`blog.hallocasa.com`**, mostly German articles about LatAm real estate (Chile, Colombia, Peru, Argentina, Mexico). That is a structural problem: authority is stranded on a subdomain, not flowing to broker profiles and `/brokers`.

### Near-win keywords (fastest ranking upside)

SISTRIX `domain_opportunities` surfaced keywords already at positions **11–22** with low competition:

| Keyword | Position | Competition |
| ------- | -------- | ----------- |
| investieren in kolumbien | 11 | 0 |
| auslandsimmobilien chile | 12 | 13 |
| chile auswandern immobilien | 14 | 3 |
| immobilien argentinien | 21–22 | 7–16 |

Pushing these over the line to page 1 is lower effort than chasing new head terms. Sample volume: **auslandsimmobilien kaufen** ~800 searches/month in DE (commercial intent).

### Competitors (DE organic overlap)

immowelt.de, properstar.de, fazwaz.de, jamesedition.com, luxuryestate.com, bluehomes.com — plus niche expat and investment sites. We are not competing on generic German portal head terms; our wedge is **cross-border / expat investor** content.

### Backlinks: mostly noise

`links_list` showed a profile dominated by **SEO directory and PBN spam** (worldseodirectory, mostrankdirectory, “importance of link building” blog networks). Legitimate links were rare: partner podcasts (e.g. bestag.ch), travel sites, conference media partners. Worth a GSC audit before any disavow — Google often ignores obvious spam automatically.

### Code cross-check: why the directory does not rank

The agent read our Next.js repo alongside SISTRIX URLs. Technical issues that explain weak directory visibility:

- **i18n via `?lang=`** on the directory, but **canonical URLs strip the query** — all nine locales collapse to one indexable URL per path.
- **No `hreflang`** anywhere; blog and home use path locales (`/de/`, `/es/`), apex uses query locales.
- **Fragmented architecture:** `blog.`, `home.`, and apex as separate properties; blog holds the rankings.

Fixing international SEO and consolidating blog authority onto the main domain are foundation work before scaling content in CO/MX.

---

## Prioritized roadmap (90-day lens)

From the audit we tiered actions by effort vs impact:

**P0 — do first (weeks 1–4)**

| Action | Why |
| ------ | --- |
| GSC domain property + baseline KPIs | Cannot measure without it |
| `www` canonical + 301 all host variants | Stops split link equity |
| Blog → directory CTAs on top DE posts | Rankings exist; directory gets no traffic |
| Cross-link blog ↔ `/brokers` ↔ profiles | Partial authority transfer without migration |

**P1 — highest SEO upside (weeks 4–16)**

| Action | Why |
| ------ | --- |
| Optimize 5 DE opportunity posts (pos 11–22) | Fastest ranking wins |
| Blog → `/blog/` subfolder consolidation | Biggest structural lift for directory |
| Path locales + `hreflang` on apex | Required before ES/EN scale |
| DE pillar hub (e.g. auslandsimmobilien) | Head term ~800/mo |

**P3 — long bets**

Spanish LatAm programmatic pages (CO/MX) only when broker inventory supports it — today CO/MX have **zero** ranking keywords; empty city templates would be thin-content risk.

### Impact scenarios (directional, not guarantees)

| Scenario | Actions | DE Visibility Index | Top-10 keywords |
| -------- | ------- | ------------------- | --------------- |
| Minimum | P0 only | ~0.002 | ~22 |
| Expected | P0 + optimize posts + cross-links | 0.004–0.006 | 25–30 |
| Stretch | P0 + all P1 | 0.008–0.012 | 32–40 |

Baseline today: VI **0.0014**, ~**19** top-10 keywords, ~**30** total in DE.

---

## How to replicate this workflow

1. **Wire SISTRIX MCP in Cursor** — endpoint `https://api.sistrix.com/mcp/`, [setup docs](https://www.sistrix.com/api/connection-to-chatbot-ai/), OAuth or API key.
2. **Open with a clear ask** — e.g. *Use the SISTRIX MCP to develop a sophisticated SEO strategy for https://hallocasa.com/* (that was my entire starting prompt).
3. **Ask for multi-market baseline** — `domain_visindex` and `domain_kwcount_seo` per country.
4. **Pull ranking URLs** — `keyword_domain_seo` to see which subdomain or path actually ranks.
5. **Pull opportunities, competitors, backlinks** — `domain_opportunities`, `domain_competitors_seo`, `links_list`.
6. **Audit your codebase** — canonicals, hreflang, robots, sitemaps, i18n patterns.
7. **Synthesize** — strategy doc with prioritized tiers, not a data dump.

We also exported a PDF from the strategy markdown (`pandoc` + headless Chrome) for sharing with stakeholders — optional polish, not required for the audit itself.

---

## Takeaways for other sites

- **MCP turns SEO from dashboard archaeology into agent-native research.** The agent pulls live SISTRIX data while you stay in the editor.
- **Best results when the agent can read your repo too.** Rankings tell you *what* ranks; code tells you *why* fixes are hard or easy.
- **Multi-subdomain setups need an explicit architecture decision** — consolidate (e.g. blog → `/blog/`) or cross-link heavily; do not assume authority transfers by default.
- **Prioritize near-win keywords** before greenfield programmatic SEO or nine-locale translation sprees.
- **Match market data to business focus.** We had ~0 visibility in CO/MX despite LatAm being core geography — that mismatch only shows up when you query per country.

---

## What is next for HalloCasa

This post is about the **research method** — but the audit gave us a clear roadmap, and I am excited to implement it: P0 fixes first, then the DE near-win posts and blog consolidation. SISTRIX will stay in the loop for ongoing tracking, not just this one-off session.

The same MCP setup opens **GEO** (Generative Engine Optimization): SISTRIX’s AI visibility tools (`ai_entity`, and related project tooling) let us baseline how HalloCasa shows up in AI answers and measure lift as we fix structure and content. Our first `ai_entity` call hit a 500 — worth retrying once the foundation work lands.

I am co-founder of HalloCasa and use MCP heavily elsewhere in my stack (see [How I Use OpenClaw](/openclaw-eng) for another angle on agent tooling). If you want help wiring SISTRIX MCP in Cursor or running a similar audit on your domain, reach out on [LinkedIn](https://www.linkedin.com/in/martinmueller88/).
