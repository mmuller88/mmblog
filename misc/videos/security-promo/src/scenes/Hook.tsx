import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion'
import { ChromaticGlitch } from '../components/ChromaticGlitch'
import { Wordmark } from '../components/Kicker'
import { NeonGrid } from '../components/NeonGrid'
import { Reveal } from '../components/Reveal'
import { ACCENT_WORD } from '../lib/accent'
import { CLAMP, progress } from '../lib/anim'
import { burst } from '../lib/glitch'
import { COPY, RISK_BEAT, TICKER_FROM, TICKER_TO, atBeat } from '../script'

const GLYPHS = '#%&@$?!<>/*'

const scramble = (seed: string, frame: number, n: number) =>
  Array.from({ length: n }, (_, i) => GLYPHS[Math.floor(random(`${seed}-${i}-${Math.floor(frame / 2)}`) * GLYPHS.length)]).join('')

export const Hook: React.FC = () => {
  const frame = useCurrentFrame()
  const typed = Math.floor(interpolate(frame, [atBeat(TICKER_FROM), atBeat(TICKER_TO)], [0, COPY.hook.ticker.length], CLAMP))
  const caretOn = Math.floor(frame / 6) % 2 === 0
  const risk = burst(frame, atBeat(RISK_BEAT), 10)

  return (
    <AbsoluteFill className="bg-night">
      <NeonGrid id="hook" theme="threat" horizon={760} sun sunRise={0.75} skyline rain speed={0.7} />

      <div className="absolute top-[64px] left-[110px] flex items-center gap-4 font-mono text-[24px] font-bold tracking-[0.22em] text-magenta">
        <span className="text-white/45">&gt;</span>
        <span>{COPY.hook.ticker.slice(0, typed)}</span>
        <span className={`h-[26px] w-[14px] bg-magenta ${caretOn ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="absolute top-[130px] right-[72px] flex flex-col items-end gap-2 font-mono text-[18px] font-bold tracking-[0.2em] uppercase">
        {COPY.hook.readout.map((label, i) => (
          <div key={label} className="flex gap-4" style={{ opacity: progress(frame, 10 + i * 5, 10) }}>
            <span className="text-white/45">{label}</span>
            <span className="w-[56px] text-left text-magenta">{scramble(label, frame, 3)}</span>
          </div>
        ))}
      </div>

      <ChromaticGlitch id="hook-glitch" amount={risk} seed={Math.floor(frame / 2)}>
        <div className="absolute top-[196px] left-[110px] font-display font-bold tracking-[-0.02em] text-white">
          <Reveal line={COPY.hook.lines[0]} delay={6} className="text-[78px] leading-[1.05] text-white/90" />
          <Reveal line={COPY.hook.lines[1]} delay={20} className="mt-2 text-[124px] leading-none" accentClassName={ACCENT_WORD.magenta} />
        </div>
      </ChromaticGlitch>

      <Wordmark />
    </AbsoluteFill>
  )
}
