'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, BookOpen, Loader2, Check, X } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

function PasswordRule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <span className={`flex items-center gap-1.5 text-xs ${ok ? 'text-red-400' : 'text-muted-foreground'}`}>
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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
            <BookOpen className="h-7 w-7 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Crear cuenta</h1>
          <p className="text-sm text-muted-foreground mt-1">Únete a Wikipedia Explorer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              {error}
            </div>
          )}

          {[
            { id: 'email', label: 'Email', type: 'email', key: 'email', placeholder: 'correo@ejemplo.com' },
            { id: 'username', label: 'Usuario', type: 'text', key: 'username', placeholder: 'Tu nombre de usuario' },
          ].map(({ id, label, type, key, placeholder }) => (
            <div key={id} className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground" htmlFor={id}>{label}</label>
              <input
                id={id}
                type={type}
                value={form[key as keyof typeof form]}
                onChange={update(key)}
                placeholder={placeholder}
                required
                className="w-full h-11 px-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40 transition-all text-sm"
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="password">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 pr-11 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40 transition-all text-sm"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.password && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                <PasswordRule ok={rules.length} text="8+ caracteres" />
                <PasswordRule ok={rules.upper} text="Una mayúscula" />
                <PasswordRule ok={rules.digit} text="Un número" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !Object.values(rules).every(Boolean)}
            className="w-full h-11 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-medium rounded-xl transition-all text-sm"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
