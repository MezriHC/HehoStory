'use client'

import { Camera, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Toast from '../components/Toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/hooks/useAuth'
import { HexColorPicker } from 'react-colorful'

interface Profile {
  name: string
  picture: string | null
  defaultBorderColor: string
}

async function compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const MAX_SIZE = 400 // Max width/height
      let width = img.width
      let height = img.height

      // Calculate new dimensions
      if (width > height && width > MAX_SIZE) {
        height = Math.round((height * MAX_SIZE) / width)
        width = MAX_SIZE
      } else if (height > MAX_SIZE) {
        width = Math.round((width * MAX_SIZE) / height)
        height = MAX_SIZE
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.7)) // Compress with 70% quality
    }
    img.src = dataUrl
  })
}

function ColorPickerPopover({ color, onChange }: { color: string, onChange: (color: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

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
    if (value.startsWith('#')) {
      value = value.slice(1)
    }
    if (/^[0-9A-Fa-f]{0,6}$/.test(value)) {
      onChange('#' + value.padEnd(6, '0'))
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Border color
      </label>
      <div className="flex gap-2">
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
          className="flex-1 px-4 py-2 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
          placeholder="#000000"
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 top-full mt-2 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { userId, loading: authLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    name: '',
    picture: null,
    defaultBorderColor: '#000000'
  })
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [toastMessage, setToastMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

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

    const loadPreferences = async () => {
      try {
        // Charger les préférences
        const { data: prefsData, error: prefsError } = await supabase
          .from('preferences')
          .select('widget_border_color')
          .eq('user_id', userId)
          .maybeSingle()

        if (!prefsData) {
          // Si pas de préférences, créer avec la couleur par défaut
          const { error: createError } = await supabase
            .from('preferences')
            .insert({
              user_id: userId,
              widget_border_color: '#000000'
            })

          if (createError) throw createError

          setProfile(prev => ({
            ...prev,
            defaultBorderColor: '#000000'
          }))
        } else {
          // Si préférences existantes, utiliser la couleur sauvegardée
          setProfile(prev => ({
            ...prev,
            defaultBorderColor: prefsData.widget_border_color
          }))
        }
      } catch (error) {
        console.error('Error loading preferences:', error)
        setToastType('error')
        setToastMessage('Error loading preferences')
        setShowToast(true)
      }
    }

    loadPreferences()
  }, [mounted, userId, supabase])

  const handleSave = async () => {
    if (!userId || isSaving) return
    setIsSaving(true)

    try {
      // Mettre à jour les préférences
      const { error: prefsError } = await supabase
        .from('preferences')
        .update({ widget_border_color: profile.defaultBorderColor })
        .eq('user_id', userId)

      if (prefsError) throw prefsError

      // Afficher le toast et attendre avant la redirection
      setToastType('success')
      setToastMessage('Changes saved successfully!')
      setShowToast(true)
      
      setTimeout(() => {
        router.push('/story')
      }, 1500)
    } catch (error) {
      console.error('Error saving:', error)
      setToastType('error')
      setToastMessage('Error saving changes. Please try again.')
      setShowToast(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string
        const compressedImage = await compressImage(dataUrl)
        setProfile(prev => ({
          ...prev,
          picture: compressedImage
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast 
        message={toastMessage}
        visible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-lg text-gray-600 mt-2">
            Configure your profile and default story settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
            <div className="space-y-8">
              {/* Profile picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Profile Picture (optional)
                  <span className="block text-sm font-normal text-gray-500 mt-1">
                    This will also be used as the default picture for your stories
                  </span>
                </label>
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {profile.picture ? (
                        <img
                          src={profile.picture}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePictureChange}
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm font-medium text-gray-900 hover:text-gray-700"
                  >
                    Change picture
                  </button>
                </div>
              </div>

              {/* Profile name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name (optional)
                  <span className="block text-sm font-normal text-gray-500 mt-1">
                    This will also be used as the default name for your stories
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name (optional)"
                  className="w-full h-12 px-4 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Widget Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Widget Appearance</h2>
            <div className="space-y-8">
              {/* Default Widget Border Color */}
              <ColorPickerPopover
                color={profile.defaultBorderColor}
                onChange={(color) => setProfile(prev => ({ ...prev, defaultBorderColor: color }))}
              />
              <p className="text-sm text-gray-500">
                Cette couleur sera utilisée par défaut pour tous les nouveaux widgets. Vous pourrez toujours personnaliser la couleur pour chaque widget individuellement.
              </p>
            </div>
          </div>

          {/* Save Button - Full Width */}
          <div className="lg:col-span-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`
                w-full h-14 
                flex items-center justify-center 
                text-base font-medium text-white 
                ${isSaving ? 'bg-gray-400' : 'bg-gray-900 hover:bg-gray-800'} 
                rounded-xl transition-colors shadow-sm
              `}
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 