import { dodgeChance, pickJoker, resolve } from './engine'
import { jokerHint, jokerReply, jokerTalk, JOKER_NO_HINT, moodFor } from './joker'
import { HINTS_PER_DUEL, JOKER_DAMAGE, JOKER_MAX_HP, MAX_SP, PLAYER_MAX_HP, START } from './rules'
import type { JMove, Mood, Move, Rng, State } from './types'

// Pure text layer for the terminal duel: the engine does the math, this turns its result into lines.
export interface Duel {
  state: State
  mood: Mood
  lastJMove?: JMove
  // The Joker picks its move when the round starts, so a hint can tell the truth about it.
  next: JMove
  hints: number
  talks: number
}

export interface DuelStep {
  duel: Duel | null
  lines: string[]
}

export const DUEL_COMMANDS = ['attack', 'defend', 'evade', 'counter', 'hint', 'talk', 'stop', 'quit']
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
  ' streak: each attack in a row gives the Joker +15% to dodge (max 60%);',
  ' after a dodge it counters at the same chance',
  ' hint: the Joker tips its next move (3 per duel, no turn used)',
  ' talk: chat with the Joker (no turn used)    stop: end the duel',
]

const percent = (chance: number) => `${Math.round(chance * 100)}%`
const normalize = (input: string) => input.trim().replace(/\s+/g, ' ').toLowerCase()

// e.g. "[##########----------]" for 52 of 100; the value is clamped to 0..max.
export function bar(value: number, max: number): string {
  const filled = Math.round((Math.min(max, Math.max(0, value)) / max) * 20)
  return `[${'#'.repeat(filled)}${'-'.repeat(20 - filled)}]`
}

const stat = (label: string, value: number, max: number) =>
  row(`${label}${bar(value, max)}${String(Math.min(max, Math.max(0, value))).padStart(5)} / ${max} `)

export function hud(s: State, hints = HINTS_PER_DUEL): string[] {
  return [
    RULE,
    row(`  ROUND ${s.turn}`),
    RULE,
    stat('  YOU    HP ', s.hp, PLAYER_MAX_HP),
    stat('  JOKER  HP ', s.jhp, JOKER_MAX_HP),
    stat('         SP ', s.jsp, MAX_SP),
    RULE,
    // The mock's row while the Joker cannot dodge; during a streak the attack cell shows the dodge chance.
    row(dodgeChance(s.streak) > 0 ? `  attack (${percent(dodgeChance(s.streak))} dodge)  defend  evade  counter` : '  attack    defend    evade    counter'),
    row(`  hint (${hints} left)    talk    stop`),
    RULE,
  ]
}

// One "JOKER: ..." line, or nothing when the Joker has no reply.
export function jokerLines(input: string, mood: Mood): string[] {
  const reply = jokerReply(normalize(input), mood).trim()
  return reply ? [`  JOKER: ${reply}`] : []
}

function outcome(move: Move, jmove: JMove, taken: number, dealt: number, dodged: boolean): string {
  if (dodged) return `you took ${taken}  |  your attack missed`
  if (jmove === 'charge') return move === 'attack' ? `free hit for ${dealt}` : `you ${move}, but no hit comes`
  if (move === 'attack') return `you took ${taken}  |  you hit for ${dealt}`
  if (move === 'defend') return `you took ${taken} (blocked ${JOKER_DAMAGE[jmove] - taken})`
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

export function startDuel(showRules: boolean, rnd?: Rng): DuelStep {
  const state = { ...START }
  return {
    duel: { state, mood: 'idle', next: pickJoker(state, rnd), hints: HINTS_PER_DUEL, talks: 0 },
    lines: [...(showRules ? RULES_TABLE : []), ' the Joker deals you in. type quit to fold.', ...hud(state)],
  }
}

export function duelInput(duel: Duel, input: string, rnd?: Rng): DuelStep {
  const command = normalize(input)
  if (command === 'quit' || command === 'stop') {
    return { duel: null, lines: ['  you fold. the Joker card slips back into the deck.', ' type "play" to duel again'] }
  }
  // Hint and talk are free: they never use the round or change the Joker's chosen move.
  if (command === 'hint') {
    if (duel.hints === 0) return { duel, lines: [`  JOKER: ${JOKER_NO_HINT}`] }
    const hints = duel.hints - 1
    return { duel: { ...duel, hints }, lines: [`  JOKER: ${jokerHint(duel.next)}`, `  (${hints} ${hints === 1 ? 'hint' : 'hints'} left)`] }
  }
  if (command === 'talk') {
    return { duel: { ...duel, talks: duel.talks + 1 }, lines: [`  JOKER: ${jokerTalk(duel.mood, duel.talks)}`] }
  }
  if (!MOVES.includes(command)) {
    return { duel, lines: ['  only attack, defend, evade, counter, hint, talk or stop work mid-duel', ...jokerLines(command, duel.mood)] }
  }

  const move = command as Move
  const jmove = duel.next
  const { next, taken, dealt, dodged, countered } = resolve(duel.state, move, jmove, rnd)
  const chance = percent(dodgeChance(duel.state.streak))
  // The engine cancels the Joker's move when an attack knocks it out, so never name a move that did not happen.
  const lines = move === 'attack' && next.jhp <= 0
    ? ['  the Joker card falls before it can act', `  you hit for ${dealt}`]
    : [
        ...(dodged ? [`  JOKER dodged your attack (${chance})${countered ? ` and countered for ${countered}` : ''}`] : []),
        jmove === 'charge' ? '  JOKER is charging up' : `  JOKER used ${jmove.toUpperCase()} (${JOKER_DAMAGE[jmove]})`,
        `  ${outcome(move, jmove, taken, dealt, dodged)}`,
      ]
  const rounds = duel.state.turn
  if (next.hp <= 0) return { duel: null, lines: [...lines, ...endScreen('!! BUSTED !!', rounds, `Joker HP left: ${Math.max(0, next.jhp)}`, 'try again')] }
  if (next.jhp <= 0) return { duel: null, lines: [...lines, ...endScreen('HEIST COMPLETE  -  JOKER IS DOWN', rounds, `HP left: ${next.hp}`, 'run it again')] }
  const after: Duel = { ...duel, state: next, mood: moodFor(next, jmove), lastJMove: jmove, next: pickJoker(next, rnd) }
  return { duel: after, lines: [...lines, ...hud(next, after.hints)] }
}
