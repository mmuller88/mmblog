export const OAIQ_PIXEL_ID = "1tUq9Gtv8XLgjUkRRiQmcH"
export const OAIQ_SDK_URL = "https://bzrcdn.openai.com/sdk/oaiq.min.js"
export const CALENDLY_BASE_URL = "https://calendly.com/martinmueller_dev/30min"
export const OPPREF_STORAGE_KEY = "oaiq_oppref"

export const OAIQ_LOADER_SCRIPT = `!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","${OAIQ_SDK_URL}");try{var p=new URLSearchParams(location.search).get("oppref");if(p){sessionStorage.setItem("${OPPREF_STORAGE_KEY}",p);localStorage.setItem("${OPPREF_STORAGE_KEY}",p)}}catch(e){}`

const measure = (eventName, data) => {
 if (typeof window !== "undefined" && window.oaiq) {
  window.oaiq("measure", eventName, data)
 }
}

export const measurePageViewed = () => {
 measure("page_viewed", { type: "contents" })
}

export const measureLeadCreated = () => {
 measure("lead_created", { type: "customer_action" })
}

export const inviteeIdFromUri = (uri) => {
 if (!uri) return null
 const match = String(uri).match(/invitees\/([a-z0-9-]+)/i)
 if (match?.[1]) return match[1]
 const tail = String(uri).split("/").filter(Boolean).pop()
 return tail || null
}

export const measureAppointmentScheduled = (eventId) => {
 if (typeof window === "undefined" || !window.oaiq) return
 const extras = eventId ? { event_id: eventId } : undefined
 window.oaiq("measure", "appointment_scheduled", { type: "customer_action" }, extras)
}

/** Persist oppref from ad click URL for Calendly attribution. */
export const captureOppref = () => {
 if (typeof window === "undefined") return null
 const fromUrl = new URLSearchParams(window.location.search).get("oppref")
 if (fromUrl) {
  sessionStorage.setItem(OPPREF_STORAGE_KEY, fromUrl)
  localStorage.setItem(OPPREF_STORAGE_KEY, fromUrl)
  return fromUrl
 }
 return sessionStorage.getItem(OPPREF_STORAGE_KEY) || localStorage.getItem(OPPREF_STORAGE_KEY)
}

export const getOppref = () => {
 if (typeof window === "undefined") return null
 return sessionStorage.getItem(OPPREF_STORAGE_KEY) || localStorage.getItem(OPPREF_STORAGE_KEY)
}

export const buildCalendlyUrl = () => {
 const params = new URLSearchParams({
  utm_source: "chatgpt_ads",
  utm_medium: "cpc",
 })
 const oppref = getOppref()
 if (oppref) {
  params.set("utm_content", oppref)
  params.set("utm_campaign", oppref)
 }
 return `${CALENDLY_BASE_URL}?${params.toString()}`
}
