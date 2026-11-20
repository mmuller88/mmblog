import React, { useEffect } from "react"

const ImageLightbox = ({ src, alt = "", isDe = false, onClose }) => {
 useEffect(() => {
  if (!src) return undefined
  const onKey = (event) => {
   if (event.key === "Escape") onClose()
  }
  const prevOverflow = document.body.style.overflow
  document.body.style.overflow = "hidden"
  window.addEventListener("keydown", onKey)
  return () => {
   document.body.style.overflow = prevOverflow
   window.removeEventListener("keydown", onKey)
  }
 }, [src, onClose])

 if (!src) return null

 return (
  <div
   className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
   role="dialog"
   aria-modal="true"
   aria-label={isDe ? "Vergrößertes Bild" : "Expanded image"}
   onClick={onClose}
  >
   <button
    type="button"
    className="absolute right-4 top-4 rounded-lg border border-white/30 bg-black/50 px-3 py-2 text-sm font-semibold text-white"
    onClick={onClose}
   >
    {isDe ? "Schließen" : "Close"}
   </button>
   <img
    src={src}
    alt={alt}
    className="max-h-[90vh] max-w-full object-contain"
    onClick={(event) => event.stopPropagation()}
   />
  </div>
 )
}

export default ImageLightbox
