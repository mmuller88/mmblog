import { AbsoluteFill, Html5Audio, Sequence, Series, staticFile } from 'remotion'
import { Captions } from './components/Captions'
import { StripeWipe, WIPE_CUT, WIPE_FRAMES } from './components/StripeWipe'
import { SCENE_COMPONENTS } from './scenes'
import { LEAD_FRAMES, SCENES, WIPES } from './script'

export const UpworkIntro: React.FC = () => {
  const starts: number[] = []
  SCENES.reduce((at, scene) => {
    starts.push(at)
    return at + scene.frames
  }, 0)

  return (
    <AbsoluteFill className="overflow-hidden bg-navy">
      <Series>
        {SCENES.map(({ id, frames }) => {
          const Scene = SCENE_COMPONENTS[id]
          return (
            <Series.Sequence key={id} name={id} durationInFrames={frames}>
              <Scene />
            </Series.Sequence>
          )
        })}
      </Series>

      {SCENES.map(({ id }, i) => {
        const direction = WIPES[id]
        if (!direction) return null
        return (
          <Sequence key={`wipe-${id}`} name={`wipe → ${id}`} from={starts[i] - WIPE_CUT} durationInFrames={WIPE_FRAMES}>
            <StripeWipe direction={direction} />
          </Sequence>
        )
      })}

      {SCENES.map((scene, i) => (
        <Sequence key={`voice-${scene.id}`} from={starts[i] + LEAD_FRAMES} durationInFrames={scene.audioFrames}>
          <Html5Audio src={staticFile(`voice/${scene.file}`)} />
        </Sequence>
      ))}

      <Captions />
    </AbsoluteFill>
  )
}
