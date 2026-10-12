import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion'
import { ASSETS } from '../assets'
import { ArchFlow } from '../components/ArchFlow'
import { Chip } from '../components/Chip'
import { Kicker, Wordmark } from '../components/Kicker'
import { Reveal } from '../components/Reveal'
import { pop } from '../lib/anim'
import { COPY, FLOW_HOPS, FLOWS, atBeat } from '../script'

const ACCENT = 'font-serif text-[1.12em] leading-none font-normal tracking-normal text-amber-200 italic'

export const Cyquins: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const card = pop(frame, fps, atBeat(1), 14)

  return (
    <AbsoluteFill className="bg-[radial-gradient(ellipse_at_22%_35%,#2a1a0a_0%,#0b1220_52%,#070d18_100%)]">
      <Kicker
        index={COPY.cyquins.index}
        label={COPY.cyquins.label}
        mark={ASSETS.prowler}
        markSecondary={ASSETS.hdi}
        context={COPY.cyquins.context}
      />

      <div className="absolute top-[230px] left-[110px] w-[900px] font-display text-[68px] leading-[0.98] font-extrabold tracking-[-0.03em] text-white">
        <Reveal line={COPY.cyquins.lines[0]} delay={4} />
        <Reveal line={COPY.cyquins.lines[1]} delay={16} accentDelay={6} accentClassName={ACCENT} />
      </div>

      <div className="absolute top-[480px] left-[110px] flex flex-col items-start gap-3">
        {COPY.cyquins.chips.map((text, i) => (
          <Chip key={text} text={text} delay={atBeat(2) + i * 10} />
        ))}
      </div>

      <div
        className="absolute top-[160px] left-[1040px] w-[760px] rounded-[24px] bg-[#0a1528] p-8 ring-1 ring-amber-400/25 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)]"
        style={{ opacity: Math.min(1, card), transform: `translateX(${(1 - Math.min(1, card)) * 60}px)` }}
      >
        <div className="mb-6 font-mono text-[18px] font-bold tracking-[0.2em] text-amber-300/90 uppercase">Assessment flow</div>
        <div className="flex flex-col gap-4 font-mono text-[22px] text-white/85">
          {['Broker invites client', 'Questionnaire + cloud connect', 'Prowler scan → HDI score', 'Policy-ready report'].map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[16px] font-bold text-amber-200">
                {i + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-5 border-t border-white/10 pt-6">
          <Img src={ASSETS.hdi} className="h-[36px] w-auto opacity-95" />
          <span className="font-mono text-[16px] tracking-wide text-white/45">×</span>
          <Img src={ASSETS.prowler} className="h-[40px] w-auto" />
        </div>
      </div>

      <div className="absolute bottom-[28px] left-0 flex w-full justify-center">
        <ArchFlow nodes={FLOWS.cyquins} hops={FLOW_HOPS.cyquins} accent="#fbbf24" />
      </div>

      <Wordmark />
    </AbsoluteFill>
  )
}
