import { AbsoluteFill, Html5Audio, interpolate, Sequence, Series, staticFile, useVideoConfig } from 'remotion'
import { StripeWipe, WIPE_CUT, WIPE_FRAMES } from './components/StripeWipe'
import { CLAMP } from './lib/anim'
import { SCENE_COMPONENTS } from './scenes'
import { MUSIC, MUSIC_VOLUME, SCENES, WIPES } from './script'

export const VibePromo: React.FC = () => {
  const { durationInFrames } = useVideoConfig()
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

      {MUSIC ? (
        <Html5Audio
          src={staticFile(MUSIC)}
          volume={(f) => interpolate(f, [durationInFrames - 24, durationInFrames], [MUSIC_VOLUME, 0], CLAMP)}
        />
      ) : null}
    </AbsoluteFill>
  )
}
