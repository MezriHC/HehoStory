import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'
import QueryProvider from '@/providers/QueryProvider'

export const metadata = {
  title: 'HehoStory',
  description: 'Application avec authentification Google',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
