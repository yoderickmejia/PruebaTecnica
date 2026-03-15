'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, BookOpen, Loader2, Check, X } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

function PasswordRule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <span className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? 'text-red-400' : 'text-white/30'}`}>
      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {text}
    </span>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const [form, setForm] = useState({ email: '', username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const rules = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    digit: /[0-9]/.test(form.password),
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.email, form.username, form.password)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '500px', height: '450px',
          background: 'radial-gradient(ellipse, rgba(185,28,28,0.13) 0%, transparent 70%)',
          transform: 'translateY(-40px)',
        }}
      />

      <div
        className="relative w-full max-w-sm rounded-3xl p-8"
        style={{
          background: 'rgba(5, 0, 0, 0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 0 80px rgba(185,28,28,0.1), 0 25px 50px rgba(0,0,0,0.6)',
        }}
      >
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
          <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
          <p className="text-sm text-white/40 mt-1">Únete al explorador del universo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}>
              {error}
            </div>
          )}

          {[
            { id: 'email', label: 'Email', type: 'email', key: 'email', placeholder: 'correo@ejemplo.com' },
            { id: 'username', label: 'Usuario', type: 'text', key: 'username', placeholder: 'Tu nombre de usuario' },
          ].map(({ id, label, type, key, placeholder }) => (
            <div key={id} className="space-y-1.5">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider" htmlFor={id}>
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={form[key as keyof typeof form]}
                onChange={update(key)}
                placeholder={placeholder}
                required
                className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/20 text-sm focus:outline-none transition-all"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(220,38,38,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 pr-11 rounded-xl text-white placeholder:text-white/20 text-sm focus:outline-none transition-all"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(220,38,38,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.password && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5">
                <PasswordRule ok={rules.length} text="8+ caracteres" />
                <PasswordRule ok={rules.upper} text="Una mayúscula" />
                <PasswordRule ok={rules.digit} text="Un número" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !Object.values(rules).every(Boolean)}
            className="w-full h-11 flex items-center justify-center gap-2 text-white font-semibold rounded-xl text-sm transition-all mt-2"
            style={{
              background: (loading || !Object.values(rules).every(Boolean))
                ? 'rgba(185,28,28,0.4)'
                : 'rgba(220,38,38,0.9)',
              boxShadow: (!loading && Object.values(rules).every(Boolean))
                ? '0 0 20px rgba(220,38,38,0.3)'
                : 'none',
            }}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-white/30 mt-7">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
