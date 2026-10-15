import { useCurrentFrame, useVideoConfig } from 'remotion'
import { pop } from '../lib/anim'
import { spike } from '../lib/glitch'
import { AREA_BEATS, COPY, SIGN_BEAT, atBeat } from '../script'
import { HudPanel } from './HudPanel'
import { CheckIcon, PenIcon } from './icons'

const Field: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono = false }) => (
  <div>
    <div className="font-mono text-[16px] font-bold tracking-[0.24em] text-white/45 uppercase">{label}</div>
    <div className={mono ? 'mt-1 font-mono text-[26px] text-cyan' : 'mt-1 font-display text-[38px] leading-tight font-bold text-white'}>{value}</div>
  </div>
)

const AreaRow: React.FC<{ index: number; area: string; detail: string; at: number }> = ({ index, area, detail, at }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = pop(frame, fps, at, 13)
  const flicker = frame >= at && frame < at + 6 && spike(`area-${index}`, frame, 0.45) ? 0.3 : 1

  return (
    <div
      className="flex h-[62px] items-center gap-6 rounded-[12px] bg-white/[0.05] px-6 font-mono ring-1 ring-magenta/30"
      style={{ opacity: Math.min(1, s * 1.4) * flicker, transform: `translateX(${(1 - Math.min(1, s)) * 36}px)` }}
    >
      <span className="text-[20px] font-bold text-magenta">{String(index + 1).padStart(2, '0')}</span>
      <span className="w-[170px] text-[24px] font-bold text-white">{area}</span>
      <span className="text-[18px] font-bold tracking-[0.06em] text-white/50">{detail}</span>
    </div>
  )
}

/** Statement of Work draft: client, target, in-scope areas, sign. */
export const SowCard: React.FC = () => {
  const frame = useCurrentFrame()
  const signAt = atBeat(SIGN_BEAT)
  const signed = frame >= signAt
  const press = signed ? Math.max(0, 1 - (frame - signAt) / 10) : 0

  return (
    <HudPanel title="Statement of Work" meta="Fixed price" accent="magenta" className="w-[780px]">
      <div className="flex flex-col gap-6 px-9 py-8">
        <Field label="Client" value={COPY.scope.client} />
        <Field label="Target" value={COPY.scope.target} mono />
        <div>
          <div className="mb-3 font-mono text-[16px] font-bold tracking-[0.24em] text-white/45 uppercase">In scope</div>
          <div className="flex flex-col gap-3">
            {COPY.scope.areas.map((a, i) => (
              <AreaRow key={a.area} index={i} area={a.area} detail={a.detail} at={atBeat(AREA_BEATS[i])} />
            ))}
          </div>
        </div>
        <div
          className={`mt-2 flex h-[76px] items-center justify-center gap-4 rounded-[14px] font-display text-[30px] font-bold tracking-[0.06em] uppercase ${
            signed ? 'bg-neon text-night shadow-[0_0_60px_-10px_rgba(157,255,60,0.9)]' : 'bg-magenta/15 text-magenta ring-1 ring-magenta/60'
          }`}
          style={{ transform: `scale(${1 - 0.05 * press})` }}
        >
          {signed ? <CheckIcon className="h-[34px] w-[34px] stroke-night" /> : <PenIcon className="h-[30px] w-[30px] stroke-magenta" />}
          {signed ? 'SoW signed' : 'Sign SoW'}
        </div>
      </div>
    </HudPanel>
  )
}
