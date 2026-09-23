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
    files.push(path.join(publicDir, `${rel.slice(0, -"/index.html".length)}.html`))
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

if (process.exitCode) process.exit(process.exitCode)
console.log("[smoke] ok")
