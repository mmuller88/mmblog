import { Fragment } from 'react'
import { useCurrentFrame } from 'remotion'
import { progress } from '../lib/anim'
import { tokenize } from '../lib/text'

type Props = {
  line: string
  delay?: number
  stagger?: number
  duration?: number
  /** Extra frames before accent words land, for emphasis. */
  accentDelay?: number
  className?: string
  accentClassName?: string
}

/** Words slide up from behind a mask, one after another. */
export const Reveal: React.FC<Props> = ({
  line,
  delay = 0,
  stagger = 3,
  duration = 16,
  accentDelay = 0,
  className = '',
  accentClassName = 'font-serif italic font-normal',
}) => {
  const frame = useCurrentFrame()
  const tokens = tokenize(line)

  return (
    <span className={`block ${className}`}>
      {tokens.map((token, i) => {
        const p = progress(frame, delay + i * stagger + (token.accent ? accentDelay : 0), duration)
        return (
          <Fragment key={`${token.text}-${i}`}>
            <span className="-mx-[0.1em] -mb-[0.16em] inline-block overflow-hidden px-[0.1em] pb-[0.16em] align-bottom">
              <span
                className={`inline-block origin-bottom-left ${token.accent ? accentClassName : ''}`}
                style={{ transform: `translateY(${(1 - p) * 112}%) rotate(${(1 - p) * 5}deg)` }}
              >
                {token.text}
              </span>
            </span>
            {i < tokens.length - 1 ? ' ' : null}
          </Fragment>
        )
      })}
    </span>
  )
}
