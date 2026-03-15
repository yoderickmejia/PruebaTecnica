'use client'

import { use } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, Bookmark, BookmarkCheck, Hash, FileText, ArrowLeft, AlertCircle, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/components/providers/auth-provider'
import type { ArticleDetail, SavedArticle } from '@/types'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />
}

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: article, isLoading, error } = useQuery<ArticleDetail>({
    queryKey: ['article', id],
    queryFn: async () => {
      const res = await fetch(`/api/articles/${id}`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Error al cargar el artículo')
      }
      return res.json()
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
  })

  const savedArticles = useQuery<SavedArticle[]>({
    queryKey: ['saved'],
    queryFn: async () => {
      const res = await fetch('/api/saved')
      if (!res.ok) return []
      return res.json()
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })

  const isSaved = savedArticles.data?.some(a => a.wikipedia_id === id)

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article!.title,
          wikipedia_id: id,
          url: article!.wikipedia_url,
          summary: article!.summary,
        }),
      })
      if (!res.ok) throw new Error('Error al guardar')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] })
      toast.success('Artículo guardado')
    },
    onError: () => toast.error('Error al guardar el artículo'),
  })

  if (!user) {
    return (
      <div className="container max-w-2xl px-4 py-20 text-center">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Inicia sesión para ver este artículo</h2>
        <p className="text-muted-foreground mb-6">Necesitas una cuenta para acceder al análisis completo</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-all"
        >
          Iniciar sesión
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl px-4 py-10">
        <Skeleton className="h-4 w-24 mb-8" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-8" />
        <div className="flex gap-2 mb-6">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-7 w-20 rounded-full" />)}
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="container max-w-2xl px-4 py-20 text-center">
        <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No se pudo cargar el artículo</h2>
        <p className="text-sm text-muted-foreground mb-6">{(error as Error)?.message}</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-card border border-border hover:border-red-500/30 text-foreground rounded-xl transition-all text-sm">
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl px-4 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <h1 className="text-3xl font-bold text-foreground mb-6 leading-tight">{article.title}</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-muted-foreground">
          <FileText className="h-4 w-4 text-red-500" />
          <span className="font-medium text-foreground">{article.word_count.toLocaleString()}</span> palabras
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border mb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Resumen</h2>
        <p className="text-foreground leading-relaxed">{article.summary}</p>
      </div>

      {article.top_words.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="h-4 w-4 text-red-500" />
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Palabras clave</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.top_words.map((word) => (
              <span
                key={word}
                className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={article.wikipedia_url}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-card border border-border hover:border-red-500/30 hover:bg-red-500/5 text-foreground font-medium transition-all text-sm"
        >
          <ExternalLink className="h-4 w-4 text-red-500" />
          Ver en Wikipedia
        </a>

        <button
          onClick={() => !isSaved && saveMutation.mutate()}
          disabled={isSaved || saveMutation.isPending}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all text-sm ${
            isSaved
              ? 'bg-white/5 border border-white/20 text-white cursor-default'
              : 'bg-red-600 hover:bg-red-500 text-white border border-transparent disabled:opacity-60'
          }`}
        >
          {isSaved ? (
            <><BookmarkCheck className="h-4 w-4" /> Guardado</>
          ) : (
            <><Bookmark className="h-4 w-4" /> {saveMutation.isPending ? 'Guardando...' : 'Guardar artículo'}</>
          )}
        </button>
      </div>
    </div>
  )
}
