'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, BookOpen, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Red glow behind card */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '500px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(185,28,28,0.15) 0%, transparent 70%)',
          transform: 'translateY(-60px)',
        }}
      />

      <div
        className="relative w-full max-w-sm rounded-3xl p-8"
        style={{
          background: 'rgba(5, 0, 0, 0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 0 80px rgba(185,28,28,0.12), 0 25px 50px rgba(0,0,0,0.6)',
        }}
      >
        {/* Icon */}
        <div className="text-center mb-8">
          <div
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-4"
            style={{
              background: 'rgba(185,28,28,0.15)',
              border: '1px solid rgba(220,38,38,0.25)',
              boxShadow: '0 0 30px rgba(185,28,28,0.2)',
            }}
          >
            <BookOpen className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Bienvenido de vuelta</h1>
          <p className="text-sm text-white/40 mt-1">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}>
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/20 text-sm focus:outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(220,38,38,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 pr-11 rounded-xl text-white placeholder:text-white/20 text-sm focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(220,38,38,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center gap-2 text-white font-semibold rounded-xl text-sm transition-all mt-2"
            style={{
              background: loading ? 'rgba(185,28,28,0.5)' : 'rgba(220,38,38,0.9)',
              boxShadow: loading ? 'none' : '0 0 20px rgba(220,38,38,0.3)',
            }}
            onMouseOver={e => { if (!loading) (e.currentTarget.style.background = 'rgb(220,38,38)') }}
            onMouseOut={e => { if (!loading) (e.currentTarget.style.background = 'rgba(220,38,38,0.9)') }}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-sm text-white/30 mt-7">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-red-400 hover:text-red-300 font-medium transition-colors">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
