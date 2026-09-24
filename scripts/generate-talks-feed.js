#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const catalog = require("../src/data/talksCatalog.json")

const PRESENTATIONS_BASE = "https://mmuller88.github.io/presentations"
const UTM = "utm_source=martinmueller&utm_medium=talks"
const SITE = "https://martinmueller.dev"

function resolveDeckUrl(talk) {
 if (talk.deckExternalUrl) {
  const base = talk.deckExternalUrl.split("?")[0].replace(/\/?$/, "/")
  return `${base}?${UTM}`
 }
 if (talk.deckSlug) {
  return `${PRESENTATIONS_BASE}/${talk.deckSlug}/?${UTM}`
 }
 return null
}

function feedEntry(slug) {
 const talk = catalog.talks[slug]
 const deckUrl = talk ? resolveDeckUrl(talk) : null
 if (!talk?.showInCatalog || talk.status !== "delivered" || !deckUrl) {
  return null
 }
 const copy = talk.en
 return {
  slug,
  title: copy.title,
  event: copy.event.name,
  date: talk.date,
  url: `${SITE}/talks/${slug}/`,
  deckUrl,
  tags: talk.tags,
 }
}

const payload = {
 updated: new Date().toISOString().slice(0, 10),
 talks: catalog.talkSlugs.map(feedEntry).filter(Boolean),
}

const outDir = path.join(__dirname, "..", "static", "talks")
const outFile = path.join(outDir, "feed.json")

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`)
console.log(`Wrote ${outFile}`)
