import type { BeatId } from '../script'
import { AiSecure } from './AiSecure'
import { EndCard } from './EndCard'
import { HalloCasa } from './HalloCasa'
import { Hook } from './Hook'
import { QrPlakat } from './QrPlakat'
import { Stack } from './Stack'

export const SCENE_COMPONENTS: Record<BeatId, React.FC> = {
  hook: Hook,
  hallocasa: HalloCasa,
  aisecure: AiSecure,
  qrplakat: QrPlakat,
  stack: Stack,
  end: EndCard,
}
