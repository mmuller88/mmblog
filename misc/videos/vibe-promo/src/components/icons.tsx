type IconProps = { className?: string }

export const PinIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
  </svg>
)

export const LockIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Z" />
  </svg>
)

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const SendIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M3.4 20.4 21 12 3.4 3.6 3.3 10l12.4 2-12.4 2 .1 6.4Z" />
  </svg>
)

export const ArrowIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 12h15m-6-6 6 6-6 6" />
  </svg>
)
