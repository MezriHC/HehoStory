'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function SignIn() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/story')
      }
    }
    checkUser()
  }, [router, supabase])

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Erreur de connexion:', error.message)
    }
  }

  return (
    <div className="flex h-full">
      {/* Partie gauche - Authentification */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-12 xl:px-16 bg-white border-r border-gray-200">
        <div className="w-full max-w-sm mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Coming soon..."
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Coming soon..."
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between opacity-50">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    disabled
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded cursor-not-allowed"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Remember for 30 days
                  </label>
                </div>
                <button disabled className="text-sm font-medium text-gray-900 hover:text-gray-800 cursor-not-allowed">
                  Forgot Password?
                </button>
              </div>

              <button
                disabled
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-300 cursor-not-allowed"
              >
                Coming soon
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-900 rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button disabled className="font-medium text-gray-900 hover:text-gray-800 cursor-not-allowed">
                  Coming soon
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partie droite - Dégradé */}
      <div className="hidden lg:block w-1/2 bg-gradient-to-b from-gray-100 to-gray-900" />
    </div>
  )
} 