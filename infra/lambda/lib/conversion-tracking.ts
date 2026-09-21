import { createHash, createHmac } from "crypto"

export const PIXEL_ID = "1tUq9Gtv8XLgjUkRRiQmcH"
export const SOURCE_URL = "https://martinmueller.dev/one-man-agency/"
export const SIGNATURE_TOLERANCE_MS = 3 * 60 * 1000
export const HEALTHCHECK_INVITEE_PREFIX = "healthcheck-"

export type CapiEvent = {
  id: string
  type: string
  timestamp_ms: number
  source_url: string
  action_source: string
  data: { type: string }
  oppref?: string
  user?: { emails_sha256: string[] }
}

export const hashEmail = (email: string): string => {
  const normalized = email.trim().toLowerCase()
  return createHash("sha256").update(normalized, "utf8").digest("hex")
}

export const inviteeIdFromUri = (uri: unknown): string | null => {
  if (!uri) return null
  const match = String(uri).match(/invitees\/([a-z0-9-]+)/i)
  if (match?.[1]) return match[1]
  const tail = String(uri).split("/").filter(Boolean).pop()
  return tail || null
}

export const isHealthcheckInvitee = (inviteeId: string | null): boolean =>
  Boolean(inviteeId?.startsWith(HEALTHCHECK_INVITEE_PREFIX))

export const signCalendlyPayload = (
  rawBody: string,
  signingKey: string
): { header: string; timestamp: number } => {
  const t = Math.floor(Date.now() / 1000)
  const signature = createHmac("sha256", signingKey)
    .update(`${t}.${rawBody}`, "utf8")
    .digest("hex")
  return { header: `t=${t},v1=${signature}`, timestamp: t }
}

export const verifySignature = (
  rawBody: string,
  signatureHeader: string | null,
  signingKey: string
): boolean => {
  if (!signatureHeader || !signingKey) return false

  const parts = signatureHeader.split(",").reduce(
    (acc, pair) => {
      const [key, value] = pair.split("=")
      if (key === "t") acc.t = value ?? ""
      if (key === "v1") acc.signature = value ?? ""
      return acc
    },
    { t: "", signature: "" }
  )

  const { t, signature } = parts
  if (!t || !signature) return false

  const timestampMs = Number(t) * 1000
  if (timestampMs < Date.now() - SIGNATURE_TOLERANCE_MS) return false

  const expected = createHmac("sha256", signingKey)
    .update(`${t}.${rawBody}`, "utf8")
    .digest("hex")

  return expected === signature
}

export const sendCapiEvent = async (
  capiKey: string,
  event: CapiEvent,
  { validateOnly = false } = {}
): Promise<void> => {
  const res = await fetch(`https://bzr.openai.com/v1/events?pid=${PIXEL_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${capiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ validate_only: validateOnly, events: [event] }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`CAPI ${res.status}: ${text}`)
  }
}

export const buildAppointmentScheduledEvent = ({
  eventId,
  oppref,
  email,
}: {
  eventId: string
  oppref?: string
  email?: string
}): CapiEvent => {
  const capiEvent: CapiEvent = {
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

  return capiEvent
}
