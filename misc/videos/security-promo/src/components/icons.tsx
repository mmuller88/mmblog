type IconProps = { className?: string }

/** Line icons: colour them with a `stroke-*` class. */
const Line: React.FC<IconProps & { children: React.ReactNode; width?: number }> = ({ className, children, width = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
)

export const LockIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Z" />
  </svg>
)

/** Filled shield (`fill-*`) with a check mark (`checkClassName`, a `stroke-*` class). */
export const ShieldIcon: React.FC<IconProps & { checkClassName?: string }> = ({ className, checkClassName = 'stroke-night' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12 2.5 4.5 5.4v5.8c0 4.7 3.1 8.7 7.5 10.3 4.4-1.6 7.5-5.6 7.5-10.3V5.4Z" />
    <path d="m8.6 12.1 2.4 2.4 4.5-4.8" fill="none" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className={checkClassName} />
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

export const PenIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className} width={2.4}>
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Line>
)

export const BrowserIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18M10 13l-2 2 2 2M14 13l2 2-2 2" />
  </Line>
)

export const KeyIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <circle cx="8" cy="15" r="4.5" />
    <path d="m11.2 11.8 8.3-8.3M16.5 6.5l2.5 2.5M14 9l2 2" />
  </Line>
)

export const NetworkIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
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

export const BugIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <rect x="7" y="7" width="10" height="13" rx="5" />
    <path d="M9.5 4.5 11 7M14.5 4.5 13 7M3.5 13H7M17 13h3.5M4.5 19l2.8-1.8M19.5 19l-2.8-1.8M4.5 7.5 7.3 9M19.5 7.5 16.7 9M12 11v9" />
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

export const ReportIcon: React.FC<IconProps> = ({ className }) => (
  <Line className={className}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3v5h5M9 13h6M9 17h6M9 9h2" />
  </Line>
)
