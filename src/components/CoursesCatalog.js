import React from "react"
import { Link } from "gatsby"
import Layout from "./layout"
import MetaTags from "./Metatags"
import { getCatalogContent, getCatalogCourses } from "../data/coursesContent"

const SITE_URL = "https://martinmueller.dev"

const CoursesCatalog = ({ locale, location }) => {
 const content = getCatalogContent(locale)
 const courses = getCatalogCourses(locale)
 const { meta, langSwitch, hero, cardCta, pricingLabel, listLabel } = content

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
    <a href={langSwitch.href}>{langSwitch.label}</a>
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

   <div className="mx-auto max-w-6xl px-4 py-16">
    <div className="grid gap-8 md:grid-cols-2">
     {courses.map((course) => (
      <article
       key={course.slug}
       className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
      >
       <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-slate-700">
        <img
         src={course.image}
         alt={course.imageAlt}
         className="mb-0 h-full w-full object-cover"
        />
       </div>
       <div className="flex flex-1 flex-col p-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
         {course.title}
        </h2>
        <p className="mb-4 flex-1 text-gray-600 dark:text-gray-300">
         {course.subtitle}
        </p>
        <div className="mb-4 flex flex-wrap items-baseline gap-3">
         <span className="text-2xl font-bold text-brand">
          €{course.earlyBirdPriceEur}
         </span>
         <span className="text-sm text-gray-500 dark:text-gray-400">
          {pricingLabel}
         </span>
         <span className="text-sm text-gray-400 line-through dark:text-gray-500">
          {listLabel} €{course.listPriceEur}
         </span>
        </div>
        <Link
         to={course.path}
         className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-dark hover:text-white hover:no-underline"
        >
         {cardCta}
        </Link>
       </div>
      </article>
     ))}
    </div>
   </div>
  </Layout>
 )
}

export default CoursesCatalog
