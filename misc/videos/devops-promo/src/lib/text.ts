export type Token = { text: string; accent: boolean }

/** Splits a copy line into words; `*word*` marks an accent word. */
export const tokenize = (line: string): Token[] =>
  line
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      const accent = word.length > 2 && word.startsWith('*') && word.endsWith('*')
      return { text: accent ? word.slice(1, -1) : word, accent }
    })
