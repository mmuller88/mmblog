import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { CLAMP, pop } from '../lib/anim'
import { CheckIcon } from './icons'
import { DEPLOY_BEATS, DEPLOY_CMD, DEPLOY_LINES, atBeat } from '../script'

/** `$ cdk deploy` ticking off the three real stacks, one per beat. */
export const Terminal: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const enter = pop(frame, fps, 8, 16)
  const typed = Math.floor(interpolate(frame, [14, 36], [0, DEPLOY_CMD.length], CLAMP))
  const caretOn = Math.floor(frame / 8) % 2 === 0

  return (
    <div
      className="w-[760px] overflow-hidden rounded-[22px] bg-[#07111f] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
      style={{ opacity: Math.min(1, enter * 1.4), transform: `translateY(${(1 - Math.min(1, enter)) * 36}px)` }}
    >
      <div className="flex h-[58px] items-center gap-2.5 border-b border-white/10 px-6">
        <span className="h-[13px] w-[13px] rounded-full bg-[#ff5f57]" />
        <span className="h-[13px] w-[13px] rounded-full bg-[#febc2e]" />
        <span className="h-[13px] w-[13px] rounded-full bg-[#28c840]" />
        <span className="ml-4 font-mono text-[16px] text-white/40">zsh — hetzner prod</span>
      </div>
      <div className="flex flex-col gap-3 px-8 py-7 font-mono text-[24px] leading-none">
        <div className="flex items-center text-white">
          <span className="mr-3 text-emerald">$</span>
          <span>{DEPLOY_CMD.slice(0, typed)}</span>
          <span className={`ml-0.5 inline-block h-[26px] w-[2px] bg-brand ${caretOn ? 'opacity-100' : 'opacity-0'}`} />
        </div>
        {DEPLOY_LINES.map((line, i) => {
          const s = pop(frame, fps, atBeat(DEPLOY_BEATS[i]), 12)
          if (s <= 0.01) return null
          return (
            <div key={line.stack} className="flex items-center gap-3" style={{ opacity: Math.min(1, s * 1.5), transform: `translateX(${(1 - Math.min(1, s)) * 24}px)` }}>
              <CheckIcon className="h-[26px] w-[26px] stroke-emerald" />
              <span className="font-bold text-white">{line.stack}</span>
              <span className="text-steel">{line.region}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
