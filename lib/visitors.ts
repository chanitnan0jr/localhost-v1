import { isIP } from 'node:net'
import { getRedis } from './redis'

function detectOS(ua: string): string {
  if (/Windows NT 10\.0/.test(ua)) return 'Windows 10/11'
  if (/Windows NT 6\.3/.test(ua)) return 'Windows 8.1'
  if (/Windows NT 6\.1/.test(ua)) return 'Windows 7'
  const android = ua.match(/Android (\d+)/)
  if (android) return `Android ${android[1]}`
  if (/iPhone|iPad/.test(ua)) return 'iOS'
  if (/Mac OS X/.test(ua)) return 'macOS'
  if (/Linux/.test(ua)) return 'Linux'
  return 'Unknown'
}

export function getVisitor(headers: Headers) {
  const forwardedIP = headers.get('x-forwarded-for')?.split(',')[0].trim()
  const ip = forwardedIP || headers.get('x-real-ip')?.trim() || ''
  return {
    ip: isIP(ip) ? ip : '127.0.0.1',
    os: detectOS(headers.get('user-agent') || ''),
  }
}

export async function trackVisitor({ ip, os }: ReturnType<typeof getVisitor>) {
  const redis = getRedis()
  if (!redis || ip === '127.0.0.1' || ip === '::1') return

  // ponytail: reuse the existing IP + OS identity; this is an approximate visitor count.
  const isNew = await redis.sadd('visitors:unique', `${ip}|${os}`)
  if (isNew === 1) {
    await Promise.all([
      redis.hincrby('visitors:by_os', os, 1),
      redis.hincrby('visitors:by_ip', ip, 1),
    ])
  }
}
