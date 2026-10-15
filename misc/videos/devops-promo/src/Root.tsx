import './style.css'
import './fonts'
import { Composition, Folder } from 'remotion'
import { DevopsPromo } from './DevopsPromo'
import { SCENE_COMPONENTS } from './scenes'
import { FPS, HEIGHT, SCENES, TOTAL_FRAMES, WIDTH } from './script'

export const Root: React.FC = () => (
  <>
    <Composition id="DevopsPromo" component={DevopsPromo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Folder name="Beats">
      {SCENES.map(({ id, frames }) => (
        <Composition key={id} id={`Beat-${id}`} component={SCENE_COMPONENTS[id]} durationInFrames={frames} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </Folder>
  </>
)
