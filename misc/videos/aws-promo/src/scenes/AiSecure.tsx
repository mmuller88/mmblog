import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion'
import { ASSETS } from '../assets'
import { ArchFlow } from '../components/ArchFlow'
import { BrowserFrame } from '../components/BrowserFrame'
import { Chip } from '../components/Chip'
import { Kicker, Wordmark } from '../components/Kicker'
import { Reveal } from '../components/Reveal'
import { EASE_IN_OUT, pop, progress } from '../lib/anim'
import { COPY, FLOW_HOPS, FLOWS, REPORT_BEAT, SCAN_FROM, SCAN_TO, atBeat } from '../script'

const ACCENT = 'font-serif text-[1.12em] leading-none font-normal tracking-normal text-cyan italic'

export const AiSecure: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const beam = progress(frame, atBeat(SCAN_FROM), atBeat(SCAN_TO - SCAN_FROM), EASE_IN_OUT)
  const report = pop(frame, fps, atBeat(REPORT_BEAT), 15)
  const shot = pop(frame, fps, 4, 16)

  return (
    <AbsoluteFill className="bg-[radial-gradient(ellipse_at_80%_30%,#0e3a38_0%,#0b1220_48%,#070d18_100%)]">
      <Kicker
        index={COPY.aisecure.index}
        label={COPY.aisecure.label}
        mark={ASSETS.aiSecure}
        context={COPY.aisecure.context}
      />

      <div className="absolute top-[226px] left-[100px] w-[860px] font-display text-[68px] leading-[0.98] font-extrabold tracking-[-0.03em] text-white">
        <Reveal line={COPY.aisecure.lines[0]} delay={4} />
        <Reveal line={COPY.aisecure.lines[1]} delay={16} accentDelay={6} accentClassName={ACCENT} />
      </div>

      <div className="absolute top-[476px] left-[100px] flex flex-col items-start gap-3">
        {COPY.aisecure.chips.map((text, i) => (
          <Chip key={text} text={text} delay={atBeat(2) + i * 10} />
        ))}
      </div>

      <div
        className="absolute top-[150px] left-[1000px]"
        style={{ opacity: Math.min(1, shot), transform: `translateX(${(1 - Math.min(1, shot)) * 80}px)` }}
      >
        <BrowserFrame url="ai-secure.dev" className="h-[620px] w-[820px]">
          <Img src={ASSETS.scanProgress} className="absolute inset-0 h-full w-full object-cover object-top" />
          <div
            className="absolute right-0 left-0 h-[90px]"
            style={{
              top: `${beam * 88}%`,
              background: 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.45), transparent)',
              opacity: beam > 0 && beam < 1 ? 1 : 0,
            }}
          />
          <Img
            src={ASSETS.scanReport}
            className="absolute inset-0 h-full w-full object-cover object-top"
            style={{ transform: `translateX(${(1 - Math.min(1, report)) * 100}%)` }}
          />
        </BrowserFrame>
      </div>

      <div className="absolute bottom-[28px] left-0 flex w-full justify-center">
        <ArchFlow nodes={FLOWS.aisecure} hops={FLOW_HOPS.aisecure} accent="#22d3ee" />
      </div>

      <Wordmark />
    </AbsoluteFill>
  )
}
