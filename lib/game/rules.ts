import type { JMove, State } from './types'

// Balance numbers for the terminal duel. Change values here only; the engine reads them.
export const PLAYER_MAX_HP = 30
export const JOKER_MAX_HP = 30
export const MAX_SP = 100

export const ATTACK_DAMAGE = 6
// A counter only lands against a normal attack and returns this much.
export const COUNTER_DAMAGE = 9

export const JOKER_DAMAGE: Record<JMove, number> = { normal: 6, crit: 12, precise: 8, charge: 0, ultimate: 20 }
// SP gained by the move the Joker uses; ultimate resets SP to 0 instead.
export const SP_GAIN: Record<Exclude<JMove, 'ultimate'>, number> = { normal: 20, crit: 20, precise: 20, charge: 40 }
// Chance of each move while SP is below MAX_SP; at MAX_SP the Joker always uses ultimate.
export const JOKER_WEIGHTS: Record<Exclude<JMove, 'ultimate'>, number> = { normal: 0.4, crit: 0.2, precise: 0.2, charge: 0.2 }
// Evade dodges an ultimate when rnd() is below this value.
export const EVADE_ULTIMATE_CHANCE = 0.5

export const START: State = { hp: PLAYER_MAX_HP, jhp: JOKER_MAX_HP, jsp: 0, turn: 1 }
