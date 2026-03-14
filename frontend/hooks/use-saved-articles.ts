import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { SavedArticle, SaveArticlePayload } from '@/types'

async function fetchSaved(): Promise<SavedArticle[]> {
  const res = await fetch('/api/saved')
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Error al cargar artículos guardados')
  }
  return res.json()
}

async function saveArticle(payload: SaveArticlePayload): Promise<SavedArticle> {
  const res = await fetch('/api/saved', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Error al guardar el artículo')
  }
  return res.json()
}

async function deleteArticle(id: number): Promise<void> {
  const res = await fetch(`/api/saved/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Error al eliminar el artículo')
  }
}

export function useSavedArticles(enabled = true) {
  return useQuery({
    queryKey: ['saved'],
    queryFn: fetchSaved,
    enabled,
    staleTime: 2 * 60 * 1000,
  })
}

export function useSaveArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] })
      toast.success('Artículo guardado')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] })
      toast.success('Artículo eliminado')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
