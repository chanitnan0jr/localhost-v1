'use client'

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { runTerminalCommand, TERMINAL_COMMANDS } from '@/lib/terminalCommands'
interface Line {
  kind: 'output' | 'error' | 'input'
  text: string
}
const INITIAL_LINES: Line[] = [
  { kind: 'output', text: 'Welcome to localhost. Type help to begin.' },
]
export default function PortfolioTerminal() {
  const router = useRouter()
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const draft = useRef('')
  const output = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight
  }, [lines])
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const command = input.trim()
    if (!command) return
    const nextHistory = [...history, command].slice(-50)
    const result = runTerminalCommand(command, nextHistory)
    setHistory(nextHistory)
    setHistoryIndex(-1)
    setInput('')
    draft.current = ''
    setLines((previous) =>
      result.clear
        ? []
        : [
            ...previous,
            { kind: 'input', text: command } as Line,
            ...result.lines.map(
              (text) => ({ kind: result.kind ?? 'output', text }) as Line,
            ),
          ].slice(-160),
    )
    if (result.navigate) router.push(result.navigate)
  }
  const keydown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      if (!history.length) return
      if (historyIndex === -1) draft.current = input
      const next =
        event.key === 'ArrowUp'
          ? Math.min(historyIndex + 1, history.length - 1)
          : Math.max(historyIndex - 1, -1)
      setHistoryIndex(next)
      setInput(next === -1 ? draft.current : history[history.length - 1 - next])
    } else if (event.key === 'Tab' && !event.shiftKey && input.trim()) {
      const match = TERMINAL_COMMANDS.find(
        (command) =>
          command.startsWith(input.trim().toLowerCase()) &&
          command !== input.trim().toLowerCase(),
      )
      if (match) {
        event.preventDefault()
        setInput(match)
      }
    } else if (event.key === 'Escape') {
      setInput('')
      setHistoryIndex(-1)
    }
  }
  return (
    <section
      id="terminal"
      className="terminal-section"
      aria-labelledby="terminal-heading"
    >
      <div className="terminal-intro">
        <h2 id="terminal-heading">A direct line.</h2>
        <p>Prefer a prompt? The terminal is yours.</p>
        <button
          className="terminal-shortcut"
          type="button"
          onClick={() => {
            setInput('help')
            field.current?.focus()
          }}
        >
          Try <code>help</code>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 10h12m-5-5 5 5-5 5" />
          </svg>
        </button>
      </div>
      <div className="portfolio-terminal">
        <div className="terminal-title">
          <span className="terminal-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>visitor@localhost</span>
        </div>
        <div
          ref={output}
          className="terminal-output"
          role="log"
          aria-label="Terminal output"
          aria-live="polite"
          aria-relevant="additions text"
        >
          {lines.map((line, index) => (
            <div key={index} className={`terminal-line ${line.kind}`}>
              {line.kind === 'input' ? (
                <span className="terminal-prompt" aria-hidden="true">
                  visitor@localhost:~${' '}
                </span>
              ) : null}
              {line.text || '\u00a0'}
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="terminal-command">
          <label className="terminal-prompt" htmlFor="portfolio-command">
            visitor@localhost:<span>~$</span>
          </label>
          <input
            id="portfolio-command"
            ref={field}
            type="text"
            aria-label="Terminal command"
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              setHistoryIndex(-1)
            }}
            onKeyDown={keydown}
            maxLength={500}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="send"
          />
          <button type="submit" aria-label="Run terminal command">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M16 4v8H5m4-4-4 4 4 4" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  )
}
