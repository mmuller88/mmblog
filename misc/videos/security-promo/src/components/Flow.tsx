import { useCurrentFrame, useVideoConfig } from 'remotion'
import { ACCENT, type Accent } from '../lib/accent'
import { EASE_IN_OUT, pop, progress } from '../lib/anim'
import { atBeat } from '../script'

const NODE_W = 230
const RAIL = 60

/** A neon packet hops one status node per beat and leaves a lit trail. */
export const Flow: React.FC<{ nodes: readonly string[]; hops: readonly number[]; accent?: Accent }> = ({ nodes, hops, accent = 'cyan' }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const a = ACCENT[accent]
  const land = hops.map((beat) => atBeat(beat))
  const center = (i: number) => (i + 0.5) * NODE_W
  const reveal = progress(frame, 4, 14)

  let x = center(0)
  if (frame < land[0]) {
    x = center(0) - (1 - progress(frame, Math.max(0, land[0] - 14), 14, EASE_IN_OUT)) * 80
  } else {
    let seg = land.length - 1
    for (let i = 0; i < land.length - 1; i++) {
      if (frame < land[i + 1]) {
        seg = i
        break
      }
    }
    x =
      seg >= land.length - 1
        ? center(land.length - 1)
        : center(seg) + (center(seg + 1) - center(seg)) * progress(frame, land[seg], land[seg + 1] - land[seg], EASE_IN_OUT)
  }

  return (
    <div className="relative h-[140px]" style={{ width: nodes.length * NODE_W, opacity: reveal }}>
      <div className="absolute top-[37px] right-[60px] left-[60px] h-[2px] bg-white/15" />
      <div className={`absolute top-[36px] left-[60px] h-[4px] w-px origin-left ${a.bg}`} style={{ transform: `scaleX(${Math.max(0, x - RAIL)})` }} />
      <div className={`absolute top-[28px] z-10 h-[20px] w-[20px] rounded-full ${a.bg} ${a.packet}`} style={{ left: x - 10 }} />
      {nodes.map((label, i) => {
        const s = pop(frame, fps, land[i], 11)
        const on = frame >= land[i]
        return (
          <div key={label} className="absolute top-0 flex w-[230px] flex-col items-center" style={{ left: i * NODE_W }}>
            <div
              className={`grid h-[76px] w-[76px] place-items-center rounded-[18px] font-mono text-[22px] font-bold ring-2 ${
                on ? `${a.bg} text-night ring-white/40 ${a.packet}` : 'bg-night-2 text-white/40 ring-white/15'
              }`}
              style={{ transform: `scale(${0.9 + 0.1 * Math.min(1, s)})` }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className={`mt-3 font-mono text-[18px] font-bold tracking-[0.18em] uppercase ${on ? 'text-white' : 'text-white/40'}`}>{label}</div>
          </div>
        )
      })}
    </div>
  )
}
