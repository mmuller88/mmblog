import React from "react"
import { Link } from "gatsby"
import { homeNews } from "../data/homeNews"

const HomeNewsBanner = () => {
 if (!homeNews.enabled) return null

 return (
  <aside
   aria-labelledby="home-news-heading"
   className="mb-10 overflow-hidden rounded-2xl border-2 border-violet-400/80 bg-gradient-to-br from-violet-950 via-violet-900 to-fuchsia-900 shadow-xl ring-4 ring-violet-500/25 dark:border-violet-500/60 dark:ring-violet-400/20"
  >
   <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center">
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
    <div className="min-w-0 flex-1 text-center lg:text-left">
     <div className="mb-3 flex items-center justify-center gap-3 lg:justify-start">
      <img
       src={homeNews.unicornSrc}
       alt="ServerlessDays Milano unicorn"
       className="h-14 w-14 object-contain"
       width={56}
       height={56}
       loading="eager"
      />
      <p className="inline-flex rounded-full bg-teal-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-200 ring-1 ring-teal-300/40">
       {homeNews.badge}
      </p>
     </div>
     <h2
      id="home-news-heading"
      className="mb-1 font-sans text-2xl font-bold leading-tight text-white sm:text-3xl"
     >
      {homeNews.title}
     </h2>
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
  </aside>
 )
}

export default HomeNewsBanner
