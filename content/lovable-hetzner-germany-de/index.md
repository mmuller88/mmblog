---
title: Mit Lovable gebaut? Prod in Deutschland & DACH auf Hetzner hosten
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
  "de",
  "2026",
 ]
engUrl: https://martinmueller.dev/lovable-hetzner-germany
audio: "audio.mp3"
audioTiming: "audio-timing.json"
pruneLength: 50
---

Du hast mit **Lovable** gebaut — React-App, Supabase-Auth, Postgres. Es funktioniert. Dann fragt dein erster **DACH**-Kunde oder Pilot: *Wo läuft Prod? Wo liegen Login und Daten?* Die Frage kommt in **Deutschland**, **Österreich** und der **Schweiz** im B2B schnell — besonders in HR, Health, Finance und allem, was Procurement oder ein Security-Fragebogen berührt.

---

## Warum „EU reicht“ in DACH oft nicht genug ist

Lovables Standardweg — **Netlify** (oder ähnlich) plus **managed Supabase** — ist super zum Bauen. Für **Prod, auf das du in einem Buyer-Review zeigen kannst**, reicht das nicht immer.

- **Deutschland** — DSGVO, Vendor-Fragebögen, und „EU-Hosting“ heißt oft *benennbare EU-Infrastruktur*, nicht „wir nutzen irgendwo eine US-Cloud in eu-west-1.“
- **Österreich** — Gleicher DSGVO-Rahmen; viele Käufer spiegeln deutsche Erwartungen zu Datenstandort und Subprozessoren.
- **Schweiz** — Nicht in EU/DSGVO, aber starke Datenschutzerwartungen (revDSG). **Hetzner** — deutsches Unternehmen, EU-Rechenzentren — ist für viele Schweizer Käufer eine glaubwürdige Antwort, ohne Compliance zu überverkaufen.

Das ist keine Rechtsberatung. Es ist die praktische Reibung, wenn DACH-Kunden eine klare Antwort wollen, **wo Prod läuft**.

---

## Phased Prod auf Hetzner — Dev bleibt auf Lovable

Du brauchst **keine Big-Bang-Migration**. In einer kürzlichen [Fallstudie mit deutschem Kunden](/hetzner-eu-production-de) blieb **Dev** auf Netlify + managed Supabase, während **Prod** — App, Login, Postgres — live auf **Hetzner** in der EU ging. Gleiches Muster passt zu Lovable-Stacks: weiter in Lovable bauen; eine **DACH-facing Prod-Umgebung** auf EU-VMs ergänzen.

**Fallstudie:**

- [Produktion auf Hetzner (Teil 1)](/hetzner-eu-production-de) — phased EU-Prod, OpenTofu, CI-Deploys, self-hosted Supabase
- [Self-hosted Insights (Teil 2)](/hetzner-self-hosted-insights-de) — Observability, Kosten-Guardrails, EU-Telemetrie

Prod-Nutzer treffen die React-App auf Hetzner. Sign-in und Postgres für Prod bleiben ebenfalls auf Hetzner. Dev nutzt Lovables Stack unverändert weiter.

![Lovable-Prod-Architektur auf Hetzner in der EU](architecture.png)

---

## Open-Source-Stack — kein Black-Box-Prod

DACH-Käufer fragen oft nicht nur *wo* Daten liegen, sondern *welche Software dort läuft*. Der Prod-Weg, den wir nutzen, baut auf **Open Source**, die du benennen, prüfen und selbst betreiben kannst — kein proprietäres PaaS, das du nicht inspizieren kannst.

| Layer | Open Source |
| ----- | ----------- |
| Infra as Code | <span class="tool-item"><img src="/lovable-hetzner-germany/icons/opentofu.svg" alt="" /> [OpenTofu (ein Open-Source-Fork von Terraform)](https://opentofu.org/)</span> |
| App-Runtime | <span class="tool-item"><img src="/lovable-hetzner-germany/icons/react.svg" alt="" /> React (von Lovable)</span>, <span class="tool-item"><img src="/lovable-hetzner-germany/icons/nginx.svg" alt="" /> nginx</span> |
| Auth + API + DB | <span class="tool-item"><img src="/lovable-hetzner-germany/icons/supabase.svg" alt="" /> [Supabase](https://github.com/supabase/supabase) (self-hosted)</span>, <span class="tool-item"><img src="/lovable-hetzner-germany/icons/postgresql.svg" alt="" /> Postgres</span> |
| Observability | <span class="tool-item"><img src="/lovable-hetzner-germany/icons/grafana.svg" alt="" /> [Grafana](https://grafana.com/oss/)</span>, <span class="tool-item"><img src="/lovable-hetzner-germany/icons/prometheus.svg" alt="" /> Prometheus</span>, <span class="tool-item"><img src="/lovable-hetzner-germany/icons/loki.svg" alt="" /> Loki</span>, <span class="tool-item"><img src="/lovable-hetzner-germany/icons/tempo.svg" alt="" /> Tempo</span>, <span class="tool-item"><img src="/lovable-hetzner-germany/icons/opentelemetry.svg" alt="" /> [OpenTelemetry](https://opentelemetry.io/)</span> |

Das zählt in Security Reviews: Subprozessoren und Komponenten sind identifizierbar. Du bist für Prod nicht in die Managed-Layer eines einzelnen Vendors eingesperrt. Hetzner liefert VMs; der Stack darauf bleibt portabel und forkbar.

---

## Was ich übernehme vs. was du weiter machst

**Du:** Features in Lovable weiter shippen.

**Ich:** OpenTofu (Server, Firewall, DNS), GitHub-Actions-Deploys, **self-hosted Open-Source-Supabase** auf Prod-VMs und **self-hosted Observability** (Grafana LGTM, Kosten-Alerts) — die Dokumentation, die DACH-Käufer oft fragen: wo Daten liegen, was dort läuft, wer Prod betreibt, was es kostet.

Ich arbeite mit **DACH-Kunden** genau auf diesem Pfad. Wenn das dein nächster Schritt klingt, melde dich.

[office@martinmueller.dev](mailto:office@martinmueller.dev) · [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev) · [LinkedIn](https://www.linkedin.com/in/martinmueller88)

---

## Weiterlesen

- [Produktion auf Hetzner für einen deutschen Kunden (Teil 1)](/hetzner-eu-production-de)
- [Self-hosted Insights auf Hetzner (Teil 2)](/hetzner-self-hosted-insights-de)
