'use client'

import { Camera, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Toast from '../components/Toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/hooks/useAuth'
import { HexColorPicker } from 'react-colorful'
import { useProfileStore } from '@/hooks/useProfile'
import { useTranslation } from '@/hooks/useTranslation'

interface Profile {
  name: string
  picture: string | null
  defaultBorderColor: string
  customName: string | null
  customPicture: string | null
  pendingFile?: File | null
}

function validateImage(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return false
  }

  // Vérifier la taille (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return false
  }

  return true
}

function ColorPickerPopover({ color, onChange }: { color: string, onChange: (color: string) => void }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    function updatePosition() {
      if (popoverRef.current) {
        const rect = popoverRef.current.getBoundingClientRect()
        setPosition({
          top: rect.bottom + window.scrollY + 10,
          left: rect.left + window.scrollX
        })
      }
    }

    if (isOpen) {
      updatePosition()
      window.addEventListener('scroll', updatePosition)
      window.addEventListener('resize', updatePosition)
    }

    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (!value.startsWith('#')) {
      value = '#' + value
    }
    // Autoriser seulement les caractères hexadécimaux et limiter à 7 caractères (#RRGGBB)
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      // Compléter avec des zéros si nécessaire
      if (value.length === 7) {
        onChange(value)
      } else {
        onChange(value.padEnd(7, '0'))
      }
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('profile.page.preferences.widgetColor.title')}
      </label>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-[42px] w-[42px] rounded-lg border border-gray-200 p-1 cursor-pointer hover:border-gray-300"
        >
          <div
            className="w-full h-full rounded-md border border-gray-200"
            style={{ backgroundColor: color }}
          />
        </button>
        <input
          type="text"
          value={color}
          onChange={handleHexInputChange}
          className="w-28 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-0 font-mono uppercase"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
      
      {isOpen && (
        <div 
          className="fixed z-[9999]" 
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
        >
          <div className="bg-white rounded-lg shadow-xl p-3">
            <HexColorPicker color={color} onChange={onChange} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const { userId, loading: authLoading, supabase } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false)
  const [isNameTouched, setIsNameTouched] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    name: '',
    picture: null,
    defaultBorderColor: '#000000',
    customName: null,
    customPicture: null,
    pendingFile: null
  })
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [toastMessage, setToastMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { setProfile: setGlobalProfile } = useProfileStore()

  useEffect(() => {
    if (!authLoading && !userId) {
      router.push('/auth/signin')
    }
  }, [authLoading, userId, router])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !userId) return

    const loadUserData = async () => {
      try {
        // Récupérer les données de l'utilisateur depuis l'authentification
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError) throw authError

        // Ajuster l'URL de l'image Google pour une meilleure résolution
        let avatarUrl = user?.user_metadata?.avatar_url
        if (avatarUrl && avatarUrl.includes('googleusercontent.com')) {
          avatarUrl = avatarUrl.replace('=s96-c', '=s400-c')
        }

        // Charger les préférences
        const { data: prefsData, error: prefsError } = await supabase
          .from('preferences')
          .select('widget_border_color, profile_name, profile_picture')
          .eq('user_id', userId)
          .maybeSingle()

        if (!prefsData) {
          // Si pas de préférences, créer avec les valeurs par défaut
          const { error: createError } = await supabase
            .from('preferences')
            .insert({
              user_id: userId,
              widget_border_color: '#000000',
              profile_name: user?.user_metadata?.full_name || '',
              profile_picture: avatarUrl
            })

          if (createError) throw createError

          setProfile(prev => ({
            ...prev,
            name: user?.user_metadata?.full_name || '',
            picture: avatarUrl || null,
            defaultBorderColor: '#000000',
            customName: user?.user_metadata?.full_name || '',
            customPicture: avatarUrl
          }))
        } else {
          // Si préférences existantes, utiliser les valeurs sauvegardées
          setProfile(prev => ({
            ...prev,
            name: prefsData.profile_name || user?.user_metadata?.full_name || '',
            picture: prefsData.profile_picture || avatarUrl || null,
            defaultBorderColor: prefsData.widget_border_color,
            customName: prefsData.profile_name,
            customPicture: prefsData.profile_picture
          }))
        }
      } catch (error) {
        console.error('Error loading data:', error)
        setToastType('error')
        setToastMessage(t('profile.page.loading.error'))
        setShowToast(true)
      }
    }

    loadUserData()
  }, [mounted, userId, supabase, t])

  const handleSave = async () => {
    if (!userId || isSaving) return
    
    setHasAttemptedSave(true)
    
    // Valider que le nom n'est pas vide
    if (!profile.name?.trim()) {
      setToastType('error')
      setToastMessage(t('profile.page.name.error'))
      setShowToast(true)
      return
    }

    setIsSaving(true)

    try {
      let finalPictureUrl = profile.customPicture

      // Si un fichier est en attente, l'uploader d'abord
      if (profile.pendingFile) {
        // Si une ancienne photo existe, la supprimer
        if (profile.customPicture && !profile.customPicture.includes('googleusercontent')) {
          try {
            const oldFileUrl = new URL(profile.customPicture)
            // Extraire le chemin du fichier après 'profile/'
            const pathParts = oldFileUrl.pathname.split('profile/')
            if (pathParts.length > 1) {
              const oldFilePath = pathParts[1]
              console.log('Deleting old file:', oldFilePath)
              const { error: deleteError } = await supabase.storage
                .from('profile')
                .remove([oldFilePath])
              
              if (deleteError) {
                console.error('Error deleting old file:', deleteError)
              }
            }
          } catch (error) {
            console.error('Error parsing old file URL:', error)
          }
        }

        // Upload la nouvelle photo
        const fileExt = profile.pendingFile.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile')
          .upload(fileName, profile.pendingFile, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) throw uploadError

        if (!uploadData?.path) {
          throw new Error('Upload failed: No path returned')
        }

        // Obtenir l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('profile')
          .getPublicUrl(uploadData.path)

        finalPictureUrl = publicUrl
      }

      // Mettre à jour les préférences avec l'URL finale de l'image
      const { error: prefsError } = await supabase
        .from('preferences')
        .update({
          widget_border_color: profile.defaultBorderColor,
          profile_name: profile.name.trim(),
          profile_picture: finalPictureUrl
        })
        .eq('user_id', userId)

      if (prefsError) throw prefsError

      // Mettre à jour le state avec l'URL finale
      setProfile(prev => ({
        ...prev,
        picture: finalPictureUrl,
        customPicture: finalPictureUrl,
        pendingFile: null
      }))

      // Mettre à jour le store global
      setGlobalProfile(finalPictureUrl, profile.name.trim())

      setToastType('success')
      setToastMessage(t('profile.page.saved'))
      setShowToast(true)
    } catch (error: any) {
      console.error('Error saving:', error)
      setToastType('error')
      setToastMessage(error.message || t('profile.page.error'))
      setShowToast(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    // Valider l'image
    if (!validateImage(file)) {
      setToastType('error')
      setToastMessage(t('profile.page.picture.validation.error'))
      setShowToast(true)
      return
    }

    try {
      // Créer une URL temporaire pour la prévisualisation
      const tempUrl = URL.createObjectURL(file)
      
      // Mettre à jour le state avec le fichier en attente et l'URL temporaire
      setProfile(prev => ({
        ...prev,
        picture: tempUrl,
        pendingFile: file
      }))

      // Mettre à jour le store global avec l'URL temporaire
      setGlobalProfile(tempUrl, profile.name)
    } catch (error) {
      console.error('Error reading file:', error)
      setToastType('error')
      setToastMessage(t('profile.page.picture.validation.readError'))
      setShowToast(true)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Toast 
        message={toastMessage}
        visible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('profile.page.title')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('profile.page.subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Profile Section */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {profile.picture ? (
                    <img
                      src={profile.picture}
                      alt={t('profile.page.picture.title')}
                      className="w-full h-full object-cover"
                      loading="eager"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>'
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  title={t('profile.page.picture.upload')}
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handlePictureChange}
                  className="hidden"
                  aria-label={t('profile.page.picture.upload')}
                />
              </div>
              <div className="flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.page.name.title')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => {
                      setIsNameTouched(true)
                      setProfile(prev => ({
                        ...prev,
                        name: e.target.value,
                        customName: e.target.value
                      }))
                    }}
                    onBlur={() => setIsNameTouched(true)}
                    className={`block w-full px-4 py-2 text-gray-900 bg-white border ${
                      (isNameTouched || hasAttemptedSave) && !profile.name?.trim() 
                        ? 'border-red-300' 
                        : 'border-gray-200'
                    } rounded-lg focus:border-gray-900 focus:ring-0`}
                    placeholder={t('profile.page.name.placeholder')}
                    required
                  />
                  {(isNameTouched || hasAttemptedSave) && !profile.name?.trim() && (
                    <p className="mt-1 text-sm text-red-500">
                      {t('profile.page.name.error')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Widget Preferences Section */}
          <div className="p-8 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 mb-6">{t('profile.page.preferences.title')}</h2>
            <div>
              <ColorPickerPopover
                color={profile.defaultBorderColor}
                onChange={(color) => setProfile(prev => ({ ...prev, defaultBorderColor: color }))}
              />
              <p className="mt-1 text-sm text-gray-500">
                {t('profile.page.preferences.widgetColor.description')}
              </p>
            </div>

            {/* Save button */}
            <div className="mt-8">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center h-11 px-6 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t('profile.page.save')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 