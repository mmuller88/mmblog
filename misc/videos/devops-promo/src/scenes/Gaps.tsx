import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { EnvDrift } from '../components/EnvDrift'
import { GAP_ROW_HEIGHT, GapRow } from '../components/GapRow'
import { HudPanel } from '../components/HudPanel'
import { CheckIcon } from '../components/icons'
import { Kicker, Wordmark } from '../components/Kicker'
import { NeonGrid } from '../components/NeonGrid'
import { Reveal } from '../components/Reveal'
import { ACCENT_WORD } from '../lib/accent'
import { EASE_IN_OUT, pop, progress } from '../lib/anim'
import { BEAM_FROM, BEAM_TO, CHECK_BEATS, CHECKS, COPY, READY_BEAT, atBeat } from '../script'

const ROW_GAP = 16
const BEAM_H = 110

export const Gaps: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const panel = Math.min(1, pop(frame, fps, 6, 16))
  const beamFrom = atBeat(BEAM_FROM)
  const beamTo = atBeat(BEAM_TO)
  const sweep = progress(frame, beamFrom, beamTo - beamFrom, EASE_IN_OUT)
  const ready = Math.min(1, pop(frame, fps, atBeat(READY_BEAT), 12))
  const analyzing = frame >= beamFrom && frame < beamTo
  const status = frame < beamFrom ? 'Queued' : analyzing ? 'Analyzing' : 'Complete'
  const beamY = interpolate(
    frame,
    [atBeat(CHECK_BEATS[0]), atBeat(CHECK_BEATS[CHECK_BEATS.length - 1])],
    [0, (CHECK_BEATS.length - 1) * (GAP_ROW_HEIGHT + ROW_GAP)],
  )

  return (
    <AbsoluteFill className="bg-night">
      <NeonGrid id="gaps" theme="neutral" horizon={860} speed={0.9} floorOpacity={0.55} />
      <Kicker index={COPY.gaps.index} label={COPY.gaps.kicker} accent="cyan" />

      <div className="absolute top-[220px] left-[110px] w-[900px] font-display text-[92px] leading-none font-bold tracking-[-0.02em] text-white">
        <Reveal line={COPY.gaps.lines[0]} delay={4} />
        <Reveal line={COPY.gaps.lines[1]} delay={16} accentDelay={6} accentClassName={ACCENT_WORD.cyan} />
      </div>

      <div className="absolute top-[480px] left-[110px]">
        <EnvDrift />
      </div>

      <div className="absolute top-[150px] left-[1030px]" style={{ opacity: panel, transform: `translateX(${(1 - panel) * 70}px)` }}>
        <HudPanel title="Gap analysis // Live" meta="Repos · CI · hosting" accent="cyan" className="w-[780px]">
          <div className="px-8 py-7">
            <div className="font-mono text-[18px] font-bold tracking-[0.22em] uppercase">
              <span className={frame >= beamTo ? 'text-neon' : 'text-cyan'}>{status}</span>
            </div>
            <div className="mt-3 h-[10px] overflow-hidden rounded-full bg-white/10">
              <div className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#ff2bd6,#00e5ff)]" style={{ transform: `scaleX(${sweep})` }} />
            </div>

            <div className="relative mt-8 flex flex-col" style={{ gap: ROW_GAP }}>
              {CHECKS.map((c, i) => (
                <GapRow key={c.area} area={c.area} ok={c.ok} note={c.note} at={atBeat(CHECK_BEATS[i])} checking={analyzing} />
              ))}
              <div
                className="pointer-events-none absolute inset-x-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,229,255,0.4),transparent)]"
                style={{ height: BEAM_H, top: beamY + GAP_ROW_HEIGHT / 2 - BEAM_H / 2, opacity: analyzing ? 1 : 0 }}
              />
            </div>

            <div
              className="mt-8 flex h-[84px] items-center justify-center gap-4 rounded-[14px] bg-neon/15 font-display text-[32px] font-bold tracking-[0.08em] text-neon uppercase ring-1 ring-neon/60"
              style={{ opacity: ready, transform: `scale(${0.8 + 0.2 * ready})` }}
            >
              <CheckIcon className="h-[36px] w-[36px] stroke-neon" />
              Gap analysis ready
            </div>
          </div>
        </HudPanel>
      </div>

      <Wordmark />
    </AbsoluteFill>
  )
}
