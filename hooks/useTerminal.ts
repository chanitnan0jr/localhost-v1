'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { runTerminalCommand, TERMINAL_COMMANDS, visitorStatsLines } from '@/lib/terminalCommands'

export interface TerminalLine {
  kind: 'output' | 'error' | 'input' | 'art'
  text: string
}

const output = (lines: string[]): TerminalLine[] => lines.map((text) => ({ kind: 'output', text }))

// Shared by /terminal and the 404 page: one command set, history and completion; each page draws its own shell.
export function useTerminal(initialLines: TerminalLine[] = []) {
  const router = useRouter()
  const [lines, setLines] = useState<TerminalLine[]>(initialLines)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [candidateIndex, setCandidateIndex] = useState(0)
  const draft = useRef('')
  const field = useRef<HTMLInputElement>(null)
  const composing = useRef(false)
  const visitorController = useRef<AbortController | null>(null)

  const query = input.trim().toLowerCase()
  const candidates = query ? TERMINAL_COMMANDS.filter((cmd) => cmd.toLowerCase().startsWith(query)) : []
  const activeCandidate = candidates[candidateIndex] || candidates[0] || ''
  const ghostSuffix =
    activeCandidate && input && activeCandidate.toLowerCase().startsWith(input.toLowerCase())
      ? activeCandidate.slice(input.length)
      : ''

  useEffect(() => {
    const controller = new AbortController()
    visitorController.current = controller
    return () => {
      controller.abort()
      visitorController.current = null
    }
  }, [])

  function choose(value: string) {
    setInput(value)
    setCandidateIndex(0)
    field.current?.focus()
  }

  function execute(cmd: string) {
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
            { kind: 'input', text: cmd } as TerminalLine,
            ...result.lines.map((text) => ({ kind: result.kind ?? 'output', text }) as TerminalLine),
          ].slice(-160),
    )
    if (result.navigate) router.push(result.navigate)
    if (result.asyncAction === 'visitors') {
      const signal = visitorController.current?.signal
      const appendStats = (stats: string[]) => {
        if (!signal?.aborted) setLines((previous) => [...previous, ...output(stats)].slice(-160))
      }
      fetch('/api/visitors', { cache: 'no-store', signal })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => appendStats(visitorStatsLines(data)))
        .catch(() => appendStats(visitorStatsLines(null)))
    }
    field.current?.focus()
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (composing.current) return
    // Enter first accepts an incomplete suggestion, then runs the command.
    if (activeCandidate && query !== activeCandidate.toLowerCase()) {
      setInput(activeCandidate)
      setCandidateIndex(0)
      return
    }
    const command = input.trim()
    if (command) execute(command)
  }

  function change(value: string) {
    setInput(value)
    setHistoryIndex(-1)
    setCandidateIndex(0)
  }

  function keydown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return
    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault()
      execute('clear')
      return
    }
    // Tab cycles candidates when several match, or completes a single match; Shift+Tab cycles back.
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
    if (event.key === 'Tab' && event.shiftKey && candidates.length > 1) {
      event.preventDefault()
      setCandidateIndex((prev) => (prev - 1 + candidates.length) % candidates.length)
      return
    }
    // ArrowRight at the end of the input accepts the suggestion.
    if (event.key === 'ArrowRight' && field.current?.selectionStart === input.length && ghostSuffix) {
      event.preventDefault()
      setInput(activeCandidate)
      setCandidateIndex(0)
      return
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      if (!history.length) return
      if (historyIndex === -1) draft.current = input
      const next = event.key === 'ArrowUp'
        ? Math.min(historyIndex + 1, history.length - 1)
        : Math.max(historyIndex - 1, -1)
      setHistoryIndex(next)
      setInput(next === -1 ? draft.current : history[history.length - 1 - next])
      setCandidateIndex(0)
    } else if (event.key === 'Escape') {
      setInput('')
      setHistoryIndex(-1)
      setCandidateIndex(0)
    }
  }

  return {
    lines,
    setLines,
    input,
    candidates,
    activeCandidate,
    ghostSuffix,
    field,
    choose,
    submit,
    // Spread onto the <input>: value, change, keys and IME composition.
    inputProps: {
      value: input,
      onChange: (event: { target: { value: string } }) => change(event.target.value),
      onKeyDown: keydown,
      onCompositionStart: () => { composing.current = true },
      onCompositionEnd: () => { composing.current = false },
    },
  }
}
