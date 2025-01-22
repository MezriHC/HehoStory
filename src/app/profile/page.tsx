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
import StoryStyle from '@/components/StoryStyle'

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
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      // Ajouter un petit délai pour éviter que l'événement de clic qui ouvre
      // le picker ne le ferme immédiatement
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 0)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (!value.startsWith('#')) {
      value = '#' + value
    }
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      if (value.length === 7) {
        onChange(value)
      } else {
        onChange(value.padEnd(7, '0'))
      }
    }
  }

  return (
    <div className="relative" ref={containerRef}>
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
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-[9999]">
          <div className="bg-white rounded-lg shadow-xl p-3">
            <HexColorPicker color={color} onChange={onChange} />
          </div>
        </div>
      )}
    </div>
  )
}

const DEFAULT_STORY_IMAGES = [
  'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1604514628550-37477afdf4e3?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611042553365-9b101441c135?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1604514649606-2fdd0399de88?q=80&w=1000&auto=format&fit=crop'
]

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
  const { setGlobalProfile, setTempProfile, clearTempProfile } = useProfileStore()

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
              profile_name: '',
              profile_picture: null
            })

          if (createError) throw createError

          setProfile(prev => ({
            ...prev,
            name: '',
            picture: null,
            defaultBorderColor: '#000000',
            customName: '',
            customPicture: null
          }))
        } else {
          // Si préférences existantes, utiliser les valeurs sauvegardées
          setProfile(prev => ({
            ...prev,
            name: prefsData.profile_name || '',
            picture: prefsData.profile_picture,
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
      
      // Mettre à jour le state local
      setProfile(prev => ({
        ...prev,
        picture: tempUrl,
        pendingFile: file
      }))

      // Mettre à jour le store global avec l'URL temporaire
      setTempProfile(tempUrl)
    } catch (error) {
      console.error('Error reading file:', error)
      setToastType('error')
      setToastMessage(t('profile.page.picture.validation.readError'))
      setShowToast(true)
    }
  }

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
        // Supprimer l'ancienne photo si elle existe
        if (profile.customPicture) {
          try {
            // Lister tous les fichiers de l'utilisateur dans le bucket profile
            const { data: files, error: listError } = await supabase.storage
              .from('profile')
              .list(userId)

            if (listError) {
              console.error('Error listing files:', listError)
            } else if (files && files.length > 0) {
              // Supprimer tous les fichiers existants
              const filesToDelete = files.map(file => `${userId}/${file.name}`)
              const { error: deleteError } = await supabase.storage
                .from('profile')
                .remove(filesToDelete)

              if (deleteError) {
                console.error('Error deleting old files:', deleteError)
              }
            }
          } catch (error) {
            console.error('Error cleaning up old files:', error)
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

      // Mettre à jour les préférences
      const { error: prefsError } = await supabase
        .from('preferences')
        .update({
          widget_border_color: profile.defaultBorderColor,
          profile_name: profile.name.trim(),
          profile_picture: finalPictureUrl
        })
        .eq('user_id', userId)

      if (prefsError) throw prefsError

      // Mettre à jour le state local
      setProfile(prev => ({
        ...prev,
        picture: finalPictureUrl,
        customPicture: finalPictureUrl,
        pendingFile: null
      }))

      // Mettre à jour le store global avec l'URL finale et effacer l'URL temporaire
      setGlobalProfile(finalPictureUrl, profile.name.trim())
      clearTempProfile()

      setToastType('success')
      setToastMessage(t('profile.page.saved'))
      setShowToast(true)
    } catch (error: any) {
      console.error('Error saving:', error)
      setToastType('error')
      setToastMessage(error.message || t('profile.page.error'))
      setShowToast(true)
      
      // En cas d'erreur, revenir à l'état précédent
      if (profile.pendingFile) {
        setProfile(prev => ({
          ...prev,
          picture: prev.customPicture,
          pendingFile: null
        }))
        setGlobalProfile(profile.customPicture, profile.customName)
        clearTempProfile()
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Nettoyer l'URL temporaire si on quitte la page sans sauvegarder
  useEffect(() => {
    return () => {
      clearTempProfile()
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-32 w-32 bg-gray-200 rounded-xl"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-2/3"></div>
              </div>
              <div className="h-[600px] bg-gray-200 rounded-xl"></div>
            </div>
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

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 max-w-3xl">
          <h1 className="text-2xl font-semibold text-gray-900">Paramètres par défaut des stories</h1>
          <p className="mt-1.5 text-sm text-gray-600">
            Définissez l'apparence par défaut de vos stories. 
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Profile Settings */}
          <div className="space-y-5">
            {/* Profile Picture Upload */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-medium text-gray-500 mb-4">Photo de story par défaut</span>
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg transition-all duration-300 group-hover:shadow-xl">
                    {profile.picture ? (
                      <img
                        src={profile.picture}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="eager"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-50"><svg class="w-10 h-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>'
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <Camera className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-white rounded-lg p-2.5 shadow-lg border border-gray-200 hover:border-gray-300 transition-all hover:scale-105 hover:shadow-xl"
                    title={t('profile.page.picture.upload')}
                  >
                    <Camera className="w-4 h-4 text-gray-700" />
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

                {/* Name Input */}
                <div className="mt-5 w-full max-w-sm">
                  <span className="block text-xs font-medium text-gray-500 mb-2">Nom de story par défaut</span>
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
                    className={`block w-full px-3.5 py-2.5 text-base text-center text-gray-900 bg-white border ${
                      (isNameTouched || hasAttemptedSave) && !profile.name?.trim() 
                        ? 'border-red-300 ring-2 ring-red-100' 
                        : 'border-gray-200'
                    } rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all`}
                    placeholder={t('profile.page.name.placeholder')}
                    required
                  />
                  {(isNameTouched || hasAttemptedSave) && !profile.name?.trim() && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center justify-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {t('profile.page.name.error')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Widget Settings */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
              <div className="space-y-5">
                {/* Color Picker */}
                <div className="mb-5">
                  <span className="block text-xs font-medium text-gray-500 mb-2">Couleur de bordure par défaut</span>
                  <ColorPickerPopover
                    color={profile.defaultBorderColor}
                    onChange={(color) => setProfile(prev => ({ ...prev, defaultBorderColor: color }))}
                  />
                </div>

                {/* Widget Preview */}
                <div className="flex flex-wrap justify-center gap-3">
                  {[...Array(4)].map((_, i) => (
                    <StoryStyle
                      key={`bubble-${i}`}
                      variant="bubble"
                      story={{
                        id: `preview-${i}`,
                        title: '',
                        author_id: '',
                        published: true,
                        created_at: new Date().toISOString(),
                        folder_id: null,
                        profile_name: profile.name || '',
                        profile_image: profile.picture || null,
                        thumbnail: DEFAULT_STORY_IMAGES[i],
                        content: JSON.stringify({
                          mediaItems: [{
                            id: 'preview',
                            type: 'image',
                            url: DEFAULT_STORY_IMAGES[i],
                            file: null
                          }]
                        })
                      }}
                      size="md"
                      style={{ borderColor: profile.defaultBorderColor }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center h-10 px-5 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 shadow-sm hover:shadow-md"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('profile.page.save')}
                </>
              )}
            </button>
          </div>

          {/* Right Column - Story Preview */}
          <div className="relative">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <div className="relative aspect-[9/16] w-full max-w-[360px] mx-auto">
                  <StoryStyle
                    variant="preview"
                    items={[{
                      id: 'preview',
                      type: 'image',
                      url: 'https://images.unsplash.com/photo-1604514628550-37477afdf4e3?q=80&w=1000&auto=format&fit=crop',
                      file: null
                    }]}
                    profileImage={profile.picture || undefined}
                    profileName={profile.name || ''}
                    isPhonePreview={true}
                    hideNavigation={true}
                    className="rounded-lg overflow-hidden shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 