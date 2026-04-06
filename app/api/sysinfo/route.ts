import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getRedis } from '@/lib/redis'

function detectOS(ua: string): string {
  if (/Windows NT 10\.0/.test(ua)) return 'Windows 10/11'
  if (/Windows NT 6\.1/.test(ua)) return 'Windows 7'
  if (/Android (\d+)/.test(ua)) return `Android ${ua.match(/Android (\d+)/)?.[1]}`
  if (/iPhone|iPad/.test(ua)) return 'iOS'
  if (/Mac OS X/.test(ua)) return 'macOS'
  if (/Linux/.test(ua)) return 'Linux'
  return 'Unknown'
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  const ua = request.headers.get('user-agent') || ''
  const os = detectOS(ua)
  const readme = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf-8')

  // Track unique visitor (fire-and-forget, never block the response)
  const redis = getRedis()
  if (redis && ip !== '127.0.0.1') {
    const visitorKey = `${ip}|${os}`
    redis.sadd('visitors:unique', visitorKey).then((isNew) => {
      if (isNew === 1) {
        redis.hincrby('visitors:by_os', os, 1)
        redis.hincrby('visitors:by_ip', ip, 1)
      }
    }).catch(() => {})
  }

  return NextResponse.json({ ip, readme })
}
