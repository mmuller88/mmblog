import type { ScorecardKeyword } from "../seo-keywords"

export type GscHit = {
  page: string
  query: string
  impressions: number
  clicks: number
}

export type MeasuredRow = {
  tag: string
  keyword: string
  path: string
  impressions: number
  clicks: number
  position: number | null
}

export type MetricPoint = {
  name: "Impressions" | "Clicks" | "Position"
  keyword: string
  value: number
}

const isoDate = (date: Date): string => date.toISOString().slice(0, 10)

export const gscWindow = (
  now: Date
): { startDate: string; endDate: string } => {
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
  end.setUTCDate(end.getUTCDate() - 1)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 27)
  return { startDate: isoDate(start), endDate: isoDate(end) }
}

export const pagePath = (raw: string): string => {
  try {
    const path = new URL(raw).pathname || "/"
    if (path.length > 1 && !path.endsWith("/")) return `${path}/`
    return path
  } catch {
    return raw
  }
}

const hitKey = (path: string, query: string): string =>
  `${path}\n${query.trim().toLowerCase()}`

export const measureRows = (
  keywords: ScorecardKeyword[],
  hits: GscHit[],
  positions: ReadonlyMap<string, number | null>
): MeasuredRow[] => {
  const totals = new Map<string, { impressions: number; clicks: number }>()
  for (const hit of hits) {
    const key = hitKey(pagePath(hit.page), hit.query)
    const prev = totals.get(key) ?? { impressions: 0, clicks: 0 }
    prev.impressions += hit.impressions
    prev.clicks += hit.clicks
    totals.set(key, prev)
  }

  return keywords.map((row) => {
    const totalsForRow = totals.get(hitKey(row.path, row.keyword))
    const position = positions.get(row.keyword.toLowerCase())
    return {
      tag: row.tag,
      keyword: row.keyword,
      path: row.path,
      impressions: totalsForRow?.impressions ?? 0,
      clicks: totalsForRow?.clicks ?? 0,
      position: position === undefined ? null : position,
    }
  })
}

export const metricPoints = (rows: MeasuredRow[]): MetricPoint[] => {
  const points: MetricPoint[] = []
  for (const row of rows) {
    points.push(
      { name: "Impressions", keyword: row.keyword, value: row.impressions },
      { name: "Clicks", keyword: row.keyword, value: row.clicks }
    )
    if (row.position !== null) {
      points.push({
        name: "Position",
        keyword: row.keyword,
        value: row.position,
      })
    }
  }
  return points
}

type SistrixResult = {
  position?: number | string
  domain?: string
  url?: string
}

type SistrixResponse = {
  status?: string
  error?: Array<{ error_code?: string | number; error_message?: string }>
  answer?: Array<{ result?: SistrixResult | SistrixResult[] }>
}

const asArray = <T>(value: T | T[] | undefined): T[] => {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

const hostnameMatches = (hostname: string, host: string): boolean => {
  const name = hostname.replace(/^www\./, "").toLowerCase()
  return name === host || name.endsWith(`.${host}`)
}

const rowMatchesHost = (row: SistrixResult, host: string): boolean => {
  if (row.domain && hostnameMatches(row.domain, host)) return true
  if (row.url) {
    try {
      return hostnameMatches(new URL(row.url).hostname, host)
    } catch {
      return false
    }
  }
  // keyword.seo often returns only position when the request already set domain.
  return !row.domain
}

export const parseSistrixBody = (
  text: string,
  domain: string
): number | null => {
  const json = JSON.parse(text) as SistrixResponse
  const errorCode = json.error?.[0]?.error_code
  if (String(errorCode) === "1000") return null
  if (json.status === "fail") {
    const message = json.error?.[0]?.error_message ?? text
    throw new Error(message)
  }

  const host = domain.toLowerCase()
  const positions = asArray(json.answer?.[0]?.result)
    .filter((row) => rowMatchesHost(row, host))
    .map((row) => Number(row.position))
    .filter((position) => Number.isFinite(position) && position > 0)

  if (positions.length === 0) return null
  return Math.min(...positions)
}

const pad = (value: string, width: number): string => value.padEnd(width)

export const formatEmail = (
  runDate: string,
  window: { startDate: string; endDate: string },
  rows: MeasuredRow[],
  dashboardUrl: string
): string => {
  const header = ["Tag", "Keyword", "URL", "Impressions", "Clicks", "Position"]
  const body = rows.map((row) => [
    row.tag,
    row.keyword,
    row.path,
    String(row.impressions),
    String(row.clicks),
    row.position === null ? "—" : String(row.position),
  ])
  const widths = header.map((label, index) =>
    Math.max(label.length, ...body.map((cells) => cells[index].length))
  )
  const line = (cells: string[]) =>
    cells.map((cell, index) => pad(cell, widths[index])).join("  ")

  return [
    `mmblog SEO ${runDate}`,
    `GSC ${window.startDate}..${window.endDate}, country DE, 28 days. Newest days can still change.`,
    "Position is SISTRIX Google DE. No rank is — and is not stored as 0.",
    dashboardUrl,
    "",
    line(header),
    ...body.map(line),
  ].join("\n")
}
