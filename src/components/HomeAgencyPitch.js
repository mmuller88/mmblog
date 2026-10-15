import React from "react"
import { Link } from "gatsby"
import { oneManAgencyContent } from "../data/oneManAgencyContent"

const { services } = oneManAgencyContent.en

const HomeAgencyPitch = () => (
 <section aria-labelledby="home-agency-pitch" className="mb-8">
  <h2
   id="home-agency-pitch"
   className="mb-2 font-sans text-2xl font-bold text-gray-900 dark:text-gray-100"
  >
   One-Man Agency
  </h2>
  <p className="mb-5 text-gray-700 dark:text-gray-300">
   Senior AWS and product work. Fixed scope, no agency markup.
  </p>
  <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
   {services.items.map((item) => (
    <div
     key={item.href}
     className="flex flex-col overflow-hidden rounded-xl bg-gray-50 text-gray-900 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-slate-800 dark:text-gray-100"
    >
     {item.video ? (
      <video
       controls
       playsInline
       preload="none"
       poster={item.video.poster}
       aria-label={item.video.title}
       className="aspect-video w-full bg-slate-900"
      >
       <source src={item.video.src} type="video/mp4" />
      </video>
     ) : null}
     <Link
      to={item.href}
      className="flex flex-grow flex-col p-4 text-gray-900 no-underline hover:text-gray-900 hover:no-underline dark:text-gray-100 dark:hover:text-gray-100"
     >
      <p className="mb-2 font-sans text-lg font-semibold text-brand">
       {item.title}
      </p>
      <p className="mb-2 flex-grow text-gray-700 dark:text-gray-300">
       {item.text}
      </p>
      <p className="mb-0 text-sm font-semibold text-brand">
       {services.linkLabel}
      </p>
     </Link>
    </div>
   ))}
  </div>
  <Link
   to="/one-man-agency/"
   className="inline-flex items-center justify-center rounded-lg bg-brand-solid px-6 py-3 font-semibold text-white no-underline shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-solidHover hover:text-white hover:no-underline hover:shadow-xl dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 dark:hover:text-slate-900"
  >
   How I work
  </Link>
 </section>
)

export default HomeAgencyPitch
