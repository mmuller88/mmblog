import React from "react"
import { Link } from "gatsby"
import Layout from "./layout"
import MetaTags from "./Metatags"

const SITE_URL = "https://martinmueller.dev"

const formatDate = (date, locale) => {
 if (!date) return null
 return new Date(`${date}T12:00:00`).toLocaleDateString(
  locale === "de" ? "de-DE" : "en-GB",
  { year: "numeric", month: "long", day: "numeric" }
 )
}

const TalkDetail = ({ talk, location }) => {
 const locale = talk?.meta?.language === "de" ? "de" : "en"
 const catalogPath = locale === "de" ? "/talks-de/" : "/talks/"
 const ui =
  locale === "de"
   ? {
      notFound: "Vortrag nicht gefunden",
      back: "← Zurück zu Vorträgen",
      detailCta: "Folien auf GitHub Pages",
      detailTeaser: "Folien werden nach dem Event veröffentlicht.",
      relatedPostLabel: "Zugehöriger Blog-Post",
      eventSiteLabel: "Event-Website",
      durationLabel: "Dauer",
      dateLabel: "Datum",
      locationLabel: "Ort",
      deckLanguageLabel: "Folien-Sprache",
      statusUpcoming: "Demnächst",
      statusDelivered: "Gehalten",
     }
   : {
      notFound: "Talk not found",
      back: "← Back to talks",
      detailCta: "View slides on GitHub Pages",
      detailTeaser: "Slides will be published after the event.",
      relatedPostLabel: "Related blog post",
      eventSiteLabel: "Event website",
      durationLabel: "Duration",
      dateLabel: "Date",
      locationLabel: "Location",
      deckLanguageLabel: "Deck language",
      statusUpcoming: "Upcoming",
      statusDelivered: "Delivered",
     }

 if (!talk) {
  return (
   <Layout fullWidth>
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
     <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
      {ui.notFound}
     </h1>
     <Link to={catalogPath} className="text-brand hover:underline">
      {ui.back}
     </Link>
    </div>
   </Layout>
  )
 }

 const {
  slug,
  status,
  date,
  duration,
  deckLanguage,
  deckUrl,
  eventUrl,
  heroImage,
  tags,
  relatedBlogPost,
  event,
  title,
  abstract,
  meta,
  langSwitch,
  catalogLink,
 } = talk

 const isUpcoming = status === "upcoming"
 const dateLabel = formatDate(date, locale)
 const thumbnail = heroImage?.startsWith("http")
  ? heroImage
  : `${SITE_URL}${heroImage}`

 const talkJsonLd = {
  "@context": "https://schema.org",
  "@type": "PresentationDigitalDocument",
  name: title,
  description: abstract,
  author: {
   "@type": "Person",
   name: "Martin Mueller",
   url: SITE_URL,
  },
  ...(deckUrl ? { url: deckUrl } : {}),
  ...(date ? { datePublished: date } : {}),
  inLanguage: deckLanguage,
  about: tags,
 }

 return (
  <Layout fullWidth>
   <MetaTags
    title={meta.title}
    description={meta.description}
    keywords={meta.keywords}
    locale={meta.locale}
    language={meta.language}
    url={SITE_URL}
    pathname={location.pathname}
    engUrl={meta.engUrl}
    gerUrl={meta.gerUrl}
    thumbnail={thumbnail}
    imageAlt={title}
    tags={tags}
    extraJsonLd={talkJsonLd}
   />

   <div className="mx-auto max-w-6xl px-4 pt-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
     <Link to={catalogLink.href} className="text-brand hover:underline">
      {catalogLink.label}
     </Link>
     <Link to={langSwitch.href} className="hover:underline">
      {langSwitch.label}
     </Link>
    </div>
   </div>

   <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-16 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
    <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
     <div>
      <span
       className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        isUpcoming
         ? "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
         : "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100"
       }`}
      >
       {isUpcoming ? ui.statusUpcoming : ui.statusDelivered}
      </span>
      <p className="mb-2 text-lg font-medium text-brand">{event.name}</p>
      <h1 className="mb-4 font-sans text-4xl font-bold text-gray-900 dark:text-gray-100 md:text-5xl">
       {title}
      </h1>
      <p className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-gray-300">
       {abstract}
      </p>

      <dl className="mb-8 grid gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
       {dateLabel ? (
        <>
         <dt className="font-semibold text-gray-900 dark:text-gray-100">
          {ui.dateLabel}
         </dt>
         <dd>{dateLabel}</dd>
        </>
       ) : null}
       <dt className="font-semibold text-gray-900 dark:text-gray-100">
        {ui.locationLabel}
       </dt>
       <dd>{event.location}</dd>
       <dt className="font-semibold text-gray-900 dark:text-gray-100">
        {ui.durationLabel}
       </dt>
       <dd>{duration}</dd>
       <dt className="font-semibold text-gray-900 dark:text-gray-100">
        {ui.deckLanguageLabel}
       </dt>
       <dd>{deckLanguage.toUpperCase()}</dd>
      </dl>

      <div className="flex flex-wrap gap-4">
       {deckUrl ? (
        <a
         href={deckUrl}
         target="_blank"
         rel="noopener noreferrer"
         className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-dark hover:text-white hover:no-underline"
        >
         {ui.detailCta}
        </a>
       ) : (
        <span className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-600 dark:border-slate-600 dark:text-gray-300">
         {ui.detailTeaser}
        </span>
       )}
       {eventUrl ? (
        <a
         href={eventUrl}
         target="_blank"
         rel="noopener noreferrer"
         className="inline-flex items-center justify-center rounded-lg border-2 border-brand px-6 py-3 font-semibold text-brand no-underline transition-colors hover:bg-brand hover:text-white hover:no-underline dark:hover:text-white"
        >
         {ui.eventSiteLabel}
        </a>
       ) : null}
      </div>
     </div>

     {heroImage ? (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
       <img
        src={heroImage}
        alt={title}
        className="mb-0 w-full object-contain"
       />
      </div>
     ) : null}
    </div>
   </div>

   <div className="mx-auto max-w-4xl px-4 py-12">
    <div className="mb-6 flex flex-wrap gap-2">
     {tags.map((tag) => (
      <span
       key={tag}
       className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-slate-800 dark:text-gray-300"
      >
       {tag}
      </span>
     ))}
    </div>
    {relatedBlogPost ? (
     <p className="text-gray-700 dark:text-gray-300">
      {ui.relatedPostLabel}:{" "}
      <Link to={relatedBlogPost.href} className="text-brand hover:underline">
       {relatedBlogPost.title}
      </Link>
     </p>
    ) : null}
   </div>
  </Layout>
 )
}

export default TalkDetail
