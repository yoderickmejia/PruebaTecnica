import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { BACKEND_URL, COOKIE_OPTS_ACCESS, COOKIE_OPTS_REFRESH } from '@/lib/backend'

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value

  if (!refreshToken) {
    return NextResponse.json({ detail: 'No refresh token' }, { status: 401 })
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/token/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
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
