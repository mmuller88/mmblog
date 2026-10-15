import { useCurrentFrame, useVideoConfig } from 'remotion'
import { pop } from '../lib/anim'
import { spike } from '../lib/glitch'
import { SEVERITY } from '../lib/severity'
import type { Severity } from '../script'

type Props = { severity: Severity; area: string; title: string; at: number }

/** One review finding that glitches in when the beam passes. */
export const FindingRow: React.FC<Props> = ({ severity, area, title, at }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = pop(frame, fps, at, 13)
  const sev = SEVERITY[severity]
  const flicker = frame >= at && frame < at + 7 && spike(`finding-${title}`, frame, 0.45) ? 0.3 : 1

  return (
    <div
      className={`flex items-center gap-5 rounded-[14px] bg-white/[0.04] px-6 py-5 ring-1 ${sev.row}`}
      style={{ opacity: Math.min(1, s * 1.4) * flicker, transform: `translateX(${(1 - Math.min(1, s)) * 40}px)` }}
    >
      <span className={`w-[150px] shrink-0 rounded-full py-2 text-center font-mono text-[16px] font-bold tracking-[0.18em] uppercase ring-1 ${sev.badge}`}>
        {sev.label}
      </span>
      <span className="w-[60px] shrink-0 font-mono text-[16px] font-bold tracking-[0.12em] text-white/45 uppercase">{area}</span>
      <span className="font-display text-[28px] font-bold text-white">{title}</span>
    </div>
  )
}
