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
     "Production-grade AWS architecture, CDK, migrations, and cost optimization — one senior expert, fixed scope and price.",
    ctaSpeak: "🗣️ Book a call",
    ctaWrite: "📝 Or send a message",
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
  },
  de: {
   meta: {
    title: "AWS Consulting — Architektur, CDK & Migration",
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
     "Produktionsreife AWS-Architektur, CDK, Migrationen und Kostenoptimierung — ein Senior-Experte, fester Scope und Festpreis.",
    ctaSpeak: "🗣️ Termin buchen",
    ctaWrite: "📝 Oder Nachricht senden",
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
    title: "GEO SEO — Visibility in Search and AI Answers",
    description:
     "GEO SEO for Google rankings and AI answers. Audits, citeable pages, and a fixed-scope statement of work.",
    keywords: [
     "GEO SEO",
     "SEO audit",
     "GEO strategy",
     "AI visibility",
     "search optimization",
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
    title: "GEO SEO",
    subtitle:
     "Get found in Google and in AI answers. Audits, citeable pages, and fixed-scope delivery.",
    ctaSpeak: "🗣️ Book a call",
    ctaWrite: "📝 Or send a message",
   },
   definition: {
    heading: "What GEO SEO is",
    paragraphs: [
     "GEO (Generative Engine Optimization) is visibility inside AI answers — ChatGPT, Google AI Overviews, Perplexity — in addition to the ten blue links. SEO stays the base: a page Google can crawl, one clear question, and a direct answer.",
     "What gets cited is a page that names the question in the title, answers it in the first paragraphs, shows the fact with a source, and covers follow-up questions in an FAQ. A thin page with no answer is not citeable.",
    ],
    link: {
     label: "Case study: SISTRIX MCP and HalloCasa",
     href: "/sistrix-mcp-hallocasa-seo/",
    },
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
    title: "GEO SEO — Sichtbarkeit in Suche und KI-Antworten",
    description:
     "GEO SEO für Google-Rankings und KI-Antworten. Audits, zitierbare Seiten und ein festes Statement of Work.",
    keywords: [
     "GEO SEO",
     "SEO Audit",
     "GEO Strategie",
     "KI Sichtbarkeit",
     "Suchmaschinenoptimierung",
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
    title: "GEO SEO",
    subtitle:
     "Gefunden werden in Google und in KI-Antworten. Audits, zitierbare Seiten, feste Scope-Lieferung.",
    ctaSpeak: "🗣️ Termin buchen",
    ctaWrite: "📝 Oder Nachricht senden",
   },
   definition: {
    heading: "Was GEO SEO ist",
    paragraphs: [
     "GEO (Generative Engine Optimization) ist Sichtbarkeit in KI-Antworten — ChatGPT, Google AI Overviews, Perplexity — zusätzlich zu den zehn blauen Links. SEO bleibt die Grundlage: eine crawlbare Seite, eine klare Frage, eine direkte Antwort.",
     "Zitiert wird eine Seite, die die Frage im Titel nennt, sie in den ersten Absätzen beantwortet, das Faktum mit Quelle zeigt und Folgefragen in einer FAQ abdeckt. Eine dünne Seite ohne diese Antwort ist nicht zitierbar.",
    ],
    link: {
     label: "Case Study: SISTRIX MCP und HalloCasa",
     href: "/sistrix-mcp-hallocasa-seo-de/",
    },
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
     "Shipped fast with AI — now make it secure, observable, and deployable. DevOps, security audits, and EU-compliant infrastructure.",
    ctaSpeak: "🗣️ Book a call",
    ctaWrite: "📝 Or send a message",
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
    title: "Vibe Coding & DevOps — Production Readiness & Security",
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
     "Schnell mit KI gebaut — jetzt sicher, überwacht und deploybar machen. DevOps, Security Audits und DSGVO-konforme EU-Infrastruktur.",
    ctaSpeak: "🗣️ Termin buchen",
    ctaWrite: "📝 Oder Nachricht senden",
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
   contact: { heading: "Erzählen Sie mir von Ihrem Stack", form: formLabelsDe },
  },
 },
}
