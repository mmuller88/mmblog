import crypto from "crypto"

export const config = { path: "/api/calendly-webhook" }

const PIXEL_ID = "1tUq9Gtv8XLgjUkRRiQmcH"
const SOURCE_URL = "https://martinmueller.dev/one-man-agency/"
const SIGNATURE_TOLERANCE_MS = 3 * 60 * 1000

const hashEmail = (email) => {
 const normalized = email.trim().toLowerCase()
 return crypto.createHash("sha256").update(normalized, "utf8").digest("hex")
}

const verifySignature = (rawBody, signatureHeader, signingKey) => {
 if (!signatureHeader || !signingKey) return false

 const parts = signatureHeader.split(",").reduce(
  (acc, pair) => {
   const [key, value] = pair.split("=")
   if (key === "t") acc.t = value
   if (key === "v1") acc.signature = value
   return acc
  },
  { t: "", signature: "" }
 )

 const { t, signature } = parts
 if (!t || !signature) return false

 const timestampMs = Number(t) * 1000
 if (timestampMs < Date.now() - SIGNATURE_TOLERANCE_MS) return false

 const signedPayload = `${t}.${rawBody}`
 const expected = crypto
  .createHmac("sha256", signingKey)
  .update(signedPayload, "utf8")
  .digest("hex")

 return expected === signature
}

const inviteeIdFromUri = (uri) => {
 if (!uri) return null
 const match = uri.match(/invitees\/([a-f0-9-]+)/i)
 return match?.[1] ?? null
}

const sendCapiEvent = async (capiKey, event) => {
 const res = await fetch(`https://bzr.openai.com/v1/events?pid=${PIXEL_ID}`, {
  method: "POST",
  headers: {
   Authorization: `Bearer ${capiKey}`,
   "Content-Type": "application/json",
  },
  body: JSON.stringify({ validate_only: false, events: [event] }),
 })

 if (!res.ok) {
  const text = await res.text()
  throw new Error(`CAPI ${res.status}: ${text}`)
 }
}

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

 if (body.event !== "invitee.created") {
  return Response.json({ ok: true, skipped: body.event })
 }

 const payload = body.payload ?? {}
 const inviteeUri = payload.uri
 const eventId = inviteeIdFromUri(inviteeUri)
 if (!eventId) {
  return new Response("missing invitee id", { status: 400 })
 }

 const oppref = payload.tracking?.utm_content ?? undefined
 const email = payload.email

 const capiEvent = {
  id: eventId,
  type: "appointment_scheduled",
  timestamp_ms: Date.now(),
  source_url: SOURCE_URL,
  action_source: "web",
  data: { type: "customer_action" },
 }

 if (oppref) capiEvent.oppref = oppref
 if (email) {
  capiEvent.user = { emails_sha256: [hashEmail(email)] }
 }

 const capiKey = process.env.OPENAI_ADS_CAPI_KEY
 if (!capiKey) {
  console.error("OPENAI_ADS_CAPI_KEY not set")
  return new Response("capi not configured", { status: 500 })
 }

 try {
  await sendCapiEvent(capiKey, capiEvent)
 } catch (err) {
  console.error("CAPI error:", err.message)
  return new Response("capi failed", { status: 502 })
 }

 return Response.json({ ok: true, event_id: eventId })
}
