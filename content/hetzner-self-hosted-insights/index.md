---
title: Self-Hosted Insights on Hetzner — Observability, Cost, AI Agents (Part 2)
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
  "eng",
  "2026",
  "nofeed",
 ]
pruneLength: 50
---

**Part 1:** [EU production on Hetzner](/hetzner-eu-production)

After [moving Arc Rider Universe to Hetzner](/hetzner-eu-production) — React app, self-hosted Supabase login, Postgres on EU VMs — we added **self-hosted observability** on a dedicated VM. Metrics, logs, traces, and cost data stay in the EU. No third-party APM SaaS. Then we wired **AI agents** to query prod through Grafana MCP instead of SSH guesswork.

---

## Insights without leaving the EU

We added **self-hosted observability** on Hetzner: OpenTelemetry ingest, **Grafana LGTM** (Prometheus, Loki, Tempo), and **Grafana Alloy** agents on the static and Supabase VMs. Browser **RUM** and **edge-function** traces and logs export to the same stack — nothing leaves the EU for “how is prod doing?”

Provisioned dashboards (git → redeploy):

| Dashboard | What it shows |
| --------- | ------------- |
| Data health | Are metrics, logs, and traces flowing? |
| Prod Overview | High-level prod health |
| Infrastructure USE | CPU, memory, disk on VMs |
| nginx RED | Request rate, errors, duration from JSON access logs |
| Supabase Docker | Container health on the API VM |
| Postgres | Connections, query stats |
| Frontend RUM | Browser traces (Tempo) |
| Edge Functions | Edge traces + app logs in Loki |

**Why this matters for clients:** you get Datadog-class visibility without shipping telemetry to US SaaS or guessing from SSH. Dashboards and alert rules live in git; Google OAuth gates the Grafana UI.

---

## Predictable cost, watched automatically

Hetzner pricing is transparent — but three VMs, backups, primary IPs, and volumes still add up. We wired a **Production Costs** dashboard that pulls **live Hetzner API pricing** into Prometheus (`arc_infra_cost_eur_monthly`): per-server, backup, volume, and primary IP breakdown, plus total monthly and annual projection.

A **Grafana alert** fires when estimated infra cost hits **EUR 50/month** — email to the ops list before the invoice surprises anyone. That is the opposite of opaque cloud bills where you discover the spike in the console.

---

## AI agents with real tools

A lot of this was designed, debugged, and **operated** with **AI assistants in the loop** (Cursor, Claude Code). The standout learning: once Grafana is self-hosted on Hetzner, you can point agents at **prod itself** — not just docs and IaC.

With **[Grafana MCP](https://github.com/grafana/mcp-grafana)** (`mcp-grafana` via `uvx`) and a **read-only Viewer** service-account token, an agent can:

- Run **PromQL** (host CPU, Postgres connections, cost metrics)
- Run **LogQL** (nginx access logs, edge-function output)
- **Search dashboards** and summarize panels
- **List alert rules** and check firing state

That turned “something is slow in prod” into a loop: agent queries Grafana → finds the panel or log stream → suggests or applies a fix in git/CI — without SSH guesswork. **Tool approval stays on** in Cursor; the token is read-only; infra and schema changes still go through OpenTofu and CI.

In **Cursor → Settings → Tools & MCP**, the project wires MCP servers plus the usual CLIs:

| Tool | What we used it for |
| ---- | ------------------- |
| **[hcloud CLI](https://github.com/hetznercloud/cli)** | Check servers, IPs, firewalls from the terminal |
| **OpenTofu CLI** | Plan and apply infra (VMs, firewall, DNS) |
| **OpenTofu MCP** (`@opentofu/opentofu-mcp-server` via `npx`) | Look up provider docs in chat (read-only) |
| **Supabase CLI** | Migrations and schema work in git |
| **Supabase MCP** ([official hosted MCP](https://supabase.com/docs/guides/ai-tools/mcp)) | Inspect tables, run read-only SQL, check logs and docs |
| **Grafana MCP** ([mcp-grafana](https://github.com/grafana/mcp-grafana) via `uvx`) | PromQL, LogQL, dashboards, alerts on self-hosted Grafana |

**Cursor config shape** (local `.cursor/mcp.json`, not committed):

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

Together with runbooks, that felt closer to **IaC plus observability plus CLIs** than to “SSH into a pet server and hope.” Applies still go through OpenTofu/CI; MCP is for lookup, schema, logs, and prod queries — not silent infra or schema writes.

---

## What we learned (short version)

- **Observability on Hetzner is a product asset** — metrics, logs, and traces in the EU, provisioned from git, no APM SaaS lock-in.
- **Predictable cost and EU hosting** — cost dashboard + budget alert so spend stays visible before the invoice surprises anyone.
- **AI agents shine on self-hosted Grafana** — Grafana MCP + read-only token lets agents investigate prod (PromQL, LogQL, dashboards) instead of guessing from SSH.

Prod is live at [prod.universe.arc-rider.com](https://prod.universe.arc-rider.com). For this product stage, the tradeoff worked: **control where it mattered** on EU infrastructure the client can point to — including how prod is watched and what it costs.

---

## Hetzner migrations — how I can help

On **Netlify**, **managed Supabase**, or **AWS** and need **prod in the EU on Hetzner**? I help with migration planning, OpenTofu, CI deploys, self-hosted Supabase on your VMs, and **self-hosted observability** (Grafana LGTM, Alloy, cost guardrails, Grafana MCP for agent-friendly ops).

[office@martinmueller.dev](mailto:office@martinmueller.dev) · [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev)

---

## Further reading

- [grafana/docker-otel-lgtm](https://github.com/grafana/docker-otel-lgtm)
- [grafana/mcp-grafana](https://github.com/grafana/mcp-grafana)
