// Copy, timing and story data. `*word*` renders as the italic serif accent.
// Beats are the shared clock: visuals and scripts/build-music.mjs both read this file.

export const FPS = 30
export const WIDTH = 1920
export const HEIGHT = 1080
export const BPM = 120

/** Seconds per scene, in order. Total = video length. */
export const BEATS = {
  hook: 5,
  hallocasa: 6,
  cyquins: 6,
  aisecure: 5,
  qrplakat: 5,
  stack: 4,
  end: 4,
} as const

export type BeatId = keyof typeof BEATS

/** Scenes that open with a brand-stripe wipe, and its direction (1 = left to right). */
export const WIPES: Partial<Record<BeatId, 1 | -1>> = {
  cyquins: -1,
  aisecure: 1,
  qrplakat: -1,
  stack: 1,
}

export const COPY = {
  hook: ["I don't just advise on AWS.", 'I *ship* on it.'],
  hallocasa: {
    context: 'Co-founded product',
    index: '01',
    label: 'HalloCasa — real-estate marketplace',
    lines: ['Agents in 9 languages.', 'Production on *Fargate.*'],
    chips: ['Multi-account CDK pipeline', 'CloudFront · ALB · RDS'],
  },
  cyquins: {
    context: 'Client · Germany',
    index: '02',
    label: 'HDI Cyquins — cyber insurance (Prowler)',
    lines: ['Brokers onboard firms.', 'Multi-cloud scans on *AWS.*'],
    chips: ['AWS · Azure · GCP · Microsoft 365', 'ECS Fargate · CDK · DynamoDB'],
  },
  aisecure: {
    context: 'Own SaaS product',
    index: '03',
    label: 'ai-secure.dev — compliance audits',
    lines: ['AI agents audit your app.', 'On Bedrock *AgentCore.*'],
    chips: ['ISO 27001 · SOC 2 · NIST', 'MCP server on API Gateway'],
  },
  qrplakat: {
    context: 'Own product · DACH',
    index: '04',
    label: 'qr-plakat.de — shop-window posters',
    lines: ['Change the link.', 'Not the *poster.*'],
    chips: ['Serverless in Frankfurt', '300 dpi PDFs on Lambda'],
  },
  stack: ['Architecture.', 'CDK.', 'Migration.', 'Cost.', 'Security.'],
  stackTail: '*One* senior expert.',
  end: {
    name: 'Martin Mueller',
    headline: 'AWS Consulting.',
    credential: 'AWS Certified Solutions Architect – Professional',
    community: 'AWS Community Builder',
    cta: 'Book a call',
    url: 'martinmueller.dev',
  },
} as const

export type City = { name: string; lon: number; lat: number }

/** N. Virginia, where the HalloCasa tasks run. */
export const REGION: City = { name: 'us-east-1', lon: -77.46, lat: 39.04 }

export const BUYERS: City[] = [
  { name: 'London', lon: -0.13, lat: 51.51 },
  { name: 'São Paulo', lon: -46.63, lat: -23.55 },
  { name: 'Cape Town', lon: 18.42, lat: -33.92 },
]

export const DEPLOY_CMD = 'cdk deploy'

/** Beat offsets inside the hook when a stack line lands. */
export const DEPLOY_BEATS = [2, 3, 3.75, 4.5] as const

export const DEPLOY_LINES = [
  { stack: 'HalloCasaEcsStack', region: 'us-east-1' },
  { stack: 'ProwlerHdiServiceStack', region: 'us-east-1' },
  { stack: 'AiSecureStatelessStack', region: 'us-east-1' },
  { stack: 'QrPlakatProd-Web', region: 'eu-central-1' },
] as const

export type FlowIcon =
  | 'cloudfront'
  | 'elb'
  | 'fargate'
  | 'rds'
  | 'lambda'
  | 'dynamodb'
  | 'agentcore'
  | 'scan'
  | 'redirect'

export type FlowNode = { icon: FlowIcon; label: string; sub?: string }

export const FLOWS: Record<'hallocasa' | 'cyquins' | 'aisecure' | 'qrplakat', readonly FlowNode[]> = {
  hallocasa: [
    { icon: 'cloudfront', label: 'CloudFront' },
    { icon: 'elb', label: 'ALB' },
    { icon: 'fargate', label: 'Fargate', sub: 'Next + API' },
    { icon: 'rds', label: 'RDS', sub: 'MySQL' },
  ],
  cyquins: [
    { icon: 'elb', label: 'ALB' },
    { icon: 'fargate', label: 'Fargate', sub: 'Cyquins' },
    { icon: 'scan', label: 'Prowler', sub: 'Cloud API' },
    { icon: 'dynamodb', label: 'DynamoDB' },
  ],
  aisecure: [
    { icon: 'fargate', label: 'Fargate' },
    { icon: 'agentcore', label: 'Runtime', sub: 'AgentCore' },
    { icon: 'agentcore', label: 'Browser', sub: 'AgentCore' },
    { icon: 'dynamodb', label: 'DynamoDB' },
  ],
  qrplakat: [
    { icon: 'scan', label: 'Scan' },
    { icon: 'cloudfront', label: 'CloudFront' },
    { icon: 'lambda', label: 'Lambda', sub: 'OpenNext' },
    { icon: 'dynamodb', label: 'DynamoDB' },
    { icon: 'redirect', label: 'Redirect' },
  ],
}

/** Beat offset inside the scene when the packet lands on each node. */
export const FLOW_HOPS = {
  hallocasa: [1, 2, 3, 4],
  cyquins: [1, 2, 3, 4],
  aisecure: [1, 2, 3, 4],
  qrplakat: [1, 2, 3, 4, 5],
} as const

/** Beat offsets of the scan beam across the AI Secure screenshot. */
export const SCAN_FROM = 1
export const SCAN_TO = 5

/** Beat inside the AI Secure scene when the report slides in. */
export const REPORT_BEAT = 3

/** Beat inside the QR scene when the destination link swaps. */
export const LINK_SWAP_BEAT = 3

export const QR_URL = 'https://qr-plakat.de'
export const LINK_FROM = 'qr-plakat.de/p/menu'
export const LINK_TO = 'qr-plakat.de/p/hours'

/** Beat offsets inside the stack scene when each word lands, then the tail. */
export const STACK_WORD_BEATS = [0, 1, 2, 3, 4] as const
export const STACK_TAIL_BEAT = 5

/** Eighth-note offsets when the ring icons pop. */
export const STACK_ICON_BEATS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] as const

export const STACK_RING = ['cloudfront', 'fargate', 'lambda', 'rds', 'dynamodb', 'bedrock', 'apigateway', 'cdk'] as const

export const MUSIC: string | null = 'music.wav'
export const MUSIC_VOLUME = 1

export const sec = (s: number) => Math.round(s * FPS)

/** Frames from the start of a scene to a beat offset. 120 BPM → 15 frames per beat. */
export const atBeat = (beat: number) => Math.round(beat * (60 / BPM) * FPS)

export const SCENES = (Object.keys(BEATS) as BeatId[]).map((id) => ({ id, frames: sec(BEATS[id]) }))

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.frames, 0)
