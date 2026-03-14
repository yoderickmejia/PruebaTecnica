import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

const COOKIE_OPTS_ACCESS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 30,
  path: '/',
}

const COOKIE_OPTS_REFRESH = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
}

function applyCookiesToResponse(
  response: NextResponse,
  tokens: { access_token: string; refresh_token: string }
) {
  response.cookies.set('access_token', tokens.access_token, COOKIE_OPTS_ACCESS)
  response.cookies.set('refresh_token', tokens.refresh_token, COOKIE_OPTS_REFRESH)
}

async function tryRefresh(
  refreshToken: string
): Promise<{ access_token: string; refresh_token: string } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function callBackend(
  path: string,
  options: RequestInit = {},
  requireAuth = true
): Promise<{ data: unknown; status: number; newTokens?: { access_token: string; refresh_token: string } }> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (requireAuth && !accessToken) {
    const refreshToken = cookieStore.get('refresh_token')?.value
    if (!refreshToken) {
      return { data: { detail: 'No autenticado' }, status: 401 }
    }
    const tokens = await tryRefresh(refreshToken)
    if (!tokens) {
      return { data: { detail: 'Sesión expirada' }, status: 401 }
    }
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })
    const data = await res.json()
    return { data, status: res.status, newTokens: tokens }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`

  const res = await fetch(`${BACKEND_URL}${path}`, { ...options, headers })

  if (res.status === 401 && requireAuth) {
    const refreshToken = cookieStore.get('refresh_token')?.value
    if (!refreshToken) return { data: { detail: 'Sesión expirada' }, status: 401 }
    const tokens = await tryRefresh(refreshToken)
    if (!tokens) return { data: { detail: 'Sesión expirada' }, status: 401 }
    const retry = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      headers: { ...headers, Authorization: `Bearer ${tokens.access_token}` },
    })
    const data = await retry.json()
    return { data, status: retry.status, newTokens: tokens }
  }

  const data = await res.json()
  return { data, status: res.status }
}

export function buildResponse(
  result: { data: unknown; status: number; newTokens?: { access_token: string; refresh_token: string } }
): NextResponse {
  const response = NextResponse.json(result.data, { status: result.status })
  if (result.newTokens) {
    applyCookiesToResponse(response, result.newTokens)
  }
  return response
}

export { BACKEND_URL, COOKIE_OPTS_ACCESS, COOKIE_OPTS_REFRESH, applyCookiesToResponse }
