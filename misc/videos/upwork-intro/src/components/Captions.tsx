import { useCurrentFrame } from 'remotion'
import { LINES } from '../lines'
import { LEAD_FRAMES, SCENES } from '../script'

const MAX_WORDS = 8

/** Split on sentences, then pack to about 8 words so a line stays readable. */
export const captionChunks = (caption: string) => {
  const chunks: string[] = []
  for (const sentence of caption.split(/(?<=[.?!])\s+/)) {
    const words = sentence.split(/\s+/).filter(Boolean)
    for (let i = 0; i < words.length; i += MAX_WORDS) chunks.push(words.slice(i, i + MAX_WORDS).join(' '))
  }
  return chunks
}

export const Captions: React.FC = () => {
  const frame = useCurrentFrame()
  let at = 0
  for (const scene of SCENES) {
    if (frame < at + scene.frames) {
      const spoken = frame - at - LEAD_FRAMES
      if (spoken < 0 || spoken >= scene.audioFrames) return null
      const line = LINES.find((item) => item.id === scene.id)
      if (!line) return null
      const chunks = captionChunks(line.caption)
      const weights = chunks.map((chunk) => chunk.split(/\s+/).length)
      const total = weights.reduce((sum, n) => sum + n, 0)
      const cursor = (spoken / scene.audioFrames) * total
      let acc = 0
      let index = chunks.length - 1
      for (let i = 0; i < weights.length; i++) {
        acc += weights[i]
        if (cursor < acc) {
          index = i
          break
        }
      }
      return (
        <div className="absolute inset-x-0 bottom-0 flex h-[112px] items-center justify-center bg-navy/85 px-20">
          <p className="text-center font-display text-[40px] leading-tight font-bold text-white">{chunks[index]}</p>
        </div>
      )
    }
    at += scene.frames
  }
  return null
}
