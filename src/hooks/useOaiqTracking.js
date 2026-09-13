import { useEffect, useState } from "react"
import {
 buildCalendlyUrl,
 captureOppref,
 inviteeIdFromUri,
 measureAppointmentScheduled,
 measurePageViewed,
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

/** Init oppref + page_viewed; Calendly popup so pixel can see the booking. */
const useOaiqTracking = () => {
 const [calendlyUrl, setCalendlyUrl] = useState(() => buildCalendlyUrl())

 useEffect(() => {
  captureOppref()
  setCalendlyUrl(buildCalendlyUrl())
  measurePageViewed()
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
