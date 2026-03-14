import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/components/providers/query-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Navbar } from '@/components/layout/navbar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wikipedia Knowledge Explorer',
  description: 'Explora, analiza y guarda artículos de Wikipedia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                  <p>Wikipedia Knowledge Explorer &mdash; Datos de{' '}
                    <a href="https://wikipedia.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Wikipedia
                    </a>
                  </p>
                </footer>
              </div>
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
