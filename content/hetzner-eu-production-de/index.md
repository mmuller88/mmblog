---
title: Produktion auf Hetzner für einen deutschen Kunden — EU-Hosting (Teil 1)
show: "no"
date: "2026-06-05"
image: "index.jpg"
tags:
 [
  "hetzner",
  "supabase",
  "netlify",
  "opentofu",
  "devops",
  "case-study",
  "de",
  "2026",
 ]
engUrl: https://martinmueller.dev/hetzner-eu-production
audio: "audio.mp3"
audioTiming: "audio-timing.json"
pruneLength: 50
---

**Teil 2:** [Self-hosted Insights auf Hetzner](/hetzner-self-hosted-insights-de)

Ein **deutscher Kunde** brauchte **Produktion in der EU auf Hetzner** — klare Kontrolle darüber, wo Kundendaten und Login liegen. Das Produkt ist **Arc Rider Universe**: die SaaS hinter [universe.arc-rider.com](https://universe.arc-rider.com/) — _Mission: Interface_, ein UI-Toolkit für Builder (Tabellen, Kanban, Gantt, Layouts und mehr per JSON statt handgeschriebener UI-Code). **Dev** lief bereits problemlos auf **Netlify** und **managed Supabase** — und tut das weiterhin. Ziel war eine **dedizierte Prod-Umgebung auf Hetzner**, keine Big-Bang-Migration, die das Team ausbremst.

---

## Warum Hetzner, und warum nicht „alles auf einmal umziehen“

Der Kunde sitzt in Deutschland. **Prod** musste auf **EU-Infrastruktur**, auf die er verweisen kann — Hetzner-VMs für App und Datenbank.

Das hieß **nicht**, Dev anzufassen:

- **[dev.universe.arc-rider.com](https://dev.universe.arc-rider.com/)** (Dev) bleibt auf **Netlify** + **managed Supabase**.
- **Prod** — App, Login, Postgres — läuft auf **Hetzner** unter [universe.arc-rider.com](https://universe.arc-rider.com).

Wenn du Ähnliches planst: EU-Prod auf Hetzner geht **an einem Wochenende** — **ohne** Dev umzuplatformen.

---

## Wie Prod aussieht (kurz erklärt)

**Prod-Nutzer** öffnen die React-App auf Hetzner. Anmeldung und Daten für Prod liegen ebenfalls auf Hetzner. Dev nutzt weiter Netlify und managed Supabase unverändert.

![Arc Rider Prod-Architektur auf Hetzner](architecture.png)

Infra und Deploys sind automatisiert mit **OpenTofu** (Server, Firewall, DNS) und **GitHub Actions** (Build, Deploy, kurze Smoke-Checks nach einem Release).

Sobald Prod stabil war, kam **self-hosted Observability** auf einer dedizierten VM dazu — Metriken, Logs, Traces, Kosten-Wächter und agentenfreundlicher Betrieb. Siehe [Teil 2](/hetzner-self-hosted-insights-de).

---

## Was wir gelernt haben (Kurzfassung)

- **Phasenweise schlägt Big Bang** — Dev blieb auf Netlify + managed Supabase, während Hetzner-Prod live ging.
- **Self-hosted Login ist kein Copy-Paste aus Cloud-Supabase** — Prod-OAuth und Magic Links brauchen prod-spezifische URLs und Config; Dev-Config bleibt getrennt.
- **Planbare Kosten und EU-Hosting** — VMs auf Hetzner für App, Login und Daten.

Prod ist live unter [universe.arc-rider.com](https://universe.arc-rider.com). Für diese Produktphase hat der Tradeoff gepasst: **Kontrolle dort, wo es zählt** — auf EU-Infrastruktur, auf die der Kunde verweisen kann.

---

## Hetzner-Migrationen — wie ich helfen kann

**Netlify**, **managed Supabase** oder **AWS** für Dev und **Prod in der EU auf Hetzner** nötig? Ich helfe bei Planung, OpenTofu, CI-Deploys, self-hosted Supabase auf Prod-VMs und **self-hosted Observability** (Grafana LGTM, Alloy, Kosten-Wächter, Grafana MCP für agentenfreundlichen Betrieb).

[office@martinmueller.dev](mailto:office@martinmueller.dev) · [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev) · [LinkedIn](https://www.linkedin.com/in/martinmueller88)

---

## Weiterführende Links

- [Hetzner: Object Storage als OpenTofu-Backend](https://community.hetzner.com/tutorials/howto-hcloud-s3-terraform-backend/)
- [Supabase Self-Hosting (Docker)](https://supabase.com/docs/guides/self-hosting/docker)
