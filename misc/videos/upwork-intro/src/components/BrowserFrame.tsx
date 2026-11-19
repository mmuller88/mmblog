import { LockIcon } from './icons'

type Props = {
  url: React.ReactNode
  className?: string
  /** Extra element at the right end of the address bar. */
  badge?: React.ReactNode
  children: React.ReactNode
}

export const BrowserFrame: React.FC<Props> = ({ url, className = '', badge, children }) => (
  <div className={`flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_60px_120px_-40px_rgba(0,0,0,0.75)] ring-1 ring-black/10 ${className}`}>
    <div className="flex h-[58px] shrink-0 items-center gap-5 border-b border-black/5 bg-[#f1f3f6] px-6">
      <div className="flex gap-2.5">
        <span className="h-[14px] w-[14px] rounded-full bg-[#ff5f57]" />
        <span className="h-[14px] w-[14px] rounded-full bg-[#febc2e]" />
        <span className="h-[14px] w-[14px] rounded-full bg-[#28c840]" />
      </div>
      <div className="flex h-[36px] flex-1 items-center gap-3 rounded-full bg-white px-5 font-mono text-[18px] text-ink/75">
        <LockIcon className="h-[16px] w-[16px] fill-ink/45" />
        <span className="truncate">{url}</span>
        {badge ? <span className="ml-auto">{badge}</span> : null}
      </div>
    </div>
    <div className="relative flex-1 overflow-hidden bg-white">{children}</div>
  </div>
)
