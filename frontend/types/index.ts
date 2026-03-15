export interface User {
  id: number
  email: string
  username: string
  is_active: boolean
  created_at: string
}

export interface SearchResult {
  id: string
  title: string
  snippet: string
}

export interface ArticleDetail {
  title: string
  summary: string
  word_count: number
  top_words: string[]
  wikipedia_url: string
}

export interface SavedArticle {
  id: number
  title: string
  wikipedia_id: string
  url: string
  summary: string | null
  created_at: string
}
