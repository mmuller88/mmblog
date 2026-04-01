#!/usr/bin/env node
/**
 * Generates audio.mp3 for blog posts that set frontmatter `audio: "audio.mp3"`.
 * Auth: GOOGLE_TTS_CREDENTIALS (base64 service account JSON) or GOOGLE_APPLICATION_CREDENTIALS (path).
 * @google-cloud/text-to-speech — Neural2 male voices: en-US-Neural2-D, de-DE-Neural2-B
 */

const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")
const removeMarkdown = require("remove-markdown")
const { TextToSpeechClient } = require("@google-cloud/text-to-speech")

const ROOT = path.join(__dirname, "..")
const CONTENT = path.join(ROOT, "content")
/** Google Cloud TTS limit per request (chars) */
const MAX_CHUNK = 4500

const VOICES = {
  en: { name: "en-US-Neural2-D", languageCode: "en-US" },
  de: { name: "de-DE-Neural2-B", languageCode: "de-DE" },
}

function hasCredentials() {
  return !!(
    process.env.GOOGLE_TTS_CREDENTIALS ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  )
}

function getClient() {
  const b64 = process.env.GOOGLE_TTS_CREDENTIALS
  if (b64) {
    const json = Buffer.from(b64.trim(), "base64").toString("utf8")
    const credentials = JSON.parse(json)
    return new TextToSpeechClient({ credentials })
  }
  return new TextToSpeechClient()
}

function pickVoice(tags) {
  const list = tags || []
  return list.includes("de") ? VOICES.de : VOICES.en
}

function stripToPlain(markdownBody) {
  let t = removeMarkdown(markdownBody, { stripListLeaders: false })
  t = t.replace(/\n{3,}/g, "\n\n").trim()
  return t
}

function chunkText(text) {
  if (text.length <= MAX_CHUNK) return [text]
  const chunks = []
  let rest = text
  while (rest.length) {
    if (rest.length <= MAX_CHUNK) {
      chunks.push(rest)
      break
    }
    let cut = rest.lastIndexOf("\n\n", MAX_CHUNK)
    if (cut < MAX_CHUNK / 2) cut = rest.lastIndexOf(". ", MAX_CHUNK)
    if (cut < MAX_CHUNK / 2) cut = rest.lastIndexOf(" ", MAX_CHUNK)
    if (cut < 1) cut = MAX_CHUNK
    chunks.push(rest.slice(0, cut).trim())
    rest = rest.slice(cut).trim()
  }
  return chunks.filter(Boolean)
}

async function synthesizeChunks(client, chunks, voice) {
  const bufs = []
  for (const text of chunks) {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: voice.languageCode, name: voice.name },
      audioConfig: { audioEncoding: "MP3" },
    })
    if (!response.audioContent) throw new Error("Empty audioContent from TTS")
    bufs.push(
      Buffer.isBuffer(response.audioContent)
        ? response.audioContent
        : Buffer.from(response.audioContent, "base64")
    )
  }
  return Buffer.concat(bufs)
}

function listPostDirs() {
  if (!fs.existsSync(CONTENT)) return []
  return fs
    .readdirSync(CONTENT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(CONTENT, d.name))
}

async function processPost(client, postDir, force) {
  const indexMd = path.join(postDir, "index.md")
  if (!fs.existsSync(indexMd)) return { skipped: true, reason: "no index.md" }

  const raw = fs.readFileSync(indexMd, "utf8")
  const { data: fm, content: body } = matter(raw)
  if (!fm.audio || fm.audio !== "audio.mp3") {
    return { skipped: true, reason: "no audio frontmatter" }
  }

  const outPath = path.join(postDir, "audio.mp3")
  if (!force && fs.existsSync(outPath)) {
    console.log(`[generate-audio] skip exists: ${path.relative(ROOT, outPath)}`)
    return { skipped: true, reason: "exists" }
  }

  const plain = stripToPlain(body)
  if (!plain.length) {
    console.warn(`[generate-audio] empty text after strip: ${postDir}`)
    return { skipped: true, reason: "empty" }
  }

  const voice = pickVoice(fm.tags)
  const chunks = chunkText(plain)
  console.log(
    `[generate-audio] ${path.basename(postDir)} — ${chunks.length} chunk(s), ${voice.name}`
  )

  const mp3 = await synthesizeChunks(client, chunks, voice)
  fs.writeFileSync(outPath, mp3)
  console.log(`[generate-audio] wrote ${path.relative(ROOT, outPath)}`)
  return { ok: true }
}

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes("--force")
  const targets = args.filter((a) => !a.startsWith("--"))

  if (!hasCredentials()) {
    console.warn(
      "[generate-audio] Skip: set GOOGLE_TTS_CREDENTIALS (base64 SA JSON) or GOOGLE_APPLICATION_CREDENTIALS"
    )
    process.exit(0)
  }

  const client = getClient()
  let dirs

  if (targets.length) {
    dirs = targets.map((t) => path.resolve(ROOT, t))
  } else {
    dirs = listPostDirs()
  }

  let processed = 0
  for (const dir of dirs) {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      console.warn(`[generate-audio] not a directory: ${dir}`)
      continue
    }
    const r = await processPost(client, dir, force)
    if (r.ok) processed += 1
  }

  console.log(`[generate-audio] done, generated: ${processed}`)
}

main().catch((err) => {
  console.error("[generate-audio]", err)
  process.exit(1)
})
