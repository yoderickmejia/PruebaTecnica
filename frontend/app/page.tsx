import Link from 'next/link'
import { BookOpen, Zap, Bookmark, Globe, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 py-20 md:py-32 text-center">
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-6">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Wikipedia Knowledge{' '}
          <span className="text-primary">Explorer</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-10">
          Busca cualquier tema, obtén resúmenes inteligentes y análisis de texto de millones de artículos de Wikipedia.
        </p>
        <Button size="lg" asChild className="gap-2">
          <Link href="/search">
            <Search className="h-5 w-5" />
            Comenzar a buscar
          </Link>
        </Button>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30">
        <div className="container py-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-base">Análisis instantáneo</h3>
            <p className="text-sm text-muted-foreground">
              Resúmenes automáticos y análisis de palabras clave de cualquier artículo.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10">
              <Bookmark className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-base">Guarda tus artículos</h3>
            <p className="text-sm text-muted-foreground">
              Crea tu biblioteca personal de artículos para consultar cuando quieras.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-base">Fuente confiable</h3>
            <p className="text-sm text-muted-foreground">
              Datos directamente de Wikipedia en inglés con enlace al artículo original.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
