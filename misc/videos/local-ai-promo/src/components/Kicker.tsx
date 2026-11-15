import { useCurrentFrame } from 'remotion'
import { ACCENT, type Accent } from '../lib/accent'
import { progress } from '../lib/anim'
import { COPY } from '../script'
import { PipelineIcon } from './icons'

/** Scene index and label as a HUD line, with a neon rule that draws in. */
export const Kicker: React.FC<{ index: string; label: string; accent?: Accent }> = ({ index, label, accent = 'cyan' }) => {
  const frame = useCurrentFrame()
  const a = ACCENT[accent]
  const in_ = progress(frame, 0, 12)
  const rule = progress(frame, 4, 18)

  return (
    <div className="absolute top-[56px] left-[110px] flex flex-col gap-4" style={{ opacity: in_, transform: `translateX(${(1 - in_) * -24}px)` }}>
      <div className="flex items-center gap-4 font-mono text-[24px] font-bold tracking-[0.2em] uppercase">
        <PipelineIcon className={`h-[42px] w-[42px] ${a.stroke}`} />
        <span className={a.text}>{index} //</span>
        <span className="text-white/80">{label}</span>
      </div>
      <span className={`h-[2px] w-[460px] origin-left ${a.bg}`} style={{ transform: `scaleX(${rule})` }} />
    </div>
  )
}

export const Wordmark: React.FC = () => {
  const frame = useCurrentFrame()
  return (
    <div
      className="absolute top-[60px] right-[72px] font-mono text-[20px] font-bold tracking-[0.16em] text-white/70"
      style={{ opacity: progress(frame, 0, 12) }}
    >
      {COPY.end.url}
    </div>
  )
}
