import type { BeatId } from '../script'
import { EndCard } from './EndCard'
import { Flow } from './Flow'
import { Hook } from './Hook'
import { Observe } from './Observe'
import { Split } from './Split'
import { Stack } from './Stack'

export const SCENE_COMPONENTS: Record<BeatId, React.FC> = {
  hook: Hook,
  split: Split,
  flow: Flow,
  observe: Observe,
  stack: Stack,
  end: EndCard,
}
