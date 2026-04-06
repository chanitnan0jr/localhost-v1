import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  const readme = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf-8')

  return NextResponse.json({ ip, readme })
}
