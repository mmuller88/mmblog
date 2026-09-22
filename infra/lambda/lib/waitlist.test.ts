import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  COURSES,
  bearerMatches,
  confirmMessage,
  courseFor,
  emfLine,
  hashToken,
  isValidEmail,
  newConfirmToken,
  thankYouLocation,
  toCsv,
  welcomeMessage,
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
    assert.equal(Object.keys(COURSES).length, 4)
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
