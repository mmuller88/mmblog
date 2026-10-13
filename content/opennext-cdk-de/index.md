---
title: "OpenNext + CDK: Next.js auf AWS ohne ECS Fargate"
description: "Next.js-MVP auf AWS mit OpenNext und CDK statt ECS Fargate: ein GitHub-Actions-Deploy, geringere Kosten als ein always-on Cluster."
show: "no"
date: "2026-09-21"
image: "index.png"
audio: "audio.mp3"
audioTiming: "audio-timing.json"
tags:
  [
    "opennext",
    "cdk",
    "nextjs",
    "aws",
    "lambda",
    "github-actions",
    "openclaw",
    "de",
    "2026",
  ]
engUrl: https://martinmueller.dev/opennext-cdk
pruneLength: 50
---

Normalerweise shipe ich Next.js als Docker-`standalone` auf **ECS Fargate** — ALB, VPC, always-on Tasks. Für ein MVP wie [qr-plakat.de](https://qr-plakat.de) bin ich stattdessen **OpenNext 4.x + AWS CDK** gegangen. Günstiger im Betrieb, schneller zu iterieren. Wenn das Produkt funktioniert, wechsle ich vielleicht zu Fargate.

Drei Dinge fühlten sich besser an als der Fargate-Weg. Deploys sind **ein GitHub-Actions-Job** von Lint bis CloudFront-Invalidierung. Infra ist **CDK, das ich schon kenne** — explizite Stacks, kein extra Deploy-Produkt. Und ich kann aus **Telegram → OpenClaw → Cursor** shippen, während ich Netflix schaue oder draußen trainiere: PR landet, Actions deployed, ich checke Prod vom Handy.

---

## Das Produkt: qr-plakat.de

[qr-plakat.de](https://qr-plakat.de) ist ein DACH-SaaS für Plakate mit QR-Codes. Im Wizard designen, ein bis acht Codes overlayen, 300-dpi-PDF oder JPG exportieren. Jedes Plakat bekommt gehostete Scan-URLs wie `qr-plakat.de/p/{slug}`, die du ohne Neudruck ändern kannst. Alles läuft in **eu-central-1**.

Das erste echte Plakat ist das Brasil-Schaufensterplakat — acht Produkte, acht QR-Codes, druckfertig aus dem Editor.

[![Brasil QR-Plakat](brasil-plakat.jpg)](https://qr-plakat.de/#galerie)

Abos sind **gemockt**. Ich bin der einzige User, kein Stripe-Checkout. Will jemand ein höheres Tier, fragt er im **Support-Chat** an und ich setze den Plan manuell. Echtes Billing kommt, wenn ich das erste Business überzeuge.

---

## Warum OpenNext + CDK für ein MVP

**OpenNext + CDK ist die beste Wahl für MVPs** — niedrige Kosten, schnelle Iteration. Wenn das Produkt funktioniert, wechsle ich vielleicht zu ECS Fargate.

Fargate will Baseline-Tasks, VPC und ALB — auch wenn fast niemand die Site trifft. OpenNext mappt die Next.js-App auf **pay-per-request Lambda**, mit CloudFront und S3 davor. App Router, RSC und Server Actions bleiben. Kein `next start` im Container.

Ich bin bei **CDK** geblieben — explizite Stacks, dieselbe IaC, die ich sonst nutze. DynamoDB, S3 und Cognito heißen **kein VPC** für die Data Plane.

Der ECS-Fargate-Weg von [listings-mcp](/aws-mcp-listings) ist die spätere Stufe: always-on, lange Jobs, wenn Traffic und Product-Market-Fit es rechtfertigen.

---

## Stack

<table class="stack-table">
<thead>
<tr><th>Layer</th><th>Tools</th></tr>
</thead>
<tbody>
<tr><th>Frontend</th><td><span class="tool-item"><img class="tool-logo-on-dark" src="/opennext-cdk/icons/nextjs.svg" alt="" /> <a href="https://nextjs.org">Next.js</a> 16</span> App Router · <span class="tool-item"><img src="/opennext-cdk/icons/react.svg" alt="" /> <a href="https://react.dev">React</a> 19</span> · <span class="tool-item"><img class="tool-logo-on-dark" src="/opennext-cdk/icons/shadcnui.svg" alt="" /> <a href="https://ui.shadcn.com">shadcn/ui</a></span> · <span class="tool-item"><img src="/opennext-cdk/icons/tailwindcss.svg" alt="" /> <a href="https://tailwindcss.com">Tailwind</a> 4</span></td></tr>
<tr><th>Hosting</th><td><span class="tool-item"><img class="tool-logo-on-dark" src="/opennext-cdk/icons/opennext.png" alt="" /> <a href="https://github.com/opennextjs/opennextjs-aws"><code>@opennextjs/aws</code></a></span> → <span class="tool-item"><img src="/opennext-cdk/icons/lambda.svg" alt="" /> <a href="https://aws.amazon.com/lambda/">Lambda</a></span> ARM64 (2048 MB, 60s) · <span class="tool-item"><img src="/opennext-cdk/icons/cloudfront.svg" alt="" /> <a href="https://aws.amazon.com/cloudfront/">CloudFront</a></span> · <span class="tool-item"><img src="/opennext-cdk/icons/s3.svg" alt="" /> <a href="https://aws.amazon.com/s3/">S3</a></span></td></tr>
<tr><th>IaC</th><td><span class="tool-item"><img src="/opennext-cdk/icons/cdk.svg" alt="" /> <a href="https://aws.amazon.com/cdk/">AWS CDK</a></span> Stacks: Data → Auth → Web → Observability (+ CI/CD OIDC) · <span class="tool-item"><img src="/opennext-cdk/icons/cdk.svg" alt="" /> <a href="https://github.com/berenddeboer/cdk-opennext">cdk-opennext</a></span> <code>NextjsSite</code></td></tr>
<tr><th>Auth</th><td><span class="tool-item"><img src="/opennext-cdk/icons/cognito.svg" alt="" /> <a href="https://aws.amazon.com/cognito/">Cognito</a></span> ×2 (Creators / Admins)</td></tr>
<tr><th>Data</th><td><span class="tool-item"><img src="/opennext-cdk/icons/dynamodb.svg" alt="" /> <a href="https://electrodb.dev">ElectroDB</a></span> auf DynamoDB Single-Table</td></tr>
<tr><th>DNS</th><td><span class="tool-item"><img src="/opennext-cdk/icons/route53.svg" alt="" /> <a href="https://aws.amazon.com/route53/">Route 53</a></span> <code>qr-plakat.de</code></td></tr>
</tbody>
</table>

---

## GitHub Actions — der Teil, den ich liebe

Ein Job. Kein Artifact-Hop zwischen Build und Deploy. Der Runner lintet, typecheckt und testet, dann `next build`, `open-next build`, `cdk synth`. Danach IAM-Rolle per OIDC, `cdk deploy --all`, CloudFront `/*` invalidieren.

PRs auf `main` shippen Prod. Absichtlich. Dependabot nur CI.

Deshalb funktioniert Telegram-Shipping: Agent öffnet PR, Actions deployed, ich checke live vom Handy.

---

## Agentischer Loop

Über [OpenClaw](/openclaw-de) und [drei Monate später](/openclaw-three-months-later-de) habe ich schon geschrieben. Auf diesem Projekt derselbe Loop, nur auf qr-plakat gerichtet.

Voice oder kurzer Text auf Telegram — Netflix oder Training draußen. OpenClaw auf dem VPS gibt an Cursor im echten Repo. Cursor macht `git pull`, liest [AGENTS.md](https://github.com/mmuller88/qr-plakat) und `docs/`, implementiert, öffnet PR. Produktentscheidungen in `docs/` und ADRs — nicht im Chat vergraben.

---

## MCPs, die ich wirklich genutzt habe

Cursor mit wenigen MCPs auf dem Repo. **shadcn** für Komponenten. **aws-knowledge-mcp** für AWS-Docs beim CDK-Schreiben. **playwright** für Browser-Checks. **firecrawl** zum Scrapen/Recherchieren. **sistrix** für DACH-SEO. **pdf-reader** für Print- und Export-PDFs.

---

## Skills, die geholfen haben

Die nützlichen Skills hatte ich schon: `aws-cdk-development` und `aws-serverless` für Infra, `vercel-react-best-practices`, `shadcn-ui`, `tailwind-patterns` für die App, `ci-cd-pipeline-builder` für Actions, `seo-audit` und `seo-meta` für Landing Pages, plus `playwright-cli`, `diagnosing-bugs`, `code-review`.

Kein OpenNext-spezifischer Skill. CDK- und Serverless-Skills reichten.

---

## Würde ich es wieder machen

Für ein MVP: **OpenNext + CDK + ein Actions-Job + Telegram-Agents**. Günstig, schnell shippen. Wenn qr-plakat durchstartet, vielleicht Next.js auf ECS Fargate. Bis dahin serverless.

Live: [qr-plakat.de](https://qr-plakat.de).

[office@martinmueller.dev](mailto:office@martinmueller.dev) · [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev) · [LinkedIn](https://www.linkedin.com/in/martinmueller88)

---

## Weiterlesen

- [OpenClaw](/openclaw-de)
- [OpenClaw, drei Monate später](/openclaw-three-months-later-de)
- [Next.js auf ECS Fargate + CDK](/aws-mcp-listings)
- [OpenNext AWS](https://github.com/opennextjs/opennextjs-aws)
- [cdk-opennext](https://github.com/berenddeboer/cdk-opennext)

---

## Kurs: Next.js-MVP auf OpenNext + CDK

Dieser Post ist der Walkthrough. Der Kurs ist der Build — derselbe Weg wie [qr-plakat.de](https://qr-plakat.de).

Du shippst ein Next.js-SaaS auf **OpenNext 4.x + CDK**: Lambda und CloudFront, kein Fargate. CDK-Stacks für Data, Auth, Web und CI/CD. DynamoDB Single-Table mit ElectroDB. Cognito mit eigenem Login-UI. Ein GitHub-Actions-Job von Lint bis CloudFront-Invalidierung, Route 53, **eu-central-1**.

**[Next.js MVP: OpenNext + CDK](/trainings-de/opennext-cdk-mvp/)** — dreitägiges Team-Training, vor Ort oder remote, Preis auf Anfrage.
