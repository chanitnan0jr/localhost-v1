export interface ClientInfo {
  os: string
  browser: string
  cores: number
  ram: string
  screen: string
  tz: string
  connection: string
}

type BrowserNavigator = Navigator & {
  deviceMemory?: number
  connection?: { effectiveType?: string }
}

export function detectOS(ua: string): string {
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

export function detectBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return 'Microsoft Edge'
  if (/OPR\//.test(ua)) return 'Opera'
  if (/Chrome\//.test(ua)) return 'Chromium-based'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Safari\//.test(ua)) return 'Safari'
  return 'Unknown Browser'
}

// Browser only: reads navigator, screen and the resolved timezone.
export function readClientInfo(): ClientInfo {
  const nav = navigator as BrowserNavigator
  return {
    os: detectOS(nav.userAgent),
    browser: detectBrowser(nav.userAgent),
    cores: nav.hardwareConcurrency ?? 1,
    ram: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'unknown',
    screen: `${window.screen.width}x${window.screen.height}`,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    connection: nav.connection?.effectiveType ?? 'unknown',
  }
}

export function buildBootSequence(ip: string, info: ClientInfo): string[] {
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
    `systemd[1]: Source IP: ${ip}`,
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
