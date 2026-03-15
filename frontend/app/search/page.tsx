'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { Search, X, SearchX, AlertCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { SearchResult } from '@/types'

function SkeletonCard() {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border animate-pulse">
      <div className="h-3 w-16 rounded bg-muted mb-3" />
      <div className="h-5 w-3/4 rounded bg-muted mb-2" />
      <div className="h-4 w-full rounded bg-muted mb-1" />
      <div className="h-4 w-5/6 rounded bg-muted" />
    </div>
  )
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

function SearchResults({ q }: { q: string }) {
  const router = useRouter()

  const { data: results, isLoading, error } = useQuery<SearchResult[]>({
    queryKey: ['search', q],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (!res.ok) throw new Error('Error al buscar')
      return res.json()
    },
    enabled: !!q,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <h3 className="font-semibold text-foreground">Error al buscar</h3>
        <p className="text-sm text-muted-foreground mt-1">Intenta de nuevo más tarde</p>
      </div>
    )
  }

  if (!results?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <SearchX className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground">Sin resultados</h3>
        <p className="text-sm text-muted-foreground mt-1">Intenta con otros términos</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {results.map((result, i) => (
        <button
          key={result.id}
          onClick={() => router.push(`/article/${result.id}`)}
          className="w-full text-left p-5 rounded-2xl bg-card border border-border hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-xs text-muted-foreground font-medium">#{i + 1}</span>
              <h3 className="font-semibold text-foreground group-hover:text-indigo-400 transition-colors mt-0.5 truncate">
                {result.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                {stripHtml(result.snippet)}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const q = searchParams.get('q') || ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container max-w-2xl px-4 py-8">
        {/* Search input */}
        <form onSubmit={handleSubmit} className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca cualquier tema..."
            className="w-full h-12 pl-12 pr-20 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1">
              <X className="h-4 w-4" />
            </button>
          )}
          <button type="submit" disabled={!query.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-all">
            Buscar
          </button>
        </form>

        {q ? (
          <>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">
              Resultados para{' '}
              <span className="text-foreground normal-case tracking-normal font-semibold">&quot;{q}&quot;</span>
            </p>
            <SearchResults q={q} />
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground text-sm">
            Ingresa un término para buscar
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPageWrapper() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  )
}
