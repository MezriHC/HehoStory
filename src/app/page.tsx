'use client'

import Header from '@/components/Header'
import { useAuth } from '@/providers/AuthProvider'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-64 bg-gray-200 rounded" />
              <div className="h-32 w-full bg-gray-200 rounded" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700">
                Bienvenue {user?.user_metadata.full_name || user?.email}
              </h2>
              <p className="mt-2 text-gray-500">
                Vous êtes maintenant connecté à votre espace personnel
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
