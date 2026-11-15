import { useMemo } from 'react'
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion'
import { CLAMP, EASE_IN, EASE_OUT } from '../lib/anim'
import { HEIGHT, WIDTH } from '../script'

const MOVE = 6
const SPREAD = 4
export const WIPE_FRAMES = 2 * (MOVE + SPREAD) + 2
/** Every slice is fully in from frame MOVE + SPREAD until WIPE_CUT, so the hard cut there stays hidden. */
export const WIPE_CUT = WIPE_FRAMES / 2

const FILLS = ['fill-night', 'fill-night-2', 'fill-magenta', 'fill-night-3', 'fill-cyan', 'fill-night', 'fill-neon', 'fill-night-2']
const EDGES = ['fill-magenta', 'fill-cyan', 'fill-neon', 'fill-white']

type Slice = { y: number; h: number; fill: string; edge: string; inAt: number; outAt: number }

const slicesFor = (seed: string): Slice[] => {
  const out: Slice[] = []
  for (let y = 0, i = 0; y < HEIGHT; i++) {
    const r = random(`${seed}-h-${i}`)
    const h = Math.min(HEIGHT - y, Math.round(r < 0.3 ? 14 + r * 40 : 50 + r * 150))
    out.push({
      y,
      h,
      fill: FILLS[Math.floor(random(`${seed}-f-${i}`) * FILLS.length)],
      edge: EDGES[Math.floor(random(`${seed}-e-${i}`) * EDGES.length)],
      inAt: Math.floor(random(`${seed}-in-${i}`) * (SPREAD + 1)),
      outAt: WIPE_CUT + Math.floor(random(`${seed}-out-${i}`) * (SPREAD + 1)),
    })
    y += h
  }
  return out
}

/** Neon slices tear across with ragged timing and hide a hard cut placed at WIPE_CUT. */
export const GlitchWipe: React.FC<{ direction?: 1 | -1; seed: string }> = ({ direction = 1, seed }) => {
  const frame = useCurrentFrame()
  const slices = useMemo(() => slicesFor(seed), [seed])
  const noisy = Math.abs(frame - WIPE_CUT) <= 6

  return (
    <AbsoluteFill className="pointer-events-none">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute inset-0 h-full w-full">
        {slices.map((s, i) => {
          const enter = interpolate(frame, [s.inAt, s.inAt + MOVE], [-WIDTH - 40, 0], { ...CLAMP, easing: EASE_OUT })
          const exit = interpolate(frame, [s.outAt, s.outAt + MOVE], [0, WIDTH + 40], { ...CLAMP, easing: EASE_IN })
          const x = (frame < s.outAt ? enter : exit) * direction
          return (
            <g key={i} transform={`translate(${x} 0)`}>
              <rect x="0" y={s.y} width={WIDTH} height={s.h} className={s.fill} />
              <rect x="0" y={s.y} width="8" height={s.h} className={s.edge} />
              <rect x={WIDTH - 8} y={s.y} width="8" height={s.h} className={s.edge} />
            </g>
          )
        })}
        {noisy
          ? Array.from({ length: 9 }, (_, k) => {
              const r = (n: string) => random(`${seed}-n-${k}-${n}-${frame}`)
              return (
                <rect
                  key={k}
                  x={r('x') * WIDTH * 0.7}
                  y={r('y') * HEIGHT}
                  width={120 + r('w') * 900}
                  height={2 + Math.round(r('h') * 6)}
                  className={EDGES[Math.floor(r('c') * EDGES.length)]}
                  opacity={0.6 + 0.4 * r('o')}
                />
              )
            })
          : null}
      </svg>
    </AbsoluteFill>
  )
}
