import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/saved']
const AUTH_ROUTES = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value
  const isAuthenticated = !!(accessToken || refreshToken)

  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
