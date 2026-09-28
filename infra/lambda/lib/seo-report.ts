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
}

export type MetricPoint = {
  name: "Impressions" | "Clicks"
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
  hits: GscHit[]
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
    return {
      tag: row.tag,
      keyword: row.keyword,
      path: row.path,
      impressions: totalsForRow?.impressions ?? 0,
      clicks: totalsForRow?.clicks ?? 0,
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
  }
  return points
}

const pad = (value: string, width: number): string => value.padEnd(width)

export const formatEmail = (
  runDate: string,
  window: { startDate: string; endDate: string },
  rows: MeasuredRow[],
  dashboardUrl: string
): string => {
  const header = ["Tag", "Keyword", "URL", "Impressions", "Clicks"]
  const body = rows.map((row) => [
    row.tag,
    row.keyword,
    row.path,
    String(row.impressions),
    String(row.clicks),
  ])
  const widths = header.map((label, index) =>
    Math.max(label.length, ...body.map((cells) => cells[index].length))
  )
  const line = (cells: string[]) =>
    cells.map((cell, index) => pad(cell, widths[index])).join("  ")

  return [
    `mmblog SEO ${runDate}`,
    `GSC ${window.startDate}..${window.endDate}, country DE, 28 days. Newest days can still change.`,
    dashboardUrl,
    "",
    line(header),
    ...body.map(line),
  ].join("\n")
}
