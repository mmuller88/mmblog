import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { ChromaticGlitch } from '../components/ChromaticGlitch'
import { BellIcon, ChartIcon, CloudIcon, PipelineIcon, RocketIcon, RollbackIcon, ServerIcon, TerminalIcon } from '../components/icons'
import { Wordmark } from '../components/Kicker'
import { NeonGrid } from '../components/NeonGrid'
import { Reveal } from '../components/Reveal'
import { ACCENT_WORD } from '../lib/accent'
import { pop } from '../lib/anim'
import { burst } from '../lib/glitch'
import { COPY, STACK_ICON_BEATS, STACK_RING, STACK_TAIL_BEAT, STACK_WORD_BEATS, atBeat } from '../script'

const RX = 760
const RY = 400
const CX = 960
const CY = 540

const RING_ICONS: Record<(typeof STACK_RING)[number], React.FC<{ className?: string }>> = {
  pipeline: PipelineIcon,
  terminal: TerminalIcon,
  rollback: RollbackIcon,
  bell: BellIcon,
  server: ServerIcon,
  chart: ChartIcon,
  cloud: CloudIcon,
  rocket: RocketIcon,
}

const RingIcon: React.FC<{ icon: (typeof STACK_RING)[number]; secure: boolean }> = ({ icon, secure }) => {
  const Icon = RING_ICONS[icon]
  return <Icon className={`h-full w-full ${secure ? 'stroke-neon' : 'stroke-cyan'}`} />
}

const RingTile: React.FC<{ icon: (typeof STACK_RING)[number]; index: number; secure: boolean }> = ({ icon, index, secure }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = pop(frame, fps, atBeat(STACK_ICON_BEATS[index]), 11)
  const angle = ((-67.5 + index * 45) * Math.PI) / 180
  const bob = Math.sin(frame * 0.12 + index) * 6

  return (
    <div
      className={`absolute grid h-[104px] w-[104px] place-items-center rounded-[24px] bg-night-2/90 p-6 ring-2 ${
        secure ? 'shadow-[0_0_40px_-6px_rgba(157,255,60,0.8)] ring-neon/70' : 'shadow-[0_0_40px_-6px_rgba(0,229,255,0.75)] ring-cyan/70'
      }`}
      style={{
        left: CX + RX * Math.cos(angle) - 52,
        top: CY + RY * Math.sin(angle) - 52 + bob,
        opacity: Math.min(1, s * 1.5),
        transform: `scale(${Math.min(1.15, s)})`,
      }}
    >
      <RingIcon icon={icon} secure={secure} />
    </div>
  )
}

export const Stack: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const tailAt = atBeat(STACK_TAIL_BEAT)
  const tail = frame >= tailAt
  const word = tail ? -1 : STACK_WORD_BEATS.reduce((found, b, i) => (frame >= atBeat(b) ? i : found), -1)
  const hitAt = tail ? tailAt : atBeat(STACK_WORD_BEATS[Math.max(0, word)])
  const slam = pop(frame, fps, hitAt, 12)
  const flash = Math.max(0, 1 - (frame - hitAt) / 4)
  const pulse = 1 - (frame % atBeat(1)) / atBeat(1)

  return (
    <AbsoluteFill className="bg-night">
      <NeonGrid id="stack" theme={tail ? 'secure' : 'threat'} horizon={720} speed={2} />
      <div
        className={`absolute top-1/2 left-1/2 h-[900px] w-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-full ${
          tail ? 'bg-[radial-gradient(closest-side,rgba(157,255,60,0.32),transparent)]' : 'bg-[radial-gradient(closest-side,rgba(255,43,214,0.32),transparent)]'
        }`}
        style={{ opacity: 0.8 + 0.2 * pulse }}
      />

      {STACK_RING.map((icon, i) => (
        <RingTile key={icon} icon={icon} index={i} secure={tail} />
      ))}

      <ChromaticGlitch id="stack-glitch" amount={burst(frame, hitAt, 6)} seed={frame}>
        <AbsoluteFill className="items-center justify-center">
          {word >= 0 ? (
            <div
              className="font-display text-[230px] leading-none font-bold tracking-[-0.02em] text-white uppercase [text-shadow:-7px_0_0_#ff2bd6,7px_0_0_#00e5ff,0_0_50px_rgba(255,43,214,0.75)]"
              style={{ transform: `scale(${1.35 - 0.35 * Math.min(1, slam)})` }}
            >
              {COPY.stack[word]}
            </div>
          ) : (
            <div className="font-display text-[96px] leading-none font-bold tracking-[-0.02em] text-white">
              <Reveal line={COPY.stackTail} delay={tailAt} duration={12} stagger={2} accentDelay={4} accentClassName={ACCENT_WORD.green} />
            </div>
          )}
        </AbsoluteFill>
      </ChromaticGlitch>

      <AbsoluteFill className="bg-white" style={{ opacity: 0.22 * flash }} />
      <Wordmark />
    </AbsoluteFill>
  )
}
