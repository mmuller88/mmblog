import React from "react"

const FaqAccordion = ({ items }) => (
 <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
  {items.map((item, index) => (
   <details
    key={item.q}
    className={`group ${
     index > 0 ? "border-t border-gray-200 dark:border-slate-700" : ""
    }`}
   >
    <summary className="!flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/40 [&::-webkit-details-marker]:hidden">
     <h3 className="!mb-0 min-w-0 flex-1 font-sans text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
      {item.q}
     </h3>
     <svg
      className="h-5 w-5 shrink-0 text-brand transition-transform duration-200 group-open:rotate-180"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
     >
      <path
       fillRule="evenodd"
       d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
       clipRule="evenodd"
      />
     </svg>
    </summary>
    <p className="!mb-0 px-5 pb-5 leading-relaxed text-gray-700 dark:text-gray-300">
     {item.a}
    </p>
   </details>
  ))}
 </div>
)

export default FaqAccordion
