import { useCurrentFrame, useVideoConfig } from 'remotion'
import { pop } from '../lib/anim'
import { spike } from '../lib/glitch'
import { DRIFT_BEATS, OPTIONS, atBeat } from '../script'

const OptionCard: React.FC<{ name: string; detail: string; note: string; at: number; enterAt: number }> = ({
  name,
  detail,
  note,
  at,
  enterAt,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const enter = pop(frame, fps, enterAt, 14)
  const picked = frame >= at
  const tag = Math.min(1, pop(frame, fps, at, 12))
  const flicker = picked && frame < at + 6 && spike(`option-${name}`, frame, 0.5) ? 0.35 : 1

  return (
    <div
      className={`w-[280px] rounded-[16px] bg-night-2/90 px-6 py-5 ring-1 ${
        picked ? 'shadow-[0_0_50px_-12px_rgba(0,229,255,0.75)] ring-cyan/70' : 'ring-white/10'
      }`}
      style={{ opacity: Math.min(1, enter * 1.4) * flicker, transform: `translateY(${(1 - Math.min(1, enter)) * 30}px)` }}
    >
      <div className="flex items-center justify-between font-mono text-[18px] font-bold tracking-[0.16em] uppercase">
        <span className={picked ? 'text-cyan' : 'text-white/70'}>{name}</span>
        <span className={`h-[10px] w-[10px] rounded-full ${picked ? 'bg-cyan' : 'bg-white/25'}`} />
      </div>
      <div className="mt-4 font-display text-[28px] leading-none font-bold text-white">{detail}</div>
      <div
        className="mt-4 inline-flex rounded-full bg-cyan/15 px-3 py-1 font-mono text-[14px] font-bold tracking-[0.14em] text-cyan uppercase ring-1 ring-cyan/50"
        style={{ opacity: tag, transform: `scale(${0.6 + 0.4 * tag})` }}
      >
        {note}
      </div>
    </div>
  )
}

/** Local, EU API, and gateway. Each card lights up as a valid setup, not a failure. */
export const EnvDrift: React.FC = () => (
  <div className="flex gap-[20px]">
    {OPTIONS.map((option, i) => (
      <OptionCard key={option.name} name={option.name} detail={option.detail} note={option.note} at={atBeat(DRIFT_BEATS[i])} enterAt={8 + i * 3} />
    ))}
  </div>
)
