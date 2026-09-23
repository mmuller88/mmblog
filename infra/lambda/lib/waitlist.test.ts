import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  COURSES,
  bearerMatches,
  clientIp,
  confirmMessage,
  courseFor,
  emfLine,
  hashToken,
  isValidEmail,
  newConfirmToken,
  thankYouLocation,
  dailySummaryMessage,
  ownerSignupMessage,
  previousBerlinDay,
  toCsv,
  welcomeMessage,
  withinCooldown,
  type CsvRow,
} from "./waitlist"

describe("course allowlist", () => {
  it("matches the published early-bird prices", () => {
    assert.deepEqual(courseFor("openclaw-personal-ai-os"), {
      title: "OpenClaw: Personal AI OS",
      listPriceEur: 149,
      earlyBirdPriceEur: 99,
    })
    assert.equal(courseFor("opennext-cdk-mvp")?.earlyBirdPriceEur, 129)
    assert.equal(courseFor("chatgpt-ads")?.listPriceEur, 99)
    assert.equal(courseFor("hetzner-eu-production")?.earlyBirdPriceEur, 79)
    assert.equal(courseFor("nope"), undefined)
    assert.equal(courseFor("__proto__"), undefined)
    assert.equal(courseFor("constructor"), undefined)
    assert.equal(courseFor("toString"), undefined)
    assert.equal(Object.keys(COURSES).length, 4)
  })
})

describe("client ip", () => {
  it("uses the last forwarded hop and ignores prototype slugs", () => {
    assert.equal(clientIp("1.1.1.1, 2.2.2.2"), "2.2.2.2")
    assert.equal(clientIp(null), "unknown")
    assert.equal(clientIp("not an ip"), "unknown")
  })
})

describe("resend cooldown", () => {
  it("blocks a second mail inside 15 minutes", () => {
    const now = Date.parse("2026-09-22T12:00:00.000Z")
    assert.equal(withinCooldown(undefined, now), false)
    assert.equal(withinCooldown("2026-09-22T11:50:00.000Z", now), true)
    assert.equal(withinCooldown("2026-09-22T11:40:00.000Z", now), false)
  })
})

describe("confirm token", () => {
  it("hashes without keeping the raw token", () => {
    const token = newConfirmToken()
    assert.match(token, /^[a-f0-9]{64}$/)
    assert.equal(hashToken(token), hashToken(token))
    assert.notEqual(hashToken(token), token)
    assert.equal(hashToken(token).length, 64)
  })
})

describe("email", () => {
  it("rejects blanks and accepts a normal address", () => {
    assert.equal(isValidEmail("a@b.co"), true)
    assert.equal(isValidEmail("not-an-email"), false)
    assert.equal(isValidEmail(""), false)
  })
})

describe("csv", () => {
  it("quotes commas and quotes", () => {
    const csv = toCsv([
      {
        course: "chatgpt-ads",
        email: "a@b.co",
        name: 'Ada "Admin", Jr',
        locale: "en",
        source: "/courses/chatgpt-ads/",
        confirmed: true,
        listPriceEur: 99,
        earlyBirdPriceEur: 69,
        signedUpAt: "2026-09-22T00:00:00.000Z",
        confirmedAt: "2026-09-22T00:01:00.000Z",
      },
    ])
    assert.match(csv, /^course,email,name,/)
    assert.match(csv, /"Ada ""Admin"", Jr"/)
    assert.match(csv, /,true,99,69,/)
  })
})

describe("bearer", () => {
  it("matches the full secret only", () => {
    assert.equal(bearerMatches("Bearer secret-key", "secret-key"), true)
    assert.equal(bearerMatches("Bearer secret-key", "secret-kez"), false)
    assert.equal(bearerMatches("Bearer short", "secret-key"), false)
    assert.equal(bearerMatches(null, "secret-key"), false)
    assert.equal(bearerMatches("Bearer secret-key", ""), false)
  })
})

describe("thank-you redirect", () => {
  it("uses the locale path and confirmed flag", () => {
    assert.equal(
      thankYouLocation(
        "https://martinmueller.dev",
        "de",
        "openclaw-personal-ai-os"
      ),
      "https://martinmueller.dev/courses-de/waitlist-thank-you/?confirmed=1&course=openclaw-personal-ai-os"
    )
  })
})

describe("mail", () => {
  it("includes the early-bird price from the course", () => {
    const confirm = confirmMessage({
      title: "ChatGPT Ads",
      confirmUrl: "https://martinmueller.dev/api/waitlist/confirm?token=abc",
      earlyBirdPriceEur: 69,
      listPriceEur: 99,
      locale: "en",
    })
    assert.match(confirm.subject, /ChatGPT Ads/)
    assert.match(confirm.message, /€69/)
    assert.match(confirm.message, /€99/)
    assert.match(confirm.message, /token=abc/)

    const welcome = welcomeMessage({
      title: "ChatGPT Ads",
      earlyBirdPriceEur: 69,
      listPriceEur: 99,
      locale: "de",
    })
    assert.match(welcome.message, /€69/)
    assert.match(welcome.message, /14 Tage/)
  })
})

describe("owner mail", () => {
  it("tells pending and confirmed apart", () => {
    const pending = ownerSignupMessage({
      title: "ChatGPT Ads",
      email: "ada@example.com",
      name: "Ada",
      locale: "en",
      source: "/courses/chatgpt-ads/",
      at: "2026-09-22T10:00:00.000Z",
      confirmed: false,
    })
    assert.match(pending.subject, /pending confirm/)
    assert.match(pending.message, /ada@example.com \(Ada\)/)
    assert.match(pending.message, /not confirmed yet/)

    const confirmed = ownerSignupMessage({
      title: "ChatGPT Ads",
      email: "ada@example.com",
      name: "",
      locale: "de",
      source: "",
      at: "2026-09-22T11:00:00.000Z",
      confirmed: true,
    })
    assert.match(confirmed.subject, /confirmed/)
    assert.match(confirmed.message, /ada@example.com confirmed/)
    assert.doesNotMatch(confirmed.message, /token/)
  })
})

describe("berlin day", () => {
  it("uses the previous Europe/Berlin calendar day", () => {
    const winter = previousBerlinDay(new Date("2026-01-15T06:00:00.000Z"))
    assert.equal(winter.label, "2026-01-14")
    assert.equal(new Date(winter.startMs).toISOString(), "2026-01-13T23:00:00.000Z")
    assert.equal(new Date(winter.endMs).toISOString(), "2026-01-14T23:00:00.000Z")

    const summer = previousBerlinDay(new Date("2026-07-15T06:00:00.000Z"))
    assert.equal(summer.label, "2026-07-14")
    assert.equal(new Date(summer.startMs).toISOString(), "2026-07-13T22:00:00.000Z")
    assert.equal(new Date(summer.endMs).toISOString(), "2026-07-14T22:00:00.000Z")
  })
})

describe("daily summary", () => {
  const row = (patch: Partial<CsvRow>): CsvRow => ({
    course: "chatgpt-ads",
    email: "ada@example.com",
    name: "Ada",
    locale: "en",
    source: "/courses/chatgpt-ads/",
    confirmed: false,
    listPriceEur: 99,
    earlyBirdPriceEur: 69,
    signedUpAt: "2026-07-14T08:00:00.000Z",
    confirmedAt: "",
    ...patch,
  })

  it("counts yesterday in Berlin and lists that activity", () => {
    const mail = dailySummaryMessage(
      [
        row({}),
        row({
          email: "bob@example.com",
          name: "Bob",
          confirmed: true,
          signedUpAt: "2026-07-01T08:00:00.000Z",
          confirmedAt: "2026-07-14T12:00:00.000Z",
        }),
        row({
          course: "opennext-cdk-mvp",
          email: "old@example.com",
          name: "",
          signedUpAt: "2026-06-01T08:00:00.000Z",
        }),
      ],
      new Date("2026-07-15T06:00:00.000Z")
    )
    assert.equal(mail.subject, "Course signups 2026-07-14")
    assert.match(mail.message, /Yesterday: 1 signed up, 1 confirmed/)
    assert.match(mail.message, /All time: 3 signed up, 1 confirmed/)
    assert.match(mail.message, /ada@example.com \(Ada\) — signed up, pending/)
    assert.match(mail.message, /bob@example.com \(Bob\) — confirmed/)
    assert.doesNotMatch(mail.message, /old@example.com —/)
  })
})

describe("emf", () => {
  it("emits a CloudWatch embedded metric for the course", () => {
    const parsed = JSON.parse(emfLine("Signup", "chatgpt-ads")) as {
      Course: string
      Signup: number
      _aws: { CloudWatchMetrics: Array<{ Namespace: string }> }
    }
    assert.equal(parsed.Course, "chatgpt-ads")
    assert.equal(parsed.Signup, 1)
    assert.equal(parsed._aws.CloudWatchMetrics[0].Namespace, "Mmblog/Waitlist")
  })
})
