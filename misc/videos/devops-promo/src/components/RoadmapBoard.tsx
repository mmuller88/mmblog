import { useCurrentFrame, useVideoConfig } from 'remotion'
import { pop, progress } from '../lib/anim'
import { spike } from '../lib/glitch'
import { CARD_BEATS, COLUMN_BEATS, COPY, IMPLEMENT_BEAT, ROADMAP, atBeat } from '../script'
import { HudPanel } from './HudPanel'
import { CheckIcon } from './icons'

type ColumnProps = { index: number; column: string; title: string; fixes: string; openAt: number; cardAt: number }

const Column: React.FC<ColumnProps> = ({ index, column, title, fixes, openAt, cardAt }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const open = progress(frame, openAt - 4, 10)
  const card = Math.min(1, pop(frame, fps, cardAt, 12))
  const flicker = frame >= cardAt && frame < cardAt + 6 && spike(`card-${column}`, frame, 0.45) ? 0.35 : 1
  const first = index === 0

  return (
    <div className="flex flex-col gap-4" style={{ opacity: open, transform: `translateY(${(1 - open) * 14}px)` }}>
      <div className="flex items-center justify-between border-b border-white/15 pb-3 font-mono text-[18px] font-bold tracking-[0.22em] uppercase">
        <span className={first ? 'text-neon' : 'text-white/75'}>{column}</span>
        <span className="text-white/35">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="relative h-[250px] rounded-[14px] border-2 border-dashed border-white/10">
        <div
          className={`absolute -inset-[2px] flex flex-col justify-between rounded-[14px] bg-night-3 p-5 ring-1 ring-neon/50 ${
            first ? 'shadow-[0_0_44px_-10px_rgba(157,255,60,0.8)]' : ''
          }`}
          style={{ opacity: card * flicker, transform: `translateY(${(1 - card) * -40}px) scale(${0.9 + 0.1 * card})` }}
        >
          <div className="font-display text-[26px] leading-[1.1] font-bold text-white">{title}</div>
          <div>
            <div className="font-mono text-[13px] font-bold tracking-[0.22em] text-white/40 uppercase">Fixes</div>
            <div className="mt-1 font-mono text-[17px] font-bold text-hot">{fixes}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Ordered remediation as a Now / Next / Later board; one card drops into each column. */
export const RoadmapBoard: React.FC = () => {
  const frame = useCurrentFrame()
  const implement = progress(frame, atBeat(IMPLEMENT_BEAT), 10)

  return (
    <HudPanel title="Remediation // Ordered" meta="No rewrite" accent="green" className="w-[780px]">
      <div className="px-8 py-7">
        <div className="grid grid-cols-3 gap-4">
          {ROADMAP.map((item, i) => (
            <Column
              key={item.column}
              index={i}
              column={item.column}
              title={item.title}
              fixes={item.fixes}
              openAt={atBeat(COLUMN_BEATS[i])}
              cardAt={atBeat(CARD_BEATS[i])}
            />
          ))}
        </div>
        <div
          className="mt-7 flex items-center gap-3 font-mono text-[20px] font-bold tracking-[0.16em] text-white/80 uppercase"
          style={{ opacity: implement, transform: `translateY(${(1 - implement) * 12}px)` }}
        >
          <CheckIcon className="h-[26px] w-[26px] stroke-neon" />
          {COPY.roadmap.implement}
        </div>
      </div>
    </HudPanel>
  )
}
