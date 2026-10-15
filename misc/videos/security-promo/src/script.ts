// Copy, timing and story data. `*word*` renders as the neon accent.
// Beats are the shared clock: visuals and scripts/build-music.mjs both read this file.

export const FPS = 30
export const WIDTH = 1920
export const HEIGHT = 1080
export const BPM = 120

/** Seconds per scene, in order. Total = video length. */
export const BEATS = {
  hook: 4,
  scope: 6,
  review: 6,
  report: 6,
  stack: 4,
  end: 4,
} as const

export type BeatId = keyof typeof BEATS

/** Scenes that open with a glitch wipe, and its direction (1 = left to right). */
export const WIPES: Partial<Record<BeatId, 1 | -1>> = { scope: 1, review: -1, report: 1, stack: -1 }

export const COPY = {
  hook: {
    ticker: 'SECURITY SIGN-OFF // MISSING',
    readout: ['Exposure', 'Secrets', 'Blast radius'],
    lines: ['Your app is live.', 'Is it *secure?*'],
  },
  scope: {
    index: '01',
    kicker: 'Scope',
    lines: ['Agree the scope.', 'Fix the *price.*'],
    chips: ['One product or cloud account', 'Written Statement of Work'],
    client: 'Acme SaaS',
    target: 'app.acme.example',
    areas: [
      { area: 'App & API', detail: 'Auth · input · sessions' },
      { area: 'Cloud', detail: 'IAM · network · secrets' },
      { area: 'CI/CD', detail: 'Pipelines · dependencies' },
    ],
  },
  review: {
    index: '02',
    kicker: 'Review',
    lines: ['Senior eyes on', 'every *surface.*'],
  },
  report: {
    index: '03',
    kicker: 'Report',
    lines: ['Critical first.', 'Fixes in *order.*'],
    summary: 'Executive summary',
    summaryFor: 'For stakeholders',
    retest: 'Optional re-test window',
  },
  stack: ['Scope.', 'Review.', 'Report.', 'Fix.'],
  stackTail: 'Security, *signed\u00a0off.*',
  end: {
    name: 'Martin Mueller',
    title: 'Security Audit',
    tagline: 'App · Cloud · CI/CD',
    cta: 'Book a security audit',
    url: 'martinmueller.dev',
  },
} as const

export type Severity = 'critical' | 'high' | 'medium' | 'low'

export type SurfaceId = 'app' | 'iam' | 'network' | 'ci'

export const SURFACES: readonly { id: SurfaceId; label: string }[] = [
  { id: 'app', label: 'App & API' },
  { id: 'iam', label: 'Cloud IAM' },
  { id: 'network', label: 'Network' },
  { id: 'ci', label: 'CI/CD' },
]

export const FINDINGS: readonly { severity: Severity; area: string; title: string }[] = [
  { severity: 'critical', area: 'CI', title: 'Deploy key in git history' },
  { severity: 'high', area: 'IAM', title: 'CI role has admin rights' },
  { severity: 'medium', area: 'API', title: 'No rate limit on /login' },
]

/** Illustrative totals; the severity counts add up to the failed checks. */
export const CHECKS = { total: 1240, findings: 31 } as const

export const SEVERITY_COUNTS: readonly { severity: Severity; count: number }[] = [
  { severity: 'critical', count: 2 },
  { severity: 'high', count: 5 },
  { severity: 'medium', count: 9 },
  { severity: 'low', count: 15 },
]

export const FIXES: readonly { severity: Severity; title: string; when: string }[] = [
  { severity: 'critical', title: 'Rotate leaked key', when: 'Today' },
  { severity: 'high', title: 'Scope down CI role', when: 'This week' },
  { severity: 'medium', title: 'Rate-limit /login', when: 'Next sprint' },
]

/** Hook: the HUD ticker types between these beats; the accent glitches on RISK_BEAT. */
export const TICKER_FROM = 0.5
export const TICKER_TO = 2.5
export const RISK_BEAT = 3

/** Scope: area rows, the sign button, then one status hop per beat. */
export const AREA_BEATS = [2, 3, 4] as const
export const SIGN_BEAT = 5
export const FLOW = ['Call', 'Scope', 'SoW', 'Kick-off'] as const
export const FLOW_HOPS = [6, 7, 8, 9] as const

/** Review: surface links, the beam sweep, finding rows, report ready. */
export const SURFACE_BEATS = [1, 2, 3, 4] as const
export const BEAM_FROM = 5
export const BEAM_TO = 9
export const FINDING_BEATS = [6, 7, 8] as const
export const REPORT_BEAT = 10

/** Report: severity bars fill, the critical fix lands on FIX_BEATS[0], then one fix per beat. */
export const SEVERITY_BEATS = [1, 1.5, 2, 2.5] as const
export const FIX_BEATS = [4, 5, 6] as const
export const SUMMARY_BEAT = 8
export const RETEST_BEAT = 9

/** Stack: one word per beat, then the tail. Ring icons pop on eighth notes. */
export const STACK_WORD_BEATS = [0, 1, 2, 3] as const
export const STACK_TAIL_BEAT = 4
export const STACK_ICON_BEATS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] as const
export const STACK_RING = ['shield', 'key', 'bug', 'lock', 'network', 'terminal', 'cloud', 'report'] as const

/** End: the CTA pops on this beat. */
export const CTA_BEAT = 2

export const MUSIC: string | null = 'music.wav'
export const MUSIC_VOLUME = 1

export const sec = (s: number) => Math.round(s * FPS)

/** Frames from the start of a scene to a beat offset. 120 BPM → 15 frames per beat. */
export const atBeat = (beat: number) => Math.round(beat * (60 / BPM) * FPS)

export const SCENES = (Object.keys(BEATS) as BeatId[]).map((id) => ({ id, frames: sec(BEATS[id]) }))

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.frames, 0)
