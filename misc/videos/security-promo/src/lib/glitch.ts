import { random } from 'remotion'

/** 1 on frame `at`, fading linearly to 0 over `len` frames; 0 outside. */
export const burst = (frame: number, at: number, len = 8) => (frame < at || frame >= at + len ? 0 : 1 - (frame - at) / len)

/** Deterministic value in -1..1 that holds for `hold` frames. */
export const jitter = (seed: string, frame: number, hold = 2) => random(`${seed}-${Math.floor(frame / hold)}`) * 2 - 1

/** True on rare, deterministic frames. */
export const spike = (seed: string, frame: number, chance = 0.04) => random(`${seed}-spike-${frame}`) < chance
