# AGENTS.md - AI Assistant Guide

Personal tech blog by Martin Mueller. Gatsby 5 + React 18 + Tailwind CSS. Hosted on AWS (CDK) in account `981237193288` / `us-east-1`. Built and deployed by GitHub Actions.

**Site:** https://martinmueller.dev

## Quick Commands

```bash
npm run dev             # local dev server (localhost:8000)
npm run build           # generate-audio (skip if no GCP creds) + gatsby build
npm run generate-audio  # Google Cloud TTS → content/**/audio.mp3 (opt-in posts)
npm run serve           # serve production build
npm run format          # prettier formatting
npm --prefix infra run synth   # CDK synth
npm --prefix infra run deploy  # CDK deploy (needs AWS creds)
```

## Architecture

```
content/           # Blog posts (markdown + images per folder)
src/
├── components/    # React components (Layout, Header, Metatags, etc.)
├── pages/         # Static pages (index, tags, 404)
├── templates/     # Dynamic page templates (blog-post, tag-template)
├── utils/         # Utilities (seo.js)
└── images/        # Static images
infra/             # AWS CDK (TypeScript) + Lambda (TypeScript)
gatsby-config.js   # Plugins, site metadata, RSS feeds
gatsby-node.js     # Page creation, GraphQL schema
```

## Content Structure

Posts live in `content/{slug}/index.md` with frontmatter:

```yaml
---
title: "Post Title"
show: "yes"           # "no" to hide from listings
date: "YYYY-MM-DD"
image: "image.png"    # relative path, in same folder
tags: ["aws", "eng"]  # "eng" for English, "de" for German
engUrl: /path         # optional: link to English version
gerUrl: /path         # optional: link to German version
showContact: "no"     # optional: hide contact form
pruneLength: 50       # optional: excerpt length
audio: "audio.mp3"    # optional: show player; MP3 generated in CI (gitignored)
---
```

**Audio:** `audio: "audio.mp3"` + GH secret `GOOGLE_TTS_CREDENTIALS` (base64 service account JSON) or `GOOGLE_APPLICATION_CREDENTIALS`. Voices: `en-US-Neural2-D` (eng), `de-DE-Neural2-B` (de). `npm run generate-audio -- --force` to regenerate.

**Key tags:**
- `eng` - English posts (included in /rss.xml)
- `de` - German posts (included in /rss-ger.xml)
- `nofeed` - exclude from RSS

## Styling

Use Tailwind CSS classes. **Never use inline styles or CSS/SCSS.**

Brand colors defined in `tailwind.config.js`:
- `brand` (#06aced), `brand-dark`, `brand-light`

## Key Files

| File | Purpose |
|------|---------|
| `gatsby-config.js` | Site metadata, plugins, RSS feed config |
| `gatsby-node.js` | Creates pages from markdown, defines GraphQL schema |
| `src/templates/blog-post.js` | Blog post template with SEO, breadcrumbs, sharing |
| `src/components/Metatags.js` | SEO meta tags, Open Graph, JSON-LD structured data |
| `src/utils/seo.js` | SEO utilities (keywords, reading time, structured data) |
| `src/pages/index.js` | Homepage with post listings |
| `infra/lib/mmblog-stack.ts` | S3, CloudFront, HTTP API, SES, EventBridge, OIDC role |

## GraphQL Queries

Posts are queried via `allMarkdownRemark`. Key fields:
- `frontmatter`: title, date, tags, image, show, engUrl, gerUrl
- `fields.slug`: URL path (auto-generated from folder name)
- `excerpt`, `html`: content

## Adding a New Post

1. Create folder: `content/my-post/`
2. Add `index.md` with frontmatter
3. Add images to same folder (reference as `image.png`)
4. Tag with `eng` or `de` for language

## ChatGPT Ads conversion tracking

OpenAI pixel on agency pages (`src/utils/oaiq.js`, `OaiqPixel.js`).

- `page_viewed` on load; `lead_created` on agency contact form submit only
- `appointment_scheduled` via Calendly popup `event_scheduled` (pixel, has oppref) and webhook → CAPI (not on link click)
- Calendly links append `utm_source=chatgpt_ads&utm_medium=cpc&utm_content=<oppref>`; `oppref` from `?oppref=` URL param → sessionStorage

**Intent landings (DE ads):**
- `/one-man-agency-de/aws/` — AWS Services ad group
- `/one-man-agency-de/seo-geo/` — SEO/GEO
- `/one-man-agency-de/gpt/` — ChatGPT Ads
- `/one-man-agency-de/vibe-coding/` — Vibe Coding/DevOps

**AWS Secrets Manager JSON (put after first CDK deploy):** `OPENAI_ADS_CAPI_KEY`, `CALENDLY_WEBHOOK_SIGNING_KEY`, optional `CONVERSION_HEALTH_ALERT_URL`

After deploy: `CALENDLY_PAT=… CALENDLY_WEBHOOK_SIGNING_KEY=… ./scripts/setup-calendly-webhook.sh`

**Daily health check:** EventBridge `cron(0 7 * * ? *)` UTC → `infra/lambda/conversion-health.ts`. Signed synthetic `invitee.created` with `healthcheck-*` invitee id → webhook uses CAPI `validate_only: true`. Manual: `npm run test:conversion-health` (needs AWS creds + secret values). Failure email via SES to `office+netlify@martinmueller.dev`. Optional `CONVERSION_HEALTH_ALERT_URL` webhook (Slack/ntfy).

**Ads Manager:** primary conversion = `appointment_scheduled` only; switch to Maximize Conversions after verified bookings.

## Courses (Phase 0)

- Catalog: `/courses`, `/courses-de`
- Detail: `/courses/:slug`, `/courses-de/:slug` — data in `src/data/coursesContent.js`
- Waitlist form → `GATSBY_COURSES_API_URL` (AWS API Gateway, GH secret)
- Issue: https://github.com/mmuller88/mmblog/issues/65

## Deployment

- GitHub Actions `.github/workflows/deploy.yml` on push to `master` (OIDC → `AWS_DEPLOY_ROLE_ARN`)
- CDK stack `MmblogStack` in `981237193288` / `us-east-1`: CloudFront+S3, `/api/*` HTTP API, SES, EventBridge
- Site build: `npm run build` then `scripts/sync-site.sh`
- Forms POST `/api/forms` (SES to `office@martinmueller.dev`)
- Likes: DynamoDB via `GET|POST /api/likes`
- DNS: Route53 zone already in this account. First deploy uses `manageDns=false`. Cutover: delete Netlify apex/www records, `cdk deploy -c manageDns=true`

**First-time (laptop):**

```bash
unset AWS_*
source aws_access_keys.sh
cd infra
npx cdk bootstrap aws://981237193288/us-east-1
./scripts/ensure-github-oidc.sh
npx cdk deploy
# put JSON into SecretsArn output
# GH var AWS_DEPLOY_ROLE_ARN = DeployRoleArn output
# GH secrets: GOOGLE_TTS_CREDENTIALS, GATSBY_COURSES_API_URL
# verify SES (sandbox: verify office@ or request production)
```

**Cutover:** freeze Netlify auto-deploy → deploy this stack to CloudFront → flip apex/www to CF (`manageDns=true`) → keep a single Calendly webhook URL `https://martinmueller.dev/api/calendly-webhook`.

## Common Patterns

**Image in post:**
```markdown
![Alt text](image.png)
```

**Bilingual posts:** Create two folders (e.g., `my-post/` and `my-post-eng/`), link via `engUrl`/`gerUrl` frontmatter.

**Hide post:** Set `show: "no"` in frontmatter.

## Constraints

- Don't use inline styles - use Tailwind classes
- Don't do git checkout
- Be extremely concise in commits/communication
- CDK/Lambda: TypeScript. CloudFront Function stays JS (runtime limit)
