import { expect, test } from 'bun:test'
import { JOKER_DEFAULT, JOKER_LINES, jokerReply, moodFor } from './joker'
import { START } from './rules'
import type { Mood } from './types'

const MOODS: Mood[] = ['idle', 'smug', 'hurt', 'charging']

test('an unknown command returns the non-empty default for each mood', () => {
  for (const mood of MOODS) {
    expect(jokerReply('frobnicate --now', mood)).toBe(JOKER_DEFAULT[mood])
    expect(JOKER_DEFAULT[mood].length).toBeGreaterThan(0)
  }
})

test('empty or whitespace-only input returns an empty string', () => {
  expect(jokerReply('', 'idle')).toBe('')
  expect(jokerReply('   \t\n  ', 'smug')).toBe('')
})

test('input is trimmed, lowercased and whitespace-collapsed before matching', () => {
  expect(jokerReply('  SUDO   rm  ', 'idle')).toBe(JOKER_LINES.sudo.idle)
  expect(jokerReply('  KILL \t Dragon ', 'hurt')).toBe(JOKER_LINES['kill dragon'].hurt)
})

test('the full input matches before the first word', () => {
  expect(jokerReply('rm -rf', 'idle')).toBe(JOKER_LINES['rm -rf'].idle)
  expect(jokerReply('rm notes.txt', 'idle')).toBe(JOKER_LINES.rm.idle)
})

test('any input starting with rm -rf uses the rm -rf reply', () => {
  for (const input of ['rm -rf /', 'RM   -RF   ~', 'rm -rf/']) {
    expect(jokerReply(input, 'charging')).toBe(JOKER_LINES['rm -rf'].charging)
  }
})

test('unmatched full input falls back to the first word', () => {
  expect(jokerReply('cat secrets.txt', 'smug')).toBe(JOKER_LINES.cat.smug)
  expect(jokerReply('sudo make me a sandwich', 'idle')).toBe(JOKER_LINES.sudo.idle)
  expect(jokerReply('cathedral', 'idle')).toBe(JOKER_DEFAULT.idle)
})

test('object prototype names get the default reply', () => {
  for (const input of ['constructor', '__proto__', 'toString', 'hasOwnProperty x']) {
    expect(jokerReply(input, 'idle')).toBe(JOKER_DEFAULT.idle)
  }
})

test('the reply table has at least 10 entries, including the required commands', () => {
  expect(Object.keys(JOKER_LINES).length).toBeGreaterThanOrEqual(10)
  for (const key of ['sudo', 'rm -rf', 'kill dragon', 'ls', 'whoami', 'cat', 'exit', 'hello']) {
    expect(JOKER_LINES[key]).toBeDefined()
  }
})

test('every reply is short, single-line plain text for all four moods', () => {
  for (const lines of [...Object.values(JOKER_LINES), JOKER_DEFAULT]) {
    expect(Object.keys(lines).sort()).toEqual([...MOODS].sort())
    for (const mood of MOODS) {
      const line = lines[mood]
      expect(line.length).toBeGreaterThan(0)
      expect(line.length).toBeLessThanOrEqual(90)
      expect(line).toMatch(/^[\x20-\x7e]+$/)
      expect(line).toBe(line.trim())
      // The character is only ever named as the Joker card.
      if (/joker/i.test(line)) expect(line).toContain('the Joker card')
    }
  }
})

test('moodFor(START) with no last move is idle', () => {
  expect(moodFor(START)).toBe('idle')
  expect(moodFor(START, 'normal')).toBe('idle')
  expect(moodFor(START, 'precise')).toBe('idle')
})

test('moodFor is hurt at or below 30% Joker HP, ahead of every other rule', () => {
  expect(moodFor({ ...START, jhp: 9 })).toBe('hurt')
  expect(moodFor({ ...START, jhp: 0 })).toBe('hurt')
  expect(moodFor({ ...START, jhp: 10 })).toBe('idle')
  expect(moodFor({ ...START, jhp: 5, jsp: 100, hp: 1 }, 'ultimate')).toBe('hurt')
  expect(moodFor({ ...START, jhp: 5 }, 'charge')).toBe('hurt')
})

test('moodFor is charging at 80% SP or after a charge, ahead of smug', () => {
  expect(moodFor({ ...START, jsp: 80 })).toBe('charging')
  expect(moodFor({ ...START, jsp: 79 })).toBe('idle')
  expect(moodFor(START, 'charge')).toBe('charging')
  expect(moodFor({ ...START, jsp: 100 }, 'crit')).toBe('charging')
  expect(moodFor({ ...START, hp: 3 }, 'charge')).toBe('charging')
})

test('moodFor is smug after a crit or ultimate, or when the visitor is at or below 30% HP', () => {
  expect(moodFor(START, 'crit')).toBe('smug')
  expect(moodFor(START, 'ultimate')).toBe('smug')
  expect(moodFor({ ...START, hp: 9 })).toBe('smug')
  expect(moodFor({ ...START, hp: 10 })).toBe('idle')
})
