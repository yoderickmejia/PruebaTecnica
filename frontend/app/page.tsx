'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, BookOpen, Zap, Bookmark, Globe, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-4 py-28 md:py-40 text-center">
        {/* Extra red glow behind the search */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(185,28,28,0.18) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 w-full max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-7 backdrop-blur-sm">
            <BookOpen className="h-3.5 w-3.5" />
            Powered by Wikipedia
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08]">
            Explora el<br />
            <span className="text-red-500">universo</span>{' '}
            <span className="text-white/70">del saber</span>
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-lg mx-auto mb-12 leading-relaxed">
            Millones de artículos de Wikipedia. Resúmenes inteligentes, análisis de texto y todo lo que necesitas saber.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-5 h-5 w-5 text-white/30 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='"Agujero negro", "Relatividad", "Galaxia..."'
                className="w-full h-16 pl-14 pr-36 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 text-base backdrop-blur-md transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className="absolute right-2 flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
              >
                Buscar
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <p className="mt-5 text-xs text-white/25">
            Prueba: "Agujero negro", "Materia oscura", "Big Bang"
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-white/5">
        <div className="container max-w-4xl py-16 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: Zap,
              title: 'Análisis instantáneo',
              desc: 'Resúmenes y palabras clave de cualquier artículo al instante.',
            },
            {
              icon: Bookmark,
              title: 'Guarda artículos',
              desc: 'Crea tu biblioteca personal y accede a ella cuando quieras.',
            },
            {
              icon: Globe,
              title: 'Fuente confiable',
              desc: 'Datos de Wikipedia con enlace directo al artículo original.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-red-500/20 hover:bg-white/[0.04] transition-all backdrop-blur-sm"
            >
              <div className="h-11 w-11 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
                <Icon className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="font-semibold text-white/90 text-sm">{title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
