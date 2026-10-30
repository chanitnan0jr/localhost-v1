import type { JMove, Mood, State } from './types'

// Stub so the terminal can be wired up first; Agent C replaces both bodies. An empty reply prints nothing.
export function jokerReply(input: string, mood: Mood): string {
  return ''
}

export function moodFor(s: State, lastJMove?: JMove): Mood {
  return 'idle'
}
