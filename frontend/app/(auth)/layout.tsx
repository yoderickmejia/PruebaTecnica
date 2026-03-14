import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold text-xl">
            <BookOpen className="h-6 w-6" />
            Wiki Explorer
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
