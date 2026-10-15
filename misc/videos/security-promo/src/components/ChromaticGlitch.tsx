import { AbsoluteFill } from 'remotion'

type Props = {
  /** Unique SVG filter id. */
  id: string
  /** 0 = off, 1 = full glitch. */
  amount: number
  seed?: number
  children: React.ReactNode
}

/** RGB split plus blocky horizontal slice displacement, driven per frame. */
export const ChromaticGlitch: React.FC<Props> = ({ id, amount, seed = 0, children }) => {
  if (amount < 0.02) return <AbsoluteFill>{children}</AbsoluteFill>
  const split = 2 + amount * 14

  return (
    <AbsoluteFill>
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0 0.035" numOctaves="1" seed={seed} result="bands" />
            <feComponentTransfer in="bands" result="steps">
              <feFuncR type="discrete" tableValues="0.5 0.5 0.12 0.5 0.88 0.5 0.5 0.3 0.5 0.7" />
              <feFuncG type="discrete" tableValues="0.5" />
              <feFuncA type="discrete" tableValues="1" />
            </feComponentTransfer>
            <feDisplacementMap in="SourceGraphic" in2="steps" scale={amount * 120} xChannelSelector="R" yChannelSelector="G" result="shifted" />
            <feColorMatrix in="shifted" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
            <feOffset in="red" dx={split} result="redShift" />
            <feColorMatrix in="shifted" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cyan" />
            <feOffset in="cyan" dx={-split} result="cyanShift" />
            <feComposite in="redShift" in2="cyanShift" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        </defs>
      </svg>
      <AbsoluteFill style={{ filter: `url(#${id})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  )
}
