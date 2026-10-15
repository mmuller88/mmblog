import React from "react"
import { Link } from "gatsby"
import { homeNews } from "../data/homeNews"

const HomeNewsBanner = () => {
 if (!homeNews.enabled) return null

 return (
  <details
   className="group mb-10 overflow-hidden rounded-2xl border-2 border-violet-400/80 bg-gradient-to-br from-violet-950 via-violet-900 to-fuchsia-900 shadow-xl ring-4 ring-violet-500/25 dark:border-violet-500/60 dark:ring-violet-400/20"
  >
   <summary
    className="cursor-pointer list-none [&::-webkit-details-marker]:hidden"
    aria-labelledby="home-news-heading"
   >
    <div className="flex items-center gap-4 p-4 sm:gap-6 sm:p-6">
     <img
      src={homeNews.unicornSrc}
      alt=""
      aria-hidden="true"
      className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
      width={80}
      height={80}
      loading="eager"
     />
     <div className="min-w-0 flex-1 text-left">
      <p className="mb-1 inline-flex rounded-full bg-teal-400/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-teal-200 ring-1 ring-teal-300/40">
       {homeNews.badge}
      </p>
      <h2
       id="home-news-heading"
       className="font-sans text-lg font-bold leading-snug text-white sm:text-xl"
      >
       {homeNews.title}
      </h2>
      <p className="mt-1 text-sm text-violet-200/90 group-open:hidden">
       {homeNews.summaryHint}
      </p>
     </div>
     <span
      className="shrink-0 text-violet-200 transition group-open:rotate-180"
      aria-hidden="true"
     >
      ▼
     </span>
    </div>
   </summary>
   <div className="border-t border-white/10 p-6 sm:p-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
     {homeNews.video ? (
      <div className="mx-auto w-full max-w-xs shrink-0">
       <video
        controls
        playsInline
        preload="metadata"
        poster={homeNews.video.poster}
        aria-label={homeNews.video.title}
        className="aspect-[4/5] mb-0 w-full rounded-xl bg-violet-950 object-cover"
       >
        <source src={homeNews.video.src} type="video/mp4" />
       </video>
      </div>
     ) : null}
     <div className="min-w-0 flex-1 text-center lg:text-left">
      <p className="mb-3 text-lg font-semibold text-violet-200">
       {homeNews.subtitle}
      </p>
      <p className="mb-5 text-base leading-relaxed text-violet-100/95">
       {homeNews.body}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
       <a
        href={homeNews.deckUrl}
        className="inline-flex items-center justify-center rounded-lg bg-teal-400 px-5 py-3 text-center font-semibold text-violet-950 no-underline shadow-md transition hover:bg-teal-300 hover:text-violet-950 hover:no-underline"
       >
        View slides
       </a>
       <Link
        to={homeNews.talkPath}
        className="inline-flex items-center justify-center rounded-lg border-2 border-white/70 bg-white/10 px-5 py-3 font-semibold text-white no-underline backdrop-blur-sm transition hover:border-white hover:bg-white/20 hover:text-white hover:no-underline"
       >
        Talk page
       </Link>
       <a
        href={homeNews.eventUrl}
        className="inline-flex items-center justify-center px-2 py-3 text-sm font-medium text-violet-200 underline-offset-4 hover:text-white hover:underline"
       >
        milan.serverlessdays.io
       </a>
      </div>
     </div>
    </div>
   </div>
  </details>
 )
}

export default HomeNewsBanner
