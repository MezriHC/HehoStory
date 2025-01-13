'use client'

import { useAuth } from '@/providers/AuthProvider'
import { Button } from './ui/button'
import Link from 'next/link'

export default function Header() {
  const { user, signOut, loading } = useAuth()

  if (loading) {
    return (
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="animate-pulse bg-gray-200 h-6 w-32 rounded" />
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
            Mon Application
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Accueil
            </Link>
          </nav>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user.user_metadata.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full"
                />
              )}
              <span className="text-sm font-medium text-gray-700">
                {user.user_metadata.full_name || user.email}
              </span>
            </div>
            <Button
              onClick={signOut}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Déconnexion
            </Button>
          </div>
        )}
      </div>
    </header>
  )
} 