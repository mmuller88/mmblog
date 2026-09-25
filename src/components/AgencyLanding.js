import React from "react"
import { Link } from "gatsby"
import Layout from "./layout"
import MetaTags from "./Metatags"
import AgencyContactForm from "./AgencyContactForm"
import FaqAccordion from "./FaqAccordion"
import useOaiqTracking from "../hooks/useOaiqTracking"
import {
 oneManAgencyHeroImage,
 oneManAgencyHeroImageAlt,
} from "../data/oneManAgencyContent"

const SITE_URL = "https://martinmueller.dev"
const HERO_IMAGE_WIDTH = 1376
const HERO_IMAGE_HEIGHT = 768

const AgencyLanding = ({ content, location }) => {
 const {
  meta,
  langSwitch,
  hubLink,
  hero,
  audience,
  caseStudy,
  offer,
  credential,
  deliverables,
  sowExample,
  testimonials,
  contact,
  definition,
  faqs = [],
  faqHeading,
  relatedPost,
  service = false,
 } = content

 const { calendlyUrl, openCalendly } = useOaiqTracking()

 const serviceJsonLd = service
  ? {
     "@context": "https://schema.org",
     "@type": "Service",
     name: meta.title,
     description: meta.description,
     url: `${SITE_URL}${location.pathname}`,
     provider: {
      "@type": "Person",
      name: "Martin Mueller",
      url: SITE_URL,
     },
     areaServed: meta.language === "de" ? "DE" : "Worldwide",
    }
  : null

 return (
  <Layout fullWidth>
   <MetaTags
    title={meta.title}
    description={meta.description}
    thumbnail={`${SITE_URL}${oneManAgencyHeroImage}`}
    imageAlt={oneManAgencyHeroImageAlt}
    imageWidth={HERO_IMAGE_WIDTH}
    imageHeight={HERO_IMAGE_HEIGHT}
    keywords={meta.keywords}
    locale={meta.locale}
    language={meta.language}
    url={SITE_URL}
    pathname={location.pathname}
    engUrl={meta.engUrl}
    gerUrl={meta.gerUrl}
    faq={faqs}
    extraJsonLd={serviceJsonLd}
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
    <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
     <div className="text-center md:text-left">
      <h1 className="mb-6 font-sans text-4xl font-bold text-gray-900 dark:text-gray-100 md:text-5xl">
       {hero.title}
      </h1>
      <p className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-gray-300">
       {hero.subtitle}
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
       <a
        href={calendlyUrl}
        onClick={openCalendly}
        className="inline-flex transform items-center justify-center rounded-lg bg-brand-solid px-8 py-4 font-semibold text-white no-underline shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-solidHover hover:text-white hover:no-underline hover:shadow-xl dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 dark:hover:text-slate-900"
       >
        {hero.ctaSpeak}
       </a>
      </div>
     </div>
     <div className="overflow-hidden rounded-xl shadow-lg">
      <img
       src={oneManAgencyHeroImage}
       alt={oneManAgencyHeroImageAlt}
       className="mb-0 w-full object-cover"
      />
     </div>
    </div>
   </div>

   {audience && (
    <div className="bg-white px-4 py-16 dark:bg-slate-900">
     <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 font-sans text-3xl font-bold text-gray-900 dark:text-gray-100">
       {audience.heading}
      </h2>
      <p className="mb-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
       {audience.who}
      </p>
      <p className="mb-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
       {audience.trigger}
      </p>
      <p className="mb-0 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
       {audience.work}
      </p>
     </div>
    </div>
   )}

   {caseStudy && (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-16 dark:from-slate-800 dark:to-slate-900">
     <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 font-sans text-3xl font-bold text-gray-900 dark:text-gray-100">
       {caseStudy.heading}
      </h2>
      {caseStudy.paragraphs.map((paragraph) => (
       <p
        key={paragraph.slice(0, 48)}
        className="mb-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300"
       >
        {paragraph}
       </p>
      ))}
      {caseStudy.link && (
       <p className="mb-0">
        <Link to={caseStudy.link.href} className="text-brand hover:underline">
         {caseStudy.link.label}
        </Link>
       </p>
      )}
     </div>
    </div>
   )}

   {definition && (
    <div className="bg-white px-4 py-16 dark:bg-slate-900">
     <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 font-sans text-3xl font-bold text-gray-900 dark:text-gray-100">
       {definition.heading}
      </h2>
      {definition.paragraphs.map((paragraph) => (
       <p
        key={paragraph.slice(0, 48)}
        className="mb-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300"
       >
        {paragraph}
       </p>
      ))}
      {definition.link && (
       <p className="mb-0">
        <Link to={definition.link.href} className="text-brand hover:underline">
         {definition.link.label}
        </Link>
       </p>
      )}
     </div>
    </div>
   )}

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
     {relatedPost && (
      <p className="mt-8 text-center">
       <Link to={relatedPost.href} className="text-brand hover:underline">
        {relatedPost.label}
       </Link>
      </p>
     )}
     {sowExample && (
      <div className="mt-8 text-center">
       <a
        href={sowExample.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-lg border-2 border-brand-solid px-6 py-3 font-semibold text-brand-solid no-underline transition-colors hover:bg-brand-solid hover:text-white dark:border-brand dark:text-brand dark:hover:bg-brand dark:hover:text-white"
       >
        {sowExample.label}
       </a>
      </div>
     )}
    </div>
   </div>

   {faqs.length > 0 && (
    <div className="bg-white px-4 py-16 dark:bg-slate-900">
     <div className="mx-auto max-w-3xl">
      <h2 className="mb-8 text-center font-sans text-3xl font-bold text-gray-900 dark:text-gray-100">
       {faqHeading}
      </h2>
      <FaqAccordion items={faqs} />
     </div>
    </div>
   )}

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

   {offer && (
    <div className="bg-white px-4 py-16 dark:bg-slate-900">
     <div className="mx-auto max-w-3xl">
      <h2 className="mb-4 font-sans text-3xl font-bold text-gray-900 dark:text-gray-100">
       {offer.heading}
      </h2>
      <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
       {offer.intro}
      </p>
      <dl className="m-0">
       {offer.rows.map(([label, value]) => (
        <div key={label} className="mb-4">
         <dt className="font-semibold text-gray-900 dark:text-gray-100">
          {label}
         </dt>
         <dd className="mb-0 text-gray-700 dark:text-gray-300">{value}</dd>
        </div>
       ))}
      </dl>
     </div>
    </div>
   )}

   {credential && (
    <div className="bg-white px-4 pb-16 dark:bg-slate-900">
     <div className="mx-auto max-w-3xl">
      <h2 className="mb-4 font-sans text-2xl font-bold text-gray-900 dark:text-gray-100">
       {credential.heading}
      </h2>
      <ul className="m-0 list-none space-y-2 p-0">
       {credential.links.map((item) => (
        <li key={item.href}>
         <Link to={item.href} className="text-brand hover:underline">
          {item.label}
         </Link>
        </li>
       ))}
      </ul>
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
     <AgencyContactForm labels={contact.form} page={location.pathname} />
    </div>
   </div>

   <div className="bg-gradient-to-r from-brand to-cyan-500 px-4 py-12">
    <div className="mx-auto max-w-2xl text-center">
     <a
      href={calendlyUrl}
      onClick={openCalendly}
      className="inline-flex transform items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-slate-900 no-underline shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:text-slate-900 hover:no-underline hover:shadow-xl"
     >
      {hero.ctaSpeak}
     </a>
    </div>
   </div>
  </Layout>
 )
}

export default AgencyLanding
