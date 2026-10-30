import { pickJoker, resolve } from './engine'
import { jokerReply, moodFor } from './joker'
import { JOKER_DAMAGE, JOKER_MAX_HP, MAX_SP, PLAYER_MAX_HP, START } from './rules'
import type { JMove, Mood, Move, Rng, State } from './types'

// Pure text layer for the terminal duel: the engine does the math, this turns its result into lines.
export interface Duel {
  state: State
  mood: Mood
  lastJMove?: JMove
}

export interface DuelStep {
  duel: Duel | null
  lines: string[]
}

export const DUEL_COMMANDS = ['attack', 'defend', 'evade', 'counter', 'quit']
const MOVES: string[] = ['attack', 'defend', 'evade', 'counter']

const RULE = `+${'-'.repeat(46)}+`
const row = (text: string) => `|${text.padEnd(46)}|`

export const RULES_TABLE = [
  '+---------+--------------------+---------------------+',
  '| MOVE    | WORKS AGAINST      | WEAK AGAINST        |',
  '+---------+--------------------+---------------------+',
  '| attack  | charge (free hit)  | trades blows        |',
  '| defend  | any hit (-70%)     | charge (wasted)     |',
  '| evade   | normal, crit       | precise (no dodge)  |',
  '| counter | any hit (hits back)| you take full dmg   |',
  '+---------+--------------------+---------------------+',
  ' ultimate: evade is a 50/50 gamble',
]

const normalize = (input: string) => input.trim().replace(/\s+/g, ' ').toLowerCase()

// e.g. "[##########----------]" for 52 of 100; the value is clamped to 0..max.
export function bar(value: number, max: number): string {
  const filled = Math.round((Math.min(max, Math.max(0, value)) / max) * 20)
  return `[${'#'.repeat(filled)}${'-'.repeat(20 - filled)}]`
}

const stat = (label: string, value: number, max: number) =>
  row(`${label}${bar(value, max)}${String(Math.min(max, Math.max(0, value))).padStart(5)} / ${max} `)

export function hud(s: State): string[] {
  return [
    RULE,
    row(`  ROUND ${s.turn}`),
    RULE,
    stat('  YOU    HP ', s.hp, PLAYER_MAX_HP),
    stat('  JOKER  HP ', s.jhp, JOKER_MAX_HP),
    stat('         SP ', s.jsp, MAX_SP),
    RULE,
    row('  attack    defend    evade    counter'),
    RULE,
  ]
}

// One "JOKER: ..." line, or nothing when the Joker has no reply.
export function jokerLines(input: string, mood: Mood): string[] {
  const reply = jokerReply(normalize(input), mood).trim()
  return reply ? [`  JOKER: ${reply}`] : []
}

function outcome(move: Move, jmove: JMove, taken: number, dealt: number): string {
  if (jmove === 'charge') return move === 'attack' ? `free hit for ${dealt}` : `you ${move}, but no hit comes`
  if (move === 'attack') return `you took ${taken}  |  you hit for ${dealt}`
  if (move === 'defend') return `you took ${taken} (blocked 70%)`
  if (move === 'evade') return taken === 0 ? 'you dodged it' : `you took ${taken}  |  no dodge`
  return `you took ${taken}  |  you hit back for ${dealt}`
}

const endScreen = (title: string, rounds: number, left: string, replay: string) => [
  RULE,
  row(`   ${title}`),
  row(`${`   rounds: ${rounds}`.padEnd(20)}${left}`),
  RULE,
  ` type "play" to ${replay}`,
]

export function startDuel(showRules: boolean): DuelStep {
  const state = { ...START }
  return {
    duel: { state, mood: 'idle' },
    lines: [...(showRules ? RULES_TABLE : []), ' the Joker deals you in. type quit to fold.', ...hud(state)],
  }
}

export function duelInput(duel: Duel, input: string, rnd?: Rng): DuelStep {
  const command = normalize(input)
  if (command === 'quit') {
    return { duel: null, lines: ['  you fold. the Joker card slips back into the deck.', ' type "play" to duel again'] }
  }
  if (!MOVES.includes(command)) {
    return { duel, lines: ['  only attack, defend, evade, counter or quit work mid-duel', ...jokerLines(command, duel.mood)] }
  }

  const move = command as Move
  const jmove = pickJoker(duel.state, rnd)
  const { next, taken, dealt } = resolve(duel.state, move, jmove, rnd)
  const lines = [
    jmove === 'charge' ? '  JOKER is charging up' : `  JOKER used ${jmove.toUpperCase()} (${JOKER_DAMAGE[jmove]})`,
    `  ${outcome(move, jmove, taken, dealt)}`,
  ]
  const rounds = duel.state.turn
  if (next.hp <= 0) return { duel: null, lines: [...lines, ...endScreen('!! BUSTED !!', rounds, `Joker HP left: ${Math.max(0, next.jhp)}`, 'try again')] }
  if (next.jhp <= 0) return { duel: null, lines: [...lines, ...endScreen('HEIST COMPLETE  -  JOKER IS DOWN', rounds, `HP left: ${next.hp}`, 'run it again')] }
  return { duel: { state: next, mood: moodFor(next, jmove), lastJMove: jmove }, lines: [...lines, ...hud(next)] }
}
