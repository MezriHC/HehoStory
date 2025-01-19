'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowRight, CheckCircle } from 'lucide-react'

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

  const features = [
    "Créez des stories interactives en quelques minutes",
    "Intégration simple sur votre site web",
    "Personnalisation complète de l'apparence",
    "Analytics détaillés sur l'engagement",
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            HehoStory
          </h1>
          <p className="text-lg text-gray-600">
            La plateforme qui transforme vos contenus en expériences interactives
          </p>
        </div>

        <div className="mb-12">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleSignIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 rounded-lg text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200"
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
          <span className="text-base font-medium">Se connecter avec Google</span>
        </button>
      </div>
    </div>
  )
} 