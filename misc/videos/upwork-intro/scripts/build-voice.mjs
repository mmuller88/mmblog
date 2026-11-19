// One WAV per spoken line. Cached by hash of voice + text. Writes src/voice.json durations.
// Auth: GOOGLE_TTS_CREDENTIALS (base64 SA JSON), else GOOGLE_APPLICATION_CREDENTIALS,
// else the gcloud user token billed to the configured project, else ADC.
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import { OAuth2Client } from 'google-auth-library'
import { LINES, SAMPLE_VOICES, VOICE } from '../src/lines.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUB = join(ROOT, 'public', 'voice')
const OUT = join(ROOT, 'src', 'voice.json')
const FPS = 30
const LEAD_FRAMES = 2
const TAIL_FRAMES = 4

function gcloud(args) {
  return execFileSync('gcloud', args, { encoding: 'utf8' }).trim()
}

function gcloudAccounts() {
  const active = gcloud(['config', 'get-value', 'account'])
  const listed = gcloud(['auth', 'list', '--format=value(account)']).split('\n').map((s) => s.trim()).filter(Boolean)
  return [...new Set([active, ...listed].filter((account) => account && !account.startsWith('(')))]
}

async function client() {
  const b64 = process.env.GOOGLE_TTS_CREDENTIALS
  if (b64) {
    return new TextToSpeechClient({
      credentials: JSON.parse(Buffer.from(b64.trim(), 'base64').toString('utf8')),
    })
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return new TextToSpeechClient()

  const project = gcloud(['config', 'get-value', 'project'])
  let lastErr
  for (const account of gcloudAccounts()) {
    let token = ''
    try {
      token = gcloud(['auth', 'print-access-token', `--account=${account}`])
    } catch {
      continue
    }
    if (!token.startsWith('ya29.')) continue
    const auth = new OAuth2Client()
    auth.setCredentials({ access_token: token })
    if (project && !project.startsWith('(')) auth.quotaProjectId = project
    // gRPC ignores authClient; the REST fallback uses it.
    const tts = new TextToSpeechClient({ fallback: true, authClient: auth })
    try {
      await synth(tts, 'en-US-Neural2-D', 'ok')
      return tts
    } catch (err) {
      lastErr = err
    }
  }
  if (lastErr) throw lastErr
  return new TextToSpeechClient()
}

function wavSeconds(buf) {
  let offset = 12
  while (offset + 8 <= buf.length) {
    const id = buf.toString('ascii', offset, offset + 4)
    const size = buf.readUInt32LE(offset + 4)
    if (id === 'data') {
      const rate = buf.readUInt32LE(24)
      const channels = buf.readUInt16LE(22)
      const bits = buf.readUInt16LE(34)
      return size / (rate * channels * (bits / 8))
    }
    offset += 8 + size + (size % 2)
  }
  throw new Error('WAV data chunk missing')
}

async function synth(tts, voice, text) {
  const [response] = await tts.synthesizeSpeech({
    input: { text },
    voice: { languageCode: 'en-US', name: voice },
    audioConfig: { audioEncoding: 'LINEAR16', sampleRateHertz: 24000 },
  })
  if (!response.audioContent) throw new Error(`Empty audioContent for ${voice}`)
  return Buffer.isBuffer(response.audioContent) ? response.audioContent : Buffer.from(response.audioContent)
}

const tts = await client()
const sample = process.argv.includes('--sample')

if (sample) {
  const dir = join(PUB, 'samples')
  mkdirSync(dir, { recursive: true })
  for (const voice of SAMPLE_VOICES) {
    try {
      const buf = await synth(tts, voice, LINES[0].say)
      const file = join(dir, `${voice}.wav`)
      writeFileSync(file, buf)
      console.log(`[voice:sample] ${voice} ${wavSeconds(buf).toFixed(2)}s ${file}`)
    } catch (err) {
      console.error(`[voice:sample] ${voice} failed: ${err.message || err}`)
    }
  }
  process.exit(0)
}

mkdirSync(PUB, { recursive: true })
const lines = []
let speech = 0
for (const line of LINES) {
  const hash = createHash('sha256').update(`${VOICE}\n${line.say}`).digest('hex').slice(0, 12)
  const file = `${line.id}-${hash}.wav`
  const path = join(PUB, file)
  const cached = existsSync(path)
  const buf = cached ? readFileSync(path) : await synth(tts, VOICE, line.say)
  if (!cached) writeFileSync(path, buf)
  const seconds = Math.round(wavSeconds(buf) * 100) / 100
  speech += seconds
  lines.push({ id: line.id, file, seconds })
  console.log(`[voice] ${cached ? 'cache' : 'wrote'} ${file} ${seconds.toFixed(2)}s`)
}

writeFileSync(OUT, `${JSON.stringify({ voice: VOICE, lines }, null, 2)}\n`)
const video = speech + (LINES.length * (LEAD_FRAMES + TAIL_FRAMES)) / FPS
console.log(`[voice] speech ${speech.toFixed(2)}s, video ~${video.toFixed(2)}s`)
if (video > 60) console.warn(`[voice] over 60s (${video.toFixed(2)}s)`)
