import { wrapScheduled, errMsg } from "./adapter"
import { sendAlertSafe } from "./lib/alert"
import {
  buildAppointmentScheduledEvent,
  HEALTHCHECK_INVITEE_PREFIX,
  sendCapiEvent,
  signCalendlyPayload,
} from "./lib/conversion-tracking"
import { getSecrets } from "./lib/secrets"

const WEBHOOK_URL =
  process.env.WEBHOOK_URL || "https://martinmueller.dev/api/calendly-webhook"
const HEALTHCHECK_EMAIL = "healthcheck@martinmueller.dev"

const runWebhookProbe = async (signingKey: string) => {
  const inviteeId = `${HEALTHCHECK_INVITEE_PREFIX}${new Date()
    .toISOString()
    .slice(0, 10)}`
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

  let parsed: { ok?: boolean; validate_only?: boolean }
  try {
    parsed = JSON.parse(text) as { ok?: boolean; validate_only?: boolean }
  } catch {
    throw new Error(`webhook probe invalid json: ${text}`)
  }

  if (!parsed.ok) {
    throw new Error(`webhook probe unexpected body: ${text}`)
  }

  return { inviteeId, validateOnly: parsed.validate_only === true }
}

const runCapiProbe = async (capiKey: string): Promise<string> => {
  const inviteeId = `${HEALTHCHECK_INVITEE_PREFIX}capi-${Date.now()}`
  const capiEvent = buildAppointmentScheduledEvent({
    eventId: inviteeId,
    oppref: "healthcheck",
    email: HEALTHCHECK_EMAIL,
  })

  await sendCapiEvent(capiKey, capiEvent, { validateOnly: true })
  return inviteeId
}

export const conversionHealth = async (): Promise<Response> => {
  const secrets = await getSecrets()
  const signingKey = secrets.CALENDLY_WEBHOOK_SIGNING_KEY
  const capiKey = secrets.OPENAI_ADS_CAPI_KEY

  if (!signingKey || !capiKey) {
    console.error("conversion-health: missing secrets")
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
    const message = errMsg(err)
    console.error("conversion-health failed:", message)
    await sendAlertSafe(`conversion-health failed: ${message}`)
    return new Response(message, { status: 502 })
  }
}

export const handler = wrapScheduled(conversionHealth)
export default conversionHealth
