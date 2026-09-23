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

const requestFormEn = {
 firstName: "First name",
 lastName: "Last name",
 email: "Email",
 company: "Company",
 format: "Format",
 formatOnsite: "On-site",
 formatRemote: "Remote",
 teamSize: "Team size",
 teamSizePlaceholder: "Select",
 teamSizes: [
  { value: "1-3", label: "1–3" },
  { value: "4-8", label: "4–8" },
  { value: "9-15", label: "9–15" },
  { value: "16+", label: "16+" },
 ],
 message: "Message",
 submit: "Request this training",
 submitting: "Sending…",
 success: "Request received. I will reply with a quote.",
 error:
  "Something went wrong. Please try again or email office@martinmueller.dev.",
 privacy:
  "We use your name, email, and company only to answer this request, until you ask us to delete them.",
 honeypot: "Don't fill this out",
}

const requestFormDe = {
 firstName: "Vorname",
 lastName: "Nachname",
 email: "E-Mail",
 company: "Firma",
 format: "Format",
 formatOnsite: "Vor Ort",
 formatRemote: "Remote",
 teamSize: "Teamgröße",
 teamSizePlaceholder: "Bitte wählen",
 teamSizes: [
  { value: "1-3", label: "1–3" },
  { value: "4-8", label: "4–8" },
  { value: "9-15", label: "9–15" },
  { value: "16+", label: "16+" },
 ],
 message: "Nachricht",
 submit: "Dieses Training anfragen",
 submitting: "Wird gesendet…",
 success: "Anfrage ist da. Ich antworte mit einem Angebot.",
 error:
  "Etwas ist schiefgelaufen. Bitte erneut versuchen oder office@martinmueller.dev schreiben.",
 privacy:
  "Name, E-Mail und Firma nutzen wir nur, um diese Anfrage zu beantworten, bis Sie die Löschung verlangen.",
 honeypot: "Nicht ausfüllen",
}

const factLabelsEn = {
 duration: "Duration",
 level: "Level",
 format: "Format",
 price: "Price",
}

const factLabelsDe = {
 duration: "Dauer",
 level: "Niveau",
 format: "Format",
 price: "Preis",
}

const methodEn = {
 heading: "How it's run",
 points: [
  {
   title: "Mostly hands-on.",
   body:
    "Most of the time is labs. Slides show up only when the next exercise needs them.",
  },
  {
   title: "Scoped to your stack.",
   body:
    "We use your accounts and repositories where that is the point of the day.",
  },
  {
   title: "Everyone drives.",
   body: "The group stays small enough that each person gets keyboard time.",
  },
  {
   title: "You keep the labs.",
   body: "Scripts and notes stay with the team after the last day.",
  },
 ],
}

const methodDe = {
 heading: "So läuft der Tag",
 points: [
  {
   title: "Überwiegend hands-on.",
   body:
    "Die meiste Zeit sind Labs. Folien nur, wenn die nächste Übung sie braucht.",
  },
  {
   title: "Auf Ihren Stack zugeschnitten.",
   body:
    "Wo es der Punkt des Tages ist, nutzen wir Ihre Accounts und Repositories.",
  },
  {
   title: "Alle bauen mit.",
   body:
    "Die Gruppe bleibt klein genug, dass jede Person an die Tastatur kommt.",
  },
  {
   title: "Die Labs bleiben bei Ihnen.",
   body: "Skripte und Notizen gehen nach dem letzten Tag mit dem Team.",
  },
 ],
}

const sharedFaqsEn = [
 {
  q: "What does this training cost?",
  a: "A training is quoted after the request, not listed as a public price. The quote depends on how many people attend, whether we meet on-site or remote, and how many days you book. Send the form and I reply with a price for that team.",
 },
 {
  q: "Is the training on-site or remote?",
  a: "Both. Choose on-site or remote in the request form. On-site I come to your team and we work on your machines. Remote is the same labs over a video call, with everyone on their own keyboard.",
 },
 {
  q: "Who is the training for?",
  a: "It is for a company team that wants hands-on time on a stack I run in production. It is not a self-paced video course and it is not a public webinar. Groups stay small so each person drives.",
 },
 {
  q: "What should we prepare before day one?",
  a: "A laptop per person, and access to the accounts or repositories you want to use. After we agree dates I send a short checklist. You do not need a finished environment before the request.",
 },
 {
  q: "Can we book fewer days than the published agenda?",
  a: "Yes. The agenda is the full version. In the message, name the outcome you care about and I will cut the days to match. The quote follows the days you actually book.",
 },
]

const sharedFaqsDe = [
 {
  q: "Was kostet das Training?",
  a: "Der Preis steht nicht öffentlich. Ich nenne ihn nach der Anfrage, abhängig von Teamgröße, Format (vor Ort oder remote) und Anzahl der Tage. Schicken Sie das Formular, ich antworte mit einem Angebot für genau dieses Team.",
 },
 {
  q: "Findet das Training vor Ort oder remote statt?",
  a: "Beides. Im Formular wählen Sie vor Ort oder remote. Vor Ort komme ich zu Ihrem Team. Remote sind dieselben Labs im Video-Call, jede Person an der eigenen Tastatur.",
 },
 {
  q: "Für wen ist das Training?",
  a: "Für ein Firmen-Team, das hands-on an einem Stack arbeiten will, den ich in Produktion betreibe. Kein Selbstlern-Videokurs und kein öffentliches Webinar. Die Gruppe bleibt klein, damit jede Person mitbaut.",
 },
 {
  q: "Was brauchen wir vor Tag eins?",
  a: "Ein Laptop pro Person und Zugriff auf die Accounts oder Repositories, die Sie nutzen wollen. Nach der Terminabsprache schicke ich eine kurze Checkliste. Eine fertige Umgebung brauchen Sie für die Anfrage nicht.",
 },
 {
  q: "Können wir weniger Tage buchen als in der Agenda?",
  a: "Ja. Die Agenda ist die volle Fassung. Schreiben Sie ins Formular, welches Ergebnis Sie brauchen, dann kürze ich die Tage. Das Angebot gilt für die Tage, die Sie wirklich buchen.",
 },
]

const shell = {
 en: {
  factLabels: factLabelsEn,
  method: methodEn,
  faqHeading: "FAQs",
  requestIntro:
   "Tell me about the team and I will reply with dates and a quote for this training.",
  requestHeading: "Request this training",
  form: requestFormEn,
  faqs: sharedFaqsEn,
 },
 de: {
  factLabels: factLabelsDe,
  method: methodDe,
  faqHeading: "FAQs",
  requestIntro:
   "Schreiben Sie kurz, wer dabei ist. Ich antworte mit Terminen und einem Angebot für dieses Training.",
  requestHeading: "Dieses Training anfragen",
  form: requestFormDe,
  faqs: sharedFaqsDe,
 },
}

const links = (locale, slug) => {
 const en = `/trainings/${slug}/`
 const de = `/trainings-de/${slug}/`
 if (locale === "de") {
  return {
   langSwitch: { label: "English", href: en },
   catalogLink: { label: "← Alle Trainings", href: "/trainings-de/" },
  }
 }
 return {
  langSwitch: { label: "Deutsch", href: de },
  catalogLink: { label: "← All trainings", href: "/trainings/" },
 }
}

const localeMeta = (locale, slug, fields) => {
 const enPath = `/trainings/${slug}/`
 const dePath = `/trainings-de/${slug}/`
 if (locale === "de") {
  return { ...fields, locale: "de_DE", language: "de", engUrl: enPath }
 }
 return { ...fields, locale: "en_US", language: "en", gerUrl: dePath }
}

const courses = {
 "openclaw-personal-ai-os": {
  en: {
   slug: "openclaw-personal-ai-os",
   meta: localeMeta("en", "openclaw-personal-ai-os", {
    title: "OpenClaw: Personal AI OS — Training",
    description:
     "Two-day team training: personal AI on your VPS, Telegram, heartbeats, GitHub pull requests, MCP tools. On-site or remote, price on request.",
    keywords: [
     "OpenClaw training",
     "AI agents",
     "Telegram bot",
     "MCP",
     "personal AI",
    ],
   }),
   ...links("en", "openclaw-personal-ai-os"),
   hero: {
    title: "OpenClaw: Personal AI OS",
    subtitle:
     "Two days to run a personal AI on your VPS — Telegram, memory files, heartbeats, a GitHub pull-request loop, and MCP tools.",
    image: openclawImage,
    imageAlt: "OpenClaw personal AI agent",
   },
   facts: {
    durationDays: 2,
    duration: "2 days",
    level: "Intermediate",
    format: "On-site or remote",
    price: "On request",
   },
   expect: {
    heading: "What to expect",
    intro:
     "Go from an empty VPS to a personal AI your team operates: Telegram or Slack, memory files, heartbeats, a GitHub pull-request loop, and MCP tools. Two days, on machines you keep.",
    points: [
     "Install and operate the OpenClaw gateway yourself",
     "Wire chat channels and the files that give the agent continuity",
     "Leave with heartbeats, a GitHub PR loop, and MCP tools connected",
    ],
   },
   audience: {
    heading: "What to know before",
    whoHeading: "Who it's for",
    who: [
     "Engineers who want a personal agent on their own VPS, not a chat window in someone else's cloud.",
     "Teams that already poke at agents and want Telegram, memory, and a GitHub loop wired the same way.",
     "Each person leaves with a gateway they installed, on a server they administer.",
    ],
    learnHeading: "You'll learn to",
    learn: [
     "Install the OpenClaw gateway on a VPS and talk to it from Telegram or Slack.",
     "Keep the agent continuous with SOUL.md, MEMORY.md, and daily notes.",
     "Run heartbeats and ship a change through a GitHub pull request, then connect MCP tools.",
    ],
   },
   agenda: {
    heading: "Agenda",
    days: [
     {
      title: "Day 1",
      items: [
       "VPS setup and OpenClaw gateway install",
       "Telegram and Slack channels, group chat rules",
       "SOUL.md, MEMORY.md, daily notes — agent continuity",
      ],
     },
     {
      title: "Day 2",
      items: [
       "Heartbeats, cron, proactive checks",
       "Cursor CLI / agent loop to GitHub pull requests",
       "MCP servers (calendar, email, search)",
      ],
     },
    ],
   },
   faqs: [
    {
     q: "How long is the OpenClaw training?",
     a: "The OpenClaw training is two days for an intermediate team. Day one covers the VPS, the gateway install, Telegram or Slack, and the memory files. Day two covers heartbeats, the GitHub pull-request loop, and MCP tools such as calendar, email, and search.",
    },
    {
     q: "Does each person need their own VPS?",
     a: "Yes. Each participant runs OpenClaw on a VPS they control. The agent built in the room is the one they operate afterward, not a shared sandbox that disappears.",
    },
    {
     q: "What can the team do after the OpenClaw training?",
     a: "They can install the gateway, connect Telegram or Slack, keep agent memory in files, and open a GitHub pull request from the agent. MCP integrations for calendar, email, and search are part of day two.",
    },
   ],
   relatedPost: {
    label: "Read the blog intro",
    href: "/openclaw-eng/",
   },
  },
  de: {
   slug: "openclaw-personal-ai-os",
   meta: localeMeta("de", "openclaw-personal-ai-os", {
    title: "OpenClaw: Personal AI OS — Training",
    description:
     "Zweitägiges Team-Training: persönliche KI auf dem VPS, Telegram, Heartbeats, GitHub-Pull-Requests, MCP-Tools. Vor Ort oder remote, Preis auf Anfrage.",
    keywords: [
     "OpenClaw Training",
     "KI-Agenten",
     "Telegram Bot",
     "MCP",
     "Personal AI",
    ],
   }),
   ...links("de", "openclaw-personal-ai-os"),
   hero: {
    title: "OpenClaw: Personal AI OS",
    subtitle:
     "Zwei Tage persönliche KI auf Ihrem VPS — Telegram, Memory-Dateien, Heartbeats, GitHub-Pull-Request-Loop und MCP-Tools.",
    image: openclawImage,
    imageAlt: "OpenClaw persönlicher KI-Agent",
   },
   facts: {
    durationDays: 2,
    duration: "2 Tage",
    level: "Mittel",
    format: "Vor Ort oder remote",
    price: "Auf Anfrage",
   },
   expect: {
    heading: "Was Sie erwartet",
    intro:
     "Vom leeren VPS zur persönlichen KI, die Ihr Team betreibt: Telegram oder Slack, Memory-Dateien, Heartbeats, ein GitHub-Pull-Request-Loop und MCP-Tools. Zwei Tage, auf Maschinen, die Sie behalten.",
    points: [
     "OpenClaw-Gateway selbst installieren und betreiben",
     "Chat-Kanäle und die Dateien, die dem Agenten Kontinuität geben",
     "Heartbeats, GitHub-PR-Loop und angebundene MCP-Tools mitnehmen",
    ],
   },
   audience: {
    heading: "Was Sie vorher wissen",
    whoHeading: "Für wen",
    who: [
     "Engineers, die einen persönlichen Agenten auf dem eigenen VPS wollen, nicht ein Chat-Fenster in fremder Cloud.",
     "Teams, die schon an Agenten gebastelt haben und Telegram, Memory und GitHub-Loop einheitlich verdrahten wollen.",
     "Jede Person geht mit einem Gateway, das sie selbst installiert hat, auf einem Server, den sie administriert.",
    ],
    learnHeading: "Sie können danach",
    learn: [
     "Das OpenClaw-Gateway auf einem VPS installieren und per Telegram oder Slack damit sprechen.",
     "Den Agenten mit SOUL.md, MEMORY.md und Tagesnotizen kontinuierlich halten.",
     "Heartbeats betreiben, eine Änderung als GitHub-Pull-Request schicken und MCP-Tools anbinden.",
    ],
   },
   agenda: {
    heading: "Agenda",
    days: [
     {
      title: "Tag 1",
      items: [
       "VPS-Setup und OpenClaw-Gateway",
       "Telegram und Slack, Gruppenchat-Regeln",
       "SOUL.md, MEMORY.md, Tagesnotizen — Kontinuität des Agenten",
      ],
     },
     {
      title: "Tag 2",
      items: [
       "Heartbeats, Cron, proaktive Checks",
       "Cursor CLI / Agent-Loop zu GitHub-Pull-Requests",
       "MCP-Server (Kalender, E-Mail, Search)",
      ],
     },
    ],
   },
   faqs: [
    {
     q: "Wie lange dauert das OpenClaw-Training?",
     a: "Das OpenClaw-Training dauert zwei Tage und richtet sich an Teams mit mittlerer Erfahrung. Tag eins: VPS, Gateway, Telegram oder Slack, Memory-Dateien. Tag zwei: Heartbeats, GitHub-Pull-Request-Loop und MCP-Tools wie Kalender, E-Mail und Suche.",
    },
    {
     q: "Braucht jede Person einen eigenen VPS?",
     a: "Ja. Jede Person betreibt OpenClaw auf einem VPS, den sie selbst kontrolliert. Der Agent aus dem Training ist der, den sie danach weiterbetreibt — keine gemeinsame Sandbox, die danach verschwindet.",
    },
    {
     q: "Was kann das Team nach dem OpenClaw-Training?",
     a: "Das Gateway installieren, Telegram oder Slack anbinden, das Gedächtnis des Agenten in Dateien halten und aus dem Agenten einen GitHub-Pull-Request öffnen. MCP-Anbindungen für Kalender, E-Mail und Suche sind Teil von Tag zwei.",
    },
   ],
   relatedPost: {
    label: "Blog-Einstieg lesen",
    href: "/openclaw-de/",
   },
  },
 },
 "opennext-cdk-mvp": {
  en: {
   slug: "opennext-cdk-mvp",
   meta: localeMeta("en", "opennext-cdk-mvp", {
    title: "Next.js MVP: OpenNext + CDK — Training",
    description:
     "Three-day team training: Next.js on Lambda and CloudFront with OpenNext and AWS CDK. On-site or remote, price on request.",
    keywords: ["OpenNext training", "AWS CDK", "Next.js", "serverless", "MVP"],
   }),
   ...links("en", "opennext-cdk-mvp"),
   hero: {
    title: "Next.js MVP: OpenNext + CDK",
    subtitleBefore:
     "Three days to ship a production Next.js app on Lambda and CloudFront. Real stack from ",
    subtitleLink: { href: "https://qr-plakat.de", label: "qr-plakat.de" },
    subtitleAfter: ".",
    image: opennextImage,
    imageAlt: "OpenNext CDK architecture",
   },
   facts: {
    durationDays: 3,
    duration: "3 days",
    level: "Intermediate",
    format: "On-site or remote",
    price: "On request",
   },
   expect: {
    heading: "What to expect",
    intro:
     "Fargate wants always-on tasks, a VPC, and an ALB before you have users. OpenNext maps Next.js to pay-per-request Lambda — the stack I shipped for qr-plakat.de. Three days in your AWS account.",
    points: [
     "Scale to zero — no baseline compute when traffic is bursty or pre-revenue",
     "Keep App Router, RSC, and Server Actions without running next start in Docker",
     "CDK stacks you own: Data, Auth, Web, CI/CD — same IaC as bigger projects",
     "One GitHub Actions job from lint to CloudFront invalidation",
     "Graduate to ECS Fargate later if product-market fit justifies always-on",
    ],
   },
   audience: {
    heading: "What to know before",
    whoHeading: "Who it's for",
    who: [
     "Teams shipping a Next.js MVP who do not want Fargate, a VPC, and an ALB before they have users.",
     "Engineers who want CDK stacks they own: data, auth, web, and CI/CD.",
     "Groups that already have an AWS account and want the labs in that account.",
    ],
    learnHeading: "You'll learn to",
    learn: [
     "Build a Next.js app with the OpenNext 4.x pipeline and deploy it to Lambda and CloudFront.",
     "Model data with DynamoDB single-table and ElectroDB, and add Cognito with your own login UI.",
     "Ship from GitHub Actions with OIDC, Route 53, and CloudFront in eu-central-1.",
    ],
   },
   agenda: {
    heading: "Agenda",
    days: [
     {
      title: "Day 1",
      items: [
       "OpenNext 4.x build pipeline",
       "CDK stacks: Data, Auth, Web, CI/CD",
      ],
     },
     {
      title: "Day 2",
      items: [
       "DynamoDB single-table and ElectroDB",
       "Cognito and a custom login UI",
      ],
     },
     {
      title: "Day 3",
      items: [
       "GitHub Actions to OIDC deploy",
       "Route 53, CloudFront, eu-central-1 ops",
      ],
     },
    ],
   },
   faqs: [
    {
     q: "How long is an OpenNext and CDK training?",
     a: "The OpenNext and CDK training is three days at intermediate level. Day one is the OpenNext 4.x build and the CDK stacks. Day two is DynamoDB single-table design and Cognito. Day three is GitHub Actions deploy, Route 53, and CloudFront.",
    },
    {
     q: "Can the OpenNext training run in our AWS account?",
     a: "Yes. Where it helps, exercises use your AWS account and repositories so the stacks match how you already ship. You keep the CDK code at the end of day three.",
    },
    {
     q: "Does the OpenNext training use Fargate?",
     a: "No. The training deploys Next.js with OpenNext onto Lambda and CloudFront, so you are not paying for always-on containers before you have users. We cover when a later move to ECS Fargate is justified.",
    },
   ],
   relatedPost: {
    label: "Read the blog walkthrough",
    href: "/opennext-cdk/",
   },
  },
  de: {
   slug: "opennext-cdk-mvp",
   meta: localeMeta("de", "opennext-cdk-mvp", {
    title: "Next.js MVP: OpenNext + CDK — Training",
    description:
     "Dreitägiges Team-Training: Next.js auf Lambda und CloudFront mit OpenNext und AWS CDK. Vor Ort oder remote, Preis auf Anfrage.",
    keywords: ["OpenNext Training", "AWS CDK", "Next.js", "Serverless", "MVP"],
   }),
   ...links("de", "opennext-cdk-mvp"),
   hero: {
    title: "Next.js MVP: OpenNext + CDK",
    subtitleBefore:
     "Drei Tage Produktions-Next.js auf Lambda und CloudFront. Echter Stack von ",
    subtitleLink: { href: "https://qr-plakat.de", label: "qr-plakat.de" },
    subtitleAfter: ".",
    image: opennextImage,
    imageAlt: "OpenNext CDK Architektur",
   },
   facts: {
    durationDays: 3,
    duration: "3 Tage",
    level: "Mittel",
    format: "Vor Ort oder remote",
    price: "Auf Anfrage",
   },
   expect: {
    heading: "Was Sie erwartet",
    intro:
     "Fargate will always-on Tasks, VPC und ALB — bevor Nutzer da sind. OpenNext mappt Next.js auf pay-per-request Lambda, der Stack hinter qr-plakat.de. Drei Tage in Ihrem AWS-Account.",
    points: [
     "Scale to zero — keine Basiskosten bei burstigem oder pre-revenue Traffic",
     "App Router, RSC und Server Actions ohne next start im Container",
     "CDK-Stacks, die Sie besitzen: Data, Auth, Web, CI/CD",
     "Ein GitHub-Actions-Job von Lint bis CloudFront-Invalidierung",
     "Später auf ECS Fargate wechseln, wenn PMF always-on rechtfertigt",
    ],
   },
   audience: {
    heading: "Was Sie vorher wissen",
    whoHeading: "Für wen",
    who: [
     "Teams, die ein Next.js-MVP shippen und vor den ersten Nutzern kein Fargate, keine VPC und keinen ALB wollen.",
     "Engineers, die CDK-Stacks besitzen wollen: Data, Auth, Web und CI/CD.",
     "Gruppen mit AWS-Account, die die Labs in diesem Account machen wollen.",
    ],
    learnHeading: "Sie können danach",
    learn: [
     "Eine Next.js-App mit der OpenNext-4.x-Pipeline bauen und auf Lambda und CloudFront deployen.",
     "Daten mit DynamoDB Single-Table und ElectroDB modellieren und Cognito mit eigenem Login-UI anbinden.",
     "Per GitHub Actions mit OIDC shippen, inklusive Route 53 und CloudFront in eu-central-1.",
    ],
   },
   agenda: {
    heading: "Agenda",
    days: [
     {
      title: "Tag 1",
      items: [
       "OpenNext 4.x Build-Pipeline",
       "CDK-Stacks: Data, Auth, Web, CI/CD",
      ],
     },
     {
      title: "Tag 2",
      items: [
       "DynamoDB Single-Table und ElectroDB",
       "Cognito und eigenes Login-UI",
      ],
     },
     {
      title: "Tag 3",
      items: [
       "GitHub Actions zu OIDC-Deploy",
       "Route 53, CloudFront, eu-central-1",
      ],
     },
    ],
   },
   faqs: [
    {
     q: "Wie lange dauert das OpenNext- und CDK-Training?",
     a: "Drei Tage, Niveau mittel. Tag eins: OpenNext-4.x-Build und CDK-Stacks. Tag zwei: DynamoDB Single-Table und Cognito. Tag drei: GitHub Actions, Route 53 und CloudFront.",
    },
    {
     q: "Kann das OpenNext-Training in unserem AWS-Account laufen?",
     a: "Ja. Wo es hilft, laufen die Übungen in Ihrem AWS-Account und Ihren Repositories, damit die Stacks zu Ihrem Deploy passen. Den CDK-Code behalten Sie.",
    },
    {
     q: "Nutzt das OpenNext-Training Fargate?",
     a: "Nein. Next.js läuft über OpenNext auf Lambda und CloudFront, ohne always-on Container, bevor Nutzer da sind. Wir besprechen, wann ein späterer Wechsel auf ECS Fargate sinnvoll ist.",
    },
   ],
   relatedPost: {
    label: "Blog-Walkthrough lesen",
    href: "/opennext-cdk-de/",
   },
  },
 },
 "chatgpt-ads": {
  en: {
   slug: "chatgpt-ads",
   meta: localeMeta("en", "chatgpt-ads", {
    title: "ChatGPT Ads — Training (B2B + B2C)",
    description:
     "One-day team training: ChatGPT ads below the answer, Ads Manager, landing pages, measurement. On-site or remote, price on request.",
    keywords: ["ChatGPT Ads training", "OpenAI", "B2B marketing", "paid media"],
   }),
   ...links("en", "chatgpt-ads"),
   hero: {
    title: "ChatGPT Ads",
    subtitle:
     "One day on sponsored cards inside live ChatGPT threads — setup, creative, landing pages, and measurement for a B2B or B2C offer.",
    image: chatgptAdsImage,
    imageAlt: "ChatGPT Ads in context",
   },
   facts: {
    durationDays: 1,
    duration: "1 day",
    level: "Beginner to intermediate",
    format: "On-site or remote",
    price: "On request",
   },
   expect: {
    heading: "What to expect",
    intro:
     "One day on sponsored cards inside live ChatGPT threads: account setup, placement under the answer, landing pages, and measurement past the dashboard. Built around your B2B or B2C offer.",
    points: [
     "EU rollout and the Ads Manager workflow",
     "Context matching and a landing page that matches the thread",
     "A way to judge the campaign beyond the dashboard numbers",
    ],
   },
   audience: {
    heading: "What to know before",
    whoHeading: "Who it's for",
    who: [
     "Marketing and engineering pairs who need to launch or fix ChatGPT ads, not read a recap.",
     "Freelancers and in-house teams with a B2B or B2C offer and a landing page to test.",
     "People who want one measured campaign, not a tour of the product.",
    ],
    learnHeading: "You'll learn to",
    learn: [
     "Set up an EU ads account and place a sponsored card under a ChatGPT answer.",
     "Shape a landing page and offer for B2B or B2C so the click has somewhere to go.",
     "Read downstream results instead of stopping at the Ads Manager dashboard.",
    ],
   },
   agenda: {
    heading: "Agenda",
    days: [
     {
      title: "Day 1",
      items: [
       "EU rollout and account setup",
       "Placement: below the answer, context matching",
       "Ads Manager plugin workflow",
       "Landing pages and offer design (B2B and B2C)",
       "Test your own ad in ChatGPT web",
       "Downstream metrics beyond the dashboard",
      ],
     },
    ],
   },
   faqs: [
    {
     q: "How long is the ChatGPT Ads training?",
     a: "The ChatGPT Ads training is one day, from beginner to intermediate. It covers the EU account setup, ads placed under the ChatGPT answer, landing pages for B2B and B2C, and measurement beyond the Ads Manager dashboard.",
    },
    {
     q: "Is the ChatGPT Ads training for B2B or B2C?",
     a: "Both. The day is built around your offer, whether you sell a service to companies or a product to consumers. Bring the landing page and the claim you want to test.",
    },
    {
     q: "Do we need a ChatGPT ads account before the training?",
     a: "No. Account setup is part of the day. If you already run campaigns, we start from those instead of a blank account.",
    },
   ],
   relatedPost: {
    label: "Read field notes",
    href: "/chatgpt-ads-learnings/",
   },
  },
  de: {
   slug: "chatgpt-ads",
   meta: localeMeta("de", "chatgpt-ads", {
    title: "ChatGPT Ads — Training (B2B + B2C)",
    description:
     "Eintägiges Team-Training: ChatGPT-Ads unter der Antwort, Ads Manager, Landing Pages, Messung. Vor Ort oder remote, Preis auf Anfrage.",
    keywords: ["ChatGPT Ads Training", "OpenAI", "B2B Marketing", "Paid Media"],
   }),
   ...links("de", "chatgpt-ads"),
   hero: {
    title: "ChatGPT Ads",
    subtitle:
     "Ein Tag gesponserte Karten in echten ChatGPT-Threads — Setup, Creative, Landing Pages und Messung für ein B2B- oder B2C-Angebot.",
    image: chatgptAdsImage,
    imageAlt: "ChatGPT Ads im Kontext",
   },
   facts: {
    durationDays: 1,
    duration: "1 Tag",
    level: "Einsteiger bis Mittel",
    format: "Vor Ort oder remote",
    price: "Auf Anfrage",
   },
   expect: {
    heading: "Was Sie erwartet",
    intro:
     "Ein Tag zu gesponserten Karten in echten ChatGPT-Threads: Account-Setup, Placement unter der Antwort, Landing Pages und Messung jenseits des Dashboards. Gebaut um Ihr B2B- oder B2C-Angebot.",
    points: [
     "EU-Rollout und der Ads-Manager-Ablauf",
     "Kontext-Matching und eine Landing Page, die zum Thread passt",
     "Die Kampagne jenseits der Dashboard-Zahlen beurteilen",
    ],
   },
   audience: {
    heading: "Was Sie vorher wissen",
    whoHeading: "Für wen",
    who: [
     "Marketing und Engineering, die ChatGPT-Ads starten oder reparieren wollen, nicht eine Zusammenfassung lesen.",
     "Freelancer und Inhouse-Teams mit B2B- oder B2C-Angebot und einer Landing Page zum Testen.",
     "Leute, die eine gemessene Kampagne wollen, keine Produkttour.",
    ],
    learnHeading: "Sie können danach",
    learn: [
     "Einen EU-Ads-Account aufsetzen und eine gesponserte Karte unter eine ChatGPT-Antwort legen.",
     "Landing Page und Angebot für B2B oder B2C so bauen, dass der Klick ein Ziel hat.",
     "Downstream-Ergebnisse lesen, statt beim Ads-Manager-Dashboard aufzuhören.",
    ],
   },
   agenda: {
    heading: "Agenda",
    days: [
     {
      title: "Tag 1",
      items: [
       "EU-Rollout und Account-Setup",
       "Placement: unter der Antwort, Kontext-Matching",
       "Ads Manager Plugin",
       "Landing Pages und Angebot (B2B und B2C)",
       "Eigene Anzeige in ChatGPT Web testen",
       "Downstream-Metriken statt nur Dashboard",
      ],
     },
    ],
   },
   faqs: [
    {
     q: "Wie lange dauert das ChatGPT-Ads-Training?",
     a: "Einen Tag, von Einsteiger bis mittel. EU-Account, Anzeigen unter der ChatGPT-Antwort, Landing Pages für B2B und B2C, Messung jenseits des Ads-Manager-Dashboards.",
    },
    {
     q: "Ist das ChatGPT-Ads-Training für B2B oder B2C?",
     a: "Beides. Der Tag dreht sich um Ihr Angebot, ob Sie eine Leistung an Firmen oder ein Produkt an Endkunden verkaufen. Bringen Sie die Landing Page und die Aussage mit, die Sie testen wollen.",
    },
    {
     q: "Brauchen wir vor dem Training schon einen ChatGPT-Ads-Account?",
     a: "Nein. Das Setup ist Teil des Tages. Wenn Sie schon Kampagnen fahren, starten wir dort statt bei einem leeren Account.",
    },
   ],
   relatedPost: {
    label: "Field Notes lesen",
    href: "/chatgpt-ads-learnings-de/",
   },
  },
 },
 "hetzner-eu-production": {
  en: {
   slug: "hetzner-eu-production",
   meta: localeMeta("en", "hetzner-eu-production", {
    title: "EU Production on Hetzner — Training",
    description:
     "Two-day team training: Hetzner VPS, Docker, TLS, backups, and when to move to AWS. On-site or remote, price on request.",
    keywords: ["Hetzner training", "EU hosting", "VPS", "Docker", "GDPR"],
   }),
   ...links("en", "hetzner-eu-production"),
   hero: {
    title: "EU Production on Hetzner",
    subtitle:
     "Two days to ship and operate in Frankfurt — Docker, Caddy, backups, and a clear rule for when the workload belongs on AWS.",
    image: hetznerImage,
    imageAlt: "Hetzner EU production hosting",
   },
   facts: {
    durationDays: 2,
    duration: "2 days",
    level: "Beginner to intermediate",
    format: "On-site or remote",
    price: "On request",
   },
   expect: {
    heading: "What to expect",
    intro:
     "Two days to run production in the EU on Hetzner: project and firewall, Docker Compose, TLS, deploy, backups, and a clear rule for when AWS is the next step.",
    points: [
     "A firewall and Compose setup you can repeat",
     "TLS and a reverse proxy in front of a real deploy",
     "Backups, update habits, and the Hetzner-versus-AWS decision",
    ],
   },
   audience: {
    heading: "What to know before",
    whoHeading: "Who it's for",
    who: [
     "Teams moving a prototype to a Hetzner VPS in the EU.",
     "Engineers who can SSH and want Docker, TLS, and backups without inventing an ops platform.",
     "Groups deciding whether this workload stays on Hetzner or belongs on AWS.",
    ],
    learnHeading: "You'll learn to",
    learn: [
     "Stand up a Hetzner project with a firewall baseline and Docker Compose for production.",
     "Put TLS and Caddy in front of a deploy, including a static export.",
     "Run backups and updates, and decide when the service should move to AWS.",
    ],
   },
   agenda: {
    heading: "Agenda",
    days: [
     {
      title: "Day 1",
      items: [
       "Hetzner project and firewall baseline",
       "Docker Compose production patterns",
       "TLS and reverse proxy (Caddy)",
      ],
     },
     {
      title: "Day 2",
      items: [
       "Deploy from Lovable or a static export",
       "Backups, updates, incident basics",
       "When to stay on Hetzner vs move to AWS",
      ],
     },
    ],
   },
   faqs: [
    {
     q: "How long is the Hetzner EU production training?",
     a: "The Hetzner training is two days, from beginner to intermediate. Day one is the Hetzner project, firewall, Docker Compose, and TLS with Caddy. Day two is deploying an app, backups, incident basics, and when to stay on Hetzner versus move to AWS.",
    },
    {
     q: "Can we run the Hetzner training on our own servers?",
     a: "Yes. The labs use your Hetzner project, so the firewall, reverse proxy, and backups are the ones your team keeps. You do not need a separate sandbox project unless you want one.",
    },
    {
     q: "Do we need an AWS account for the Hetzner training?",
     a: "No. The training is Hetzner-first: VPS, Docker, TLS, and backups in the EU. AWS appears only as the decision of when a workload should leave the VPS.",
    },
   ],
   relatedPost: {
    label: "Read the blog post",
    href: "/hetzner-eu-production/",
   },
  },
  de: {
   slug: "hetzner-eu-production",
   meta: localeMeta("de", "hetzner-eu-production", {
    title: "EU-Produktion auf Hetzner — Training",
    description:
     "Zweitägiges Team-Training: Hetzner-VPS, Docker, TLS, Backups und wann der Wechsel zu AWS kommt. Vor Ort oder remote, Preis auf Anfrage.",
    keywords: ["Hetzner Training", "EU Hosting", "VPS", "Docker", "DSGVO"],
   }),
   ...links("de", "hetzner-eu-production"),
   hero: {
    title: "EU-Produktion auf Hetzner",
    subtitle:
     "Zwei Tage in Frankfurt shippen und betreiben — Docker, Caddy, Backups und eine klare Regel, wann die Workload auf AWS gehört.",
    image: hetznerImage,
    imageAlt: "Hetzner EU Produktions-Hosting",
   },
   facts: {
    durationDays: 2,
    duration: "2 Tage",
    level: "Einsteiger bis Mittel",
    format: "Vor Ort oder remote",
    price: "Auf Anfrage",
   },
   expect: {
    heading: "Was Sie erwartet",
    intro:
     "Zwei Tage Produktion in der EU auf Hetzner: Projekt und Firewall, Docker Compose, TLS, Deploy, Backups und eine klare Regel, wann AWS der nächste Schritt ist.",
    points: [
     "Firewall und Compose-Setup, das Sie wiederholen können",
     "TLS und Reverse Proxy vor einem echten Deploy",
     "Backups, Update-Gewohnheiten und die Entscheidung Hetzner versus AWS",
    ],
   },
   audience: {
    heading: "Was Sie vorher wissen",
    whoHeading: "Für wen",
    who: [
     "Teams, die einen Prototyp auf einen Hetzner-VPS in der EU bringen.",
     "Engineers, die SSH können und Docker, TLS und Backups wollen, ohne eine Ops-Plattform zu erfinden.",
     "Gruppen, die entscheiden, ob diese Workload auf Hetzner bleibt oder auf AWS gehört.",
    ],
    learnHeading: "Sie können danach",
    learn: [
     "Ein Hetzner-Projekt mit Firewall-Baseline und Docker Compose für Produktion aufsetzen.",
     "TLS und Caddy vor einen Deploy setzen, inklusive Static Export.",
     "Backups und Updates fahren und entscheiden, wann der Dienst zu AWS wechselt.",
    ],
   },
   agenda: {
    heading: "Agenda",
    days: [
     {
      title: "Tag 1",
      items: [
       "Hetzner-Projekt und Firewall-Baseline",
       "Docker Compose für Produktion",
       "TLS und Reverse Proxy (Caddy)",
      ],
     },
     {
      title: "Tag 2",
      items: [
       "Deploy von Lovable oder Static Export",
       "Backups, Updates, Incident-Basics",
       "Hetzner behalten versus Wechsel zu AWS",
      ],
     },
    ],
   },
   faqs: [
    {
     q: "Wie lange dauert das Hetzner-Training für EU-Produktion?",
     a: "Zwei Tage, von Einsteiger bis mittel. Tag eins: Hetzner-Projekt, Firewall, Docker Compose, TLS mit Caddy. Tag zwei: Deploy, Backups, Incident-Basics und wann Hetzner bleibt versus AWS.",
    },
    {
     q: "Können wir das Hetzner-Training auf unseren eigenen Servern machen?",
     a: "Ja. Die Labs laufen in Ihrem Hetzner-Projekt. Firewall, Reverse Proxy und Backups sind die, die Ihr Team behält. Ein extra Sandbox-Projekt brauchen Sie nur, wenn Sie eins wollen.",
    },
    {
     q: "Brauchen wir für das Hetzner-Training einen AWS-Account?",
     a: "Nein. Das Training ist Hetzner-first: VPS, Docker, TLS und Backups in der EU. AWS kommt nur als Entscheidung vor, wann eine Workload den VPS verlassen sollte.",
    },
   ],
   relatedPost: {
    label: "Blog-Post lesen",
    href: "/hetzner-eu-production-de/",
   },
  },
 },
}

const catalogContent = {
 en: {
  meta: {
   title: "Trainings — Martin Mueller",
   description:
    "Hands-on team trainings: OpenClaw, OpenNext + CDK, ChatGPT Ads, EU hosting on Hetzner. On-site or remote, price on request.",
   keywords: ["trainings", "OpenClaw", "AWS CDK", "ChatGPT Ads", "Hetzner"],
   locale: "en_US",
   language: "en",
   gerUrl: "/trainings-de/",
  },
  langSwitch: { label: "Deutsch", href: "/trainings-de/" },
  catalogPath: "/trainings/",
  hero: {
   title: "Trainings",
   subtitle:
    "Hands-on sessions for your team — your stack, on-site or remote. I quote a price after the request.",
  },
  how: {
   heading: "How it works",
   points: [
    {
     title: "Scoped to your stack.",
     body:
      "Exercises use your accounts and repos where that helps, not a generic sandbox you throw away.",
    },
    {
     title: "Your team on the keyboards.",
     body: "Sessions stay small so everyone drives, not just watches.",
    },
    {
     title: "On-site or remote.",
     body: "You pick the format in the request.",
    },
    {
     title: "You keep the labs.",
     body: "Scripts and notes stay with the team after the last day.",
    },
    {
     title: "Price on request.",
     body:
      "I quote after I know the team size, the format, and how many days you want.",
    },
   ],
  },
  cardCta: "View training",
  notFoundTitle: "Training not found",
  notFoundLink: "← Back to trainings",
  relatedHeading: "Related trainings",
  faqHeading: "FAQs",
  faqs: [
   {
    q: "Which training should we book?",
    a: "There are four: OpenClaw (personal AI on a VPS, 2 days), Next.js with OpenNext and AWS CDK (3 days), ChatGPT Ads (1 day), and EU production on Hetzner (2 days). If you are unsure, say what you are shipping in the request and I will point you at one.",
   },
   ...sharedFaqsEn,
  ],
 },
 de: {
  meta: {
   title: "Trainings — Martin Mueller",
   description:
    "Hands-on Team-Trainings: OpenClaw, OpenNext + CDK, ChatGPT Ads, EU-Hosting auf Hetzner. Vor Ort oder remote, Preis auf Anfrage.",
   keywords: ["Trainings", "OpenClaw", "AWS CDK", "ChatGPT Ads", "Hetzner"],
   locale: "de_DE",
   language: "de",
   engUrl: "/trainings/",
  },
  langSwitch: { label: "English", href: "/trainings/" },
  catalogPath: "/trainings-de/",
  hero: {
   title: "Trainings",
   subtitle:
    "Hands-on für Ihr Team — Ihr Stack, vor Ort oder remote. Den Preis nenne ich nach der Anfrage.",
  },
  how: {
   heading: "So läuft es",
   points: [
    {
     title: "Auf Ihren Stack zugeschnitten.",
     body:
      "Übungen laufen in Ihren Accounts und Repos, wo das hilft — nicht in einer Sandbox, die Sie wegwerfen.",
    },
    {
     title: "Ihr Team an der Tastatur.",
     body: "Die Gruppe bleibt klein, damit alle mitbauen.",
    },
    {
     title: "Vor Ort oder remote.",
     body: "Das Format wählen Sie in der Anfrage.",
    },
    {
     title: "Die Labs bleiben bei Ihnen.",
     body: "Skripte und Notizen gehen mit dem Team nach Hause.",
    },
    {
     title: "Preis auf Anfrage.",
     body: "Ich nenne ihn, sobald Teamgröße, Format und Dauer klar sind.",
    },
   ],
  },
  cardCta: "Zum Training",
  notFoundTitle: "Training nicht gefunden",
  notFoundLink: "← Zurück zu Trainings",
  relatedHeading: "Weitere Trainings",
  faqHeading: "FAQs",
  faqs: [
   {
    q: "Welches Training passt?",
    a: "Vier Trainings: OpenClaw (persönliche KI auf dem VPS, 2 Tage), Next.js mit OpenNext und AWS CDK (3 Tage), ChatGPT Ads (1 Tag), EU-Produktion auf Hetzner (2 Tage). Wenn Sie unsicher sind, schreiben Sie, was Sie bauen — ich sage, welches passt.",
   },
   ...sharedFaqsDe,
  ],
 },
}

function attachShell(locale, course) {
 const shared = shell[locale]
 return {
  ...course,
  factLabels: shared.factLabels,
  method: shared.method,
  faqHeading: shared.faqHeading,
  request: {
   heading: shared.requestHeading,
   intro: shared.requestIntro,
   form: shared.form,
  },
  faqs: [...shared.faqs, ...course.faqs],
 }
}

export function getCourse(slug, locale) {
 const lang = locale === "de" ? "de" : "en"
 const course = courses[slug]?.[lang]
 if (!course) return null
 return attachShell(lang, course)
}

export function getCatalogCourses(locale) {
 const lang = locale === "de" ? "de" : "en"
 return courseSlugs
  .map((slug) => {
   const course = courses[slug]?.[lang]
   if (!course) return null
   const { hero, facts } = course
   const subtitle =
    hero.subtitle ??
    `${hero.subtitleBefore ?? ""}${hero.subtitleLink?.label ?? ""}${hero.subtitleAfter ?? ""}`

   return {
    slug,
    title: hero.title,
    subtitle,
    image: hero.image,
    imageAlt: hero.imageAlt,
    duration: facts.duration,
    level: facts.level,
    format: facts.format,
    price: facts.price,
    path: lang === "de" ? `/trainings-de/${slug}/` : `/trainings/${slug}/`,
   }
  })
  .filter(Boolean)
}

export function getCatalogContent(locale) {
 return locale === "de" ? catalogContent.de : catalogContent.en
}
