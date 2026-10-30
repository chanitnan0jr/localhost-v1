import type { JMove, Move, Rng, State } from './types'

// Stub so the terminal can be wired up first; Agent A replaces both bodies.
export function pickJoker(s: State, rnd: Rng = Math.random): JMove {
  return 'normal'
}

export function resolve(s: State, p: Move, j: JMove, rnd: Rng = Math.random): { next: State; taken: number; dealt: number; over: boolean } {
  return { next: { ...s, turn: s.turn + 1 }, taken: 0, dealt: 0, over: false }
}
