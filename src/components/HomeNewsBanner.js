import React, { useState } from "react"
import { Link } from "gatsby"
import { homeNews } from "../data/homeNews"

const langs = ["en", "de"]

const HomeNewsBanner = () => {
 const [lang, setLang] = useState("en")
 if (!homeNews.enabled) return null
 const copy = homeNews[lang]

 return (
  <details className="group mb-10 overflow-hidden rounded-2xl border-2 border-violet-400/80 bg-gradient-to-br from-violet-950 via-violet-900 to-fuchsia-900 shadow-xl ring-4 ring-violet-500/25 dark:border-violet-500/60 dark:ring-violet-400/20">
   <summary
    className="cursor-pointer list-none [&::-webkit-details-marker]:hidden"
    aria-labelledby="home-news-heading"
   >
    <div className="flex items-start gap-4 p-4 sm:gap-6 sm:p-6">
     <div
      role="img"
      aria-label={copy.imageAlt}
      className="h-16 w-16 shrink-0 rounded-lg bg-[url('/hanseatic-hackathon/team-hanse.jpg')] bg-cover bg-center sm:h-20 sm:w-20"
     />
     <div className="min-w-0 flex-1 text-left">
      <div className="mb-1 flex items-center gap-2">
       <p className="!mb-0 inline-flex rounded-full bg-teal-400/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-teal-200 ring-1 ring-teal-300/40">
        {copy.badge}
       </p>
       <div className="ml-auto flex items-center gap-2">
        <div
         className="flex rounded-lg bg-white/10 p-0.5"
         role="group"
         aria-label={lang === "de" ? "Sprache" : "Language"}
        >
         {langs.map((code) => (
          <button
           key={code}
           type="button"
           aria-pressed={lang === code}
           className={
            lang === code
             ? "rounded-md bg-white px-2 py-1 text-xs font-bold uppercase text-violet-950"
             : "rounded-md px-2 py-1 text-xs font-bold uppercase text-violet-200 hover:text-white"
           }
           onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setLang(code)
           }}
          >
           {code}
          </button>
         ))}
        </div>
        <span
         className="text-violet-200 transition group-open:rotate-180"
         aria-hidden="true"
        >
         ▼
        </span>
       </div>
      </div>
      <h2
       id="home-news-heading"
       className="!mb-0 !font-sans !text-lg !font-bold !leading-snug text-white sm:!text-xl"
      >
       {copy.title}
      </h2>
      <p className="!mb-0 mt-1 text-sm text-violet-200/90 group-open:hidden">
       {copy.summaryHint}
      </p>
     </div>
    </div>
   </summary>
   <div className="border-t border-white/10 p-6 sm:p-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
     <div className="mx-auto w-full max-w-xl shrink-0">
      <video
       key={lang}
       controls
       playsInline
       preload="metadata"
       poster={homeNews.video.poster}
       aria-label={copy.videoTitle}
       className="mb-0 aspect-video w-full rounded-xl bg-violet-950 object-contain"
      >
       <source src={homeNews.video.src} type="video/mp4" />
      </video>
     </div>
     <div className="min-w-0 flex-1 text-center lg:text-left">
      <p className="mb-3 text-lg font-semibold text-violet-200">
       {copy.subtitle}
      </p>
      <p className="mb-5 text-base leading-relaxed text-violet-100/95">
       {copy.body}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
       <a
        href={copy.deckUrl}
        className="inline-flex items-center justify-center rounded-lg bg-teal-400 px-5 py-3 text-center font-semibold text-violet-950 no-underline shadow-md transition hover:bg-teal-300 hover:text-violet-950 hover:no-underline"
       >
        {copy.slidesLabel}
       </a>
       <Link
        to={copy.postPath}
        className="inline-flex items-center justify-center rounded-lg border-2 border-white/70 bg-white/10 px-5 py-3 font-semibold text-white no-underline backdrop-blur-sm transition hover:border-white hover:bg-white/20 hover:text-white hover:no-underline"
       >
        {copy.postLabel}
       </Link>
       <a
        href={copy.eventUrl}
        className="inline-flex items-center justify-center px-2 py-3 text-sm font-medium text-violet-200 underline-offset-4 hover:text-white hover:underline"
       >
        {copy.eventLabel}
       </a>
      </div>
     </div>
    </div>
   </div>
  </details>
 )
}

export default HomeNewsBanner
