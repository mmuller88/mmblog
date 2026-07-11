---
title: "OpenClaw drei Monate später: Was wirklich gelandet ist"
show: "no"
date: "2026-07-07"
image: "index.png"
audio: "audio.mp3"
tags: ["de", "2026", "openclaw", "ai", "automation", "mcp", "cursor"]
pruneLength: 50
engUrl: https://martinmueller.dev/openclaw-three-months-later
---

Im [April habe ich über OpenClaw geschrieben](https://martinmueller.dev/openclaw-de) — mein selbst gehosteter KI-Agent auf einem [Hostinger](https://www.hostinger.com/de?REFERRALCODE=MARTINMUELLER)-VPS, angebunden an Telegram, E-Mail, Kalender und GitHub. Der Post endete mit einer kurzen „What's Next“-Liste. Drei Monate später ist das meiste umgesetzt — und das Setup fühlt sich weniger wie ein Chatbot und mehr wie ein kleines Ops-Team an.

**Neu seit April:**

- **Blogposts** — Sprachnachricht rein, recherchierter Entwurf raus, auf der Site veröffentlicht
- **Code aus GitHub-Issues** — Agent plant, ich approve, PR kommt
- **Rechnungen** — zweisprachige PDFs für US- und DE-Kunden, Mail-Entwurf fertig
- **SEO & Compliance** — Live-Daten und Reports ohne fünf Tools anklicken
- **Ein Telegram-Chat, viele Projekte** — Topics trennen den Kontext
- **Konferenz-Vorschläge** — Talk-Entwürfe aus Memory, nicht von null

Was sich geändert hat, was kaputtging und was ich wieder so machen würde.

---

## Kurz zusammengefasst

OpenClaw ist ein persistenter Assistent mit Gedächtnis. Ich rede vor allem per **Telegram** — oft per Sprachnachricht. Er kann Aufgaben ausführen, Repos lesen, E-Mails entwerfen, GitHub prüfen. Versand nur nach meinem OK.

Alles Folgende baut darauf auf.

---

## 1. Blogposts — von der Idee bis live

Im April-Post stand: Blogposts entwerfen. Passiert — mehrfach:

| Post | Was der Agent gemacht hat |
| ---- | ------------------------- |
| [Hetzner-EU-Prod-Serie](/hetzner-eu-production-de) | Recherche, EN+DE-Entwurf, Bilder |
| [Lovable → Hetzner DACH](/lovable-hetzner-germany-de) | Gleiche Formel, echte Kundenstory |
| [SISTRIX-MCP-SEO-Audit](/sistrix-mcp-hallocasa-seo-de) | Live-SEO-Daten, Kunden-Code gelesen, Strategie-PDF |

Typischer Ablauf: Sprachnachricht → Kontext aus Notizen und Repos → Markdown-Entwurf → ich kürze und prüfe den Ton → veröffentlichen.

**Lesson:** Stark bei Erstentwürfen mit echten Daten. Mein Job: „Würde ich das unter meinem Namen posten?“

---

## 2. GitHub-Issues → Plan → PR

Größtes Upgrade: OpenClaw kann Coding an [Cursor](https://cursor.com) im echten Repo abgeben.

**Heute:**

1. Neues Issue im Produkt-Repo eines Kunden
2. Ping auf Telegram
3. Agent schreibt Implementierungsplan aus dem Code
4. Plan als **GitHub-Kommentar** — für das Team sichtbar, nicht im Chat versteckt
5. Ich approve → Code wird geschrieben → PR

Kleine Checks laufen auf dem günstigen Modell; Planung und Code nur, wenn es sich lohnt.

**Lesson:** Plan im Repo und auf GitHub halten. Telegram für Pings und Entscheidungen.

---

## 3. Rechnungen — die langweilige Arbeit

Rechnungstag war früher: HTML kopieren, Sätze suchen, USt-Formulierung prüfen, PDF, Upload, Begleitmail. Heute öffne ich das richtige Telegram-Topic und sage *nächste Rechnung vorbereiten*.

Der Agent kennt die Regeln pro Kunde — US vs. deutsch, Währung, MwSt, Layout. Letzte Rechnung als Vorlage, Nummer hoch, Zeitraum und Positionen eintragen, nur nachfragen was fehlt. Ergebnis: PDF in Dropbox, Mail-Entwurf wartet — **Versand erst nach meinem OK**.

**Lesson:** Der ROI-stärkste Use Case aus den letzten drei Monaten. Repetitiv, regellastig, fehleranfällig. Genau dafür ein Agent mit Gedächtnis.

---

## 4. SEO, WordPress, Compliance — ein Prompt, ein Ergebnis

April: Basis-Gedächtnis und wenige Tools. Juli: Der Agent spricht mit Diensten, die ich wöchentlich brauche — SEO-Daten, Kunden-WordPress, Security-Scan-Reports.

Immer gleiches Muster: eine Telegram-Nachricht, Agent kombiniert Live-Daten + Code-Kontext, ich bekomme ein datiertes Ergebnis (Markdown, PDF oder Issue-Kommentar). Den SEO-Workflow habe ich [hier](/sistrix-mcp-hallocasa-seo-de) beschrieben.

**Lesson:** Eine Integration pro Aufgabe, die du monatlich manuell wiederholst. Nicht am ersten Tag alles verdrahten.

---

## 5. Telegram-Topics = Projekt-Switcher

Ein Gruppenchat, viele **Topics** — Blog, US-Kunde, DE-Kunde, Nebenprojekte.

Jedes Topic lädt den passenden Kontext: welches Repo, welcher Ton, welche Regeln. Kein Rechnungsgespräch im Blog-Thread.

**Lesson:** Wenn der Bot in der Gruppe schweigt — aktuelle OpenClaw-Version prüfen. Forum-Topics hatten einen Reply-Bug, der inzwischen gefixt ist.

---

## 6. Konferenz-Talk-Entwürfe

Neben Kundenarbeit reiche ich bei AWS Community Days, AgentCon, CodeMotion, re:Invent ein. Der Agent hält Vorschlags-Entwürfe in einem Ordner und kennt das Submission-Format.

Typischer Ablauf: *Talk zu Security-Scanning für Poland Community Day entwerfen* → Agent zieht aus früheren Projekten und Talks → Titel, Abstract, Gliederung paste-ready → Kalender-Reminder für die Deadline.

**Lesson:** CFP = Recherche + Struktur + deine Stimme. Der Agent macht die ersten beiden.

---

## Zahlen (grob, drei Monate)

- **GitHub:** viele Issues triagiert; mehrere Fixes via Agent → Cursor → PR
- **Blog:** 4+ substanzielle Posts mit Agent-Hilfe (EN+DE)
- **Rechnungen:** 5+ US-Sprint-Rechnungen + deutsche Kundenrechnungen — jeweils PDF + Mail-Entwurf
- **CFP:** 10+ Vorschlags-Entwürfe für Polen, DACH, Mailand, re:Invent
- **Kosten:** richtiges Modell pro Aufgabe wichtiger als VPS-Hosting
- **Pannen:** eine Mail zu früh raus → harte „vor Versand fragen“-Regel; Morgen-Briefing einmal nach Update kaputt — mit Versions-Update und günstigerem Cron-Job gefixt

---

## Was als Nächstes kommt

- Auto-Implement nach explizitem GitHub-Approve
- Infra aus dem Chat (Hetzner in Arbeit)
- USt-Voranmeldung aus Rechnungsordner — agent-unterstützt, Steuerberater prüft

---

## Fazit

Vor drei Monaten: E-Mail, Kalender, GitHub-Pings. Heute: **Orchestrator** — Topics für Kontext, Cursor für Code, Live-Integrationen für Daten, Blog für Content, Rechnungen und Talk-Entwürfe für die Business-Seite.

Weiterhin **€10/mo [Hostinger](https://www.hostinger.com/de?REFERRALCODE=MARTINMUELLER) Docker**.

Wenn du OpenClaw schon nutzt: für mich die größten Hebel — **Coding an Cursor abgeben**, **ein Telegram-Topic pro Kunde/Projekt**, **eine Integration pro repetitiver manueller Aufgabe**.

---

Links:
- [Original-OpenClaw-Post](/openclaw-de)
- [PeachBase](/peachbase-global-brain)
- [SISTRIX-MCP-Fallstudie](/sistrix-mcp-hallocasa-seo-de)
- [OpenClaw](https://openclaw.ai) · [GitHub](https://github.com/openclaw/openclaw)

Fragen oder Hilfe beim Setup? [office@martinmueller.dev](mailto:office@martinmueller.dev) oder [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev).
