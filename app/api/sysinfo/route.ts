import { NextRequest, NextResponse } from 'next/server'
import { getVisitor, trackVisitor } from '@/lib/visitors'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const visitor = getVisitor(request.headers)
  await trackVisitor(visitor).catch(() => {
    console.error('Visitor tracking unavailable')
  })
  return NextResponse.json({ ip: visitor.ip }, { headers: { 'Cache-Control': 'no-store' } })
}
