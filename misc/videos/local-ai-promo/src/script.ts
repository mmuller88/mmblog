// Copy, timing and story data. `*word*` renders as the neon accent.
// Beats are the shared clock: visuals and scripts/build-music.mjs both read this file.

export const FPS = 30
export const WIDTH = 1920
export const HEIGHT = 1080
export const BPM = 120

/** Seconds per scene, in order. Total = video length. */
export const BEATS = {
  hook: 4,
  map: 6,
  gaps: 6,
  roadmap: 6,
  stack: 4,
  end: 4,
} as const

export type BeatId = keyof typeof BEATS

/** Scenes that open with a glitch wipe, and its direction (1 = left to right). */
export const WIPES: Partial<Record<BeatId, 1 | -1>> = { map: 1, gaps: -1, roadmap: 1, stack: -1 }

export const COPY = {
  hook: {
    ticker: 'PROMPTS // LEAVING THE EU',
    readout: ['Region', 'Logs', 'Vendor'],
    lines: ['Your prompts go', '*where?*'],
  },
  map: {
    index: '01',
    kicker: 'Map',
    lines: ['Follow the prompt', 'to the *vendor.*'],
    chips: ['App, model, logs', 'Region, retention, contract'],
    panelTitle: 'Data flow // As-is',
    panelMeta: 'One product',
    fields: [
      { label: 'App', value: 'chat.internal' },
      { label: 'Model', value: 'api.vendor.com' },
    ],
    command: 'trace prompt --prod',
    mapping: 'Tracing flow',
    mapped: 'Flow mapped',
  },
  gaps: {
    index: '02',
    kicker: 'Choose',
    lines: ['One setup', 'per *use* case.'],
    panelTitle: 'Per use case',
    panelMeta: 'Local · EU · Gateway',
    queued: 'Queued',
    choosing: 'Choosing',
    chosen: 'Chosen',
    ready: 'Decision ready',
  },
  roadmap: {
    index: '03',
    kicker: 'Run',
    lines: ['An endpoint', 'you *control.*'],
    implement: 'Or I implement it, per SoW',
    panelTitle: 'Runtime // EU',
    panelMeta: 'OpenAI-compatible',
    ready: 'EU endpoint live',
  },
  stack: ['Map.', 'Choose.', 'Host.', 'Ship.'],
  stackTail: 'Your data *stays* in the EU.',
  end: {
    name: 'Martin Mueller',
    title: 'Local & EU AI',
    tagline: 'Self-hosted · EU APIs · Gateway',
    cta: 'Book a call',
    url: 'martinmueller.dev',
  },
} as const

export type Tone = 'warn' | 'bad'

/** As-is prompt trace: where the data goes today. */
export const LOG: readonly { step: string; result: string; tone: Tone }[] = [
  { step: 'region', result: 'US', tone: 'bad' },
  { step: 'retention', result: '30 days', tone: 'warn' },
  { step: 'dpa', result: 'missing', tone: 'bad' },
]

/** One card per way to run a model. Each lights up on a DRIFT_BEATS entry. */
export const OPTIONS: readonly { name: string; detail: string; note: string }[] = [
  { name: 'Local', detail: 'On-prem GPU', note: 'Data stays' },
  { name: 'EU API', detail: 'Hosted in the EU', note: 'Less to run' },
  { name: 'Gateway', detail: 'Frontier, filtered', note: 'Non-sensitive' },
]

export const CHECKS: readonly { area: string; ok: boolean; note: string }[] = [
  { area: 'Customer docs', ok: true, note: 'Local' },
  { area: 'Product chat', ok: true, note: 'EU API' },
  { area: 'Support mail', ok: true, note: 'Local' },
  { area: 'Public copy', ok: true, note: 'Gateway' },
]

export const ROADMAP: readonly { column: string; title: string; detail: string }[] = [
  { column: 'Endpoint', title: 'vLLM on an EU GPU', detail: 'OpenAI-compatible' },
  { column: 'Gateway', title: 'Route, don’t log', detail: 'Auth and limits' },
  { column: 'Checks', title: 'Region stays EU', detail: 'Prompts not stored' },
]

export type StageId = 'auth' | 'route' | 'gpu' | 'serve'

export const STAGES: readonly { id: StageId; label: string }[] = [
  { id: 'auth', label: 'Auth' },
  { id: 'route', label: 'Route' },
  { id: 'gpu', label: 'GPU' },
  { id: 'serve', label: 'Serve' },
]

/** Hook: the HUD ticker types between these beats; the accent glitches on RISK_BEAT. */
export const TICKER_FROM = 0.5
export const TICKER_TO = 2.5
export const RISK_BEAT = 3

/** Map: the command types, one log result per beat, the flow is mapped, then one hop per beat. */
export const TYPE_FROM = 1
export const TYPE_TO = 2
export const LOG_BEATS = [2, 3, 4] as const
export const MAPPED_BEAT = 5
export const FLOW = ['App', 'Model', 'Logs', 'US'] as const
export const FLOW_HOPS = [6, 7, 8, 9] as const

/** Choose: one setup lights up per beat, then the beam resolves one use case per beat. */
export const DRIFT_BEATS = [1, 2, 3] as const
export const BEAM_FROM = 4
export const BEAM_TO = 9
export const CHECK_BEATS = [5, 6, 7, 8] as const
export const READY_BEAT = 10

/** Run: columns open, the first card lands on CARD_BEATS[0], then the pipeline turns green. */
export const COLUMN_BEATS = [1, 1.5, 2] as const
export const CARD_BEATS = [4, 5, 6] as const
export const STAGE_BEATS = [7, 7.5, 8, 8.5] as const
export const GREEN_BEAT = 9
export const IMPLEMENT_BEAT = 10

/** Stack: one word per beat, then the tail. Ring icons pop on eighth notes. */
export const STACK_WORD_BEATS = [0, 1, 2, 3] as const
export const STACK_TAIL_BEAT = 4
export const STACK_ICON_BEATS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] as const
export const STACK_RING = ['server', 'cloud', 'terminal', 'lock', 'chart', 'rocket', 'pipeline', 'box'] as const

/** End: the CTA pops on this beat. */
export const CTA_BEAT = 2

export const MUSIC: string | null = 'music.wav'
export const MUSIC_VOLUME = 1

export const sec = (s: number) => Math.round(s * FPS)

/** Frames from the start of a scene to a beat offset. 120 BPM → 15 frames per beat. */
export const atBeat = (beat: number) => Math.round(beat * (60 / BPM) * FPS)

export const SCENES = (Object.keys(BEATS) as BeatId[]).map((id) => ({ id, frames: sec(BEATS[id]) }))

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.frames, 0)
