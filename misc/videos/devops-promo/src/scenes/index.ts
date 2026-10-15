import type { BeatId } from '../script'
import { EndCard } from './EndCard'
import { Gaps } from './Gaps'
import { Hook } from './Hook'
import { PathMap } from './PathMap'
import { Roadmap } from './Roadmap'
import { Stack } from './Stack'

export const SCENE_COMPONENTS: Record<BeatId, React.FC> = {
  hook: Hook,
  map: PathMap,
  gaps: Gaps,
  roadmap: Roadmap,
  stack: Stack,
  end: EndCard,
}
