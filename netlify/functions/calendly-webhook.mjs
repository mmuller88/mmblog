import {
 buildAppointmentScheduledEvent,
 inviteeIdFromUri,
 isHealthcheckInvitee,
 sendCapiEvent,
 verifySignature,
} from "../lib/conversion-tracking.mjs"

export const config = { path: "/api/calendly-webhook" }

export default async (req) => {
 if (req.method !== "POST") {
  return new Response("method not allowed", { status: 405 })
 }

 const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY
 if (!signingKey) {
  return new Response("server not configured", { status: 500 })
 }

 const rawBody = await req.text()
 const signatureHeader = req.headers.get("Calendly-Webhook-Signature")

 if (!verifySignature(rawBody, signatureHeader, signingKey)) {
  return new Response("invalid signature", { status: 401 })
 }

 let body
 try {
  body = JSON.parse(rawBody)
 } catch {
  return new Response("invalid json", { status: 400 })
 }

 const payload = body.payload ?? {}
 const tracking = payload.tracking ?? {}
 console.log(
  "calendly-webhook recv",
  JSON.stringify({
   event: body.event,
   uri: payload.uri ?? null,
   utm_source: tracking.utm_source ?? null,
   utm_content: tracking.utm_content ?? null,
   utm_campaign: tracking.utm_campaign ?? null,
  })
 )

 if (body.event !== "invitee.created") {
  return Response.json({ ok: true, skipped: body.event })
 }

 const inviteeUri = payload.uri
 const eventId = inviteeIdFromUri(inviteeUri)
 if (!eventId) {
  console.error("calendly-webhook missing invitee id", payload.uri ?? "")
  return new Response("missing invitee id", { status: 400 })
 }

 const validateOnly = isHealthcheckInvitee(eventId)
 const capiEvent = buildAppointmentScheduledEvent({
  eventId,
  oppref: tracking.utm_content || tracking.utm_campaign || undefined,
  email: payload.email,
 })

 const capiKey = process.env.OPENAI_ADS_CAPI_KEY
 if (!capiKey) {
  console.error("OPENAI_ADS_CAPI_KEY not set")
  return new Response("capi not configured", { status: 500 })
 }

 try {
  await sendCapiEvent(capiKey, capiEvent, { validateOnly })
 } catch (err) {
  console.error("CAPI error:", err.message)
  return new Response("capi failed", { status: 502 })
 }

 console.log(
  "calendly-webhook ok",
  JSON.stringify({
   event_id: eventId,
   validate_only: validateOnly,
   has_oppref: Boolean(capiEvent.oppref),
  })
 )
 return Response.json({ ok: true, event_id: eventId, validate_only: validateOnly })
}
