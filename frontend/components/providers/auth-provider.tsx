'use client'

import { createContext, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { User } from '@/types'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function fetchMe(): Promise<User | null> {
  const res = await fetch('/api/auth/me')
  if (res.status === 401) return null
  if (!res.ok) return null
  return res.json()
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: user = null, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Error al iniciar sesión')
      }
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['user'] })
      toast.success('Sesión iniciada correctamente')
      router.push('/')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const registerMutation = useMutation({
    mutationFn: async ({
      email,
      username,
      password,
    }: {
      email: string
      username: string
      password: string
    }) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Error al registrarse')
      }
    },
    onSuccess: () => {
      toast.success('Cuenta creada correctamente. Inicia sesión.')
      router.push('/login')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { method: 'POST' })
    },
    onSuccess: () => {
      queryClient.setQueryData(['user'], null)
      queryClient.invalidateQueries({ queryKey: ['saved'] })
      toast.success('Sesión cerrada')
      router.push('/')
    },
  })

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: (email, password) => loginMutation.mutateAsync({ email, password }),
        register: (email, username, password) =>
          registerMutation.mutateAsync({ email, username, password }),
        logout: () => logoutMutation.mutateAsync(),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
