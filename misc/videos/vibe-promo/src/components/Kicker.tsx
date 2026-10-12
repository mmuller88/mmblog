import { useCurrentFrame } from 'remotion'
import { progress } from '../lib/anim'

/** Product index and corner URL. */
export const Kicker: React.FC<{ index: string; label: string }> = ({ index, label }) => {
  const frame = useCurrentFrame()
  const in_ = progress(frame, 0, 12)

  return (
    <div className="absolute top-[64px] left-[110px] flex items-center gap-4" style={{ opacity: in_, transform: `translateY(${(1 - in_) * 12}px)` }}>
      <span className="font-mono text-[22px] font-bold tracking-[0.18em] text-signal">{index}</span>
      <span className="font-mono text-[22px] tracking-[0.06em] text-white/70">{label}</span>
    </div>
  )
}

export const Wordmark: React.FC<{ light?: boolean }> = ({ light = false }) => {
  const frame = useCurrentFrame()
  return (
    <div
      className={`absolute top-[52px] right-[72px] font-mono text-[20px] font-bold tracking-[0.16em] ${light ? 'text-ink/55' : 'text-white/75'}`}
      style={{ opacity: progress(frame, 0, 12) }}
    >
      martinmueller.dev
    </div>
  )
}
