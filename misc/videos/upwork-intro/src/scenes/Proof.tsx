import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { ASSETS } from '../assets'
import { Wordmark } from '../components/Kicker'
import { CLAMP, pop, progress } from '../lib/anim'
import { COPY } from '../script'

export const Proof: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  const count = Math.round(interpolate(frame, [6, Math.min(54, durationInFrames - 8)], [0, COPY.proof.count], CLAMP))
  const badge = pop(frame, fps, 8, 14)

  return (
    <AbsoluteFill className="bg-[radial-gradient(ellipse_at_70%_40%,#16324f_0%,#0b1220_55%,#070d18_100%)]">
      <div className="absolute top-[200px] left-[140px] w-[1100px]">
        <div className="font-display text-[168px] leading-none font-extrabold tracking-[-0.05em] text-white">
          {count.toLocaleString('en-US')}+
        </div>
        <div className="mt-3 font-mono text-[36px] font-bold tracking-[0.08em] text-brand-light">{COPY.proof.unit}</div>
        <div className="mt-12 font-display text-[42px] font-bold text-white" style={{ opacity: progress(frame, 24, 14) }}>
          {COPY.proof.credential}
        </div>
        <div className="mt-3 font-mono text-[30px] text-white/75" style={{ opacity: progress(frame, 36, 14) }}>
          {COPY.proof.community}
        </div>
      </div>
      <Img
        src={ASSETS.saPro}
        className="absolute top-[230px] right-[150px] h-[480px] w-auto"
        style={{ transform: `scale(${badge})`, opacity: Math.min(1, badge * 2) }}
      />
      <Wordmark />
    </AbsoluteFill>
  )
}
