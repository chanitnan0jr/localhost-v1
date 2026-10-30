// Balance check for the terminal duel: plays many games per visitor strategy and prints win rates.
// Run with: bun scripts/simulate-duel.ts
import { pickJoker, resolve } from '../lib/game/engine'
import { ATTACK_DAMAGE, JOKER_MAX_HP, MAX_SP, START } from '../lib/game/rules'
import type { Move, State } from '../lib/game/types'

const GAMES = 10_000
const TURN_CAP = 100 // a game still running after this many turns is a draw
const WIN_LIMIT = 0.7 // warn when a strategy wins more often than this
const MOVES: Move[] = ['attack', 'defend', 'evade', 'counter']

type Strategy = (s: State) => Move
type Outcome = 'win' | 'loss' | 'draw'

const STRATEGIES: [string, Strategy][] = [
  ['random move', () => MOVES[Math.floor(Math.random() * MOVES.length)]],
  ['attack only', () => 'attack'],
  ['defend only', () => 'defend'],
  ['evade only', () => 'evade'],
  ['counter only', () => 'counter'],
  // Uses only what the visitor can see: a full SP bar means an ultimate is coming.
  ['smart', (s) => (s.jsp >= MAX_SP ? 'defend' : 'attack')],
]

function play(strategy: Strategy): { outcome: Outcome; turns: number } {
  let s = START
  for (let turn = 1; turn <= TURN_CAP; turn++) {
    const result = resolve(s, strategy(s), pickJoker(s))
    s = result.next
    if (result.over) return { outcome: s.jhp === 0 ? 'win' : 'loss', turns: turn }
  }
  return { outcome: 'draw', turns: TURN_CAP }
}

const percent = (n: number) => `${((n / GAMES) * 100).toFixed(1)}%`

console.log(`${GAMES.toLocaleString('en-US')} games per strategy, capped at ${TURN_CAP} turns\n`)
console.log(`${'strategy'.padEnd(14)}${'win'.padStart(8)}${'loss'.padStart(8)}${'draw'.padStart(8)}${'avg turns'.padStart(11)}`)

const tooStrong: string[] = []
for (const [name, strategy] of STRATEGIES) {
  const count = { win: 0, loss: 0, draw: 0 }
  let turns = 0
  for (let i = 0; i < GAMES; i++) {
    const game = play(strategy)
    count[game.outcome]++
    turns += game.turns
  }
  console.log(`${name.padEnd(14)}${percent(count.win).padStart(8)}${percent(count.loss).padStart(8)}${percent(count.draw).padStart(8)}${(turns / GAMES).toFixed(1).padStart(11)}`)
  if (count.win / GAMES > WIN_LIMIT) tooStrong.push(name)
}

if (tooStrong.length > 0) {
  // Every winning strategy wins by attacking, so the lever is attack damage (HP 100 is from the owner's mock).
  // The largest attack that needs at least one more hit gives the Joker one more turn to hit back.
  const hitsToWin = Math.ceil(JOKER_MAX_HP / ATTACK_DAMAGE)
  const weakerAttack = Math.floor((JOKER_MAX_HP - 1) / hitsToWin)
  console.log(`\nWARNING: ${tooStrong.join(', ')} won more than ${WIN_LIMIT * 100}% of games.`)
  console.log('Proposal (not applied): lower the attack so the Joker card needs one more hit to finish.')
  console.log(`  rules.ts ATTACK_DAMAGE ${ATTACK_DAMAGE} -> ${weakerAttack} (${hitsToWin} attacks to win -> ${Math.ceil(JOKER_MAX_HP / weakerAttack)})`)
  console.log(`  Re-run this script after the change. If a strategy still wins more than ${WIN_LIMIT * 100}%, raise JOKER_DAMAGE.ultimate next.`)
}
