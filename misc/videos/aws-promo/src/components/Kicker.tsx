import { Img, useCurrentFrame } from 'remotion'
import { progress } from '../lib/anim'

/** Product index, wordmark and corner URL. */
export const Kicker: React.FC<{
  index: string
  label: string
  mark: string
  light?: boolean
  /** e.g. "Client · Germany" — clarifies engagement type */
  context?: string
  /** Optional second logo (e.g. HDI next to Prowler) */
  markSecondary?: string
}> = ({ index, label, mark, light = false, context, markSecondary }) => {
  const frame = useCurrentFrame()
  const in_ = progress(frame, 0, 12)

  return (
    <div
      className="absolute top-[56px] left-[110px] flex flex-col gap-3"
      style={{ opacity: in_, transform: `translateY(${(1 - in_) * 12}px)` }}
    >
      {context ? (
        <span
          className={`inline-flex w-fit rounded-full px-4 py-1.5 font-mono text-[17px] font-bold tracking-[0.14em] uppercase ${
            light ? 'bg-teal/15 text-teal ring-1 ring-teal/30' : 'bg-white/10 text-brand-light ring-1 ring-white/15'
          }`}
        >
          {context}
        </span>
      ) : null}
      <div className="flex items-center gap-4">
        <Img src={mark} className="h-[52px] w-auto" />
        {markSecondary ? <Img src={markSecondary} className="h-[44px] w-auto" /> : null}
        <span className={`font-mono text-[22px] font-bold tracking-[0.18em] ${light ? 'text-teal' : 'text-brand'}`}>{index}</span>
        <span className={`max-w-[720px] font-mono text-[22px] leading-tight tracking-[0.04em] ${light ? 'text-ink/60' : 'text-white/70'}`}>{label}</span>
      </div>
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
