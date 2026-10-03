import { NextRequest, NextResponse } from 'next/server'
import { getVisitor, trackVisitor } from '@/lib/visitors'

export async function POST(request: NextRequest) {
  try {
    await trackVisitor(getVisitor(request.headers))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Visitor tracking unavailable' }, { status: 503 })
  }
}
