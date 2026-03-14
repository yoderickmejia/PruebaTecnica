import { useQuery } from '@tanstack/react-query'
import type { ArticleDetail } from '@/types'

async function fetchArticle(id: string): Promise<ArticleDetail> {
  const res = await fetch(`/api/articles/${id}`)
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Error al cargar el artículo')
  }
  return res.json()
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticle(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}
