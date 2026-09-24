#!/usr/bin/env node
const catalog = require("../src/data/talksCatalog.json")

const DECK_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
let failed = false

function fail(message) {
 console.error(`validate-talks: ${message}`)
 failed = true
}

catalog.talkSlugs.forEach((slug) => {
 const talk = catalog.talks[slug]
 if (!talk) {
  fail(`missing talks[${slug}]`)
  return
 }
 if (!talk.en?.title || !talk.de?.title) {
  fail(`${slug}: missing EN/DE title`)
 }
 if (talk.status === "upcoming" && talk.deckSlug) {
  fail(`${slug}: upcoming talks must not expose deckSlug`)
 }
 if (talk.status === "delivered" && talk.showInCatalog && !talk.deckSlug) {
  fail(`${slug}: delivered catalog talk needs deckSlug`)
 }
 if (talk.deckSlug && !DECK_SLUG.test(talk.deckSlug)) {
  fail(`${slug}: deckSlug must be a single URL-safe slug`)
 }
})

if (failed) {
 process.exit(1)
}

console.log(`validate-talks: OK (${catalog.talkSlugs.length} talks)`)
