import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { ArchFlow } from '../components/ArchFlow'
import { Chip } from '../components/Chip'
import { Kicker, Wordmark } from '../components/Kicker'
import { Qr } from '../components/Qr'
import { Reveal } from '../components/Reveal'
import { ASSETS } from '../assets'
import { EASE_IN_OUT, pop, progress } from '../lib/anim'
import { COPY, FLOW_HOPS, FLOWS, LINK_FROM, LINK_SWAP_BEAT, LINK_TO, QR_URL, atBeat } from '../script'

const ACCENT = 'font-serif text-[1.14em] leading-none font-normal tracking-normal text-teal italic'

export const QrPlakat: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const card = pop(frame, fps, 4, 15)
  const sweep = progress(frame, atBeat(1), atBeat(2.5), EASE_IN_OUT)
  const swapped = frame >= atBeat(LINK_SWAP_BEAT)
  const badge = pop(frame, fps, atBeat(LINK_SWAP_BEAT), 10)
  const corners = progress(frame, atBeat(0.5), 16)

  return (
    <AbsoluteFill className="bg-[radial-gradient(ellipse_at_75%_30%,#ffffff_0%,#f4f1ea_55%,#d7efec_100%)]">
      <Kicker index={COPY.qrplakat.index} label={COPY.qrplakat.kicker} mark={ASSETS.qrPlakat} light />

      <div className="absolute top-[210px] left-[110px] w-[860px] font-display text-[92px] leading-[0.96] font-extrabold tracking-[-0.03em] text-ink">
        <Reveal line={COPY.qrplakat.lines[0]} delay={4} />
        <Reveal line={COPY.qrplakat.lines[1]} delay={16} accentDelay={6} accentClassName={ACCENT} />
      </div>

      <div className="absolute top-[520px] left-[110px] flex flex-col items-start gap-3">
        {COPY.qrplakat.chips.map((text, i) => (
          <Chip key={text} text={text} delay={atBeat(2) + i * 8} light />
        ))}
      </div>

      <div
        className="absolute top-[150px] left-[1120px] w-[560px] overflow-hidden rounded-[28px] bg-white shadow-[0_40px_80px_-28px_rgba(13,148,136,0.45)] ring-1 ring-black/5"
        style={{ opacity: Math.min(1, card), transform: `translateY(${(1 - Math.min(1, card)) * 40}px) rotate(${-2 + card * 2}deg)` }}
      >
        <div className="bg-teal px-8 py-5 font-display text-[32px] font-extrabold tracking-tight text-white">qr-plakat.de</div>
        <div className="relative grid place-items-center px-8 pt-7 pb-5">
          <div className="relative h-[336px] w-[336px]">
            <div className="absolute top-[28px] left-[28px]">
              <Qr value={QR_URL} size={280} className="fill-ink" />
            </div>
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100">
              {[
                [2, 2, 1, 1],
                [98, 2, -1, 1],
                [2, 98, 1, -1],
                [98, 98, -1, -1],
              ].map(([x, y, dx, dy], i) => (
                <path
                  key={i}
                  d={`M${x + dx * 7} ${y}H${x}V${y + dy * 7}`}
                  fill="none"
                  className="stroke-teal"
                  strokeWidth={1.6}
                  strokeLinecap="square"
                  opacity={corners}
                />
              ))}
              <line x1="12" x2="88" y1={16 + sweep * 68} y2={16 + sweep * 68} className="stroke-teal" strokeWidth={0.8} opacity={sweep > 0 && sweep < 1 ? 0.85 : 0} />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 px-8 pb-7">
          <div className="truncate font-mono text-[20px] font-bold text-ink">{swapped ? LINK_TO : LINK_FROM}</div>
          <div
            className="shrink-0 rounded-full bg-teal px-4 py-2 font-mono text-[14px] font-bold tracking-[0.14em] text-white uppercase"
            style={{ transform: `scale(${badge})`, opacity: Math.min(1, badge * 1.5) }}
          >
            no reprint
          </div>
        </div>
      </div>

      <div className="absolute bottom-[28px] left-0 flex w-full justify-center">
        <ArchFlow nodes={FLOWS.qrplakat} hops={FLOW_HOPS.qrplakat} accent="#0d9488" light />
      </div>

      <Wordmark light />
    </AbsoluteFill>
  )
}
