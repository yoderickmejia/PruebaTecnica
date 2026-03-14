'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, Loader2, BarChart2, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useArticle } from '@/hooks/use-article'
import { useSavedArticles, useSaveArticle } from '@/hooks/use-saved-articles'
import { useAuth } from '@/components/providers/auth-provider'

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const { data: article, isLoading, error } = useArticle(id)
  const { data: savedArticles } = useSavedArticles(!!user)
  const { mutate: saveArticle, isPending: isSaving } = useSaveArticle()

  const savedEntry = savedArticles?.find((a) => a.wikipedia_id === id)

  const handleSave = () => {
    if (!article) return
    saveArticle({
      title: article.title,
      wikipedia_id: id,
      url: article.wikipedia_url,
      summary: article.summary,
    })
  }

  if (isLoading) {
    return (
      <div className="container py-8 max-w-3xl">
        <Skeleton className="h-8 w-24 mb-6" />
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/4 mb-8" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8 max-w-3xl">
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link href="javascript:history.back()">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            {error.message === 'No autenticado'
              ? 'Debes iniciar sesión para ver los detalles del artículo.'
              : error.message}
          </AlertDescription>
        </Alert>
        {error.message === 'No autenticado' && (
          <div className="mt-4 flex gap-3">
            <Button asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (!article) return null

  return (
    <div className="container py-8 max-w-3xl">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="-ml-2 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Volver
      </Button>

      {/* Title + actions */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold leading-tight">{article.title}</h1>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <a href={article.wikipedia_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Wikipedia
            </a>
          </Button>
          {user ? (
            savedEntry ? (
              <Button variant="secondary" size="sm" disabled>
                <BookmarkCheck className="h-3.5 w-3.5 mr-1.5" />
                Guardado
              </Button>
            ) : (
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                )}
                Guardar
              </Button>
            )
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                Guardar
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Summary */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Resumen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{article.summary}</p>
        </CardContent>
      </Card>

      {/* Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-primary" />
              Análisis del texto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total de palabras</span>
              <span className="font-semibold">{article.word_count.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Palabras únicas (top)</span>
              <span className="font-semibold">{article.top_words.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              Palabras clave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {article.top_words.map((word) => (
                <Badge key={word} variant="secondary" className="text-xs">
                  {word}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
