import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion'
import { ASSETS } from '../assets'
import { ArrowIcon } from '../components/icons'
import { Reveal } from '../components/Reveal'
import { EASE_IN_OUT, pop, progress } from '../lib/anim'
import { COPY } from '../script'

const STRIPES = ['bg-brand', 'bg-orange', 'bg-steel']

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const avatar = pop(frame, fps, 0, 12)
  const cta = pop(frame, fps, 28, 12)
  const url = progress(frame, 40, 14)
  const sheen = progress(frame, 52, 18, EASE_IN_OUT)
  const nudge = frame > 36 ? 6 * Math.max(0, Math.sin((frame - 36) * 0.22)) : 0

  return (
    <AbsoluteFill className="bg-[radial-gradient(ellipse_at_50%_38%,#ffffff_0%,#f4f1ea_62%,#e4eef3_100%)]">
      <AbsoluteFill className="flex-col items-center pt-[120px]">
        <Img
          src={ASSETS.avatar}
          className="h-[168px] w-[168px] rounded-full object-cover ring-[6px] ring-brand"
          style={{ transform: `scale(${avatar})`, opacity: Math.min(1, avatar * 2) }}
        />
        <div className="mt-5 font-mono text-[26px] font-bold tracking-[0.18em] text-brand-solid uppercase">{COPY.end.name}</div>
        <div className="mt-3 font-display text-[120px] leading-none font-extrabold tracking-[-0.04em] text-ink">
          <Reveal line={COPY.end.headline} delay={8} />
        </div>
        <div className="mt-6 text-center font-mono text-[24px] text-ink/70" style={{ opacity: progress(frame, 18, 14) }}>
          <div>{COPY.end.credential}</div>
          <div className="mt-1">{COPY.end.community}</div>
        </div>

        <div
          className="relative mt-10 flex h-[96px] items-center gap-4 overflow-hidden rounded-full bg-brand-solid px-12 font-display text-[40px] font-bold text-white shadow-[0_24px_50px_-18px_rgba(3,105,161,0.8)]"
          style={{ transform: `scale(${cta})`, opacity: Math.min(1, cta * 2) }}
        >
          {COPY.end.cta}
          <span style={{ transform: `translateX(${nudge}px)` }}>
            <ArrowIcon className="h-[40px] w-[40px] stroke-white" />
          </span>
          <span
            className="absolute inset-y-0 w-[120px] -skew-x-[20deg] bg-white/35"
            style={{ left: `${-20 + sheen * 130}%`, opacity: sheen > 0 && sheen < 1 ? 1 : 0 }}
          />
        </div>

        <div className="mt-6 font-mono text-[36px] font-bold tracking-[0.04em] text-brand-solid" style={{ opacity: url, transform: `translateY(${(1 - url) * 14}px)` }}>
          {COPY.end.url}
        </div>
      </AbsoluteFill>

      <div className="absolute inset-x-0 bottom-0 flex flex-col">
        {STRIPES.map((color, i) => (
          <span key={color} className={`h-[12px] origin-left ${color}`} style={{ transform: `scaleX(${progress(frame, 6 + i * 3, 20)})` }} />
        ))}
      </div>
    </AbsoluteFill>
  )
}
