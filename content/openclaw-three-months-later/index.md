---
title: "OpenClaw, Three Months Later: What Actually Shipped"
show: "yes"
date: "2026-07-07"
image: "index.png"
audio: "audio.mp3"
tags: ["openclaw", "ai", "automation", "mcp", "cursor", "eng", "2026"]
pruneLength: 50
gerUrl: https://martinmueller.dev/openclaw-three-months-later-de
---

In [April I wrote about OpenClaw](https://martinmueller.dev/openclaw-eng) — my self-hosted AI agent on a [Hostinger](https://www.hostinger.com?REFERRALCODE=MARTINMUELLER) VPS, wired to Telegram, email, calendar, and GitHub. That post ended with a short "What's Next" list. Three months later, most of it shipped — and the setup feels less like a chatbot and more like a small ops team.

**What's new since April:**

- **Blog posts** — voice note in, researched draft out, published on my site
- **Code from GitHub issues** — agent plans, I approve, PR lands
- **Invoices** — bilingual PDFs for US and German clients, email draft ready to send
- **SEO & compliance work** — live data pulls and reports without me clicking through five tools
- **One Telegram chat, many projects** — separate topics so context doesn't mix
- **Conference proposals** — talk drafts from memory, not from a blank page

Below: what changed, what broke, and what I'd do again.

---

## Quick recap

OpenClaw is a persistent assistant with memory. I talk to it on **Telegram** — often by voice. It can run tasks, read my repos, draft email, and check GitHub. It only sends mail after I say yes.

Everything below builds on that.

---

## 1. Blog posts — from idea to publish

The April post promised blog drafting. That happened — repeatedly:

| Post | What the agent did |
| ---- | ------------------ |
| [Hetzner EU production series](/hetzner-eu-production) | Researched the stack, drafted EN+DE, coordinated images |
| [Lovable → Hetzner DACH](/lovable-hetzner-germany) | Same pattern, tied to a real client story |
| [SISTRIX MCP SEO audit](/sistrix-mcp-hallocasa-seo) | Pulled live SEO data, read the client's site code, exported a strategy PDF |

Typical flow: voice note → agent gathers context from past notes and repos → markdown draft → I edit for tone and accuracy → publish.

**Lesson:** Great at first drafts with real data. My job is "would I post this under my name?"

---

## 2. GitHub issues → plans → PRs

The biggest upgrade: OpenClaw can hand off coding work to [Cursor](https://cursor.com) in the actual repo.

**Today:**

1. New issue on a client's product repo
2. I get a Telegram ping
3. Agent writes an implementation plan from the codebase
4. Plan lands as a **GitHub comment** — visible to the team, not buried in chat
5. I approve → code gets written → PR opens

I stopped burning the expensive model on every small check. Quick triage stays cheap; planning and coding use the heavy models only when it matters.

**Lesson:** Keep planning in the repo and in GitHub. Telegram is for pings and decisions, not for hiding the plan.

---

## 3. Invoices — the boring work I avoided

Invoice day used to mean copy-paste HTML, hunt for rates, second-guess tax wording, export PDF, upload, draft the cover email. Now I open the right Telegram topic and say *prepare the next invoice*.

The agent already knows each client's rules — US vs German format, currency, VAT, layout. It pulls the last invoice as a template, bumps the number, fills in the period and line items, and asks me only what's missing. Output: PDF in Dropbox, email draft waiting — **send only after I approve**.

**Lesson:** Highest ROI automation I didn't mention in April. Repetitive, rule-heavy, easy to get wrong. Perfect for an agent with memory.

---

## 4. SEO, WordPress, compliance — one prompt, one artifact

April: basic memory and a few tools. July: the agent can talk to external services I use every week — SEO data, a client's WordPress blog, security scan reports.

The pattern is always the same: one Telegram message, agent combines live data + code context, I get a dated deliverable (markdown, PDF, or issue comment). I wrote up the SEO workflow [here](/sistrix-mcp-hallocasa-seo).

**Lesson:** One integration per job you do manually more than once a month. Don't wire everything on day one.

---

## 5. Telegram topics = project switcher

One group chat, many **topics** — blog, US client, German client, side projects.

Each topic loads the right context: which repo, which tone, which rules. I don't mix invoice talk with blog drafting in one thread.

**Lesson:** If your bot goes quiet in a group, check you're on a recent OpenClaw build. Forum topics had a reply bug that's fixed now.

---

## 6. Conference talk drafts

Between client work I still submit to AWS Community Days, AgentCon, CodeMotion, re:Invent. The agent keeps proposal drafts in a folder and knows the submission format.

Typical flow: *draft a talk on security scanning for Poland Community Day* → agent pulls from past project work and prior talks → title, abstract, outline ready to paste into the submission form → calendar reminder for the deadline.

**Lesson:** CFP writing is research + structure + your voice. The agent does the first two; I keep the third.

---

## Numbers (rough, three months in)

- **GitHub:** dozens of issues triaged; several fixes shipped via agent → Cursor → PR
- **Blog:** 4+ substantial posts with agent help (EN+DE pairs)
- **Invoices:** 5+ US sprint invoices + German client invoices — PDF + email draft each time
- **CFP:** 10+ proposal drafts across Poland, DACH, Milan, re:Invent
- **Cost:** picking the right model for the task matters more than VPS hosting
- **Failures:** one email sent too early → hard "ask before send" rule; morning briefing broke once after an update — fixed with a version bump and a cheaper scheduled job

---

## What's next

- Auto-implement after explicit GitHub approval
- Infra changes from chat (Hetzner work in progress)
- Quarterly VAT prep from the invoice folder — agent-assisted, accountant still reviews

---

## Conclusion

Three months ago OpenClaw was email, calendar, and GitHub pings. Now it's an **orchestrator**: topics for context, Cursor for code, live integrations for data, the blog for content, invoices and talk drafts for the business side.

Still on **€10/mo [Hostinger](https://www.hostinger.com?REFERRALCODE=MARTINMUELLER) Docker**.

If you already run OpenClaw, what helped me most: **hand off coding to Cursor**, **one Telegram topic per client/project**, and **one external integration per repetitive manual job**.

---

Links:
- [Original OpenClaw post](/openclaw-eng)
- [PeachBase — shared memory](/peachbase-global-brain)
- [SISTRIX MCP case study](/sistrix-mcp-hallocasa-seo)
- [OpenClaw](https://openclaw.ai) · [GitHub](https://github.com/openclaw/openclaw)

Questions or want help wiring your agent? [office@martinmueller.dev](mailto:office@martinmueller.dev) or [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev).
