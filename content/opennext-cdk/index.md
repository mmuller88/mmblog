---
title: "OpenNext + CDK: Next.js on AWS Without ECS Fargate"
show: "no"
date: "2026-08-22"
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
    "eng",
    "2026",
  ]
pruneLength: 50
---

I usually ship Next.js as Docker `standalone` on **ECS Fargate** — ALB, VPC, always-on tasks. For an MVP like [qr-plakat.de](https://qr-plakat.de) I went **OpenNext 4.x + AWS CDK** instead. Cheaper to run, faster to iterate. If the product works, I might switch to Fargate.

Three things made this feel better than the Fargate path. Deploys are **one GitHub Actions job** from lint to CloudFront invalidation. Infra is **CDK I already know** — no SST, no extra deploy product. And I can ship from **Telegram → OpenClaw → Cursor** while watching Netflix or training outside: a PR lands, Actions deploys, I check prod from the phone.

---

## The product

[qr-plakat.de](https://qr-plakat.de) is a DACH SaaS for posters with QR codes. You design in a wizard, overlay one to eight codes, and export 300 dpi PDF or JPG. Each poster gets hosted scan URLs like `qr-plakat.de/p/{slug}` that you can change without reprinting. Everything runs in **eu-central-1**.

Subscriptions are **mocked**. I am the only user, so there is no Stripe checkout. If someone wants a higher tier, they request it in the **support chat** and I set the plan by hand. Real billing comes when I convince the first business to use the product.

---

## Why OpenNext + CDK for an MVP

**OpenNext + CDK is the best choice for MVPs** — low cost, fast iteration. If the product works, I might switch to ECS Fargate.

Fargate wants a baseline of tasks, a VPC, and an ALB even when almost nobody is hitting the site. OpenNext maps the Next.js app to **pay-per-request Lambda**, with CloudFront and S3 in front. I still get App Router, RSC, and Server Actions. I do not run `next start` in a container.

I stayed on **CDK**, not SST. Explicit stacks, same IaC I already use. I tried SST's OpenNext path years ago in [this post](/sst-nextjs-s3-picture-uploader). DynamoDB, S3, and Cognito mean **no VPC** for the data plane.

The ECS Fargate path I used on [listings-mcp](/aws-mcp-listings) is the later-stage option: always-on, long jobs, when traffic and product-market fit justify it.

---

## Stack

The app is Next.js 16 App Router, React 19, shadcn, and Tailwind 4. [`@opennextjs/aws`](https://github.com/opennextjs/opennextjs-aws) builds it for Lambda on ARM64 — 2048 MB, 60 second timeout — plus CloudFront and S3.

CDK splits the account into stacks: Data, Auth, Web, Observability, and a Cicd stack for GitHub OIDC. The Web stack uses [cdk-opennext](https://github.com/berenddeboer/cdk-opennext) `NextjsSite`. Auth is two Cognito pools (creators and admins). Data is an ElectroDB single-table. DNS is Route 53 on `qr-plakat.de`.

---

## GitHub Actions — the part I love

One job. No artifact hop between build and deploy. The runner lints, typechecks, and tests, then runs `next build`, `open-next build`, and `cdk synth`. After that it assumes an IAM role with OIDC, runs `cdk deploy --all`, and invalidates CloudFront `/*`.

PRs to `main` ship prod. That is intentional. Dependabot runs CI only.

That loop is why Telegram shipping works. The agent opens a PR, Actions deploys, I hit the live site from the phone.

---

## Agentic loop

I already wrote about [OpenClaw](/openclaw-eng) and [what shipped after three months](/openclaw-three-months-later). On this project the loop is the same, just pointed at qr-plakat.

I send a voice note or a short text on Telegram while watching Netflix or training outside. OpenClaw on the VPS hands the work to Cursor in the real repo. Cursor does a `git pull`, reads [AGENTS.md](https://github.com/mmuller88/qr-plakat) and `docs/`, implements the change, and opens a PR. Product decisions stay in `docs/` and ADRs — not buried in chat.

---

## MCPs I actually used

Cursor talked to a small set of MCPs on this repo. **shadcn** for component discovery and install. **aws-knowledge-mcp** for AWS docs while writing CDK. **playwright** for browser checks. **firecrawl** when I needed to scrape or research a page. **sistrix** for DACH SEO. **pdf-reader** for print and export PDFs.

---

## Skills that helped

The useful skills were the ones I already had: `aws-cdk-development` and `aws-serverless` for infra, `vercel-react-best-practices`, `shadcn-ui`, and `tailwind-patterns` for the app, `ci-cd-pipeline-builder` for Actions, `seo-audit` and `seo-meta` for the landing pages, plus `playwright-cli`, `diagnosing-bugs`, and `code-review`.

There is no OpenNext-specific skill. CDK and serverless skills were enough.

---

## Would I do it again

For an MVP: **OpenNext + CDK + one Actions job + Telegram agents**. Cheap to run, fast to ship. If qr-plakat takes off, I might move the Next.js app to ECS Fargate. Until then, stay serverless.

Live: [qr-plakat.de](https://qr-plakat.de).

[office@martinmueller.dev](mailto:office@martinmueller.dev) · [calendly.com/martinmueller_dev](https://calendly.com/martinmueller_dev) · [LinkedIn](https://www.linkedin.com/in/martinmueller88)

---

## Further reading

- [OpenClaw](/openclaw-eng)
- [OpenClaw, three months later](/openclaw-three-months-later)
- [Next.js on ECS Fargate + CDK](/aws-mcp-listings)
- [SST Next.js + OpenNext](/sst-nextjs-s3-picture-uploader)
- [OpenNext AWS](https://github.com/opennextjs/opennextjs-aws)
- [cdk-opennext](https://github.com/berenddeboer/cdk-opennext)
