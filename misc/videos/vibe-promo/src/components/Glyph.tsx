export type GlyphName =
  | 'react'
  | 'nginx'
  | 'auth'
  | 'database'
  | 'server'
  | 'pipeline'
  | 'chart'
  | 'lock'
  | 'shield'
  | 'terminal'
  | 'globe'

/** Original marks. No vendor logos. */
export const Glyph: React.FC<{ name: GlyphName; className?: string }> = ({ name, className = 'h-[76px] w-[76px]' }) => (
  <svg viewBox="0 0 80 80" className={className}>
    <rect width="80" height="80" rx="16" className={name === 'server' || name === 'database' ? 'fill-signal' : 'fill-brand'} />
    {name === 'react' ? (
      <>
        <ellipse cx="40" cy="40" rx="22" ry="8" className="fill-none stroke-white" strokeWidth="3" />
        <ellipse cx="40" cy="40" rx="22" ry="8" className="fill-none stroke-white" strokeWidth="3" transform="rotate(60 40 40)" />
        <ellipse cx="40" cy="40" rx="22" ry="8" className="fill-none stroke-white" strokeWidth="3" transform="rotate(120 40 40)" />
        <circle cx="40" cy="40" r="4" className="fill-white" />
      </>
    ) : null}
    {name === 'nginx' ? (
      <path d="M28 18h8l16 44h-8L28 18zm16 0h8L36 62h-8l16-44z" className="fill-white" />
    ) : null}
    {name === 'auth' ? (
      <>
        <circle cx="32" cy="36" r="10" className="fill-none stroke-white" strokeWidth="4" />
        <path d="M40 36h22v8H54v6h-8v-6H40" className="fill-none stroke-white" strokeWidth="4" strokeLinejoin="round" />
      </>
    ) : null}
    {name === 'database' ? (
      <>
        <ellipse cx="40" cy="24" rx="18" ry="8" className="fill-none stroke-white" strokeWidth="4" />
        <path d="M22 24v32c0 4.4 8 8 18 8s18-3.6 18-8V24" className="fill-none stroke-white" strokeWidth="4" />
        <path d="M22 40c0 4.4 8 8 18 8s18-3.6 18-8" className="fill-none stroke-white" strokeWidth="4" />
      </>
    ) : null}
    {name === 'server' ? (
      <>
        <rect x="20" y="18" width="40" height="14" rx="3" className="fill-none stroke-white" strokeWidth="3" />
        <rect x="20" y="36" width="40" height="14" rx="3" className="fill-none stroke-white" strokeWidth="3" />
        <circle cx="28" cy="25" r="2" className="fill-white" />
        <circle cx="28" cy="43" r="2" className="fill-white" />
      </>
    ) : null}
    {name === 'pipeline' ? <path d="M18 48h14V28h16v20h14" className="fill-none stroke-white" strokeWidth="4" strokeLinejoin="round" /> : null}
    {name === 'chart' ? <path d="M18 54V40h10v14H18zm16 0V26h10v28H34zm16 0V18h10v36H50z" className="fill-white" /> : null}
    {name === 'lock' ? (
      <>
        <rect x="22" y="36" width="36" height="26" rx="4" className="fill-none stroke-white" strokeWidth="4" />
        <path d="M30 36v-8a10 10 0 0 1 20 0v8" className="fill-none stroke-white" strokeWidth="4" />
      </>
    ) : null}
    {name === 'shield' ? <path d="M40 16l20 8v16c0 14-8 22-20 26-12-4-20-12-20-26V24l20-8z" className="fill-none stroke-white" strokeWidth="4" /> : null}
    {name === 'terminal' ? <path d="M22 28l12 12-12 12M40 52h18" className="fill-none stroke-white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /> : null}
    {name === 'globe' ? (
      <>
        <circle cx="40" cy="40" r="18" className="fill-none stroke-white" strokeWidth="4" />
        <ellipse cx="40" cy="40" rx="8" ry="18" className="fill-none stroke-white" strokeWidth="3" />
        <path d="M22 40h36M26 30h28M26 50h28" className="fill-none stroke-white" strokeWidth="3" />
      </>
    ) : null}
  </svg>
)
