import { expect, test } from 'bun:test'
import { pickJoker, resolve, share } from './engine'
import { ATTACK_DAMAGE, DEFEND_TAKEN, JOKER_DAMAGE, MAX_SP, SP_GAIN, START } from './rules'
import type { Move, State } from './types'

const at = (change: Partial<State>): State => ({ ...START, ...change })
const low = () => 0.1
const high = () => 0.9

test('evade vs precise takes the full hit', () => {
  const r = resolve(START, 'evade', 'precise', low)
  expect(r.taken).toBe(JOKER_DAMAGE.precise)
  expect(r.dealt).toBe(0)
  expect(r.next.hp).toBe(START.hp - JOKER_DAMAGE.precise)
})

test('evade dodges normal and crit, and charge does nothing', () => {
  for (const j of ['normal', 'crit', 'charge'] as const) {
    const r = resolve(START, 'evade', j, low)
    expect(r.taken).toBe(0)
    expect(r.dealt).toBe(0)
    expect(r.next.hp).toBe(START.hp)
  }
})

test('evade vs ultimate is a gamble decided by rnd', () => {
  const ready = at({ jsp: MAX_SP })
  const dodged = resolve(ready, 'evade', 'ultimate', low)
  expect(dodged.taken).toBe(0)
  expect(dodged.next.hp).toBe(START.hp)

  const hit = resolve(ready, 'evade', 'ultimate', high)
  expect(hit.taken).toBe(JOKER_DAMAGE.ultimate)
  expect(hit.next.hp).toBe(START.hp - JOKER_DAMAGE.ultimate)

  // The rule is a strict rnd() < 0.5, so exactly 0.5 is a hit; a dodged ultimate still spends the SP.
  expect(resolve(ready, 'evade', 'ultimate', () => 0.5).taken).toBe(JOKER_DAMAGE.ultimate)
  expect(dodged.next.jsp).toBe(0)
})

test('defend vs crit takes 6', () => {
  const r = resolve(START, 'defend', 'crit', low)
  expect(r.taken).toBe(6)
  expect(r.dealt).toBe(0)
  expect(r.next.hp).toBe(94)
})

test('defend vs charge takes nothing and deals nothing', () => {
  const r = resolve(START, 'defend', 'charge', low)
  expect(r.taken).toBe(0)
  expect(r.dealt).toBe(0)
})

test('counter vs crit takes 20 and deals 18', () => {
  const r = resolve(START, 'counter', 'crit', low)
  expect(r.taken).toBe(20)
  expect(r.dealt).toBe(18)
  expect(r.next.hp).toBe(80)
  expect(r.next.jhp).toBe(82)
})

test('counter vs charge: taken 0 and dealt 0', () => {
  const r = resolve(START, 'counter', 'charge', low)
  expect(r.taken).toBe(0)
  expect(r.dealt).toBe(0)
  expect(r.next.hp).toBe(START.hp)
  expect(r.next.jhp).toBe(START.jhp)
})

test('counter does not land when the hit knocks the visitor out', () => {
  const r = resolve(at({ hp: 20 }), 'counter', 'crit', low)
  expect(r.taken).toBe(20)
  expect(r.dealt).toBe(0)
  expect(r.next.hp).toBe(0)
  expect(r.next.jhp).toBe(START.jhp)
  expect(r.over).toBe(true)
})

test('attack vs charge is a free hit', () => {
  const r = resolve(START, 'attack', 'charge', low)
  expect(r.dealt).toBe(ATTACK_DAMAGE)
  expect(r.taken).toBe(0)
  expect(r.next.hp).toBe(START.hp)
  expect(r.next.jhp).toBe(START.jhp - ATTACK_DAMAGE)
})

test('attack trades blows with a normal move', () => {
  const r = resolve(START, 'attack', 'normal', low)
  expect(r.dealt).toBe(ATTACK_DAMAGE)
  expect(r.taken).toBe(JOKER_DAMAGE.normal)
})

test('an attack that knocks out the Joker card cancels its hit', () => {
  const r = resolve(at({ jhp: ATTACK_DAMAGE, jsp: MAX_SP }), 'attack', 'ultimate', low)
  expect(r.dealt).toBe(ATTACK_DAMAGE)
  expect(r.taken).toBe(0)
  expect(r.next.hp).toBe(START.hp)
  expect(r.next.jhp).toBe(0)
  expect(r.next.jsp).toBe(MAX_SP) // the Joker never acted, so its SP is untouched
  expect(r.over).toBe(true)
})

test('pickJoker returns ultimate when SP is full', () => {
  expect(pickJoker(at({ jsp: MAX_SP }), () => 0)).toBe('ultimate')
})

test('pickJoker walks the weights with clean boundaries', () => {
  const cases = [
    [0, 'normal'],
    [0.39, 'normal'],
    [0.4, 'crit'],
    [0.59, 'crit'],
    [0.6, 'precise'],
    [0.79, 'precise'],
    [0.8, 'charge'],
    [0.999, 'charge'],
  ] as const
  for (const [r, move] of cases) expect(pickJoker(START, () => r)).toBe(move)
})

test('share floors without floating-point drift', () => {
  expect(share(20, 0.3)).toBe(6)
  expect(share(20, 0.9)).toBe(18)
  expect(Math.floor(0.57 * 100)).toBe(56) // the drift this guards against
  expect(share(100, 0.57)).toBe(57)
})

test('HP never goes negative and taken is the HP that was left', () => {
  const r = resolve(at({ hp: 10, jsp: MAX_SP }), 'attack', 'ultimate', low)
  expect(r.next.hp).toBe(0)
  expect(r.taken).toBe(10)

  const k = resolve(at({ jhp: 5 }), 'attack', 'normal', low)
  expect(k.next.jhp).toBe(0)
  expect(k.dealt).toBe(5)

  const c = resolve(at({ jhp: 10 }), 'counter', 'crit', low)
  expect(c.next.jhp).toBe(0)
  expect(c.dealt).toBe(10)
})

test('SP rises by the move used and is clamped at MAX_SP', () => {
  expect(resolve(START, 'defend', 'normal', low).next.jsp).toBe(SP_GAIN.normal)
  expect(resolve(START, 'defend', 'charge', low).next.jsp).toBe(SP_GAIN.charge)
  expect(resolve(at({ jsp: 90 }), 'defend', 'charge', low).next.jsp).toBe(MAX_SP)
})

test('ultimate resets SP to 0', () => {
  const r = resolve(at({ jsp: MAX_SP }), 'defend', 'ultimate', low)
  expect(r.next.jsp).toBe(0)
  expect(r.taken).toBe(share(JOKER_DAMAGE.ultimate, DEFEND_TAKEN))
})

test('each turn advances the turn counter by one', () => {
  expect(resolve(at({ turn: 7 }), 'defend', 'normal', low).next.turn).toBe(8)
})

test('the game ends when the visitor reaches 0 HP', () => {
  const r = resolve(at({ hp: JOKER_DAMAGE.normal }), 'defend', 'normal', low)
  expect(r.over).toBe(false)
  const lost = resolve(at({ hp: JOKER_DAMAGE.normal }), 'attack', 'normal', low)
  expect(lost.next.hp).toBe(0)
  expect(lost.over).toBe(true)
})

test('the game ends when the Joker card reaches 0 HP', () => {
  const r = resolve(at({ jhp: ATTACK_DAMAGE + 1 }), 'attack', 'normal', low)
  expect(r.over).toBe(false)
  const won = resolve(at({ jhp: ATTACK_DAMAGE }), 'attack', 'normal', low)
  expect(won.next.jhp).toBe(0)
  expect(won.over).toBe(true)
})

test('a finished state is returned unchanged', () => {
  for (const done of [at({ hp: 0, turn: 9 }), at({ jhp: 0, turn: 9 })]) {
    const r = resolve(done, 'attack', 'crit', low)
    expect(r.next).toEqual(done)
    expect(r.next).not.toBe(done)
    expect(r.taken).toBe(0)
    expect(r.dealt).toBe(0)
    expect(r.over).toBe(true)
  }
})

test('the input state is never mutated', () => {
  const s = Object.freeze(at({ hp: 50, jhp: 50, jsp: 60, turn: 4 }))
  for (const p of ['attack', 'defend', 'evade', 'counter'] as Move[]) {
    for (const j of ['normal', 'crit', 'precise', 'charge', 'ultimate'] as const) {
      resolve(s, p, j, high)
      pickJoker(s, high)
    }
  }
  expect(s).toEqual({ hp: 50, jhp: 50, jsp: 60, turn: 4 })
})
