---
title: Production on Hetzner for a German Client — EU Hosting (Part 1)
show: "no"
date: "2026-06-05"
image: "index.png"
tags:
 [
  "hetzner",
  "supabase",
  "netlify",
  "opentofu",
  "devops",
  "case-study",
  "eng",
  "2026",
 ]
pruneLength: 50
---

_Part 2 (self-hosted observability, cost guardrails, AI agents) — coming soon._

A **German client** needed **production in the EU on Hetzner** — clear control over where customer data and login live. The product is **Arc Rider Universe**: the SaaS behind [universe.arc-rider.com](https://universe.arc-rider.com/) — _Mission: Interface_, a UI toolkit for builders (tables, Kanban, Gantt, layouts, and more via JSON instead of hand-rolled UI code). **Dev** already ran happily on **Netlify** and **managed Supabase** — and still does. The goal was a **dedicated prod environment on Hetzner**, not a big-bang migration that would slow down the team.

---

## Why Hetzner, and why not “move everything at once”

The client is in Germany. **Prod** had to sit on **EU infrastructure they can point to** — Hetzner VMs for the app and the database.

That did **not** mean touching dev:

- **[universe.arc-rider.com](https://universe.arc-rider.com/)** (dev) stays on **Netlify** + **managed Supabase**.
- **Prod** — app, login, Postgres — runs on **Hetzner** at [prod.universe.arc-rider.com](https://prod.universe.arc-rider.com).

If you are planning something similar: you can add EU prod on Hetzner **without** replatforming dev in one weekend.

---

## What prod looks like (in plain terms)

**Prod users** open the React app on Hetzner. Sign-in and data for prod live on Hetzner too. Dev keeps using Netlify and managed Supabase unchanged.

![Arc Rider prod architecture on Hetzner](architecture.png)

Infra and deploys are automated with **OpenTofu** (servers, firewall, DNS) and **GitHub Actions** (build, deploy, quick smoke checks after a release).

Once prod was stable, we added **self-hosted observability** on a dedicated VM — metrics, logs, traces, cost guardrails, and agent-friendly ops. That is Part 2 (coming soon).

---

## What we learned (short version)

- **Phased beats big bang** — dev stayed on Netlify + managed Supabase while Hetzner prod came online.
- **Self-hosted login is not a copy-paste from cloud Supabase** — prod OAuth and magic links need prod-specific URLs and config; dev config stays separate.
- **Predictable cost and EU hosting** — VMs on Hetzner for app, login, and data.

Prod is live at [prod.universe.arc-rider.com](https://prod.universe.arc-rider.com). For this product stage, the tradeoff worked: **control where it mattered** on EU infrastructure the client can point to.

---

## Hetzner migrations — how I can help

On **Netlify**, **managed Supabase**, or **AWS** for dev and need **prod in the EU on Hetzner**? I help with planning, OpenTofu, CI deploys, self-hosted Supabase on prod VMs, and **self-hosted observability** (Grafana LGTM, Alloy, cost guardrails, Grafana MCP for agent-friendly ops).

[office@martinmueller.dev](mailto:office@martinmueller.dev) · [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev) · [LinkedIn](https://www.linkedin.com/in/martinmueller88)

---

## Further reading

- [Hetzner: Object Storage as OpenTofu backend](https://community.hetzner.com/tutorials/howto-hcloud-s3-terraform-backend/)
- [Supabase self-hosting (Docker)](https://supabase.com/docs/guides/self-hosting/docker)
