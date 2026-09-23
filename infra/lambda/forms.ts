import { wrapHttp, errMsg } from "./adapter"
import { sendEmail } from "./lib/ses"

const SUBJECTS: Record<string, string> = {
  contact: "martinmueller.dev contact",
  "agency-contact": "martinmueller.dev agency contact",
  "training-request": "martinmueller.dev training request",
}

const ALLOWED_REDIRECTS = new Set(["/thx/"])

const wantsHtml = (req: Request): boolean => {
  const accept = req.headers.get("accept") || ""
  return accept.includes("text/html") && !accept.includes("application/json")
}

const okResponse = (req: Request, params: URLSearchParams): Response => {
  if (!wantsHtml(req)) return Response.json({ ok: true })
  const requested = params.get("redirect") || "/thx/"
  const location = ALLOWED_REDIRECTS.has(requested) ? requested : "/thx/"
  return new Response(null, { status: 303, headers: { Location: location } })
}

export const forms = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 })
  }

  const raw = await req.text()
  const params = new URLSearchParams(raw)
  if (params.get("bot-field")) {
    return okResponse(req, params)
  }

  const requested = params.get("form-name") || "contact"
  const formName = Object.prototype.hasOwnProperty.call(SUBJECTS, requested)
    ? requested
    : "contact"
  const subject = SUBJECTS[formName]
  const to = process.env.TO_EMAIL
  if (!to) return new Response("server not configured", { status: 500 })

  const lines: string[] = []
  for (const [key, value] of params.entries()) {
    if (key === "form-name" || key === "bot-field" || key === "redirect") {
      continue
    }
    lines.push(`${key}: ${value}`)
  }

  try {
    await sendEmail({
      to,
      subject,
      message: lines.join("\n") || "(empty)",
    })
  } catch (err) {
    console.error("forms ses error:", errMsg(err))
    return new Response("send failed", { status: 502 })
  }

  return okResponse(req, params)
}

export const handler = wrapHttp(forms)
