import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion'
import { ASSETS } from '../assets'
import { FindingRow } from '../components/FindingRow'
import { HudPanel } from '../components/HudPanel'
import { CheckIcon } from '../components/icons'
import { Kicker, Wordmark } from '../components/Kicker'
import { NeonGrid } from '../components/NeonGrid'
import { Reveal } from '../components/Reveal'
import { SurfaceTile } from '../components/SurfaceTile'
import { ACCENT_WORD } from '../lib/accent'
import { EASE_IN_OUT, pop, progress } from '../lib/anim'
import { BEAM_FROM, BEAM_TO, CHECKS, COPY, FINDING_BEATS, FINDINGS, REPORT_BEAT, SURFACE_BEATS, SURFACES, atBeat } from '../script'

const TILE_LEFT = 110
const TILE_STEP = 210
const TRACE_TOP = 750
const BUS_Y = 790
const PANEL_X = 1030
const PULSE_FRAMES = 14

const COUNTERS = [
  { label: 'Checks', value: CHECKS.total, className: 'text-white' },
  { label: 'Passed', value: CHECKS.total - CHECKS.findings, className: 'text-neon' },
  { label: 'Findings', value: CHECKS.findings, className: 'text-hot' },
] as const

const tileX = (i: number) => TILE_LEFT + i * TILE_STEP + 95

/** Circuit traces from each surface into the review panel, with a pulse after every link. */
const Traces: React.FC = () => {
  const frame = useCurrentFrame()
  const connects = SURFACE_BEATS.map((b) => atBeat(b))
  const busOn = frame >= connects[0]

  return (
    <svg viewBox="0 0 1920 1080" className="absolute inset-0 h-full w-full">
      <path d={`M${tileX(0)} ${BUS_Y} H${PANEL_X}`} className={busOn ? 'stroke-cyan' : 'stroke-white/15'} strokeWidth="3" fill="none" />
      {SURFACES.map((s, i) => {
        const on = frame >= connects[i]
        const x = tileX(i)
        const u = (frame - connects[i]) / PULSE_FRAMES
        const length = BUS_Y - TRACE_TOP + (PANEL_X - x)
        const d = u * length
        const px = d < BUS_Y - TRACE_TOP ? x : x + d - (BUS_Y - TRACE_TOP)
        const py = d < BUS_Y - TRACE_TOP ? TRACE_TOP + d : BUS_Y
        return (
          <g key={s.id}>
            <path d={`M${x} ${TRACE_TOP} V${BUS_Y}`} className={on ? 'stroke-cyan' : 'stroke-white/15'} strokeWidth="3" fill="none" />
            <circle cx={x} cy={BUS_Y} r="6" className={on ? 'fill-cyan' : 'fill-white/20'} />
            {u >= 0 && u <= 1 ? <circle cx={px} cy={py} r="9" className="fill-white drop-shadow-[0_0_12px_#00e5ff]" /> : null}
          </g>
        )
      })}
    </svg>
  )
}

export const Review: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const panel = Math.min(1, pop(frame, fps, 6, 16))
  const beam = progress(frame, atBeat(BEAM_FROM), atBeat(BEAM_TO - BEAM_FROM), EASE_IN_OUT)
  const report = Math.min(1, pop(frame, fps, atBeat(REPORT_BEAT), 12))
  const tools = progress(frame, atBeat(2), 14)
  const reviewing = frame < atBeat(BEAM_TO)

  return (
    <AbsoluteFill className="bg-night">
      <NeonGrid id="review" theme="neutral" horizon={860} speed={0.9} floorOpacity={0.55} />
      <Kicker index={COPY.review.index} label={COPY.review.kicker} accent="cyan" />

      <div className="absolute top-[220px] left-[110px] w-[900px] font-display text-[92px] leading-none font-bold tracking-[-0.02em] text-white">
        <Reveal line={COPY.review.lines[0]} delay={4} />
        <Reveal line={COPY.review.lines[1]} delay={16} accentDelay={6} accentClassName={ACCENT_WORD.cyan} />
      </div>

      <Traces />

      <div className="absolute top-[500px] left-[110px] flex gap-[20px]">
        {SURFACES.map((s, i) => (
          <SurfaceTile key={s.id} surface={s.id} label={s.label} enterAt={8 + i * 3} connectAt={atBeat(SURFACE_BEATS[i])} />
        ))}
      </div>

      <div
        className="absolute top-[880px] left-[110px] flex items-center gap-4 font-mono text-[18px] font-bold tracking-[0.24em] text-white/50 uppercase"
        style={{ opacity: tools }}
      >
        Manual review +
        <Img src={ASSETS.prowlerMark} className="h-[40px] w-auto" />
        <span className="font-display text-[34px] font-bold tracking-normal text-white normal-case">Prowler</span>
      </div>

      <div className="absolute top-[150px] left-[1030px]" style={{ opacity: panel, transform: `translateX(${(1 - panel) * 70}px)` }}>
        <HudPanel title="Findings // Live" meta="App · Cloud · CI" accent="cyan" className="h-[760px] w-[780px]">
          <div className="px-8 py-7">
            <div className="flex items-center justify-between font-mono text-[18px] font-bold tracking-[0.22em] uppercase">
              <span className={reviewing ? 'text-cyan' : 'text-neon'}>{reviewing ? 'Reviewing' : 'Complete'}</span>
              <span className="text-white/60">{Math.round(beam * 100)}%</span>
            </div>
            <div className="mt-3 h-[10px] overflow-hidden rounded-full bg-white/10">
              <div className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#ff2bd6,#00e5ff)]" style={{ transform: `scaleX(${beam})` }} />
            </div>

            <div className="relative mt-8 flex flex-col gap-4">
              {FINDINGS.map((f, i) => (
                <FindingRow key={f.title} severity={f.severity} area={f.area} title={f.title} at={atBeat(FINDING_BEATS[i])} />
              ))}
            </div>

            <div
              className="mt-8 flex h-[84px] items-center justify-center gap-4 rounded-[14px] bg-neon/15 font-display text-[32px] font-bold tracking-[0.08em] text-neon uppercase ring-1 ring-neon/60"
              style={{ opacity: report, transform: `scale(${0.8 + 0.2 * report})` }}
            >
              <CheckIcon className="h-[36px] w-[36px] stroke-neon" />
              Report ready
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {COUNTERS.map((c) => (
                <div key={c.label} className="rounded-[12px] bg-white/[0.04] px-5 py-3 ring-1 ring-white/10">
                  <div className="font-mono text-[15px] font-bold tracking-[0.2em] text-white/45 uppercase">{c.label}</div>
                  <div className={`font-display text-[44px] leading-tight font-bold ${c.className}`}>{Math.round(c.value * beam).toLocaleString('en-US')}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="absolute inset-x-0 h-[110px] bg-[linear-gradient(to_bottom,transparent,rgba(0,229,255,0.4),transparent)]"
            style={{ top: 40 + beam * 520, opacity: beam > 0 && beam < 1 ? 1 : 0 }}
          />
        </HudPanel>
      </div>

      <Wordmark />
    </AbsoluteFill>
  )
}
