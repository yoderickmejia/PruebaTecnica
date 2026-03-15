'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bookmark, ExternalLink, Trash2, BookOpen, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { SavedArticle } from '@/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function SavedPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: articles, isLoading } = useQuery<SavedArticle[]>({
    queryKey: ['saved'],
    queryFn: async () => {
      const res = await fetch('/api/saved')
      if (!res.ok) return []
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/saved/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] })
      toast.success('Artículo eliminado')
    },
    onError: () => toast.error('Error al eliminar'),
  })

  if (isLoading) {
    return (
      <div className="container max-w-2xl px-4 py-10">
        <div className="h-8 w-48 rounded-lg bg-muted animate-pulse mb-8" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-card border border-border animate-pulse">
              <div className="h-5 w-3/4 rounded bg-muted mb-2" />
              <div className="h-4 w-full rounded bg-muted mb-1" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          <Bookmark className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis artículos</h1>
          <p className="text-sm text-muted-foreground">{articles?.length ?? 0} artículos guardados</p>
        </div>
      </div>

      {!articles?.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No tienes artículos guardados</h3>
          <p className="text-sm text-muted-foreground mb-6">Busca y guarda artículos para verlos aquí</p>
          <button
            onClick={() => router.push('/')}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl text-sm transition-all"
          >
            Explorar artículos
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group p-5 rounded-2xl bg-card border border-border hover:border-red-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => router.push(`/article/${article.wikipedia_id}`)}
                    className="font-semibold text-foreground hover:text-red-400 transition-colors text-left block truncate w-full"
                  >
                    {article.title}
                  </button>
                  {article.summary && (
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{article.summary}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(article.created_at)}
                    </span>
                    {article.url && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Wikipedia
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(article.id)}
                  disabled={deleteMutation.isPending}
                  className="shrink-0 p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
