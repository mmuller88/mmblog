# SEO / GEO strategy — DACH

**Domain:** martinmueller.dev
**SISTRIX pull:** 2026-09-21 (Google organic + AI Check). Written 2026-09-26.
**Markets:** DE primary. AT and CH use the same German URLs. No separate country sites.
**Offers:** freelance (AWS, SEO/GEO, ChatGPT Ads, Vibe Coding) + four trainings + the blog as the citation layer.

## Verdict

Organic search does not send traffic. The DE visibility index is **0.0001** (flat since July 2026; peak **0.0005** on 2024-04-01). AT and CH are **0**. Estimated organic clicks are **0**.

What ranks is the old Alfresco / CloudFormation archive, not the offers. AI citations of the domain are **0**. The four Google AI Overview hits for the brand “Martin Müller” are a **tax advisor on YouTube**, not this site.

Demand in DACH sits on informational head terms (OpenClaw, Vibe Coding, MCP). “AWS Freelancer” and “DevOps Freelancer” are ~10 searches/month. The path is German answer pages on winnable queries, each linking to one DE service page and one DE training. Do not try to outrank Wikipedia, AWS docs, IBM, or Fraunhofer on the head term.

## Baseline

| | DE | AT | CH |
| --- | ---: | ---: | ---: |
| Visibility index | 0.0001 | 0 | 0 |
| Organic keywords | 16 | 1 | 2 |
| Top 10 | 8 | — | 1 (`alfresco ocr`, pos 9) |
| Est. clicks | 0 | 0 | 0 |
| AI prompts citing the domain | 0 | 0 | 0 |

DE ranking spread (share of keywords that carry visibility): page 1 = 0%, page 2 = 20%, page 5 = 40%, pages 7 and 9 = 20% each. The eight top-10 keywords have no measurable search volume, so they do not move the index.

**DE keywords that exist today**

| Keyword | Pos | URL | Keep? |
| --- | ---: | --- | --- |
| chatstepindex | 5 | `/chatsindex/` | No |
| alfresco install amp | 6 | `/alfresco-docker-installer-eng/` | No. Alfresco paths are already sitemap-excluded |
| cfn aws | 8 | `/aws-deploy-cfn-with-lambda/` | Only as a CDK spoke |
| alfresco share amp example | 8 | same installer post | No |
| alfresco ocr | 9 | `/alf-ocr-eng/` | No |
| adf compositor | 9 | `/ADF-App/` | No |
| alfresco acs | 9 | `/alf-acs-aps-integration/` | No |
| github powertools | 9 | `/aws-powertools/` | Weak spoke only |
| trading 212 affiliate | 14 | `/trading212/` | No. Highest SISTRIX “opportunity” and irrelevant |
| martin mueller | 17 / 43 | `/resume-de/` and `/` | Fix the homepage, do not chase the name |
| aws lambda cloudformation | 19 | `/aws-deploy-cfn-with-lambda/` | Yes. Only commercial-adjacent near-win |
| serverless | 68 / 90 | `/serverless-eng/`, `/serverless/` | Ignore |

SISTRIX “competitors” (github.com, amazon.com, alfresco.com, wikipedia.org) are an artifact of that archive. They are not the firms you sell against.

`ai.topicresearch` returned **0 topics** for `vibe coding` and `openclaw`. No AI tracker project exists. GEO work below uses SERP feature flags (`AI_ANSWER`) and `ai.check`, not dialog mining.

Backlink pull failed (SISTRIX: link data updating). Re-pull `links` / `linktargets` before any outreach.

## Where the searches are

Volumes are SISTRIX monthly search volume. CPC is SISTRIX, DE. Competition is 0–100. Intent is SISTRIX know / do / website.

| Cluster | Keyword | DE | AT | CH | CPC | Comp | Intent | SERP owner |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| OpenClaw | openclaw | 22,400 | 6,900 | 10 | €3 | 52 | know | openclaw.ai, Wikipedia, GitHub, Contabo |
| OpenClaw | openclaw sicherheit | 70 | — | — | — | — | — | **no SERP snapshot** |
| OpenClaw | openclaw tutorial | 10 | — | — | — | — | — | — |
| Agents | ki agent | 1,350 | 100 | 90 | — | — | know | Wikipedia, IBM, Fraunhofer |
| Vibe Coding | vibe coding | 12,200 | 450 | 400 | €6 | 48 | know + AI Overview, News, Video | Wikipedia, Google Cloud, Fraunhofer, digitale-leute.de, vibecoding-germany.de |
| Vibe Coding | was ist vibe coding | 1,400 | 20 | — | — | — | know | Reddit, Wikipedia, Google, Fraunhofer, SAP, IBM |
| Vibe Coding | vibe coding schulung | 20 | — | — | — | — | — | — |
| MCP | mcp server | 6,400 | 600 | 500 | €9.20 | 40 | know, 81% desktop | Wikipedia, IBM tutorial, docs. A German blog (dasilium.de) is **#7** |
| GEO | geo optimierung | 1,150 | 30 | 20 | €9.70 | 41 | know, 82% desktop | Wikipedia GEO, then agencies. This SERP **is** generative engine optimization, not local SEO |
| GEO | generative engine optimization | 500 | — | — | — | — | — | Wikipedia, seo-kueche, Google, Semrush |
| GEO | technisches seo | 1,100 | — | — | €2.40 | 38 | know | Agency blogs |
| GEO | ki sichtbarkeit | 250 | — | — | €0 | 20 | — | — |
| GEO | answer engine optimization | 250 | — | — | — | — | — | — |
| ChatGPT Ads | chatgpt ads | 150 | 10 | 10 | €9.20 | **0** | — | onlinemarketing.de, openai.com, then agencies (traffic3, dlick, seowerk) |
| ChatGPT Ads | chatgpt werbung | 150 | — | — | — | — | — | — |
| ChatGPT Ads | chatgpt ads agentur | 100 | — | — | €0 | **0** | — | Agency homepages |
| AWS | aws cdk | 100 | — | — | — | — | know | AWS docs, GitHub. entwickler.de is #9 |
| AWS | aws schulung | 80 | — | — | €5.50 | 26 | — | Training vendors |
| AWS | aws beratung | 60 | — | — | €1.90 | 24 | — | **Wrong entity.** #1 is aws.at (Austria Wirtschaftsservice), not Amazon |
| AWS | aws cloud beratung | 10 | — | — | — | — | — | — |
| AWS | aws freelancer / devops freelancer | 10 / 10 | — | — | — | — | — | — |
| AWS | opennext | 90 | — | — | — | — | — | — |
| AWS | aws cdk vs cloudformation | 10 | — | — | — | — | — | — |
| Tooling | cursor ide | 1,000 | — | — | — | — | — | cursor.com. Do not target the head term |
| Hetzner | hetzner / hetzner cloud | 46,300 / 5,150 | — | — | — | — | **website** (hetzner cloud intent_website = 100) | Brand navigation. Do not target |
| Hetzner | dsgvo hosting | 10 | — | — | — | — | — | — |

`openclaw` DE SERP shows `AI_ANSWER` on 19 sampled SERPs. `vibe coding` shows `AI_ANSWER` plus News and Video. Those two are the GEO surface. `chatgpt ads` had no SERP-feature row.

## Do not do

- Target `aws beratung`. In DACH that query is the Austrian funding agency.
- Target `hetzner` or `hetzner cloud`. Navigational.
- Build GEO around the string “Martin Müller”. AI Overviews already attach it to a Steuerberater.
- Invest in Alfresco, Trading 212, or `organisierer` (typo on `/aws-ug/`).
- Write another “Was ist Vibe Coding” or “Was ist OpenClaw” against Wikipedia / Fraunhofer / IBM.
- Launch AT or CH domains. AT is material only for `openclaw` (6,900). One `de` URL with hreflang covers it.
- Buy links. Authority play is original numbers (campaigns, SISTRIX audits, production case studies) plus internal links.

## How the site should be shaped

German hubs (already live):

| Offer | URL | Training |
| --- | --- | --- |
| AWS / CDK | `/one-man-agency-de/aws/` | `/trainings-de/opennext-cdk-mvp/` |
| SEO / GEO | `/one-man-agency-de/seo-geo/` | — (no training; the deliverable is the audit) |
| ChatGPT Ads | `/one-man-agency-de/gpt/` | `/trainings-de/chatgpt-ads/` |
| Vibe Coding → Produktion | `/one-man-agency-de/vibe-coding/` | `/trainings-de/hetzner-eu-production/` and `/trainings-de/openclaw-personal-ai-os/` |
| Catalog | `/one-man-agency-de/`, `/trainings-de/` | — |

Every new or rewritten post gets **one** hub link and **one** training link in the first screen and again at the end. DE training pages already point at the DE posts. Keep it that way.

`show: "no"` does not noindex (sitemap has no `show` filter; homepage listings do). The commercial posts are crawlable and invisible on the homepage. Flip `show` to `yes` for the posts in the asset map below so the site itself points at the pages you want indexed.

DE landing titles to change (query language, not English product labels):

| Page | Title now | Title to ship |
| --- | --- | --- |
| `/one-man-agency-de/vibe-coding/` | Vibe Coding & DevOps — Production Readiness & Security | Vibe Coding in Produktion: Security, Deploy, EU-Hosting |
| `/one-man-agency-de/seo-geo/` | Technisches SEO für JavaScript- und SaaS-Seiten | Technisches SEO und GEO für JavaScript- und SaaS-Seiten |
| `/one-man-agency-de/aws/` | AWS Consulting — Architektur, CDK & Migration | AWS CDK Beratung: Architektur, Kosten, Migration |
| `/one-man-agency-de/gpt/` | ChatGPT Ads — Kampagnen, Tracking & Conversions | Keep. Already matches `chatgpt ads` |

Add `Person` + `Service` JSON-LD on the four DE landings. `name`: Martin Mueller. `url`: https://martinmueller.dev. `jobTitle`: AWS Community Builder. `sameAs`: LinkedIn. That is the disambiguation against the tax advisor.

## Asset map (posts that already exist)

| Post | Role | Gap |
| --- | --- | --- |
| `/chatgpt-ads-learnings-de/` | Primary for `chatgpt ads`, `chatgpt werbung`, `chatgpt ads agentur` | Diary title. FAQ exists. `show: no` |
| `/openclaw-de/`, `/openclaw-three-months-later-de/` | Proof for the training. Not the head-term page | Titles are first-person. No Sicherheit / DSGVO page. `show: no` on the first |
| `/sistrix-mcp-hallocasa-seo-de/` | Proof for SEO/GEO and the MCP cluster | Title is a case-study name, not `mcp server` or `geo optimierung`. `show: no` |
| `/opennext-cdk-de/` | CDK / training spoke | Fresh (2026-09-21), `show: no`, not aimed at `aws cdk` or `opennext` |
| `/hetzner-eu-production-de/`, `/hetzner-self-hosted-insights-de/`, `/lovable-hetzner-germany-de/` | Spokes under Vibe Coding, not a Hetzner head-term play | `show: no` |
| `/aws-deploy-cfn-with-lambda/` | Only live near-win (pos 19, DE) | English-leaning URL. Refresh, then link to the AWS hub and the OpenNext training |

## 90 days

### P0 — weeks 1–3 (pages that can rank on what you already wrote)

1. **ChatGPT Ads post.** Retitle to the query: `ChatGPT Ads in Deutschland: Setup, Tracking, erste Kampagne`. First 150 words answer “was sind ChatGPT Ads / was kosten sie / wann eine Agentur”. Keep the field notes as the proof. Add a Kosten section (what drives the quote: tracking, landings, spend). Links: `/one-man-agency-de/gpt/` and `/trainings-de/chatgpt-ads/`. Set `show: yes`. Competition on the head terms is 0; this is the only commercial query where a single page can reach page 1 without new authority.
2. **OpenClaw Sicherheit.** New German post, or a new H2-led URL if the existing posts should stay narrative. Target `openclaw sicherheit` (70, empty SERP) plus selbst hosten / DSGVO / VPS. Lead with the threat (keys, inbox, shell on a VPS) and what you actually locked down. Link `/trainings-de/openclaw-personal-ai-os/` and the Vibe Coding hub. Do not aim the title at `openclaw` (22k, official site + Wikipedia).
3. **Homepage + listings.** `show: yes` on the six posts in the asset map. Homepage and tag pages then pass internal links. Leave Alfresco on `show: no` and out of the sitemap.
4. **Schema + titles** on the four DE landings, as in the table above.
5. **Measurement.** SISTRIX Optimizer project for martinmueller.dev, country DE. AI tracker, model `aio` + `gpt`, country DE, these prompts:
   - Was ist OpenClaw und wie hostet man es sicher?
   - OpenClaw Sicherheit und DSGVO
   - Was ist Vibe Coding und wie bringt man es in Produktion?
   - ChatGPT Ads in Deutschland schalten
   - ChatGPT Ads Kosten
   - ChatGPT Ads Agentur
   - Generative Engine Optimization für SaaS
   - Technisches SEO JavaScript
   - MCP Server Beispiel
   - Next.js auf AWS mit CDK
   - AWS CDK Freelancer
   - EU Hosting Hetzner Produktion

### P1 — weeks 4–8 (the volume clusters, via a wedge)

6. **Vibe Coding → Produktion**, new German post. Not a definition. Angle the Fraunhofer / IBM pages do not own: prototype on Lovable or Cursor, then EU production (Hetzner or AWS), security, CI, who operates it. Internal links to the three Hetzner posts, `/one-man-agency-de/vibe-coding/`, and both the Hetzner and OpenClaw trainings. Head term `vibe coding` (12.2k, AI Overview) is the citation target; the ranking target is the production wedge.
7. **MCP Server post from the HalloCasa piece.** Retitle toward `MCP Server in der Praxis: SISTRIX-Daten in Cursor`. dasilium.de ranks #7 for `mcp server` (6.4k, CPC €9.20) with a technical intro. A worked example can sit on page 1–2. Link `/one-man-agency-de/seo-geo/`.
8. **GEO landing, not a glossary.** Expand `/one-man-agency-de/seo-geo/` with the HalloCasa numbers (visibility by country, what was broken in the JS site) and a FAQ that matches `geo optimierung` (1,150, CPC €9.70) and `ki sichtbarkeit` (250). State that GEO here means the same crawlable HTML as technical SEO. The Wikipedia definition page will stay #1; the commercial click goes to a page that shows a method and a fixed scope.

### P2 — weeks 9–12 (AWS and Hetzner as proof, not as head terms)

9. **Refresh** `/aws-deploy-cfn-with-lambda/` for `aws lambda cloudformation` (pos 19). Add a short “CDK statt CloudFormation” block and links to `/opennext-cdk-de/`, `/one-man-agency-de/aws/`, `/trainings-de/opennext-cdk-mvp/`. One new German post only if that refresh stalls: `AWS CDK Beispiel: Next.js ohne Fargate`, aimed at `opennext` (90) and `aws cdk` (100). Skip `aws beratung`.
10. **Hetzner cluster** stays as spokes under Vibe Coding. Cross-link the three DE posts to each other and to `/trainings-de/hetzner-eu-production/`. No page titled “Hetzner Cloud”.
11. **Re-pull** DE/AT/CH visibility, the 12 tracker prompts, and backlinks. Kill any P1 URL with no impressions.

## GEO rules (so the posts get cited)

Google AI Overviews are the only model in this dataset. They cited YouTube and publisher explainers, not personal sites, for the name collision. To be the cited source on `openclaw` and `vibe coding`:

- First paragraph answers the prompt in German, in plain sentences, before the story.
- One original artifact per page: a number from a campaign, a SISTRIX table, a production constraint, a cost comparison you measured.
- FAQ block (you already emit FAQ JSON-LD on some posts). Questions = the tracker prompts.
- One canonical German URL per topic. English sibling via existing `engUrl` / hreflang. `x-default` stays the English or the German page consistently per pair; do not let both rank for the German query.
- Say Martin Mueller and link the homepage. Do not optimize the exact string “Martin Müller”.

## Measure before writing

Three instruments. Each answers a different question. Do not use one as a proxy for another.

| Question | Instrument | Phase gate? |
| --- | --- | --- |
| Is the URL indexed, and did Google show it? | Google Search Console, country Germany, page + query | Yes. Leading indicator |
| Did the fixed keyword move? | SISTRIX Optimizer, Google DE, tagged keyword set | Yes. From week 3 |
| Did an AI answer cite the domain? | SISTRIX AI Tracker, separate prompt list | Only at week 12 |
| Did a person book? | Calendly + SES form mail | No. Broken for SEO today (below) |
| Did the visibility index rise? | `domain` visindex DE | No. Lagging sanity check at week 12 |

Repo has no analytics snippet and no Search Console verification meta. Optimizer API on 2026-09-26: **no project**. AI tracker: **no project**. Freeze the baseline in the Toolbox before the first title change. A one-off MCP pull is not a time series.

### Setup (once, before P0)

1. **Search Console.** Domain property `martinmueller.dev` (DNS TXT, covers apex and www). Country: Germany. Note the last 28 days of impressions and clicks for the URLs in the scorecard. Expect ~0. That number is week 0.
2. **SISTRIX Optimizer.** Create in the Toolbox (the MCP only reads projects). Country Google DE. Add the scorecard keywords. Tag `p0`, `p1`, `p2`. Weekly ranking history is the position source.
3. **SISTRIX AI Tracker.** Second project. Models `aio` and `gpt`, country DE. Prompts = the 12 lines under P0 step 5. Metric is cited yes/no, not a Google position. The old “8 of 12 in the top 20” line mixed these prompts with rankings. Drop that.
4. **Scorecard.** Copy `docs/dach-seo-geo-scorecard.md` into a sheet, or edit that file each Monday. Columns: date, keyword, URL, GSC impressions (28d, DE), GSC clicks, SISTRIX position (or `—`), AI cited (y/n).

### Cadence

Every Monday, 20 minutes. GSC page filter per URL. Optimizer rankings for the tagged set. AI tracker only on the week-8 and week-12 reviews. Do not re-pull the whole domain keyword list.

### Pass / fail

Dates assume start 2026-09-26.

| Gate | Date | Pass | Fail → do this |
| --- | --- | --- | --- |
| P0 | 2026-10-17 | ChatGPT Ads URL and OpenClaw Sicherheit URL are indexed. Each has GSC impressions > 0 in DE. SISTRIX position recorded for `chatgpt ads`, `chatgpt ads agentur`, `openclaw sicherheit` (a number or `—`) | Not indexed: fix canonical / sitemap / `noindex`, do not write P1. Indexed but 0 impressions: titles do not match the query; rewrite the H1 before new posts |
| P1 | 2026-11-21 | Vibe Coding post, MCP post, `/one-man-agency-de/seo-geo/` indexed. Impressions > 0 on each. Position better than week 0 on at least one of `mcp server`, `geo optimierung`, `ki sichtbarkeit` | A P1 URL with 0 impressions: stop adding sections. Change title + first paragraph, wait two weeks |
| P2 | 2026-12-19 | `aws lambda cloudformation` better than position 19. GSC clicks > 0 on the ChatGPT Ads URL. ≥1 AI tracker prompt cites martinmueller.dev. Visibility index still 0.0001 is allowed | Position 19 unchanged: the refresh failed; only then write the extra CDK post. 0 AI citations is a miss, not a reason to add more pages |

Visibility index and “estimated clicks” from SISTRIX stay in the week-12 note. They are too coarse to decide P0 or P1.

### Leads (do not use the current UTMs)

`buildCalendlyUrl()` in `src/utils/oaiq.js` stamps every agency booking `utm_source=chatgpt_ads`, including a click from a blog post. Training requests send no source. Agency forms only keep `utm_source` if it was already on the URL.

Until that changes, SEO success is indexation, impressions, position, and citations. A Calendly count will credit the ads pixel. After P0 titles ship, tag organic separately (`utm_source=organic`, `utm_medium=seo`, `utm_content=<slug>`) or the lead column stays empty on purpose.

### Week-0 baseline (SISTRIX 2026-09-21, Google DE)

| Tag | Keyword | URL | Position |
| --- | --- | --- | --- |
| p0 | chatgpt ads | `/chatgpt-ads-learnings-de/` | — |
| p0 | chatgpt werbung | same | — |
| p0 | chatgpt ads agentur | `/one-man-agency-de/gpt/` | — |
| p0 | openclaw sicherheit | new URL, not live | — |
| p1 | mcp server | `/sistrix-mcp-hallocasa-seo-de/` | — |
| p1 | geo optimierung | `/one-man-agency-de/seo-geo/` | — |
| p1 | ki sichtbarkeit | same | — |
| p1 | vibe coding | new production post, not live | — |
| p2 | aws lambda cloudformation | `/aws-deploy-cfn-with-lambda/` | 19 |
| p2 | aws cdk | `/opennext-cdk-de/` | — |
| p2 | opennext | same | — |
| — | martin mueller | `/` (also `/resume-de/` at 17) | 43 |

AI citations of the domain: 0 of 12. GSC impressions: not recorded yet. Fill that cell before the first edit.

## Order of writing

0. Search Console + Optimizer + AI tracker + week-0 row in `docs/dach-seo-geo-scorecard.md`
1. ChatGPT Ads retitle + Kosten + `show: yes`
2. OpenClaw Sicherheit
3. Landing titles + Person/Service schema
4. Vibe Coding in Produktion
5. MCP / GEO rewrite of the HalloCasa post and the SEO landing
6. CloudFormation near-win refresh
