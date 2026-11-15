// Synthesises the soundtrack: 120 BPM darksynth in F# minor, locked to the beat lengths in src/script.ts.
// Every cut lands on a beat; UI cues (blips, alarm, chimes) hit the same beats as the visuals.
// Writes public/music.wav (48 kHz, 16-bit stereo), mastered to TARGET_LUFS. Deterministic.
import { mkdirSync, writeFileSync } from 'node:fs'
import {
  BEAM_FROM,
  BEAM_TO,
  BEATS,
  BPM,
  CARD_BEATS,
  CHECK_BEATS,
  CHECKS,
  COLUMN_BEATS,
  CTA_BEAT,
  DRIFT_BEATS,
  FLOW_HOPS,
  GREEN_BEAT,
  IMPLEMENT_BEAT,
  LOG_BEATS,
  MAPPED_BEAT,
  READY_BEAT,
  RISK_BEAT,
  STACK_ICON_BEATS,
  STACK_TAIL_BEAT,
  STACK_WORD_BEATS,
  STAGE_BEATS,
  TICKER_FROM,
  TICKER_TO,
  TYPE_FROM,
  TYPE_TO,
  WIPES,
} from '../src/script.ts'

const SR = 48000
const SPB = 60 / BPM
const TARGET_LUFS = -15
const OUT_DIR = new URL('../public/', import.meta.url)

// ---------------------------------------------------------------- score

/** [chord, beats] per section, F# minor. Each section must last exactly BEATS[id] seconds. */
const ARRANGEMENT = {
  hook: [['F#m', 8]],
  map: [['F#m', 4], ['D', 4], ['E', 4]],
  gaps: [['F#m', 4], ['D', 4], ['C#', 4]],
  roadmap: [['D', 4], ['E', 4], ['F#m', 4]],
  stack: [['F#m', 1], ['D', 1], ['E', 1], ['C#', 1], ['G', 2], ['C#', 2]],
  end: [['F#madd9', 8]],
}

/** Pad voicing and bass root as MIDI notes. */
const CHORDS = {
  'F#m': { pad: [54, 57, 61, 66], bass: 42 },
  D: { pad: [54, 57, 62, 66], bass: 38 },
  E: { pad: [56, 59, 64, 68], bass: 40 },
  'C#': { pad: [56, 61, 65, 68], bass: 37 },
  G: { pad: [55, 59, 62, 67], bass: 43 },
  'F#madd9': { pad: [54, 57, 61, 68], bass: 42 },
}

const PAD_LEVEL = { hook: 0.55, map: 0.8, gaps: 0.8, roadmap: 0.9, stack: 1, end: 1 }

const TICKER_NOTES = [90, 93, 97, 95]
const TYPE_NOTES = [81, 85, 83, 88]
/** Falls with each bad result in the as-is deploy log. */
const LOG_NOTES = [85, 81, 78]
const HOP_NOTES = [78, 81, 85, 90]
/** Each drift blip bends down two semitones. */
const DRIFT_NOTES = [78, 76, 73]
const GAP_NOTES = [81, 76]
const OK_NOTE = 90
const READY_CHIME = [85, 89, 92, 97]
const COLUMN_NOTES = [85, 88, 90]
/** [beat in roadmap section, note, beats] from the first card on. */
const ROADMAP_LEAD = [[4, 83, 1], [5, 81, 1], [6, 80, 1], [7, 83, 1], [8, 85, 2], [10, 81, 1], [11, 78, 1]]
/** E then F#m chord tones, rising as the pipeline stages turn green. */
const STAGE_NOTES = [88, 92, 93, 97]
const ICON_NOTES = [85, 88, 90, 92, 93, 97, 95, 100]
const CTA_CHIME = [78, 81, 85, 92]

const ARP = [0, 1, 2, 3, 1, 2, 3, 2]
const ARP_ACCENT = [1, 0.55, 0.8, 0.6]

/** Bus levels in the final mix. */
const MIX = { drums: 1, bass: 1, pad: 2.2, arp: 2.2, lead: 2.5, brass: 2.4, fx: 1, verb: 1.2, echo: 1, gate: 1.2 }

// ---------------------------------------------------------------- timeline

const sections = []
let cursor = 0
for (const id of Object.keys(BEATS)) {
  if (!ARRANGEMENT[id]) throw new Error(`No ARRANGEMENT for beat "${id}" in build-music.mjs`)
  const start = cursor
  const chords = ARRANGEMENT[id].map(([name, len]) => {
    const chord = { name, start: cursor, len }
    cursor += len
    return chord
  })
  const seconds = (cursor - start) * SPB
  if (Math.abs(seconds - BEATS[id]) > 1e-9) {
    throw new Error(`"${id}" lasts ${BEATS[id]}s in script.ts but ${seconds}s in ARRANGEMENT; update build-music.mjs`)
  }
  sections.push({ id, start, end: cursor, chords })
}

const SECONDS = cursor * SPB
const LEN = Math.round(SECONDS * SR)
const at = (beat) => beat * SPB
const section = (id) => sections.find((s) => s.id === id)
const cut = (id) => at(section(id).start)
/** Absolute beat of a beat offset inside a section. */
const beatIn = (id, beat) => section(id).start + beat
const chordAt = (beat) => {
  for (const s of sections) for (const c of s.chords) if (beat >= c.start && beat < c.start + c.len) return CHORDS[c.name]
  return CHORDS[sections.at(-1).chords.at(-1).name]
}

// ---------------------------------------------------------------- dsp

let seed = 20261016
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const noise = () => rand() * 2 - 1
const midiHz = (m) => 440 * 2 ** ((m - 69) / 12)
const TAU = Math.PI * 2

/** Anti-aliasing correction for naive saw waves. */
const blep = (t, dt) => {
  if (t < dt) {
    t /= dt
    return t + t - t * t - 1
  }
  if (t > 1 - dt) {
    t = (t - 1) / dt
    return t * t + t + t + 1
  }
  return 0
}

/** Band-limited saw for phase `p` in [0, 1) advancing `dt` per sample. */
const saw = (p, dt) => 2 * p - 1 - blep(p, dt)

/** Zero-delay-feedback state variable filter. */
class SVF {
  ic1 = 0
  ic2 = 0
  f = -1
  q = -1
  run(x, f, q) {
    if (f !== this.f || q !== this.q) {
      const g = Math.tan((Math.PI * Math.min(f, SR * 0.45)) / SR)
      this.k = 1 / q
      this.a1 = 1 / (1 + g * (g + this.k))
      this.a2 = g * this.a1
      this.a3 = g * this.a2
      this.f = f
      this.q = q
    }
    const v3 = x - this.ic2
    const v1 = this.a1 * this.ic1 + this.a2 * v3
    const v2 = this.ic2 + this.a2 * this.ic1 + this.a3 * v3
    this.ic1 = 2 * v1 - this.ic1
    this.ic2 = 2 * v2 - this.ic2
    this.v1 = v1
    this.v2 = v2
  }
  lp(x, f, q = 0.707) {
    this.run(x, f, q)
    return this.v2
  }
  hp(x, f, q = 0.707) {
    this.run(x, f, q)
    return x - this.k * this.v1 - this.v2
  }
  bp(x, f, q = 0.707) {
    this.run(x, f, q)
    return this.k * this.v1
  }
}

const pair = () => [new Float32Array(LEN), new Float32Array(LEN)]
const BUS = {
  drums: pair(),
  bass: pair(),
  pad: pair(),
  arp: pair(),
  lead: pair(),
  brass: pair(),
  fx: pair(),
  verb: pair(),
  echo: pair(),
  gate: pair(),
}

/** One stereo sample, written by the voice callbacks below. */
const LR = new Float64Array(2)

/** Runs `voice(t)` for `dur` seconds from `t0` and mixes LR into the given [bus, gain] sends. */
function play(t0, dur, voice, sends) {
  const i0 = Math.round(t0 * SR)
  const n = Math.round(dur * SR)
  const ls = sends.map(([b]) => b[0])
  const rs = sends.map(([b]) => b[1])
  const gs = sends.map(([, g]) => g)
  for (let k = 0; k < n; k++) {
    const i = i0 + k
    if (i >= LEN) break
    voice(k / SR)
    if (i < 0) continue
    for (let s = 0; s < gs.length; s++) {
      ls[s][i] += LR[0] * gs[s]
      rs[s][i] += LR[1] * gs[s]
    }
  }
}

const panGains = (pan) => [Math.cos(((pan + 1) * Math.PI) / 4), Math.sin(((pan + 1) * Math.PI) / 4)]

/** Square-ish tone from odd sine harmonics (no aliasing on high blips). */
const softSquare = (p) => Math.sin(TAU * p) + 0.33 * Math.sin(3 * TAU * p) + 0.2 * Math.sin(5 * TAU * p)

// ---------------------------------------------------------------- instruments

const kickTimes = []
const snareTimes = []

/** Distorted kick with a noise snap. */
function industrialKick(t0, vel = 1) {
  kickTimes.push(t0)
  const click = new SVF()
  let ph = 0
  play(t0, 0.5, (t) => {
    ph += (42 + 150 * Math.exp(-t / 0.028) + 420 * Math.exp(-t / 0.002)) / SR
    const body = Math.sin(TAU * ph) * Math.exp(-t / 0.15)
    const snap = 0.7 * click.hp(noise(), 3000) * Math.exp(-t / 0.004)
    const env = Math.min(1, t / 0.0006) * Math.min(1, (0.5 - t) / 0.06)
    const x = (Math.tanh(2.6 * (body + snap) * env) / Math.tanh(2.6)) * vel
    LR[0] = x
    LR[1] = x
  }, [[BUS.drums, 0.72]])
}

/** 80s snare; `gated` also feeds the gated-reverb bus. */
function gatedSnare(t0, vel = 1, gated = true) {
  if (gated) snareTimes.push(t0)
  const hp = new SVF()
  const bp = new SVF()
  let ph = 0
  play(t0, 0.32, (t) => {
    ph += (190 + 90 * Math.exp(-t / 0.01)) / SR
    const tone = 0.55 * Math.sin(TAU * ph) * Math.exp(-t / 0.05)
    const rattle = 0.9 * bp.bp(hp.hp(noise(), 1200), 4200, 0.6) * Math.exp(-t / 0.11)
    const x = Math.tanh(1.6 * (tone + rattle)) * Math.min(1, t / 0.0005) * vel
    LR[0] = x
    LR[1] = x
  }, gated ? [[BUS.drums, 0.42], [BUS.gate, 1]] : [[BUS.drums, 0.36], [BUS.verb, 0.12]])
}

const METAL = [205.3, 304.4, 369.6, 522.7, 540, 800]

function hat(t0, vel, open = false) {
  const h1 = new SVF()
  const h2 = new SVF()
  const decay = open ? 0.1 : 0.026
  play(t0, open ? 0.4 : 0.12, (t) => {
    let metal = 0
    for (const f of METAL) metal += Math.sin(TAU * f * 1.7 * t) > 0 ? 1 : -1
    const x = h2.hp(h1.hp(0.55 * noise() + 0.08 * metal, 7600, 0.8), 7600, 0.8)
    const env = Math.min(1, t / 0.0006) * Math.exp(-t / decay) * vel
    LR[0] = x * env * 0.85
    LR[1] = x * env
  }, [[BUS.drums, open ? 0.34 : 0.27]])
}

function crash(t0, vel = 1, decay = 1.1) {
  const fl = new SVF()
  const fr = new SVF()
  play(t0, decay * 3.5, (t) => {
    const env = Math.min(1, t / 0.0015) * Math.exp(-t / decay) * vel
    LR[0] = fl.hp(noise(), 3800, 0.6) * env
    LR[1] = fr.hp(noise(), 4100, 0.6) * env
  }, [[BUS.fx, 0.2], [BUS.verb, 0.1]])
}

/** Cymbal swelling into `T`, stopping dead on the cut. */
function reverseCymbal(T, len, vel = 1) {
  const fl = new SVF()
  const fr = new SVF()
  play(T - len, len, (t) => {
    const u = len - t
    const env = Math.exp(-u / 0.3) * Math.min(1, u / 0.004) * vel
    const f = 2500 + 5000 * (t / len)
    LR[0] = fl.hp(noise(), f, 0.6) * env
    LR[1] = fr.hp(noise(), f, 0.6) * env
  }, [[BUS.fx, 0.25]])
}

/** Air whoosh peaking on `T`, panning across the stereo field in the wipe's direction. */
function whoosh(T, dir, vel = 1) {
  const pre = 0.4
  const fl = new SVF()
  const fr = new SVF()
  play(T - pre, 0.85, (t) => {
    const u = t - pre
    const env = (u < 0 ? (1 + u / pre) ** 2.5 : Math.exp(-u / 0.12)) * vel
    const f = 700 + 5000 * Math.max(0, 1 - Math.abs(u) / pre) ** 2
    const [gl, gr] = panGains(Math.max(-1, Math.min(1, (u / pre) * dir)))
    LR[0] = fl.bp(noise(), f, 1.6) * env * gl
    LR[1] = fr.bp(noise(), f * 1.04, 1.6) * env * gr
  }, [[BUS.fx, 0.45], [BUS.verb, 0.12]])
}

/** Noise sweep plus rising tone, ending on `T`. */
function riser(T, len, vel = 1) {
  const fl = new SVF()
  const fr = new SVF()
  let ph = 0
  play(T - len, len, (t) => {
    const p = t / len
    const env = p * p * Math.min(1, (len - t) / 0.01) * vel
    const f = 300 * 25 ** p
    ph += (220 * 4 ** p) / SR
    const tone = 0.25 * Math.sin(TAU * ph)
    LR[0] = (fl.bp(noise(), f, 2) + tone) * env
    LR[1] = (fr.bp(noise(), f * 1.06, 2) + tone) * env
  }, [[BUS.fx, 0.25], [BUS.verb, 0.12]])
}

/** Sub drop that sells each big cut. */
function boom(T, vel = 1) {
  kickTimes.push(T)
  let ph = 0
  play(T, 2, (t) => {
    ph += (38 + 40 * Math.exp(-t / 0.25)) / SR
    const x = Math.tanh(1.5 * Math.sin(TAU * ph)) * Math.min(1, t / 0.003) * Math.exp(-t / 0.7) * vel
    LR[0] = x
    LR[1] = x
  }, [[BUS.fx, 0.36]])
}

/** Night rain: band-limited hiss with sparse droplets. */
function rain(t0, dur, vel = 1) {
  const hl = new SVF()
  const hr = new SVF()
  const dl = new SVF()
  const dr = new SVF()
  play(t0, dur, (t) => {
    const env = Math.min(1, t / 0.6) * Math.min(1, Math.max(0, (dur - t) / 0.8)) * vel
    const dropL = rand() > 0.9992 ? noise() * 5 : 0
    const dropR = rand() > 0.9992 ? noise() * 5 : 0
    LR[0] = (0.5 * hl.bp(noise(), 5200, 0.5) + dl.bp(dropL, 2400, 3)) * env
    LR[1] = (0.5 * hr.bp(noise(), 4800, 0.5) + dr.bp(dropR, 2700, 3)) * env
  }, [[BUS.fx, 0.09], [BUS.verb, 0.04]])
}

/** Digital tear: random slices of crushed noise, square bursts and dropouts. */
function glitch(t0, len, vel = 1) {
  const slices = []
  for (let t = 0; t < len; ) {
    const d = 0.018 + rand() * 0.035
    slices.push({ t, d, kind: Math.floor(rand() * 3), hold: 8 + Math.floor(rand() * 60), f: 200 + rand() * 1800, pan: rand() * 1.6 - 0.8 })
    t += d
  }
  const hp = new SVF()
  let s = 0
  let hold = 0
  let held = 0
  let ph = 0
  play(t0, len, (t) => {
    while (s < slices.length - 1 && t >= slices[s].t + slices[s].d) s++
    const sl = slices[s]
    let x = 0
    if (sl.kind === 0) {
      if (--hold <= 0) {
        held = noise()
        hold = sl.hold
      }
      x = held
    } else if (sl.kind === 1) {
      ph += sl.f / SR
      if (ph >= 1) ph -= 1
      x = ph < 0.5 ? 0.8 : -0.8
    }
    const env = Math.min(1, t / 0.002) * Math.min(1, Math.max(0, (len - t) / 0.01)) * vel
    const y = hp.hp(x, 150) * env
    const [gl, gr] = panGains(sl.pan)
    LR[0] = y * gl
    LR[1] = y * gr
  }, [[BUS.fx, 0.2]])
}

/** UI blip, optionally gliding to `toMidi` (send chirp). */
function blip(t0, midi, vel = 1, len = 0.07, toMidi = midi) {
  let ph = 0
  play(t0, len + 0.02, (t) => {
    const m = midi + (toMidi - midi) * Math.min(1, t / len)
    ph += midiHz(m) / SR
    if (ph >= 1) ph -= 1
    const x = softSquare(ph) * Math.min(1, t / 0.001) * Math.exp(-t / (len * 0.45)) * vel
    LR[0] = x
    LR[1] = x
  }, [[BUS.fx, 0.1], [BUS.echo, 0.1]])
}

/** Two-tone tritone siren for the critical finding. */
function alarm(t0, beats, vel = 1) {
  const len = at(beats)
  const half = at(0.25)
  const lp = new SVF()
  let ph = 0
  play(t0, len, (t) => {
    ph += midiHz(Math.floor(t / half) % 2 === 0 ? 86 : 80) / SR
    if (ph >= 1) ph -= 1
    const env = Math.min(1, t / 0.005) * Math.min(1, Math.max(0, (len - t) / 0.04)) * vel
    const x = lp.lp(softSquare(ph), 3600) * env
    LR[0] = x
    LR[1] = x
  }, [[BUS.fx, 0.09], [BUS.verb, 0.08]])
}

/** Resonant, driven saw bass with a sub an octave down. */
function cyberBass(t0, midi, dur, vel = 1, bright = 1) {
  const f = midiHz(midi)
  const d1 = f / SR
  const d2 = (f * 1.006) / SR
  const lp = new SVF()
  let p1 = rand()
  let p2 = rand()
  let sub = 0
  play(t0, dur + 0.02, (t) => {
    p1 += d1
    if (p1 >= 1) p1 -= 1
    p2 += d2
    if (p2 >= 1) p2 -= 1
    sub += d1 / 2
    if (sub >= 1) sub -= 1
    const cutoff = 140 + 2600 * bright * Math.exp(-t / 0.045)
    const mid = Math.tanh(2.2 * lp.lp(0.5 * (saw(p1, d1) + saw(p2, d2)), cutoff, 1.8))
    const env = Math.min(1, t / 0.002) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.02) : 1) * vel
    const x = (0.5 * Math.sin(TAU * sub) + 0.75 * mid) * env
    LR[0] = x
    LR[1] = x
  }, [[BUS.bass, 0.5]])
}

const DETUNE = [-0.16, -0.07, 0, 0.07, 0.16]

/** Supersaw chord; filtering and sidechain happen on the pad bus. */
function padChord(t0, notes, dur, vel = 1) {
  const voices = []
  for (const m of notes) {
    DETUNE.forEach((d, v) => {
      const [gl, gr] = panGains(((v / (DETUNE.length - 1)) * 2 - 1) * 0.8)
      voices.push({ dt: midiHz(m + d) / SR, ph: rand(), gl, gr })
    })
  }
  play(t0, dur + 0.4, (t) => {
    const env = Math.min(1, t / 0.05) * (t > dur ? Math.exp(-(t - dur) / 0.1) : 1) * vel
    let l = 0
    let r = 0
    for (const vo of voices) {
      vo.ph += vo.dt
      if (vo.ph >= 1) vo.ph -= 1
      const s = saw(vo.ph, vo.dt)
      l += s * vo.gl
      r += s * vo.gr
    }
    LR[0] = l * env
    LR[1] = r * env
  }, [[BUS.pad, 0.035]])
}

/** Synth brass: detuned saws behind a filter that swells open. Short attack/swell = stab. */
function brass(t0, notes, dur, { vel = 1, attack = 0.006, swell = 0.03, release = 0.18 } = {}) {
  const voices = []
  for (const m of notes) {
    for (const d of [-0.09, 0.09]) {
      const [gl, gr] = panGains(d > 0 ? 0.35 : -0.35)
      voices.push({ dt: midiHz(m + d) / SR, ph: rand(), gl, gr })
    }
  }
  const fl = new SVF()
  const fr = new SVF()
  play(t0, dur + release * 5, (t) => {
    const rel = t > dur ? Math.exp(-(t - dur) / release) : 1
    const open = (1 - Math.exp(-t / swell)) * (0.55 + 0.45 * Math.exp(-t / 0.3))
    const cutoff = 280 + 3800 * open * rel
    let l = 0
    let r = 0
    for (const vo of voices) {
      vo.ph += vo.dt
      if (vo.ph >= 1) vo.ph -= 1
      const s = saw(vo.ph, vo.dt)
      l += s * vo.gl
      r += s * vo.gr
    }
    const env = Math.min(1, t / attack) * rel * vel
    LR[0] = fl.lp(l, cutoff, 1.1) * env
    LR[1] = fr.lp(r, cutoff, 1.1) * env
  }, [[BUS.brass, 0.06], [BUS.verb, 0.025]])
}

/** Pulse-width-modulated arp note; the PWM LFO runs on absolute time so it sweeps across notes. */
function pwm(t0, midi, dur, vel = 1, bright = 1) {
  const dt = midiHz(midi) / SR
  const fl = new SVF()
  const fr = new SVF()
  let ph = rand()
  play(t0, dur + 0.05, (t) => {
    ph += dt
    if (ph >= 1) ph -= 1
    const width = 0.5 + 0.38 * Math.sin(TAU * 0.9 * (t0 + t))
    let p2 = ph + width
    if (p2 >= 1) p2 -= 1
    const s = saw(ph, dt) - saw(p2, dt)
    const f = 600 + 4800 * bright * Math.exp(-t / 0.07)
    const env = Math.min(1, t / 0.002) * Math.exp(-t / 0.12) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.04) : 1) * vel
    LR[0] = fl.lp(s, f, 1.4) * env
    LR[1] = fr.lp(s, f * 0.94, 1.4) * env
  }, [[BUS.arp, 0.14], [BUS.echo, 0.18], [BUS.verb, 0.06]])
}

/** Detuned saw lead with delayed vibrato. */
function lead(t0, midi, dur, vel = 1) {
  const f = midiHz(midi)
  const fl = new SVF()
  const fr = new SVF()
  let p1 = rand()
  let p2 = rand()
  play(t0, dur + 0.6, (t) => {
    const vib = 1 + 0.012 * Math.sin(TAU * 5.6 * t) * Math.min(1, Math.max(0, (t - 0.18) / 0.25))
    const d1 = (f * vib * 0.9965) / SR
    const d2 = (f * vib * 1.0035) / SR
    p1 += d1
    if (p1 >= 1) p1 -= 1
    p2 += d2
    if (p2 >= 1) p2 -= 1
    const s1 = saw(p1, d1)
    const s2 = saw(p2, d2)
    const env = Math.min(1, t / 0.012) * (0.8 + 0.2 * Math.exp(-t / 0.2)) * (t > dur ? Math.exp(-(t - dur) / 0.12) : 1) * vel
    const cutoff = 1200 + 2600 * Math.exp(-t / 0.3)
    LR[0] = fl.lp(s1 + 0.6 * s2, cutoff, 1.2) * env
    LR[1] = fr.lp(s2 + 0.6 * s1, cutoff, 1.2) * env
  }, [[BUS.lead, 0.14], [BUS.echo, 0.2], [BUS.verb, 0.12]])
}

/** FM bell for chimes. */
function bell(t0, midi, dur, vel = 1) {
  const f = midiHz(midi)
  let pc = 0
  let pm = 0
  play(t0, dur + 1.2, (t) => {
    pc += f / SR
    pm += (2 * f) / SR
    const index = 0.4 + 2.2 * Math.exp(-t / 0.25)
    const car = Math.sin(TAU * pc + index * Math.sin(TAU * pm))
    const shimmer = 0.15 * Math.sin(TAU * pc * 2.001) * Math.exp(-t / 0.4)
    const env = Math.min(1, t / 0.005) * (0.35 + 0.65 * Math.exp(-t / 0.35)) * (t > dur ? Math.exp(-(t - dur) / 0.35) : 1) * vel
    LR[0] = (car + shimmer) * env
    LR[1] = (car + shimmer) * env
  }, [[BUS.lead, 0.12], [BUS.echo, 0.12], [BUS.verb, 0.22]])
}

// ---------------------------------------------------------------- patterns

function hats16(b, level = 1) {
  hat(at(b), 0.25 * level)
  hat(at(b + 0.25), (0.35 + 0.1 * rand()) * level)
  hat(at(b + 0.5), 0.7 * level, true)
  hat(at(b + 0.75), (0.45 + 0.1 * rand()) * level)
}

/** Half-time: kick on 1 and the "and" of 3, snare on 3, eighth-note bass. */
function halfTime(fromBeat, toBeat) {
  for (let b = fromBeat; b < toBeat; b++) {
    const bar = (b - fromBeat) % 4
    if (bar === 0) industrialKick(at(b))
    if (bar === 2) {
      gatedSnare(at(b))
      industrialKick(at(b + 0.5), 0.8)
    }
    hats16(b, 0.85)
    const root = chordAt(b).bass
    cyberBass(at(b), root, at(0.4), 0.95, 0.8)
    cyberBass(at(b + 0.5), root, at(0.4), 0.75, 0.6)
  }
}

/** Four on the floor, snare on 2 and 4, galloping 16th bass (root, root, octave, root). */
function drive(fromBeat, toBeat) {
  for (let b = fromBeat; b < toBeat; b++) {
    const bar = (b - fromBeat) % 4
    industrialKick(at(b))
    if (bar === 1 || bar === 3) gatedSnare(at(b))
    hats16(b)
    const root = chordAt(b).bass
    ;[0, 0, 12, 0].forEach((o, k) => cyberBass(at(b + k / 4), root + o, at(0.2), k === 0 ? 1 : 0.8, k === 2 ? 1 : 0.75))
  }
}

function arp(fromBeat, toBeat, { level = 1, step = 1, vel = () => 1, bright = () => 1 } = {}) {
  for (let q = Math.round(fromBeat * 4); q < Math.round(toBeat * 4); q += step) {
    const b = q / 4
    const notes = chordAt(b).pad
    const p = (b - fromBeat) / (toBeat - fromBeat)
    pwm(at(b), notes[ARP[q % 8] % notes.length] + 12, at(0.22), level * ARP_ACCENT[q % 4] * vel(p), bright(p))
  }
}

const roll = (fromBeat, beats, perBeat, v0, v1) => {
  const n = Math.round(beats * perBeat)
  for (let k = 0; k < n; k++) gatedSnare(at(fromBeat + k / perBeat), v0 + ((v1 - v0) * k) / (n - 1), false)
}

const stab = (beat, name, beats, vel = 1) => {
  const { pad, bass: root } = CHORDS[name]
  brass(at(beat), [root + 12, ...pad], at(beats), { vel })
}

// ---------------------------------------------------------------- arrangement

for (const s of sections) for (const c of s.chords) padChord(at(c.start), CHORDS[c.name].pad, at(c.len), PAD_LEVEL[s.id])

// hook: rain, low brass swell, sub drone, typing blips, glitch on the risk
const hook = section('hook')
rain(0, cut('map') + at(1), 0.9)
brass(0, [42, 49, 54], at(7.5), { vel: 0.85, attack: 1.4, swell: 1.8, release: 0.4 })
cyberBass(0, 42, at(8), 0.55, 0.1)
for (let q = Math.round(TICKER_FROM * 4); q <= Math.round(TICKER_TO * 4) - 1; q++) {
  blip(at(hook.start + q / 4), TICKER_NOTES[q % TICKER_NOTES.length], 0.3 + 0.12 * rand(), 0.045)
}
glitch(at(RISK_BEAT) - 0.02, 0.34, 1)
boom(at(RISK_BEAT), 0.7)
industrialKick(at(RISK_BEAT), 0.9)
crash(at(RISK_BEAT), 0.45, 0.8)
for (let b = hook.start + 4; b < hook.end; b += 0.5) hat(at(b), b % 1 === 0 ? 0.22 : 0.32, b % 1 !== 0)
arp(hook.end - 2, hook.end, { level: 0.8, vel: (p) => 0.3 + 0.7 * p, bright: (p) => 0.2 + 0.8 * p })
riser(cut('map'), 1.6, 0.9)
crash(cut('map'), 0.9)

// map: half-time groove, typing ticks on the command, a falling blip per log line, chirp on mapped, hops up the flow
const pathMap = section('map')
halfTime(pathMap.start, pathMap.end - 2)
arp(pathMap.start, pathMap.end, { level: 0.75, step: 2 })
for (let q = Math.round(TYPE_FROM * 4); q < Math.round(TYPE_TO * 4); q++) {
  blip(at(beatIn('map', q / 4)), TYPE_NOTES[q % TYPE_NOTES.length], 0.25 + 0.1 * rand(), 0.04)
}
LOG_BEATS.forEach((b, i) => blip(at(beatIn('map', b)), LOG_NOTES[i], 0.6))
blip(at(beatIn('map', MAPPED_BEAT)), 74, 0.8, 0.16, 98)
FLOW_HOPS.forEach((b, i) => blip(at(beatIn('map', b)), HOP_NOTES[i], 0.55, 0.09))
riser(cut('gaps'), 1, 0.8)

// gaps: full drive, bent blips as prod drifts, riser under the beam, alarm on the first gap, chime when ready
const gaps = section('gaps')
drive(gaps.start, gaps.end - 2)
arp(gaps.start, gaps.end, { level: 0.9 })
DRIFT_BEATS.forEach((b, i) => {
  glitch(at(beatIn('gaps', b)) - 0.01, 0.07, 0.45)
  blip(at(beatIn('gaps', b)), DRIFT_NOTES[i], 0.55, 0.09, DRIFT_NOTES[i] - 2)
})
riser(at(beatIn('gaps', BEAM_TO)), at(BEAM_TO - BEAM_FROM), 0.55)
{
  let found = 0
  CHECKS.forEach((c, i) => {
    const t = at(beatIn('gaps', CHECK_BEATS[i]))
    if (c.ok) blip(t, OK_NOTE, 0.6, 0.1)
    else if (found++ === 0) alarm(t, 1, 0.75)
    else blip(t, GAP_NOTES[(found - 2) % GAP_NOTES.length], 0.6, 0.1)
  })
}
READY_CHIME.forEach((m, i) => bell(at(beatIn('gaps', READY_BEAT + i * 0.25)), m, at(0.5), 0.75))
riser(cut('roadmap'), 0.8, 0.7)

// roadmap: blips as the columns open, impact + brass on the first card, the lead, bells as the pipeline turns green
const roadmap = section('roadmap')
drive(roadmap.start, roadmap.end - 1)
arp(roadmap.start, roadmap.end, { level: 0.85 })
COLUMN_BEATS.forEach((b, i) => blip(at(beatIn('roadmap', b)), COLUMN_NOTES[i], 0.55, 0.07))
const land = beatIn('roadmap', CARD_BEATS[0])
riser(at(land), at(1.5), 0.5)
boom(at(land), 1)
crash(at(land), 0.9)
glitch(at(land) - 0.01, 0.18, 0.8)
stab(land, 'E', 0.75, 1.1)
for (const [b, m, len] of ROADMAP_LEAD) lead(at(beatIn('roadmap', b)), m, at(len) * 0.92, 0.95)
STAGE_BEATS.forEach((b, i) => bell(at(beatIn('roadmap', b)), STAGE_NOTES[i], at(0.5), 0.6))
boom(at(beatIn('roadmap', GREEN_BEAT)), 0.5)
blip(at(beatIn('roadmap', IMPLEMENT_BEAT)), 97, 0.45, 0.08)

// stack: a slam per word, ticks on the icon pops, the tail on G, roll and tape stop into the end
const stack = section('stack')
STACK_WORD_BEATS.forEach((b) => {
  const beat = beatIn('stack', b)
  const { name } = stack.chords.find((c) => beat >= c.start && beat < c.start + c.len)
  stab(beat, name, 0.5, 1)
  industrialKick(at(beat))
  gatedSnare(at(beat), 0.9)
  boom(at(beat), 0.45)
})
STACK_ICON_BEATS.forEach((b, i) => blip(at(beatIn('stack', b)), ICON_NOTES[i % ICON_NOTES.length], 0.22, 0.04))
for (let b = stack.start; b < beatIn('stack', STACK_TAIL_BEAT); b++) hats16(b, 0.9)
for (let b = stack.start; b < stack.end - 0.75; b += 0.5) cyberBass(at(b), chordAt(b).bass, at(0.4), b % 1 === 0 ? 1 : 0.75, 0.8)
const tail = beatIn('stack', STACK_TAIL_BEAT)
stab(tail, 'G', 1.5, 1.15)
industrialKick(at(tail))
gatedSnare(at(tail), 0.8)
boom(at(tail), 1)
crash(at(tail), 0.9)
roll(stack.end - 2, 1.25, 8, 0.3, 1)
riser(at(stack.end - 0.75), 1, 0.7)

for (const [id, dir] of Object.entries(WIPES)) {
  whoosh(cut(id), dir, 0.95)
  reverseCymbal(cut(id), 0.85, 0.55)
  glitch(cut(id) - 0.12, 0.24, 0.7)
  if (id !== 'stack') boom(cut(id), 0.65)
}

// end: impact, F#m(add9) swell, sustained bass, chime on the CTA, descending arp
const end = section('end')
industrialKick(cut('end'))
boom(cut('end'), 1)
crash(cut('end'), 1.15, 1.7)
brass(cut('end'), [42, ...CHORDS['F#madd9'].pad], at(6), { vel: 0.9, attack: 0.25, swell: 0.6, release: 0.5 })
cyberBass(cut('end'), 42, at(7), 1.05, 0.4)
CTA_CHIME.forEach((m, i) => bell(at(beatIn('end', CTA_BEAT + i * 0.25)), m, at(0.75), 0.8))
{
  const tones = CHORDS['F#madd9'].pad
  const n = 12
  for (let k = 0; k < n; k++) {
    const idx = n - 1 - k
    const p = k / (n - 1)
    pwm(at(end.start + k * 0.5), tones[idx % 4] + 12 * Math.floor(idx / 4), at(0.3), 0.85 * (1 - 0.75 * p), 1 - 0.5 * p)
  }
}

// ---------------------------------------------------------------- processing

const duck = new Float32Array(LEN)
for (const t of kickTimes) {
  const i0 = Math.round(t * SR)
  for (let k = 0; k < 0.45 * SR && i0 + k < LEN; k++) {
    const u = k / SR
    const d = u < 0.004 ? u / 0.004 : Math.exp(-(u - 0.004) / 0.085)
    if (d > duck[i0 + k]) duck[i0 + k] = d
  }
}

const padCutoff = (t) => {
  const i = cut('map')
  const sc = cut('gaps')
  const so = cut('roadmap')
  const l = at(land)
  const st = cut('stack')
  const e = cut('end')
  if (t < i) return 260 * (2000 / 260) ** (t / i)
  if (t < sc) return 1800
  if (t < so) return 2600
  if (t < l) return 2000 + 1800 * ((t - so) / (l - so))
  if (t < st) return 4200
  if (t < e) return 4600
  return 2800 * (700 / 2800) ** Math.min(1, (t - e) / 3.2)
}

for (const ch of BUS.pad) {
  const hp = new SVF()
  const lp = new SVF()
  for (let i = 0; i < LEN; i++) ch[i] = lp.lp(hp.hp(ch[i], 180), padCutoff(i / SR), 0.75) * (1 - 0.7 * duck[i])
}
for (let c = 0; c < 2; c++) for (let i = 0; i < LEN; i++) BUS.verb[c][i] += BUS.pad[c][i] * 0.25

for (const ch of BUS.bass) for (let i = 0; i < LEN; i++) ch[i] *= 1 - 0.6 * duck[i]
for (const ch of BUS.arp) for (let i = 0; i < LEN; i++) ch[i] *= 1 - 0.35 * duck[i]
for (const ch of BUS.brass) for (let i = 0; i < LEN; i++) ch[i] *= 1 - 0.3 * duck[i]

/** Dotted-eighth ping-pong echo. */
function pingPong([inL, inR], time, feedback, tone) {
  const D = Math.round(time * SR)
  const bl = new Float32Array(D)
  const br = new Float32Array(D)
  const out = pair()
  const lpl = new SVF()
  const lpr = new SVF()
  for (let i = 0, j = 0; i < LEN; i++, j = (j + 1) % D) {
    const dl = bl[j]
    const dr = br[j]
    out[0][i] = dl
    out[1][i] = dr
    bl[j] = (inL[i] + inR[i]) * 0.5 + lpr.lp(dr, tone) * feedback
    br[j] = lpl.lp(dl, tone) * feedback
  }
  return out
}

/** Freeverb (Jezar) with pre-delay; return is band-limited to keep the low end clean. */
function freeverb([inL, inR], { room = 0.86, damp = 0.3, preDelay = 0.02 } = {}) {
  const scale = SR / 44100
  const make = (n) => ({ buf: new Float32Array(Math.round(n * scale)), i: 0, store: 0 })
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617]
  const allpasses = [556, 441, 341, 225]
  const cl = combs.map(make)
  const cr = combs.map((n) => make(n + 23))
  const al = allpasses.map(make)
  const ar = allpasses.map((n) => make(n + 23))
  const comb = (c, x) => {
    const y = c.buf[c.i]
    c.store = y * (1 - damp) + c.store * damp
    c.buf[c.i] = x + c.store * room
    if (++c.i >= c.buf.length) c.i = 0
    return y
  }
  const allpass = (a, x) => {
    const b = a.buf[a.i]
    a.buf[a.i] = x + b * 0.5
    if (++a.i >= a.buf.length) a.i = 0
    return b - x
  }
  const pd = Math.round(preDelay * SR)
  const out = pair()
  const filters = [new SVF(), new SVF(), new SVF(), new SVF()]
  for (let n = 0; n < LEN; n++) {
    const x = n >= pd ? (inL[n - pd] + inR[n - pd]) * 0.015 : 0
    let l = 0
    let r = 0
    for (let c = 0; c < combs.length; c++) {
      l += comb(cl[c], x)
      r += comb(cr[c], x)
    }
    for (let a = 0; a < allpasses.length; a++) {
      l = allpass(al[a], l)
      r = allpass(ar[a], r)
    }
    out[0][n] = filters[0].lp(filters[1].hp(l, 250), 7000)
    out[1][n] = filters[2].lp(filters[3].hp(r, 250), 7000)
  }
  return out
}

const echo = pingPong(BUS.echo, 0.75 * SPB, 0.4, 4200)
for (let c = 0; c < 2; c++) for (let i = 0; i < LEN; i++) BUS.verb[c][i] += echo[c][i] * 0.3
const verb = freeverb(BUS.verb)

/** Big room on the snare, slammed shut after each hit (80s gated reverb). */
const gate = freeverb(BUS.gate, { room: 0.93, damp: 0.15, preDelay: 0.008 })
const gateEnv = new Float32Array(LEN)
const GATE_OPEN = Math.round(0.26 * SR)
const GATE_CLOSE = Math.round(0.035 * SR)
for (const t of snareTimes) {
  const i0 = Math.round(t * SR)
  for (let k = 0; k < GATE_OPEN + GATE_CLOSE && i0 + k < LEN; k++) {
    const g = k < GATE_OPEN ? 1 : 1 - (k - GATE_OPEN) / GATE_CLOSE
    if (g > gateEnv[i0 + k]) gateEnv[i0 + k] = g
  }
}
for (const ch of gate) for (let i = 0; i < LEN; i++) ch[i] *= gateEnv[i]

const STEMS = { drums: BUS.drums, bass: BUS.bass, pad: BUS.pad, arp: BUS.arp, lead: BUS.lead, brass: BUS.brass, fx: BUS.fx, verb, echo, gate }

// ---------------------------------------------------------------- master

const mix = pair()
for (const [name, [l, r]] of Object.entries(STEMS)) {
  for (let i = 0; i < LEN; i++) {
    mix[0][i] += l[i] * MIX[name]
    mix[1][i] += r[i] * MIX[name]
  }
}

/** Tape stop: playback decelerates to a halt between T0 and T1 (the cut into the end card). */
function tapeStop(T0, T1) {
  const i0 = Math.round(T0 * SR)
  const n = Math.round(T1 * SR) - i0
  for (const ch of mix) {
    const src = ch.slice(i0, i0 + n)
    let pos = 0
    for (let k = 0; k < n; k++) {
      const p = k / n
      const j = Math.floor(pos)
      const fr = pos - j
      const v = (src[j] ?? 0) * (1 - fr) + (src[j + 1] ?? 0) * fr
      ch[i0 + k] = v * Math.min(1, (1 - p) / 0.2)
      pos += (1 - p) ** 1.6
    }
  }
}
tapeStop(at(stack.end - 0.75), cut('end'))

const FADE = 0.9
for (const ch of mix) {
  const hp = new SVF()
  for (let i = 0; i < LEN; i++) {
    const p = Math.min(1, Math.max(0, (i / SR - (SECONDS - FADE)) / (FADE - 0.05)))
    ch[i] = hp.hp(ch[i], 32) * 0.5 * (1 + Math.cos(Math.PI * p))
  }
}

/** Integrated loudness (ITU-R BS.1770, K-weighted, gated). */
function lufs(channels) {
  const weighted = channels.map((x) => {
    const y = new Float64Array(x.length)
    const stages = [
      [[1.53512485958697, -2.69169618940638, 1.19839281085285], [-1.69065929318241, 0.73248077421585]],
      [[1, -2, 1], [-1.99004745483398, 0.99007225036621]],
    ]
    let src = x
    for (const [[b0, b1, b2], [a1, a2]] of stages) {
      let x1 = 0
      let x2 = 0
      let y1 = 0
      let y2 = 0
      for (let i = 0; i < src.length; i++) {
        const v = b0 * src[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        x2 = x1
        x1 = src[i]
        y2 = y1
        y1 = v
        y[i] = v
      }
      src = y
    }
    return y
  })
  const block = Math.round(0.4 * SR)
  const hop = Math.round(0.1 * SR)
  const power = []
  for (let s = 0; s + block <= LEN; s += hop) {
    let sum = 0
    for (const w of weighted) for (let i = s; i < s + block; i++) sum += w[i] * w[i]
    power.push(sum / block)
  }
  const loudness = (z) => -0.691 + 10 * Math.log10(z)
  const mean = (zs) => zs.reduce((a, b) => a + b, 0) / zs.length
  const absolute = power.filter((z) => loudness(z) > -70)
  const relative = loudness(mean(absolute)) - 10
  return loudness(mean(absolute.filter((z) => loudness(z) > relative)))
}

const CEILING = 0.88
const knee = (x) => {
  const a = Math.abs(x)
  return a <= 0.6 ? x : Math.sign(x) * (0.6 + 0.4 * Math.tanh((a - 0.6) / 0.4))
}
const master = (gain) => mix.map((ch) => ch.map((x) => knee(x * gain) * CEILING))

let gain = 1
for (let k = 0; k < 5; k++) gain *= 10 ** ((TARGET_LUFS - lufs(master(gain))) / 20)
const out = master(gain)

// ---------------------------------------------------------------- report + write

const dB = (x) => (x > 0 ? (20 * Math.log10(x)).toFixed(1) : '-inf').padStart(6)
for (const [name, ch] of Object.entries(STEMS)) {
  let peak = 0
  let sum = 0
  for (const c of ch) for (let i = 0; i < LEN; i++) {
    peak = Math.max(peak, Math.abs(c[i]))
    sum += c[i] * c[i]
  }
  console.log(`${name.padEnd(6)} peak ${dB(peak * MIX[name] * gain)} dBFS  rms ${dB(Math.sqrt(sum / (2 * LEN)) * MIX[name] * gain)} dBFS`)
}
let peak = 0
for (const c of out) for (let i = 0; i < LEN; i++) peak = Math.max(peak, Math.abs(c[i]))
console.log(`master ${lufs(out).toFixed(1)} LUFS, peak ${dB(peak)} dBFS, gain ${dB(gain)} dB, ${SECONDS}s`)

const wav = Buffer.alloc(44 + LEN * 4)
wav.write('RIFF', 0)
wav.writeUInt32LE(36 + LEN * 4, 4)
wav.write('WAVEfmt ', 8)
wav.writeUInt32LE(16, 16)
wav.writeUInt16LE(1, 20)
wav.writeUInt16LE(2, 22)
wav.writeUInt32LE(SR, 24)
wav.writeUInt32LE(SR * 4, 28)
wav.writeUInt16LE(4, 32)
wav.writeUInt16LE(16, 34)
wav.write('data', 36)
wav.writeUInt32LE(LEN * 4, 40)
for (let i = 0; i < LEN; i++) {
  for (let c = 0; c < 2; c++) {
    const dither = rand() - rand()
    const v = Math.round(out[c][i] * 32767 + dither)
    wav.writeInt16LE(Math.max(-32768, Math.min(32767, v)), 44 + i * 4 + c * 2)
  }
}
mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(new URL('music.wav', OUT_DIR), wav)
console.log('wrote public/music.wav')
