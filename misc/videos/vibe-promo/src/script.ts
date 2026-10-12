// Copy, timing and story data. `*word*` renders as the italic serif accent.
// Beats are the shared clock: visuals and scripts/build-music.mjs both read this file.

export const FPS = 30
export const WIDTH = 1920
export const HEIGHT = 1080
export const BPM = 120

/** Seconds per scene, in order. Total = video length. */
export const BEATS = {
  hook: 4,
  split: 6,
  flow: 6,
  observe: 6,
  stack: 4,
  end: 4,
} as const

export type BeatId = keyof typeof BEATS

/** Scenes that open with a brand-stripe wipe, and its direction (1 = left to right). */
export const WIPES: Partial<Record<BeatId, 1 | -1>> = { flow: 1, observe: -1, stack: 1 }

export const COPY = {
  hook: ['Your vibe-coded idea.', 'Brought to *production.*'],
  split: {
    index: '01',
    kicker: 'Arc Rider Universe',
    lines: ['Keep vibe-coding.', 'Ship prod on *Hetzner.*'],
    chips: ['Netlify stays dev', 'Falkenstein, Germany'],
    dev: { title: 'DEV', host: 'dev.universe.arc-rider.com', detail: 'Netlify · managed Supabase' },
    prod: { title: 'PROD', host: 'universe.arc-rider.com', detail: 'Hetzner · Falkenstein' },
  },
  flow: {
    index: '02',
    kicker: 'Self-hosted Supabase',
    lines: ['Real users. Real data.', 'On *Hetzner.*'],
    chips: ['OpenTofu', "Let's Encrypt"],
  },
  observe: {
    index: '03',
    kicker: 'AI Agents',
    lines: ['You stay in charge.', 'AI Agents run *prod.*'],
    ask: 'How is production?',
    tools: [
      { name: 'Grafana MCP', detail: 'PromQL · LogQL · alerts' },
      { name: 'Supabase MCP', detail: 'read-only SQL' },
      { name: 'OpenTofu MCP', detail: 'provider docs' },
    ],
    panels: ['Metrics', 'Logs', 'Traces'],
  },
  stack: ['Idea.', 'Host.', 'Ship.', 'Yours.'],
  stackTail: 'With *AI* *Agents.*',
  end: {
    name: 'Martin Mueller',
    kicker: 'Your vibe-coded idea',
    headline: 'Production.',
    credential: 'AI Agents on your stack',
    community: 'Grafana · Supabase · OpenTofu MCP',
    cta: 'Book a call',
    url: 'martinmueller.dev',
  },
} as const

export const DEPLOY_CMD = 'workflow dispatch'

/** Beat offsets inside the hook when a deploy line lands. */
export const DEPLOY_BEATS = [3, 4, 5] as const

export const DEPLOY_LINES = [
  { stack: 'deploy_static', region: 'fsn1' },
  { stack: 'deploy_supabase', region: 'fsn1' },
  { stack: 'deploy_observability', region: 'fsn1' },
] as const

export type FlowIcon = 'react' | 'nginx' | 'auth' | 'database'

export type FlowNode = { icon: FlowIcon; label: string; sub?: string }

export const FLOWS: Record<'flow', readonly FlowNode[]> = {
  flow: [
    { icon: 'react', label: 'React', sub: 'SPA' },
    { icon: 'nginx', label: 'nginx', sub: 'TLS' },
    { icon: 'auth', label: 'Auth', sub: 'GoTrue' },
    { icon: 'database', label: 'Postgres' },
  ],
}

/** Beat offset inside the scene when the packet lands on each node. */
export const FLOW_HOPS = {
  flow: [1, 2, 3, 4],
} as const

/** Beat inside the split scene when the prod card lands. */
export const SPLIT_BEAT = 3

/** Beat offsets of the trace beam across the Grafana panels. */
export const BEAM_FROM = 1
export const BEAM_TO = 5

/** Beat offsets inside the observe scene when each MCP tool lands. */
export const AGENT_BEATS = [2, 3, 4] as const

/** Beat offsets inside the stack scene when each word lands, then the tail. */
export const STACK_WORD_BEATS = [0, 1, 2, 3] as const
export const STACK_TAIL_BEAT = 4

/** Eighth-note offsets when the ring icons pop. */
export const STACK_ICON_BEATS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] as const

export const STACK_RING = ['server', 'pipeline', 'chart', 'lock', 'database', 'shield', 'terminal', 'globe'] as const

export const MUSIC: string | null = 'music.wav'
export const MUSIC_VOLUME = 1

export const sec = (s: number) => Math.round(s * FPS)

/** Frames from the start of a scene to a beat offset. 120 BPM → 15 frames per beat. */
export const atBeat = (beat: number) => Math.round(beat * (60 / BPM) * FPS)

export const SCENES = (Object.keys(BEATS) as BeatId[]).map((id) => ({ id, frames: sec(BEATS[id]) }))

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.frames, 0)
