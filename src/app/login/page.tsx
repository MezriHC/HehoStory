'use client'

import GoogleAuthButton from '@/components/GoogleAuthButton'
import { useAuth } from '@/providers/AuthProvider'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-gray-200 rounded mx-auto" />
          <div className="h-10 w-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Bienvenue
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous pour continuer
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <GoogleAuthButton />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Ou continuez avec
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md text-gray-500 bg-gray-50 cursor-not-allowed"
            >
              <span>Email (Bientôt disponible)</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          En vous connectant, vous acceptez nos{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Conditions d'utilisation
          </a>{' '}
          et notre{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Politique de confidentialité
          </a>
        </div>
      </div>
    </div>
  )
} 