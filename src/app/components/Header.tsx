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
  const [language, setLanguage] = useState<'FR' | 'EN'>('FR')
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    name: '',
    picture: null
  })
  const pathname = usePathname()
  const router = useRouter()
  const { profilePicture, profileName, setProfile: setGlobalProfile } = useProfileStore()

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

        const prefs = prefsData as Preferences

        if (prefs?.profile_picture) {
          setGlobalProfile(prefs.profile_picture, prefs.profile_name)
          setProfile(prev => ({
            ...prev,
            name: prefs.profile_name || '',
            picture: prefs.profile_picture
          }))
        } else {
          // Fallback sur l'image Google
          const { data: { user } } = await supabase.auth.getUser()
          if (user?.user_metadata?.avatar_url) {
            const avatarUrl = user.user_metadata.avatar_url.replace('=s96-c', '=s400-c')
            setGlobalProfile(avatarUrl, user.user_metadata.full_name)
            setProfile(prev => ({
              ...prev,
              name: user.user_metadata.full_name || '',
              picture: avatarUrl
            }))
          }
        }
      } catch (error) {
        console.error('Error loading profile picture:', error)
      }
    }

    // Charger initialement
    loadProfilePicture()

    // Écouter les changements de profil
    const channel = supabase
      .channel('preferences_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'preferences',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Profile updated:', payload)
          const newPrefs = payload.new as Preferences
          if (newPrefs) {
            setGlobalProfile(newPrefs.profile_picture, newPrefs.profile_name)
            setProfile(prev => ({
              ...prev,
              name: newPrefs.profile_name || prev.name,
              picture: newPrefs.profile_picture
            }))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase, setGlobalProfile])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-dropdown]')) {
        setIsLanguageOpen(false)
        setIsProfileOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageOpen(false)
        setIsProfileOpen(false)
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
    setIsLanguageOpen(false)
    setIsProfileOpen(false)
  }, [pathname])

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="font-semibold text-xl text-gray-900 hover:text-gray-600 transition-colors"
        >
          HehoStory
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
              {item.label}
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
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              aria-label="Change language"
            >
              <Languages className="w-5 h-5" />
            </button>

            {/* Language Dropdown */}
            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white border border-gray-200 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code)
                      setIsLanguageOpen(false)
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
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 flex items-center justify-center"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
                {profilePicture ? (
                  <img
                    src={profilePicture}
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
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
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
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Configuration du profil
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                  >
                    Se déconnecter
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