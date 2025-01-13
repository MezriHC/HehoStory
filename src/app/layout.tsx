import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'

export const metadata = {
  title: 'Mon Application',
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
