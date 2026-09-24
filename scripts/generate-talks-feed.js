#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const catalog = require("../src/data/talksCatalog.json")

const PRESENTATIONS_BASE = "https://mmuller88.github.io/presentations"
const UTM = "utm_source=martinmueller&utm_medium=talks"
const SITE = "https://martinmueller.dev"

function buildDeckUrl(slug) {
 return `${PRESENTATIONS_BASE}/${slug}/?${UTM}`
}

function feedEntry(slug) {
 const talk = catalog.talks[slug]
 if (!talk?.showInCatalog || talk.status !== "delivered" || !talk.deckSlug) {
  return null
 }
 const copy = talk.en
 return {
  slug,
  title: copy.title,
  event: copy.event.name,
  date: talk.date,
  url: `${SITE}/talks/${slug}/`,
  deckUrl: buildDeckUrl(talk.deckSlug),
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
