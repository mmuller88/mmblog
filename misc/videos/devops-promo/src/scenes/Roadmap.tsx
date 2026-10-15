import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { ChromaticGlitch } from '../components/ChromaticGlitch'
import { BoxIcon, ChartIcon, CheckIcon, FlaskIcon, RocketIcon } from '../components/icons'
import { Kicker, Wordmark } from '../components/Kicker'
import { NeonGrid } from '../components/NeonGrid'
import { Reveal } from '../components/Reveal'
import { RoadmapBoard } from '../components/RoadmapBoard'
import { ACCENT_WORD } from '../lib/accent'
import { pop } from '../lib/anim'
import { burst } from '../lib/glitch'
import { CARD_BEATS, COPY, GREEN_BEAT, STAGE_BEATS, STAGES, atBeat, type StageId } from '../script'

const STAGE_ICONS: Record<StageId, React.FC<{ className?: string }>> = {
  build: BoxIcon,
  test: FlaskIcon,
  deploy: RocketIcon,
  observe: ChartIcon,
}

const TILE_W = 190
const TILE_GAP = 20

const StageTile: React.FC<{ id: StageId; label: string; index: number; at: number }> = ({ id, label, index, at }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const enter = pop(frame, fps, 8 + index * 3, 14)
  const tick = Math.min(1, pop(frame, fps, at, 10))
  const on = frame >= at
  const pulse = on ? Math.max(0, 1 - (frame - at) / 12) : 0
  const Icon = STAGE_ICONS[id]

  return (
    <div
      className="relative flex w-[190px] flex-col items-center gap-4"
      style={{ opacity: Math.min(1, enter * 1.4), transform: `translateY(${(1 - Math.min(1, enter)) * 30}px)` }}
    >
      <div
        className={`grid h-[150px] w-[150px] place-items-center rounded-[26px] p-8 ring-4 ${
          on ? 'bg-night-2 ring-neon shadow-[0_0_50px_-4px_rgba(157,255,60,0.85)]' : 'bg-night-2 ring-white/10'
        }`}
        style={{ transform: `scale(${1 + 0.08 * pulse})` }}
      >
        <Icon className={`h-full w-full ${on ? 'stroke-neon' : 'stroke-white/35'}`} />
      </div>
      <div className={`font-mono text-[18px] font-bold tracking-[0.1em] ${on ? 'text-white' : 'text-white/45'}`}>{label}</div>
      <div
        className="flex h-[34px] items-center gap-2 rounded-full bg-neon/15 px-4 font-mono text-[14px] font-bold tracking-[0.18em] text-neon ring-1 ring-neon/50"
        style={{ opacity: tick, transform: `scale(${0.6 + 0.4 * tick})` }}
      >
        <CheckIcon className="h-[14px] w-[14px] stroke-neon" />
        PASSED
      </div>
    </div>
  )
}

/** Build → Test → Deploy → Observe, lighting green one stage per cue. */
const Pipeline: React.FC = () => {
  const frame = useCurrentFrame()
  const lit = STAGE_BEATS.reduce((n, b) => (frame >= atBeat(b) ? n + 1 : n), 0)
  const rail = (STAGES.length - 1) * (TILE_W + TILE_GAP)

  return (
    <div className="relative flex" style={{ gap: TILE_GAP }}>
      <div className="absolute top-[73px] h-[4px] bg-white/15" style={{ left: TILE_W / 2, width: rail }} />
      <div
        className="absolute top-[73px] h-[4px] origin-left bg-neon shadow-[0_0_18px_rgba(157,255,60,0.9)]"
        style={{ left: TILE_W / 2, width: rail, transform: `scaleX(${Math.max(0, lit - 1) / (STAGES.length - 1)})` }}
      />
      {STAGES.map((s, i) => (
        <StageTile key={s.id} id={s.id} label={s.label} index={i} at={atBeat(STAGE_BEATS[i])} />
      ))}
    </div>
  )
}

export const Roadmap: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const land = atBeat(CARD_BEATS[0])
  const panel = Math.min(1, pop(frame, fps, 6, 16))
  const green = Math.min(1, pop(frame, fps, atBeat(GREEN_BEAT), 12))

  return (
    <AbsoluteFill className="bg-night">
      <NeonGrid id="roadmap" theme="neutral" horizon={860} speed={0.9} floorOpacity={0.55} />
      <Kicker index={COPY.roadmap.index} label={COPY.roadmap.kicker} accent="green" />

      <div className="absolute top-[220px] left-[110px] w-[880px] font-display text-[92px] leading-none font-bold tracking-[-0.02em] text-white">
        <Reveal line={COPY.roadmap.lines[0]} delay={4} />
        <Reveal line={COPY.roadmap.lines[1]} delay={16} accentDelay={6} accentClassName={ACCENT_WORD.green} />
      </div>

      <div className="absolute top-[480px] left-[110px]">
        <Pipeline />
      </div>

      <div
        className="absolute top-[770px] left-[110px] flex h-[84px] w-[820px] items-center justify-center gap-4 rounded-[14px] bg-neon font-display text-[32px] font-bold tracking-[0.08em] text-night uppercase shadow-[0_0_60px_-6px_rgba(157,255,60,0.85)]"
        style={{ opacity: green, transform: `scale(${0.8 + 0.2 * green})` }}
      >
        <CheckIcon className="h-[36px] w-[36px] stroke-night" />
        All green
      </div>

      <ChromaticGlitch id="roadmap-glitch" amount={burst(frame, land, 10)} seed={frame}>
        <div className="absolute top-[200px] left-[1030px]" style={{ opacity: panel, transform: `translateX(${(1 - panel) * 70}px)` }}>
          <RoadmapBoard />
        </div>
      </ChromaticGlitch>

      <Wordmark />
    </AbsoluteFill>
  )
}
