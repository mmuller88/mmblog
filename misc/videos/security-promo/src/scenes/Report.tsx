import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { ChromaticGlitch } from '../components/ChromaticGlitch'
import { HudPanel } from '../components/HudPanel'
import { CheckIcon, ReportIcon } from '../components/icons'
import { Kicker, Wordmark } from '../components/Kicker'
import { NeonGrid } from '../components/NeonGrid'
import { Reveal } from '../components/Reveal'
import { ACCENT_WORD } from '../lib/accent'
import { pop, progress } from '../lib/anim'
import { burst, spike } from '../lib/glitch'
import { SEVERITY } from '../lib/severity'
import { CHECKS, COPY, FIX_BEATS, FIXES, RETEST_BEAT, SEVERITY_BEATS, SEVERITY_COUNTS, SUMMARY_BEAT, atBeat, type Severity } from '../script'

const MAX_COUNT = Math.max(...SEVERITY_COUNTS.map((s) => s.count))

const SeverityBar: React.FC<{ severity: Severity; count: number; at: number }> = ({ severity, count, at }) => {
  const frame = useCurrentFrame()
  const sev = SEVERITY[severity]
  const appear = progress(frame, at - 6, 10)
  const fill = progress(frame, at, 18)

  return (
    <div className="flex items-center gap-6" style={{ opacity: appear, transform: `translateY(${(1 - appear) * 16}px)` }}>
      <span className={`w-[150px] font-mono text-[20px] font-bold tracking-[0.2em] uppercase ${sev.text}`}>{sev.label}</span>
      <div className="h-[18px] flex-1 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
        <div className={`h-full origin-left rounded-full ${sev.bar}`} style={{ transform: `scaleX(${(fill * count) / MAX_COUNT})` }} />
      </div>
      <span className="w-[70px] text-right font-display text-[44px] leading-none font-bold text-white">{Math.round(fill * count)}</span>
    </div>
  )
}

const FixRow: React.FC<{ index: number; severity: Severity; title: string; when: string; at: number }> = ({ index, severity, title, when, at }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = pop(frame, fps, at, 12)
  const sev = SEVERITY[severity]
  const flicker = frame >= at && frame < at + 6 && spike(`fix-${index}`, frame, 0.45) ? 0.3 : 1

  return (
    <div
      className={`flex items-center gap-5 rounded-[14px] bg-white/[0.04] px-6 py-5 ring-1 ${sev.row}`}
      style={{ opacity: Math.min(1, s * 1.4) * flicker, transform: `translateX(${(1 - Math.min(1, s)) * 40}px)` }}
    >
      <span className={`font-mono text-[22px] font-bold ${sev.text}`}>{String(index + 1).padStart(2, '0')}</span>
      <span className={`w-[130px] shrink-0 rounded-full py-2 text-center font-mono text-[15px] font-bold tracking-[0.16em] uppercase ring-1 ${sev.badge}`}>
        {sev.label}
      </span>
      <span className="flex-1 font-display text-[27px] font-bold text-white">{title}</span>
      <span className="font-mono text-[16px] font-bold tracking-[0.14em] text-white/55 uppercase">{when}</span>
    </div>
  )
}

export const Report: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const land = atBeat(FIX_BEATS[0])
  const panel = Math.min(1, pop(frame, fps, 6, 16))
  const total = progress(frame, land, 12)
  const summary = Math.min(1, pop(frame, fps, atBeat(SUMMARY_BEAT), 12))
  const retest = progress(frame, atBeat(RETEST_BEAT), 10)

  return (
    <AbsoluteFill className="bg-night">
      <NeonGrid id="report" theme="neutral" horizon={860} speed={0.9} floorOpacity={0.55} />
      <Kicker index={COPY.report.index} label={COPY.report.kicker} accent="green" />

      <div className="absolute top-[220px] left-[110px] w-[880px] font-display text-[92px] leading-none font-bold tracking-[-0.02em] text-white">
        <Reveal line={COPY.report.lines[0]} delay={4} />
        <Reveal line={COPY.report.lines[1]} delay={16} accentDelay={6} accentClassName={ACCENT_WORD.green} />
      </div>

      <div className="absolute top-[490px] left-[110px] flex w-[800px] flex-col gap-8">
        {SEVERITY_COUNTS.map((s, i) => (
          <SeverityBar key={s.severity} severity={s.severity} count={s.count} at={atBeat(SEVERITY_BEATS[i])} />
        ))}
      </div>

      <div
        className="absolute top-[820px] left-[110px] font-mono text-[28px] font-bold tracking-[0.06em] text-white/70"
        style={{ opacity: total, transform: `translateY(${(1 - total) * 14}px)` }}
      >
        <span className="text-neon">{CHECKS.findings}</span> findings · ranked by risk
      </div>

      <ChromaticGlitch id="report-glitch" amount={burst(frame, land, 10)} seed={frame}>
        <div className="absolute top-[150px] left-[1030px]" style={{ opacity: panel, transform: `translateX(${(1 - panel) * 70}px)` }}>
          <HudPanel title="Report // Fix plan" meta="Prioritized" accent="green" className="w-[780px]">
            <div className="flex flex-col gap-4 px-8 py-7">
              <div className="flex justify-between font-mono text-[16px] font-bold tracking-[0.24em] text-white/45 uppercase">
                <span>Fix order</span>
                <span>When</span>
              </div>
              {FIXES.map((f, i) => (
                <FixRow key={f.title} index={i} severity={f.severity} title={f.title} when={f.when} at={atBeat(FIX_BEATS[i])} />
              ))}

              <div
                className="mt-4 flex h-[84px] items-center gap-5 rounded-[14px] bg-neon/15 px-7 ring-1 ring-neon/60"
                style={{ opacity: summary, transform: `scale(${0.8 + 0.2 * summary})` }}
              >
                <ReportIcon className="h-[40px] w-[40px] stroke-neon" />
                <span className="flex-1 font-display text-[32px] font-bold tracking-[0.08em] text-neon uppercase">{COPY.report.summary}</span>
                <span className="font-mono text-[16px] font-bold tracking-[0.14em] text-white/60 uppercase">{COPY.report.summaryFor}</span>
              </div>

              <div
                className="mt-2 flex items-center gap-3 font-mono text-[20px] font-bold tracking-[0.16em] text-white/80 uppercase"
                style={{ opacity: retest, transform: `translateY(${(1 - retest) * 12}px)` }}
              >
                <CheckIcon className="h-[26px] w-[26px] stroke-neon" />
                {COPY.report.retest}
              </div>
            </div>
          </HudPanel>
        </div>
      </ChromaticGlitch>

      <Wordmark />
    </AbsoluteFill>
  )
}
