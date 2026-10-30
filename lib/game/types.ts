// Shared contract for the terminal duel. Agents import these types and must not edit this file.
export type Move = 'attack' | 'defend' | 'evade' | 'counter'
export type JMove = 'normal' | 'crit' | 'precise' | 'charge' | 'ultimate'
export type Mood = 'idle' | 'smug' | 'hurt' | 'charging'
// streak counts the visitor's attacks in a row; the Joker dodges more often the longer it gets.
export interface State { hp: number; jhp: number; jsp: number; turn: number; streak: number }
export interface TurnResult { next: State; jmove: JMove; taken: number; dealt: number; over: boolean; dodged: boolean; countered: number }
// Random source in [0, 1); tests pass a fixed value such as () => 0.1.
export type Rng = () => number
