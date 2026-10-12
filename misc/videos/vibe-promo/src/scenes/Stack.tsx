import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { Glyph, type GlyphName } from '../components/Glyph'
import { Reveal } from '../components/Reveal'
import { Wordmark } from '../components/Kicker'
import { pop } from '../lib/anim'
import { COPY, STACK_ICON_BEATS, STACK_RING, STACK_TAIL_BEAT, STACK_WORD_BEATS, atBeat } from '../script'

const ACCENT = 'font-serif text-[1.16em] leading-none font-normal tracking-normal text-signal italic'

export const Stack: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  let wordIndex = -1
  for (let i = 0; i < STACK_WORD_BEATS.length; i++) {
    if (frame >= atBeat(STACK_WORD_BEATS[i]) && frame < atBeat(STACK_TAIL_BEAT)) wordIndex = i
  }
  const tail = frame >= atBeat(STACK_TAIL_BEAT)
  const flash = 1 - (frame % 15) / 15

  return (
    <AbsoluteFill className="bg-[radial-gradient(ellipse_at_50%_48%,#3a1020_0%,#0b1220_58%,#070d18_100%)]">
      <div
        className="absolute top-[180px] left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-signal/25 blur-3xl"
        style={{ opacity: 0.35 + (tail ? 0 : 0.35 * flash) }}
      />

      {STACK_RING.map((name, i) => {
        const angle = -Math.PI / 2 + (i / STACK_RING.length) * Math.PI * 2
        const s = pop(frame, fps, atBeat(STACK_ICON_BEATS[i]), 12)
        const x = 960 + Math.cos(angle) * 640
        const y = 520 + Math.sin(angle) * 360
        return (
          <div key={name} className="absolute" style={{ left: x - 42, top: y - 42, opacity: Math.min(1, s), transform: `scale(${s})` }}>
            <Glyph name={name as GlyphName} className="h-[84px] w-[84px]" />
          </div>
        )
      })}

      <AbsoluteFill className="items-center justify-center">
        {wordIndex >= 0 ? (
          <div className="font-display text-[104px] font-extrabold tracking-[-0.04em] text-white">
            <Reveal line={COPY.stack[wordIndex]} delay={atBeat(STACK_WORD_BEATS[wordIndex])} duration={10} />
          </div>
        ) : null}
        {tail ? (
          <div className="font-display text-[88px] font-extrabold tracking-[-0.04em] text-white">
            <Reveal line={COPY.stackTail} delay={atBeat(STACK_TAIL_BEAT)} duration={12} accentDelay={4} accentClassName={ACCENT} />
          </div>
        ) : null}
      </AbsoluteFill>

      <Wordmark />
    </AbsoluteFill>
  )
}
