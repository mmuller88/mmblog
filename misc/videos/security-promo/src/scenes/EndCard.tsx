import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion'
import { ASSETS } from '../assets'
import { ArrowIcon, ShieldIcon } from '../components/icons'
import { NeonGrid } from '../components/NeonGrid'
import { EASE_IN_OUT, EASE_OUT, pop, progress } from '../lib/anim'
import { COPY, CTA_BEAT, atBeat } from '../script'

const BRACKETS = [
  '-top-4 -left-4 border-t-[4px] border-l-[4px]',
  '-top-4 -right-4 border-t-[4px] border-r-[4px]',
  '-bottom-4 -left-4 border-b-[4px] border-l-[4px]',
  '-bottom-4 -right-4 border-b-[4px] border-r-[4px]',
]

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const ctaAt = atBeat(CTA_BEAT)
  const rise = progress(frame, 0, atBeat(3), EASE_OUT)
  const plate = Math.min(1, pop(frame, fps, 2, 13))
  const byline = progress(frame, atBeat(1), 14)
  const cta = pop(frame, fps, ctaAt, 12)
  const url = progress(frame, ctaAt + 8, 14)
  const sheen = progress(frame, ctaAt + 16, 20, EASE_IN_OUT)
  const nudge = frame > ctaAt + 10 ? 8 * Math.max(0, Math.sin((frame - ctaAt - 10) * 0.25)) : 0

  return (
    <AbsoluteFill className="bg-night">
      <NeonGrid id="end" theme="secure" horizon={940} sun sunRise={0.55 * rise} skyline speed={0.4} />

      <AbsoluteFill className="flex-col items-center pt-[96px]">
        <div className="relative" style={{ opacity: plate, transform: `scale(${0.88 + 0.12 * plate})` }}>
          {BRACKETS.map((b) => (
            <span key={b} className={`absolute h-[44px] w-[44px] border-neon ${b}`} />
          ))}
          <div className="flex items-center gap-10 rounded-[30px] bg-night-2/90 px-14 py-10 ring-1 ring-neon/50 shadow-[0_0_120px_-20px_rgba(157,255,60,0.85)]">
            <ShieldIcon className="h-[150px] w-[150px] fill-neon" />
            <div className="font-display text-[120px] leading-none font-bold tracking-[-0.02em] text-white uppercase [text-shadow:-5px_0_0_#ff2bd6,5px_0_0_#00e5ff,0_0_40px_rgba(157,255,60,0.6)]">
              {COPY.end.title}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-6" style={{ opacity: byline, transform: `translateY(${(1 - byline) * 16}px)` }}>
          <Img src={ASSETS.avatar} className="h-[72px] w-[72px] rounded-full object-cover ring-2 ring-neon" />
          <span className="font-display text-[38px] font-bold text-white">{COPY.end.name}</span>
          <span className="font-mono text-[28px] font-bold text-white/50">·</span>
          <span className="font-mono text-[24px] font-bold tracking-[0.16em] text-neon uppercase">{COPY.end.tagline}</span>
        </div>

        <div
          className="relative mt-10 flex items-center gap-5 overflow-hidden rounded-full bg-[linear-gradient(90deg,#6aa518,#9dff3c)] px-12 py-6 font-display text-[44px] leading-none font-bold text-night shadow-[0_0_70px_-8px_rgba(157,255,60,0.9)]"
          style={{ opacity: Math.min(1, cta * 1.4), transform: `scale(${0.7 + 0.3 * Math.min(1.05, cta)})` }}
        >
          {COPY.end.cta}
          <span style={{ transform: `translateX(${nudge}px)` }}>
            <ArrowIcon className="h-[40px] w-[40px] stroke-night" />
          </span>
          <span
            className="absolute inset-y-0 w-[120px] -skew-x-12 bg-white/45"
            style={{ left: -160 + sheen * 900, opacity: sheen > 0 && sheen < 1 ? 1 : 0 }}
          />
        </div>

        <div
          className="mt-7 flex items-center gap-4 rounded-[12px] bg-night/85 px-7 py-3 font-mono text-[32px] font-bold tracking-[0.1em] text-white ring-1 ring-neon/40"
          style={{ opacity: url }}
        >
          <span className="text-neon">&gt;</span>
          {COPY.end.url}
          <span className={`h-[30px] w-[16px] bg-neon ${Math.floor(frame / 8) % 2 === 0 ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
