import type { JMove, State } from './types'

// Balance numbers for the terminal duel. Change values here only; the engine reads them.
// From the owner's mock: HP and SP out of 100, crit 20, defend blocks 70%, counter returns 18 of a
// 20 hit, SP +15 a turn, evade is a 50/50 gamble against ultimate. The other values are proposals
// to tune after scripts/simulate-duel.ts reports win rates.
export const PLAYER_MAX_HP = 100
export const JOKER_MAX_HP = 100
export const MAX_SP = 100

export const ATTACK_DAMAGE = 15
// Defend takes this share of a hit, rounded down (crit 20 -> 6).
export const DEFEND_TAKEN = 0.3
// Counter takes the full hit, then returns this share of it, rounded down (crit 20 -> 18).
export const COUNTER_RETURN = 0.9

export const JOKER_DAMAGE: Record<JMove, number> = { normal: 12, crit: 20, precise: 15, charge: 0, ultimate: 35 }
// SP gained by the move the Joker uses; ultimate resets SP to 0 instead.
export const SP_GAIN: Record<Exclude<JMove, 'ultimate'>, number> = { normal: 15, crit: 15, precise: 15, charge: 40 }
// Chance of each move while SP is below MAX_SP; at MAX_SP the Joker always uses ultimate.
export const JOKER_WEIGHTS: Record<Exclude<JMove, 'ultimate'>, number> = { normal: 0.4, crit: 0.2, precise: 0.2, charge: 0.2 }
// Evade dodges an ultimate when rnd() is below this value.
export const EVADE_ULTIMATE_CHANCE = 0.5

// The Joker's chance to dodge an attack grows by this much for each attack already in the visitor's
// streak (any other move resets it), up to the cap. After a dodge it counters at the same chance,
// returning COUNTER_RETURN of the dodged attack.
export const JOKER_DODGE_STEP = 0.15
export const JOKER_DODGE_CAP = 0.6

// Free hints per duel; each one tells the truth about the Joker's next move.
export const HINTS_PER_DUEL = 3

export const START: State = { hp: PLAYER_MAX_HP, jhp: JOKER_MAX_HP, jsp: 0, turn: 1, streak: 0 }
