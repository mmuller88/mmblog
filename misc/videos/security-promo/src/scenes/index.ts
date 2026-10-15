import type { BeatId } from '../script'
import { EndCard } from './EndCard'
import { Hook } from './Hook'
import { Report } from './Report'
import { Review } from './Review'
import { Scope } from './Scope'
import { Stack } from './Stack'

export const SCENE_COMPONENTS: Record<BeatId, React.FC> = {
  hook: Hook,
  scope: Scope,
  review: Review,
  report: Report,
  stack: Stack,
  end: EndCard,
}
