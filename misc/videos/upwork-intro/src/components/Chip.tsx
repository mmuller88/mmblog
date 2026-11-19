import { useCurrentFrame, useVideoConfig } from 'remotion'
import { pop } from '../lib/anim'

/** Small proof point that pops in on a beat. */
export const Chip: React.FC<{ text: string; delay?: number; light?: boolean }> = ({ text, delay = 0, light = false }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = pop(frame, fps, delay, 14)

  return (
    <div
      className={`rounded-full px-6 py-3 font-mono text-[20px] font-medium tracking-wide ${
        light ? 'bg-white text-ink shadow-[0_16px_40px_-20px_rgba(15,23,42,0.45)] ring-1 ring-black/5' : 'bg-white/10 text-white ring-1 ring-white/15'
      }`}
      style={{ opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - Math.min(1, s)) * 18}px)` }}
    >
      {text}
    </div>
  )
}
