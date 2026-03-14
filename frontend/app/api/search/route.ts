import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/backend'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')

  if (!q?.trim()) {
    return NextResponse.json({ detail: 'Query requerida' }, { status: 400 })
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/search?q=${encodeURIComponent(q)}`, {
    headers: { 'Content-Type': 'application/json' },
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
