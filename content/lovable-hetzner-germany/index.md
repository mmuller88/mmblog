---
title: Built with Lovable? Host Prod in Germany & DACH on Hetzner
show: "no"
date: "2026-06-08"
image: "index.jpg"
tags:
 [
  "lovable",
  "hetzner",
  "supabase",
  "netlify",
  "dach",
  "germany",
  "austria",
  "switzerland",
  "eu-hosting",
  "gdpr",
  "opensource",
  "eng",
  "2026",
 ]
pruneLength: 50
---

You built on **Lovable** — React app, Supabase auth, Postgres. It works. Then your first **DACH** customer or pilot asks: *Where is prod hosted? Where do login and data live?* That question shows up fast in **Germany**, **Austria**, and **Switzerland** B2B — especially HR, health, finance, and anything that touches procurement or a security questionnaire.

---

## Why “EU is fine” is not enough in DACH

Lovable’s default path — **Netlify** (or similar) plus **managed Supabase** — is great for building. It is not always enough for **prod you can point to** in a buyer review.

- **Germany** — GDPR, vendor questionnaires, and “EU hosting” often means *nameable EU infrastructure*, not “we use a US cloud somewhere in eu-west-1.”
- **Austria** — Same GDPR frame; many buyers mirror German expectations on data location and subprocessors.
- **Switzerland** — Not in the EU/GDPR, but strong privacy expectations (revDSG). **Hetzner** — German company, EU datacenters — is a credible answer for many Swiss buyers without overclaiming compliance.

This is not legal advice. It is the practical friction you hit when DACH customers want a clear answer on **where prod runs**.

---

## Phased prod on Hetzner — dev stays on Lovable

You do **not** need a big-bang migration. In a recent [German-client case study](/hetzner-eu-production), **dev** stayed on Netlify + managed Supabase while **prod** — app, login, Postgres — went live on **Hetzner** in the EU. Same pattern fits Lovable stacks: keep building in Lovable; add a **DACH-facing prod environment** on EU VMs.

**Case study:**

- [Production on Hetzner (Part 1)](/hetzner-eu-production) — phased EU prod, OpenTofu, CI deploys, self-hosted Supabase
- [Self-hosted insights (Part 2)](/hetzner-self-hosted-insights) — observability, cost guardrails, EU telemetry

Prod users hit the React app on Hetzner. Sign-in and Postgres for prod stay on Hetzner too. Dev keeps using Lovable’s stack unchanged.

![Lovable prod architecture on Hetzner in the EU](architecture.png)

---

## Open source stack — no black box prod

DACH buyers often ask not only *where* data lives but *what software runs there*. The prod path we use is built on **open source** you can name, audit, and run yourself — not a proprietary PaaS you cannot inspect.

| Layer | Open source |
| ----- | ----------- |
| Infra as code | [OpenTofu](https://opentofu.org/) |
| App runtime | React (from Lovable), nginx |
| Auth + API + DB | [Supabase](https://github.com/supabase/supabase) (self-hosted), Postgres |
| Observability | [Grafana](https://grafana.com/oss/), Prometheus, Loki, Tempo, [OpenTelemetry](https://opentelemetry.io/) |

That matters in security reviews: subprocessors and components are identifiable. You are not locked into a single vendor’s managed layer for prod. Hetzner gives you VMs; the stack on top stays portable and forkable.

---

## What I handle vs what you keep doing

**You:** keep shipping features in Lovable.

**Me:** OpenTofu (servers, firewall, DNS), GitHub Actions deploys, **self-hosted open-source Supabase** on prod VMs, and **self-hosted observability** (Grafana LGTM, cost alerts) — the documentation DACH buyers often ask for: where data lives, what runs there, who operates prod, what it costs.

I work with **DACH clients** on exactly this path. If that sounds like your next step, reach out.

[office@martinmueller.dev](mailto:office@martinmueller.dev) · [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev) · [LinkedIn](https://www.linkedin.com/in/martinmueller88)

---

## Further reading

- [Production on Hetzner for a German client (Part 1)](/hetzner-eu-production)
- [Self-hosted insights on Hetzner (Part 2)](/hetzner-self-hosted-insights)
