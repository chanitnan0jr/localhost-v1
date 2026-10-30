'use client'

import { useEffect, useRef, useState } from 'react'
import { spokenBox, useTerminal, type TerminalLine } from '@/hooks/useTerminal'
import { buildBootSequence, readClientInfo } from '@/lib/notFoundTerminal'

export default function NotFoundTerminal() {
  const { lines, setLines, input, candidates, activeCandidate, field, choose, submit, inputProps } = useTerminal()
  const [booted, setBooted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Boot sequence typewriter; the prompt appears once it finishes.
  useEffect(() => {
    const controller = new AbortController()
    let interval: ReturnType<typeof setInterval> | undefined

    fetch('/api/sysinfo', { signal: controller.signal, cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('System info unavailable')
        return r.json()
      })
      .catch(() => ({ ip: '127.0.0.1' }))
      .then(({ ip }) => {
        if (controller.signal.aborted) return
        const sequence = buildBootSequence(ip, readClientInfo())

        let i = 0
        const boot: TerminalLine[] = []
        interval = setInterval(() => {
          if (i < sequence.length) {
            boot.push({ kind: 'output', text: sequence[i] })
            setLines([...boot])
            i++
          } else {
            clearInterval(interval)
            setBooted(true)
          }
        }, 60)
      })
    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [setLines])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  return (
    <div
      className="min-h-screen bg-black flex flex-col font-mono cursor-text"
      onClick={() => field.current?.focus()}
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)',
          backgroundSize: '100% 2px',
        }}
      />

      {/* Terminal */}
      <div className="flex-1 p-6 md:p-12 max-w-4xl w-full mx-auto">

        {/* Header bar */}
        <div className="flex items-center gap-2 mb-8 opacity-40">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-xs text-accent-green/50 tracking-widest uppercase">bash — chanitnan@localhost</span>
        </div>

        {/* History */}
        <div className="space-y-1 overflow-x-auto">
          {lines.map((line, i) => (
            <div key={i} className="flex items-start gap-2">
              {line.kind === 'input' && (
                <span className="text-accent-green/40 shrink-0 select-none">$</span>
              )}
              <p
                className={[
                  'text-sm leading-relaxed tracking-wide',
                  line.kind === 'box' ? 'whitespace-pre' : 'whitespace-pre-wrap break-all',
                  line.kind === 'input' ? 'text-white font-bold' : '',
                  line.kind === 'output' || line.kind === 'art' || line.kind === 'box' ? 'text-accent-green/70' : '',
                  line.kind === 'error' ? 'text-red-400' : '',
                ].join(' ')}
              >
                {line.kind === 'box'
                  ? <><span aria-hidden="true">{line.text}</span>{spokenBox(line.text) && <span className="sr-only">{spokenBox(line.text)}</span>}</>
                  : line.text || '\u00A0'}
              </p>
            </div>
          ))}
        </div>

        {/* Input line */}
        {booted && (
          <div className="mt-1">
            <form onSubmit={submit} className="flex items-center gap-2">
              <span className="text-accent-green/40 shrink-0 select-none text-sm">$</span>
              <div className="relative flex-1 flex items-center">
                <input
                  aria-label="Terminal command"
                  autoFocus
                  ref={field}
                  {...inputProps}
                  maxLength={500}
                  className="w-full bg-transparent text-white text-sm tracking-wide outline-none caret-transparent"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                {/* Fake cursor */}
                <span
                  className="absolute top-0 text-sm text-accent-green select-none"
                  style={{ left: `${input.length}ch` }}
                >
                  <span className="animate-blink inline-block w-[0.55em] h-[1.1em] bg-accent-green align-middle" />
                </span>
              </div>
            </form>

            {/* Hints */}
            {candidates.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pl-4">
                {candidates.map((hint) => (
                  <button
                    key={hint}
                    type="button"
                    onClick={() => choose(hint)}
                    className={[
                      'text-xs font-mono tracking-wide px-3 py-1 rounded border transition-all',
                      hint === activeCandidate
                        ? 'bg-accent-green/10 border-accent-green/40 text-accent-green'
                        : 'bg-white/5 border-white/10 text-neutral-500 hover:border-white/20 hover:text-neutral-300',
                    ].join(' ')}
                  >
                    {hint}
                    {hint === activeCandidate && <span className="ml-2 text-accent-green/40 text-[10px]">tab</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
