'use client'

import Link from 'next/link'
import { Trash2, ExternalLink, Calendar } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { useDeleteArticle } from '@/hooks/use-saved-articles'
import type { SavedArticle } from '@/types'

interface SavedArticleCardProps {
  article: SavedArticle
}

export function SavedArticleCard({ article }: SavedArticleCardProps) {
  const { mutate: deleteArticle, isPending } = useDeleteArticle()

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex-1 p-5">
        <Link href={`/article/${article.wikipedia_id}`} className="group">
          <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {article.title}
          </h3>
        </Link>
        {article.summary && (
          <p className="text-sm text-muted-foreground line-clamp-3">{article.summary}</p>
        )}
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(article.created_at)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Wikipedia
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => deleteArticle(article.id)}
          disabled={isPending}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
