import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/saved']
const AUTH_ONLY = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasToken = request.cookies.has('access_token') || request.cookies.has('refresh_token')

  if (PROTECTED.some(p => pathname.startsWith(p)) && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && hasToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
