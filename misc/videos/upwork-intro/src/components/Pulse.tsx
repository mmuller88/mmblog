const PERIOD = 30

/** Two rings expanding out of a point, looping once per second. */
export const Pulse: React.FC<{ x: number; y: number; r: number; className: string; frame: number }> = ({
  x,
  y,
  r,
  className,
  frame,
}) => {
  if (frame < 0) return null
  return (
    <>
      {[0, PERIOD / 2].map((offset) => {
        const t = ((frame + offset) % PERIOD) / PERIOD
        return (
          <circle
            key={offset}
            cx={x}
            cy={y}
            r={r + t * r * 4}
            fill="none"
            className={className}
            strokeWidth={2}
            strokeOpacity={(1 - t) * 0.7}
          />
        )
      })}
    </>
  )
}
