'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  defaultValue?: string
  autoFocus?: boolean
  size?: 'default' | 'lg'
}

export function SearchBar({ defaultValue = '', autoFocus = false, size = 'default' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  useEffect(() => {
    setQuery(defaultValue)
  }, [defaultValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Search className={`absolute left-3 text-muted-foreground pointer-events-none ${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca cualquier tema en Wikipedia..."
          autoFocus={autoFocus}
          className={`pl-10 pr-20 ${size === 'lg' ? 'h-14 text-base rounded-xl' : ''}`}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-12 h-8 w-8"
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="submit"
          size={size === 'lg' ? 'default' : 'sm'}
          className="absolute right-1"
          disabled={!query.trim()}
        >
          Buscar
        </Button>
      </div>
    </form>
  )
}
