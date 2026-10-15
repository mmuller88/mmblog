import { AbsoluteFill, Html5Audio, interpolate, Sequence, Series, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { ChromaticGlitch } from './components/ChromaticGlitch'
import { CrtOverlay } from './components/CrtOverlay'
import { GlitchWipe, WIPE_CUT, WIPE_FRAMES } from './components/GlitchWipe'
import { CLAMP } from './lib/anim'
import { burst, spike } from './lib/glitch'
import { SCENE_COMPONENTS } from './scenes'
import { type BeatId, MUSIC, MUSIC_VOLUME, SCENES, WIPES } from './script'

const LAST = SCENES[SCENES.length - 1].id

/** Signal lock after each cut, a ramp into the next wipe, and rare micro-glitches. */
const SceneGlitch: React.FC<{ id: BeatId; frames: number; children: React.ReactNode }> = ({ id, frames, children }) => {
  const frame = useCurrentFrame()
  const last = id === LAST
  const ramp = !last && frame >= frames - 5 ? (frame - (frames - 5)) / 5 : 0
  const micro = !last && spike(`micro-${id}`, frame, 0.025) ? 0.35 : 0
  const amount = Math.max(burst(frame, 0, 9), ramp, micro)

  return (
    <ChromaticGlitch id={`scene-${id}`} amount={amount} seed={frame}>
      {children}
    </ChromaticGlitch>
  )
}

export const SecurityPromo: React.FC = () => {
  const { durationInFrames } = useVideoConfig()
  const starts: number[] = []
  SCENES.reduce((at, scene) => {
    starts.push(at)
    return at + scene.frames
  }, 0)

  return (
    <AbsoluteFill className="overflow-hidden bg-night">
      <Series>
        {SCENES.map(({ id, frames }) => {
          const Scene = SCENE_COMPONENTS[id]
          return (
            <Series.Sequence key={id} name={id} durationInFrames={frames}>
              <SceneGlitch id={id} frames={frames}>
                <Scene />
              </SceneGlitch>
            </Series.Sequence>
          )
        })}
      </Series>

      {SCENES.map(({ id }, i) => {
        const direction = WIPES[id]
        if (!direction) return null
        return (
          <Sequence key={`wipe-${id}`} name={`wipe → ${id}`} from={starts[i] - WIPE_CUT} durationInFrames={WIPE_FRAMES}>
            <GlitchWipe direction={direction} seed={id} />
          </Sequence>
        )
      })}

      <CrtOverlay />

      {MUSIC ? (
        <Html5Audio
          src={staticFile(MUSIC)}
          volume={(f) => interpolate(f, [durationInFrames - 24, durationInFrames], [MUSIC_VOLUME, 0], CLAMP)}
        />
      ) : null}
    </AbsoluteFill>
  )
}
