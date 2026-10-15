import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { Chip } from '../components/Chip'
import { Flow } from '../components/Flow'
import { Kicker, Wordmark } from '../components/Kicker'
import { NeonGrid } from '../components/NeonGrid'
import { Reveal } from '../components/Reveal'
import { SowCard } from '../components/SowCard'
import { ACCENT_WORD } from '../lib/accent'
import { pop } from '../lib/anim'
import { COPY, FLOW, FLOW_HOPS, atBeat } from '../script'

export const Scope: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const card = Math.min(1, pop(frame, fps, atBeat(1), 15))

  return (
    <AbsoluteFill className="bg-night">
      <NeonGrid id="scope" theme="neutral" horizon={860} speed={0.5} floorOpacity={0.6} />
      <Kicker index={COPY.scope.index} label={COPY.scope.kicker} accent="magenta" />

      <div className="absolute top-[220px] left-[110px] w-[880px] font-display text-[92px] leading-none font-bold tracking-[-0.02em] text-white">
        <Reveal line={COPY.scope.lines[0]} delay={4} />
        <Reveal line={COPY.scope.lines[1]} delay={16} accentDelay={6} accentClassName={ACCENT_WORD.magenta} />
      </div>

      <div className="absolute top-[470px] left-[110px] flex flex-col items-start gap-3">
        {COPY.scope.chips.map((text, i) => (
          <Chip key={text} text={text} delay={atBeat(2) + i * 10} />
        ))}
      </div>

      <div className="absolute top-[150px] left-[1030px]" style={{ opacity: card, transform: `translateX(${(1 - card) * 70}px)` }}>
        <SowCard />
      </div>

      <div className="absolute bottom-[36px] left-0 flex w-full justify-center">
        <Flow nodes={FLOW} hops={FLOW_HOPS} accent="cyan" />
      </div>

      <Wordmark />
    </AbsoluteFill>
  )
}
