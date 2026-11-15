import { useMemo } from 'react'
import { random, useCurrentFrame, useVideoConfig } from 'remotion'
import { HEIGHT, WIDTH } from '../script'

export type GridTheme = 'threat' | 'neutral' | 'secure'

const SKY: Record<GridTheme, readonly [string, string, string]> = {
  threat: ['#05030b', '#16052e', '#520c55'],
  neutral: ['#05030b', '#0a0618', '#1d0b3c'],
  secure: ['#020608', '#03140e', '#0e4a2a'],
}

const FLOOR: Record<GridTheme, readonly [string, string]> = {
  threat: ['#1a0630', '#05030b'],
  neutral: ['#0f0824', '#05030b'],
  secure: ['#062016', '#020608'],
}

const LINE: Record<GridTheme, string> = { threat: '#ff2bd6', neutral: '#8b5cf6', secure: '#9dff3c' }

const SUN: Record<'threat' | 'secure', readonly [string, string, string]> = {
  threat: ['#ffd23f', '#ff2bd6', '#6d12d6'],
  secure: ['#f2ff9e', '#9dff3c', '#00a896'],
}

const WINDOWS: Record<GridTheme, readonly string[]> = {
  threat: ['#00e5ff', '#ff2bd6', '#ffb020'],
  neutral: ['#00e5ff', '#8b5cf6', '#ff2bd6'],
  secure: ['#9dff3c', '#00e5ff', '#e9ffd6'],
}

type Building = { x: number; w: number; h: number; antenna: boolean; windows: { x: number; y: number; color: number; lit: boolean }[] }

const makeSkyline = (seed: string): Building[] => {
  const out: Building[] = []
  let x = -30
  for (let i = 0; x < WIDTH + 30; i++) {
    const w = Math.round(46 + random(`${seed}-w-${i}`) * 104)
    const tall = random(`${seed}-t-${i}`) > 0.82
    const h = Math.round(tall ? 190 + random(`${seed}-h-${i}`) * 140 : 50 + random(`${seed}-h-${i}`) * 150)
    const windows: Building['windows'] = []
    for (let cy = 14; cy < h - 10; cy += 18) {
      for (let cx = 8; cx < w - 12; cx += 14) {
        const k = windows.length
        windows.push({ x: cx, y: cy, color: Math.floor(random(`${seed}-c-${i}-${k}`) * 3), lit: random(`${seed}-l-${i}-${k}`) > 0.74 })
      }
    }
    out.push({ x, w, h, antenna: tall && random(`${seed}-a-${i}`) > 0.4, windows })
    x += w + Math.round(random(`${seed}-g-${i}`) * 10)
  }
  return out
}

type Drop = { x: number; y: number; v: number; len: number; o: number }

const makeRain = (seed: string, n = 70): Drop[] =>
  Array.from({ length: n }, (_, i) => ({
    x: random(`${seed}-rx-${i}`) * (WIDTH + 400) - 200,
    y: random(`${seed}-ry-${i}`) * (HEIGHT + 300),
    v: 1300 + random(`${seed}-rv-${i}`) * 900,
    len: 28 + random(`${seed}-rl-${i}`) * 60,
    o: 0.12 + random(`${seed}-ro-${i}`) * 0.3,
  }))

type Props = {
  /** Prefix for SVG ids and the deterministic layout. */
  id: string
  theme?: GridTheme
  horizon?: number
  /** Floor rows that pass the camera per second. */
  speed?: number
  sun?: boolean
  /** 0 = sun below the horizon, 1 = risen. */
  sunRise?: number
  skyline?: boolean
  rain?: boolean
  floorOpacity?: number
}

const VP_X = WIDTH / 2
const ROWS = 34
const SUN_R = 270
const SUN_BARS = 7

/** Synthwave backdrop: sky, striped sun, skyline, perspective floor grid and rain. */
export const NeonGrid: React.FC<Props> = ({
  id,
  theme = 'neutral',
  horizon = 700,
  speed = 0.8,
  sun = false,
  sunRise = 1,
  skyline = false,
  rain = false,
  floorOpacity = 1,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const t = frame / fps
  const buildings = useMemo(() => (skyline ? makeSkyline(id) : []), [id, skyline])
  const drops = useMemo(() => (rain ? makeRain(id) : []), [id, rain])
  const [sky0, sky1, sky2] = SKY[theme]
  const [floor0, floor1] = FLOOR[theme]
  const line = LINE[theme]
  const windowColors = WINDOWS[theme]
  const depth = HEIGHT - horizon
  const phase = (t * speed) % 1

  const sunColors = theme === 'secure' ? SUN.secure : SUN.threat
  const sunCy = horizon + SUN_R * 0.95 - sunRise * SUN_R * 1.45
  const scroll = (t * 0.35) % 1

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2={horizon} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={sky0} />
          <stop offset="0.55" stopColor={sky1} />
          <stop offset="1" stopColor={sky2} />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1={horizon} x2="0" y2={HEIGHT} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={floor0} />
          <stop offset="1" stopColor={floor1} />
        </linearGradient>
        <radialGradient id={`${id}-haze`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={line} stopOpacity="0.38" />
          <stop offset="1" stopColor={line} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-sun`} x1="0" y1={sunCy - SUN_R} x2="0" y2={sunCy + SUN_R} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={sunColors[0]} />
          <stop offset="0.55" stopColor={sunColors[1]} />
          <stop offset="1" stopColor={sunColors[2]} />
        </linearGradient>
        <radialGradient id={`${id}-sunglow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={sunColors[1]} stopOpacity="0.45" />
          <stop offset="1" stopColor={sunColors[1]} stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-sunmask`}>
          <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="white" />
          {Array.from({ length: SUN_BARS }, (_, j) => {
            const u = ((j + scroll) % SUN_BARS) / SUN_BARS
            return <rect key={j} x="0" y={sunCy + u * SUN_R} width={WIDTH} height={3 + u * 24} fill="black" />
          })}
        </mask>
        <linearGradient id={`${id}-fade`} x1="0" y1={horizon} x2="0" y2={horizon + depth * 0.45} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}-floormask`}>
          <rect x="0" y={horizon} width={WIDTH} height={depth} fill={`url(#${id}-fade)`} />
        </mask>
        <filter id={`${id}-glow`} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width={WIDTH} height={horizon} fill={`url(#${id}-sky)`} />
      <ellipse cx={VP_X} cy={horizon} rx={WIDTH * 0.62} ry={150} fill={`url(#${id}-haze)`} />

      {sun ? (
        <g>
          <circle cx={VP_X} cy={sunCy} r={SUN_R * 1.75} fill={`url(#${id}-sunglow)`} />
          <circle cx={VP_X} cy={sunCy} r={SUN_R} fill={`url(#${id}-sun)`} mask={`url(#${id}-sunmask)`} />
        </g>
      ) : null}

      {buildings.map((b, bi) => (
        <g key={bi} transform={`translate(${b.x} ${horizon - b.h})`}>
          <rect width={b.w} height={b.h + 2} fill={theme === 'secure' ? '#020a06' : '#07040f'} />
          <rect width={b.w} height="2" fill={line} opacity="0.35" />
          {b.antenna ? <rect x={b.w / 2 - 1.5} y={-46} width="3" height="46" fill="#07040f" /> : null}
          {b.antenna ? <circle cx={b.w / 2} cy={-48} r="3.5" fill="#ff3864" opacity={Math.floor(frame / 12) % 2 === 0 ? 1 : 0.25} /> : null}
          {b.windows.map((w, k) => {
            const flick = random(`${id}-f-${bi}-${k}-${Math.floor(frame / 9)}`) > 0.965
            if (w.lit === flick) return null
            return <rect key={k} x={w.x} y={w.y} width="5" height="7" fill={windowColors[w.color]} opacity="0.75" />
          })}
        </g>
      ))}

      <g opacity={floorOpacity}>
        <rect x="0" y={horizon} width={WIDTH} height={depth} fill={`url(#${id}-floor)`} />
        <g mask={`url(#${id}-floormask)`} filter={`url(#${id}-glow)`} stroke={line}>
          {Array.from({ length: 19 }, (_, i) => (
            <line key={`v${i}`} x1={VP_X} y1={horizon} x2={VP_X + (i - 9) * 190} y2={HEIGHT} strokeWidth="1.6" opacity="0.8" />
          ))}
          {Array.from({ length: ROWS }, (_, k) => {
            const z = 1 + (k - phase) * 0.5
            if (z < 0.98) return null
            return (
              <line
                key={`h${k}`}
                x1="0"
                y1={horizon + depth / z}
                x2={WIDTH}
                y2={horizon + depth / z}
                strokeWidth={Math.max(0.7, 2.6 / z)}
                opacity={Math.min(1, 1.6 / z)}
              />
            )
          })}
        </g>
        <rect x="0" y={horizon - 1.5} width={WIDTH} height="3" fill={line} filter={`url(#${id}-glow)`} />
      </g>

      {drops.map((d, i) => {
        const y = ((d.y + d.v * t) % (HEIGHT + 300)) - 150
        return <line key={i} x1={d.x} y1={y} x2={d.x - d.len * 0.22} y2={y + d.len} stroke="#bfefff" strokeWidth="1.4" opacity={d.o} />
      })}
    </svg>
  )
}
