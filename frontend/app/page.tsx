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
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-36 text-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <BookOpen className="h-3.5 w-3.5" />
            Powered by Wikipedia
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-5 leading-tight">
            Explora el conocimiento{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              sin límites
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Busca millones de artículos de Wikipedia, obtén resúmenes inteligentes y guarda lo que más te interesa.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Busca cualquier tema: "Inteligencia artificial", "Python"...'
                className="w-full h-14 pl-12 pr-32 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-base transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className="absolute right-2 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all"
              >
                Buscar
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/30">
        <div className="container max-w-4xl py-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: 'Análisis instantáneo',
              desc: 'Resúmenes automáticos y palabras clave de cualquier artículo al instante.',
              color: 'text-yellow-400',
              bg: 'bg-yellow-400/10',
            },
            {
              icon: Bookmark,
              title: 'Guarda tus artículos',
              desc: 'Crea tu biblioteca personal y accede a ella cuando quieras.',
              color: 'text-indigo-400',
              bg: 'bg-indigo-400/10',
            },
            {
              icon: Globe,
              title: 'Fuente confiable',
              desc: 'Datos directamente de Wikipedia con enlace al artículo original.',
              color: 'text-emerald-400',
              bg: 'bg-emerald-400/10',
            },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-card border border-border hover:border-indigo-500/30 transition-colors">
              <div className={`h-12 w-12 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
