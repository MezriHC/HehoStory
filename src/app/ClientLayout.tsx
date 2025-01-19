'use client'

import Header from './components/Header'
import { usePathname } from 'next/navigation'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  return (
    <div className="min-h-full flex flex-col">
      {!isAuthPage && <Header />}
      <main className={`flex-1 w-full ${!isAuthPage ? 'max-w-7xl mx-auto px-4 py-6' : ''}`}>
        {children}
      </main>
    </div>
  )
} 