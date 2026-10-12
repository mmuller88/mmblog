import { evolvePath, getLength, getPointAtLength } from '@remotion/paths'
import { useCurrentFrame, useVideoConfig } from 'remotion'
import dots from '../data/world-dots.json'
import { circlesPath, EASE_IN_OUT, pop, progress } from '../lib/anim'
import { liftedArc, orthographic, projectCity, toVec, type Vec3 } from '../lib/geo'
import { HEIGHT, WIDTH, type City } from '../script'
import { Pulse } from './Pulse'

const SPHERE: Vec3[] = []
for (let i = 0; i < dots.sphere.length; i += 2) {
  SPHERE.push(toVec(dots.sphere[i], dots.sphere[i + 1]))
}

const DEPTH_LEVELS = [0.16, 0.3, 0.48, 0.7, 0.95]
const ARC_FRAMES = 22

export type GlobePin = { city: City; at: number }

type Props = {
  id: string
  cx: number
  cy: number
  r: number
  lon0: number
  lat0: number
  /** Dot colour class, e.g. `fill-[#9cc3f0]`. */
  dotClassName?: string
  body?: boolean
  home?: { city: City; at: number; label: string }
  pins?: GlobePin[]
}

/** Dotted orthographic globe; buyer pins send lifted arcs to the home pin. */
export const Globe: React.FC<Props> = ({
  id,
  cx,
  cy,
  r,
  lon0,
  lat0,
  dotClassName = 'fill-[#9cc3f0]',
  body = true,
  home,
  pins = [],
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const dotR = r * 0.0095

  const buckets: { x: number; y: number; r: number }[][] = DEPTH_LEVELS.map(() => [])
  for (const v of SPHERE) {
    const p = orthographic(v, lon0, lat0)
    if (p.z <= 0.02) continue
    const level = Math.min(DEPTH_LEVELS.length - 1, Math.floor(p.z * DEPTH_LEVELS.length))
    buckets[level].push({ x: cx + p.x * r, y: cy - p.y * r, r: dotR * (0.5 + 0.5 * p.z) })
  }

  const toScreen = (p: { x: number; y: number }) => ({ x: cx + p.x * r, y: cy - p.y * r })
  const homeXY = home ? toScreen(projectCity(home.city, lon0, lat0)) : null

  return (
    <svg width={WIDTH} height={HEIGHT} className="absolute inset-0 overflow-visible">
      <defs>
        <radialGradient id={`${id}-body`} cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#1d4a82" />
          <stop offset="58%" stopColor="#0e2a52" />
          <stop offset="100%" stopColor="#071733" />
        </radialGradient>
        <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="78%" stopColor="#4c92e0" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#4c92e0" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {body ? (
        <>
          <circle cx={cx} cy={cy} r={r * 1.2} fill={`url(#${id}-halo)`} />
          <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-body)`} className="stroke-brand-light" strokeOpacity={0.4} strokeWidth={1.5} />
        </>
      ) : null}

      {buckets.map((bucket, i) => (
        <path key={DEPTH_LEVELS[i]} d={circlesPath(bucket)} className={dotClassName} fillOpacity={DEPTH_LEVELS[i]} />
      ))}

      {home && homeXY
        ? pins.map(({ city, at }) => {
            const drawn = progress(frame, at + 4, ARC_FRAMES, EASE_IN_OUT)
            if (drawn <= 0) return null
            const points = liftedArc(city, home.city).map((v) => toScreen(orthographic(v, lon0, lat0)))
            const d = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('')
            const evolved = evolvePath(drawn, d)
            const head = drawn < 1 ? getPointAtLength(d, getLength(d) * drawn) : null
            return (
              <g key={`arc-${city.name}`}>
                <path d={d} fill="none" className="stroke-gold" strokeWidth={9} strokeOpacity={0.22} filter={`url(#${id}-blur)`} {...evolved} />
                <path d={d} fill="none" className="stroke-gold" strokeWidth={3} strokeLinecap="round" {...evolved} />
                {head ? <circle cx={head.x} cy={head.y} r={5} className="fill-white" /> : null}
              </g>
            )
          })
        : null}

      {pins.map(({ city, at }) => {
        const p = projectCity(city, lon0, lat0)
        const s = pop(frame, fps, at)
        if (s <= 0.01 || p.z <= 0.05) return null
        const { x, y } = toScreen(p)
        const flip = x < cx
        return (
          <g key={`pin-${city.name}`} opacity={Math.min(1, p.z * 4)}>
            <Pulse x={x} y={y} r={7} className="stroke-gold" frame={frame - at} />
            <circle cx={x} cy={y} r={7 * s} className="fill-gold" />
            <circle cx={x} cy={y} r={2.6 * s} className="fill-navy" />
            <text
              x={flip ? x - 16 : x + 16}
              y={y - 12}
              textAnchor={flip ? 'end' : 'start'}
              className="fill-white font-mono text-[19px] font-medium uppercase tracking-[0.12em]"
              opacity={Math.min(1, s)}
            >
              {city.name}
            </text>
          </g>
        )
      })}

      {home && homeXY
        ? (() => {
            const s = pop(frame, fps, home.at)
            if (s <= 0.01) return null
            return (
              <g>
                <Pulse x={homeXY.x} y={homeXY.y} r={10} className="stroke-coral" frame={frame - home.at} />
                <circle cx={homeXY.x} cy={homeXY.y} r={10 * s} className="fill-coral" />
                <circle cx={homeXY.x} cy={homeXY.y} r={3.5 * s} className="fill-white" />
                <text
                  x={homeXY.x}
                  y={homeXY.y + 34}
                  textAnchor="middle"
                  className="fill-coral font-mono text-[19px] font-bold uppercase tracking-[0.12em]"
                  opacity={Math.min(1, s)}
                >
                  {home.label}
                </text>
              </g>
            )
          })()
        : null}
    </svg>
  )
}
