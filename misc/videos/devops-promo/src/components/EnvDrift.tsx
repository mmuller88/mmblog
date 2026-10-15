import { useCurrentFrame, useVideoConfig } from 'remotion'
import { pop } from '../lib/anim'
import { spike } from '../lib/glitch'
import { DRIFT_BEATS, ENV_ROWS, ENVS, atBeat } from '../script'

const PROD = ENVS.length - 1

const EnvValue: React.FC<{ label: string; value: string; driftAt: number | null }> = ({ label, value, driftAt }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const drift = driftAt !== null && frame >= driftAt
  const tag = driftAt === null ? 0 : Math.min(1, pop(frame, fps, driftAt, 12))
  const flicker = driftAt !== null && drift && frame < driftAt + 6 && spike(`drift-${label}`, frame, 0.5) ? 0.35 : 1

  return (
    <div className={`rounded-[10px] px-4 py-2 ring-1 ${drift ? 'bg-amber/15 ring-amber/60' : 'bg-white/[0.04] ring-white/5'}`} style={{ opacity: flicker }}>
      <div className="font-mono text-[14px] font-bold tracking-[0.2em] text-white/40 uppercase">{label}</div>
      <div className="flex items-center justify-between">
        <span className={`font-mono text-[24px] font-bold ${drift ? 'text-amber' : 'text-white'}`}>{value}</span>
        {driftAt !== null ? (
          <span
            className="rounded-full bg-amber/20 px-3 py-1 font-mono text-[13px] font-bold tracking-[0.16em] text-amber ring-1 ring-amber/50"
            style={{ opacity: tag, transform: `scale(${0.6 + 0.4 * tag})` }}
          >
            DRIFT
          </span>
        ) : null}
      </div>
    </div>
  )
}

const EnvCard: React.FC<{ env: string; column: number; enterAt: number }> = ({ env, column, enterAt }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const enter = pop(frame, fps, enterAt, 14)
  const prod = column === PROD
  const drifted = prod && frame >= atBeat(DRIFT_BEATS[0])

  return (
    <div
      className={`w-[280px] rounded-[16px] bg-night-2/90 px-6 py-5 ring-1 ${drifted ? 'shadow-[0_0_50px_-12px_rgba(255,176,32,0.7)] ring-amber/60' : 'ring-white/10'}`}
      style={{ opacity: Math.min(1, enter * 1.4), transform: `translateY(${(1 - Math.min(1, enter)) * 30}px)` }}
    >
      <div className="flex items-center justify-between font-mono text-[18px] font-bold tracking-[0.22em] uppercase">
        <span className={prod ? 'text-magenta' : 'text-cyan'}>{env}</span>
        <span className={`h-[10px] w-[10px] rounded-full ${drifted ? 'bg-amber' : 'bg-neon'}`} />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {ENV_ROWS.map((row, r) => (
          <EnvValue key={row.key} label={row.key} value={row.values[column]} driftAt={prod ? atBeat(DRIFT_BEATS[r]) : null} />
        ))}
      </div>
    </div>
  )
}

/** Dev, staging and prod side by side; prod's mismatched lines light up as drift. */
export const EnvDrift: React.FC = () => (
  <div className="flex gap-[20px]">
    {ENVS.map((env, i) => (
      <EnvCard key={env} env={env} column={i} enterAt={8 + i * 3} />
    ))}
  </div>
)
