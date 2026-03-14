'use client'

import Link from 'next/link'
import { BookmarkX, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SavedArticleCard } from '@/components/articles/saved-article-card'
import { useSavedArticles } from '@/hooks/use-saved-articles'

export default function SavedPage() {
  const { data: articles, isLoading, error } = useSavedArticles()

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mis artículos guardados</h1>
          {articles && (
            <p className="text-muted-foreground mt-1">
              {articles.length} {articles.length === 1 ? 'artículo guardado' : 'artículos guardados'}
            </p>
          )}
        </div>
        <Button variant="outline" asChild>
          <Link href="/" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar más
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && articles?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookmarkX className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No tienes artículos guardados</h3>
          <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
            Busca artículos en Wikipedia y guárdalos aquí para leerlos después.
          </p>
          <Button asChild>
            <Link href="/">
              <Search className="h-4 w-4 mr-2" />
              Explorar artículos
            </Link>
          </Button>
        </div>
      )}

      {!isLoading && articles && articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <SavedArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
