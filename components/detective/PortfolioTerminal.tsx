'use client'

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { runTerminalCommand, TERMINAL_COMMANDS } from '@/lib/terminalCommands'
interface Line {
  kind: 'output' | 'error' | 'input' | 'art'
  text: string
}
const MASK_ART = String.raw`       /\              /\
      /##\            /##\
     /####\__________/####\
    /######################\
   /####\   \####/   /#######\
  /######\___\##/___/#########\
  \###########\/#############/
   \########/    \##########/
    \######/      \########/
     \####/        \######/
      \##/          \####/
       \/            \##/
                      \/`

const INITIAL_LINES: Line[] = [
  { kind: 'art', text: MASK_ART },
  ...runTerminalCommand('whoami', []).lines.map(text => ({ kind: 'output' as const, text })),
  { kind: 'output', text: '' },
  { kind: 'output', text: 'Type help for commands. Type exit to return home.' },
]

export default function PortfolioTerminal() {
  const router = useRouter()
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [candidateIndex, setCandidateIndex] = useState(0)
  const draft = useRef('')
  const output = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)
  const composing = useRef(false)

  // Candidate filtering matching current input
  const query = input.trim().toLowerCase()
  const candidates = query
    ? TERMINAL_COMMANDS.filter((cmd) => cmd.toLowerCase().startsWith(query))
    : []

  const activeCandidate = candidates[candidateIndex] || candidates[0] || ''
  const ghostSuffix =
    activeCandidate &&
    input &&
    activeCandidate.toLowerCase().startsWith(input.toLowerCase())
      ? activeCandidate.slice(input.length)
      : ''

  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) field.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight
  }, [lines])

  const executeCommand = (cmd: string) => {
    const nextHistory = [...history, cmd].slice(-50)
    const result = runTerminalCommand(cmd, nextHistory)
    setHistory(nextHistory)
    setHistoryIndex(-1)
    setCandidateIndex(0)
    setInput('')
    draft.current = ''
    setLines((previous) =>
      result.clear
        ? []
        : [
            ...previous,
            { kind: 'input', text: cmd } as Line,
            ...result.lines.map(
              (text) => ({ kind: result.kind ?? 'output', text }) as Line,
            ),
          ].slice(-160),
    )
    if (result.navigate) router.push(result.navigate)
    if (result.asyncAction === 'visitors') {
      fetch('/api/visitors', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.total === 'number') {
            const byOs = data.byOs || {}
            const osEntries = Object.entries(byOs as Record<string, number>)
              .sort(([, a], [, b]) => b - a)
              .map(
                ([os, count]) =>
                  `  ${os.padEnd(16)} ${count} visitor${count !== 1 ? 's' : ''}`,
              )
            setLines((prev) => [
              ...prev,
              { kind: 'output', text: `Total Unique Visitors: ${data.total}` },
              ...(osEntries.length > 0
                ? [
                    { kind: 'output', text: 'Breakdown by OS:' } as Line,
                    ...osEntries.map(
                      (t) => ({ kind: 'output', text: t } as Line),
                    ),
                  ]
                : []),
            ])
          } else {
            setLines((prev) => [
              ...prev,
              {
                kind: 'output',
                text: 'Total Unique Visitors: 1,337 (Local Demo · Redis offline)',
              },
              { kind: 'output', text: 'Breakdown by OS:' },
              { kind: 'output', text: '  Linux            842 visitors' },
              { kind: 'output', text: '  macOS            310 visitors' },
              { kind: 'output', text: '  Windows          185 visitors' },
            ])
          }
        })
        .catch(() => {
          setLines((prev) => [
            ...prev,
            {
              kind: 'output',
              text: 'Total Unique Visitors: 1,337 (Local Demo · Redis offline)',
            },
            { kind: 'output', text: 'Breakdown by OS:' },
            { kind: 'output', text: '  Linux            842 visitors' },
            { kind: 'output', text: '  macOS            310 visitors' },
            { kind: 'output', text: '  Windows          185 visitors' },
          ])
        })
    }
    field.current?.focus()
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (composing.current) return
    // Accept autocomplete on Enter if a suggestion is active
    if (
      activeCandidate &&
      input.trim().toLowerCase() !== activeCandidate.toLowerCase()
    ) {
      setInput(activeCandidate)
      setCandidateIndex(0)
      return
    }
    const command = input.trim()
    if (!command) return
    executeCommand(command)
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    setHistoryIndex(-1)
    setCandidateIndex(0)
  }

  const keydown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return
    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault()
      executeCommand('clear')
      return
    }
    // Tab cycles candidates if multiple exist, or autocompletes if single
    if (event.key === 'Tab' && !event.shiftKey && candidates.length > 0) {
      event.preventDefault()
      if (candidates.length > 1) {
        setCandidateIndex((prev) => (prev + 1) % candidates.length)
      } else {
        setInput(candidates[0])
        setCandidateIndex(0)
      }
      return
    }
    // Shift+Tab cycles backwards
    if (event.key === 'Tab' && event.shiftKey && candidates.length > 1) {
      event.preventDefault()
      setCandidateIndex(
        (prev) => (prev - 1 + candidates.length) % candidates.length,
      )
      return
    }
    // ArrowRight accepts suggestion when at end of input
    if (
      event.key === 'ArrowRight' &&
      field.current?.selectionStart === input.length &&
      activeCandidate &&
      ghostSuffix
    ) {
      event.preventDefault()
      setInput(activeCandidate)
      setCandidateIndex(0)
      return
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      if (!history.length) return
      if (historyIndex === -1) draft.current = input
      const next =
        event.key === 'ArrowUp'
          ? Math.min(historyIndex + 1, history.length - 1)
          : Math.max(historyIndex - 1, -1)
      setHistoryIndex(next)
      const nextVal =
        next === -1 ? draft.current : history[history.length - 1 - next]
      setInput(nextVal)
      setCandidateIndex(0)
    } else if (event.key === 'Escape') {
      setInput('')
      setHistoryIndex(-1)
      setCandidateIndex(0)
    }
  }

  return (
    <section id="terminal" className="terminal-section" aria-label="Portfolio terminal">
      <p id="terminal-instructions" className="sr-only">Type help for available commands or exit to return home. Enter completes a suggestion, then runs the command. Tab cycles suggestions. Up and Down recall history. Escape clears input. Control L clears output.</p>
      <div className="portfolio-terminal">
        <div ref={output} className="terminal-output" role="log" aria-label="Terminal output" aria-live="polite" aria-relevant="additions text" tabIndex={0}>
          {lines.map((line, index) => line.kind === 'art' ? (
            <pre key={index} className="terminal-mask-art" aria-hidden="true">{line.text}</pre>
          ) : (
            <div key={index} className={`terminal-line ${line.kind}`}>
              {line.kind === 'input' && <span className="terminal-prompt" aria-hidden="true">visitor@localhost:~$ </span>}
              {line.text || '\u00a0'}
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="terminal-command">
          <label className="terminal-prompt" htmlFor="portfolio-command" aria-hidden="true">visitor@localhost:<span>~$</span></label>
          <div className="terminal-input-wrapper">
            {ghostSuffix && <div className="terminal-ghost-overlay" aria-hidden="true"><span className="terminal-ghost-typed">{input}</span><span className="terminal-ghost-suffix">{ghostSuffix}</span></div>}
            <input id="portfolio-command" ref={field} type="text" aria-label="Terminal command" aria-describedby="terminal-instructions" value={input}
              onChange={event => handleInputChange(event.target.value)} onKeyDown={keydown}
              onCompositionStart={() => { composing.current = true }} onCompositionEnd={() => { composing.current = false }}
              maxLength={500} autoComplete="off" autoCapitalize="off" spellCheck={false} enterKeyHint="send" />
          </div>
        </form>
      </div>
    </section>
  )
}
