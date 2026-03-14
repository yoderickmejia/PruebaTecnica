import { useQuery } from '@tanstack/react-query'
import type { SearchResult } from '@/types'

async function searchWikipedia(q: string): Promise<SearchResult[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Error en la búsqueda')
  }
  return res.json()
}

export function useSearch(q: string) {
  return useQuery({
    queryKey: ['search', q],
    queryFn: () => searchWikipedia(q),
    enabled: q.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  })
}
