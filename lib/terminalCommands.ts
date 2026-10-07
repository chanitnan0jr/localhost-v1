import { DESTINATIONS, SUIT_SYMBOLS } from './cardDeck'
import { OPENSOURCE_PROJECTS, PERSONAL_PROJECTS, COLLABORATIVE_PROJECTS } from './projectsData'
export interface TerminalResult {
  lines: string[]
  kind?: 'output' | 'error'
  navigate?: string
  clear?: boolean
  asyncAction?: 'visitors'
}
export const TERMINAL_COMMANDS = [
  'help',
  'fastfetch',
  'neofetch',
  'viewcount',
  'visitors',
  'whoami',
  'skills',
  'stack',
  'uname',
  'uptime',
  'sudo',
  'ls',
  'cat about',
  'cat projects',
  'cat contact',
  'open home',
  'open projects',
  'open work',
  'open about',
  'open terminal',
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

  if (command === 'fastfetch' || command === 'neofetch' || command === 'fetch') {
    return {
      lines: [
        '      /\\_/\\          visitor@localhost',
        '    =( °.°)~         ─────────────────',
        '      )   (  //      OS: Phantom Linux x86_64',
        '     (___)(//        Host: Leblanc Cafe',
        '                     Kernel: Linux 6.8.0-noir / Next.js Turbo',
        '                     Uptime: 24/7 (High Availability)',
        '                     Shell: noir-sh (Copilot Auto-complete)',
        '                     Stack: Go · Python · TypeScript · Docker · Redis',
        '                     Status: Ready for next mission',
      ],
    }
  }

  if (command === 'viewcount' || command === 'visitors' || command === 'stats') {
    return {
      lines: ['Querying visitor telemetry from /api/visitors...'],
      asyncAction: 'visitors',
    }
  }

  if (command === 'uname' || command === 'uname -a') {
    return {
      lines: [
        'Linux localhost 6.8.0-noir-systems #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
      ],
    }
  }

  if (command === 'uptime') {
    return {
      lines: [
        ' 01:42:00 up 420 days, 13:37, 1 user, load average: 0.05, 0.03, 0.00',
      ],
    }
  }

  if (command === 'skills' || command === 'stack') {
    return {
      lines: [
        'Core Technologies & Architecture:',
        '  Backend:      Go, Python, TypeScript, Node.js, REST & gRPC',
        '  Systems:      Linux, Docker, Redis, PostgreSQL, Distributed Systems',
        '  Tools & CI:   Git, GitHub Actions, Docker, Next.js 14 Turbo Engine',
        '  Specialty:    Low-latency services, internal tooling, reliable systems',
      ],
    }
  }

  if (command.startsWith('sudo')) {
    return {
      lines: [
        'visitor is not in the sudoers file. This incident will be reported to the Phantom Thieves.',
      ],
      kind: 'error',
    }
  }

  if (command.startsWith('echo ')) {
    return {
      lines: [input.trim().slice(5)],
    }
  }

  if (command === 'help')
    return {
      lines: [
        'Available commands:',
        '  fastfetch / neofetch  Show system & portfolio architecture',
        '  viewcount / visitors  Display visitor telemetry & statistics',
        '  whoami                Meet the engineer',
        '  skills / stack        List backend & engineering capabilities',
        '  ls                    List portfolio destinations',
        '  cat about             Read personal background',
        '  cat projects          Browse projects directory',
        '  cat contact           Get contact info',
        '  open <destination>    Navigate to a section or page',
        '  deck                  Read the 52-card directory',
        '  history / date        Command history / local time',
        '  uptime / uname        Check system metrics & kernel',
        '  clear                 Clear the console screen',
        '',
        'Use ↑ / ↓ for history. Tab cycles hints; Enter or → accepts. Escape clears input.',
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
      lines: [...OPENSOURCE_PROJECTS, ...COLLABORATIVE_PROJECTS, ...PERSONAL_PROJECTS].flatMap(
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
