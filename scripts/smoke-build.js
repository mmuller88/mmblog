#!/usr/bin/env node
/**
 * Post-build smoke: key static files exist and contain expected markers.
 * Run after `npm run build` (public/).
 */
const fs = require("fs")
const path = require("path")

const publicDir = path.join(__dirname, "..", "public")

const pages = [
 { file: "index.html", needle: "Martin Mueller" },
 { file: "404.html", needle: "NOT FOUND" },
 { file: "rss.xml", needle: "<rss" },
 { file: "rss-ger.xml", needle: "<rss" },
 { file: "one-man-agency/index.html", needle: "One-Man Agency" },
 { file: "trainings/index.html", needle: "Trainings" },
 { file: "sitemap.xml/sitemap-index.xml", needle: "sitemapindex" },
]

function candidates(rel) {
 const files = [path.join(publicDir, rel)]
 if (rel.endsWith("/index.html")) {
  files.push(
   path.join(publicDir, `${rel.slice(0, -"/index.html".length)}.html`)
  )
 } else if (rel.endsWith(".html")) {
  files.push(path.join(publicDir, rel.slice(0, -".html".length), "index.html"))
 }
 return files
}

function fail(message) {
 console.error(`[smoke] ${message}`)
 process.exitCode = 1
}

if (!fs.existsSync(publicDir)) {
 console.error("[smoke] public/ missing — run npm run build first")
 process.exit(1)
}

for (const page of pages) {
 const file = candidates(page.file).find((item) => fs.existsSync(item))
 if (!file) {
  fail(`missing ${page.file}`)
  continue
 }
 const body = fs.readFileSync(file, "utf8")
 if (body.length < 80) {
  fail(`${path.relative(publicDir, file)} too small (${body.length} bytes)`)
  continue
 }
 if (!body.includes(page.needle)) {
  fail(`${path.relative(publicDir, file)} missing "${page.needle}"`)
  continue
 }
 console.log(`[smoke] ok ${path.relative(publicDir, file)}`)
}

const SITE = "https://martinmueller.dev"

const headRoutes = [
 {
  file: "index.html",
  title: "Martin Mueller — AWS CDK, Serverless & GEO",
  canonical: `${SITE}/`,
 },
 {
  file: "one-man-agency/index.html",
  title: "One-Man Agency — AWS & AI, Without Agency Overhead",
  canonical: `${SITE}/one-man-agency/`,
  en: `${SITE}/one-man-agency/`,
  de: `${SITE}/one-man-agency-de/`,
 },
 {
  file: "one-man-agency-de/index.html",
  title: "One-Man Agency — AWS & KI, ohne Agentur-Overhead",
  canonical: `${SITE}/one-man-agency-de/`,
  en: `${SITE}/one-man-agency/`,
  de: `${SITE}/one-man-agency-de/`,
 },
 {
  file: "one-man-agency/aws/index.html",
  title: "AWS Consulting — Architecture, CDK & Migration",
  canonical: `${SITE}/one-man-agency/aws/`,
  en: `${SITE}/one-man-agency/aws/`,
  de: `${SITE}/one-man-agency-de/aws/`,
 },
 {
  file: "one-man-agency-de/aws/index.html",
  title: "AWS Consulting — Architektur, CDK & Migration",
  canonical: `${SITE}/one-man-agency-de/aws/`,
  en: `${SITE}/one-man-agency/aws/`,
  de: `${SITE}/one-man-agency-de/aws/`,
 },
 {
  file: "one-man-agency/seo-geo/index.html",
  title: "Technical SEO for JavaScript and SaaS",
  canonical: `${SITE}/one-man-agency/seo-geo/`,
  en: `${SITE}/one-man-agency/seo-geo/`,
  de: `${SITE}/one-man-agency-de/seo-geo/`,
 },
 {
  file: "one-man-agency-de/seo-geo/index.html",
  title: "Technisches SEO für JavaScript- und SaaS-Seiten",
  canonical: `${SITE}/one-man-agency-de/seo-geo/`,
  en: `${SITE}/one-man-agency/seo-geo/`,
  de: `${SITE}/one-man-agency-de/seo-geo/`,
 },
 {
  file: "one-man-agency/gpt/index.html",
  title: "ChatGPT Ads — Campaigns, Tracking & Conversions",
  canonical: `${SITE}/one-man-agency/gpt/`,
  en: `${SITE}/one-man-agency/gpt/`,
  de: `${SITE}/one-man-agency-de/gpt/`,
 },
 {
  file: "one-man-agency-de/gpt/index.html",
  title: "ChatGPT Ads — Kampagnen, Tracking & Conversions",
  canonical: `${SITE}/one-man-agency-de/gpt/`,
  en: `${SITE}/one-man-agency/gpt/`,
  de: `${SITE}/one-man-agency-de/gpt/`,
 },
 {
  file: "one-man-agency/vibe-coding/index.html",
  title: "Vibe Coding & DevOps — Production Readiness & Security",
  canonical: `${SITE}/one-man-agency/vibe-coding/`,
  en: `${SITE}/one-man-agency/vibe-coding/`,
  de: `${SITE}/one-man-agency-de/vibe-coding/`,
 },
 {
  file: "one-man-agency-de/vibe-coding/index.html",
  title: "Vibe Coding & DevOps — Production Readiness & Security",
  canonical: `${SITE}/one-man-agency-de/vibe-coding/`,
  en: `${SITE}/one-man-agency/vibe-coding/`,
  de: `${SITE}/one-man-agency-de/vibe-coding/`,
 },
]

function headHtml(html) {
 const match = html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i)
 return match ? match[0] : ""
}

function decode(text) {
 return text
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"')
  .replace(/&#x27;/g, "'")
}

function tagText(html, tag) {
 const match = html.match(new RegExp(`<${tag}\\b[^>]*>([^<]*)</${tag}>`, "i"))
 return match ? decode(match[1].trim()) : ""
}

function linkHref(html, rel, extra) {
 const links = html.match(/<link\b[^>]*>/gi) || []
 for (const link of links) {
  if (!new RegExp(`rel=["']${rel}["']`, "i").test(link)) continue
  if (extra && !extra.test(link)) continue
  const href = link.match(/href=["']([^"']+)["']/i)
  if (href) return href[1]
 }
 return ""
}

for (const route of headRoutes) {
 const file = candidates(route.file).find((item) => fs.existsSync(item))
 const label = route.file
 if (!file) {
  fail(`missing head ${label}`)
  continue
 }
 const head = headHtml(fs.readFileSync(file, "utf8"))
 if (!head) {
  fail(`${label} has no <head>`)
  continue
 }
 const title = tagText(head, "title")
 const canonical = linkHref(head, "canonical")
 if (title !== route.title) {
  fail(`${label} title "${title}" != "${route.title}"`)
 }
 if (canonical !== route.canonical) {
  fail(`${label} canonical "${canonical}" != "${route.canonical}"`)
 }
 const ogUrl = (head.match(
  /property=["']og:url["'][^>]*content=["']([^"']+)["']/i
 ) ||
  head.match(/content=["']([^"']+)["'][^>]*property=["']og:url["']/i) ||
  [])[1]
 if (ogUrl !== route.canonical) {
  fail(`${label} og:url "${ogUrl || ""}" != "${route.canonical}"`)
 }
 if (route.en) {
  const en = linkHref(head, "alternate", /hreflang=["']en["']/i)
  const de = linkHref(head, "alternate", /hreflang=["']de["']/i)
  if (en !== route.en) fail(`${label} hreflang en "${en}" != "${route.en}"`)
  if (de !== route.de) fail(`${label} hreflang de "${de}" != "${route.de}"`)
 }
 if (!process.exitCode) console.log(`[smoke] head ok ${label}`)
}

if (process.exitCode) process.exit(process.exitCode)
console.log("[smoke] ok")
