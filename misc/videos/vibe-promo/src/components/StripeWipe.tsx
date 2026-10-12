import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { CLAMP, EASE_IN, EASE_OUT } from '../lib/anim'
import { HEIGHT, WIDTH } from '../script'

const MOVE = 7
const STAGGER = 2
/** Bottom → top. The top bar fully covers the frame at the cut. */
const BARS = ['bg-brand', 'bg-signal', 'bg-steel']

export const WIPE_FRAMES = 2 * (MOVE + STAGGER * (BARS.length - 1))
export const WIPE_CUT = WIPE_FRAMES / 2

const SKEW_DEG = 14
const SKEW_PAD = HEIGHT * Math.tan((SKEW_DEG * Math.PI) / 180)
const SPAN = WIDTH + 2 * SKEW_PAD

/** Brand-colour bars sweep across and hide a hard cut placed at WIPE_CUT. */
export const StripeWipe: React.FC<{ direction?: 1 | -1 }> = ({ direction = 1 }) => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill className="pointer-events-none overflow-hidden">
      {BARS.map((color, i) => {
        const inStart = i * STAGGER
        const outStart = WIPE_CUT + (BARS.length - 1 - i) * STAGGER
        const enter = interpolate(frame, [inStart, inStart + MOVE], [-SPAN, 0], { ...CLAMP, easing: EASE_OUT })
        const exit = interpolate(frame, [outStart, outStart + MOVE], [0, SPAN], { ...CLAMP, easing: EASE_IN })
        const x = (frame < outStart ? enter : exit) * direction
        return (
          <div
            key={color}
            className={`absolute top-0 h-full ${color}`}
            style={{
              left: -SKEW_PAD,
              width: SPAN,
              transform: `translateX(${x}px) skewX(${-SKEW_DEG * direction}deg)`,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}
