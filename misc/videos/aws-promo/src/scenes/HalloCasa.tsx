import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { ArchFlow } from '../components/ArchFlow'
import { Chip } from '../components/Chip'
import { Globe } from '../components/Globe'
import { Kicker, Wordmark } from '../components/Kicker'
import { Reveal } from '../components/Reveal'
import { ASSETS } from '../assets'
import { BUYERS, COPY, FLOW_HOPS, FLOWS, REGION, atBeat } from '../script'

const ACCENT = 'font-serif text-[1.14em] leading-none font-normal tracking-normal text-coral italic'

export const HalloCasa: React.FC = () => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const lon0 = interpolate(frame, [0, durationInFrames], [-40, -18])

  return (
    <AbsoluteFill className="bg-[radial-gradient(ellipse_at_72%_42%,#14304f_0%,#0b1220_55%,#070d18_100%)]">
      <Kicker index={COPY.hallocasa.index} label={COPY.hallocasa.kicker} mark={ASSETS.hallocasa} />

      <div className="absolute top-[220px] left-[110px] w-[900px] font-display text-[78px] leading-[0.98] font-extrabold tracking-[-0.03em] text-white">
        <Reveal line={COPY.hallocasa.lines[0]} delay={4} />
        <Reveal line={COPY.hallocasa.lines[1]} delay={16} accentDelay={6} accentClassName={ACCENT} />
      </div>

      <div className="absolute top-[500px] left-[110px] flex gap-4">
        {COPY.hallocasa.chips.map((text, i) => (
          <Chip key={text} text={text} delay={atBeat(2) + i * 8} />
        ))}
      </div>

      <Globe
        id="hc-globe"
        cx={1470}
        cy={390}
        r={230}
        lon0={lon0}
        lat0={18}
        home={{ city: REGION, at: atBeat(1), label: 'us-east-1' }}
        pins={BUYERS.map((city, i) => ({ city, at: atBeat(2) + i * 10 }))}
      />

      <div className="absolute bottom-[36px] left-0 flex w-full justify-center">
        <ArchFlow nodes={FLOWS.hallocasa} hops={FLOW_HOPS.hallocasa} />
      </div>

      <Wordmark />
    </AbsoluteFill>
  )
}
