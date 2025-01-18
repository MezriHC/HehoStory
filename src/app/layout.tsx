import { Inter } from 'next/font/google'
import Header from './components/Header'
import Providers from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'HehoStory',
  description: 'Create and manage your stories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          <div className="min-h-full flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
