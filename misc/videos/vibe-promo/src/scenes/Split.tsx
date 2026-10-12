import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { Chip } from '../components/Chip'
import { Kicker, Wordmark } from '../components/Kicker'
import { Reveal } from '../components/Reveal'
import { pop } from '../lib/anim'
import { COPY, SPLIT_BEAT, atBeat } from '../script'

const ACCENT = 'font-serif text-[1.14em] leading-none font-normal tracking-normal text-signal italic'

const Card: React.FC<{ title: string; host: string; detail: string; at: number; live?: boolean }> = ({ title, host, detail, at, live = false }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = pop(frame, fps, at, 14)
  return (
    <div
      className={`w-[760px] rounded-[28px] px-10 py-8 ring-1 ${live ? 'bg-white text-ink ring-white shadow-[0_30px_80px_-30px_rgba(213,12,45,0.7)]' : 'bg-white/10 text-white ring-white/15'}`}
      style={{ opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - Math.min(1, s)) * 28}px) scale(${0.96 + 0.04 * Math.min(1, s)})` }}
    >
      <div className={`font-mono text-[18px] font-bold tracking-[0.22em] ${live ? 'text-signal' : 'text-white/50'}`}>{title}</div>
      <div className="mt-3 font-display text-[40px] leading-none font-extrabold tracking-[-0.03em]">{host}</div>
      <div className={`mt-3 font-mono text-[22px] ${live ? 'text-ink/60' : 'text-white/55'}`}>{detail}</div>
    </div>
  )
}

export const Split: React.FC = () => (
  <AbsoluteFill className="bg-[radial-gradient(ellipse_at_78%_40%,#3a1020_0%,#0b1220_55%,#070d18_100%)]">
    <Kicker index={COPY.split.index} label={COPY.split.kicker} />

    <div className="absolute top-[210px] left-[110px] w-[880px] font-display text-[68px] leading-[0.98] font-extrabold tracking-[-0.03em] text-white">
      <Reveal line={COPY.split.lines[0]} delay={4} />
      <Reveal line={COPY.split.lines[1]} delay={16} accentDelay={6} accentClassName={ACCENT} />
    </div>

    <div className="absolute top-[500px] left-[110px] flex gap-4">
      {COPY.split.chips.map((text, i) => (
        <Chip key={text} text={text} delay={atBeat(4) + i * 8} />
      ))}
    </div>

    <div className="absolute top-[240px] right-[90px] flex flex-col gap-6">
      <Card title={COPY.split.dev.title} host={COPY.split.dev.host} detail={COPY.split.dev.detail} at={atBeat(1)} />
      <Card title={COPY.split.prod.title} host={COPY.split.prod.host} detail={COPY.split.prod.detail} at={atBeat(SPLIT_BEAT)} live />
    </div>

    <Wordmark />
  </AbsoluteFill>
)
