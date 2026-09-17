import React, { useEffect } from "react"
import { Link } from "gatsby"
import Layout from "./layout"
import MetaTags from "./Metatags"
import TableOfContents from "./TableOfContents"
import SectionHeading from "./SectionHeading"
import "../styles/heading-anchors.css"
import testimonialJakob from "../../content/resume/testimonialJakob.png"
import testimonialAdrian from "../../content/resume/testimonialAdrian.png"
import testimonialEric from "../../content/resume/testimonialEric.png"
import { oneManAgencyHeroImage } from "../data/oneManAgencyContent"
import useOaiqTracking from "../hooks/useOaiqTracking"

const SITE_URL = "https://martinmueller.dev"
const HERO_IMAGE_WIDTH = 1376
const HERO_IMAGE_HEIGHT = 768

const OneManAgency = ({ content, location }) => {
 const {
  meta,
  langSwitch,
  sections,
  hero,
  testimonials,
  valuePackages,
  sow,
  whyOneExpert,
  aiAgents,
  cta,
 } = content

 useEffect(() => {
  const hash = location.hash?.replace(/^#/, "")
  if (!hash) return
  const el = document.getElementById(hash)
  if (!el) return
  requestAnimationFrame(() => {
   el.scrollIntoView({ behavior: "smooth", block: "start" })
  })
 }, [location.hash])

 const { calendlyUrl, openCalendly } = useOaiqTracking()

 return (
  <Layout fullWidth>
   <MetaTags
    title={meta.title}
    description={meta.description}
    thumbnail={`${SITE_URL}${oneManAgencyHeroImage}`}
    imageAlt={meta.imageAlt}
    imageWidth={HERO_IMAGE_WIDTH}
    imageHeight={HERO_IMAGE_HEIGHT}
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

   {/* Hero Section */}
   <div className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
    <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
     <div className="text-center md:text-left">
      <h1 className="mb-6 font-sans text-5xl font-bold text-gray-900 dark:text-gray-100 md:text-6xl">
       {hero.title}
      </h1>
      <p className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-gray-300 md:text-2xl">
       {hero.subtitle}
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
       <a
        href="mailto:office+agency@martinmueller.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex transform items-center justify-center rounded-lg bg-brand px-8 py-4 font-semibold text-white no-underline shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:text-white hover:no-underline hover:shadow-xl dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 dark:hover:text-slate-900"
       >
        {hero.ctaWrite}
       </a>
       <a
        href={calendlyUrl}
        onClick={openCalendly}
        className="inline-flex transform items-center justify-center rounded-lg bg-brand px-8 py-4 font-semibold text-white no-underline shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:text-white hover:no-underline hover:shadow-xl dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 dark:hover:text-slate-900"
       >
        {hero.ctaSpeak}
       </a>
      </div>
     </div>
     <div className="overflow-hidden rounded-xl shadow-lg">
      <img
       src={oneManAgencyHeroImage}
       alt={hero.imageAlt}
       className="mb-0 w-full object-cover"
      />
     </div>
    </div>
   </div>

   <div className="mx-auto max-w-6xl px-4">
    <TableOfContents headings={sections} />
   </div>

   {/* Testimonials Section */}
   <div className="bg-white px-4 py-16 dark:bg-slate-900">
    <div className="mx-auto max-w-6xl">
     <SectionHeading id="testimonials">{testimonials.heading}</SectionHeading>
     <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="flex h-full flex-col rounded-xl bg-gray-50 p-8 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-slate-800">
       <a
        href="https://www.linkedin.com/in/jakob-jordan-10404bb4/"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 block shrink-0 overflow-hidden rounded-lg bg-gray-200/60 dark:bg-slate-700/50 h-36"
       >
        <img
         src={testimonialJakob}
         alt="Jakob Jordan"
         className="mb-0 h-full w-full object-contain object-left"
        />
       </a>
       <div className="flex flex-1 flex-col gap-4 text-gray-700 dark:text-gray-300">
        {testimonials.jakob.map((paragraph) => (
         <p key={paragraph.slice(0, 40)} className="mb-0 leading-relaxed">
          {paragraph}
         </p>
        ))}
       </div>
      </div>

      <div className="flex h-full flex-col rounded-xl bg-gray-50 p-8 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-slate-800">
       <a
        href="https://www.linkedin.com/in/adrian-logan-a52027b5"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 block shrink-0 overflow-hidden rounded-lg bg-gray-200/60 dark:bg-slate-700/50 h-36"
       >
        <img
         src={testimonialAdrian}
         alt="Adrian Logan"
         className="mb-0 h-full w-full object-contain object-left"
        />
       </a>
       <div className="flex flex-1 flex-col gap-4 text-gray-700 dark:text-gray-300">
        {testimonials.adrian.map((paragraph) => (
         <p key={paragraph.slice(0, 40)} className="mb-0 leading-relaxed">
          {paragraph}
         </p>
        ))}
       </div>
      </div>

      <div className="flex h-full flex-col rounded-xl bg-gray-50 p-8 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-slate-800">
       <a
        href="https://www.linkedin.com/in/ericamberg"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 block shrink-0 overflow-hidden rounded-lg bg-gray-200/60 dark:bg-slate-700/50 h-36"
       >
        <img
         src={testimonialEric}
         alt="Eric Amberg"
         className="mb-0 h-full w-full object-contain object-left"
        />
       </a>
       <div className="flex flex-1 flex-col gap-4 text-gray-700 dark:text-gray-300">
        {testimonials.eric.map((paragraph) => (
         <p key={paragraph.slice(0, 40)} className="mb-0 leading-relaxed">
          {paragraph}
         </p>
        ))}
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* Value Packages Section */}
   <div className="bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-16 dark:from-slate-800 dark:to-slate-900">
    <div className="mx-auto max-w-6xl">
     <SectionHeading id="value-packages" className="mb-4">
      {valuePackages.heading}
     </SectionHeading>
     <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600 dark:text-gray-400">
      {valuePackages.intro}
     </p>
     <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {valuePackages.items.map((item) => (
       <div
        key={item.title}
        className="rounded-xl bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-slate-800"
       >
        <div className="mb-4 text-3xl">{item.icon}</div>
        <h3 className="mb-3 font-sans text-xl font-semibold text-gray-900 dark:text-gray-100">
         {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
         {item.text}
        </p>
       </div>
      ))}
     </div>
     <div className="rounded-xl bg-gradient-to-r from-brand to-cyan-500 p-8 text-center text-white shadow-lg">
      <div className="mb-4 text-4xl">💎</div>
      <h3 className="mb-3 font-sans text-2xl font-semibold">
       {valuePackages.skinInGame.title}
      </h3>
      <p className="mx-auto max-w-2xl text-lg leading-relaxed opacity-95">
       {valuePackages.skinInGame.text}
      </p>
     </div>
    </div>
   </div>

   {/* Statement of Work Section */}
   <div className="bg-white px-4 py-16 dark:bg-slate-900">
    <div className="mx-auto max-w-4xl">
     <SectionHeading id="statement-of-work">{sow.heading}</SectionHeading>
     <p className="mb-10 text-center leading-relaxed text-gray-700 dark:text-gray-300">
      {sow.intro}
     </p>
     <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {sow.steps.map((step, index) => (
       <div
        key={step.title}
        className="rounded-xl bg-gray-50 p-6 text-center dark:bg-slate-800"
       >
        <div className="mb-3 text-2xl font-bold text-brand">{index + 1}</div>
        <h3 className="mb-2 font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">
         {step.title}
        </h3>
        <p className="mb-0 text-sm text-gray-600 dark:text-gray-400">
         {step.text}
        </p>
       </div>
      ))}
     </div>
     <div className="mb-10 rounded-xl border border-gray-200 bg-gray-50 p-8 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 font-sans text-xl font-semibold text-gray-900 dark:text-gray-100">
       {sow.checklistHeading}
      </h3>
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
       {sow.checklist.map((item) => (
        <li key={item} className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">✓</span>
         <span className="text-gray-700 dark:text-gray-300">{item}</span>
        </li>
       ))}
      </ul>
     </div>
     <div className="text-center">
      <p className="mb-4 text-gray-700 dark:text-gray-300">
       {sow.examplesIntro}
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
       {sow.examples.map((example) => (
        <a
         key={example.href}
         href={example.href}
         target="_blank"
         rel="noopener noreferrer"
         className="inline-flex items-center justify-center rounded-lg border-2 border-brand px-6 py-3 font-semibold text-brand no-underline transition-colors hover:bg-brand hover:text-white dark:hover:text-white"
        >
         {example.label}
        </a>
       ))}
      </div>
     </div>
    </div>
   </div>

   {/* Why One Expert Section */}
   <div className="bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-16 dark:from-slate-800 dark:to-slate-900">
    <div className="mx-auto max-w-4xl">
     <SectionHeading id="why-one-expert">{whyOneExpert.heading}</SectionHeading>
     <div className="space-y-8">
      {whyOneExpert.items.map((item) => (
       <div key={item.title} className="flex items-start">
        <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-xl font-bold text-white">
         {item.icon}
        </div>
        <div>
         <h3 className="mb-2 font-sans text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {item.title}
         </h3>
         <p className="leading-relaxed text-gray-700 dark:text-gray-300">
          {item.text}
         </p>
        </div>
       </div>
      ))}
     </div>
    </div>
   </div>

   {/* AI Agents Section */}
   <div className="bg-white px-4 py-16 dark:bg-slate-900">
    <div className="mx-auto max-w-6xl">
     <SectionHeading id="ai-agents">{aiAgents.heading}</SectionHeading>
     <div className="mx-auto max-w-3xl">
      <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
       {aiAgents.intro}
      </p>
      <ul className="m-0 list-none space-y-4 p-0">
       {aiAgents.workflows.map((workflow) => (
        <li key={workflow.label} className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">✓</span>
         <span className="text-gray-700 dark:text-gray-300">
          <strong>{workflow.label}</strong> — {workflow.text}
         </span>
        </li>
       ))}
      </ul>
      <p className="mt-6">
       <Link
        to={aiAgents.readMoreHref}
        className="font-semibold text-brand no-underline hover:text-brand-dark hover:underline"
       >
        {aiAgents.readMore}
       </Link>
      </p>
     </div>
    </div>
   </div>

   {/* Final CTA Section */}
   <div className="bg-gradient-to-r from-brand to-cyan-500 px-4 py-16">
    <div className="mx-auto max-w-4xl text-center">
     <SectionHeading id="get-started" className="mb-6 text-white">
      {cta.heading}
     </SectionHeading>
     <p className="mb-8 text-xl text-white opacity-95">{cta.text}</p>
     <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a
       href="mailto:office+agency@martinmueller.dev"
       target="_blank"
       rel="noopener noreferrer"
       className="inline-flex transform items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-brand shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-xl"
      >
       {cta.ctaWrite}
      </a>
      <a
       href={calendlyUrl}
       onClick={openCalendly}
       className="inline-flex transform items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-brand shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-xl"
      >
       {cta.ctaSpeak}
      </a>
     </div>
    </div>
   </div>
  </Layout>
 )
}

export default OneManAgency
