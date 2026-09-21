import { wrapHttp, errMsg } from "./adapter"
import { sendEmail } from "./lib/ses"

const SUBJECTS: Record<string, string> = {
  contact: "martinmueller.dev contact",
  "agency-contact": "martinmueller.dev agency contact",
}

export const forms = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 })
  }

  const raw = await req.text()
  const params = new URLSearchParams(raw)
  if (params.get("bot-field")) {
    return Response.json({ ok: true })
  }

  const formName = params.get("form-name") || "contact"
  const subject = SUBJECTS[formName] || `martinmueller.dev ${formName}`
  const to = process.env.TO_EMAIL
  if (!to) return new Response("server not configured", { status: 500 })

  const lines: string[] = []
  for (const [key, value] of params.entries()) {
    if (key === "form-name" || key === "bot-field") continue
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

  return Response.json({ ok: true })
}

export const handler = wrapHttp(forms)
