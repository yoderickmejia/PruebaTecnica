import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL, COOKIE_OPTS_ACCESS, COOKIE_OPTS_REFRESH } from '@/lib/backend'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await fetch(`${BACKEND_URL}/api/v1/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('access_token', data.access_token, COOKIE_OPTS_ACCESS)
  response.cookies.set('refresh_token', data.refresh_token, COOKIE_OPTS_REFRESH)
  return response
}
