// Shared contract for the terminal duel. Agents import these types and must not edit this file.
export type Move = 'attack' | 'defend' | 'evade' | 'counter'
export type JMove = 'normal' | 'crit' | 'precise' | 'charge' | 'ultimate'
export type Mood = 'idle' | 'smug' | 'hurt' | 'charging'
export interface State { hp: number; jhp: number; jsp: number; turn: number }
export interface TurnResult { next: State; jmove: JMove; taken: number; dealt: number; over: boolean }
// Random source in [0, 1); tests pass a fixed value such as () => 0.1.
export type Rng = () => number
