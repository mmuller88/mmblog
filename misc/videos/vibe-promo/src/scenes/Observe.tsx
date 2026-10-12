import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { Kicker, Wordmark } from '../components/Kicker'
import { Reveal } from '../components/Reveal'
import { CheckIcon } from '../components/icons'
import { EASE_OUT, pop, progress } from '../lib/anim'
import { AGENT_BEATS, BEAM_FROM, BEAM_TO, COPY, atBeat } from '../script'

const ACCENT = 'font-serif text-[1.14em] leading-none font-normal tracking-normal text-signal italic'

const BARS = [
  [40, 70, 55, 88, 62],
  [30, 48, 36, 72, 44],
  [22, 60, 34, 80, 28],
]

export const Observe: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const beam = progress(frame, atBeat(BEAM_FROM), atBeat(BEAM_TO - BEAM_FROM), EASE_OUT)
  const ask = pop(frame, fps, atBeat(1), 12)

  return (
    <AbsoluteFill className="bg-[radial-gradient(ellipse_at_28%_70%,#12302a_0%,#0b1220_55%,#070d18_100%)]">
      <Kicker index={COPY.observe.index} label={COPY.observe.kicker} />

      <div className="absolute top-[180px] left-[110px] w-[1700px] font-display text-[72px] leading-[0.98] font-extrabold tracking-[-0.03em] text-white">
        <Reveal line={COPY.observe.lines[0]} delay={4} />
        <Reveal line={COPY.observe.lines[1]} delay={16} accentDelay={6} accentClassName={ACCENT} />
      </div>

      <div
        className="absolute top-[460px] left-[110px] w-[860px] overflow-hidden rounded-[28px] bg-[#07111f] ring-1 ring-white/10"
        style={{ opacity: Math.min(1, ask * 1.4), transform: `translateY(${(1 - Math.min(1, ask)) * 24}px)` }}
      >
        <div className="border-b border-white/10 px-8 py-4 font-mono text-[18px] tracking-[0.14em] text-white/45">AI AGENTS</div>
        <div className="px-8 py-6 font-mono text-[28px] text-white">
          <span className="mr-3 text-emerald">›</span>
          {COPY.observe.ask}
        </div>
        <div className="flex flex-col gap-3 px-8 pb-7">
          {COPY.observe.tools.map((tool, i) => {
            const s = pop(frame, fps, atBeat(AGENT_BEATS[i]), 12)
            if (s <= 0.01) return null
            return (
              <div key={tool.name} className="flex items-center gap-4" style={{ opacity: Math.min(1, s * 1.5), transform: `translateX(${(1 - Math.min(1, s)) * 20}px)` }}>
                <CheckIcon className="h-[26px] w-[26px] stroke-emerald" />
                <span className="font-mono text-[26px] font-bold text-white">{tool.name}</span>
                <span className="font-mono text-[22px] text-white/50">{tool.detail}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="absolute top-[460px] right-[90px] flex w-[780px] gap-4">
        {COPY.observe.panels.map((label, panel) => {
          const s = pop(frame, fps, atBeat(1) + panel * 6, 12)
          return (
            <div
              key={label}
              className="relative h-[430px] flex-1 overflow-hidden rounded-[24px] bg-white/10 ring-1 ring-white/10"
              style={{ opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - Math.min(1, s)) * 24}px)` }}
            >
              <div className="px-5 pt-5 font-mono text-[18px] font-bold tracking-[0.14em] text-white/70">{label}</div>
              <div className="absolute right-4 bottom-6 left-4 flex h-[280px] items-end gap-2">
                {BARS[panel].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-brand" style={{ height: `${h * Math.min(1, s)}%`, opacity: 0.45 + (i / BARS[panel].length) * 0.55 }} />
                ))}
              </div>
              <div className="absolute inset-y-0 w-[3px] bg-signal shadow-[0_0_18px_4px_rgba(213,12,45,0.8)]" style={{ left: `${beam * 100}%`, opacity: beam > 0 && beam < 1 ? 1 : 0 }} />
            </div>
          )
        })}
      </div>

      <Wordmark />
    </AbsoluteFill>
  )
}
