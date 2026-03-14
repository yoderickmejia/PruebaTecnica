import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { stripHtml } from '@/lib/utils'
import type { SearchResult } from '@/types'

interface SearchResultCardProps {
  result: SearchResult
  index: number
}

export function SearchResultCard({ result, index }: SearchResultCardProps) {
  return (
    <Link href={`/article/${result.id}`} className="block group">
      <div className="relative flex gap-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-5 py-4 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] hover:-translate-y-[1px] transition-all duration-200">
        {/* Left accent */}
        <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-blue-500/0 group-hover:bg-blue-500 transition-all duration-200" />

        {/* Index */}
        <span className="hidden sm:block shrink-0 text-[11px] font-semibold text-zinc-300 dark:text-zinc-700 tabular-nums pt-0.5 w-5 text-right">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-1.5">
            Wikipedia
          </p>
          <h3 className="font-semibold text-[15px] sm:text-base leading-snug text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 pr-6">
            {result.title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {stripHtml(result.snippet)}
          </p>
        </div>

        {/* Arrow */}
        <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-zinc-300 dark:text-zinc-700 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
      </div>
    </Link>
  )
}
