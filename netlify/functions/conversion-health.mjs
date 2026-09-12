import { sendAlert } from "../lib/alert.mjs"
import {
 buildAppointmentScheduledEvent,
 sendCapiEvent,
 signCalendlyPayload,
 HEALTHCHECK_INVITEE_PREFIX,
} from "../lib/conversion-tracking.mjs"

// Daily synthetic test: signed webhook POST + CAPI validate_only (no real conversions).
export const config = { schedule: "0 7 * * *" }

const WEBHOOK_URL = "https://martinmueller.dev/api/calendly-webhook"
const HEALTHCHECK_EMAIL = "healthcheck@martinmueller.dev"

const runWebhookProbe = async (signingKey) => {
 const inviteeId = `${HEALTHCHECK_INVITEE_PREFIX}${new Date().toISOString().slice(0, 10)}`
 const body = {
  event: "invitee.created",
  payload: {
   uri: `https://api.calendly.com/scheduled_events/00000000-0000-0000-0000-000000000000/invitees/${inviteeId}`,
   email: HEALTHCHECK_EMAIL,
   tracking: { utm_content: "healthcheck" },
  },
 }

 const rawBody = JSON.stringify(body)
 const { header } = signCalendlyPayload(rawBody, signingKey)
 const res = await fetch(WEBHOOK_URL, {
  method: "POST",
  headers: {
   "Content-Type": "application/json",
   "Calendly-Webhook-Signature": header,
  },
  body: rawBody,
 })

 const text = await res.text()
 if (!res.ok) {
  throw new Error(`webhook probe ${res.status}: ${text}`)
 }

 let parsed
 try {
  parsed = JSON.parse(text)
 } catch {
  throw new Error(`webhook probe invalid json: ${text}`)
 }

 if (!parsed.ok) {
  throw new Error(`webhook probe unexpected body: ${text}`)
 }

 return { inviteeId, validateOnly: parsed.validate_only === true }
}

const runCapiProbe = async (capiKey) => {
 const inviteeId = `${HEALTHCHECK_INVITEE_PREFIX}capi-${Date.now()}`
 const capiEvent = buildAppointmentScheduledEvent({
  eventId: inviteeId,
  oppref: "healthcheck",
  email: HEALTHCHECK_EMAIL,
 })

 await sendCapiEvent(capiKey, capiEvent, { validateOnly: true })
 return inviteeId
}

export default async () => {
 const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY
 const capiKey = process.env.OPENAI_ADS_CAPI_KEY

 if (!signingKey || !capiKey) {
  console.error("conversion-health: missing env vars")
  return new Response("missing env", { status: 500 })
 }

 try {
  const webhook = await runWebhookProbe(signingKey)
  const capiEventId = await runCapiProbe(capiKey)
  console.log(
   "conversion-health ok",
   JSON.stringify({ webhook, capiEventId })
  )
  return Response.json({ ok: true, webhook, capiEventId })
 } catch (err) {
  console.error("conversion-health failed:", err.message)
  try {
   await sendAlert(`conversion-health failed: ${err.message}`)
  } catch (alertErr) {
   console.error("conversion-health alert failed:", alertErr.message)
  }
  return new Response(err.message, { status: 502 })
 }
}
