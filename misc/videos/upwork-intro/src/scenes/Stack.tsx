import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion'
import { ICONS } from '../assets'
import { Reveal } from '../components/Reveal'
import { Wordmark } from '../components/Kicker'
import { pop } from '../lib/anim'
import { COPY, STACK_ICON_BEATS, STACK_RING, atBeat } from '../script'

export const Stack: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  const slot = durationInFrames / COPY.stack.length
  const wordIndex = Math.min(COPY.stack.length - 1, Math.floor(frame / slot))

  return (
    <AbsoluteFill className="bg-[radial-gradient(ellipse_at_50%_48%,#16324f_0%,#0b1220_58%,#070d18_100%)]">
      <div className="absolute top-[180px] left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-brand/30 blur-3xl" />

      {STACK_RING.map((name, i) => {
        const angle = -Math.PI / 2 + (i / STACK_RING.length) * Math.PI * 2
        const s = pop(frame, fps, atBeat(STACK_ICON_BEATS[i]), 12)
        const x = 960 + Math.cos(angle) * 640
        const y = 480 + Math.sin(angle) * 340
        return (
          <Img
            key={name}
            src={ICONS[name]}
            className="absolute h-[84px] w-[84px]"
            style={{ left: x - 42, top: y - 42, opacity: Math.min(1, s), transform: `scale(${s})` }}
          />
        )
      })}

      <AbsoluteFill className="items-center justify-center">
        <div key={wordIndex} className="font-display text-[104px] font-extrabold tracking-[-0.04em] text-white">
          <Reveal line={COPY.stack[wordIndex]} duration={10} />
        </div>
      </AbsoluteFill>

      <Wordmark />
    </AbsoluteFill>
  )
}
