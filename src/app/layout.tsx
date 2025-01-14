import './globals.css'
import { Inter } from 'next/font/google'
import HeaderWrapper from '../components/HeaderWrapper'
import Providers from './providers'

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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <HeaderWrapper />
          {children}
        </Providers>
      </body>
    </html>
  )
}
