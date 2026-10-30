'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { runTerminalCommand, TERMINAL_COMMANDS, visitorStatsLines } from '@/lib/terminalCommands'
import { DUEL_COMMANDS, duelInput, jokerLines, startDuel, type Duel, type DuelStep } from '@/lib/game/session'

export interface TerminalLine {
  // box: a table or HUD row that must not wrap; the page scrolls it sideways instead.
  kind: 'output' | 'error' | 'input' | 'art' | 'box'
  text: string
  // An input line typed during a duel, shown after the visitor@duel prompt.
  duel?: true
}

const output = (lines: string[]): TerminalLine[] =>
  lines.map((text) => ({ kind: /^[+|]/.test(text) ? 'box' : 'output', text }))
const DUEL_LINE_DELAY = 110

// What a screen reader should hear for a box line: the words without borders or bar characters ('' for a border).
export const spokenBox = (text: string) =>
  text.replace(/\[[#-]*\]/g, ' ').replace(/[+|]|-{2,}/g, ' ').replace(/\s+/g, ' ').trim()

// Shared by /terminal and the 404 page: one command set, history and completion; each page draws its own shell.
export function useTerminal(initialLines: TerminalLine[] = []) {
  const router = useRouter()
  const [lines, setLines] = useState<TerminalLine[]>(initialLines)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [candidateIndex, setCandidateIndex] = useState(0)
  const [duel, setDuel] = useState<Duel | null>(null)
  const draft = useRef('')
  const field = useRef<HTMLInputElement>(null)
  const composing = useRef(false)
  const visitorController = useRef<AbortController | null>(null)
  const rulesShown = useRef(false)
  // Duel output waiting to be printed (a text line, or a whole box at once), and the timer for the next step.
  const printer = useRef<{ queue: TerminalLine[][]; timer?: ReturnType<typeof setTimeout> }>({ queue: [] })

  const query = input.trim().toLowerCase()
  const candidates = query ? (duel ? DUEL_COMMANDS : TERMINAL_COMMANDS).filter((cmd) => cmd.toLowerCase().startsWith(query)) : []
  const activeCandidate = candidates[candidateIndex] || candidates[0] || ''
  const ghostSuffix =
    activeCandidate && input && activeCandidate.toLowerCase().startsWith(input.toLowerCase())
      ? activeCandidate.slice(input.length)
      : ''

  useEffect(() => {
    const controller = new AbortController()
    const pending = printer.current
    visitorController.current = controller
    return () => {
      controller.abort()
      visitorController.current = null
      clearTimeout(pending.timer)
    }
  }, [])

  function choose(value: string) {
    setInput(value)
    setCandidateIndex(0)
    field.current?.focus()
  }

  // Prints every queued duel line at once, in order.
  function flush() {
    const pending = printer.current
    clearTimeout(pending.timer)
    pending.timer = undefined
    const rest = pending.queue.splice(0).flat()
    if (rest.length) setLines((previous) => [...previous, ...rest].slice(-160))
  }

  function printNext() {
    const pending = printer.current
    const step = pending.queue.shift()
    if (step) setLines((previous) => [...previous, ...step].slice(-160))
    pending.timer = pending.queue.length ? setTimeout(printNext, DUEL_LINE_DELAY) : undefined
  }

  // Duel output appears step by step, or all at once with reduced motion.
  function playStep(cmd: string, step: DuelStep) {
    const pending = printer.current
    const echo: TerminalLine = duel ? { kind: 'input', text: cmd, duel: true } : { kind: 'input', text: cmd }
    setDuel(step.duel)
    setLines((previous) => [...previous, echo].slice(-160))
    for (const line of output(step.lines)) {
      const last = pending.queue.at(-1)
      if (line.kind === 'box' && last?.[0].kind === 'box') last.push(line)
      else pending.queue.push([line])
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) flush()
    else if (!pending.timer) pending.timer = setTimeout(printNext, DUEL_LINE_DELAY)
  }

  function execute(cmd: string) {
    // Lines still printing from the last duel turn land before anything new.
    flush()
    const nextHistory = [...history, cmd].slice(-50)
    setHistory(nextHistory)
    setHistoryIndex(-1)
    setCandidateIndex(0)
    setInput('')
    draft.current = ''
    field.current?.focus()
    if (duel) {
      playStep(cmd, duelInput(duel, cmd))
      return
    }
    const result = runTerminalCommand(cmd, nextHistory)
    if (result.startDuel) {
      playStep(cmd, startDuel(!rulesShown.current))
      rulesShown.current = true
      return
    }
    // Synchronous inside the submit handler, so popup blockers allow it.
    if (result.openUrl) window.open(result.openUrl, '_blank', 'noopener,noreferrer')
    const joker = result.notFound ? jokerLines(cmd, 'idle') : []
    setLines((previous) =>
      result.clear
        ? []
        : [
            ...previous,
            { kind: 'input', text: cmd } as TerminalLine,
            ...(result.kind === 'error'
              ? result.lines.map((text) => ({ kind: 'error', text }) as TerminalLine)
              : output(result.lines)),
            ...output(joker),
          ].slice(-160),
    )
    if (result.navigate) router.push(result.navigate)
    if (result.asyncAction === 'visitors') {
      const signal = visitorController.current?.signal
      const appendStats = (stats: string[]) => {
        if (signal?.aborted) return
        flush()
        setLines((previous) => [...previous, ...output(stats)].slice(-160))
      }
      fetch('/api/visitors', { cache: 'no-store', signal })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => appendStats(visitorStatsLines(data)))
        .catch(() => appendStats(visitorStatsLines(null)))
    }
  }

  // Types a command into the prompt one key at a time, then runs it; returns a cancel for effect cleanup.
  function autoRun(command: string, onRun?: () => void) {
    let typed = 0
    const step = () => {
      if (typed < command.length) {
        setInput(command.slice(0, ++typed))
        return
      }
      clearInterval(timer)
      onRun?.()
      execute(command)
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) typed = command.length
    const timer = setInterval(step, 90)
    return () => clearInterval(timer)
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
      // Mid-duel, typed "clear" is not a move, so the shortcut clears the screen directly and keeps the duel.
      if (duel) {
        flush()
        setLines([])
      } else {
        execute('clear')
      }
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
    dueling: duel !== null,
    input,
    candidates,
    activeCandidate,
    ghostSuffix,
    field,
    choose,
    autoRun,
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
