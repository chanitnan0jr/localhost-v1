"use client"
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface HistoryLine {
  type: 'input' | 'output' | 'error' | 'success'
  text: string
}

function detectOS(ua: string): string {
  if (/Windows NT 10\.0/.test(ua)) return 'Windows 10/11 x86_64'
  if (/Windows NT 6\.3/.test(ua)) return 'Windows 8.1 x86_64'
  if (/Windows NT 6\.1/.test(ua)) return 'Windows 7 x86_64'
  if (/Android (\d+)/.test(ua)) return `Android ${ua.match(/Android (\d+)/)?.[1]} ARM64`
  if (/iPhone|iPad/.test(ua)) return 'iOS ARM64'
  if (/Mac OS X ([\d_]+)/.test(ua)) {
    const ver = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') ?? ''
    return `macOS ${ver} arm64`
  }
  if (/Linux/.test(ua)) return 'Linux x86_64'
  return 'Unknown OS'
}

function detectBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return 'Microsoft Edge'
  if (/OPR\//.test(ua)) return 'Opera'
  if (/Chrome\//.test(ua)) return 'Chromium-based'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Safari\//.test(ua)) return 'Safari'
  return 'Unknown Browser'
}

function buildBootSequence(info: {
  ip: string
  os: string
  browser: string
  cores: number
  ram: string
  screen: string
  tz: string
  connection: string
}): string[] {
  const ts = (ms: number) => `[${(ms / 1000).toFixed(6)}]`
  return [
    `kernel: ${ts(0)} Booting Linux 6.8.0-localhost #1 SMP`,
    `kernel: ${ts(312)} Detected CPU: ${info.cores} cores online`,
    `kernel: ${ts(498)} Memory: ${info.ram} available`,
    `kernel: ${ts(621)} Display: ${info.screen}`,
    `kernel: ${ts(883)} NET: Registered PF_INET6 protocol family`,
    `kernel: ${ts(1024)} Timezone: ${info.tz}`,
    `systemd[1]: Starting localhost-v1.service...`,
    `systemd[1]: Client OS: ${info.os}`,
    `systemd[1]: Browser: ${info.browser}`,
    `systemd[1]: Connection: ${info.connection}`,
    `systemd[1]: Source IP: ${info.ip}`,
    '',
    `localhost login: visitor`,
    `Last login: ${new Date().toDateString()}`,
    '',
    'bash: /var/www/html: No such file or directory',
    'Segmentation fault (core dumped)',
    '',
    '404: PAGE_NOT_FOUND — The address you requested does not exist.',
    "Type 'help' for available commands.",
  ]
}

const COMMANDS: Record<string, (args: string[]) => string[]> = {
  help: () => [
    'Available commands:',
    '  help          Show this message',
    '  whoami        Display current user',
    '  ls            List available routes',
    '  cd <dir>      Change directory',
    '  cat README    Read about this system',
    '  uname -a      System information',
    '  neofetch      Fetch system information',
    '  stats         Show unique visitor stats',
    '  ping <host>   Send ICMP ECHO_REQUEST to network hosts',
    '  curl <url>    Transfer a URL',
    '  sudo <cmd>    Execute a command as superuser',
    '  GET /         Navigate to home',
    '  GET /projects Navigate to projects',
    '  clear         Clear terminal',
    '  exit          Return to home',
  ],
  whoami: () => [
    'chanitnan',
    'uid=1000(chanitnan) gid=1000(chanitnan)',
    'Backend / Systems Engineer',
    'Thammasat University — Computer Science',
  ],
  ls: () => [
    'total 4',
    'drwxr-xr-x  /home       → /',
    'drwxr-xr-x  /projects   → /projects',
    '-rw-r--r--  README      404 bytes',
  ],
  'ls -la': () => COMMANDS['ls']([]),
  'cat README': () => [
    '# chanitnan.dev',
    '',
    'Backend engineer. C, Java, Python, TypeScript.',
    'Obsessed with internals: allocators, schedulers, lock-free structures.',
    'Currently: Tonkit Lab @ Thammasat University.',
    '',
    'Open for internship — 2026.',
  ],
  'uname -a': () => [
    'Linux localhost-v1 6.8.0 #1 SMP ' + new Date().toUTCString(),
    'x86_64 x86_64 x86_64 GNU/Linux',
  ],
  'uname': () => COMMANDS['uname -a']([]),
  clear: () => [],
  exit: () => ['Redirecting to /home...'],
  'GET /': () => ['301 Moved Permanently → /'],
  'GET /home': () => ['301 Moved Permanently → /'],
  'GET /projects': () => ['301 Moved Permanently → /projects'],
  'cd /home': () => ['301 Moved Permanently → /'],
  'cd /': () => ['301 Moved Permanently → /'],
  'cd /projects': () => ['301 Moved Permanently → /projects'],
  home: () => ['301 Moved Permanently → /'],
}

const ALL_COMMANDS = [
  'help', 'whoami', 'ls', 'ls -la', 'cat README',
  'uname -a', 'uname', 'stats', 'neofetch', 'fastfetch',
  'ping', 'ping github.com', 'curl', 'curl api.github.com/users/chanitnan', 'sudo', 'sudo su',
  'GET /', 'GET /home', 'GET /projects',
  'cd /home', 'cd /', 'cd /projects', 'home', 'clear', 'exit',
]

const NAVIGATE: Record<string, string> = {
  exit: '/',
  'GET /': '/',
  'GET /home': '/',
  'cd /home': '/',
  'cd /': '/',
  'cd /projects': '/projects',
  home: '/',
  'GET /projects': '/projects',
}

export default function NotFound() {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryLine[]>([])
  const [input, setInput] = useState('')
  const [booted, setBooted] = useState(false)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdIndex, setCmdIndex] = useState(-1)
  const [hints, setHints] = useState<string[]>([])
  const [readme, setReadme] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Boot sequence typewriter
  useEffect(() => {
    const nav = navigator as Navigator & {
      deviceMemory?: number
      connection?: { effectiveType?: string }
    }

    fetch('/api/sysinfo')
      .then((r) => r.json())
      .catch(() => ({ ip: '127.0.0.1', readme: '' }))
      .then(({ ip, readme }) => {
        setReadme(readme)
        const sequence = buildBootSequence({
          ip,
          os: detectOS(navigator.userAgent),
          browser: detectBrowser(navigator.userAgent),
          cores: navigator.hardwareConcurrency ?? 1,
          ram: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'unknown',
          screen: `${window.screen.width}x${window.screen.height}`,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          connection: nav.connection?.effectiveType ?? 'unknown',
        })

        let i = 0
        const lines: HistoryLine[] = []
        const interval = setInterval(() => {
          if (i < sequence.length) {
            lines.push({ type: 'output', text: sequence[i] })
            setHistory([...lines])
            i++
          } else {
            clearInterval(interval)
            setBooted(true)
            setTimeout(() => inputRef.current?.focus(), 100)
          }
        }, 60)
      })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return

    const newHistory: HistoryLine[] = [
      ...history,
      { type: 'input', text: cmd },
    ]

    setCmdHistory((prev) => [cmd, ...prev])
    setCmdIndex(-1)
    setInput('')

    const cmdLower = cmd.toLowerCase()

    if (cmdLower === 'clear') {
      setHistory([])
      return
    }

    if (cmdLower === 'stats') {
      setHistory([...newHistory, { type: 'output', text: 'Fetching visitor stats...' }])
      fetch('/api/visitors')
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            setHistory((h) => [...h, { type: 'error', text: `Error: ${data.error}` }])
            return
          }
          const lines: HistoryLine[] = [
            { type: 'success', text: `Total unique visitors: ${data.total}` },
            { type: 'output', text: '' },
            { type: 'output', text: 'Breakdown by OS:' },
            ...Object.entries(data.byOs as Record<string, number>)
              .sort(([, a], [, b]) => b - a)
              .map(([os, count]) => ({
                type: 'output' as const,
                text: `  ${os.padEnd(18)} ${count} visitor${count !== 1 ? 's' : ''}`,
              })),
          ]
          setHistory((h) => [...h.slice(0, -1), ...lines])
        })
        .catch(() => {
          setHistory((h) => [...h.slice(0, -1), { type: 'error', text: 'Failed to fetch stats.' }])
        })
      return
    }

    if (cmdLower === 'cat readme') {
      const lines = readme
        ? readme.split('\n').slice(0, 40)
        : ['README.md: file not found']
      setHistory([...newHistory, ...lines.map((text) => ({ type: 'output' as const, text: text || '\u00A0' }))])
      return
    }

    if (cmdLower === 'neofetch' || cmdLower === 'fastfetch') {
      const nav = navigator as any
      const os = detectOS(navigator.userAgent)
      const browser = detectBrowser(navigator.userAgent)
      const cores = navigator.hardwareConcurrency ?? 1
      const ram = nav.deviceMemory ? `${nav.deviceMemory} GB` : 'unknown'
      const screen = `${window.screen.width}x${window.screen.height}`

      const ascii = [
        `      ::::::::      `,
        `    ::::::::::::    `,
        `  ::::::    ::::::  `,
        ` :::::        ::::: `,
        ` :::::        ::::: `,
        ` :::::        ::::: `,
        `  ::::::    ::::::  `,
        `    ::::::::::::    `,
        `      ::::::::      `,
      ]

      const info = [
        `visitor@localhost-v1`,
        `--------------------`,
        `OS: ${os}`,
        `Host: Web Terminal`,
        `Kernel: 6.8.0-localhost`,
        `Uptime: ${Math.floor(performance.now() / 60000)} mins`,
        `Packages: 404 (dpkg)`,
        `Shell: bash 5.1.16`,
        `Resolution: ${screen}`,
        `Environment: ${browser}`,
        `CPU: ${cores} Cores`,
        `Memory: ${ram}`,
      ]

      const maxLen = Math.max(ascii.length, info.length)
      const outLines = []
      for (let i = 0; i < maxLen; i++) {
        const a = ascii[i] || '                    '
        const b = info[i] || ''
        outLines.push({ type: 'output' as const, text: `${a}  ${b}` })
      }
      setHistory([...newHistory, ...outLines])
      return
    }

    if (cmdLower.startsWith('sudo')) {
      setHistory([
        ...newHistory,
        { type: 'output', text: `[sudo] password for visitor:` },
        { type: 'error', text: `visitor is not in the sudoers file. This incident will be reported.` }
      ])
      return
    }

    if (cmdLower.startsWith('ping')) {
      const target = cmdLower.split(' ')[1] || 'github.com'
      setHistory([
        ...newHistory,
        { type: 'output', text: `PING ${target} (140.82.112.4) 56(84) bytes of data.` },
        { type: 'output', text: `64 bytes from ${target}: icmp_seq=1 ttl=52 time=14.2 ms` },
        { type: 'output', text: `64 bytes from ${target}: icmp_seq=2 ttl=52 time=13.5 ms` },
        { type: 'output', text: `64 bytes from ${target}: icmp_seq=3 ttl=52 time=14.0 ms` },
        { type: 'output', text: `--- ${target} ping statistics ---` },
        { type: 'output', text: `3 packets transmitted, 3 received, 0% packet loss, time 2003ms` },
      ])
      return
    }

    if (cmdLower.startsWith('curl')) {
      setHistory([
        ...newHistory,
        { type: 'output', text: `HTTP/2 200 ` },
        { type: 'output', text: `content-type: application/json` },
        { type: 'output', text: `{` },
        { type: 'output', text: `  "login": "chanitnan",` },
        { type: 'output', text: `  "type": "User",` },
        { type: 'output', text: `  "bio": "Backend / Systems Engineer"` },
        { type: 'output', text: `}` },
      ])
      return
    }

    const handler = COMMANDS[cmdLower] || COMMANDS[cmd]
    if (handler) {
      const output = handler([])
      const outputLines: HistoryLine[] = output.map((line) => ({
        type: line.startsWith('301') ? 'success' : 'output',
        text: line,
      }))
      setHistory([...newHistory, ...outputLines])

      if (NAVIGATE[cmdLower] || NAVIGATE[cmd]) {
        setTimeout(() => router.push(NAVIGATE[cmdLower] || NAVIGATE[cmd]), 600)
      }
    } else {
      setHistory([
        ...newHistory,
        { type: 'error', text: `bash: ${cmd}: command not found` },
        { type: 'error', text: `Segmentation fault (core dumped)` },
        { type: 'output', text: `Try 'help' to see available commands.` },
      ])
    }
  }, [input, history, router, readme])

  const handleInputChange = useCallback((val: string) => {
    setInput(val)
    setHints(val.trim() ? ALL_COMMANDS.filter(c => c.startsWith(val.trim().toLowerCase())) : [])
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      if (hints.length > 0) {
        setInput(hints[0])
        setHints([])
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(cmdIndex + 1, cmdHistory.length - 1)
      setCmdIndex(next)
      setInput(cmdHistory[next] ?? '')
      setHints([])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(cmdIndex - 1, -1)
      setCmdIndex(next)
      setInput(next === -1 ? '' : cmdHistory[next])
      setHints([])
    } else if (e.key === 'Escape') {
      setHints([])
    }
  }, [cmdIndex, cmdHistory, hints])

  return (
    <div
      className="min-h-screen bg-black flex flex-col font-mono cursor-text"
      onClick={() => inputRef.current?.focus()}
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
        <div className="space-y-1">
          {history.map((line, i) => (
            <div key={i} className="flex items-start gap-2">
              {line.type === 'input' && (
                <span className="text-accent-green/40 shrink-0 select-none">$</span>
              )}
              <p
                className={[
                  'text-sm leading-relaxed tracking-wide whitespace-pre-wrap break-all',
                  line.type === 'input' ? 'text-white font-bold' : '',
                  line.type === 'output' ? 'text-accent-green/70' : '',
                  line.type === 'error' ? 'text-red-400' : '',
                  line.type === 'success' ? 'text-accent-green font-bold' : '',
                ].join(' ')}
              >
                {line.text || '\u00A0'}
              </p>
            </div>
          ))}
        </div>

        {/* Input line */}
        {booted && (
          <div className="mt-1">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-accent-green/40 shrink-0 select-none text-sm">$</span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
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
                  <span className="blink-fast inline-block w-[0.55em] h-[1.1em] bg-accent-green align-middle" />
                </span>
              </div>
            </form>

            {/* Hints */}
            {hints.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pl-4">
                {hints.map((hint, i) => (
                  <button
                    key={hint}
                    onClick={() => { setInput(hint); setHints([]); inputRef.current?.focus() }}
                    className={[
                      'text-xs font-mono tracking-wide px-3 py-1 rounded border transition-all',
                      i === 0
                        ? 'bg-accent-green/10 border-accent-green/40 text-accent-green'
                        : 'bg-white/5 border-white/10 text-neutral-500 hover:border-white/20 hover:text-neutral-300',
                    ].join(' ')}
                  >
                    {hint}
                    {i === 0 && <span className="ml-2 text-accent-green/40 text-[10px]">tab</span>}
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
