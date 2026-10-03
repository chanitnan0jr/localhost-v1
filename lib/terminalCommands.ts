import { DESTINATIONS, SUIT_SYMBOLS } from './cardDeck'
import { OPENSOURCE_PROJECTS, PERSONAL_PROJECTS } from './projectsData'
export interface TerminalResult {
  lines: string[]
  kind?: 'output' | 'error'
  navigate?: string
  clear?: boolean
}
export const TERMINAL_COMMANDS = [
  'help',
  'whoami',
  'ls',
  'cat about',
  'cat projects',
  'cat contact',
  'open home',
  'open projects',
  'open work',
  'open about',
  'open contact',
  'deck',
  'history',
  'date',
  'clear',
]
export function runTerminalCommand(
  input: string,
  history: string[],
): TerminalResult {
  const command = input.trim().replace(/\s+/g, ' ').toLowerCase()
  if (command === 'clear') return { lines: [], clear: true }
  if (command === 'help')
    return {
      lines: [
        'Available commands:',
        '  whoami             Meet the engineer',
        '  ls                 List portfolio destinations',
        '  cat about          Read the profile',
        '  cat projects       Browse the case files',
        '  cat contact        Get in touch',
        '  open <destination> Navigate to a section or page',
        '  deck               Read the card directory',
        '  history / date     Command history / local time',
        '  clear              Clear the screen',
        '',
        'Use ↑ / ↓ for history. Tab completes a matching command.',
      ],
    }
  if (
    command === 'whoami' ||
    command === 'cat about' ||
    command === 'cat readme'
  )
    return {
      lines: [
        'Chanitnan Kitnantakhun',
        'Backend / Systems Engineer · Computer Science, Thammasat University',
        'I build from first principles, with a focus on system internals, performance and reliability.',
      ],
    }
  if (command === 'ls' || command === 'ls -la' || command === 'deck')
    return {
      lines: DESTINATIONS.map(
        (card) =>
          `${`${card.rank}${SUIT_SYMBOLS[card.suit]}`.padEnd(5)} ${card.label.padEnd(10)} ${card.href}`,
      ),
    }
  if (command === 'cat projects')
    return {
      lines: [...OPENSOURCE_PROJECTS, ...PERSONAL_PROJECTS].flatMap(
        (project) => [
          `${project.name} — ${project.category}`,
          project.description,
          project.repoUrl ?? '',
          '',
        ],
      ),
    }
  if (command === 'cat contact')
    return {
      lines: [
        'Email: Ch4n1tnan@gmail.com',
        'GitHub: https://github.com/chanitnan0jr',
        'Type open contact to visit the contact section.',
      ],
    }
  if (command === 'history')
    return {
      lines: history.map(
        (entry, index) => `${String(index + 1).padStart(3)}  ${entry}`,
      ),
    }
  if (command === 'date') return { lines: [new Date().toLocaleString()] }
  if (/^(open|cd|goto)\s/.test(command) || command === 'exit') {
    const target =
      command === 'exit'
        ? 'home'
        : command.split(' ').slice(1).join(' ').replace(/^\//, '') || 'home'
    const destination = DESTINATIONS.find(
      (card) => card.label.toLowerCase() === target,
    )
    return destination
      ? { lines: [`Opening ${destination.label}…`], navigate: destination.href }
      : {
          lines: [
            `Unknown destination: ${target}. Type ls to see the directory.`,
          ],
          kind: 'error',
        }
  }
  return {
    lines: [
      `Command not found: ${input.trim()}`,
      'Type help to see available commands.',
    ],
    kind: 'error',
  }
}
