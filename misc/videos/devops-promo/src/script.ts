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
    ticker: 'ROLLBACK PLAN // NOT FOUND',
    readout: ['Deploys', 'Rollback', 'Alerts'],
    lines: ['Release day again.', 'Fingers *crossed?*'],
  },
  map: {
    index: '01',
    kicker: 'Map',
    lines: ['Map the path', 'to *production.*'],
    chips: ['Repos, pipelines, hosting', 'On-call reality, as it is'],
    repo: 'acme/app',
    hosting: 'prod-1 (VPS)',
    command: './deploy.sh prod',
  },
  gaps: {
    index: '02',
    kicker: 'Gaps',
    lines: ['Find every gap', 'before *users* do.'],
  },
  roadmap: {
    index: '03',
    kicker: 'Roadmap',
    lines: ['A roadmap,', 'not a *rewrite.*'],
    implement: 'Or I implement it, per SoW',
  },
  stack: ['Map.', 'Find.', 'Fix.', 'Ship.'],
  stackTail: 'Deploys, *boring\u00a0again.*',
  end: {
    name: 'Martin Mueller',
    title: 'DevOps Audit',
    tagline: 'CI/CD · Observability · Ops',
    cta: 'Book a DevOps audit',
    url: 'martinmueller.dev',
  },
} as const

export type Tone = 'warn' | 'bad'

/** As-is deploy log, one result line per LOG_BEATS entry. */
export const LOG: readonly { step: string; result: string; tone: Tone }[] = [
  { step: 'tests', result: 'skipped', tone: 'warn' },
  { step: 'rollback', result: 'manual', tone: 'bad' },
  { step: 'alerts', result: 'none', tone: 'bad' },
]

export const ENVS = ['dev', 'staging', 'prod'] as const

/** Config per environment; prod drifts on every row, one per DRIFT_BEATS entry. */
export const ENV_ROWS: readonly { key: string; values: readonly [string, string, string] }[] = [
  { key: 'Runtime', values: ['node 22', 'node 22', 'node 18'] },
  { key: 'Deploy', values: ['CI', 'CI', 'laptop'] },
  { key: 'Infra', values: ['terraform', 'terraform', 'console'] },
]

export const CHECKS: readonly { area: string; ok: boolean; note: string }[] = [
  { area: 'CI/CD & tests', ok: false, note: 'Tests skipped' },
  { area: 'Env parity', ok: false, note: 'Prod drifted' },
  { area: 'Secrets', ok: true, note: 'In a vault' },
  { area: 'Alerts & runbooks', ok: false, note: 'No alerts' },
]

export const ROADMAP: readonly { column: string; title: string; fixes: string }[] = [
  { column: 'Now', title: 'One-command rollback', fixes: 'Manual rollback' },
  { column: 'Next', title: 'Alerts + runbooks', fixes: 'No alerts' },
  { column: 'Later', title: 'IaC for every env', fixes: 'Prod drift' },
]

export type StageId = 'build' | 'test' | 'deploy' | 'observe'

export const STAGES: readonly { id: StageId; label: string }[] = [
  { id: 'build', label: 'Build' },
  { id: 'test', label: 'Test' },
  { id: 'deploy', label: 'Deploy' },
  { id: 'observe', label: 'Observe' },
]

/** Hook: the HUD ticker types between these beats; the accent glitches on RISK_BEAT. */
export const TICKER_FROM = 0.5
export const TICKER_TO = 2.5
export const RISK_BEAT = 3

/** Map: the command types, one log result per beat, the path is mapped, then one hop per beat. */
export const TYPE_FROM = 1
export const TYPE_TO = 2
export const LOG_BEATS = [2, 3, 4] as const
export const MAPPED_BEAT = 5
export const FLOW = ['Laptop', 'Git', 'CI', 'Prod'] as const
export const FLOW_HOPS = [6, 7, 8, 9] as const

/** Gaps: prod drifts row by row, then the beam resolves one check per beat. */
export const DRIFT_BEATS = [1, 2, 3] as const
export const BEAM_FROM = 4
export const BEAM_TO = 9
export const CHECK_BEATS = [5, 6, 7, 8] as const
export const READY_BEAT = 10

/** Roadmap: columns open, the first card lands on CARD_BEATS[0], then the pipeline turns green. */
export const COLUMN_BEATS = [1, 1.5, 2] as const
export const CARD_BEATS = [4, 5, 6] as const
export const STAGE_BEATS = [7, 7.5, 8, 8.5] as const
export const GREEN_BEAT = 9
export const IMPLEMENT_BEAT = 10

/** Stack: one word per beat, then the tail. Ring icons pop on eighth notes. */
export const STACK_WORD_BEATS = [0, 1, 2, 3] as const
export const STACK_TAIL_BEAT = 4
export const STACK_ICON_BEATS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] as const
export const STACK_RING = ['pipeline', 'terminal', 'rollback', 'bell', 'server', 'chart', 'cloud', 'rocket'] as const

/** End: the CTA pops on this beat. */
export const CTA_BEAT = 2

export const MUSIC: string | null = 'music.wav'
export const MUSIC_VOLUME = 1

export const sec = (s: number) => Math.round(s * FPS)

/** Frames from the start of a scene to a beat offset. 120 BPM → 15 frames per beat. */
export const atBeat = (beat: number) => Math.round(beat * (60 / BPM) * FPS)

export const SCENES = (Object.keys(BEATS) as BeatId[]).map((id) => ({ id, frames: sec(BEATS[id]) }))

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.frames, 0)
