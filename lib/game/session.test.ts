import { afterEach, describe, expect, mock, test } from 'bun:test'
import * as engine from './engine'
import * as joker from './joker'
import { START } from './rules'
import { bar, DUEL_COMMANDS, duelInput, hud, RULES_TABLE, startDuel, type Duel } from './session'
import type { Mood, State } from './types'
import { runTerminalCommand, TERMINAL_COMMANDS } from '../terminalCommands'

// mock.module also patches these modules for later test files, so put the real ones back after each test.
const realEngine = { ...engine }
const realJoker = { ...joker }
afterEach(() => {
  mock.module('./engine', () => realEngine)
  mock.module('./joker', () => realJoker)
})

const HINT = '  only attack, defend, evade, counter or quit work mid-duel'
const fresh = (): Duel => startDuel(false).duel!

// Forces the engine's next state, taken and dealt for one turn.
function fakeEngine(jmove: string, next: Partial<State>, taken = 20, dealt = 18) {
  mock.module('./engine', () => ({
    pickJoker: () => jmove,
    resolve: (s: State) => ({ next: { ...s, ...next, turn: s.turn + 1 }, taken, dealt, over: false }),
  }))
}

function fakeJoker(reply: string) {
  const calls: [string, Mood][] = []
  mock.module('./joker', () => ({
    ...realJoker,
    jokerReply: (input: string, mood: Mood) => {
      calls.push([input, mood])
      return reply
    },
  }))
  return calls
}

describe('hud', () => {
  test('matches the owner mock: 48 columns, 20-cell bars, padded numbers', () => {
    expect(bar(52, 100)).toBe('[##########----------]')
    expect(bar(-4, 100)).toBe(`[${'-'.repeat(20)}]`)
    expect(bar(140, 100)).toBe(`[${'#'.repeat(20)}]`)
    expect(hud({ hp: 52, jhp: 75, jsp: 30, turn: 3 })).toEqual([
      '+----------------------------------------------+',
      '|  ROUND 3                                     |',
      '+----------------------------------------------+',
      '|  YOU    HP [##########----------]   52 / 100 |',
      '|  JOKER  HP [###############-----]   75 / 100 |',
      '|         SP [######--------------]   30 / 100 |',
      '+----------------------------------------------+',
      '|  attack    defend    evade    counter        |',
      '+----------------------------------------------+',
    ])
  })
})

describe('startDuel', () => {
  test('shows the rules table only when asked, then the HUD for round 1', () => {
    const first = startDuel(true)
    expect(first.duel).toEqual({ state: START, mood: 'idle' })
    expect(first.lines.slice(0, RULES_TABLE.length)).toEqual(RULES_TABLE)
    expect(first.lines.slice(-9)).toEqual(hud(START))
    const again = startDuel(false)
    expect(again.lines).not.toContain(RULES_TABLE[1])
    expect(again.lines.slice(-9)).toEqual(hud(START))
    expect(first.lines.join('')).toMatch(/^[\x20-\x7e]*$/)
  })
})

describe('duelInput', () => {
  test('quit ends the duel', () => {
    const { duel, lines } = duelInput(fresh(), ' Quit ')
    expect(duel).toBeNull()
    expect(lines.at(-1)).toBe(' type "play" to duel again')
  })

  test('non-move input keeps the duel and prints the hint', () => {
    fakeJoker('')
    for (const input of ['sudo', 'help', 'exit', 'clear', 'attack now']) {
      const duel = fresh()
      const step = duelInput(duel, input)
      expect(step.duel).toBe(duel)
      expect(step.lines).toEqual([HINT])
    }
  })

  test('a Joker reply follows the hint with a plain JOKER: label, using the duel mood', () => {
    const calls = fakeJoker('  Nice try.  ')
    const duel: Duel = { ...fresh(), mood: 'smug' }
    expect(duelInput(duel, '  SUDO   rm ').lines).toEqual([HINT, '  JOKER: Nice try.'])
    expect(calls).toEqual([['sudo rm', 'smug']])
  })

  test('the real Joker answers mid-duel', () => {
    const lines = duelInput(fresh(), 'sudo').lines
    expect(lines[0]).toBe(HINT)
    expect(lines[1]).toStartWith('  JOKER: ')
  })

  test('play mid-duel does not restart the duel', () => {
    const duel: Duel = { state: { ...START, hp: 12, turn: 4 }, mood: 'hurt', lastJMove: 'crit' }
    const step = duelInput(duel, 'play')
    expect(step.duel).toBe(duel)
    expect(step.lines[0]).toBe(HINT)
  })

  test('"  ATTACK  " is accepted as attack and prints the turn and the HUD', () => {
    const step = duelInput(fresh(), '  ATTACK  ', () => 0.1)
    expect(step.duel).not.toBeNull()
    expect(step.lines).not.toContain(HINT)
    expect(step.lines[0]).toStartWith('  JOKER ')
    expect(step.lines.slice(-9)).toEqual(hud(step.duel!.state))
  })

  test('every DUEL_COMMANDS entry is understood', () => {
    for (const command of DUEL_COMMANDS) {
      expect(duelInput(fresh(), command, () => 0.1).lines).not.toContain(HINT)
    }
  })

  test('turn lines follow the mock and show the engine numbers', () => {
    fakeEngine('crit', { hp: 80, jhp: 82 })
    const step = duelInput(fresh(), 'counter')
    expect(step.lines.slice(0, 2)).toEqual(['  JOKER used CRIT (20)', '  you took 20  |  you hit back for 18'])
    expect(step.duel?.lastJMove).toBe('crit')
    fakeEngine('charge', {}, 0, 15)
    expect(duelInput(fresh(), 'attack').lines.slice(0, 2)).toEqual(['  JOKER is charging up', '  free hit for 15'])
    fakeEngine('normal', {}, 0, 0)
    expect(duelInput(fresh(), 'evade').lines[1]).toBe('  you dodged it')
    fakeEngine('crit', {}, 6, 0)
    expect(duelInput(fresh(), 'defend').lines[1]).toBe('  you took 6 (blocked 70%)')
  })

  test('the Joker card at 0 HP ends the duel with the heist screen', () => {
    fakeEngine('normal', { hp: 41, jhp: 0 }, 12, 15)
    const duel: Duel = { state: { ...START, turn: 7 }, mood: 'hurt' }
    const { duel: after, lines } = duelInput(duel, 'attack')
    expect(after).toBeNull()
    expect(lines.slice(-5)).toEqual([
      '+----------------------------------------------+',
      '|   HEIST COMPLETE  -  JOKER IS DOWN           |',
      '|   rounds: 7        HP left: 41               |',
      '+----------------------------------------------+',
      ' type "play" to run it again',
    ])
  })

  test('the visitor at 0 HP ends the duel as busted', () => {
    fakeEngine('ultimate', { hp: 0, jhp: 30 }, 35, 0)
    const duel: Duel = { state: { ...START, turn: 5 }, mood: 'charging' }
    const { duel: after, lines } = duelInput(duel, 'defend')
    expect(after).toBeNull()
    expect(lines.slice(-5)).toEqual([
      '+----------------------------------------------+',
      '|   !! BUSTED !!                               |',
      '|   rounds: 5        Joker HP left: 30         |',
      '+----------------------------------------------+',
      ' type "play" to try again',
    ])
  })
})

describe('terminal commands', () => {
  test('play asks the hook for a duel and is listed in completion and help', () => {
    expect(runTerminalCommand('  PLAY ', [])).toEqual({ lines: [], startDuel: true })
    expect(TERMINAL_COMMANDS).toContain('play')
    const help = runTerminalCommand('help', []).lines
    expect(help).toContain('| play       | duel the Joker                 |')
    expect(new Set(help.filter((line) => line.startsWith('+') || line.startsWith('|')).map((line) => line.length)).size).toBe(1)
  })

  test('unknown commands keep their error lines and are flagged for the Joker', () => {
    expect(runTerminalCommand('frobnicate', [])).toEqual({
      lines: ['Command not found: frobnicate', 'Type help to see available commands.'],
      kind: 'error',
      notFound: true,
    })
  })

  test('connect and github open URLs from projectsData only', () => {
    expect(runTerminalCommand('connect agriscan-monitor', []).openUrl).toBe('https://agriscan-monitor.vercel.app/dashboard/controller')
    expect(runTerminalCommand('connect SPEX', []).openUrl).toBe('https://spec-bot-steel.vercel.app/doc')
    // agriscanpro comes first but has no demo, so the prefix picks the one that does.
    expect(runTerminalCommand('connect agriscan', []).openUrl).toBe('https://agriscan-monitor.vercel.app/dashboard/controller')
    expect(runTerminalCommand('github agriscan', []).openUrl).toBe('https://github.com/GearJP2/agriscan-pro')
    expect(runTerminalCommand('github mini', []).openUrl).toBe('https://github.com/chanitnan0jr/Mini-Redis')
    for (const command of ['connect', 'connect mini-redis', 'github nope', 'connect https://evil.example', 'github javascript:alert(1)']) {
      const result = runTerminalCommand(command, [])
      expect(result.kind).toBe('error')
      expect(result.openUrl).toBeUndefined()
      expect(result.lines.at(-1)).toStartWith('Valid ids: ')
    }
    expect(runTerminalCommand('projects', []).lines.join('\n')).toContain('agriscan-monitor')
  })
})
