'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { SearchBar } from '@/components/search/search-bar'
import { SearchResultCard } from '@/components/search/search-result-card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SearchX } from 'lucide-react'
import { useSearch } from '@/hooks/use-search'

function SkeletonCard() {
  return (
    <div className="flex gap-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-5 py-4 animate-pulse">
      <span className="hidden sm:block w-5 shrink-0" />
      <div className="flex-1 min-w-0 space-y-2.5">
        <div className="h-2.5 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-4 w-3/4 rounded-md bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-3.5 w-full rounded-md bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-3.5 w-5/6 rounded-md bg-zinc-100 dark:bg-zinc-800" />
      </div>
    </div>
  )
}

function SearchResults({ q }: { q: string }) {
  const { data: results, isLoading, error } = useSearch(q)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  if (!results?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <SearchX className="h-7 w-7 text-zinc-400" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Sin resultados</h3>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
          Intenta con otros términos de búsqueda
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {results.map((result, i) => (
        <SearchResultCard key={result.id} result={result} index={i} />
      ))}
    </div>
  )
}

function SearchPage() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950">
      <div className="container max-w-2xl px-4 py-8 sm:py-10">

        {/* Search bar */}
        <div className="mb-8">
          <SearchBar defaultValue={q} />
        </div>

        {q ? (
          <>
            <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
              Resultados para{' '}
              <span className="text-zinc-700 dark:text-zinc-300 normal-case tracking-normal font-semibold">
                &ldquo;{q}&rdquo;
              </span>
            </p>
            <SearchResults q={q} />
          </>
        ) : (
          <div className="text-center py-20 text-zinc-400 dark:text-zinc-500 text-sm">
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
