import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'

export async function GET() {
  const redis = getRedis()

  if (!redis) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 503 })
  }

  const [total, byOs] = await Promise.all([
    redis.scard('visitors:unique'),
    redis.hgetall('visitors:by_os'),
  ])

  return NextResponse.json({ total: total ?? 0, byOs: byOs ?? {} })
}
