'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Languages } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()
  const [activeDropdown, setActiveDropdown] = useState<'profile' | 'language' | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { user } = session
        setAvatarUrl(user.user_metadata.avatar_url)
      }
    }
    getProfile()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const toggleDropdown = (dropdown: 'profile' | 'language') => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  return (
    <div className="w-full border-b border-gray-200">
      <header className="max-w-[1600px] mx-auto flex items-center justify-between px-6 py-4 bg-white">
        <Link href="/dashboard" className="text-xl font-semibold text-gray-900">
          HehoStory
        </Link>

        <nav className="flex items-center gap-6">
          <Link 
            href="/story" 
            className={`text-sm font-medium transition-colors relative group py-1
              ${pathname === '/story' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Stories
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-gray-900 transition-all
              ${pathname === '/story' ? 'w-full' : 'w-0 group-hover:w-full'}`} 
            />
          </Link>
          <Link 
            href="/widget"
            className={`text-sm font-medium transition-colors relative group py-1
              ${pathname === '/widget' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Widgets
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-gray-900 transition-all
              ${pathname === '/widget' ? 'w-full' : 'w-0 group-hover:w-full'}`} 
            />
          </Link>
          <Link 
            href="/integration"
            className={`text-sm font-medium transition-colors relative group py-1
              ${pathname === '/integration' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Integration
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-gray-900 transition-all
              ${pathname === '/integration' ? 'w-full' : 'w-0 group-hover:w-full'}`} 
            />
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Sélecteur de langue */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('language')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Languages className="w-5 h-5" />
            </button>
            {activeDropdown === 'language' && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <span>🇫🇷</span>
                  <span>Français</span>
                </button>
                <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <span>🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
            )}
          </div>

          {/* Menu profil */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('profile')}
              className="flex items-center gap-2"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200" />
              )}
            </button>
            {activeDropdown === 'profile' && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configuration du profil
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  )
} 