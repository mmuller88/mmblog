import { useCurrentFrame, useVideoConfig } from 'remotion'
import { pop } from '../lib/anim'
import type { SurfaceId } from '../script'
import { BrowserIcon, CheckIcon, KeyIcon, NetworkIcon, PipelineIcon } from './icons'

const ICONS: Record<SurfaceId, React.FC<{ className?: string }>> = {
  app: BrowserIcon,
  iam: KeyIcon,
  network: NetworkIcon,
  ci: PipelineIcon,
}

type Props = { surface: SurfaceId; label: string; enterAt: number; connectAt: number }

/** Attack-surface tile that sits dim until the reviewer links in. */
export const SurfaceTile: React.FC<Props> = ({ surface, label, enterAt, connectAt }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const enter = pop(frame, fps, enterAt, 14)
  const lock = pop(frame, fps, connectAt, 10)
  const on = frame >= connectAt
  const pulse = on ? Math.max(0, 1 - (frame - connectAt) / 12) : 0
  const Icon = ICONS[surface]

  return (
    <div
      className="flex w-[190px] flex-col items-center gap-4"
      style={{ opacity: Math.min(1, enter * 1.4), transform: `translateY(${(1 - Math.min(1, enter)) * 30}px)` }}
    >
      <div
        className={`grid h-[150px] w-[150px] place-items-center rounded-[26px] p-8 ring-4 ${
          on ? 'bg-cyan/10 ring-cyan shadow-[0_0_50px_-4px_rgba(0,229,255,0.85)]' : 'bg-night-2 ring-white/10'
        }`}
        style={{ transform: `scale(${1 + 0.08 * pulse})` }}
      >
        <Icon className={`h-full w-full ${on ? 'stroke-cyan' : 'stroke-white/35'}`} />
      </div>
      <div className={`font-mono text-[18px] font-bold tracking-[0.1em] ${on ? 'text-white' : 'text-white/45'}`}>{label}</div>
      <div
        className="flex h-[34px] items-center gap-2 rounded-full bg-cyan/15 px-4 font-mono text-[14px] font-bold tracking-[0.18em] text-cyan ring-1 ring-cyan/50"
        style={{ opacity: Math.min(1, lock), transform: `scale(${0.6 + 0.4 * Math.min(1, lock)})` }}
      >
        <CheckIcon className="h-[14px] w-[14px] stroke-cyan" />
        IN SCOPE
      </div>
    </div>
  )
}
