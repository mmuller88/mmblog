import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { Wordmark } from '../components/Kicker'
import { Reveal } from '../components/Reveal'
import { CheckIcon } from '../components/icons'
import { pop } from '../lib/anim'
import { COPY } from '../script'

const ACCENT = 'font-serif text-[1.14em] leading-none font-normal tracking-normal text-orange italic'

export const Handover: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  return (
    <AbsoluteFill className="bg-[radial-gradient(ellipse_at_30%_40%,#16324f_0%,#0b1220_55%,#070d18_100%)]">
      <div className="absolute top-[180px] left-[150px] w-[1600px] font-display text-[72px] leading-[1.02] font-extrabold tracking-[-0.03em] text-white">
        <Reveal line={COPY.handover.title} delay={4} accentDelay={4} accentClassName={ACCENT} />
      </div>
      <div className="absolute top-[420px] left-[150px] flex flex-col gap-7">
        {COPY.handover.items.map((text, i) => {
          const at = Math.round(((i + 0.2) / COPY.handover.items.length) * (durationInFrames - 12))
          const s = pop(frame, fps, at, 14)
          return (
            <div
              key={text}
              className="flex items-center gap-6"
              style={{ opacity: Math.min(1, s * 1.4), transform: `translateX(${(1 - Math.min(1, s)) * 28}px)` }}
            >
              <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-emerald/15 ring-2 ring-emerald">
                <CheckIcon className="h-[36px] w-[36px] stroke-emerald" />
              </span>
              <span className="font-display text-[52px] font-bold text-white">{text}</span>
            </div>
          )
        })}
      </div>
      <Wordmark />
    </AbsoluteFill>
  )
}
