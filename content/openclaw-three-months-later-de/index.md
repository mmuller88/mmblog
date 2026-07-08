---
title: "OpenClaw drei Monate später: Cursor-Subagenten, MCP und die Blog-Pipeline"
show: "no"
date: "2026-07-07"
image: "index.png"
audio: "audio.mp3"
tags: ["de", "2026", "openclaw", "ai", "automation", "mcp", "cursor"]
pruneLength: 50
engUrl: https://martinmueller.dev/openclaw-three-months-later
---

Im [April habe ich über OpenClaw geschrieben](https://martinmueller.dev/openclaw-de) — mein selbst gehosteter KI-Agent auf einem [Hostinger](https://www.hostinger.com/de?REFERRALCODE=MARTINMUELLER)-VPS, angebunden an Telegram, E-Mail, Kalender, GitHub und [PeachBase](https://martinmueller.dev/peachbase-global-brain/) als gemeinsames Gedächtnis. Der Post endete mit einer kurzen „What's Next“-Liste. Drei Monate später ist das meiste umgesetzt — und das Setup fühlt sich weniger wie ein Chatbot und mehr wie ein kleines Ops-Team an.

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

Kommentieren Stakeholder auf einen Plan, liest der Agent das Issue neu und postet **vN+1** auf GitHub — Technik unter §2, kein eigener Use Case.

---

## 3. Kundenrechnungen — Deutschland und USA

Rechnungstag war früher nervig: letztes HTML kopieren, Sätze in Mails suchen, USt-Formulierung prüfen, PDF, Upload, Begleitmail. Heute öffne ich das Telegram-Topic **`prowler`** oder **`arc-rider-universe`** und sage *nächste Rechnung vorbereiten*.

Der Agent kennt das Playbook aus `MEMORY.md` + Topic-Kontext:

| Kunde | Topic | Format | Steuer |
| ----- | ----- | ------ | ------ |
| **Prowler** (USA) | `prowler` | Zweisprachig DE/EN, $/h Sprints | 0% Reverse Charge (§ 3a Abs. 2 UStG) |
| **Arc Rider** (DE) | `arc-rider-universe` | Deutsche Rechnung, Projektpauschale | 19% MwSt |

**Typischer Ablauf:**

1. Letzte Rechnung aus Dropbox holen (`dbxcli`) — Layout-Vorlage
2. Nummer erhöhen (`2026-prowler-4` → `2026-prowler-5`, …)
3. Vertragsdaten: Adresse, TIN, IBAN, Steuernummer, Leistungszeitraum, Stunden oder Positionen
4. Nur nachfragen, was fehlt (Stunden, EUR-Kurs, Ticket-Referenzen)
5. HTML → PDF → Dropbox → E-Mail-Entwurf in `work/` — **Versand erst nach meinem OK**

Prowler zweisprachig (US-Kunde); Arc Rider rein deutsch mit inländischer MwSt. Gleicher Agent, andere Regeln — weil jedes Topic das richtige Gedächtnis lädt.

**Lesson:** Der ROI-stärkste Automatisierungs-Use-Case, den ich im April-Post nicht hatte. Rechnungen sind repetitiv, regellastig, fehleranfällig. Genau dafür sind persistentes Memory + Shell da.

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

## 6. CFP- und Talk-Factory

Konferenzsaison hört nicht auf. Neben Kundenarbeit reiche ich bei AWS Community Days, AgentCon, CodeMotion, re:Invent ein — oft mehrere Vorschläge pro Event.

OpenClaw pflegt einen `cfp/`-Ordner: eine Markdown-Datei pro Vorschlag, plus Submission-Kits mit Sessionize-Feldreihenfolge. Typischer Ablauf:

1. Sprache oder Text: *Talk zu ai-secure für Poland Community Day entwerfen*
2. Agent zieht aus Memory (HDI/Cyquins, ai-secure-Architektur, frühere Talks), liest Struktur aus `cfp/aws-community-day-poland-2026/`
3. Ergebnis: Titel, Abstract, Gliederung, Zielgruppe — paste-ready für Sessionize
4. Kalender-Reminder für Deadlines (AgentCon, Rise of AI, AWS CD DACH, …)

Polen 2026 allein: drei Vorschläge (AI Factory, ai-secure-Scanning, AWS ESC). DACH und re:Invent je fünf im Ordner. Der Agent war nicht auf den Konferenzen — aber bei jedem Kundencall und Scan, aus dem Talk-Material wurde.

**Lesson:** CFP-Schreiben = Recherche + Struktur + deine Stimme. Der Agent macht die ersten beiden; ich behalte den dritten.

---

## Zahlen (grob, drei Monate)

- **GitHub:** viele Issues triagiert; Pläne als Kommentare; mehrere PRs via OpenClaw → Cursor
- **Blog:** 4+ substanzielle Posts mit Agent-Hilfe (EN+DE)
- **Rechnungen:** 5+ Prowler-Sprint-Rechnungen + deutsche Kundenrechnungen — jeweils HTML/PDF/Dropbox/Mail-Entwurf
- **CFP:** 10+ Vorschlags-Entwürfe für Polen, DACH, Mailand, re:Invent
- **Kosten:** Modell-Routing wichtiger als Hosting
- **Pannen:** clawhub `self-improving-agent` mehrdeutiger Slug; eine ungenehmigte Mail früh → harte „vor Versand fragen“-Regel; Morgen-Cron einmal wegen Gateway/CLI-Versionsdrift ausgefallen — `openclaw update` + Haiku-Job

---

## Was als Nächstes kommt

- Auto-Implement nach explizitem GitHub-Approve
- Hetzner-MCP für Infra aus dem Chat
- USt-Voranmeldung aus Rechnungsordner (agent-unterstützt, Steuerberater prüft)

---

## Fazit

Vor drei Monaten: E-Mail + Kalender + GitHub-Pings. Heute: **Orchestrator** — Forum-Topics für Kontext, Cursor für Code, MCP für Live-Daten, mmblog für Content, **Rechnungen und CFP-Entwürfe für die Business-Seite**.

Weiterhin **€10/mo [Hostinger](https://www.hostinger.com/de?REFERRALCODE=MARTINMUELLER) Docker** — pragmatisch für lange Cursor-Läufe und persistenten Workspace.

Wenn du OpenClaw schon nutzt: für mich die größten Hebel waren **Cursor-CLI-Plugin**, **kundenspezifisches Memory pro Telegram-Topic** und **ein MCP pro Domäne, die du sonst manuell wiederholst**.

---

Links:
- [Original-OpenClaw-Post](/openclaw-de)
- [PeachBase](/peachbase-global-brain)
- [SISTRIX-MCP-Fallstudie](/sistrix-mcp-hallocasa-seo-de)
- [OpenClaw](https://openclaw.ai) · [GitHub](https://github.com/openclaw/openclaw)

Fragen oder Hilfe beim Setup (Telegram-Topics, MCP, Cursor CLI, Heartbeats)? [office@martinmueller.dev](mailto:office@martinmueller.dev) oder [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev).
