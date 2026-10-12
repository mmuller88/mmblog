import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion'
import { ASSETS } from '../assets'
import { Reveal } from '../components/Reveal'
import { Terminal } from '../components/Terminal'
import { Wordmark } from '../components/Kicker'
import { pop } from '../lib/anim'
import { COPY } from '../script'

const ACCENT = 'font-serif text-[1.16em] leading-none font-normal tracking-normal text-orange italic'

export const Hook: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const avatar = pop(frame, fps, 0, 12)

  return (
  <AbsoluteFill className="bg-[radial-gradient(ellipse_at_30%_20%,#16324f_0%,#0b1220_52%,#070d18_100%)]">
    <svg className="absolute inset-0 h-full w-full opacity-50">
      <defs>
        <pattern id="hook-dots" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="1.25" className="fill-brand-light" />
        </pattern>
        <radialGradient id="hook-fade" cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor="white" />
          <stop offset="70%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="hook-mask">
          <rect width="1920" height="1080" fill="url(#hook-fade)" />
        </mask>
      </defs>
      <rect width="1920" height="1080" fill="url(#hook-dots)" mask="url(#hook-mask)" />
    </svg>

    <Img
      src={ASSETS.avatar}
      className="absolute top-[236px] left-[110px] h-[156px] w-[156px] rounded-full object-cover ring-[6px] ring-brand"
      style={{ transform: `scale(${avatar})`, opacity: Math.min(1, avatar * 2) }}
    />

    <div className="absolute top-[248px] left-[310px] w-[1500px] font-display text-[78px] leading-[0.96] font-extrabold tracking-[-0.03em] text-white">
      <Reveal line={COPY.hook[0]} delay={6} />
      <Reveal line={COPY.hook[1]} delay={20} accentDelay={4} accentClassName={ACCENT} />
    </div>

    <div className="absolute top-[560px] left-[1040px]">
      <Terminal />
    </div>

    <Wordmark />
  </AbsoluteFill>
  )
}
