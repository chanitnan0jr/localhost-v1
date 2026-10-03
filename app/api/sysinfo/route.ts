import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getVisitor, trackVisitor } from '@/lib/visitors'

export async function GET(request: NextRequest) {
  const visitor = getVisitor(request.headers)
  const [readme] = await Promise.all([
    readFile(join(process.cwd(), 'README.md'), 'utf-8').catch(() => ''),
    trackVisitor(visitor).catch(() => {
      console.error('Visitor tracking unavailable')
    }),
  ])
  return NextResponse.json({ ip: visitor.ip, readme }, { headers: { 'Cache-Control': 'no-store' } })
}
