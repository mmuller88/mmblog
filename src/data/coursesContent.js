const openclawImage = "/courses/openclaw.png"
const opennextImage = "/courses/opennext-cdk.png"
const chatgptAdsImage = "/courses/chatgpt-ads.png"
const hetznerImage = "/courses/hetzner.png"

export const courseSlugs = [
 "openclaw-personal-ai-os",
 "opennext-cdk-mvp",
 "chatgpt-ads",
 "hetzner-eu-production",
]

const waitlistFormEn = {
 name: "Your name",
 email: "Your email",
 submit: "Join waitlist",
 submitting: "Joining…",
 success: "You're on the list — check your email to confirm and lock in early-bird pricing.",
 error: "Something went wrong. Please try again or email office@martinmueller.dev.",
 unavailable:
  "Waitlist API not live yet — leave your email and we'll notify you when signups open.",
 honeypot: "Don't fill this out",
}

const waitlistFormDe = {
 name: "Ihr Name",
 email: "Ihre E-Mail",
 submit: "Auf Warteliste",
 submitting: "Wird gesendet…",
 success:
  "Sie stehen auf der Liste — bitte E-Mail bestätigen, um den Early-Bird-Preis zu sichern.",
 error:
  "Etwas ist schiefgelaufen. Bitte erneut versuchen oder office@martinmueller.dev schreiben.",
 unavailable:
  "Wartelisten-API noch nicht live — wir melden uns, sobald Anmeldungen offen sind.",
 honeypot: "Nicht ausfüllen",
}

const courses = {
 "openclaw-personal-ai-os": {
  en: {
   slug: "openclaw-personal-ai-os",
   meta: {
    title: "OpenClaw: Personal AI OS — Course",
    description:
     "Build your own VPS-based AI agent: Telegram, heartbeats, GitHub loop, MCP tools. Practitioner course from the author of OpenClaw.",
    keywords: ["OpenClaw", "AI agents", "Telegram bot", "MCP", "personal AI"],
    locale: "en_US",
    language: "en",
    gerUrl: "/courses-de/openclaw-personal-ai-os/",
   },
   langSwitch: { label: "Deutsch", href: "/courses-de/openclaw-personal-ai-os/" },
   catalogLink: { label: "← All courses", href: "/courses/" },
   hero: {
    title: "OpenClaw: Personal AI OS",
    subtitle:
     "Ship a personal AI on your VPS — Telegram inbox, heartbeats, memory files, GitHub PR loop, MCP integrations.",
    image: openclawImage,
    imageAlt: "OpenClaw personal AI agent",
   },
   pricing: {
    listPriceEur: 149,
    earlyBirdPriceEur: 99,
    note: "Early-bird price reserved for confirmed waitlist members for 14 days after launch.",
   },
   curriculum: {
    heading: "What you'll build",
    modules: [
     "VPS setup + OpenClaw gateway install",
     "Telegram + Slack channels, group chat rules",
     "SOUL.md, MEMORY.md, daily notes — agent continuity",
     "Heartbeats, cron, proactive checks",
     "Cursor CLI / agent loop → GitHub PRs",
     "MCP servers (calendar, email, search)",
    ],
   },
   relatedPost: {
    label: "Read the blog intro",
    href: "/openclaw-eng/",
   },
   waitlist: { heading: "Join the waitlist", form: waitlistFormEn },
  },
  de: {
   slug: "openclaw-personal-ai-os",
   meta: {
    title: "OpenClaw: Personal AI OS — Kurs",
    description:
     "Eigenen KI-Agenten auf dem VPS: Telegram, Heartbeats, GitHub-Loop, MCP-Tools. Praxis-Kurs vom OpenClaw-Autor.",
    keywords: ["OpenClaw", "KI-Agenten", "Telegram Bot", "MCP", "Personal AI"],
    locale: "de_DE",
    language: "de",
    engUrl: "/courses/openclaw-personal-ai-os/",
   },
   langSwitch: { label: "English", href: "/courses/openclaw-personal-ai-os/" },
   catalogLink: { label: "← Alle Kurse", href: "/courses-de/" },
   hero: {
    title: "OpenClaw: Personal AI OS",
    subtitle:
     "Persönliche KI auf dem VPS — Telegram-Inbox, Heartbeats, Memory-Dateien, GitHub-PR-Loop, MCP-Integrationen.",
    image: openclawImage,
    imageAlt: "OpenClaw persönlicher KI-Agent",
   },
   pricing: {
    listPriceEur: 149,
    earlyBirdPriceEur: 99,
    note:
     "Early-Bird-Preis für bestätigte Wartelisten-Mitglieder — 14 Tage nach Launch reserviert.",
   },
   curriculum: {
    heading: "Was Sie bauen",
    modules: [
     "VPS-Setup + OpenClaw-Gateway",
     "Telegram + Slack, Gruppenchat-Regeln",
     "SOUL.md, MEMORY.md, Tagesnotizen",
     "Heartbeats, Cron, proaktive Checks",
     "Cursor CLI / Agent-Loop → GitHub PRs",
     "MCP-Server (Kalender, E-Mail, Search)",
    ],
   },
   relatedPost: {
    label: "Blog-Einstieg lesen",
    href: "/openclaw-de/",
   },
   waitlist: { heading: "Warteliste", form: waitlistFormDe },
  },
 },
 "opennext-cdk-mvp": {
  en: {
   slug: "opennext-cdk-mvp",
   meta: {
    title: "Next.js MVP: OpenNext + CDK — Course",
    description:
     "Deploy a Next.js SaaS with OpenNext 4.x and AWS CDK — Lambda, CloudFront, DynamoDB. Case study: qr-plakat.de.",
    keywords: ["OpenNext", "AWS CDK", "Next.js", "serverless", "MVP"],
    locale: "en_US",
    language: "en",
    gerUrl: "/courses-de/opennext-cdk-mvp/",
   },
   langSwitch: { label: "Deutsch", href: "/courses-de/opennext-cdk-mvp/" },
   catalogLink: { label: "← All courses", href: "/courses/" },
   hero: {
    title: "Next.js MVP: OpenNext + CDK",
    subtitle:
     "Ship a production Next.js app on Lambda + CloudFront without Fargate overhead. Real stack from qr-plakat.de.",
    image: opennextImage,
    imageAlt: "OpenNext CDK architecture",
   },
   pricing: {
    listPriceEur: 199,
    earlyBirdPriceEur: 129,
    note: "Early-bird price reserved for confirmed waitlist members for 14 days after launch.",
   },
   curriculum: {
    heading: "What you'll build",
    modules: [
     "OpenNext 4.x build pipeline",
     "CDK stacks: Data, Auth, Web, CI/CD",
     "DynamoDB single-table + ElectroDB",
     "Cognito + custom login UI",
     "GitHub Actions → OIDC deploy",
     "Route 53, CloudFront, eu-central-1 ops",
    ],
   },
   relatedPost: {
    label: "Read the blog walkthrough",
    href: "/opennext-cdk/",
   },
   waitlist: { heading: "Join the waitlist", form: waitlistFormEn },
  },
  de: {
   slug: "opennext-cdk-mvp",
   meta: {
    title: "Next.js MVP: OpenNext + CDK — Kurs",
    description:
     "Next.js-SaaS mit OpenNext 4.x und AWS CDK — Lambda, CloudFront, DynamoDB. Fallstudie: qr-plakat.de.",
    keywords: ["OpenNext", "AWS CDK", "Next.js", "Serverless", "MVP"],
    locale: "de_DE",
    language: "de",
    engUrl: "/courses/opennext-cdk-mvp/",
   },
   langSwitch: { label: "English", href: "/courses/opennext-cdk-mvp/" },
   catalogLink: { label: "← Alle Kurse", href: "/courses-de/" },
   hero: {
    title: "Next.js MVP: OpenNext + CDK",
    subtitle:
     "Produktions-Next.js auf Lambda + CloudFront ohne Fargate. Echter Stack von qr-plakat.de.",
    image: opennextImage,
    imageAlt: "OpenNext CDK Architektur",
   },
   pricing: {
    listPriceEur: 199,
    earlyBirdPriceEur: 129,
    note:
     "Early-Bird-Preis für bestätigte Wartelisten-Mitglieder — 14 Tage nach Launch reserviert.",
   },
   curriculum: {
    heading: "Was Sie bauen",
    modules: [
     "OpenNext 4.x Build-Pipeline",
     "CDK-Stacks: Data, Auth, Web, CI/CD",
     "DynamoDB Single-Table + ElectroDB",
     "Cognito + eigenes Login-UI",
     "GitHub Actions → OIDC Deploy",
     "Route 53, CloudFront, eu-central-1",
    ],
   },
   relatedPost: {
    label: "Blog-Walkthrough lesen",
    href: "/opennext-cdk-de/",
   },
   waitlist: { heading: "Warteliste", form: waitlistFormDe },
  },
 },
 "chatgpt-ads": {
  en: {
   slug: "chatgpt-ads",
   meta: {
    title: "ChatGPT Ads — Course (B2B + B2C)",
    description:
     "First-mover EU field notes: context-matched ads below ChatGPT answers, Ads Manager plugin, landing pages, downstream tracking.",
    keywords: ["ChatGPT Ads", "OpenAI", "B2B marketing", "paid media", "growth"],
    locale: "en_US",
    language: "en",
    gerUrl: "/courses-de/chatgpt-ads/",
   },
   langSwitch: { label: "Deutsch", href: "/courses-de/chatgpt-ads/" },
   catalogLink: { label: "← All courses", href: "/courses/" },
   hero: {
    title: "ChatGPT Ads",
    subtitle:
     "Sponsored cards inside live ChatGPT threads — for freelancers and teams. Setup, creative, measurement, real campaigns.",
    image: chatgptAdsImage,
    imageAlt: "ChatGPT Ads in context",
   },
   pricing: {
    listPriceEur: 99,
    earlyBirdPriceEur: 69,
    note: "Early-bird price reserved for confirmed waitlist members for 14 days after launch.",
   },
   curriculum: {
    heading: "What you'll learn",
    modules: [
     "EU rollout + account setup",
     "Placement: below the answer, context matching",
     "Ads Manager plugin workflow",
     "Landing pages + offer design (B2B & B2C)",
     "Test your own ad in ChatGPT web",
     "Downstream metrics beyond the dashboard",
    ],
   },
   relatedPost: {
    label: "Read field notes",
    href: "/chatgpt-ads-learnings/",
   },
   waitlist: { heading: "Join the waitlist", form: waitlistFormEn },
  },
  de: {
   slug: "chatgpt-ads",
   meta: {
    title: "ChatGPT Ads — Kurs (B2B + B2C)",
    description:
     "EU Field Notes: kontextbezogene Ads unter ChatGPT-Antworten, Ads Manager Plugin, Landing Pages, Tracking.",
    keywords: ["ChatGPT Ads", "OpenAI", "B2B Marketing", "Paid Media"],
    locale: "de_DE",
    language: "de",
    engUrl: "/courses/chatgpt-ads/",
   },
   langSwitch: { label: "English", href: "/courses/chatgpt-ads/" },
   catalogLink: { label: "← Alle Kurse", href: "/courses-de/" },
   hero: {
    title: "ChatGPT Ads",
    subtitle:
     "Gesponserte Karten in echten ChatGPT-Threads — für Freelancer und Teams. Setup, Creative, Messung, echte Kampagnen.",
    image: chatgptAdsImage,
    imageAlt: "ChatGPT Ads im Kontext",
   },
   pricing: {
    listPriceEur: 99,
    earlyBirdPriceEur: 69,
    note:
     "Early-Bird-Preis für bestätigte Wartelisten-Mitglieder — 14 Tage nach Launch reserviert.",
   },
   curriculum: {
    heading: "Was Sie lernen",
    modules: [
     "EU-Rollout + Account-Setup",
     "Placement: unter der Antwort, Kontext-Matching",
     "Ads Manager Plugin",
     "Landing Pages + Angebot (B2B & B2C)",
     "Eigene Anzeige in ChatGPT Web testen",
     "Downstream-Metriken statt nur Dashboard",
    ],
   },
   relatedPost: {
    label: "Field Notes lesen",
    href: "/chatgpt-ads-learnings-de/",
   },
   waitlist: { heading: "Warteliste", form: waitlistFormDe },
  },
 },
 "hetzner-eu-production": {
  en: {
   slug: "hetzner-eu-production",
   meta: {
    title: "EU Production on Hetzner — Course",
    description:
     "Run production workloads in the EU: Hetzner VPS, Docker, TLS, backups. Sovereignty without reinventing ops.",
    keywords: ["Hetzner", "EU hosting", "VPS", "self-hosted", "GDPR"],
    locale: "en_US",
    language: "en",
    gerUrl: "/courses-de/hetzner-eu-production/",
   },
   langSwitch: { label: "Deutsch", href: "/courses-de/hetzner-eu-production/" },
   catalogLink: { label: "← All courses", href: "/courses/" },
   hero: {
    title: "EU Production on Hetzner",
    subtitle:
     "Ship and operate in Frankfurt — Lovable prototypes to Hetzner prod, Docker, Caddy/Traefik, monitoring basics.",
    image: hetznerImage,
    imageAlt: "Hetzner EU production hosting",
   },
   pricing: {
    listPriceEur: 119,
    earlyBirdPriceEur: 79,
    note: "Early-bird price reserved for confirmed waitlist members for 14 days after launch.",
   },
   curriculum: {
    heading: "What you'll build",
    modules: [
     "Hetzner project + firewall baseline",
     "Docker Compose production patterns",
     "TLS + reverse proxy (Caddy)",
     "Deploy from Lovable / static export",
     "Backups, updates, incident basics",
     "When to stay on Hetzner vs move to AWS",
    ],
   },
   relatedPost: {
    label: "Read the blog post",
    href: "/hetzner-eu-production/",
   },
   waitlist: { heading: "Join the waitlist", form: waitlistFormEn },
  },
  de: {
   slug: "hetzner-eu-production",
   meta: {
    title: "EU-Produktion auf Hetzner — Kurs",
    description:
     "Produktions-Workloads in der EU: Hetzner VPS, Docker, TLS, Backups. Souveränität ohne Ops-Neuerfindung.",
    keywords: ["Hetzner", "EU Hosting", "VPS", "Self-Hosted", "DSGVO"],
    locale: "de_DE",
    language: "de",
    engUrl: "/courses/hetzner-eu-production/",
   },
   langSwitch: { label: "English", href: "/courses/hetzner-eu-production/" },
   catalogLink: { label: "← Alle Kurse", href: "/courses-de/" },
   hero: {
    title: "EU-Produktion auf Hetzner",
    subtitle:
     "In Frankfurt shippen und betreiben — Lovable-Prototypen zu Hetzner-Prod, Docker, Caddy, Monitoring-Basics.",
    image: hetznerImage,
    imageAlt: "Hetzner EU Produktions-Hosting",
   },
   pricing: {
    listPriceEur: 119,
    earlyBirdPriceEur: 79,
    note:
     "Early-Bird-Preis für bestätigte Wartelisten-Mitglieder — 14 Tage nach Launch reserviert.",
   },
   curriculum: {
    heading: "Was Sie bauen",
    modules: [
     "Hetzner-Projekt + Firewall-Baseline",
     "Docker Compose für Produktion",
     "TLS + Reverse Proxy (Caddy)",
     "Deploy von Lovable / Static Export",
     "Backups, Updates, Incident-Basics",
     "Hetzner vs AWS — wann wechseln",
    ],
   },
   relatedPost: {
    label: "Blog-Post lesen",
    href: "/hetzner-eu-production-de/",
   },
   waitlist: { heading: "Warteliste", form: waitlistFormDe },
  },
 },
}

const catalogContent = {
 en: {
  meta: {
   title: "Courses — Martin Mueller",
   description:
    "Practitioner courses: OpenClaw, OpenNext + CDK, ChatGPT Ads, EU hosting on Hetzner. Self-paced, EN + DE, early-bird waitlist open.",
   keywords: ["courses", "OpenClaw", "AWS CDK", "ChatGPT Ads", "Hetzner"],
   locale: "en_US",
   language: "en",
   gerUrl: "/courses-de/",
  },
  langSwitch: { label: "Deutsch", href: "/courses-de/" },
  hero: {
   title: "Courses",
   subtitle:
    "How I actually ship — VPS agents, serverless MVPs, new ad surfaces, EU hosting. Join the waitlist for early-bird pricing.",
  },
  cardCta: "View course",
  pricingLabel: "Early bird",
  listLabel: "List price",
 },
 de: {
  meta: {
   title: "Kurse — Martin Mueller",
   description:
    "Praxis-Kurse: OpenClaw, OpenNext + CDK, ChatGPT Ads, Hetzner EU-Hosting. Self-paced, EN + DE, Early-Bird-Warteliste.",
   keywords: ["Kurse", "OpenClaw", "AWS CDK", "ChatGPT Ads", "Hetzner"],
   locale: "de_DE",
   language: "de",
   engUrl: "/courses/",
  },
  langSwitch: { label: "English", href: "/courses/" },
  hero: {
   title: "Kurse",
   subtitle:
    "Wie ich wirklich shipe — VPS-Agenten, Serverless-MVPs, neue Ad-Oberflächen, EU-Hosting. Warteliste für Early-Bird-Preise.",
  },
  cardCta: "Zum Kurs",
  pricingLabel: "Early Bird",
  listLabel: "Listenpreis",
 },
}

export function getCourse(slug, locale) {
 const lang = locale === "de" ? "de" : "en"
 return courses[slug]?.[lang] ?? null
}

export function getCatalogCourses(locale) {
 const lang = locale === "de" ? "de" : "en"
 return courseSlugs
  .map((slug) => {
   const course = courses[slug]?.[lang]
   if (!course) return null
   return {
    slug,
    title: course.hero.title,
    subtitle: course.hero.subtitle,
    image: course.hero.image,
    imageAlt: course.hero.imageAlt,
    listPriceEur: course.pricing.listPriceEur,
    earlyBirdPriceEur: course.pricing.earlyBirdPriceEur,
    path: lang === "de" ? `/courses-de/${slug}/` : `/courses/${slug}/`,
   }
  })
  .filter(Boolean)
}

export function getCatalogContent(locale) {
 return locale === "de" ? catalogContent.de : catalogContent.en
}

export const thankYouContent = {
 en: {
  meta: {
   title: "Waitlist confirmed — Courses",
   description: "Check your email to confirm your course waitlist signup.",
   locale: "en_US",
   language: "en",
   gerUrl: "/courses-de/waitlist-thank-you/",
  },
  langSwitch: { label: "Deutsch", href: "/courses-de/waitlist-thank-you/" },
  heading: "Almost there",
  body:
   "If you haven't already, check your inbox and confirm your email to lock in early-bird pricing.",
  catalogLink: { label: "← Back to courses", href: "/courses/" },
 },
 de: {
  meta: {
   title: "Warteliste — Kurse",
  description: "E-Mail bestätigen, um die Wartelisten-Anmeldung abzuschließen.",
   locale: "de_DE",
   language: "de",
   engUrl: "/courses/waitlist-thank-you/",
  },
  langSwitch: { label: "English", href: "/courses/waitlist-thank-you/" },
  heading: "Fast geschafft",
  body:
   "Falls noch nicht geschehen: Posteingang prüfen und E-Mail bestätigen, um den Early-Bird-Preis zu sichern.",
  catalogLink: { label: "← Zurück zu Kursen", href: "/courses-de/" },
 },
}
