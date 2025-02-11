"use client"

import { Languages, Menu, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProfileStore } from '@/hooks/useProfile'
import { useTranslation } from '@/hooks/useTranslation'

type NavItem = {
  label: string
  href: string
}

type Language = {
  code: 'FR' | 'EN'
  label: string
  flag: string
}

const languages: Language[] = [
  { 
    code: 'FR', 
    label: 'Français',
    flag: 'https://flagcdn.com/fr.svg'
  },
  { 
    code: 'EN', 
    label: 'English',
    flag: 'https://flagcdn.com/gb.svg'
  }
]

const navItems: NavItem[] = [
  { label: 'Stories', href: '/story' },
  { label: 'Widgets', href: '/widget' },
]

interface Profile {
  name: string
  picture: string | null
}

interface Preferences {
  profile_picture: string | null
  profile_name: string | null
  widget_border_color: string
}

export default function Header() {
  const { userId, supabase } = useAuth()
  const { t, language, setLanguage } = useTranslation()
  const [activeDropdown, setActiveDropdown] = useState<'language' | 'profile' | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { profilePicture, profileName, tempProfilePicture, setGlobalProfile } = useProfileStore()

  // Utiliser l'URL temporaire si elle existe, sinon l'URL permanente
  const displayPicture = tempProfilePicture || profilePicture

  useEffect(() => {
    if (!userId) return

    const loadProfilePicture = async () => {
      try {
        // Charger les préférences
        const { data: prefsData } = await supabase
          .from('preferences')
          .select('profile_picture, profile_name')
          .eq('user_id', userId)
          .single()

        if (prefsData) {
          // Ne mettre à jour que si aucune URL temporaire n'est active
          if (!tempProfilePicture) {
            setGlobalProfile(prefsData.profile_picture, prefsData.profile_name || '')
          }
        }
      } catch (error) {
        console.error('Error loading profile picture:', error)
      }
    }

    loadProfilePicture()
  }, [userId, supabase, tempProfilePicture, setGlobalProfile])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-dropdown]')) {
        setActiveDropdown(null)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  // Close dropdowns when navigating
  useEffect(() => {
    setActiveDropdown(null)
  }, [pathname])

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-semibold text-xl text-gray-900 hover:text-gray-600 transition-colors"
        >
          {t('header.logo')}
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                text-sm font-medium transition-colors relative group py-1
                ${pathname === item.href 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900'}
              `}
            >
              {t(`navigation.${item.label.toLowerCase()}`)}
              <span 
                className={`
                  absolute -bottom-1 left-0 h-0.5 bg-gray-900 transition-all
                  ${pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'}
                `} 
              />
            </Link>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              aria-label={t('header.changeLanguage')}
            >
              <Languages className="w-5 h-5" />
            </button>

            {/* Language Dropdown */}
            {activeDropdown === 'language' && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white border border-gray-200 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code)
                      setActiveDropdown(null)
                    }}
                    className={`
                      w-full px-4 py-2.5 text-sm text-left flex items-center gap-3
                      transition-colors
                      ${language === lang.code 
                        ? 'bg-gray-50 text-gray-900' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <Image
                      src={lang.flag}
                      alt={lang.code}
                      width={16}
                      height={12}
                      className="rounded-sm"
                    />
                    {t(`languages.${lang.code.toLowerCase()}`)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
              className="w-10 h-10 flex items-center justify-center"
              aria-label={t('header.profile.menu')}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
                {displayPicture ? (
                  <img
                    src={displayPicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>'
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" aria-label={t('header.profile.fallback')} />
                  </div>
                )}
              </div>
            </button>

            {/* Profile Dropdown */}
            {activeDropdown === 'profile' && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white border border-gray-200 overflow-hidden">
                {profileName && (
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {profileName}
                    </p>
                  </div>
                )}
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {t('profile.settings')}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                  >
                    {t('profile.signOut')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 