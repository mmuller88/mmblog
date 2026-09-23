import { createHash, randomBytes, timingSafeEqual } from "crypto"

export type Locale = "de" | "en"

export type CourseOffer = {
  title: string
  listPriceEur: number
  earlyBirdPriceEur: number
}

export const COURSES: Record<string, CourseOffer> = {
  "openclaw-personal-ai-os": {
    title: "OpenClaw: Personal AI OS",
    listPriceEur: 149,
    earlyBirdPriceEur: 99,
  },
  "opennext-cdk-mvp": {
    title: "Next.js MVP: OpenNext + CDK",
    listPriceEur: 199,
    earlyBirdPriceEur: 129,
  },
  "chatgpt-ads": {
    title: "ChatGPT Ads",
    listPriceEur: 99,
    earlyBirdPriceEur: 69,
  },
  "hetzner-eu-production": {
    title: "EU Production on Hetzner",
    listPriceEur: 119,
    earlyBirdPriceEur: 79,
  },
}

export type CsvRow = {
  course: string
  email: string
  name: string
  locale: string
  source: string
  confirmed: boolean
  listPriceEur: number
  earlyBirdPriceEur: number
  signedUpAt: string
  confirmedAt: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const courseFor = (slug: string): CourseOffer | undefined =>
  Object.prototype.hasOwnProperty.call(COURSES, slug) ? COURSES[slug] : undefined

export const courseSlugs = (): string[] => Object.keys(COURSES)

export const newConfirmToken = (): string => randomBytes(32).toString("hex")

export const hashToken = (token: string): string =>
  createHash("sha256").update(token, "utf8").digest("hex")

export const isConfirmToken = (token: string): boolean =>
  /^[a-f0-9]{64}$/.test(token)

export const isValidEmail = (email: string): boolean =>
  email.length <= 254 && EMAIL.test(email)

export const cleanText = (value: unknown, max: number): string => {
  if (typeof value !== "string") return ""
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max)
}

export const normalizeLocale = (value: unknown): Locale =>
  value === "de" ? "de" : "en"

export const pkFor = (slug: string): string => `COURSE#${slug}`

export const skFor = (email: string): string => `WAITLIST#${email}`

export const TOKEN_SK = "TOKEN"

export const tokenPk = (hash: string): string => `TOKEN#${hash}`

export const RATE_IP_MAX = 5

export const RATE_GLOBAL_MAX = 30

export const RESEND_COOLDOWN_MS = 15 * 60 * 1000

export const minuteBucket = (now = new Date()): string =>
  now.toISOString().slice(0, 16)

const IPV4 = /^(?:\d{1,3}\.){3}\d{1,3}$/
const IPV6 = /^[0-9a-fA-F:]{2,64}$/

export const clientIp = (forwardedFor: string | null): string => {
  if (!forwardedFor) return "unknown"
  const parts = forwardedFor
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
  const last = parts[parts.length - 1] ?? ""
  if (IPV4.test(last)) return last
  if (last.includes(":") && IPV6.test(last)) return last
  return "unknown"
}

export const withinCooldown = (
  lastMailAt: string | undefined,
  nowMs: number
): boolean => {
  if (!lastMailAt) return false
  const sent = Date.parse(lastMailAt)
  if (Number.isNaN(sent)) return false
  return nowMs - sent < RESEND_COOLDOWN_MS
}

export const slugFromPk = (pk: string): string =>
  pk.startsWith("COURSE#") ? pk.slice("COURSE#".length) : pk

export const bearerMatches = (
  authorization: string | null,
  key: string
): boolean => {
  if (!key || !authorization?.startsWith("Bearer ")) return false
  const presented = authorization.slice("Bearer ".length)
  const a = Buffer.from(presented)
  const b = Buffer.from(key)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

const csvCell = (value: unknown): string => {
  const text = value == null ? "" : String(value)
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

export const toCsv = (rows: CsvRow[]): string => {
  const header =
    "course,email,name,locale,source,confirmed,listPriceEur,earlyBirdPriceEur,signedUpAt,confirmedAt"
  const lines = rows.map((row) =>
    [
      row.course,
      row.email,
      row.name,
      row.locale,
      row.source,
      row.confirmed ? "true" : "false",
      row.listPriceEur,
      row.earlyBirdPriceEur,
      row.signedUpAt,
      row.confirmedAt,
    ]
      .map(csvCell)
      .join(",")
  )
  return [header, ...lines].join("\n") + "\n"
}

export const emfLine = (
  metric: "Signup" | "Confirm",
  course: string
): string =>
  JSON.stringify({
    _aws: {
      Timestamp: Date.now(),
      CloudWatchMetrics: [
        {
          Namespace: "Mmblog/Waitlist",
          Dimensions: [["Course"]],
          Metrics: [{ Name: metric, Unit: "Count" }],
        },
      ],
    },
    Course: course,
    [metric]: 1,
  })

export const thankYouLocation = (
  siteUrl: string,
  locale: Locale,
  course: string
): string => {
  const path =
    locale === "de"
      ? "/courses-de/waitlist-thank-you/"
      : "/courses/waitlist-thank-you/"
  const url = new URL(path, siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`)
  url.searchParams.set("confirmed", "1")
  url.searchParams.set("course", course)
  return url.toString()
}

export const confirmUrl = (siteUrl: string, token: string): string => {
  const base = siteUrl.replace(/\/$/, "")
  return `${base}/api/waitlist/confirm?token=${encodeURIComponent(token)}`
}

type Mail = { subject: string; message: string }

export const confirmMessage = (opts: {
  title: string
  confirmUrl: string
  earlyBirdPriceEur: number
  listPriceEur: number
  locale: Locale
}): Mail => {
  const price = `€${opts.earlyBirdPriceEur} (public €${opts.listPriceEur})`
  if (opts.locale === "de") {
    return {
      subject: `Warteliste bestätigen: ${opts.title}`,
      message: [
        `Sie stehen auf der Warteliste für ${opts.title}.`,
        "",
        "Bitte E-Mail bestätigen, um den Early-Bird-Preis zu sichern:",
        opts.confirmUrl,
        "",
        `Early-Bird: €${opts.earlyBirdPriceEur} (öffentlich €${opts.listPriceEur}) — reserviert für bestätigte Wartelisten-Mitglieder, 14 Tage nach dem Start.`,
      ].join("\n"),
    }
  }
  return {
    subject: `Confirm your waitlist: ${opts.title}`,
    message: [
      `You're on the waitlist for ${opts.title}.`,
      "",
      "Confirm your email to lock in early-bird pricing:",
      opts.confirmUrl,
      "",
      `Early-bird: ${price} — reserved for confirmed waitlist members for 14 days after launch.`,
    ].join("\n"),
  }
}

export type SignupNotice = {
  title: string
  email: string
  name: string
  locale: string
  source: string
  at: string
  confirmed: boolean
}

export const ownerSignupMessage = (notice: SignupNotice): Mail => {
  const who = notice.name ? `${notice.email} (${notice.name})` : notice.email
  const status = notice.confirmed ? "confirmed" : "pending confirm"
  return {
    subject: `Course signup (${status}): ${notice.title}`,
    message: [
      notice.confirmed
        ? `${who} confirmed ${notice.title}.`
        : `${who} joined the waitlist for ${notice.title}. Email not confirmed yet.`,
      "",
      `Locale: ${notice.locale || "-"}`,
      `Source: ${notice.source || "-"}`,
      `At: ${notice.at}`,
    ].join("\n"),
  }
}

const BERLIN = "Europe/Berlin"

const zonedParts = (date: Date, timeZone: string): Record<string, string> => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  const out: Record<string, string> = {}
  for (const part of fmt.formatToParts(date)) {
    if (part.type !== "literal") out[part.type] = part.value
  }
  return out
}

const zonedOffsetMs = (date: Date, timeZone: string): number => {
  const parts = zonedParts(date, timeZone)
  let hour = Number(parts.hour)
  let day = Number(parts.day)
  if (hour === 24) {
    hour = 0
    day += 1
  }
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    day,
    hour,
    Number(parts.minute),
    Number(parts.second)
  )
  return asUtc - date.getTime()
}

const zonedMidnightUtc = (
  year: number,
  month: number,
  day: number,
  timeZone: string
): number => {
  const guess = Date.UTC(year, month - 1, day)
  const offset = zonedOffsetMs(new Date(guess), timeZone)
  const corrected = guess - offset
  const offset2 = zonedOffsetMs(new Date(corrected), timeZone)
  return offset2 === offset ? corrected : guess - offset2
}

const pad = (n: number): string => String(n).padStart(2, "0")

export const previousBerlinDay = (
  now: Date
): { startMs: number; endMs: number; label: string } => {
  const today = zonedParts(now, BERLIN)
  const y = Number(today.year)
  const m = Number(today.month)
  const d = Number(today.day)
  const yesterday = new Date(Date.UTC(y, m - 1, d - 1))
  const yy = yesterday.getUTCFullYear()
  const ym = yesterday.getUTCMonth() + 1
  const yd = yesterday.getUTCDate()
  return {
    startMs: zonedMidnightUtc(yy, ym, yd, BERLIN),
    endMs: zonedMidnightUtc(y, m, d, BERLIN),
    label: `${yy}-${pad(ym)}-${pad(yd)}`,
  }
}

const inWindow = (iso: string, startMs: number, endMs: number): boolean => {
  const t = Date.parse(iso)
  return Number.isFinite(t) && t >= startMs && t < endMs
}

export const dailySummaryMessage = (rows: CsvRow[], now: Date): Mail => {
  const day = previousBerlinDay(now)
  const signed = rows.filter((row) =>
    inWindow(row.signedUpAt, day.startMs, day.endMs)
  )
  const confirmed = rows.filter((row) =>
    inWindow(row.confirmedAt, day.startMs, day.endMs)
  )
  const lines = [
    `Course signups ${day.label} (Europe/Berlin)`,
    "",
    `Yesterday: ${signed.length} signed up, ${confirmed.length} confirmed`,
    `All time: ${rows.length} signed up, ${rows.filter((row) => row.confirmed).length} confirmed`,
    "",
  ]
  for (const slug of courseSlugs()) {
    const title = courseFor(slug)?.title ?? slug
    const all = rows.filter((row) => row.course === slug)
    const confirmedCount = all.filter((row) => row.confirmed).length
    lines.push(title)
    lines.push(
      `  total ${all.length}, confirmed ${confirmedCount}, pending ${all.length - confirmedCount}`
    )
    const activity = all
      .filter(
        (row) =>
          inWindow(row.signedUpAt, day.startMs, day.endMs) ||
          inWindow(row.confirmedAt, day.startMs, day.endMs)
      )
      .sort((a, b) => a.signedUpAt.localeCompare(b.signedUpAt))
    for (const row of activity) {
      const joined = inWindow(row.signedUpAt, day.startMs, day.endMs)
      const didConfirm = inWindow(row.confirmedAt, day.startMs, day.endMs)
      const what =
        joined && didConfirm
          ? "signed up and confirmed"
          : didConfirm
            ? "confirmed"
            : "signed up, pending"
      const who = row.name ? `${row.email} (${row.name})` : row.email
      lines.push(`  ${who} — ${what}`)
    }
    lines.push("")
  }
  return {
    subject: `Course signups ${day.label}`,
    message: lines.join("\n").trimEnd() + "\n",
  }
}

export const welcomeMessage = (opts: {
  title: string
  earlyBirdPriceEur: number
  listPriceEur: number
  locale: Locale
}): Mail => {
  if (opts.locale === "de") {
    return {
      subject: `Early-Bird gesichert: ${opts.title}`,
      message: [
        `Ihre Anmeldung für ${opts.title} ist bestätigt.`,
        "",
        `Early-Bird: €${opts.earlyBirdPriceEur} (öffentlich €${opts.listPriceEur}) — reserviert für bestätigte Wartelisten-Mitglieder, 14 Tage nach dem Start.`,
        "Wir schreiben Ihnen, wenn der Kurs startet.",
      ].join("\n"),
    }
  }
  return {
    subject: `Early-bird locked in: ${opts.title}`,
    message: [
      `You're confirmed for ${opts.title}.`,
      "",
      `Early-bird: €${opts.earlyBirdPriceEur} (public €${opts.listPriceEur}) — reserved for confirmed waitlist members for 14 days after launch.`,
      "We'll email you when the course launches.",
    ].join("\n"),
  }
}
