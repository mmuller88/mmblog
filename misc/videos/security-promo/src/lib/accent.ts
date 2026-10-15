export type Accent = 'magenta' | 'cyan' | 'green'

/** Static class sets per neon accent (Tailwind cannot see interpolated class names). */
export const ACCENT = {
  magenta: {
    hex: '#ff2bd6',
    text: 'text-magenta',
    bg: 'bg-magenta',
    fill: 'fill-magenta',
    border: 'border-magenta',
    ring: 'ring-magenta/50',
    glow: 'shadow-[0_0_80px_-20px_rgba(255,43,214,0.75)]',
    packet: 'shadow-[0_0_26px_8px_rgba(255,43,214,0.9)]',
  },
  cyan: {
    hex: '#00e5ff',
    text: 'text-cyan',
    bg: 'bg-cyan',
    fill: 'fill-cyan',
    border: 'border-cyan',
    ring: 'ring-cyan/50',
    glow: 'shadow-[0_0_80px_-20px_rgba(0,229,255,0.7)]',
    packet: 'shadow-[0_0_26px_8px_rgba(0,229,255,0.9)]',
  },
  green: {
    hex: '#9dff3c',
    text: 'text-neon',
    bg: 'bg-neon',
    fill: 'fill-neon',
    border: 'border-neon',
    ring: 'ring-neon/50',
    glow: 'shadow-[0_0_80px_-20px_rgba(157,255,60,0.7)]',
    packet: 'shadow-[0_0_26px_8px_rgba(157,255,60,0.9)]',
  },
} as const

/** Headline accent words: chromatic split plus neon glow. */
export const ACCENT_WORD = {
  magenta: 'italic text-white [text-shadow:-4px_0_0_#ff2bd6,4px_0_0_#00e5ff,0_0_24px_rgba(255,43,214,0.95)]',
  cyan: 'italic text-white [text-shadow:-4px_0_0_#ff2bd6,4px_0_0_#00e5ff,0_0_24px_rgba(0,229,255,0.95)]',
  green: 'italic text-neon [text-shadow:-3px_0_0_#ff2bd6,3px_0_0_#00e5ff,0_0_26px_rgba(157,255,60,0.9)]',
} as const
