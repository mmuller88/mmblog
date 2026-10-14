import React, { useEffect, useRef, useState } from "react"
import HeadingAnchorLink from "./HeadingAnchorLink"

const SectionHeading = ({ id, children, className = "mb-12" }) => {
 const [toast, setToast] = useState(null)
 const timerRef = useRef(null)

 useEffect(
  () => () => timerRef.current && window.clearTimeout(timerRef.current),
  []
 )

 const onCopied = () => {
  setToast("Copied!")
  if (timerRef.current) window.clearTimeout(timerRef.current)
  timerRef.current = window.setTimeout(() => setToast(null), 1500)
 }

 return (
  <h2
   id={id}
   className={`relative scroll-mt-8 text-center font-sans text-4xl font-bold text-gray-900 dark:text-gray-100 ${className}`}
  >
   <span className="inline-flex items-center justify-center gap-1">
    <HeadingAnchorLink id={id} onCopied={onCopied} />
    {children}
   </span>
   {toast ? (
    <span
     className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-md bg-gray-900 px-3 py-2 text-sm font-normal text-white shadow-lg"
     role="status"
    >
     {toast}
    </span>
   ) : null}
  </h2>
 )
}

export default SectionHeading
