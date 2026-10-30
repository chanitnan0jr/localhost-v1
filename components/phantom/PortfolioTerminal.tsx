'use client'

import { useEffect, useRef } from 'react'
import { useTerminal, type TerminalLine } from '@/hooks/useTerminal'
import { runTerminalCommand } from '@/lib/terminalCommands'

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

const INITIAL_LINES: TerminalLine[] = [
  { kind: 'art', text: MASK_ART },
  ...runTerminalCommand('whoami', []).lines.map(text => ({ kind: 'output' as const, text })),
  { kind: 'output', text: '' },
  { kind: 'output', text: 'Type help for commands. Type exit to return home.' },
]

export default function PortfolioTerminal() {
  const { lines, input, ghostSuffix, field, submit, inputProps } = useTerminal(INITIAL_LINES)
  const output = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) field.current?.focus({ preventScroll: true })
  }, [field])

  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight
  }, [lines])

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
            <input id="portfolio-command" ref={field} type="text" aria-label="Terminal command" aria-describedby="terminal-instructions" {...inputProps}
              maxLength={500} autoComplete="off" autoCapitalize="off" spellCheck={false} enterKeyHint="send" />
          </div>
        </form>
      </div>
    </section>
  )
}
