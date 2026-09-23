import React from "react"
import { Link } from "gatsby"
import Layout from "./layout"
import MetaTags from "./Metatags"
import TrainingRequestForm from "./TrainingRequestForm"
import { getCatalogContent, getCatalogCourses } from "../data/coursesContent"

const SITE_URL = "https://martinmueller.dev"

const Fact = ({ label, value }) => (
 <div>
  <dt className="text-sm text-gray-500 dark:text-gray-400">{label}</dt>
  <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">
   {value}
  </dd>
 </div>
)

const CourseDetail = ({ course, location }) => {
 const locale = location?.pathname?.startsWith("/trainings-de/") ? "de" : "en"
 const catalog = getCatalogContent(locale)

 if (!course) {
  return (
   <Layout fullWidth>
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
     <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
      {catalog.notFoundTitle}
     </h1>
     <Link to={catalog.catalogPath} className="text-brand hover:underline">
      {catalog.notFoundLink}
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
  facts,
  factLabels,
  expect,
  audience,
  agenda,
  method,
  request,
  faqs,
  faqHeading,
  relatedPost,
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
  timeRequired: `P${facts.durationDays}D`,
  educationalLevel: facts.level,
  inLanguage: meta.language,
  url: `${SITE_URL}${location.pathname}`,
 }

 const related = getCatalogCourses(meta.language).filter(
  (item) => item.slug !== slug
 )

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
    thumbnail={
     hero.image.startsWith("http") ? hero.image : `${SITE_URL}${hero.image}`
    }
    imageAlt={hero.imageAlt}
    faq={faqs}
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
      <dl className="mb-6 grid grid-cols-2 gap-4">
       <Fact label={factLabels.duration} value={facts.duration} />
       <Fact label={factLabels.level} value={facts.level} />
       <Fact label={factLabels.format} value={facts.format} />
       <Fact label={factLabels.price} value={facts.price} />
      </dl>
      <a
       href="#request"
       className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-dark hover:text-white hover:no-underline"
      >
       {request.heading}
      </a>
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

   <section className="mx-auto max-w-6xl px-4 py-16">
    <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
     {expect.heading}
    </h2>
    <p className="mb-6 max-w-3xl text-lg leading-relaxed text-gray-700 dark:text-gray-300">
     {expect.intro}
    </p>
    <ul className="grid gap-3 md:grid-cols-2">
     {expect.points.map((point) => (
      <li
       key={point}
       className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4 text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300"
      >
       <span className="mt-0.5 shrink-0 text-brand" aria-hidden="true">
        ✓
       </span>
       <span>{point}</span>
      </li>
     ))}
    </ul>
   </section>

   <section className="mx-auto max-w-6xl px-4 pb-16">
    <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
     {audience.heading}
    </h2>
    <div className="grid gap-12 md:grid-cols-2">
     <div>
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
       {audience.whoHeading}
      </h3>
      <ul className="space-y-3">
       {audience.who.map((item) => (
        <li key={item} className="text-gray-700 dark:text-gray-300">
         {item}
        </li>
       ))}
      </ul>
     </div>
     <div>
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
       {audience.learnHeading}
      </h3>
      <ul className="space-y-3">
       {audience.learn.map((item) => (
        <li key={item} className="flex gap-3 text-gray-700 dark:text-gray-300">
         <span className="mt-1 shrink-0 text-brand" aria-hidden="true">
          ✓
         </span>
         <span>{item}</span>
        </li>
       ))}
      </ul>
     </div>
    </div>
   </section>

   <section className="mx-auto max-w-6xl px-4 pb-16">
    <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
     {agenda.heading}
    </h2>
    <ol className="grid gap-6 md:grid-cols-2">
     {agenda.days.map((day, index) => (
      <li
       key={day.title}
       className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
      >
       <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
        <span className="mr-2 text-brand">{index + 1}.</span>
        {day.title}
       </h3>
       <ul className="space-y-2">
        {day.items.map((item) => (
         <li key={item} className="text-gray-700 dark:text-gray-300">
          {item}
         </li>
        ))}
       </ul>
      </li>
     ))}
    </ol>
   </section>

   <section className="mx-auto max-w-6xl px-4 pb-16">
    <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
     {method.heading}
    </h2>
    <ul className="grid gap-4 md:grid-cols-2">
     {method.points.map((point) => (
      <li key={point.title} className="text-gray-700 dark:text-gray-300">
       <span className="font-semibold text-gray-900 dark:text-gray-100">
        {point.title}
       </span>{" "}
       {point.body}
      </li>
     ))}
    </ul>
   </section>

   <section id="request" className="mx-auto max-w-3xl px-4 pb-16">
    <div className="rounded-xl bg-gray-50 p-8 dark:bg-slate-800">
     <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
      {request.heading}
     </h2>
     <p className="mb-6 text-gray-700 dark:text-gray-300">{request.intro}</p>
     <TrainingRequestForm
      trainingSlug={slug}
      trainingTitle={hero.title}
      locale={meta.language}
      pageUrl={`${SITE_URL}${location.pathname}`}
      labels={request.form}
     />
    </div>
   </section>

   <section className="mx-auto max-w-3xl px-4 pb-16">
    <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
     {faqHeading}
    </h2>
    <div className="space-y-6">
     {faqs.map((item) => (
      <div key={item.q}>
       <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {item.q}
       </h3>
       <p className="text-gray-700 dark:text-gray-300">{item.a}</p>
      </div>
     ))}
    </div>
   </section>

   {related.length > 0 ? (
    <section className="mx-auto max-w-6xl px-4 pb-16">
     <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
      {catalog.relatedHeading}
     </h2>
     <div className="grid gap-6 md:grid-cols-3">
      {related.map((item) => (
       <Link
        key={item.slug}
        to={item.path}
        className="rounded-xl border border-gray-200 bg-white p-6 no-underline hover:border-brand dark:border-slate-700 dark:bg-slate-800"
       >
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
         {item.duration} · {item.level}
        </p>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
         {item.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{item.price}</p>
       </Link>
      ))}
     </div>
    </section>
   ) : null}
  </Layout>
 )
}

export default CourseDetail
