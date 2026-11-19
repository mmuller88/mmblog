import type { LineId } from '../script'
import { AiSecure } from './AiSecure'
import { EndCard } from './EndCard'
import { HalloCasa } from './HalloCasa'
import { Handover } from './Handover'
import { Hook } from './Hook'
import { Proof } from './Proof'
import { Stack } from './Stack'

export const SCENE_COMPONENTS: Record<LineId, React.FC> = {
  hook: Hook,
  stack: Stack,
  hallocasa: HalloCasa,
  aisecure: AiSecure,
  proof: Proof,
  handover: Handover,
  end: EndCard,
}
