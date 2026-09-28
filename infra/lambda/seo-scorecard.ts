import {
  CloudWatchClient,
  PutMetricDataCommand,
  StandardUnit,
} from "@aws-sdk/client-cloudwatch"
import { createSign } from "crypto"
import { wrapScheduled, errMsg } from "./adapter"
import { sendEmail } from "./lib/ses"
import {
  getSecrets,
  type GoogleServiceAccount,
} from "./lib/secrets"
import {
  formatEmail,
  gscWindow,
  measureRows,
  metricPoints,
  parseSistrixBody,
  type GscHit,
} from "./lib/seo-report"
import { SCORECARD } from "./seo-keywords"

const GSC_SITE = "sc-domain:martinmueller.dev"
const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
const TOKEN_URL = "https://oauth2.googleapis.com/token"
const DOMAIN = "martinmueller.dev"

const cloudwatch = new CloudWatchClient({})

const b64url = (value: Buffer | string): string =>
  Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

const serviceAccount = (
  raw: string | GoogleServiceAccount
): GoogleServiceAccount => {
  const parsed = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw
  if (
    !parsed ||
    typeof parsed !== "object" ||
    typeof (parsed as GoogleServiceAccount).client_email !== "string" ||
    typeof (parsed as GoogleServiceAccount).private_key !== "string"
  ) {
    throw new Error("GSC_SERVICE_ACCOUNT_JSON is missing client_email or private_key")
  }
  const account = parsed as GoogleServiceAccount
  const privateKey = account.private_key.includes("\n")
    ? account.private_key
    : account.private_key.replace(/\\n/g, "\n")
  return { client_email: account.client_email, private_key: privateKey }
}

const googleAccessToken = async (
  account: GoogleServiceAccount
): Promise<string> => {
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const payload = b64url(
    JSON.stringify({
      iss: account.client_email,
      scope: GSC_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  )
  const unsigned = `${header}.${payload}`
  const signature = createSign("RSA-SHA256").update(unsigned).sign(account.private_key)
  const assertion = `${unsigned}.${b64url(signature)}`

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(15000),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`google token ${res.status}: ${text}`)
  const json = JSON.parse(text) as { access_token?: string }
  if (!json.access_token) throw new Error("google token response has no access_token")
  return json.access_token
}

type GscQueryResponse = {
  rows?: Array<{
    keys?: string[]
    clicks?: number
    impressions?: number
  }>
}

const fetchGsc = async (
  token: string,
  window: { startDate: string; endDate: string }
): Promise<GscHit[]> => {
  const site = encodeURIComponent(GSC_SITE)
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: window.startDate,
        endDate: window.endDate,
        dimensions: ["page", "query"],
        dimensionFilterGroups: [
          {
            filters: [
              { dimension: "country", operator: "equals", expression: "deu" },
            ],
          },
        ],
        rowLimit: 5000,
        dataState: "all",
      }),
      signal: AbortSignal.timeout(20000),
    }
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`gsc ${res.status}: ${text}`)
  const json = JSON.parse(text) as GscQueryResponse
  const rows = json.rows ?? []
  if (rows.length >= 5000) {
    throw new Error("gsc returned 5000 rows; raise the limit before trusting zeros")
  }
  return rows.map((row) => ({
    page: row.keys?.[0] ?? "",
    query: row.keys?.[1] ?? "",
    impressions: row.impressions ?? 0,
    clicks: row.clicks ?? 0,
  }))
}

const fetchPosition = async (
  apiKey: string,
  keyword: string
): Promise<number | null> => {
  const url = new URL("https://api.sistrix.com/keyword.seo")
  url.searchParams.set("api_key", apiKey)
  url.searchParams.set("kw", keyword)
  url.searchParams.set("country", "de")
  url.searchParams.set("domain", DOMAIN)
  url.searchParams.set("format", "json")

  const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
  const text = await res.text()
  if (!res.ok) throw new Error(`sistrix ${keyword} ${res.status}: ${text}`)
  try {
    return parseSistrixBody(text, DOMAIN)
  } catch (err) {
    throw new Error(`sistrix ${keyword}: ${errMsg(err)}`)
  }
}

const publish = async (
  points: ReturnType<typeof metricPoints>
): Promise<void> => {
  if (points.length === 0) return
  await cloudwatch.send(
    new PutMetricDataCommand({
      Namespace: "Mmblog/Seo",
      MetricData: points.map((point) => ({
        MetricName: point.name,
        Dimensions: [{ Name: "Keyword", Value: point.keyword }],
        Value: point.value,
        Unit: point.name === "Position" ? StandardUnit.None : StandardUnit.Count,
      })),
    })
  )
}

export const seoScorecard = async (): Promise<Response> => {
  const to = process.env.SEO_EMAIL
  const dashboardUrl = process.env.DASHBOARD_URL
  if (!to || !dashboardUrl) {
    console.error("seo-scorecard: missing SEO_EMAIL or DASHBOARD_URL")
    return new Response("missing env", { status: 500 })
  }

  const fail = async (message: string): Promise<Response> => {
    console.error("seo-scorecard failed:", message)
    try {
      await sendEmail({ to, subject: "mmblog SEO failed", message })
    } catch (err) {
      console.error("seo-scorecard alert failed:", errMsg(err))
    }
    return new Response(message, { status: 502 })
  }

  try {
    const secrets = await getSecrets()
    if (!secrets.GSC_SERVICE_ACCOUNT_JSON || !secrets.SISTRIX_API_KEY) {
      return await fail("missing GSC_SERVICE_ACCOUNT_JSON or SISTRIX_API_KEY")
    }

    const now = new Date()
    const window = gscWindow(now)
    const token = await googleAccessToken(serviceAccount(secrets.GSC_SERVICE_ACCOUNT_JSON))
    const hits = await fetchGsc(token, window)

    const positions = new Map<string, number | null>()
    for (const row of SCORECARD) {
      positions.set(
        row.keyword.toLowerCase(),
        await fetchPosition(secrets.SISTRIX_API_KEY, row.keyword)
      )
    }

const rows = measureRows(SCORECARD, hits, positions)
    const runDate = now.toISOString().slice(0, 10)
    await sendEmail({
      to,
      subject: `mmblog SEO ${runDate}`,
      message: formatEmail(runDate, window, rows, dashboardUrl),
    })
    await publish(metricPoints(rows))
    console.log("seo-scorecard ok", JSON.stringify({ runDate, window, rows }))
    return Response.json({ ok: true, runDate, rows })
  } catch (err) {
    return await fail(errMsg(err))
  }
}

export const handler = wrapScheduled(seoScorecard)
export default seoScorecard
