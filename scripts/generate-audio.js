#!/usr/bin/env node
/**
 * Generates audio.mp3 + audio-timing.json for posts with frontmatter `audio: "audio.mp3"`.
 * Uses SSML <mark> tags + enableTimePointing to produce per-paragraph timestamps.
 * Auth: GOOGLE_TTS_CREDENTIALS (base64 SA JSON) or GOOGLE_APPLICATION_CREDENTIALS (path).
 */

const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")
const removeMarkdown = require("remove-markdown")
const tts = require("@google-cloud/text-to-speech")

const ROOT = path.join(__dirname, "..")
const CONTENT = path.join(ROOT, "content")
const MAX_SSML = 4500

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
  const opts = b64
    ? { credentials: JSON.parse(Buffer.from(b64.trim(), "base64").toString("utf8")) }
    : {}
  return new tts.v1beta1.TextToSpeechClient(opts)
}

function pickVoice(tags) {
  return (tags || []).includes("de") ? VOICES.de : VOICES.en
}

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function splitParagraphs(markdownBody) {
  const plain = removeMarkdown(markdownBody, { stripListLeaders: false })
  return plain
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean)
}

/**
 * Build SSML chunks from paragraphs, each under MAX_SSML bytes.
 * Returns [{ ssml, markIndices }] where markIndices maps mark names to
 * global paragraph indices.
 */
function buildSsmlChunks(paragraphs) {
  const chunks = []
  let ssmlParts = []
  let ssmlLen = 0
  let markMap = {}
  const OVERHEAD = 30

  for (let i = 0; i < paragraphs.length; i++) {
    const escaped = escapeXml(paragraphs[i])
    const markTag = `<mark name="p${i}"/>`
    const segment = `${markTag}${escaped} `
    const segLen = segment.length + OVERHEAD

    if (ssmlLen + segLen > MAX_SSML && ssmlParts.length > 0) {
      chunks.push({ ssml: `<speak>${ssmlParts.join("")}</speak>`, markMap })
      ssmlParts = []
      ssmlLen = 0
      markMap = {}
    }

    ssmlParts.push(segment)
    ssmlLen += segment.length
    markMap[`p${i}`] = i
  }

  if (ssmlParts.length) {
    chunks.push({ ssml: `<speak>${ssmlParts.join("")}</speak>`, markMap })
  }

  return chunks
}

async function synthesizeWithTiming(client, ssmlChunks, voice) {
  const audioBuffers = []
  const timing = []
  let cumulativeSeconds = 0

  for (const chunk of ssmlChunks) {
    const [response] = await client.synthesizeSpeech({
      input: { ssml: chunk.ssml },
      voice: { languageCode: voice.languageCode, name: voice.name },
      audioConfig: { audioEncoding: "MP3" },
      enableTimePointing: ["SSML_MARK"],
    })

    if (!response.audioContent) throw new Error("Empty audioContent from TTS")

    const buf = Buffer.isBuffer(response.audioContent)
      ? response.audioContent
      : Buffer.from(response.audioContent, "base64")
    audioBuffers.push(buf)

    const timepoints = response.timepoints || []
    for (const tp of timepoints) {
      const pIdx = chunk.markMap[tp.markName]
      if (pIdx !== undefined) {
        timing.push({
          p: pIdx,
          t: Math.round((cumulativeSeconds + Number(tp.timeSeconds)) * 100) / 100,
        })
      }
    }

    const mp3DurationEstimate = estimateMp3Duration(buf)
    cumulativeSeconds += mp3DurationEstimate
  }

  return { mp3: Buffer.concat(audioBuffers), timing }
}

/**
 * Rough MP3 duration estimate from file size.
 * Google TTS outputs ~32kbps MP3. Used only for cumulative chunk offsets.
 * Timepoints within a chunk are precise from the API.
 */
function estimateMp3Duration(buf) {
  return (buf.length * 8) / 32000
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

  const mp3Path = path.join(postDir, "audio.mp3")
  const timingPath = path.join(postDir, "audio-timing.json")
  if (!force && fs.existsSync(mp3Path) && fs.existsSync(timingPath)) {
    console.log(`[generate-audio] skip exists: ${path.relative(ROOT, mp3Path)}`)
    return { skipped: true, reason: "exists" }
  }

  const paragraphs = splitParagraphs(body)
  if (!paragraphs.length) {
    console.warn(`[generate-audio] empty text after strip: ${postDir}`)
    return { skipped: true, reason: "empty" }
  }

  const voice = pickVoice(fm.tags)
  const ssmlChunks = buildSsmlChunks(paragraphs)
  console.log(
    `[generate-audio] ${path.basename(postDir)} — ${paragraphs.length} paragraphs, ${ssmlChunks.length} chunk(s), ${voice.name}`
  )

  const { mp3, timing } = await synthesizeWithTiming(client, ssmlChunks, voice)

  fs.writeFileSync(mp3Path, mp3)
  fs.writeFileSync(timingPath, JSON.stringify(timing))
  console.log(`[generate-audio] wrote ${path.relative(ROOT, mp3Path)} + audio-timing.json`)
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
  const dirs = targets.length
    ? targets.map((t) => path.resolve(ROOT, t))
    : listPostDirs()

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
