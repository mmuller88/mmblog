const PRESENTATIONS_BASE = "https://mmuller88.github.io/presentations"
const UTM = "utm_source=martinmueller&utm_medium=talks"

function buildDeckUrl(slug) {
 return `${PRESENTATIONS_BASE}/${slug}/?${UTM}`
}

function resolveDeckUrl(talk) {
 if (talk?.deckExternalUrl) {
  const base = talk.deckExternalUrl.split("?")[0].replace(/\/?$/, "/")
  return `${base}?${UTM}`
 }
 if (talk?.deckSlug) return buildDeckUrl(talk.deckSlug)
 return null
}

module.exports = { buildDeckUrl, resolveDeckUrl }
