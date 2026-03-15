'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, Search, Bookmark, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { user, isLoading, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navLinks = [
    { href: '/search', label: 'Buscar', icon: Search },
    ...(user ? [{ href: '/saved', label: 'Guardados', icon: Bookmark }] : []),
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg" onClick={() => setMenuOpen(false)}>
          <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-red-500" />
          </div>
          <span className="hidden sm:inline text-foreground">
            Wiki <span className="text-red-500">Explorer</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === href || pathname.startsWith(href)
                  ? 'bg-red-500/10 text-red-400'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-card border border-border hover:border-red-500/30 transition-all"
              >
                <div className="h-7 w-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-foreground">{user.username}</span>
                <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', userMenuOpen && 'rotate-180')} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden z-20">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">{user.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={() => { router.push('/saved'); setUserMenuOpen(false) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Bookmark className="h-4 w-4 text-red-500" />
                        Mis artículos
                      </button>
                    </div>
                    <div className="border-t border-border p-1.5">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login" className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                Iniciar sesión
              </Link>
              <Link href="/register" className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all">
                Registrarse
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                pathname === href ? 'bg-red-500/10 text-red-400' : 'text-muted-foreground hover:text-foreground hover:bg-card'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { logout(); setMenuOpen(false) }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-all">
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
