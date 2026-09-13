import React from "react"
import { Link } from "gatsby"
import Layout from "./layout"
import MetaTags from "./Metatags"
import OaiqPixel from "./OaiqPixel"
import AgencyContactForm from "./AgencyContactForm"
import useOaiqTracking from "../hooks/useOaiqTracking"
import { oneManAgencyHeroImage } from "../data/oneManAgencyContent"

const SITE_URL = "https://martinmueller.dev"

const AgencyLanding = ({ content, location }) => {
 const {
  meta,
  langSwitch,
  hubLink,
  hero,
  deliverables,
  sowExample,
  testimonials,
  contact,
 } = content

 const { calendlyUrl, openCalendly } = useOaiqTracking()

 return (
  <Layout fullWidth>
   <OaiqPixel />
   <MetaTags
    title={meta.title}
    description={meta.description}
    thumbnail={`${SITE_URL}${oneManAgencyHeroImage}`}
    imageAlt={meta.title}
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
     <Link to={hubLink.href} className="text-brand hover:underline">
      {hubLink.label}
     </Link>
     <a href={langSwitch.href}>{langSwitch.label}</a>
    </div>
   </div>

   <div className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-16 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
    <div className="mx-auto max-w-4xl text-center">
     <h1 className="mb-6 font-sans text-4xl font-bold text-gray-900 dark:text-gray-100 md:text-5xl">
      {hero.title}
     </h1>
     <p className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-gray-300">
      {hero.subtitle}
     </p>
     <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a
       href={calendlyUrl}
       onClick={openCalendly}
       className="inline-flex transform items-center justify-center rounded-lg bg-brand px-8 py-4 font-semibold text-white no-underline shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:text-white hover:no-underline hover:shadow-xl dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 dark:hover:text-slate-900"
      >
       {hero.ctaSpeak}
      </a>
     </div>
    </div>
   </div>

   <div className="bg-white px-4 py-16 dark:bg-slate-900">
    <div className="mx-auto max-w-3xl">
     <h2 className="mb-8 text-center font-sans text-3xl font-bold text-gray-900 dark:text-gray-100">
      {deliverables.heading}
     </h2>
     <ul className="m-0 list-none space-y-3 p-0">
      {deliverables.items.map((item) => (
       <li key={item} className="mb-0 flex items-start">
        <span className="mr-3 font-bold text-brand">✓</span>
        <span className="text-gray-700 dark:text-gray-300">{item}</span>
       </li>
      ))}
     </ul>
     {sowExample && (
      <div className="mt-8 text-center">
       <a
        href={sowExample.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-lg border-2 border-brand px-6 py-3 font-semibold text-brand no-underline transition-colors hover:bg-brand hover:text-white"
       >
        {sowExample.label}
       </a>
      </div>
     )}
    </div>
   </div>

   {testimonials.length > 0 && (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-16 dark:from-slate-800 dark:to-slate-900">
     <div className="mx-auto max-w-4xl">
      <div className="grid gap-8 md:grid-cols-2">
       {testimonials.map((t) => (
        <div
         key={t.name}
         className="rounded-xl bg-white p-8 shadow-md dark:bg-slate-800"
        >
         <a
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 block h-28 overflow-hidden rounded-lg bg-gray-200/60 dark:bg-slate-700/50"
         >
          <img
           src={t.image}
           alt={t.name}
           className="mb-0 h-full w-full object-contain object-left"
          />
         </a>
         {t.paragraphs.map((p) => (
          <p
           key={p.slice(0, 40)}
           className="mb-4 text-sm leading-relaxed text-gray-700 last:mb-0 dark:text-gray-300"
          >
           {p}
          </p>
         ))}
        </div>
       ))}
      </div>
     </div>
    </div>
   )}

   <div className="bg-white px-4 py-16 dark:bg-slate-900">
    <div className="mx-auto max-w-xl">
     <h2 className="mb-2 text-center font-sans text-3xl font-bold text-gray-900 dark:text-gray-100">
      {contact.heading}
     </h2>
     <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
      {hero.ctaWrite}
     </p>
     <AgencyContactForm labels={contact.form} />
    </div>
   </div>

   <div className="bg-gradient-to-r from-brand to-cyan-500 px-4 py-12">
    <div className="mx-auto max-w-2xl text-center">
     <a
      href={calendlyUrl}
      onClick={openCalendly}
      className="inline-flex transform items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-brand shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-xl dark:text-slate-900 dark:hover:text-slate-900"
     >
      {hero.ctaSpeak}
     </a>
    </div>
   </div>
  </Layout>
 )
}

export default AgencyLanding
