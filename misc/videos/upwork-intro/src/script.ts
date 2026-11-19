import { LINES, type LineId } from './lines'
import voice from './voice.json'

export { LINES }
export type { LineId }

export const FPS = 30
export const WIDTH = 1920
export const HEIGHT = 1080
export const BPM = 120

/** Silence before and after each line, so cuts don't clip the voice. */
export const LEAD_FRAMES = 2
export const TAIL_FRAMES = 4

export const sec = (s: number) => Math.round(s * FPS)

/** Frames from the start of a scene to a beat offset. 120 BPM → 15 frames per beat. */
export const atBeat = (beat: number) => Math.round(beat * (60 / BPM) * FPS)

type VoiceRow = { id: LineId; file: string; seconds: number }

const voiceRows = new Map((voice.lines as VoiceRow[]).map((row) => [row.id, row]))

export const sceneTiming = (id: LineId) => {
  const row = voiceRows.get(id)
  const audioFrames = sec(row?.seconds ?? 5)
  return {
    file: row?.file ?? `${id}.wav`,
    audioFrames,
    frames: LEAD_FRAMES + audioFrames + TAIL_FRAMES,
  }
}

export const SCENES = LINES.map((line) => ({ id: line.id, ...sceneTiming(line.id) }))

export const TOTAL_FRAMES = SCENES.reduce((sum, scene) => sum + scene.frames, 0)

/** Scenes that open with a brand-stripe wipe, and its direction (1 = left to right). */
export const WIPES: Partial<Record<LineId, 1 | -1>> = {
  stack: -1,
  hallocasa: 1,
  aisecure: -1,
  proof: 1,
  handover: -1,
  end: 1,
}

export const COPY = {
  hook: ['Infrastructure your team', 'can actually *run.*'],
  hallocasa: {
    context: 'Own product',
    index: '01',
    label: 'HalloCasa — real-estate marketplace',
    lines: ['Agents in 9 languages.', 'Production on *Fargate.*'],
    chips: ['Multi-account CDK pipeline', 'CloudFront · ALB · RDS'],
  },
  aisecure: {
    context: 'Own product',
    index: '02',
    label: 'AI Secure — compliance audits',
    browser: 'AI Secure · scan report',
    lines: ['AI agents audit your app.', 'On Bedrock *AgentCore.*'],
    chips: ['ISO 27001 · SOC 2 · NIST', 'MCP server on API Gateway'],
  },
  stack: ['CDK', 'Serverless', 'Containers', 'CI/CD', 'Terraform'],
  proof: {
    count: 4000,
    unit: 'hours on Upwork',
    credential: 'Solutions Architect – Professional',
    community: 'Community Builder since 2022',
  },
  handover: {
    title: 'A handover your engineers can *run.*',
    items: ['Pipelines', 'Least-privilege IAM', 'Written notes'],
  },
  end: {
    name: 'Martin',
    headline: 'AWS CDK & DevOps Engineer',
    credential: 'AWS Certified Solutions Architect – Professional',
    community: 'AWS Community Builder',
    cta: 'Invite Martin on Upwork',
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
export const DEPLOY_BEATS = [2, 3.5] as const

export const DEPLOY_LINES = [
  { stack: 'HalloCasaEcsStack', region: 'us-east-1' },
  { stack: 'AiSecureStatelessStack', region: 'us-east-1' },
] as const

export type FlowIcon = 'cloudfront' | 'elb' | 'fargate' | 'rds' | 'lambda' | 'dynamodb' | 'agentcore' | 'scan' | 'redirect'

export type FlowNode = { icon: FlowIcon; label: string; sub?: string }

export const FLOWS: Record<'hallocasa' | 'aisecure', readonly FlowNode[]> = {
  hallocasa: [
    { icon: 'cloudfront', label: 'CloudFront' },
    { icon: 'elb', label: 'ALB' },
    { icon: 'fargate', label: 'Fargate', sub: 'Next + API' },
    { icon: 'rds', label: 'RDS', sub: 'MySQL' },
  ],
  aisecure: [
    { icon: 'fargate', label: 'Fargate' },
    { icon: 'agentcore', label: 'Runtime', sub: 'AgentCore' },
    { icon: 'agentcore', label: 'Browser', sub: 'AgentCore' },
    { icon: 'dynamodb', label: 'DynamoDB' },
  ],
}

/** Beat offset inside the scene when the packet lands on each node. */
export const FLOW_HOPS = {
  hallocasa: [1, 2, 3, 4],
  aisecure: [1, 2, 3, 4],
} as const

/** Beat offsets of the scan beam across the AI Secure screenshot. */
export const SCAN_FROM = 1
export const SCAN_TO = 5

/** Beat inside the AI Secure scene when the report slides in. */
export const REPORT_BEAT = 3

/** Eighth-note offsets when the ring icons pop. */
export const STACK_ICON_BEATS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] as const

export const STACK_RING = ['cloudfront', 'fargate', 'lambda', 'rds', 'dynamodb', 'bedrock', 'apigateway', 'cdk'] as const
