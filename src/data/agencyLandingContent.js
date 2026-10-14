import testimonialJakob from "../../content/resume/testimonialJakob.png"
import testimonialAdrian from "../../content/resume/testimonialAdrian.png"
import testimonialEric from "../../content/resume/testimonialEric.png"

const formLabelsEn = {
 name: "Your name",
 email: "Your email",
 message: "What do you need help with?",
 submit: "Send message",
 success: "Thanks — I'll get back to you shortly.",
}

const formLabelsDe = {
 name: "Ihr Name",
 email: "Ihre E-Mail",
 message: "Wobei brauchen Sie Unterstützung?",
 submit: "Nachricht senden",
 success: "Danke — ich melde mich in Kürze.",
}

export const agencyLandingContent = {
 aws: {
  en: {
   meta: {
    title: "AWS Consulting — Architecture, CDK & Migration",
    description:
     "Senior AWS expert for architecture, CDK infrastructure, cost optimization, and migrations. Fixed-scope Statement of Work, no agency markup.",
    keywords: [
     "AWS consulting",
     "AWS CDK",
     "cloud migration",
     "AWS architecture",
     "cost optimization",
    ],
    locale: "en_US",
    language: "en",
    gerUrl: "/one-man-agency-de/aws/",
   },
   langSwitch: { label: "Deutsch", href: "/one-man-agency-de/aws/" },
   hubLink: {
    label: "← Full One-Man Agency overview",
    href: "/one-man-agency/",
   },
   hero: {
    title: "AWS Consulting",
    subtitle:
     "For a SaaS team that needs an AWS architecture or cost review — one senior expert, scope agreed in a Statement of Work.",
    ctaSpeak: "🗣️ Book a call",
    ctaWrite: "📝 Or send a message",
    video: {
     src: "/one-man-agency/aws-promo.mp4?v=3",
     poster: "/one-man-agency/aws-promo.jpg",
     title: "AWS Consulting — architecture shipped on AWS",
    },
   },
   audience: {
    heading: "Who this is for",
    who: "A SaaS team whose AWS account grew faster than the design: unclear architecture, a bill that jumped, or a migration that stalled.",
    trigger:
     "The trigger is a cost surprise, a fragile production setup, or a launch date that the current account cannot support.",
    work:
     "I inspect the account and write the target design — or implement it in CDK when the Statement of Work says so.",
   },
   videoExamples: {
    heading: "What the video shows",
    intro:
     "The clip is not stock footage — these are production systems I co-founded, ship as products, or run for clients. Labels match the on-screen context pills.",
    items: [
     {
      index: "01",
      anchor: "hallocasa",
      context: "Co-founded product",
      title: "HalloCasa",
      subtitle: "Global real-estate marketplace",
      body:
       "International property network for agents and buyers. I own the AWS side: multi-account CDK pipelines, ECS on Fargate for Next.js and API workloads, plus CloudFront, ALB, and RDS in us-east-1.",
      stack: ["ECS Fargate", "CDK", "CloudFront", "RDS"],
      href: "https://hallocasa.com",
      linkLabel: "hallocasa.com",
      video: {
       src: "/one-man-agency/hallocasa-broker-promo.mp4?v=1",
       poster: "/one-man-agency/hallocasa-broker-promo.jpg",
       title: "HalloCasa — local listings, global buyers",
       caption:
        "Product clip: a broker profile, listings, and the global buyer network.",
      },
     },
     {
      index: "02",
      anchor: "hdi-cyquins",
      context: "Client · Germany",
      title: "HDI Cyquins",
      subtitle: "Cyber insurance assessments (Prowler)",
      body:
       "Platform for HDI brokers: invite a firm, run security questionnaires, connect AWS, Azure, GCP, and Microsoft 365, and score risk with Prowler Cloud. I build and operate the AWS estate — ECS Fargate, CDK, Cognito, DynamoDB, and EventBridge integrations.",
      stack: ["ECS Fargate", "CDK", "Prowler API", "Multi-cloud scans"],
     },
     {
      index: "03",
      anchor: "ai-secure",
      context: "Own SaaS product",
      title: "ai-secure.dev",
      subtitle: "AI-driven compliance audits",
      body:
       "Agents review web apps against ISO 27001, SOC 2, NIST, and more — on Bedrock AgentCore (runtime and browser tools), with an MCP server on API Gateway.",
      stack: ["Bedrock AgentCore", "Fargate", "DynamoDB"],
      href: "https://ai-secure.dev",
      linkLabel: "ai-secure.dev",
     },
     {
      index: "04",
      anchor: "qr-plakat",
      context: "Own product · DACH",
      title: "qr-plakat.de",
      subtitle: "Shop-window posters with updatable QR links",
      body:
       "Design A-format posters in the browser, host scan targets in Frankfurt (eu-central-1), and export print-ready 300 dpi PDFs from Lambda — OpenNext on serverless.",
      stack: ["OpenNext", "Lambda", "CloudFront", "Frankfurt"],
      href: "https://qr-plakat.de",
      linkLabel: "qr-plakat.de",
     },
    ],
   },
   offer: {
    heading: "First step",
    intro:
     "The call is to see whether an AWS review is the right next purchase. After that, a bounded Statement of Work.",
    rows: [
     [
      "Scope",
      "One account or one workload: architecture, cost, or a named migration.",
     ],
     [
      "Deliverables",
      "Written findings, a target design, and the agreed CDK or migration work.",
     ],
     ["Turnaround", "Agreed in the Statement of Work."],
     [
      "Exclusions",
      "Staff augmentation, 24/7 ops, and work outside the named account.",
     ],
     ["Price", "On request."],
    ],
   },
   credential: {
    heading: "Related",
    links: [
     {
      label: "AWS Community Day Athens — AgentCore talk",
      href: "/talks/aws-community-day-athens-2026/",
     },
     { label: "Building with Bedrock AgentCore", href: "/aws-agentcore/" },
    ],
   },
   deliverables: {
    heading: "What you get",
    items: [
     "AWS architecture review and target design",
     "Infrastructure as Code with AWS CDK",
     "Migration planning and execution",
     "Cost analysis and optimization",
     "Security and compliance alignment",
     "Written Statement of Work with fixed price",
    ],
   },
   testimonials: [
    {
     name: "Adrian Logan",
     href: "https://www.linkedin.com/in/adrian-logan-a52027b5",
     image: testimonialAdrian,
     paragraphs: [
      "I cannot recommend Martin Muller highly enough for his exceptional work in setting up our web application backend using the AWS CDK.",
      "The quality of his work is consistently top-notch, which gives me the utmost confidence in the final product.",
     ],
    },
    {
     name: "Eric Amberg",
     href: "https://www.linkedin.com/in/ericamberg",
     image: testimonialEric,
     paragraphs: [
      "Martin built the sophisticated AWS infrastructure for our online lab environments. Working with him was characterized by very good communication and a very fast implementation.",
      "His concepts are scalable and comply with best practices in cloud environments.",
     ],
    },
   ],
   contact: { heading: "Tell me about your AWS project", form: formLabelsEn },
   service: true,
  },
  de: {
   meta: {
    title: "AWS CDK Beratung: Architektur, Kosten, Migration",
    description:
     "Senior AWS-Experte für Architektur, CDK-Infrastruktur, Kostenoptimierung und Migrationen. Festes Statement of Work, kein Agentur-Aufschlag.",
    keywords: [
     "AWS Consulting",
     "AWS CDK",
     "Cloud Migration",
     "AWS Architektur",
     "Kostenoptimierung",
    ],
    locale: "de_DE",
    language: "de",
    engUrl: "/one-man-agency/aws/",
   },
   langSwitch: { label: "English", href: "/one-man-agency/aws/" },
   hubLink: {
    label: "← Zur vollständigen One-Man-Agency-Übersicht",
    href: "/one-man-agency-de/",
   },
   hero: {
    title: "AWS Consulting",
    subtitle:
     "Für ein SaaS-Team, das ein AWS-Architektur- oder Kosten-Review braucht — ein Senior-Experte, Scope im Statement of Work.",
    ctaSpeak: "🗣️ Termin buchen",
    ctaWrite: "📝 Oder Nachricht senden",
    video: {
     src: "/one-man-agency/aws-promo.mp4?v=3",
     poster: "/one-man-agency/aws-promo.jpg",
     title: "AWS Consulting — Architektur, die auf AWS läuft",
    },
   },
   audience: {
    heading: "Für wen",
    who: "Ein SaaS-Team, dessen AWS-Account schneller gewachsen ist als das Design: unklare Architektur, eine Rechnung, die gesprungen ist, oder eine Migration, die hängt.",
    trigger:
     "Der Auslöser ist eine Kostenüberraschung, eine fragile Produktion oder ein Launch, den der aktuelle Account nicht trägt.",
    work:
     "Ich prüfe den Account und schreibe das Zielbild — oder setze es in CDK um, wenn das Statement of Work das sagt.",
   },
   videoExamples: {
    heading: "Was das Video zeigt",
    intro:
     "Kein Stock-Material — das sind Produktionssysteme, die ich mitgegründet habe, als Produkt betreibe oder für Kunden betreue. Die Labels entsprechen den Kontext-Pills im Video.",
    items: [
     {
      index: "01",
      anchor: "hallocasa",
      context: "Mitgegründetes Produkt",
      title: "HalloCasa",
      subtitle: "Internationaler Immobilien-Marktplatz",
      body:
       "Netzwerk für Makler und Käufer weltweit. Ich verantworte die AWS-Seite: Multi-Account-CDK-Pipelines, ECS auf Fargate für Next.js und API, plus CloudFront, ALB und RDS in us-east-1.",
      stack: ["ECS Fargate", "CDK", "CloudFront", "RDS"],
      href: "https://hallocasa.com",
      linkLabel: "hallocasa.com",
      video: {
       src: "/one-man-agency/hallocasa-broker-promo.mp4?v=1",
       poster: "/one-man-agency/hallocasa-broker-promo.jpg",
       title: "HalloCasa — lokale Inserate, globale Käufer",
       caption:
        "Produktclip: Maklerprofil, Inserate und das globale Käufernetzwerk.",
      },
     },
     {
      index: "02",
      anchor: "hdi-cyquins",
      context: "Kunde · Deutschland",
      title: "HDI Cyquins",
      subtitle: "Cyber-Versicherungs-Assessments (Prowler)",
      body:
       "Plattform für HDI-Broker: Firma einladen, Security-Fragebögen, Anbindung von AWS, Azure, GCP und Microsoft 365, Risiko-Scoring mit Prowler Cloud. Ich baue und betreibe die AWS-Landschaft — ECS Fargate, CDK, Cognito, DynamoDB, EventBridge.",
      stack: ["ECS Fargate", "CDK", "Prowler API", "Multi-Cloud-Scans"],
     },
     {
      index: "03",
      anchor: "ai-secure",
      context: "Eigenes SaaS-Produkt",
      title: "ai-secure.dev",
      subtitle: "KI-gestützte Compliance-Audits",
      body:
       "Agents prüfen Web-Apps gegen ISO 27001, SOC 2, NIST u. a. — auf Bedrock AgentCore (Runtime und Browser-Tools), MCP-Server auf API Gateway.",
      stack: ["Bedrock AgentCore", "Fargate", "DynamoDB"],
      href: "https://ai-secure.dev",
      linkLabel: "ai-secure.dev",
     },
     {
      index: "04",
      anchor: "qr-plakat",
      context: "Eigenes Produkt · DACH",
      title: "qr-plakat.de",
      subtitle: "Schaufenster-Plakate mit wechselbarem QR-Link",
      body:
       "A-Format-Plakate im Browser gestalten, Scan-Ziele in Frankfurt (eu-central-1) hosten, druckfertige 300-dpi-PDFs per Lambda — OpenNext serverless.",
      stack: ["OpenNext", "Lambda", "CloudFront", "Frankfurt"],
      href: "https://qr-plakat.de",
      linkLabel: "qr-plakat.de",
     },
    ],
   },
   offer: {
    heading: "Erster Schritt",
    intro:
     "Das Gespräch klärt, ob ein AWS-Review der richtige nächste Kauf ist. Danach ein abgegrenztes Statement of Work.",
    rows: [
     [
      "Scope",
      "Ein Account oder ein Workload: Architektur, Kosten oder eine benannte Migration.",
     ],
     [
      "Liefergegenstände",
      "Schriftliche Befunde, ein Zielbild und die vereinbarte CDK- oder Migrationsarbeit.",
     ],
     ["Dauer", "Vereinbart im Statement of Work."],
     [
      "Nicht enthalten",
      "Body Leasing, 24/7-Betrieb und Arbeit außerhalb des benannten Accounts.",
     ],
     ["Preis", "Auf Anfrage."],
    ],
   },
   credential: {
    heading: "Dazu",
    links: [
     {
      label: "AWS Community Day Athen — AgentCore-Vortrag",
      href: "/talks-de/aws-community-day-athens-2026/",
     },
     { label: "Bauen mit Bedrock AgentCore", href: "/aws-agentcore/" },
    ],
   },
   deliverables: {
    heading: "Das bekommen Sie",
    items: [
     "AWS-Architektur-Review und Zielbild",
     "Infrastructure as Code mit AWS CDK",
     "Migrationsplanung und Umsetzung",
     "Kostenanalyse und Optimierung",
     "Security- und Compliance-Ausrichtung",
     "Schriftliches Statement of Work mit Festpreis",
    ],
   },
   service: true,
   testimonials: [
    {
     name: "Adrian Logan",
     href: "https://www.linkedin.com/in/adrian-logan-a52027b5",
     image: testimonialAdrian,
     paragraphs: [
      "Ich kann Martin Müller für seine herausragende Arbeit beim Aufbau unseres Web-Application-Backends mit AWS CDK nicht genug empfehlen.",
      "Die Qualität seiner Arbeit ist durchweg erstklassig.",
     ],
    },
    {
     name: "Eric Amberg",
     href: "https://www.linkedin.com/in/ericamberg",
     image: testimonialEric,
     paragraphs: [
      "Martin hat die anspruchsvolle AWS-Infrastruktur für unsere Online-Lab-Umgebungen aufgebaut. Sehr gute Kommunikation und schnelle Umsetzung.",
      "Seine Konzepte sind skalierbar und entsprechen Best Practices.",
     ],
    },
   ],
   contact: {
    heading: "Erzählen Sie mir von Ihrem AWS-Projekt",
    form: formLabelsDe,
   },
  },
 },
 seoGeo: {
  en: {
   meta: {
    title: "Technical SEO for JavaScript and SaaS",
    description:
     "Technical SEO for JavaScript and SaaS sites, implementation included. Audit, prioritized fixes, and a fixed-scope Statement of Work.",
    keywords: [
     "technical SEO",
     "JavaScript SEO",
     "SaaS SEO",
     "SEO audit",
     "canonical tags",
    ],
    locale: "en_US",
    language: "en",
    gerUrl: "/one-man-agency-de/seo-geo/",
   },
   langSwitch: { label: "Deutsch", href: "/one-man-agency-de/seo-geo/" },
   hubLink: {
    label: "← Full One-Man Agency overview",
    href: "/one-man-agency/",
   },
   hero: {
    title: "Technical SEO for JavaScript and SaaS",
    subtitle:
     "For a SaaS team whose JavaScript site is hard to crawl, index, or explain. Audit plus implementation, not a slide deck.",
    ctaSpeak: "🗣️ Book a call",
    ctaWrite: "📝 Or send a message",
   },
   audience: {
    heading: "Who this is for",
    who: "A founder or marketing lead on a JavaScript or SaaS site who needs technical SEO done in the codebase, not only recommended.",
    trigger:
     "The trigger is wrong canonicals, a sitemap or rendering setup crawlers miss, or a launch that search still does not see.",
    work:
     "I audit the rendered HTML and the repo, then implement the prioritized fixes we agree in the Statement of Work.",
   },
   caseStudy: {
    heading: "HalloCasa",
    paragraphs: [
     "HalloCasa needed a technical SEO audit and a prioritized roadmap: crawl and index basics, market visibility, and what to fix first in a Next.js site.",
     "The delivery was the audit and that roadmap. This page does not claim a measured traffic or ranking change.",
    ],
    link: {
     label: "How the HalloCasa audit was run",
     href: "/sistrix-mcp-hallocasa-seo/",
    },
   },
   offer: {
    heading: "First step",
    intro:
     "The call is to see whether a technical SEO pass is the right next purchase. After that, a bounded Statement of Work.",
    rows: [
     [
      "Scope",
      "One JavaScript or SaaS site: crawl, index, canonicals, and the pages that should rank.",
     ],
     [
      "Deliverables",
      "Audit notes plus the prioritized fixes we implement in the repo.",
     ],
     ["Turnaround", "Agreed in the Statement of Work."],
     [
      "Exclusions",
      "Content writing for a new article series, link buying, and ranking guarantees.",
     ],
     ["Price", "On request."],
    ],
   },
   definition: {
    heading: "What this engagement is",
    paragraphs: [
     "Technical SEO for JavaScript and SaaS sites: the HTML a crawler actually receives, canonicals, hreflang, sitemaps, and indexable pages — with implementation included.",
     "Google’s AI features use those same basics. The work is the crawlable page and the fix in the repo, not a separate AI markup project.",
    ],
   },
   faqs: [
    {
     q: "What is GEO SEO?",
     a: "GEO SEO (Generative Engine Optimization) is the work of being named in AI answers — ChatGPT, Google AI Overviews, and similar systems — in addition to classic Google rankings.",
    },
    {
     q: "What is the difference between SEO and GEO?",
     a: "SEO targets a ranking on the results page. GEO targets a citation inside the answer itself. Both need a crawlable page, one clear question, and a direct answer.",
    },
    {
     q: "What should a page include so an AI answer can cite it?",
     a: "The question in the title, the answer in the opening paragraphs, sourced facts, and an FAQ for follow-ups. A page without that answer gives the model nothing to cite.",
    },
    {
     q: "Do I need both SEO and GEO?",
     a: "Yes. Without an indexable page there is nothing to cite. GEO does not replace SEO.",
    },
   ],
   faqHeading: "GEO SEO questions",
   service: true,
   deliverables: {
    heading: "What you get",
    items: [
     "Technical SEO audit with prioritized fixes",
     "GEO strategy for AI answer visibility",
     "Keyword and competitor gap analysis",
     "Content and structure recommendations",
     "Measurable KPIs and reporting setup",
     "Written Statement of Work — see example SoW",
    ],
   },
   sowExample: {
    label: "📄 SEO/GEO Strategy SoW (redacted)",
    href: "/one-man-agency/sow-seo-geo-redacted-example.pdf",
   },
   testimonials: [],
   contact: {
    heading: "Tell me about your visibility goals",
    form: formLabelsEn,
   },
  },
  de: {
   meta: {
    title: "Technisches SEO und GEO für JavaScript- und SaaS-Seiten",
    description:
     "Technisches SEO für JavaScript- und SaaS-Seiten, inklusive Umsetzung. Audit, priorisierte Fixes und ein festes Statement of Work.",
    keywords: [
     "technisches SEO",
     "JavaScript SEO",
     "SaaS SEO",
     "SEO Audit",
     "Canonical Tags",
    ],
    locale: "de_DE",
    language: "de",
    engUrl: "/one-man-agency/seo-geo/",
   },
   langSwitch: { label: "English", href: "/one-man-agency/seo-geo/" },
   hubLink: {
    label: "← Zur vollständigen One-Man-Agency-Übersicht",
    href: "/one-man-agency-de/",
   },
   hero: {
    title: "Technisches SEO für JavaScript und SaaS",
    subtitle:
     "Für ein SaaS-Team, dessen JavaScript-Seite schwer zu crawlen, zu indexieren oder zu erklären ist. Audit plus Umsetzung, kein Foliensatz.",
    ctaSpeak: "🗣️ Termin buchen",
    ctaWrite: "📝 Oder Nachricht senden",
   },
   audience: {
    heading: "Für wen",
    who: "Gründer oder Marketing-Verantwortliche einer JavaScript- oder SaaS-Seite, die technisches SEO im Code brauchen, nicht nur als Empfehlung.",
    trigger:
     "Der Auslöser sind falsche Canonicals, eine Sitemap oder ein Rendering, das Crawler verfehlen, oder ein Launch, den die Suche nicht sieht.",
    work:
     "Ich prüfe das ausgelieferte HTML und das Repo und setze die priorisierten Fixes um, die wir im Statement of Work festlegen.",
   },
   caseStudy: {
    heading: "HalloCasa",
    paragraphs: [
     "HalloCasa brauchte ein technisches SEO-Audit und eine priorisierte Roadmap: Crawl- und Index-Grundlagen, Sichtbarkeit je Markt, und was in einer Next.js-Seite zuerst zu fixen ist.",
     "Geliefert wurden das Audit und diese Roadmap. Diese Seite behauptet keine gemessene Traffic- oder Ranking-Änderung.",
    ],
    link: {
     label: "Wie das HalloCasa-Audit lief",
     href: "/sistrix-mcp-hallocasa-seo-de/",
    },
   },
   offer: {
    heading: "Erster Schritt",
    intro:
     "Das Gespräch klärt, ob ein technischer SEO-Durchgang der richtige nächste Kauf ist. Danach ein abgegrenztes Statement of Work.",
    rows: [
     [
      "Scope",
      "Eine JavaScript- oder SaaS-Seite: Crawl, Index, Canonicals und die Seiten, die ranken sollen.",
     ],
     [
      "Liefergegenstände",
      "Audit-Notizen plus die priorisierten Fixes, die wir im Repo umsetzen.",
     ],
     ["Dauer", "Vereinbart im Statement of Work."],
     ["Nicht enthalten", "Neue Artikelserien, Linkkauf und Ranking-Garantien."],
     ["Preis", "Auf Anfrage."],
    ],
   },
   definition: {
    heading: "Worum es geht",
    paragraphs: [
     "Technisches SEO für JavaScript- und SaaS-Seiten: das HTML, das ein Crawler wirklich bekommt, Canonicals, hreflang, Sitemaps und indexierbare Seiten — inklusive Umsetzung.",
     "Googles KI-Funktionen nutzen dieselben Grundlagen. Die Arbeit ist die crawlbare Seite und der Fix im Repo, kein separates KI-Markup-Projekt.",
    ],
   },
   faqs: [
    {
     q: "Was ist GEO SEO?",
     a: "GEO SEO (Generative Engine Optimization) ist die Arbeit daran, in KI-Antworten genannt zu werden — ChatGPT, Google AI Overviews und ähnliche Systeme — zusätzlich zu klassischen Google-Rankings.",
    },
    {
     q: "Was ist der Unterschied zwischen SEO und GEO?",
     a: "SEO zielt auf ein Ranking in der Ergebnisliste. GEO zielt auf ein Zitat in der Antwort selbst. Beides braucht eine crawlbare Seite, eine klare Frage und eine direkte Antwort.",
    },
    {
     q: "Was sollte eine Seite enthalten, damit eine KI-Antwort sie zitieren kann?",
     a: "Die Frage im Titel, die Antwort in den ersten Absätzen, belegte Fakten und eine FAQ für Folgefragen. Eine Seite ohne diese Antwort gibt dem Modell nichts zu zitieren.",
    },
    {
     q: "Brauche ich SEO und GEO?",
     a: "Ja. Ohne indexierbare Seite gibt es nichts zu zitieren. GEO ersetzt SEO nicht.",
    },
   ],
   faqHeading: "Fragen zu GEO SEO",
   service: true,
   deliverables: {
    heading: "Das bekommen Sie",
    items: [
     "Technisches SEO-Audit mit priorisierten Fixes",
     "GEO-Strategie für KI-Antwort-Sichtbarkeit",
     "Keyword- und Wettbewerbs-Gap-Analyse",
     "Content- und Struktur-Empfehlungen",
     "Messbare KPIs und Reporting-Setup",
     "Schriftliches Statement of Work — Beispiel-SoW ansehen",
    ],
   },
   sowExample: {
    label: "📄 SEO/GEO-Strategie SoW (anonymisiert)",
    href: "/one-man-agency/sow-seo-geo-redacted-example.pdf",
   },
   testimonials: [],
   contact: {
    heading: "Schildern Sie mir Ihre Sichtbarkeitsziele",
    form: formLabelsDe,
   },
  },
 },
 gpt: {
  en: {
   meta: {
    title: "ChatGPT Ads — Campaigns, Tracking & Conversions",
    description:
     "ChatGPT Ads campaign setup, pixel and CAPI conversion tracking, intent landing pages, and optimization for booked appointments. Fixed-scope SoW, no agency markup.",
    keywords: [
     "ChatGPT Ads",
     "OpenAI Ads",
     "conversion tracking",
     "campaign setup",
     "CAPI tracking",
    ],
    locale: "en_US",
    language: "en",
    gerUrl: "/one-man-agency-de/gpt/",
   },
   langSwitch: { label: "Deutsch", href: "/one-man-agency-de/gpt/" },
   hubLink: {
    label: "← Full One-Man Agency overview",
    href: "/one-man-agency/",
   },
   hero: {
    title: "ChatGPT Ads",
    subtitle:
     "Paid ads in ChatGPT with reliable conversion tracking — pixel, CAPI, intent landings, and optimization for booked calls. One senior expert, fixed scope and price.",
    ctaSpeak: "🗣️ Book a call",
    ctaWrite: "📝 Or send a message",
   },
   deliverables: {
    heading: "What you get",
    items: [
     "ChatGPT Ads Manager campaign setup",
     "OpenAI pixel and CAPI conversion tracking",
     "Calendly integration with appointment_scheduled events",
     "Intent landing pages aligned to your ad groups",
     "Creative and copy recommendations",
     "Reporting and optimization roadmap",
     "Written Statement of Work with fixed price",
    ],
   },
   testimonials: [],
   faqs: [
    {
     q: "What are ChatGPT Ads?",
     a: "ChatGPT Ads are sponsored cards below the assistant's answer. They match the conversation, not a keyword on a search results page.",
    },
    {
     q: "When did ChatGPT Ads launch in Europe?",
     a: "ChatGPT Ads have been live in Europe since August 2026.",
    },
    {
     q: "How are ChatGPT Ads different from Google Ads?",
     a: "Google Ads match keywords on a results page. ChatGPT Ads match the ongoing chat. The people there are already using ChatGPT web.",
    },
    {
     q: "Do ChatGPT Ads need a large budget?",
     a: "No. A small budget is enough to learn placement and creative, then measure email, Calendly, and real conversations.",
    },
   ],
   faqHeading: "ChatGPT Ads questions",
   relatedPost: {
    label: "Field notes: what I learned from my first ChatGPT Ads campaign",
    href: "/chatgpt-ads-learnings/",
   },
   contact: {
    heading: "Tell me about your ChatGPT Ads goals",
    form: formLabelsEn,
   },
  },
  de: {
   meta: {
    title: "ChatGPT Ads — Kampagnen, Tracking & Conversions",
    description:
     "ChatGPT Ads Kampagnen-Setup, Pixel- und CAPI-Tracking, Intent-Landings und Optimierung auf gebuchte Termine. Festes Statement of Work, kein Agentur-Aufschlag.",
    keywords: [
     "ChatGPT Ads",
     "OpenAI Ads",
     "ChatGPT Werbung",
     "Conversion Tracking",
     "Kampagnen-Setup",
    ],
    locale: "de_DE",
    language: "de",
    engUrl: "/one-man-agency/gpt/",
   },
   langSwitch: { label: "English", href: "/one-man-agency/gpt/" },
   hubLink: {
    label: "← Zur vollständigen One-Man-Agency-Übersicht",
    href: "/one-man-agency-de/",
   },
   hero: {
    title: "ChatGPT Ads",
    subtitle:
     "Bezahlte Anzeigen in ChatGPT mit zuverlässigem Conversion-Tracking — Pixel, CAPI, Intent-Landings und Optimierung auf gebuchte Termine. Ein Senior-Experte, fester Scope und Festpreis.",
    ctaSpeak: "🗣️ Termin buchen",
    ctaWrite: "📝 Oder Nachricht senden",
   },
   deliverables: {
    heading: "Das bekommen Sie",
    items: [
     "ChatGPT Ads Manager Kampagnen-Setup",
     "OpenAI Pixel und CAPI Conversion-Tracking",
     "Calendly-Integration mit appointment_scheduled Events",
     "Intent-Landingpages passend zu Ihren Anzeigengruppen",
     "Creative- und Copy-Empfehlungen",
     "Reporting und Optimierungs-Roadmap",
     "Schriftliches Statement of Work mit Festpreis",
    ],
   },
   testimonials: [],
   faqs: [
    {
     q: "Was sind ChatGPT Ads?",
     a: "ChatGPT Ads sind gesponserte Karten unter der Antwort des Assistenten. Sie matchen das Gespräch, nicht ein Keyword auf einer Suchergebnisseite.",
    },
    {
     q: "Seit wann gibt es ChatGPT Ads in Europa?",
     a: "ChatGPT Ads sind seit August 2026 in Europa live.",
    },
    {
     q: "Wie unterscheiden sich ChatGPT Ads von Google Ads?",
     a: "Google Ads matchen Keywords auf einer Suchergebnisseite. ChatGPT Ads matchen den laufenden Chat. Die Leute dort nutzen bereits ChatGPT Web.",
    },
    {
     q: "Braucht man für ChatGPT Ads ein großes Budget?",
     a: "Nein. Ein kleines Budget reicht, um Placement und Creative zu lernen. Gemessen werden E-Mail, Calendly und echte Gespräche.",
    },
   ],
   faqHeading: "Fragen zu ChatGPT Ads",
   service: true,
   relatedPost: {
    label:
     "Feldnotizen: Was ich aus meiner ersten ChatGPT-Ads-Kampagne gelernt habe",
    href: "/chatgpt-ads-learnings-de/",
   },
   contact: {
    heading: "Schildern Sie mir Ihre ChatGPT Ads Ziele",
    form: formLabelsDe,
   },
  },
 },
 vibeCoding: {
  en: {
   meta: {
    title: "Vibe Coding & DevOps — Production Readiness & Security",
    description:
     "Turn AI-assisted prototypes into production-ready systems. DevOps, security audits, monitoring, GDPR-compliant hosting in EU.",
    keywords: [
     "vibe coding",
     "DevOps",
     "production readiness",
     "security audit",
     "Hetzner hosting",
    ],
    locale: "en_US",
    language: "en",
    gerUrl: "/one-man-agency-de/vibe-coding/",
   },
   langSwitch: { label: "Deutsch", href: "/one-man-agency-de/vibe-coding/" },
   hubLink: {
    label: "← Full One-Man Agency overview",
    href: "/one-man-agency/",
   },
   hero: {
    title: "Vibe Coding → Production",
    subtitle:
     "For a founder whose AI prototype has to go live: secure, observable, and deployable on infrastructure you can point to.",
    ctaSpeak: "🗣️ Book a call",
    ctaWrite: "📝 Or send a message",
    video: {
     src: "/one-man-agency/vibe-promo.mp4?v=2",
     poster: "/one-man-agency/vibe-promo.jpg",
     title: "Your vibe-coded idea, taken to production",
    },
   },
   audience: {
    heading: "Who this is for",
    who: "A founder who shipped a prototype with AI tools and now needs a production launch: hosting, deploys, monitoring, and a security pass.",
    trigger:
     "The trigger is a demo that must become production, a stack that only the author can deploy, or a customer who asked where the data lives.",
    work:
     "I review the launch path or build it: EU hosting, pipelines, monitoring, and the security work named in the Statement of Work.",
   },
   caseStudy: {
    heading: "Arc Rider",
    paragraphs: [
     "Arc Rider needed a GDPR-conscious production home in Germany for a React and Supabase product, without handing operations to a platform the team could not inspect.",
     "The work was a self-hosted production environment on Hetzner, self-hosted Supabase, deploy automation the team can run with AI agents, Grafana monitoring, and a security audit.",
     "The outcome was a production setup the team maintains. Jakob Jordan’s note on this page is the approved account of that work.",
    ],
   },
   offer: {
    heading: "First step",
    intro:
     "The call is to see whether a production-readiness review is the right next purchase. After that, a bounded Statement of Work.",
    rows: [
     [
      "Scope",
      "One product: the path from the current prototype to a named production environment.",
     ],
     [
      "Deliverables",
      "Review notes or the agreed hosting, deploy, monitoring, and security work.",
     ],
     ["Turnaround", "Agreed in the Statement of Work."],
     [
      "Exclusions",
      "Ongoing on-call, feature development outside the launch, and unnamed third-party migrations.",
     ],
     ["Price", "On request."],
    ],
   },
   deliverables: {
    heading: "What you get",
    items: [
     "Production readiness review",
     "Security audit and hardening",
     "CI/CD and deployment pipelines",
     "Monitoring with Grafana or similar",
     "GDPR-compliant EU hosting (e.g. Hetzner)",
     "Infrastructure your AI agents can maintain",
    ],
   },
   sowExample: {
    label: "📄 Security Audit SoW template (redacted)",
    href: "/one-man-agency/sow-security-audit-template-redacted.pdf",
   },
   testimonials: [
    {
     name: "Jakob Jordan",
     href: "https://www.linkedin.com/in/jakob-jordan-10404bb4/",
     image: testimonialJakob,
     paragraphs: [
      "Martin built a fully GDPR-compliant, self-hosted production environment on Hetzner in Germany for our Arc Rider platform — including Grafana monitoring and an essential security audit.",
      "He set up the infrastructure so we can maintain and deploy it seamlessly through AI agents.",
     ],
    },
   ],
   contact: { heading: "Tell me about your stack", form: formLabelsEn },
  },
  de: {
   meta: {
    title: "Vibe Coding in Produktion: Security, Deploy, EU-Hosting",
    description:
     "KI-Prototypen produktionsreif machen. DevOps, Security Audits, Monitoring, DSGVO-konformes Hosting in der EU.",
    keywords: [
     "Vibe Coding",
     "DevOps",
     "Production Readiness",
     "Security Audit",
     "Hetzner Hosting",
    ],
    locale: "de_DE",
    language: "de",
    engUrl: "/one-man-agency/vibe-coding/",
   },
   langSwitch: { label: "English", href: "/one-man-agency/vibe-coding/" },
   hubLink: {
    label: "← Zur vollständigen One-Man-Agency-Übersicht",
    href: "/one-man-agency-de/",
   },
   hero: {
    title: "Vibe Coding → Produktion",
    subtitle:
     "Für Gründer, deren KI-Prototyp live gehen muss: sicher, beobachtbar und deploybar auf Infrastruktur, auf die man zeigen kann.",
    ctaSpeak: "🗣️ Termin buchen",
    ctaWrite: "📝 Oder Nachricht senden",
   },
   audience: {
    heading: "Für wen",
    who: "Ein Gründer, der einen Prototyp mit KI-Werkzeugen gebaut hat und jetzt einen Produktionsstart braucht: Hosting, Deploys, Monitoring und einen Security-Pass.",
    trigger:
     "Der Auslöser ist eine Demo, die Produktion werden muss, ein Stack, den nur der Autor deployen kann, oder ein Kunde, der fragt, wo die Daten liegen.",
    work:
     "Ich prüfe den Weg zum Launch oder baue ihn: EU-Hosting, Pipelines, Monitoring und die Security-Arbeit aus dem Statement of Work.",
   },
   caseStudy: {
    heading: "Arc Rider",
    paragraphs: [
     "Arc Rider brauchte ein DSGVO-bewusstes Produktions-Zuhause in Deutschland für ein React- und Supabase-Produkt, ohne den Betrieb an eine Plattform abzugeben, die das Team nicht prüfen kann.",
     "Die Arbeit war eine selbst gehostete Produktionsumgebung auf Hetzner, selbst gehostetes Supabase, Deploy-Automatisierung, die das Team mit KI-Agenten fahren kann, Grafana-Monitoring und ein Security Audit.",
     "Das Ergebnis ist ein Produktions-Setup, das das Team selbst wartet. Jakob Jordans Zitat auf dieser Seite ist die freigegebene Schilderung.",
    ],
   },
   offer: {
    heading: "Erster Schritt",
    intro:
     "Das Gespräch klärt, ob ein Production-Readiness-Review der richtige nächste Kauf ist. Danach ein abgegrenztes Statement of Work.",
    rows: [
     [
      "Scope",
      "Ein Produkt: der Weg vom aktuellen Prototyp zu einer benannten Produktionsumgebung.",
     ],
     [
      "Liefergegenstände",
      "Review-Notizen oder das vereinbarte Hosting, Deploy, Monitoring und die Security-Arbeit.",
     ],
     ["Dauer", "Vereinbart im Statement of Work."],
     [
      "Nicht enthalten",
      "Dauerhafte Rufbereitschaft, Feature-Entwicklung außerhalb des Launches und unbenannte Dritt-Migrationen.",
     ],
     ["Preis", "Auf Anfrage."],
    ],
   },
   deliverables: {
    heading: "Das bekommen Sie",
    items: [
     "Production-Readiness-Review",
     "Security Audit und Härtung",
     "CI/CD und Deployment-Pipelines",
     "Monitoring mit Grafana oder ähnlich",
     "DSGVO-konformes EU-Hosting (z. B. Hetzner)",
     "Infrastruktur, die Ihre KI-Agenten warten können",
    ],
   },
   sowExample: {
    label: "📄 Security-Audit SoW-Vorlage (anonymisiert)",
    href: "/one-man-agency/sow-security-audit-template-redacted.pdf",
   },
   testimonials: [
    {
     name: "Jakob Jordan",
     href: "https://www.linkedin.com/in/jakob-jordan-10404bb4/",
     image: testimonialJakob,
     paragraphs: [
      "Martin hat eine vollständig DSGVO-konforme, selbst gehostete Produktionsumgebung auf Hetzner in Deutschland aufgebaut — inklusive Grafana-Monitoring und Security Audit.",
      "Die Infrastruktur ist so aufgesetzt, dass wir sie nahtlos über KI-Agenten warten und deployen können.",
     ],
    },
   ],
   service: true,
   contact: { heading: "Erzählen Sie mir von Ihrem Stack", form: formLabelsDe },
  },
 },
 securityAudit: {
  en: {
   meta: {
    title: "Security Audit — App & Cloud, Fixed Scope",
    description:
     "Security audit for web apps and cloud estates: findings, risk prioritization, and remediation guidance. Written Statement of Work, no agency markup.",
    keywords: [
     "security audit",
     "cloud security",
     "application security",
     "AWS security",
     "Prowler",
     "compliance review",
    ],
    locale: "en_US",
    language: "en",
    gerUrl: "/one-man-agency-de/security-audit/",
   },
   langSwitch: {
    label: "Deutsch",
    href: "/one-man-agency-de/security-audit/",
   },
   hubLink: {
    label: "← Full One-Man Agency overview",
    href: "/one-man-agency/",
   },
   hero: {
    title: "Security Audit",
    subtitle:
     "For a team that needs an independent security pass before launch, procurement, or insurance — one senior reviewer, scope fixed in a Statement of Work.",
    ctaSpeak: "🗣️ Book a call",
    ctaWrite: "📝 Or send a message",
   },
   audience: {
    heading: "Who this is for",
    who:
     "A SaaS or product team with a live or near-live stack on AWS, Kubernetes, or VPS — and no clear picture of exposure, secrets, or blast radius.",
    trigger:
     "The trigger is a customer questionnaire, a cyber-insurance assessment, an incident scare, or a launch date with no security sign-off.",
    work:
     "I review the agreed surface (app, API, IAM, network, CI) and deliver prioritized findings plus what to fix first — or implement fixes when the SoW says so. For multi-cloud estates I use Prowler (open source and Prowler Cloud) on AWS, Azure, GCP, and Microsoft 365.",
   },
   definition: {
    heading: "Tools",
    paragraphs: [
     "Reviews combine manual app and architecture work with automation where it speeds coverage. Prowler is one of the tools I use for cloud posture — the same family I run in production for HDI Cyquins (German cyber-insurance assessments).",
    ],
    link: {
     label: "HDI Cyquins case on my AWS page",
     href: "/one-man-agency/aws/#hdi-cyquins",
    },
   },
   offer: {
    heading: "First step",
    intro:
     "The call scopes the audit boundary. After that, a bounded Statement of Work with deliverables and price.",
    rows: [
     [
      "Scope",
      "One product or one cloud account: named environments, repos, and attack surfaces.",
     ],
     [
      "Deliverables",
      "Written findings, severity ranking, remediation notes, and optional re-test window.",
     ],
     ["Turnaround", "Agreed in the Statement of Work."],
     [
      "Exclusions",
      "Penetration testing beyond agreed scope, 24/7 SOC, and unnamed systems.",
     ],
     ["Price", "On request."],
    ],
   },
   credential: {
    heading: "Related",
    links: [
     { label: "ai-secure.dev — compliance agents I ship", href: "https://ai-secure.dev" },
     { label: "Vibe Coding → production + security", href: "/one-man-agency/vibe-coding/" },
    ],
   },
   deliverables: {
    heading: "What you get",
    items: [
     "Threat-oriented review of app and API surfaces",
     "Cloud IAM, secrets, and network exposure check",
     "Multi-cloud scans with Prowler when AWS, Azure, GCP, or M365 are in scope",
     "Dependency and configuration risk notes",
     "Prioritized findings (critical → low) with fix guidance",
     "Executive summary for stakeholders",
     "Written Statement of Work with fixed price",
    ],
   },
   sowExample: {
    label: "📄 Security Audit SoW template (redacted)",
    href: "/one-man-agency/sow-security-audit-template-redacted.pdf",
   },
   testimonials: [
    {
     name: "Jakob Jordan",
     href: "https://www.linkedin.com/in/jakob-jordan-10404bb4/",
     image: testimonialJakob,
     paragraphs: [
      "Martin built our production environment on Hetzner in Germany — including Grafana monitoring and an essential security audit.",
      "The infrastructure is set up so we can maintain and deploy it through AI agents.",
     ],
    },
   ],
   service: true,
   contact: { heading: "Tell me what you need reviewed", form: formLabelsEn },
  },
  de: {
   meta: {
    title: "Security Audit — App & Cloud, fester Scope",
    description:
     "Security Audit für Web-Apps und Cloud: Findings, Risiko-Priorisierung, Remediation. Schriftliches Statement of Work, kein Agentur-Aufschlag.",
    keywords: [
     "Security Audit",
     "Cloud Security",
     "Application Security",
     "AWS Security",
     "Prowler",
     "Compliance Review",
    ],
    locale: "de_DE",
    language: "de",
    engUrl: "/one-man-agency/security-audit/",
   },
   langSwitch: {
    label: "English",
    href: "/one-man-agency/security-audit/",
   },
   hubLink: {
    label: "← Zur vollständigen One-Man-Agency-Übersicht",
    href: "/one-man-agency-de/",
   },
   hero: {
    title: "Security Audit",
    subtitle:
     "Für Teams, die vor Launch, Beschaffung oder Versicherung einen unabhängigen Security-Pass brauchen — ein Senior-Reviewer, Scope im Statement of Work.",
    ctaSpeak: "🗣️ Termin buchen",
    ctaWrite: "📝 Oder Nachricht senden",
   },
   audience: {
    heading: "Für wen",
    who:
     "Ein SaaS- oder Produktteam mit Live- oder Near-Live-Stack auf AWS, Kubernetes oder VPS — ohne klares Bild von Exposure, Secrets oder Blast Radius.",
    trigger:
     "Auslöser: Kundenfragebogen, Cyber-Versicherungs-Assessment, Incident-Schrecken oder Launch ohne Security-Sign-off.",
    work:
     "Ich prüfe die vereinbarte Oberfläche (App, API, IAM, Netz, CI) und liefere priorisierte Findings plus Fix-Reihenfolge — oder setze Fixes um, wenn das SoW das sagt. Für Multi-Cloud-Landschaften nutze ich Prowler (Open Source und Prowler Cloud) für AWS, Azure, GCP und Microsoft 365.",
   },
   definition: {
    heading: "Werkzeuge",
    paragraphs: [
     "Reviews kombinieren manuelle App- und Architektur-Arbeit mit Automation, wo sie Abdeckung beschleunigt. Prowler ist eines der Tools für Cloud-Posture — dieselbe Familie, die ich in Produktion für HDI Cyquins (deutsche Cyber-Versicherungs-Assessments) betreibe.",
    ],
    link: {
     label: "HDI-Cyquins-Case auf meiner AWS-Seite",
     href: "/one-man-agency-de/aws/#hdi-cyquins",
    },
   },
   offer: {
    heading: "Erster Schritt",
    intro:
     "Im Gespräch wird die Audit-Grenze gezogen. Danach ein abgegrenztes Statement of Work mit Liefergegenständen und Preis.",
    rows: [
     [
      "Scope",
      "Ein Produkt oder ein Cloud-Account: benannte Umgebungen, Repos und Angriffsflächen.",
     ],
     [
      "Liefergegenstände",
      "Schriftliche Findings, Severity-Ranking, Remediation-Notizen, optional Re-Test-Fenster.",
     ],
     ["Dauer", "Vereinbart im Statement of Work."],
     [
      "Nicht enthalten",
      "Pentest außerhalb des Scopes, 24/7-SOC und unbenannte Systeme.",
     ],
     ["Preis", "Auf Anfrage."],
    ],
   },
   credential: {
    heading: "Dazu",
    links: [
     { label: "ai-secure.dev — Compliance-Agents, die ich betreibe", href: "https://ai-secure.dev" },
     { label: "Vibe Coding → Produktion + Security", href: "/one-man-agency-de/vibe-coding/" },
    ],
   },
   deliverables: {
    heading: "Das bekommen Sie",
    items: [
     "Threat-orientiertes Review von App- und API-Oberflächen",
     "Check von Cloud-IAM, Secrets und Netz-Exposure",
     "Multi-Cloud-Scans mit Prowler, wenn AWS, Azure, GCP oder M365 im Scope sind",
     "Notizen zu Dependency- und Config-Risiken",
     "Priorisierte Findings (kritisch → niedrig) mit Fix-Hinweisen",
     "Executive Summary für Stakeholder",
     "Schriftliches Statement of Work mit Festpreis",
    ],
   },
   sowExample: {
    label: "📄 Security-Audit SoW-Vorlage (anonymisiert)",
    href: "/one-man-agency/sow-security-audit-template-redacted.pdf",
   },
   testimonials: [
    {
     name: "Jakob Jordan",
     href: "https://www.linkedin.com/in/jakob-jordan-10404bb4/",
     image: testimonialJakob,
     paragraphs: [
      "Martin hat unsere Produktionsumgebung auf Hetzner aufgebaut — inklusive Grafana-Monitoring und einem wichtigen Security Audit.",
      "Die Infrastruktur ist so aufgesetzt, dass wir sie über KI-Agenten warten und deployen können.",
     ],
    },
   ],
   service: true,
   contact: {
    heading: "Was soll geprüft werden?",
    form: formLabelsDe,
   },
  },
 },
 devopsAudit: {
  en: {
   meta: {
    title: "DevOps Audit — CI/CD, Observability & Ops Readiness",
    description:
     "DevOps audit for teams shipping on AWS or EU VPS: pipelines, deploy safety, monitoring, and runbooks. Fixed-scope Statement of Work.",
    keywords: [
     "DevOps audit",
     "CI/CD review",
     "production readiness",
     "observability",
     "AWS DevOps",
    ],
    locale: "en_US",
    language: "en",
    gerUrl: "/one-man-agency-de/devops-audit/",
   },
   langSwitch: {
    label: "Deutsch",
    href: "/one-man-agency-de/devops-audit/",
   },
   hubLink: {
    label: "← Full One-Man Agency overview",
    href: "/one-man-agency/",
   },
   hero: {
    title: "DevOps Audit",
    subtitle:
     "For a team whose deploys are manual, opaque, or scary — one senior DevOps review with a clear remediation roadmap, scoped in a Statement of Work.",
    ctaSpeak: "🗣️ Book a call",
    ctaWrite: "📝 Or send a message",
   },
   audience: {
    heading: "Who this is for",
    who:
     "A product team that ships but cannot explain how production is deployed, rolled back, or observed — or that relies on one person’s laptop scripts.",
    trigger:
     "The trigger is a failed release, missing monitoring, an audit asking for change control, or growth that outgrew the original setup.",
    work:
     "I map the current path to production, score gaps (CI/CD, env parity, secrets, alerts), and deliver a prioritized fix list — or implement the SoW work.",
   },
   offer: {
    heading: "First step",
    intro:
     "The call names the system under review. After that, a bounded Statement of Work.",
    rows: [
     [
      "Scope",
      "One product line: repos, pipelines, hosting, and on-call reality as it exists today.",
     ],
     [
      "Deliverables",
      "Ops maturity notes, gap analysis, and an ordered remediation plan (or agreed implementation).",
     ],
     ["Turnaround", "Agreed in the Statement of Work."],
     [
      "Exclusions",
      "24/7 on-call takeover, greenfield rewrites, and work outside named repos or accounts.",
     ],
     ["Price", "On request."],
    ],
   },
   credential: {
    heading: "Related",
    links: [
     { label: "AWS consulting", href: "/one-man-agency/aws/" },
     { label: "Vibe Coding → full production build", href: "/one-man-agency/vibe-coding/" },
     {
      label: "Hetzner production case study",
      href: "/hetzner-eu-production/",
     },
    ],
   },
   deliverables: {
    heading: "What you get",
    items: [
     "Deploy and release process review",
     "CI/CD pipeline and branch strategy assessment",
     "Infrastructure-as-code and environment drift notes",
     "Monitoring, alerting, and runbook gaps",
     "Backup, rollback, and incident-readiness checklist",
     "Written Statement of Work with fixed price",
    ],
   },
   testimonials: [
    {
     name: "Eric Amberg",
     href: "https://www.linkedin.com/in/ericamberg",
     image: testimonialEric,
     paragraphs: [
      "Martin built the sophisticated AWS infrastructure for our online lab environments. Very good communication and a very fast implementation.",
      "His concepts are scalable and comply with best practices in cloud environments.",
     ],
    },
   ],
   service: true,
   contact: { heading: "Tell me about your deploy path", form: formLabelsEn },
  },
  de: {
   meta: {
    title: "DevOps Audit — CI/CD, Observability & Ops-Reife",
    description:
     "DevOps Audit für Teams auf AWS oder EU-VPS: Pipelines, Deploy-Sicherheit, Monitoring, Runbooks. Abgegrenztes Statement of Work.",
    keywords: [
     "DevOps Audit",
     "CI/CD Review",
     "Production Readiness",
     "Observability",
     "AWS DevOps",
    ],
    locale: "de_DE",
    language: "de",
    engUrl: "/one-man-agency/devops-audit/",
   },
   langSwitch: {
    label: "English",
    href: "/one-man-agency/devops-audit/",
   },
   hubLink: {
    label: "← Zur vollständigen One-Man-Agency-Übersicht",
    href: "/one-man-agency-de/",
   },
   hero: {
    title: "DevOps Audit",
    subtitle:
     "Für Teams, deren Deploys manuell, undurchsichtig oder riskant sind — ein Senior-DevOps-Review mit klarer Roadmap, Scope im Statement of Work.",
    ctaSpeak: "🗣️ Termin buchen",
    ctaWrite: "📝 Oder Nachricht senden",
   },
   audience: {
    heading: "Für wen",
    who:
     "Ein Produktteam, das shipped, aber nicht erklären kann, wie Produktion deployed, zurückgerollt oder beobachtet wird — oder das auf Laptop-Skripte einer Person setzt.",
    trigger:
     "Auslöser: fehlgeschlagenes Release, fehlendes Monitoring, Audit zu Change Control oder Wachstum über den ersten Setup hinaus.",
    work:
     "Ich mappe den Weg zur Produktion, bewerte Lücken (CI/CD, Env-Parität, Secrets, Alerts) und liefere eine priorisierte Fix-Liste — oder setze das SoW um.",
   },
   offer: {
    heading: "Erster Schritt",
    intro:
     "Im Gespräch wird das System benannt. Danach ein abgegrenztes Statement of Work.",
    rows: [
     [
      "Scope",
      "Eine Produktlinie: Repos, Pipelines, Hosting und On-Call-Realität heute.",
     ],
     [
      "Liefergegenstände",
      "Ops-Reife-Notizen, Gap-Analyse und priorisierter Remediation-Plan (oder vereinbarte Umsetzung).",
     ],
     ["Dauer", "Vereinbart im Statement of Work."],
     [
      "Nicht enthalten",
      "24/7-On-Call-Übernahme, Greenfield-Rewrites und Arbeit außerhalb benannter Repos oder Accounts.",
     ],
     ["Preis", "Auf Anfrage."],
    ],
   },
   credential: {
    heading: "Dazu",
    links: [
     { label: "AWS Consulting", href: "/one-man-agency-de/aws/" },
     {
      label: "Vibe Coding → kompletter Produktionsaufbau",
      href: "/one-man-agency-de/vibe-coding/",
     },
     {
      label: "Hetzner-Produktions-Fallstudie",
      href: "/hetzner-eu-production-de/",
     },
    ],
   },
   deliverables: {
    heading: "Das bekommen Sie",
    items: [
     "Review von Deploy- und Release-Prozess",
     "Bewertung von CI/CD-Pipeline und Branch-Strategie",
     "Notizen zu IaC und Environment-Drift",
     "Lücken bei Monitoring, Alerting und Runbooks",
     "Checkliste Backup, Rollback und Incident-Readiness",
     "Schriftliches Statement of Work mit Festpreis",
    ],
   },
   testimonials: [
    {
     name: "Eric Amberg",
     href: "https://www.linkedin.com/in/ericamberg",
     image: testimonialEric,
     paragraphs: [
      "Martin hat die anspruchsvolle AWS-Infrastruktur für unsere Online-Lab-Umgebungen aufgebaut. Sehr gute Kommunikation und schnelle Umsetzung.",
      "Seine Konzepte sind skalierbar und entsprechen Best Practices.",
     ],
    },
   ],
   service: true,
   contact: {
    heading: "Wie sieht Ihr Deploy-Pfad aus?",
    form: formLabelsDe,
   },
  },
 },
}
