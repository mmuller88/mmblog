import { useEffect, useState } from "react"
import {
 buildCalendlyUrl,
 captureOppref,
 inviteeIdFromUri,
 measureAppointmentScheduled,
} from "../utils/oaiq"

const loadCalendlyWidget = () => {
 if (typeof document === "undefined") return
 if (document.querySelector("script[data-calendly-widget]")) return
 const script = document.createElement("script")
 script.src = "https://assets.calendly.com/assets/external/widget.js"
 script.async = true
 script.dataset.calendlyWidget = "true"
 document.body.appendChild(script)
}

/** Calendly popup so pixel can see the booking. oppref/page_viewed are sitewide. */
const useOaiqTracking = () => {
 const [calendlyUrl, setCalendlyUrl] = useState(() => buildCalendlyUrl())

 useEffect(() => {
  captureOppref()
  setCalendlyUrl(buildCalendlyUrl())
  loadCalendlyWidget()

  const onMessage = (event) => {
   if (event.data?.event !== "calendly.event_scheduled") return
   const eventId = inviteeIdFromUri(event.data?.payload?.invitee?.uri)
   measureAppointmentScheduled(eventId)
  }

  window.addEventListener("message", onMessage)
  return () => window.removeEventListener("message", onMessage)
 }, [])

 const openCalendly = (event) => {
  event.preventDefault()
  captureOppref()
  const url = buildCalendlyUrl()
  setCalendlyUrl(url)
  if (window.Calendly?.initPopupWidget) {
   window.Calendly.initPopupWidget({ url })
   return
  }
  window.open(url, "_blank", "noopener,noreferrer")
 }

 return { calendlyUrl, openCalendly }
}

export default useOaiqTracking
