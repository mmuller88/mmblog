import React from "react"
import { Link } from "gatsby"
import Layout from "./layout"
import MetaTags from "./Metatags"
import CourseWaitlistForm from "./CourseWaitlistForm"

const SITE_URL = "https://martinmueller.dev"

const CourseDetail = ({ course, location }) => {
 if (!course) {
  const catalogPath = location?.pathname?.startsWith("/courses-de/")
   ? "/courses-de/"
   : "/courses/"

  return (
   <Layout fullWidth>
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
     <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
      Course not found
     </h1>
     <Link to={catalogPath} className="text-brand hover:underline">
      ← Back to courses
     </Link>
    </div>
   </Layout>
  )
 }

 const {
  slug,
  meta,
  langSwitch,
  catalogLink,
  hero,
  mvpWhy,
  pricing,
  curriculum,
  relatedPost,
  waitlist,
 } = course

 const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: hero.title,
  description: meta.description,
  provider: {
   "@type": "Person",
   name: "Martin Mueller",
   url: SITE_URL,
  },
  offers: {
   "@type": "Offer",
   price: pricing.earlyBirdPriceEur,
   priceCurrency: "EUR",
   availability: "https://schema.org/preorder",
   url: `${SITE_URL}${location.pathname}`,
  },
  inLanguage: meta.language,
  url: `${SITE_URL}${location.pathname}`,
 }

 const thankYouPath =
  meta.language === "de" ? "/courses-de/waitlist-thank-you/" : "/courses/waitlist-thank-you/"

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
    thumbnail={hero.image.startsWith("http") ? hero.image : `${SITE_URL}${hero.image}`}
    imageAlt={hero.imageAlt}
    extraJsonLd={courseJsonLd}
   />

   <div className="mx-auto max-w-6xl px-4 pt-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
     <Link to={catalogLink.href} className="text-brand hover:underline">
      {catalogLink.label}
     </Link>
     <a href={langSwitch.href}>{langSwitch.label}</a>
    </div>
   </div>

   <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-16 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
    <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
     <div>
      <h1 className="mb-4 font-sans text-4xl font-bold text-gray-900 dark:text-gray-100 md:text-5xl">
       {hero.title}
      </h1>
      <p className="mb-6 text-xl leading-relaxed text-gray-700 dark:text-gray-300">
       {hero.subtitle ?? (
        <>
         {hero.subtitleBefore}
         <a
          href={hero.subtitleLink.href}
          className="text-brand underline hover:text-brand-dark"
          target="_blank"
          rel="noopener noreferrer"
         >
          {hero.subtitleLink.label}
         </a>
         {hero.subtitleAfter}
        </>
       )}
      </p>
      <div className="mb-4 flex flex-wrap items-baseline gap-3">
       <span className="text-3xl font-bold text-brand">€{pricing.earlyBirdPriceEur}</span>
       <span className="text-gray-500 line-through dark:text-gray-400">
        €{pricing.listPriceEur}
       </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{pricing.note}</p>
      {relatedPost ? (
       <p className="mt-4">
        <Link to={relatedPost.href} className="text-brand hover:underline">
         {relatedPost.label} →
        </Link>
       </p>
      ) : null}
     </div>
     <div className="overflow-hidden rounded-xl shadow-lg">
      <img
       src={hero.image}
       alt={hero.imageAlt}
       className="mb-0 w-full object-cover"
      />
     </div>
    </div>
   </div>

   {mvpWhy ? (
    <section className="mx-auto max-w-6xl px-4 pb-4">
     <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
      {mvpWhy.heading}
     </h2>
     <p className="mb-6 max-w-3xl text-lg leading-relaxed text-gray-700 dark:text-gray-300">
      {mvpWhy.intro}
     </p>
     <ul className="grid gap-3 md:grid-cols-2">
      {mvpWhy.points.map((point) => (
       <li
        key={point}
        className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4 text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300"
       >
        <span className="mt-0.5 shrink-0 text-brand" aria-hidden="true">✓</span>
        <span>{point}</span>
       </li>
      ))}
     </ul>
    </section>
   ) : null}

   <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2">
    <section>
     <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
      {curriculum.heading}
     </h2>
     <ul className="space-y-3">
      {curriculum.modules.map((module) => (
       <li
        key={module}
        className="flex gap-3 text-gray-700 dark:text-gray-300"
       >
        <span className="mt-1 shrink-0 text-brand" aria-hidden="true">✓</span>
        <span>{module}</span>
       </li>
      ))}
     </ul>
    </section>

    <section className="rounded-xl bg-gray-50 p-8 dark:bg-slate-800">
     <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
      {waitlist.heading}
     </h2>
     <CourseWaitlistForm
      courseSlug={slug}
      locale={meta.language}
      labels={waitlist.form}
      thankYouPath={thankYouPath}
     />
    </section>
   </div>
  </Layout>
 )
}

export default CourseDetail
