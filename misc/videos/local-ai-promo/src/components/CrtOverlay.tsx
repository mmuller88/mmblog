import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { HEIGHT } from '../script'

const BAND = 260

/** Scanlines, film grain, a rolling refresh band and a vignette over the whole cut. */
export const CrtOverlay: React.FC = () => {
  const frame = useCurrentFrame()
  const band = ((frame * 7) % (HEIGHT + BAND)) - BAND

  return (
    <AbsoluteFill className="pointer-events-none">
      <AbsoluteFill className="bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,0.3)_0px,rgba(0,0,0,0.3)_1px,transparent_1px,transparent_4px)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.08] mix-blend-overlay">
        <filter id="crt-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 61} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#crt-grain)" />
      </svg>
      <div
        className="absolute inset-x-0 top-0 h-[260px] bg-[linear-gradient(to_bottom,transparent,rgba(160,255,255,0.045),transparent)]"
        style={{ transform: `translateY(${band}px)` }}
      />
      <AbsoluteFill className="bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.72)_100%)]" />
    </AbsoluteFill>
  )
}
