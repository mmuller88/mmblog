import React from "react"

const ANCHOR_SVG = `<svg aria-hidden="true" height="20" width="20" viewBox="0 0 16 16" fill="currentColor"><path d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>`

const SectionHeading = ({ id, children, className = "mb-12" }) => (
 <h2
  id={id}
  className={`relative scroll-mt-8 text-center font-sans text-4xl font-bold text-gray-900 dark:text-gray-100 ${className}`}
 >
  <span className="inline-flex items-center justify-center gap-1">
   <a
    href={`#${id}`}
    className="heading-anchor !opacity-60 hover:!opacity-100 focus:!opacity-100"
    aria-label={`Link to ${children}`}
    dangerouslySetInnerHTML={{ __html: ANCHOR_SVG }}
   />
   {children}
  </span>
 </h2>
)

export default SectionHeading
