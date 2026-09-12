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
   hubLink: { label: "← Full One-Man Agency overview", href: "/one-man-agency/" },
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
   contact: { heading: "Erzählen Sie mir von Ihrem AWS-Projekt", form: formLabelsDe },
  },
 },
 seoGeo: {
  en: {
   meta: {
    title: "SEO & GEO Consulting — Visibility in Search & AI Answers",
    description:
     "SEO and GEO strategy for traditional search and AI answer engines. Audits, structured deliverables, fixed-scope SoW.",
    keywords: [
     "SEO audit",
     "GEO strategy",
     "AI visibility",
     "ChatGPT SEO",
     "search optimization",
    ],
    locale: "en_US",
    language: "en",
    gerUrl: "/one-man-agency-de/seo-geo/",
   },
   langSwitch: { label: "Deutsch", href: "/one-man-agency-de/seo-geo/" },
   hubLink: { label: "← Full One-Man Agency overview", href: "/one-man-agency/" },
   hero: {
    title: "SEO & GEO Strategy",
    subtitle:
     "Get found in Google and in AI answers (ChatGPT, Perplexity). Audits, actionable roadmaps, and fixed-scope delivery.",
    ctaSpeak: "🗣️ Book a call",
    ctaWrite: "📝 Or send a message",
   },
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
   contact: { heading: "Tell me about your visibility goals", form: formLabelsEn },
  },
  de: {
   meta: {
    title: "SEO & GEO Consulting — Sichtbarkeit in Suche & KI-Antworten",
    description:
     "SEO- und GEO-Strategie für klassische Suche und KI-Antworten. Audits, konkrete Deliverables, festes Statement of Work.",
    keywords: [
     "SEO Audit",
     "GEO Strategie",
     "KI Sichtbarkeit",
     "ChatGPT SEO",
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
    title: "SEO & GEO Strategie",
    subtitle:
     "Gefunden werden in Google und in KI-Antworten (ChatGPT, Perplexity). Audits, umsetzbare Roadmaps, feste Scope-Lieferung.",
    ctaSpeak: "🗣️ Termin buchen",
    ctaWrite: "📝 Oder Nachricht senden",
   },
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
   contact: { heading: "Schildern Sie mir Ihre Sichtbarkeitsziele", form: formLabelsDe },
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
   hubLink: { label: "← Full One-Man Agency overview", href: "/one-man-agency/" },
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
