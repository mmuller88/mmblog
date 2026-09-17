---
title: "ChatGPT Ads, Two Weeks In: What I Learned Running My First Campaign"
show: "no"
date: "2026-09-16"
image: "index.png"
audio: "audio.mp3"
audioTiming: "audio-timing.json"
tags: ["eng", "2026", "chatgpt", "ads", "openai", "marketing", "growth"]
pruneLength: 50
---

ChatGPT Ads rolled out in Europe in **August 2026**. I signed up the same week — not because I had a perfect media plan, but because new ad surfaces are rare and I wanted to learn by spending real money.

This is my **first ads experience ever**. I expected to feel skeptical. Instead I **totally love it** — seeing your own sponsored card inside a real ChatGPT thread is oddly addictive, and the tooling makes iteration feel closer to shipping software than buying media.

Two weeks later I had a **live sponsored placement for [martinmueller.dev](https://martinmueller.dev)** inside an actual conversation. I showed it on stage at AWS Community Day DACH. This post is what I would tell a friend who asks: *"Should I try ChatGPT Ads?"*

I am early. I am not an ads expert. These are field notes.

---

## What ChatGPT Ads actually are

Forget search results pages. ChatGPT Ads are **sponsored cards below the assistant's answer**, matched to the **conversation context** — what the user asked, what the model replied, what topic thread they are in.

| Familiar channel | ChatGPT Ads |
| ---------------- | ----------- |
| Google Search | User typed a query; ad matches keywords |
| Meta feed | Ad matches interests + behaviour |
| **ChatGPT** | Ad matches **the live chat** — intent inside a dialogue |

That feels different in practice. When I finally saw my own ad appear under a relevant answer, it did not feel like a banner interrupting a page. It felt like a footnote the model might have suggested anyway — except it was labelled *Sponsored* and pointed at my site.

OpenAI's Ads Manager (available in Europe now) looks familiar: campaigns, budgets, bidding. The **inventory and review process** still feel first-generation — closer to early Facebook than polished Google.

---

## My campaign: martinmueller.dev

**Goal:** inbound interest for freelance AWS work — not e-commerce.

**Creative angle:** *AWS ohne Overhead* — builder positioning for teams that want cloud expertise without enterprise overhead.

**What happened:**

- Submitted creative + landing page through Ads Manager
- Got a **live placement** — screenshots from a real thread where the sponsored card shows under the conversation

![Sponsored martinmueller.dev ad card in ChatGPT](index.png)

![The same placement in full conversation context](chatgpt-ads-in-context.png)

Seeing your own ad inside ChatGPT is oddly useful. You immediately understand placement, density, and how much copy fits on the card. No dashboard replicates that.

**What I am measuring:** downstream signals the platform will not fully attribute for you — Calendly bookings, contact form, LinkedIn DMs after talks. Treat dashboard metrics as directional, not gospel.

---

## Practical learnings

### Use the ChatGPT Ads Manager plugin

Install **ChatGPT Ads Manager** from Plugins in ChatGPT (or Codex), connect your Ads Manager account, and manage campaigns in the same place you already think.

The plugin bridges **ChatGPT web** and **Ads Manager web** — create and update campaigns, spin variants, troubleshoot delivery, review performance, all in natural language. It previews changes and asks for confirmation before applying them, so you can iterate fast without tab-hopping.

For a first-timer this was the unlock: describe what you want, see a draft, tweak copy, push an update — feels like pair-programming your ads.

### Test your ad by narrowing location, then prompting

Want to see your own sponsored card? Two tricks that worked for me:

1. **Narrow targeting to your location** in Ads Manager — city or region level, so you are not competing with the whole country for a single impression.
2. **Ask ChatGPT to invent prompts** that are likely to trigger your ad given your campaign topic — then run those prompts in a fresh chat and see if your card appears.

It is not a perfect lab setup (inventory, pacing, and matching still apply), but it beats staring at a dashboard wondering whether anything is live. When my card showed up under a prompt ChatGPT had suggested, I knew the loop worked.

---

## What surprised me

**Context matching works.** The placement I saw was relevant to the thread — not random retargeting noise.

**The platform is product-first early.** Feeds, landing page quality, measurement hooks — the same infrastructure play as Meta/Google, just younger. If you are a builder who ships landing pages and tracks outcomes, you have an edge over copy-paste advertisers.

**Small budgets are fine.** This is a sandbox. You learn placement and UX without betting the farm.

**I actually enjoy it.** Genuinely — first ads channel where I want to open the manager again tomorrow.

---

## What I would do differently

1. **Install the plugin on day one** — skip the Ads Manager-only learning curve
2. **One offer, one page, one metric** — resist scope creep
3. **Measure downstream** — email, Calendly, calls; do not wait for perfect platform attribution
4. **Keep creative conversational** — guides and comparisons fit the medium; hard sell does not
5. **Geo-narrow early for self-testing** — confirm the ad renders before you scale targeting

---

## Open questions (honest)

- What happens to cost per click when more advertisers pile into EU inventory?
- B2B lead quality vs LinkedIn or Google for freelance AWS work — too early to say
- Will OpenAI expose more context signals to advertisers, or keep matching a black box?
- How will users react as ad density increases inside chat?

---

## Bottom line

ChatGPT Ads are **real, live in Europe, and weird in a good way** — distribution at the moment of intent inside a conversation, not on a results page.

If you have something to sell (services, SaaS, a real product), a clear landing page, and curiosity: **run a small test**. A short experiment taught me more than any product blog post — and for a first-time advertiser, it was genuinely fun.

If you are experimenting too — [reach out](https://martinmueller.dev/contact). Happy to swap notes.

**Related:**

- [AWS Community Day DACH talk deck](https://mmuller88.github.io/presentations/aws-community-day-dach-2026/#/chatgpt-ads) — includes the live ad screenshots
