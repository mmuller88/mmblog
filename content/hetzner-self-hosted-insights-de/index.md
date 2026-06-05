---
title: Self-hosted Insights auf Hetzner — Observability, Kosten, KI-Agenten (Teil 2)
show: "no"
date: "2026-06-09"
image: "index.png"
tags:
 [
  "hetzner",
  "grafana",
  "observability",
  "opentelemetry",
  "mcp",
  "ai-agents",
  "devops",
  "case-study",
  "de",
  "2026",
  "nofeed",
 ]
engUrl: https://martinmueller.dev/hetzner-self-hosted-insights
audio: "audio.mp3"
audioTiming: "audio-timing.json"
pruneLength: 50
---

**Teil 1:** [EU-Produktion auf Hetzner](/hetzner-eu-production-de)

Nachdem [Prod auf Hetzner live ging](/hetzner-eu-production-de) — React-App, self-hosted Supabase-Login, Postgres auf EU-VMs; Dev weiter auf Netlify + managed Supabase — kam **self-hosted Observability** auf einer dedizierten Prod-VM dazu. Metriken, Logs, Traces und Kostendaten bleiben in der EU. Kein APM-SaaS von Drittanbietern. Danach haben wir **KI-Agenten** angebunden, die Prod über Grafana MCP abfragen — statt SSH-Rätselraten.

---

## Insights ohne die EU zu verlassen

Wir haben **self-hosted Observability** auf Hetzner ergänzt: OpenTelemetry-Ingest, **Grafana LGTM** (Prometheus, Loki, Tempo) und **Grafana-Alloy**-Agenten auf den Static- und Supabase-VMs. Browser-**RUM** sowie Edge-Function-Traces und -Logs exportieren in denselben Stack — nichts verlässt die EU für die Frage „wie läuft Prod?“

Provisionierte Dashboards (Git → Redeploy):

| Dashboard | Was es zeigt |
| --------- | ------------ |
| Data health | Fließen Metriken, Logs und Traces? |
| Prod Overview | Prod-Gesundheit auf einen Blick |
| Infrastructure USE | CPU, RAM, Disk auf den VMs |
| nginx RED | Request-Rate, Fehler, Dauer aus JSON-Access-Logs |
| Supabase Docker | Container-Health auf der API-VM |
| Postgres | Verbindungen, Query-Stats |
| Frontend RUM | Browser-Traces (Tempo) |
| Edge Functions | Edge-Traces + App-Logs in Loki |

**Warum das für Kunden zählt:** Datadog-Klasse Sichtbarkeit, ohne Telemetrie an US-SaaS zu schicken oder per SSH zu raten. Dashboards und Alert-Regeln liegen in Git; Google OAuth schützt die Grafana-UI.

---

## Planbare Kosten, automatisch im Blick

Hetzner-Preise sind transparent — aber drei VMs, Backups, Primary IPs und Volumes summieren sich. Wir haben ein **Production Costs**-Dashboard angebunden, das **live Hetzner-API-Preise** in Prometheus zieht (`arc_infra_cost_eur_monthly`): Aufschlüsselung pro Server, Backup, Volume und Primary IP, plus monatliche und jährliche Projektion.

Ein **Grafana-Alert** feuert, wenn die geschätzte Infra-Kosten **50 EUR/Monat** erreichen — E-Mail an die Ops-Liste, bevor die Rechnung überrascht. Das Gegenteil von undurchsichtigen Cloud-Rechnungen, bei denen man den Spike erst in der Console entdeckt.

---

## KI-Agenten mit echten Tools

Vieles wurde mit **KI-Assistenten im Loop** designed, debuggt und **betrieben** (Cursor, Claude Code). Die wichtigste Erkenntnis: Sobald Grafana self-hosted auf Hetzner läuft, kann man Agenten auf **Prod selbst** zeigen — nicht nur auf Docs und IaC.

Mit **[Grafana MCP](https://github.com/grafana/mcp-grafana)** (`mcp-grafana` via `uvx`) und einem **read-only Viewer**-Service-Account-Token kann ein Agent:

- **PromQL** ausführen (Host-CPU, Postgres-Verbindungen, Kosten-Metriken)
- **LogQL** ausführen (nginx-Access-Logs, Edge-Function-Output)
- **Dashboards suchen** und Panels zusammenfassen
- **Alert-Regeln listen** und Firing-Status prüfen

Das machte aus „etwas ist langsam in Prod“ einen Loop: Agent fragt Grafana ab → findet Panel oder Log-Stream → schlägt Fix in Git/CI vor oder wendet ihn an — ohne SSH-Rätselraten. **Tool-Freigabe bleibt an** in Cursor; Token ist read-only; Infra- und Schema-Änderungen laufen weiter über OpenTofu und CI.

Unter **Cursor → Settings → Tools & MCP** verdrahtet das Projekt MCP-Server plus die üblichen CLIs:

| Tool | Wofür wir es nutzen |
| ---- | ------------------- |
| **[hcloud CLI](https://github.com/hetznercloud/cli)** | Server, IPs, Firewalls vom Terminal prüfen |
| **OpenTofu CLI** | Infra planen und anwenden (VMs, Firewall, DNS) |
| **OpenTofu MCP** (`@opentofu/opentofu-mcp-server` via `npx`) | Provider-Docs im Chat nachschlagen (read-only) |
| **Supabase CLI** | Migrationen und Schema-Arbeit in Git |
| **Supabase MCP** ([offizielles hosted MCP](https://supabase.com/docs/guides/ai-tools/mcp)) | Tabellen inspizieren, read-only SQL, Logs und Docs |
| **Grafana MCP** ([mcp-grafana](https://github.com/grafana/mcp-grafana) via `uvx`) | PromQL, LogQL, Dashboards, Alerts auf self-hosted Grafana |

**Cursor-Config-Form** (lokale `.cursor/mcp.json`, nicht committed):

```json
{
 "mcpServers": {
  "supabase": {
   "url": "https://mcp.supabase.com/mcp?project_ref=YOUR_REF&read_only=true"
  },
  "opentofu": {
   "command": "npx",
   "args": ["-y", "@opentofu/opentofu-mcp-server"]
  },
  "grafana": {
   "command": "uvx",
   "args": [
    "mcp-grafana",
    "--disable-admin",
    "--disable-oncall",
    "--disable-incident"
   ],
   "env": {
    "GRAFANA_URL": "https://grafana.prod.universe.arc-rider.com",
    "GRAFANA_SERVICE_ACCOUNT_TOKEN": "YOUR_GRAFANA_SERVICE_ACCOUNT_TOKEN"
   }
  }
 }
}
```

Zusammen mit Runbooks fühlte sich das näher an **IaC plus Observability plus CLIs** als an „SSH auf einen Pet-Server und hoffen“. Applies laufen weiter über OpenTofu/CI; MCP ist für Lookup, Schema, Logs und Prod-Queries — keine stillen Infra- oder Schema-Writes.

---

## Was wir gelernt haben (Kurzfassung)

- **Observability auf Hetzner ist ein Produkt-Asset** — Metriken, Logs und Traces in der EU, aus Git provisioniert, kein APM-SaaS-Lock-in.
- **Planbare Kosten und EU-Hosting** — Kosten-Dashboard + Budget-Alert, damit Ausgaben sichtbar bleiben, bevor die Rechnung überrascht.
- **KI-Agenten glänzen auf self-hosted Grafana** — Grafana MCP + read-only Token lässt Agenten Prod untersuchen (PromQL, LogQL, Dashboards) statt per SSH zu raten.

Prod ist live unter [prod.universe.arc-rider.com](https://prod.universe.arc-rider.com). Für diese Produktphase hat der Tradeoff gepasst: **Kontrolle dort, wo es zählt** — auf EU-Infrastruktur, auf die der Kunde verweisen kann, inklusive wie Prod überwacht wird und was es kostet.

---

## Hetzner-Migrationen — wie ich helfen kann

**Netlify**, **managed Supabase** oder **AWS** für Dev und **Prod in der EU auf Hetzner** nötig? Ich helfe bei Planung, OpenTofu, CI-Deploys, self-hosted Supabase auf Prod-VMs und **self-hosted Observability** (Grafana LGTM, Alloy, Kosten-Wächter, Grafana MCP für agentenfreundlichen Betrieb).

[office@martinmueller.dev](mailto:office@martinmueller.dev) · [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev) · [LinkedIn](https://www.linkedin.com/in/martinmueller88)

---

## Weiterführende Links

- [grafana/docker-otel-lgtm](https://github.com/grafana/docker-otel-lgtm)
- [grafana/mcp-grafana](https://github.com/grafana/mcp-grafana)
