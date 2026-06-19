---
title: "Datengetriebenes SEO mit dem SISTRIX MCP: Ein HalloCasa Case Study"
show: "yes"
date: "2026-06-20"
image: "index.png"
tags: ["de", "2026", "mcp", "seo", "sistrix", "hallocasa", "cursor", "ai"]
pruneLength: 50
audio: "audio.mp3"
engUrl: https://martinmueller.dev/sistrix-mcp-hallocasa-seo
---

Ich habe [HalloCasa](https://hallocasa.com) mitgegründet — ein globales Maklerverzeichnis mit Listings, Profilen, Abos und Kursen. Organische Suche sollte für uns ein wichtiger Kanal sein. Als ich mich hinsetzte, eine SEO-Strategie zu bauen, wollte ich keinen Tag in Dashboards klicken, CSVs exportieren und Screenshots in ein Doc kleben.

Stattdessen habe ich meine KI in **Cursor** mit dem **[SISTRIX MCP](https://www.sistrix.com/api/connection-to-chatbot-ai/)** verbunden und in einer Agent-Session ein vollständiges Audit gefahren: Sichtbarkeits-Baseline über mehrere Märkte, Ranking-URLs, Keyword-Chancen, Wettbewerber-Overlap, Backlink-Profil — abgeglichen mit unserer Next.js-Codebase zu Canonical-Tags, hreflang und Sitemaps. Ergebnis: eine priorisierte Roadmap, kein Bauchgefühl.

Alles begann mit einem Prompt:

> Use the SISTRIX MCP to develop a sophisticated SEO strategy for https://hallocasa.com/

Keine Keyword-Spreadsheets, kein ausgefeilter System-Prompt — nur Domain und Tool. Von dort zog der Agent SISTRIX-Daten Markt für Markt, las unser Repo und machte daraus ein Strategie-Dokument mit priorisierten Stufen.

Dieser Post beschreibt den Workflow: was SISTRIX und sein MCP sind, warum MCP für SEO relevant ist, und was die Daten über hallocasa.com erzählt haben.

---

## Was ist SISTRIX?

[SISTRIX](https://www.sistrix.com/) ist eine deutsche SEO-Plattform, weit verbreitet im DACH-Raum und darüber hinaus. Die Leitmetrik ist der **Sichtbarkeitsindex** — ein Score aus Ranking-Positionen und Suchvolumen über alle Keywords, für die eine Domain rankt. Dazu kommen Keyword-Rankings, Backlink-Daten, Wettbewerber-Overlap, Suchintention und (neuer) AI-Visibility-Tooling.

Für eine Site wie HalloCasa — globales Maklerverzeichnis, LatAm-lastige Länderliste, deutschsprachiger Expat-Content im Blog — ist SISTRIX nützlich, weil man nach **Land** slicen kann (`de`, `us`, `co`, `es`, `mx`, …) und Märkte in einer Session vergleicht, statt anzunehmen, ein Google-Index passe für alle.

---

## Warum MCP für SEO-Tools?

Das [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) ist ein offener Standard, mit dem KI-Assistenten externe Tools über eine einheitliche Schnittstelle aufrufen. Ohne MCP raten Chatbots oder halluzinieren Metriken. Mit MCP ziehen sie **Live-Daten** aus der SEO-Plattform.

| Ohne MCP | Mit MCP |
| -------- | ------- |
| Tab-Hopping, manuelle Exports | Agent fragt Live-Daten im Chat ab |
| Veraltete Screenshots in Strategie-Docs | Reproduzierbare, datierte API-Pulls |
| SEO-Analyst und Entwickler in getrennten Tools | Agent gleicht Rankings **und** Repo ab |

Unter **Cursor → Settings → Tools & MCP** verdrahtet man den SISTRIX-Server einmal. Der Agent ruft dann Tools wie `domain_visindex` oder `keyword_domain_seo` im normalen Chat auf — wie Dateien lesen oder Terminal-Befehle.

**Workflow (Cursor + SISTRIX MCP + Codebase):**

| Schritt | Du | Agent |
| ------- | -- | ----- |
| 1 | SEO-Audit deiner Domain anfragen | Ruft SISTRIX-MCP-Tools pro Markt auf |
| 2 | Agent auf Repo zeigen | Liest `seo.ts`, `MetaData.tsx`, `robots.txt`, Sitemaps |
| 3 | Strategie + Prioritäten anfragen | Synthetisiert Daten + Code-Funde zu actionable Doc |

---

## SISTRIX MCP einrichten

SISTRIX liefert einen offiziellen MCP-Server. Docs und Setup-Guides:

| Ressource | Link |
| --------- | ---- |
| Haupt-Hub | [Connection to AI with MCP](https://www.sistrix.com/api/connection-to-chatbot-ai/) |
| OAuth für alle Pläne (2025+) | [SISTRIX MCP Servers Changelog](https://www.sistrix.com/changelog/sistrix-mcp-servers/) |
| Technische Referenz | [Technical Information MCP](https://www.sistrix.com/api/connection-to-chatbot-ai/technical-information-mcp/) |
| ChatGPT-Setup | [Setting up ChatGPT](https://www.sistrix.com/api/connection-to-chatbot-ai/setting-up-chatgpt/) |
| Claude-Setup | [Setting up Claude](https://www.sistrix.com/api/connection-to-chatbot-ai/setting-up-claude/) |

**Endpoint:** `https://api.sistrix.com/mcp/`

**Auth:** OAuth funktioniert inzwischen auf **allen SISTRIX-Plänen** — einloggen, kein API-Key nötig. API-Keys gehen weiter auf Plus+, wenn man will. Laut [SISTRIX-Docs](https://www.sistrix.com/api/connection-to-chatbot-ai/technical-information-mcp/) verbrauchen MCP-Requests aktuell **keine API-Credits** (anders als direkte API-Calls). Für Cursor: MCP-Server mit demselben Endpoint plus OAuth oder API-Key in der MCP-Config.

---

## SISTRIX-MCP-Tool-Oberfläche

Der MCP exponiert Dutzende Tools. Im HalloCasa-Audit haben wir diese Gruppen genutzt:

| Kategorie | Beispiel-Tools | Was man lernt |
| --------- | -------------- | ------------- |
| Domain-Sichtbarkeit | `domain_visindex`, `domain_kwcount_seo`, `domain_ranking_distribution` | Footprint pro Markt, Page-1-Keyword-Anzahl |
| Keywords | `keyword_domain_seo`, `domain_opportunities`, `keyword_seo_metrics` | Was rankt, Near-Wins, Volumen und Intent |
| Wettbewerb | `domain_competitors_seo`, `domain_ideas` | Overlap und Content-Gaps |
| Links | `links_list` | Toxische vs. legitime Backlinks |
| AI-Sichtbarkeit | `ai_entity` | AEO-Baseline (unser HalloCasa-Entity-Call lieferte HTTP 500) |
| Projekte | `project_ranking`, `project_visibilityindex`, … | Laufendes Tracking, sobald ein Projekt existiert |

**`country`** als ISO-Code übergeben (`de`, `us`, `co`, `es`, `mx`, …), um mehrere Märkte in einer Session zu auditieren. So sahen wir: Deutschland hat Historie, Kolumbien und Mexiko praktisch keine Sichtbarkeit.

---

## HalloCasa Case Study: Was die Daten zeigten

Domain: **hallocasa.com**. Der Agent zog SISTRIX-Daten über unsere Hauptmärkte (DE, US, ES, CO, MX).

### Baseline-Snapshot

Deutschland ist der einzige Markt mit relevanter organischer Historie — die Sichtbarkeit ist seit einem Peak vor ein paar Jahren stark gesunken. USA und Spanien zeigen Spuren (meist Blog-Content). Kolumbien und Mexiko haben trotz Kern-Geschäftsgeografie praktisch keinen organischen Footprint.

Diese Diskrepanz zwischen Business-Fokus und Search-Sichtbarkeit war der erste große Insight — sichtbar nur, weil wir pro Land abgefragt haben statt Google als einen globalen Index zu behandeln.

### Wo Rankings wirklich liegen

Fast der gesamte SEO-Wert sitzt auf **`blog.hallocasa.com`**, meist deutsche Artikel zu LatAm-Immobilien (Chile, Kolumbien, Peru, Argentinien, Mexiko). Das **Verzeichnis** (`www.hallocasa.com`) rankt im Vergleich kaum — ein paar Makler-Namen-Profil-Queries, sonst wenig.

**Kernbefund:** Autorität strandet auf einer Subdomain, fließt nicht zu Makler-Profilen und `/brokers`. Strukturproblem, kein Content-Gap.

### Near-Win-Keywords (schnellster Ranking-Upside)

SISTRIX `domain_opportunities` zeigte mehrere deutsche Keywords, bei denen wir schon auf Seite 2 ranken — grenzüberschreitende Investment- und Expat-Immobilienthemen mit relativ geringem Wettbewerb. Die auf Seite 1 zu schieben ist weniger Aufwand als neue Head-Terms.

### Wettbewerber (DE organischer Overlap)

Die Overlap-Menge mischt große deutsche Immobilienportale, internationale Luxury-Listing-Sites und Nischen-Expat-/Investment-Blogs. Wir konkurrieren nicht um generische deutsche Portal-Head-Terms; unsere Nische ist **grenzüberschreitender / Expat-Investor-Content**.

### Backlinks: meist Rauschen

Das Linkprofil wird von **SEO-Verzeichnis- und PBN-Spam** dominiert. Legitime Links gibt es, aber spärlich — Partner-Podcasts, Reise-Sites, Konferenz-Medien. GSC-Audit vor Disavow sinnvoll; Google ignoriert offensichtlichen Spam oft von selbst.

### Code-Abgleich: Warum das Verzeichnis nicht rankt

Der Agent las unser Next.js-Repo parallel zu SISTRIX-URLs. Technische Punkte, die schwache Verzeichnis-Sichtbarkeit erklären:

- **i18n via `?lang=`** im Verzeichnis, aber **Canonical-URLs strippen den Query** — alle neun Locales kollabieren auf eine indexierbare URL pro Pfad.
- **Kein `hreflang`**; Blog und Home nutzen Pfad-Locales (`/de/`, `/es/`), Apex Query-Locales.
- **Fragmentierte Architektur:** `blog.`, `home.` und Apex als getrennte Properties; der Blog hält die Rankings.

International SEO fixen und Blog-Autorität auf die Hauptdomain konsolidieren sind Grundlagen, bevor Content in CO/MX skaliert wird.

---

## Priorisierte Roadmap (90-Tage-Perspektive)

Aus dem Audit haben wir Aktionen nach Aufwand vs. Impact gestaffelt:

**P0 — zuerst (Wochen 1–4)**

| Aktion | Warum |
| ------ | ----- |
| GSC-Domain-Property + Baseline-KPIs | Ohne Messung geht nichts |
| `www`-Canonical + 301 aller Host-Varianten | Stoppt gesplittete Link-Equity |
| Blog → Verzeichnis-CTAs auf Top-DE-Posts | Rankings da; Verzeichnis bekommt keinen Traffic |
| Cross-Links Blog ↔ `/brokers` ↔ Profile | Partielle Autoritäts-Übertragung ohne Migration |

**P1 — höchster SEO-Upside (Wochen 4–16)**

| Aktion | Warum |
| ------ | ----- |
| Near-Win-DE-Blogposts optimieren | Schnellste Ranking-Wins |
| Blog → `/blog/`-Subfolder-Konsolidierung | Größter struktureller Lift fürs Verzeichnis |
| Pfad-Locales + `hreflang` auf Apex | Pflicht vor ES/EN-Skalierung |
| DE-Pillar-Hub für grenzüberschreitendes Investment | Commercial-Intent-Cluster |

**P3 — Long Bets**

Spanische LatAm-Programmatic-Pages (CO/MX) erst, wenn Makler-Bestand mitspielt — leere City-Templates wären Thin-Content-Risiko.

---

## Workflow replizieren

1. **SISTRIX MCP in Cursor verdrahten** — Endpoint `https://api.sistrix.com/mcp/`, [Setup-Docs](https://www.sistrix.com/api/connection-to-chatbot-ai/), OAuth oder API-Key.
2. **Mit klarer Anfrage starten** — z. B. *Use the SISTRIX MCP to develop a sophisticated SEO strategy for https://hallocasa.com/* (das war mein kompletter Start-Prompt).
3. **Multi-Market-Baseline anfragen** — `domain_visindex` und `domain_kwcount_seo` pro Land.
4. **Ranking-URLs ziehen** — `keyword_domain_seo`, um zu sehen, welche Subdomain oder welcher Pfad wirklich rankt.
5. **Chancen, Wettbewerber, Backlinks** — `domain_opportunities`, `domain_competitors_seo`, `links_list`.
6. **Codebase auditieren** — Canonicals, hreflang, robots, Sitemaps, i18n-Patterns.
7. **Synthetisieren** — Strategie-Doc mit priorisierten Stufen, kein Data-Dump.

Optional haben wir ein PDF aus dem Strategie-Markdown exportiert (`pandoc` + headless Chrome) für Stakeholder — Polish, nicht Pflicht fürs Audit.

---

## Takeaways für andere Sites

- **MCP macht SEO von Dashboard-Archäologie zu agent-native Research.** Der Agent zieht Live-SISTRIX-Daten, während du im Editor bleibst.
- **Am besten, wenn der Agent auch dein Repo lesen kann.** Rankings sagen *was* rankt; Code sagt *warum* Fixes schwer oder leicht sind.
- **Multi-Subdomain-Setups brauchen eine explizite Architektur-Entscheidung** — konsolidieren (z. B. Blog → `/blog/`) oder stark verlinken; Autorität überträgt sich nicht von selbst.
- **Near-Win-Keywords priorisieren** vor Greenfield-Programmatic-SEO oder Neun-Locale-Übersetzungs-Marathons.
- **Marktdaten an Business-Fokus anpassen.** Kaum Sichtbarkeit in CO/MX trotz LatAm-Kerngeografie — die Diskrepanz sieht man nur bei Abfrage pro Land.

---

## Was als Nächstes bei HalloCasa

Dieser Post geht um die **Research-Methode** — aber das Audit lieferte eine klare Roadmap, und ich freue mich auf die Umsetzung: P0-Fixes zuerst, dann DE-Near-Win-Posts und Blog-Konsolidierung. SISTRIX bleibt für laufendes Tracking drin, nicht nur diese Session.

Dasselbe MCP-Setup öffnet **GEO** (Generative Engine Optimization): SISTRIX’ AI-Visibility-Tools (`ai_entity` und verwandtes Project-Tooling) erlauben eine Baseline, wie HalloCasa in KI-Antworten auftaucht, und Messung des Lifts beim Fixen von Struktur und Content. Unser erster `ai_entity`-Call lieferte 500 — Retry lohnt sich nach den Grundlagen.

Ich bin Co-Founder von HalloCasa und nutze MCP auch sonst im Stack (siehe [Wie ich OpenClaw nutze](/openclaw-de) für einen anderen Blick auf Agent-Tooling). Wer Hilfe beim Verdrahten von SISTRIX MCP in Cursor oder ein ähnliches Audit auf der eigenen Domain will: [LinkedIn](https://www.linkedin.com/in/martinmueller88/).
