import { useCurrentFrame, useVideoConfig } from 'remotion'
import { pop } from '../lib/anim'
import { spike } from '../lib/glitch'

export const GAP_ROW_HEIGHT = 84

type Props = { area: string; ok: boolean; note: string; at: number; checking: boolean }

/** One checklist area that sits queued until the beam resolves it to OK or GAP. */
export const GapRow: React.FC<Props> = ({ area, ok, note, at, checking }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const done = frame >= at
  const s = Math.min(1, pop(frame, fps, at, 12))
  const flicker = done && frame < at + 6 && spike(`gap-${area}`, frame, 0.45) ? 0.35 : 1

  const ring = !done ? 'ring-white/10' : ok ? 'ring-neon/45' : 'ring-hot/55 shadow-[0_0_44px_-10px_rgba(255,56,100,0.85)]'
  const badge = !done ? 'bg-white/5 text-white/40 ring-white/15' : ok ? 'bg-neon/15 text-neon ring-neon/50' : 'bg-hot/20 text-hot ring-hot/60'
  const noteClass = !done ? 'text-white/25' : ok ? 'text-neon' : 'text-hot'

  return (
    <div className={`flex items-center gap-5 rounded-[14px] bg-white/[0.04] px-6 ring-1 ${ring}`} style={{ height: GAP_ROW_HEIGHT, opacity: flicker }}>
      <span
        className={`w-[120px] shrink-0 rounded-full py-2 text-center font-mono text-[16px] font-bold tracking-[0.18em] uppercase ring-1 ${badge}`}
        style={{ transform: `scale(${done ? 0.8 + 0.2 * s : 1})` }}
      >
        {done ? (ok ? 'OK' : 'Gap') : '···'}
      </span>
      <span className={`flex-1 font-display text-[28px] font-bold ${done ? 'text-white' : 'text-white/45'}`}>{area}</span>
      <span className={`font-mono text-[16px] font-bold tracking-[0.14em] uppercase ${noteClass}`}>{done ? note : checking ? 'Checking' : 'Queued'}</span>
    </div>
  )
}
