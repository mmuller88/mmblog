import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { CLAMP, pop } from '../lib/anim'
import { spike } from '../lib/glitch'
import { COPY, LOG, LOG_BEATS, MAPPED_BEAT, TYPE_FROM, TYPE_TO, atBeat, type Tone } from '../script'
import { HudPanel } from './HudPanel'
import { CheckIcon, TerminalIcon } from './icons'

const TONE: Record<Tone, string> = { warn: 'text-amber', bad: 'text-hot' }

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="font-mono text-[16px] font-bold tracking-[0.24em] text-white/45 uppercase">{label}</div>
    <div className="mt-1 font-mono text-[26px] text-cyan">{value}</div>
  </div>
)

const LogLine: React.FC<{ step: string; result: string; tone: Tone; at: number }> = ({ step, result, tone, at }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = pop(frame, fps, at, 13)
  const flicker = frame >= at && frame < at + 6 && spike(`log-${step}`, frame, 0.45) ? 0.3 : 1

  return (
    <div
      className="flex items-center gap-4 text-[26px]"
      style={{ opacity: Math.min(1, s * 1.4) * flicker, transform: `translateX(${(1 - Math.min(1, s)) * 36}px)` }}
    >
      <span className="text-white/40">&gt;</span>
      <span className="text-white">{step}</span>
      <span className="h-0 flex-1 border-b-2 border-dotted border-white/20" />
      <span className={`font-bold tracking-[0.12em] uppercase ${TONE[tone]}`}>{result}</span>
    </div>
  )
}

/** The deploy path as it runs today: a hand-typed script and what it skips. */
export const TerminalCard: React.FC = () => {
  const frame = useCurrentFrame()
  const typed = Math.floor(interpolate(frame, [atBeat(TYPE_FROM), atBeat(TYPE_TO)], [0, COPY.map.command.length], CLAMP))
  const caretOn = frame < atBeat(LOG_BEATS[0]) && Math.floor(frame / 6) % 2 === 0
  const mappedAt = atBeat(MAPPED_BEAT)
  const mapped = frame >= mappedAt
  const press = mapped ? Math.max(0, 1 - (frame - mappedAt) / 10) : 0

  return (
    <HudPanel title="Path to prod // As-is" meta="One product line" accent="magenta" className="w-[780px]">
      <div className="flex flex-col gap-6 px-9 py-8">
        <div className="grid grid-cols-2 gap-6">
          <Field label="Repo" value={COPY.map.repo} />
          <Field label="Hosting" value={COPY.map.hosting} />
        </div>
        <div className="flex flex-col gap-3 rounded-[12px] bg-night/80 px-6 py-5 font-mono ring-1 ring-white/10">
          <div className="flex h-[36px] items-center gap-3 text-[26px] text-white">
            <span className="text-magenta">$</span>
            <span>{COPY.map.command.slice(0, typed)}</span>
            <span className={`h-[28px] w-[14px] bg-magenta ${caretOn ? 'opacity-100' : 'opacity-0'}`} />
          </div>
          {LOG.map((line, i) => (
            <LogLine key={line.step} step={line.step} result={line.result} tone={line.tone} at={atBeat(LOG_BEATS[i])} />
          ))}
        </div>
        <div
          className={`mt-2 flex h-[76px] items-center justify-center gap-4 rounded-[14px] font-display text-[30px] font-bold tracking-[0.06em] uppercase ${
            mapped ? 'bg-neon text-night shadow-[0_0_60px_-10px_rgba(157,255,60,0.9)]' : 'bg-magenta/15 text-magenta ring-1 ring-magenta/60'
          }`}
          style={{ transform: `scale(${1 - 0.05 * press})` }}
        >
          {mapped ? <CheckIcon className="h-[34px] w-[34px] stroke-night" /> : <TerminalIcon className="h-[32px] w-[32px] stroke-magenta" />}
          {mapped ? 'Path mapped' : 'Mapping path'}
        </div>
      </div>
    </HudPanel>
  )
}
