import { useCurrentFrame, useVideoConfig } from 'remotion'
import { EASE_IN_OUT, pop, progress } from '../lib/anim'
import { atBeat, type FlowNode } from '../script'
import { Glyph, type GlyphName } from './Glyph'

const NODE_W = 168

/** A request packet hops one architecture node per beat. */
export const ArchFlow: React.FC<{ nodes: readonly FlowNode[]; hops: readonly number[]; accent?: string }> = ({
  nodes,
  hops,
  accent = '#06aced',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const land = hops.map((beat) => atBeat(beat))
  const width = nodes.length * NODE_W
  const center = (i: number) => (i + 0.5) * NODE_W
  const reveal = progress(frame, 4, 14)

  let x = center(0)
  if (frame < land[0]) {
    x = center(0) - (1 - progress(frame, Math.max(0, land[0] - 14), 14, EASE_IN_OUT)) * 70
  } else {
    let seg = land.length - 1
    for (let i = 0; i < land.length - 1; i++) if (frame < land[i + 1]) {
      seg = i
      break
    }
    if (seg >= land.length - 1 || frame >= land[land.length - 1]) x = center(land.length - 1)
    else {
      const t = progress(frame, land[seg], land[seg + 1] - land[seg], EASE_IN_OUT)
      x = center(seg) + (center(seg + 1) - center(seg)) * t
    }
  }

  return (
    <div className="relative h-[150px]" style={{ width, opacity: reveal }}>
      <div className="absolute top-[38px] right-[40px] left-[40px] h-[2px] bg-white/15" />
      <div
        className="absolute top-[29px] z-10 h-[20px] w-[20px] rounded-full"
        style={{
          left: x - 10,
          background: accent,
          boxShadow: `0 0 22px 6px ${accent}`,
        }}
      />
      {nodes.map((node, i) => {
        const s = pop(frame, fps, land[i], 11)
        const on = frame >= land[i]
        return (
          <div key={`${node.icon}-${node.label}`} className="absolute top-0 flex w-[168px] flex-col items-center" style={{ left: i * NODE_W }}>
            <div style={{ transform: `scale(${0.92 + 0.08 * Math.min(1, s)})` }}>
              <Glyph name={node.icon as GlyphName} />
            </div>
            <div className={`mt-2 font-mono text-[16px] font-bold tracking-wide ${on ? 'text-white' : 'text-white/45'}`}>{node.label}</div>
            <div className="h-[18px] font-mono text-[13px] tracking-wide text-white/45">{node.sub ?? ''}</div>
          </div>
        )
      })}
    </div>
  )
}
