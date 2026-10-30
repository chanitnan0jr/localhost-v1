import {
  ATTACK_DAMAGE,
  COUNTER_RETURN,
  DEFEND_TAKEN,
  EVADE_ULTIMATE_CHANCE,
  JOKER_DAMAGE,
  JOKER_WEIGHTS,
  MAX_SP,
  SP_GAIN,
} from './rules'
import type { JMove, Move, Rng, State } from './types'

// Absorbs floating-point drift: 0.4 + 0.2 is 0.6000000000000001 and 0.57 * 100 is 56.99999999999999.
const EPSILON = 1e-9

// The order the Joker's weights are stacked in: normal [0, .4), crit [.4, .6), precise [.6, .8), charge [.8, 1).
const JOKER_ORDER = ['normal', 'crit', 'precise', 'charge'] as const

// A share of a hit, rounded down: share(20, 0.3) = 6 and share(20, 0.9) = 18.
export function share(amount: number, rate: number): number {
  return Math.floor(amount * rate + EPSILON)
}

export function pickJoker(s: State, rnd: Rng = Math.random): JMove {
  if (s.jsp >= MAX_SP) return 'ultimate'

  const r = rnd()
  let edge = 0
  for (const move of JOKER_ORDER) {
    edge += JOKER_WEIGHTS[move]
    // Without EPSILON, r = 0.6 would fall below the drifted edge 0.6000000000000001 and pick crit.
    if (r < edge - EPSILON) return move
  }
  return 'charge'
}

// Damage the visitor would take from the Joker's move, before it is limited to the HP left.
function incoming(p: Move, j: JMove, rnd: Rng): number {
  const raw = JOKER_DAMAGE[j]
  if (p === 'defend') return share(raw, DEFEND_TAKEN)
  if (p === 'evade') {
    if (j === 'precise') return raw // precise cannot be dodged
    if (j === 'ultimate') return rnd() < EVADE_ULTIMATE_CHANCE ? 0 : raw
    return 0 // normal and crit are dodged; charge does no damage
  }
  return raw // attack and counter take the full hit
}

export function resolve(s: State, p: Move, j: JMove, rnd: Rng = Math.random): { next: State; taken: number; dealt: number; over: boolean } {
  // A finished duel stays as it is.
  if (s.hp <= 0 || s.jhp <= 0) return { next: { ...s }, taken: 0, dealt: 0, over: true }

  let hp = s.hp
  let jhp = s.jhp
  let jsp = s.jsp
  let taken = 0
  let dealt = 0

  // 1. Attack lands first.
  if (p === 'attack') {
    dealt = Math.min(ATTACK_DAMAGE, jhp)
    jhp -= dealt
  }

  // 2. The Joker acts, unless the attack knocked its card out.
  if (jhp > 0) {
    taken = Math.min(incoming(p, j, rnd), hp)
    hp -= taken
    jsp = j === 'ultimate' ? 0 : Math.min(MAX_SP, jsp + SP_GAIN[j])
  }

  // 3. Counter returns a share of the hit, but only if the visitor is still standing.
  if (p === 'counter' && hp > 0) {
    dealt = Math.min(share(taken, COUNTER_RETURN), jhp)
    jhp -= dealt
  }

  const next = { hp, jhp, jsp, turn: s.turn + 1 }
  return { next, taken, dealt, over: hp === 0 || jhp === 0 }
}
