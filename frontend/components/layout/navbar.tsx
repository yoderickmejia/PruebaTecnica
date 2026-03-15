'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Search, Bookmark, LogOut, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/components/providers/auth-provider'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <BookOpen className="h-5 w-5" />
          <span className="hidden sm:inline">Wiki Explorer</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              Buscar
            </Link>
          </Button>
          {user && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/saved" className="flex items-center gap-1">
                <Bookmark className="h-4 w-4" />
                Mis artículos
              </Link>
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center text-white text-sm font-bold ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  {user.username.charAt(0).toUpperCase()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-64 p-0 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]"
              >
                {/* User info header */}
                <div className="px-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">{user.username}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                  <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:bg-zinc-50 dark:focus:bg-zinc-800">
                    <Link href="/saved" className="flex items-center gap-2.5">
                      <Bookmark className="h-4 w-4 text-zinc-400" />
                      Mis artículos guardados
                    </Link>
                  </DropdownMenuItem>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 p-1.5">
                  <DropdownMenuItem
                    className="rounded-lg px-3 py-2.5 cursor-pointer text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 focus:bg-red-50 dark:focus:bg-red-950/40 focus:text-red-500"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2.5 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={cn('md:hidden border-t bg-background px-4 py-3 flex flex-col gap-2')}>
          <Button variant="ghost" size="sm" asChild className="justify-start" onClick={() => setMenuOpen(false)}>
            <Link href="/" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </Link>
          </Button>
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild className="justify-start" onClick={() => setMenuOpen(false)}>
                <Link href="/saved" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Mis artículos guardados
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-destructive"
                onClick={() => { logout(); setMenuOpen(false) }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="justify-start" onClick={() => setMenuOpen(false)}>
                <Link href="/login">
                  <User className="mr-2 h-4 w-4" />
                  Iniciar sesión
                </Link>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
