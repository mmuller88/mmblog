import { Easing, interpolate, spring } from 'remotion'

export const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1)
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0)
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1)

/** 0 → 1 between `start` and `start + duration`. */
export const progress = (frame: number, start: number, duration: number, easing = EASE_OUT) =>
  interpolate(frame, [start, start + duration], [0, 1], { ...CLAMP, easing })

/** Springy 0 → 1 (with slight overshoot) starting at `delay`. */
export const pop = (frame: number, fps: number, delay = 0, damping = 13) =>
  spring({ frame: frame - delay, fps, config: { damping, stiffness: 170, mass: 0.7 } })

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Builds one SVG path containing many circles (far cheaper than thousands of <circle> nodes). */
export const circlesPath = (dots: { x: number; y: number; r: number }[]) => {
  let d = ''
  for (const { x, y, r } of dots) {
    d += `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0`
  }
  return d
}
