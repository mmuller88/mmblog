import React, { useMemo, useState } from "react"
import { Link } from "gatsby"
import Layout from "./layout"
import MetaTags from "./Metatags"
import {
 getAllTags,
 getCatalogContent,
 getCatalogTalks,
} from "../data/talksContent"

const SITE_URL = "https://martinmueller.dev"

const formatDate = (date, locale) => {
 if (!date) return null
 return new Date(`${date}T12:00:00`).toLocaleDateString(
  locale === "de" ? "de-DE" : "en-GB",
  { year: "numeric", month: "short", day: "numeric" }
 )
}

const TalksCatalog = ({ locale, location }) => {
 const content = getCatalogContent(locale)
 const allTalks = getCatalogTalks(locale)
 const tags = getAllTags(locale)
 const [activeTag, setActiveTag] = useState("all")

 const talks = useMemo(() => {
  if (activeTag === "all") return allTalks
  return allTalks.filter((talk) => talk.tags.includes(activeTag))
 }, [activeTag, allTalks])

 const upcomingTalks = talks.filter((talk) => talk.status === "upcoming")
 const deliveredTalks = talks.filter((talk) => talk.status !== "upcoming")

 const { meta, langSwitch, hero, filterAll, cardCta, cardTeaser, feedLink } =
  content

 const renderCard = (talk) => {
  const dateLabel = formatDate(talk.date, locale)
  const isUpcoming = talk.status === "upcoming"

  const cardBody = (
   <>
    <div className="aspect-video overflow-hidden bg-gradient-to-br from-brand/10 to-cyan-100 dark:from-slate-700 dark:to-slate-800">
     {talk.heroImage ? (
      <img
       src={talk.heroImage}
       alt=""
       className="mb-0 h-full w-full object-contain p-8"
      />
     ) : null}
    </div>
    <div className="flex flex-1 flex-col p-6">
     <div className="mb-3 flex flex-wrap items-center gap-2">
      <span
       className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isUpcoming
         ? "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
         : "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100"
       }`}
      >
       {talk.statusLabel}
      </span>
      {dateLabel ? (
       <span className="text-sm text-gray-500 dark:text-gray-400">
        {dateLabel}
       </span>
      ) : null}
     </div>
     <p className="mb-1 text-sm font-medium text-brand">{talk.event.name}</p>
     <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
      {talk.title}
     </h2>
     <p className="mb-4 flex-1 text-gray-600 dark:text-gray-300">
      {talk.abstract}
     </p>
     <div className="mb-4 flex flex-wrap gap-2">
      {talk.tags.map((tag) => (
       <span
        key={tag}
        className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-slate-700 dark:text-gray-300"
       >
        {tag}
       </span>
      ))}
     </div>
     {isUpcoming ? (
      <span
       className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-600 dark:border-slate-600 dark:text-gray-300"
      >
       {cardTeaser}
      </span>
     ) : (
      <span
       className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 font-semibold text-white"
      >
       {cardCta}
      </span>
     )}
    </div>
   </>
  )

  return (
   <article
    key={talk.slug}
    className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
   >
    <Link to={talk.path} className="flex flex-1 flex-col no-underline hover:no-underline">
     {cardBody}
    </Link>
   </article>
  )
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
   />

   <div className="mx-auto max-w-6xl px-4 pt-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
     <Link to={langSwitch.href} className="text-brand hover:underline">
      {langSwitch.label}
     </Link>
     <a href={feedLink.href} className="text-sm text-gray-500 hover:underline dark:text-gray-400">
      {feedLink.label}
     </a>
    </div>
   </div>

   <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-16 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
    <div className="mx-auto max-w-6xl text-center md:text-left">
     <h1 className="mb-4 font-sans text-4xl font-bold text-gray-900 dark:text-gray-100 md:text-5xl">
      {hero.title}
     </h1>
     <p className="max-w-3xl text-xl leading-relaxed text-gray-700 dark:text-gray-300">
      {hero.subtitle}
     </p>
    </div>
   </div>

   <div className="mx-auto max-w-6xl px-4 py-8">
    <div className="flex flex-wrap gap-2">
     <button
      type="button"
      onClick={() => setActiveTag("all")}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
       activeTag === "all"
        ? "bg-brand text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
      }`}
     >
      {filterAll}
     </button>
     {tags.map((tag) => (
      <button
       key={tag}
       type="button"
       onClick={() => setActiveTag(tag)}
       className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        activeTag === tag
         ? "bg-brand text-white"
         : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
       }`}
      >
       {tag}
      </button>
     ))}
    </div>
   </div>

   <div className="mx-auto max-w-6xl space-y-12 px-4 pb-16">
    {upcomingTalks.length > 0 ? (
     <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
       {content.statusUpcoming}
      </h2>
      <div className="grid gap-8 md:grid-cols-2">{upcomingTalks.map(renderCard)}</div>
     </section>
    ) : null}

    {deliveredTalks.length > 0 ? (
     <section>
      {upcomingTalks.length > 0 ? (
       <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {content.statusDelivered}
       </h2>
      ) : null}
      <div className="grid gap-8 md:grid-cols-2">
       {deliveredTalks.map(renderCard)}
      </div>
     </section>
    ) : null}
   </div>
  </Layout>
 )
}

export default TalksCatalog
