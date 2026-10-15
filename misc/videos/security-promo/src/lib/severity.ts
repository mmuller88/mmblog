import type { Severity } from '../script'

/** Static class sets per severity (Tailwind cannot see interpolated class names). */
export const SEVERITY: Record<Severity, { label: string; text: string; badge: string; row: string; bar: string }> = {
  critical: {
    label: 'Critical',
    text: 'text-hot',
    badge: 'bg-hot/20 text-hot ring-hot/60',
    row: 'ring-hot/55 shadow-[0_0_44px_-10px_rgba(255,56,100,0.85)]',
    bar: 'bg-hot shadow-[0_0_24px_rgba(255,56,100,0.85)]',
  },
  high: {
    label: 'High',
    text: 'text-orange',
    badge: 'bg-orange/15 text-orange ring-orange/50',
    row: 'ring-orange/35',
    bar: 'bg-orange shadow-[0_0_20px_rgba(255,122,26,0.7)]',
  },
  medium: {
    label: 'Medium',
    text: 'text-amber',
    badge: 'bg-amber/15 text-amber ring-amber/50',
    row: 'ring-white/10',
    bar: 'bg-amber shadow-[0_0_18px_rgba(255,176,32,0.6)]',
  },
  low: {
    label: 'Low',
    text: 'text-steel',
    badge: 'bg-steel/15 text-steel ring-steel/40',
    row: 'ring-white/10',
    bar: 'bg-steel',
  },
}
