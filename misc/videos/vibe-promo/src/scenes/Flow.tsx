import { AbsoluteFill } from 'remotion'
import { ArchFlow } from '../components/ArchFlow'
import { Chip } from '../components/Chip'
import { Kicker, Wordmark } from '../components/Kicker'
import { Reveal } from '../components/Reveal'
import { COPY, FLOW_HOPS, FLOWS, atBeat } from '../script'

const ACCENT = 'font-serif text-[1.14em] leading-none font-normal tracking-normal text-signal italic'

export const Flow: React.FC = () => (
  <AbsoluteFill className="bg-[radial-gradient(ellipse_at_50%_30%,#14304f_0%,#0b1220_58%,#070d18_100%)]">
    <Kicker index={COPY.flow.index} label={COPY.flow.kicker} />

    <AbsoluteFill className="items-center pt-[280px]">
      <div className="w-[1500px] text-center font-display text-[84px] leading-[0.98] font-extrabold tracking-[-0.03em] text-white">
        <Reveal line={COPY.flow.lines[0]} delay={4} />
        <Reveal line={COPY.flow.lines[1]} delay={16} accentDelay={6} accentClassName={ACCENT} />
      </div>
      <div className="mt-8 flex gap-4">
        {COPY.flow.chips.map((text, i) => (
          <Chip key={text} text={text} delay={atBeat(2) + i * 8} />
        ))}
      </div>
    </AbsoluteFill>

    <div className="absolute bottom-[90px] left-0 flex w-full justify-center">
      <ArchFlow nodes={FLOWS.flow} hops={FLOW_HOPS.flow} accent="#d50c2d" />
    </div>

    <Wordmark />
  </AbsoluteFill>
)
