import { wrapHttp, errMsg } from "./adapter"
import {
  buildAppointmentScheduledEvent,
  inviteeIdFromUri,
  isHealthcheckInvitee,
  sendCapiEvent,
  verifySignature,
} from "./lib/conversion-tracking"
import { getSecrets } from "./lib/secrets"

type CalendlyBody = {
  event?: string
  payload?: {
    uri?: string
    email?: string
    tracking?: {
      utm_source?: string
      utm_content?: string
      utm_campaign?: string
    }
  }
}

export const calendlyWebhook = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 })
  }

  const secrets = await getSecrets()
  const signingKey = secrets.CALENDLY_WEBHOOK_SIGNING_KEY
  if (!signingKey) {
    return new Response("server not configured", { status: 500 })
  }

  const rawBody = await req.text()
  const signatureHeader = req.headers.get("Calendly-Webhook-Signature")

  if (!verifySignature(rawBody, signatureHeader, signingKey)) {
    return new Response("invalid signature", { status: 401 })
  }

  let body: CalendlyBody
  try {
    body = JSON.parse(rawBody) as CalendlyBody
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

  const eventId = inviteeIdFromUri(payload.uri)
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

  const capiKey = secrets.OPENAI_ADS_CAPI_KEY
  if (!capiKey) {
    console.error("OPENAI_ADS_CAPI_KEY not set")
    return new Response("capi not configured", { status: 500 })
  }

  try {
    await sendCapiEvent(capiKey, capiEvent, { validateOnly })
  } catch (err) {
    console.error("CAPI error:", errMsg(err))
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
  return Response.json({
    ok: true,
    event_id: eventId,
    validate_only: validateOnly,
  })
}

export const handler = wrapHttp(calendlyWebhook)
