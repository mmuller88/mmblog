type IconProps = { className?: string }

/** Line icons: colour them with a `stroke-*` class. */
const Line: React.FC<IconProps & { children: React.ReactNode; width?: number }> = ({ className, children, width = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
)

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className} width={3}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Line>
)

export const ArrowIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className} width={2.6}>
    <path d="M4 12h15m-6-6 6 6-6 6" />
  </Line>
)

export const PipelineIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <path d="M6 3v12" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </Line>
)

export const TerminalIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="m7 9 3 3-3 3M12.5 15H17" />
  </Line>
)

export const CloudIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z" />
  </Line>
)

export const RollbackIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </Line>
)

export const BellIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8h-17S6 15 6 9Z" />
    <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
  </Line>
)

export const ServerIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <rect x="3" y="3" width="18" height="7" rx="2" />
    <rect x="3" y="14" width="18" height="7" rx="2" />
    <path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6" />
  </Line>
)

export const ChartIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <path d="M3 12h4l3-8 4 16 3-8h4" />
  </Line>
)

export const RocketIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <path d="M12 15 9 12c1.6-4.6 5.2-8.3 11-9-.7 5.8-4.4 9.4-9 11Z" />
    <path d="M9 12H5l2.5-4H12M12 15v4l4-2.5V12" />
    <path d="M6.5 17.5c-1.5.5-2.3 1.9-2.5 3.5 1.6-.2 3-1 3.5-2.5" />
  </Line>
)

export const BoxIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <path d="M12 3 4 7v10l8 4 8-4V7Z" />
    <path d="m4 7 8 4 8-4M12 11v10" />
  </Line>
)

export const FlaskIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <path d="M9.5 3h5M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3" />
    <path d="M7.5 15h9" />
  </Line>
)
