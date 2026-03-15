import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/query-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Navbar } from '@/components/layout/navbar'
import { Toaster } from 'sonner'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wikipedia Knowledge Explorer',
  description: 'Busca, analiza y guarda artículos de Wikipedia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={geist.className}>
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
                Wikipedia Knowledge Explorer — datos de <a href="https://wikipedia.org" target="_blank" rel="noreferrer" className="text-primary hover:underline">Wikipedia</a>
              </footer>
            </div>
            <Toaster theme="dark" position="top-right" richColors />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
