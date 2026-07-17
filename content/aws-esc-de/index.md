---
title: "NIS2 & souveräne Cloud: Wann reicht eu-central-1 — und wann braucht ihr AWS ESC?"
show: "no"
date: "2026-07-17"
image: "index.png"
tags:
  [
    "aws",
    "esc",
    "nis2",
    "dora",
    "compliance",
    "cdk",
    "sovereign-cloud",
    "de",
    "2026",
  ]
engUrl: https://martinmueller.dev/aws-esc
pruneLength: 50
faq:
  - q: "Was ist die AWS European Sovereign Cloud (ESC)?"
    a: "Eine physisch isolierte AWS-Infrastruktur in der EU mit eigener Partition (aws-eusc), EU-resident Operations und europäischer Governance. Region z. B. eusc-de-east-1 in Brandenburg. GA seit Januar 2026 — nicht identisch mit eu-central-1."
  - q: "Reicht eu-central-1 für NIS2 oder DORA?"
    a: "Oft ja — für viele Workloads genügt eine EU-Region plus BSI C5, Verschlüsselung und saubere Vertragslage. ESC wird relevant, wenn Datenklassifikation, KRITIS-Druck oder Auftraggeber explizit eine souveräne Partition verlangen."
  - q: "Was ändert sich technisch gegenüber Standard-AWS?"
    a: "Eigene Partition: separate IAM-Identitäten, Billing, Route53-Zonen, ARN-Formate. CDK/Terraform-Stacks müssen Region und Partition anpassen. Bei GA ~90 Services — nicht alles aus eu-central-1 ist sofort verfügbar."
  - q: "Schützt ESC vor dem US CLOUD Act?"
    a: "Teilweise — physisch isolierte EU-Infra und EU-Betrieb reduzieren bestimmte Zugriffsrisiken. ESC ist kein Allheilmittel: rechtliche Bewertung (Verträge, Datenklassifikation, Prozess) bleibt nötig. Ehrliche Einordnung statt Marketing."
  - q: "Für wen lohnt sich ein ESC Readiness Assessment?"
    a: "Regulierte Branchen (Energie/KRITIS, Gesundheit, Finance, Öffentlich), die schon AWS nutzen oder planen und unter NIS2, DORA, §393 SGB V oder C5-Druck stehen. 45 Minuten Decision Framework — kein Vendor-Slide-Deck."
---

Die **AWS European Sovereign Cloud (ESC)** ist seit **Januar 2026** allgemein verfügbar. Gleichzeitig laufen **NIS2-Umsetzungen**, **BSI C5:2026** und bei Kliniken **§393 SGB V** — viele Teams fragen mich dieselbe Frage:

> Reicht **eu-central-1**, oder müssen wir in die **souveräne Partition**?

Dieser Post ist ein **Builder-Guide** — keine AWS-Werbung. Ich arbeite als AWS Community Builder an ESC-Migrationen (CDK/Terraform), NIS2/DORA-Mappings und Readiness-Checks für regulierte Workloads in DACH. Wenn du Compliance-Scans brauchst, siehe auch [ai-secure.dev](https://ai-secure.dev) — dort mappe ich Frameworks wie ISO 27001, NIST, SOC2 und COBIT auf Cloud-Architektur.

---

## Warum jetzt?

- **ESC GA** — Budgets und Projekte sind planbar, nicht mehr „irgendwann“
- **Region** `eusc-de-east-1` (Brandenburg) — politisch und technisch relevant für DACH
- **Referenzkunden** (öffentlich): SCHUFA, ITZBund, SAP, EWE, Swiss Life
- **Regulatorik:** NIS2, DORA, GDPR, EU AI Act, BSI C5 — Souveränität ist Einkaufskriterium, nicht nur Security-Feature

Wenig **deutschsprachiger Builder-Content** — die meisten Slides verkaufen, statt zu erklären was bei Migration bricht.

---

## Was ESC wirklich ist

Kurz und sachlich:

| Aspekt | Standard AWS (eu-central-1) | AWS ESC (aws-eusc) |
| ------ | --------------------------- | ------------------- |
| Partition | `aws` | `aws-eusc` |
| Physische Isolation | EU-Region | Dedizierte EU-Infra, eigene Partition |
| Operations | Global AWS Ops | EU-resident, europäische Governance |
| Service-Umfang | Voll | ~90 Services bei GA — wächst |
| Typischer Käufer | Die meisten Workloads | Regulierte Daten, KRITIS, öffentlicher Sektor |

ESC ist **kein Ersatz** für sauberes Cloud-Design in eu-central-1. Es ist eine **Option**, wenn Datenklassifikation oder Auftraggeber eine souveräne Partition verlangen.

---

## Decision Framework: drei Buckets

**Entscheidend ist Datenklassifikation zuerst** — nicht Anbieterwahl zuerst.

### Bucket 1 — eu-central-1 + C5 reicht

- Viele SaaS- und interne Workloads ohne explizite Souveränitäts-Klausel
- BSI C5, Verschlüsselung, Logging, IAM-Härtung — Standard-Compliance-Stack
- **Nicht jeder** mit NIS2-Pflicht braucht ESC

### Bucket 2 — ESC für definierte Workloads

- Hochsensible oder politisch exponierte Daten (Gesundheit, Kredit, Bundes-IT)
- Auftraggeber verlangt **souveräne Partition** oder „kein Zugriff Drittstaaten“
- Hybrid: Kern-Workloads auf ESC, Rest auf eu-central-1

### Bucket 3 — Full sovereign stack

- Wenn ESC allein rechtlich oder politisch nicht genügt
- Kombination mit On-Prem, BRZ-PaaS (AT), oder dediziertem Hosting
- Architektur-Entscheidung — kein Default

In der Praxis landen die meisten Organisationen in **Bucket 1 oder 2**, nicht in einem Big-Bang-Vollzug.

---

## Was sich für Builder ändert

Marketing verschweigt oft die **operativen** Unterschiede:

**Partition & Identität**

- Eigene IAM-Identitäten — keine 1:1-Übernahme aus `aws`
- ARN-Formate und Account-Struktur anders denken (Landing Zone neu)

**DNS & Netzwerk**

- Route53-Verhalten und Zonen — häufiger Stolperstein bei Migration
- Cross-Partition-Referenzen planen (oder vermeiden)

**IaC / CDK**

- Region `eusc-de-east-1`, Partition `aws-eusc` in Stacks und Pipelines
- Hardcodierte ARNs aus eu-central-1 brechen
- CI/CD: separate Credentials, ggf. separate Pipelines pro Partition

**Service-Verfügbarkeit**

- Serverless-Stack (Lambda, DynamoDB, API Gateway, …) bei GA — aber prüfen vor Design
- „In eu-central-1 gibt es das“ ≠ „in ESC verfügbar“

Typische Migration: **Readiness → Landing Zone → Pilot-Workload → schrittweise Verschiebung**, nicht alles auf einmal.

---

## Branchen, wo ich ESC-Anfragen sehe

**Energie / Stadtwerke (KRITIS, NIS2)**

- Smart Meter, SCADA-adjacent Cloud, Lieferkettendruck auf IT-Dienstleister
- Frage: welche Systeme sind **essential entities** vs. unterstützend?

**Gesundheit (C5, §393 SGB V)**

- Klinik-Cloud, Telemedizin, Forschungsdaten
- C5 Typ 2 + NIS2-Lieferkette — oft Diskussion eu-central-1 vs. ESC pro Workload

**Finance (DORA)**

- Versicherungen, Fonds, Zahlungsnahe Systeme
- DORA-Resilienz + Datenresidenz — ESC als Option neben bestehendem AWS-Einsatz

**Öffentlicher Sektor**

- EVB-IT Cloud, C5, „souveräne Cloud“ in Ausschreibungen
- Selten steht „AWS ESC“ im Text — aber **C5 + EU-Residenz + kein Drittstaatenzugriff** mappt darauf

---

## ESC vs. EU-Hosting auf Hetzner (Abgrenzung)

Ich habe [Prod auf Hetzner für EU-Kunden](/hetzner-eu-production-de) beschrieben — **Arc Rider Universe** läuft dort mit klarer Datenhoheit auf EU-VMs.

| | Hetzner / Self-hosted EU | AWS ESC |
| - | ------------------------ | ------- |
| Zielgruppe | SaaS, volle Stack-Kontrolle | Bestehende AWS-Shops |
| Souveränität | Du betreibst VMs | AWS-native souveräne Partition |
| Ops-Last | Höher (Patching, DB, Login) | Niedriger (managed Services) |
| Typischer Pfad | Neues Produkt, EU-Prod-Anforderung | Migration regulierter AWS-Workloads |

Beides kann **parallel** relevant sein — Hybrid ist normal.

---

## CLOUD Act — ehrlich

ESC adressiert **Infrastruktur- und Betriebs-Souveränität** in der EU. Sie ersetzt **keine** juristische Gesamtbewertung:

- Verträge, Unterauftragnehmer, Support-Zugriffe
- Welche Daten dürfen wo liegen — Klassifikation vor Technik
- Was Auditoren und Aufsicht **tatsächlich** akzeptieren

Ich rate: Technik und Recht/Compliance gemeinsam betrachten — nicht nur Sales-Folien.

---

## Nächster Schritt: ESC Readiness Assessment

Wenn ihr unter NIS2, DORA oder C5-Druck steht und AWS (oder ESC) evaluiert:

**45 Minuten, kein Pitch** — wir klären:

1. Welcher **Bucket** (1/2/3) für eure Workloads
2. **CDK/Terraform-Stolpersteine** (IAM, Route53, Partition)
3. Realistischer **Migrations-Fahrplan** (Pilot → Rollout)

Ich halte einen Talk zu dem Thema auf dem **AWS Community Day DACH 2026** (Berlin, 15. Sep.) — *AWS European Sovereign Cloud: A Builder's Guide*.

**Kontakt:** [office@martinmueller.dev](mailto:office@martinmueller.dev) · [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev) · [LinkedIn](https://www.linkedin.com/in/martinmueller88)

Betreffzeile reicht: *ESC Readiness*.

---

## Weiterführend

- [AWS European Sovereign Cloud](https://aws.eu/en/products/european-sovereign-cloud/) (offiziell)
- [ai-secure.dev](https://ai-secure.dev) — KI-gestützte Compliance-Audits (ISO 27001, NIST, SOC2, COBIT)
- [Produktion auf Hetzner (EU)](/hetzner-eu-production-de) — wenn ESC nicht der erste Schritt ist
