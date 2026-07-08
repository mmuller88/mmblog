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

When stakeholders comment on a plan, the agent re-reads the issue and posts **vN+1** on GitHub — plumbing under §2, not a headline use case.

---

## 3. Client invoicing — Germany and the US

I used to dread invoice day. Copy last month's HTML, hunt for rates in email, second-guess VAT wording, export PDF, upload, draft the cover email. Now I open the **`prowler`** or **`arc-rider-universe`** Telegram topic and say *prepare the next invoice*.

The agent already knows the playbook from `MEMORY.md` + topic context:

| Client | Topic | Format | Tax |
| ------ | ----- | ------ | --- |
| **Prowler** (US) | `prowler` | Bilingual DE/EN, $/hr sprints | 0% reverse charge (§ 3a Abs. 2 UStG) |
| **Arc Rider** (DE) | `arc-rider-universe` | German Rechnung, fixed project fee | 19% MwSt |

**Typical flow:**

1. Pull latest invoice from Dropbox (`dbxcli`) — template with correct layout
2. Increment number (`2026-prowler-4` → `2026-prowler-5`, etc.)
3. Apply contract details: client address, TIN, IBAN, Steuernummer, service period, hours or line items
4. Ask me only what's missing (hours, EUR rate, ticket refs)
5. Output HTML → PDF → upload to Dropbox → email draft in `work/` — **send only after I approve**

Prowler invoices are bilingual because the client is US-based; Arc Rider is pure German with domestic VAT. Same agent, different rules — because each topic loaded the right memory.

**Lesson:** This is the highest-ROI automation I didn't put in the April post. Invoicing is repetitive, rule-heavy, and error-prone. Exactly what persistent memory + shell access is for.

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

## 6. CFP and talk factory

Conference season doesn't stop. Between client work I submit to AWS Community Days, AgentCon, CodeMotion, re:Invent — often several proposals per event.

OpenClaw keeps a `cfp/` folder in the workspace: one markdown file per proposal, plus submission kits with Sessionize field order. Typical flow:

1. Voice or text: *draft a talk on ai-secure for Poland Community Day*
2. Agent pulls from memory (HDI/Cyquins, ai-secure architecture, prior talks), reads `cfp/aws-community-day-poland-2026/` structure
3. Output: title, abstract, outline, audience level — ready to paste into Sessionize
4. Calendar reminders for deadlines (AgentCon, Rise of AI, AWS CD DACH, …)

Poland 2026 alone: three proposals (AI factory, ai-secure scanning, AWS ESC). DACH and re:Invent folders have five each. The agent didn't attend the conferences — but it *was* at every client call and scan that became talk material.

**Lesson:** CFP writing is research + structure + your voice. The agent handles the first two; I keep the third.

---

## Numbers (rough, three months in)

- **GitHub:** dozens of issues triaged; plans posted as comments; several merged via OpenClaw → Cursor → PR
- **Blog:** 4+ substantial posts drafted with agent help (EN+DE pairs)
- **Invoicing:** 5+ Prowler sprint invoices + German client invoices — HTML/PDF/Dropbox/email draft each time
- **CFP:** 10+ proposal drafts across Poland, DACH, Milan, re:Invent
- **Cost:** model routing matters more than hosting; LLM tokens >> VPS
- **Failures:** clawhub `self-improving-agent` ambiguous slug (daily update blocked — pin `@pskoett/self-improving-agent`); one unapproved email sent early on → hard "ask before send" rule; morning cron once broke on gateway/CLI version skew — fixed with `openclaw update` + Haiku job

---

## What's next

- Auto-implement after explicit GitHub approval (less manual "go implement")
- Hetzner MCP for infra-from-chat
- USt quarterly prep from invoice folder (agent-assisted, accountant still reviews)

---

## Conclusion

Three months ago OpenClaw was "email + calendar + GitHub notifications." Now it's **orchestrator**: forum topics for context, Cursor for code, MCP for live external data, mmblog for content, **invoices and CFP drafts for the business side**.

Still on **€10/mo [Hostinger](https://www.hostinger.com?REFERRALCODE=MARTINMUELLER) Docker** — pragmatic for long Cursor runs and a persistent workspace.

If you already run OpenClaw, the highest-leverage upgrades for me were: **Cursor CLI plugin**, **client-specific memory per Telegram topic**, and **one MCP per domain you repeat manually**.

---

Links:
- [Original OpenClaw post](/openclaw-eng)
- [PeachBase — shared memory](/peachbase-global-brain)
- [SISTRIX MCP case study](/sistrix-mcp-hallocasa-seo)
- [OpenClaw](https://openclaw.ai) · [GitHub](https://github.com/openclaw/openclaw)

Questions or want help wiring your agent (Telegram topics, MCP, Cursor CLI, heartbeats)? [office@martinmueller.dev](mailto:office@martinmueller.dev) or [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev).
