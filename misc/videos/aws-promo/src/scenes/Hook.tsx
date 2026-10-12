import { AbsoluteFill } from 'remotion'
import { Reveal } from '../components/Reveal'
import { Terminal } from '../components/Terminal'
import { Wordmark } from '../components/Kicker'
import { COPY } from '../script'

const ACCENT = 'font-serif text-[1.16em] leading-none font-normal tracking-normal text-orange italic'

export const Hook: React.FC = () => (
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

    <div className="absolute top-[250px] left-[120px] w-[1680px] font-display text-[86px] leading-[0.96] font-extrabold tracking-[-0.03em] text-white">
      <Reveal line={COPY.hook[0]} delay={6} />
      <Reveal line={COPY.hook[1]} delay={20} accentDelay={4} accentClassName={ACCENT} />
    </div>

    <div className="absolute top-[560px] left-[1040px]">
      <Terminal />
    </div>

    <Wordmark />
  </AbsoluteFill>
)
