import catalog from "./talksCatalog.json"

const PRESENTATIONS_BASE = "https://mmuller88.github.io/presentations"
const UTM = "utm_source=martinmueller&utm_medium=talks"

export const talkSlugs = catalog.talkSlugs
export const talks = catalog.talks

export function buildDeckUrl(slug) {
 return `${PRESENTATIONS_BASE}/${slug}/?${UTM}`
}

const catalogContent = {
 en: {
  meta: {
   title: "Talks — Martin Mueller",
   description:
    "Conference slide decks: AWS Community Day DACH, ServerlessDays Milano, KI Stammtisch. Practitioner talks on AI agents, OpenClaw, and AWS.",
   keywords: ["talks", "conference", "AWS", "OpenClaw", "AI agents", "slides"],
   locale: "en_US",
   language: "en",
   gerUrl: "/talks-de/",
  },
  langSwitch: { label: "Deutsch", href: "/talks-de/" },
  hero: {
   title: "Talks",
   subtitle:
    "Conference slide decks — AI agents, OpenClaw, AWS. Decks hosted on GitHub Pages; this site is the catalog.",
  },
  filterAll: "All topics",
  statusDelivered: "Delivered",
  statusUpcoming: "Upcoming",
  cardCta: "View slides",
  cardTeaser: "Coming soon",
  detailCta: "View slides on GitHub Pages",
  detailTeaser: "Slides will be published after the event.",
  feedLink: { label: "JSON feed", href: "/talks/feed.json" },
  relatedPostLabel: "Related blog post",
  eventSiteLabel: "Event website",
  durationLabel: "Duration",
  dateLabel: "Date",
  locationLabel: "Location",
  deckLanguageLabel: "Deck language",
 },
 de: {
  meta: {
   title: "Vorträge — Martin Mueller",
   description:
    "Konferenz-Folien: AWS Community Day DACH, ServerlessDays Milano, KI Stammtisch. Practitioner-Talks zu KI-Agenten, OpenClaw und AWS.",
   keywords: [
    "Vorträge",
    "Konferenz",
    "AWS",
    "OpenClaw",
    "KI-Agenten",
    "Folien",
   ],
   locale: "de_DE",
   language: "de",
   engUrl: "/talks/",
  },
  langSwitch: { label: "English", href: "/talks/" },
  hero: {
   title: "Vorträge",
   subtitle:
    "Konferenz-Folien — KI-Agenten, OpenClaw, AWS. Decks auf GitHub Pages; diese Seite ist der Katalog.",
  },
  filterAll: "Alle Themen",
  statusDelivered: "Gehalten",
  statusUpcoming: "Demnächst",
  cardCta: "Zu den Folien",
  cardTeaser: "Bald verfügbar",
  detailCta: "Folien auf GitHub Pages",
  detailTeaser: "Folien werden nach dem Event veröffentlicht.",
  feedLink: { label: "JSON-Feed", href: "/talks/feed.json" },
  relatedPostLabel: "Zugehöriger Blog-Post",
  eventSiteLabel: "Event-Website",
  durationLabel: "Dauer",
  dateLabel: "Datum",
  locationLabel: "Ort",
  deckLanguageLabel: "Folien-Sprache",
 },
}

function localizeTalk(slug, locale) {
 const lang = locale === "de" ? "de" : "en"
 const talk = talks[slug]
 if (!talk || !talk.showInCatalog) return null

 const copy = talk[lang]
 const deckUrl = talk.deckSlug ? buildDeckUrl(talk.deckSlug) : null
 const pathPrefix = lang === "de" ? "/talks-de" : "/talks"

 return {
  slug,
  status: talk.status,
  date: talk.date,
  duration: talk.duration,
  deckLanguage: talk.deckLanguage,
  deckUrl,
  eventUrl: talk.eventUrl,
  heroImage: talk.heroImage,
  tags: talk.tags,
  relatedBlogPost: talk.relatedBlogPost?.[lang] ?? null,
  event: copy.event,
  title: copy.title,
  abstract: copy.abstract,
  path: `${pathPrefix}/${slug}/`,
  meta: {
   title: `${copy.title} — ${copy.event.name} | Martin Mueller`,
   description: copy.abstract,
   keywords: talk.tags,
   locale: lang === "de" ? "de_DE" : "en_US",
   language: lang,
   engUrl: `/talks/${slug}/`,
   gerUrl: `/talks-de/${slug}/`,
  },
  langSwitch:
   lang === "de"
    ? { label: "English", href: `/talks/${slug}/` }
    : { label: "Deutsch", href: `/talks-de/${slug}/` },
  catalogLink:
   lang === "de"
    ? { label: "← Alle Vorträge", href: "/talks-de/" }
    : { label: "← All talks", href: "/talks/" },
 }
}

export function getTalk(slug, locale) {
 return localizeTalk(slug, locale)
}

export function getCatalogTalks(locale) {
 const lang = locale === "de" ? "de" : "en"
 const ui = catalogContent[lang]

 return talkSlugs
  .map((slug) => localizeTalk(slug, lang))
  .filter(Boolean)
  .sort((a, b) => {
   if (a.status === "upcoming" && b.status !== "upcoming") return -1
   if (a.status !== "upcoming" && b.status === "upcoming") return 1
   if (!a.date && !b.date) return 0
   if (!a.date) return 1
   if (!b.date) return -1
   return b.date.localeCompare(a.date)
  })
  .map((talk) => ({
   ...talk,
   statusLabel:
    talk.status === "upcoming" ? ui.statusUpcoming : ui.statusDelivered,
  }))
}

export function getCatalogContent(locale) {
 return locale === "de" ? catalogContent.de : catalogContent.en
}

export function getAllTags(locale) {
 const tagSet = new Set()
 getCatalogTalks(locale).forEach((talk) => {
  talk.tags.forEach((tag) => tagSet.add(tag))
 })
 return [...tagSet].sort()
}

/** Public feed payload (delivered talks with deck URLs only). */
export function getTalksFeed() {
 const site = "https://martinmueller.dev"
 return {
  updated: new Date().toISOString().slice(0, 10),
  talks: talkSlugs
   .map((slug) => {
    const talk = localizeTalk(slug, "en")
    if (!talk || talk.status !== "delivered" || !talk.deckUrl) return null
    return {
     slug,
     title: talk.title,
     event: talk.event.name,
     date: talk.date,
     url: `${site}${talk.path}`,
     deckUrl: talk.deckUrl,
     tags: talk.tags,
    }
   })
   .filter(Boolean),
 }
}
