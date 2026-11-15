import { useCurrentFrame } from 'remotion'
import { ACCENT, type Accent } from '../lib/accent'

const CORNERS = [
  'top-3 left-3 border-t-[3px] border-l-[3px]',
  'top-3 right-3 border-t-[3px] border-r-[3px]',
  'bottom-3 left-3 border-b-[3px] border-l-[3px]',
  'bottom-3 right-3 border-b-[3px] border-r-[3px]',
]

type Props = {
  title: string
  meta?: string
  accent?: Accent
  className?: string
  children: React.ReactNode
}

/** Dark glass panel with neon ring, corner brackets and a blinking status header. */
export const HudPanel: React.FC<Props> = ({ title, meta, accent = 'cyan', className = '', children }) => {
  const frame = useCurrentFrame()
  const a = ACCENT[accent]
  const blink = Math.floor(frame / 10) % 2 === 0

  return (
    <div className={`relative overflow-hidden rounded-[18px] bg-night-2/90 ring-1 ${a.ring} ${a.glow} ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[32px_32px]" />
      {CORNERS.map((c) => (
        <span key={c} className={`absolute h-[26px] w-[26px] ${c} ${a.border}`} />
      ))}
      <div className="relative flex items-center justify-between border-b border-white/10 px-8 py-5 font-mono text-[18px] font-bold tracking-[0.22em] uppercase">
        <span className={`flex items-center gap-3 ${a.text}`}>
          <span className={`h-[10px] w-[10px] rounded-full ${a.bg} ${blink ? 'opacity-100' : 'opacity-25'}`} />
          {title}
        </span>
        {meta ? <span className="text-white/40">{meta}</span> : null}
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}
