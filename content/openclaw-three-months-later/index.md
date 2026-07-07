---
title: "OpenClaw, Three Months Later: Cursor Subagents, MCP, and the Blog Pipeline"
show: "yes"
date: "2026-07-07"
image: "index.png"
audio: "audio.mp3"
tags: ["openclaw", "ai", "automation", "mcp", "cursor", "eng", "2026"]
pruneLength: 50
gerUrl: https://martinmueller.dev/openclaw-three-months-later-de
---

In [April I wrote about OpenClaw](https://martinmueller.dev/openclaw-eng) — my self-hosted AI agent on a [Hostinger](https://www.hostinger.com?REFERRALCODE=MARTINMUELLER) VPS, wired to Telegram, email, calendar, GitHub, and [PeachBase](https://martinmueller.dev/peachbase-global-brain/) as shared memory. That post ended with a short "What's Next" list. Three months later, most of it shipped — and the setup looks less like a chatbot and more like a small ops team.

This is what changed, what broke, and what I'd do again.

---

## Quick recap

OpenClaw = persistent agent + tools + memory files (`MEMORY.md`, daily notes, heartbeats). I talk to it on **Telegram** (mostly voice). It runs shell, reads repos, drafts email, checks GitHub, and only sends mail after I approve.

Still true. Everything below is additive.

---

## 1. Blog automation — from promise to pipeline

The original post said I'd use OpenClaw to draft blog posts. That happened — repeatedly:

| Post | What OpenClaw did |
| ---- | ----------------- |
| [Hetzner EU production series](/hetzner-eu-production) | Researched stack, drafted EN+DE, coordinated images |
| [Lovable → Hetzner DACH](/lovable-hetzner-germany) | Same formula; tied to a real client story |
| [SISTRIX MCP SEO audit](/sistrix-mcp-hallocasa-seo) | Ran live MCP pulls, read `hallocasa-next`, exported strategy PDF |

Typical flow: voice note on Telegram → agent gathers context from memory + repos → markdown in `mmblog/content/` → I review → push to Netlify. LinkedIn drafts often come in the same session.

**Lesson:** The agent is good at *first drafts with real data*. My job is tone, accuracy, and "would I post this under my name?"

---

## 2. Cursor CLI as subcontractor

The biggest upgrade since April: **`@jeehou/openclaw-cursor-cli`** — OpenClaw can spawn [Cursor CLI](https://cursor.com) (`agent --print --trust --yolo`) against a checked-out repo.

**GitHub issue workflow today:**

1. Heartbeat sees new issue on `hallocasacom/hallocasa-next`
2. OpenClaw notifies me on Telegram
3. Cursor CLI (Opus thinking) writes an implementation plan from the codebase
4. Plan posted as **GitHub issue comment** — not buried in chat
5. I approve → Composer implements → PR

Planning and coding happen in the repo context, not in the Telegram window. OpenClaw stays orchestrator.

**Model split that works:**

| Task | Model |
| ---- | ----- |
| Heartbeats, morning inbox | Haiku + `lightContext` |
| Chat / triage | Sonnet |
| Plans | Opus via Cursor CLI |
| Implementation | Composer |

Burning Opus on every heartbeat was expensive. Routing fixed that.

---

## 3. Awaiting-feedback loop (stakeholder-aware plans)

Early mistake: post plan v1, tell Martin "waiting on approval," never re-read the issue. Stakeholders commented; the plan went stale.

Fix: **`awaitingFeedbackIssues`** in `heartbeat-state.json`. Every ~30 min the agent:

- Re-fetches issue comments
- If someone other than me replied → synthesize **vN+1** plan, post to GitHub, ping Telegram
- Only then report status

Example: HalloCasa SEO epic [#2400](https://github.com/hallocasacom/hallocasa-next/issues/2400) went v1 → v2 → v3 after Michael added Yoast/Polylang constraints and I ran a WordPress MCP audit.

**Lesson:** Autonomous agents need *poll loops*, not one-shot plans.

---

## 4. MCP menu — SEO, WordPress, compliance

April: PeachBase + a few basics. July: a small integration stack via **mcporter**:

| MCP | Use |
| --- | --- |
| **PeachBase** | Long-term memory across Cursor, OpenClaw, ChatGPT |
| **SISTRIX** | Live SEO visibility, keywords, competitors → strategy docs |
| **WordPress** | Audit `blog.hallocasa.com`, categories, drafts for SEO content |
| **ai-secure** | Start ISO27001/NIST/SOC2/COBIT scans, pull PDF reports |

The pattern: one Telegram prompt, agent calls MCP tools + reads code, output is a dated artifact (markdown, PDF, issue comment).

I wrote up the SISTRIX workflow [here](/sistrix-mcp-hallocasa-seo). WordPress + SEO dashboard work is ongoing on HalloCasa — OpenClaw is the glue between product, content, and infra repos.

---

## 5. Telegram forum topics = project switcher

One group chat, many **topics**: `mmblog`, `hallocasa`, `ai-secure`, `arc-rider-universe`, `prowler`, …

Each topic maps to a repo + rules in `MEMORY.md`. I don't context-switch in one thread; I open the topic and the agent already knows which codebase and which tone.

**Ops note:** OpenClaw **2026.5.4** fixed `messages.groupChat.visibleReplies` — replies were silently dropped in forum topics on older builds. Worth upgrading if your bot "goes quiet" in groups.

---

## 6. Cron reliability (when the morning brief died)

`morning-email-check` at 07:00 Berlin stopped delivering. Root cause: **gateway vs CLI version skew** (`2026.5.x` vs `2026.6.8`) → `ERR_MODULE_NOT_FOUND` on cron runs.

Fix:

- `openclaw update`, restart gateway on the npm-global binary
- `doctor --fix`, restore `cron/jobs.json`
- Move morning job to **Haiku** + `lightContext` + 180s timeout (Composer plugin path stalled)

Manual test: ~40s, delivered to Telegram. Boring infra — until it isn't.

---

## 7. What I still run on a VPS (and why)

I've drafted [OpenClaw on Lambda](https://github.com/openclaw/openclaw) talks (EventBridge instead of heartbeats, S3/DynamoDB state). Still on **€10/mo [Hostinger](https://www.hostinger.com?REFERRALCODE=MARTINMUELLER) Docker** because:

- Persistent workspace + git clones
- Long Cursor CLI runs without 15-minute Lambda walls
- Telegram webhook simplicity

Serverless makes sense at scale; solo operator VPS is still the pragmatic default.

---

## Numbers (rough, three months in)

- **GitHub:** dozens of issues triaged; plans posted as comments; several merged via OpenClaw → Cursor → PR
- **Blog:** 4+ substantial posts drafted with agent help (EN+DE pairs)
- **Cost:** model routing matters more than hosting; LLM tokens >> VPS
- **Failures:** clawhub `self-improving-agent` ambiguous slug (daily update blocked — pin `@pskoett/self-improving-agent`); one unapproved email sent early on → hard "ask before send" rule still in force

---

## What's next

- Auto-implement after explicit GitHub approval (less manual "go implement")
- Hetzner MCP for infra-from-chat
- Maybe serverless cutover — if I need scale-to-zero more than long-running shells

---

## Conclusion

Three months ago OpenClaw was "email + calendar + GitHub notifications." Now it's **orchestrator**: forum topics for context, Cursor for code, MCP for live external data, heartbeats for stakeholder loops, mmblog for content.

If you already run OpenClaw, the highest-leverage upgrades for me were: **Cursor CLI plugin**, **awaiting-feedback polling**, and **one MCP per domain you repeat manually**.

---

Links:
- [Original OpenClaw post](/openclaw-eng)
- [PeachBase — shared memory](/peachbase-global-brain)
- [SISTRIX MCP case study](/sistrix-mcp-hallocasa-seo)
- [OpenClaw](https://openclaw.ai) · [GitHub](https://github.com/openclaw/openclaw)

Questions or want help wiring your agent (Telegram topics, MCP, Cursor CLI, heartbeats)? [office@martinmueller.dev](mailto:office@martinmueller.dev) or [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev).
