---
title: "OpenClaw drei Monate später: Cursor-Subagenten, MCP und die Blog-Pipeline"
show: "yes"
date: "2026-07-07"
image: "index.png"
audio: "audio.mp3"
tags: ["de", "2026", "openclaw", "ai", "automation", "mcp", "cursor"]
pruneLength: 50
engUrl: https://martinmueller.dev/openclaw-three-months-later
---

Im [April habe ich über OpenClaw geschrieben](https://martinmueller.dev/openclaw-de) — mein selbst gehosteter KI-Agent auf einem Hostinger-VPS, angebunden an Telegram, E-Mail, Kalender, GitHub und [PeachBase](https://martinmueller.dev/peachbase-global-brain/) als gemeinsames Gedächtnis. Der Post endete mit einer kurzen „What's Next“-Liste. Drei Monate später ist das meiste umgesetzt — und das Setup fühlt sich weniger wie ein Chatbot und mehr wie ein kleines Ops-Team an.

Was sich geändert hat, was kaputtging und was ich wieder so machen würde.

---

## Kurz zusammengefasst

OpenClaw = persistenter Agent + Tools + Memory-Dateien (`MEMORY.md`, Tagesnotizen, Heartbeats). Ich rede vor allem per **Telegram** (oft Sprachnachricht). Shell, Repos, E-Mail-Entwürfe, GitHub — Versand nur nach meinem OK.

Das gilt noch. Alles Folgende kommt obendrauf.

---

## 1. Blog-Automatisierung — vom Versprechen zur Pipeline

Im ersten Post stand: OpenClaw soll Blogposts entwerfen. Passiert — mehrfach:

| Post | Was OpenClaw gemacht hat |
| ---- | ------------------------ |
| [Hetzner-EU-Prod-Serie](/hetzner-eu-production-de) | Recherche, EN+DE-Entwurf, Bilder |
| [Lovable → Hetzner DACH](/lovable-hetzner-germany-de) | Gleiche Formel, echte Kundenstory |
| [SISTRIX-MCP-SEO-Audit](/sistrix-mcp-hallocasa-seo-de) | Live-MCP-Daten, Codebase gelesen, Strategie-PDF |

Typischer Ablauf: Sprachnachricht → Kontext aus Memory + Repos → Markdown in `mmblog/content/` → Review → Netlify. LinkedIn-Drafts oft in derselben Session.

**Lesson:** Der Agent kann *Erstentwürfe mit echten Daten*. Mein Job: Ton, Fakten, „würde ich das unter meinem Namen posten?“

---

## 2. Cursor CLI als Subunternehmer

Größtes Upgrade seit April: **`@jeehou/openclaw-cursor-cli`** — OpenClaw startet [Cursor CLI](https://cursor.com) (`agent --print --trust --yolo`) im ausgecheckten Repo.

**GitHub-Issue-Workflow heute:**

1. Heartbeat sieht neues Issue auf `hallocasacom/hallocasa-next`
2. Ping auf Telegram
3. Cursor CLI (Opus Thinking) schreibt Implementierungsplan aus dem Code
4. Plan als **GitHub-Kommentar** — nicht im Chat versteckt
5. Ich approve → Composer implementiert → PR

Planen und Coden passieren im Repo-Kontext. OpenClaw bleibt Dirigent.

**Model-Split, der funktioniert:**

| Aufgabe | Modell |
| ------- | ------ |
| Heartbeats, Morgen-Mail | Haiku + `lightContext` |
| Chat / Triage | Sonnet |
| Pläne | Opus via Cursor CLI |
| Implementierung | Composer |

Opus auf jedem Heartbeat war teuer. Routing hat das gefixt.

---

## 3. Awaiting-Feedback-Schleife (stakeholder-aware)

Früherer Fehler: Plan v1 posten, „warte auf Approval“ sagen, Issue nicht mehr lesen. Stakeholder kommentieren — Plan veraltet.

Fix: **`awaitingFeedbackIssues`** in `heartbeat-state.json`. Alle ~30 Min:

- Issue-Kommentare neu laden
- Antwort von jemand anderem → **vN+1**-Plan, GitHub-Kommentar, Telegram-Ping
- Erst dann Status melden

Beispiel: HalloCasa-SEO [#2400](https://github.com/hallocasacom/hallocasa-next/issues/2400): v1 → v2 → v3 nach Yoast/Polylang-Feedback und WordPress-MCP-Audit.

**Lesson:** Autonome Agenten brauchen *Poll-Loops*, keine One-Shot-Pläne.

---

## 4. MCP-Menü — SEO, WordPress, Compliance

April: PeachBase + Basics. Juli: kleiner Stack via **mcporter**:

| MCP | Einsatz |
| --- | ------- |
| **PeachBase** | Langzeitgedächtnis für Cursor, OpenClaw, ChatGPT |
| **SISTRIX** | Live-SEO, Keywords, Wettbewerb → Strategie |
| **WordPress** | `blog.hallocasa.com` auditieren, Kategorien, Drafts |
| **ai-secure** | ISO27001/NIST/SOC2/COBIT-Scans, PDF-Reports |

Muster: ein Telegram-Prompt, Agent ruft MCP + liest Code, Ergebnis ist datiertes Artefakt (Markdown, PDF, Issue-Kommentar).

Den SISTRIX-Workflow habe ich [hier](/sistrix-mcp-hallocasa-seo-de) beschrieben. WordPress + SEO-Dashboard laufen weiter — OpenClaw verbindet Produkt, Content und Infra-Repos.

---

## 5. Telegram-Forum-Topics = Projekt-Switcher

Ein Gruppenchat, viele **Topics**: `mmblog`, `hallocasa`, `ai-secure`, `arc-rider-universe`, `prowler`, …

Jedes Topic → Repo + Regeln in `MEMORY.md`. Kein Kontextwechsel in einem Thread — Topic öffnen, Agent weiß Bescheid.

**Ops:** OpenClaw **2026.5.4** hat `messages.groupChat.visibleReplies` gefixt — Antworten in Forum-Topics wurden auf älteren Builds verschluckt.

---

## 6. Cron-Zuverlässigkeit (als der Morgenbrief ausfiel)

`morning-email-check` um 07:00 Berlin lieferte nicht mehr. Ursache: **Gateway vs. CLI Versionsdrift** → `ERR_MODULE_NOT_FOUND`.

Fix: `openclaw update`, Gateway-Neustart, `doctor --fix`, Morgen-Job auf **Haiku** + `lightContext` + 180s Timeout.

Manueller Test: ~40s, Telegram OK. Langweilige Infra — bis sie es nicht ist.

---

## 7. Noch VPS (und warum)

Talk-Entwürfe zu [OpenClaw auf Lambda](https://github.com/openclaw/openclaw) existieren. Trotzdem **€10/mo Hostinger Docker**:

- Persistenter Workspace + Git-Clones
- Lange Cursor-CLI-Läufe ohne 15-Min-Lambda-Grenze
- Einfache Telegram-Webhooks

Serverless für Skalierung; Solo-Betrieb: VPS pragmatisch.

---

## Zahlen (grob, drei Monate)

- **GitHub:** viele Issues triagiert; Pläne als Kommentare; mehrere PRs via OpenClaw → Cursor
- **Blog:** 4+ substanzielle Posts mit Agent-Hilfe (EN+DE)
- **Kosten:** Modell-Routing wichtiger als Hosting
- **Pannen:** clawhub `self-improving-agent` mehrdeutiger Slug; eine ungenehmigte Mail früh → harte „vor Versand fragen“-Regel

---

## Was als Nächstes kommt

- Auto-Implement nach explizitem GitHub-Approve
- Hetzner-MCP für Infra aus dem Chat
- Eventuell Serverless — wenn scale-to-zero wichtiger wird als lange Shells

---

## Fazit

Vor drei Monaten: E-Mail + Kalender + GitHub-Pings. Heute: **Orchestrator** — Forum-Topics für Kontext, Cursor für Code, MCP für Live-Daten, Heartbeats für Stakeholder, mmblog für Content.

Wenn du OpenClaw schon nutzt: für mich die größten Hebel waren **Cursor-CLI-Plugin**, **Awaiting-Feedback-Polling** und **ein MCP pro Domäne, die du sonst manuell wiederholst**.

---

Links:
- [Original-OpenClaw-Post](/openclaw-de)
- [PeachBase](/peachbase-global-brain)
- [SISTRIX-MCP-Fallstudie](/sistrix-mcp-hallocasa-seo-de)
- [OpenClaw](https://openclaw.ai) · [GitHub](https://github.com/openclaw/openclaw)

Fragen oder Hilfe beim Setup (Telegram-Topics, MCP, Cursor CLI, Heartbeats)? [office@martinmueller.dev](mailto:office@martinmueller.dev) oder [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev).
