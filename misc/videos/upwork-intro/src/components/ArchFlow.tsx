import { Img, useCurrentFrame, useVideoConfig } from 'remotion'
import { ICONS } from '../assets'
import { EASE_IN_OUT, pop, progress } from '../lib/anim'
import { atBeat, type FlowNode } from '../script'

const NODE_W = 156

const Glyph: React.FC<{ node: FlowNode }> = ({ node }) => {
  if (node.icon === 'scan') {
    return (
      <svg viewBox="0 0 80 80" className="h-[76px] w-[76px]">
        <rect width="80" height="80" rx="16" className="fill-teal" />
        <path d="M22 28h10M22 34h14M22 40h8M48 28h10v10H48zM50 46h12v12H50zM24 50h12v8H24z" className="fill-white" />
        <circle cx="58" cy="24" r="7" className="fill-white" />
      </svg>
    )
  }
  if (node.icon === 'redirect') {
    return (
      <div className="grid h-[76px] w-[76px] place-items-center rounded-[16px] bg-teal font-mono text-[22px] font-bold text-white">302</div>
    )
  }
  return <Img src={ICONS[node.icon]} className="h-[76px] w-[76px]" />
}

/** A request packet hops one architecture node per beat. */
export const ArchFlow: React.FC<{ nodes: readonly FlowNode[]; hops: readonly number[]; accent?: string; light?: boolean }> = ({
  nodes,
  hops,
  accent = '#06aced',
  light = false,
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
      <div className={`absolute top-[38px] right-[40px] left-[40px] h-[2px] ${light ? 'bg-ink/15' : 'bg-white/15'}`} />
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
          <div key={`${node.icon}-${node.label}`} className="absolute top-0 flex w-[156px] flex-col items-center" style={{ left: i * NODE_W }}>
            <div style={{ transform: `scale(${0.92 + 0.08 * Math.min(1, s)})` }}>
              <Glyph node={node} />
            </div>
            <div className={`mt-2 font-mono text-[16px] font-bold tracking-wide ${on ? (light ? 'text-ink' : 'text-white') : light ? 'text-ink/35' : 'text-white/45'}`}>{node.label}</div>
            <div className={`h-[18px] font-mono text-[13px] tracking-wide ${light ? 'text-ink/45' : 'text-white/45'}`}>{node.sub ?? ''}</div>
          </div>
        )
      })}
    </div>
  )
}
