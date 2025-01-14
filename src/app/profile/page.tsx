'use client'

import { Camera, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Toast from '../components/Toast'
import WidgetPreview from '../components/widgets/WidgetPreview'
import ColorPicker from '../components/widgets/ColorPicker'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/hooks/useAuth'

interface Profile {
  name: string
  picture: string | null
  widgetBorderColor: string
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

export default function ProfilePage() {
  const { userId, loading: authLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    name: '',
    picture: null,
    widgetBorderColor: '#000000'
  })
  const [showToast, setShowToast] = useState(false)
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

    const loadProfile = async () => {
      try {
        // Charger le profil
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (profileData) {
          setProfile(prev => ({
            ...prev,
            name: profileData.full_name || '',
            picture: profileData.avatar_url
          }))
        }

        // Charger ou créer les préférences
        const { data: prefData, error: prefError } = await supabase
          .from('preferences')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (prefError) {
          // Si les préférences n'existent pas, les créer
          const { data: newPrefData, error: insertError } = await supabase
            .from('preferences')
            .insert([
              {
                user_id: userId,
                widget_border_color: '#000000'
              }
            ])
            .select()
            .single()

          if (!insertError && newPrefData) {
            setProfile(prev => ({
              ...prev,
              widgetBorderColor: newPrefData.widget_border_color
            }))
          }
        } else if (prefData) {
          setProfile(prev => ({
            ...prev,
            widgetBorderColor: prefData.widget_border_color
          }))
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }

    loadProfile()
  }, [mounted, userId, supabase])

  const handleSave = async () => {
    if (!userId) return

    try {
      // Mettre à jour le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.name,
          avatar_url: profile.picture
        })
        .eq('id', userId)

      if (profileError) throw profileError

      // Mettre à jour les préférences
      const { error: prefError } = await supabase
        .from('preferences')
        .upsert({
          user_id: userId,
          widget_border_color: profile.widgetBorderColor
        })

      if (prefError) throw prefError

      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
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
              {/* Widget Border Color */}
              <ColorPicker
                value={profile.widgetBorderColor}
                onChange={(color) => setProfile(prev => ({ ...prev, widgetBorderColor: color }))}
                label="Widget Border Color"
                description="Choose the border color for all your story widgets"
              />

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Widget Preview
                  <span className="block text-sm font-normal text-gray-500 mt-1">
                    See how your stories will appear in different widget styles
                  </span>
                </label>
                <div className="bg-gray-50 rounded-xl p-6">
                  <WidgetPreview borderColor={profile.widgetBorderColor} />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button - Full Width */}
          <div className="lg:col-span-2">
            <button
              onClick={handleSave}
              className="w-full h-14 flex items-center justify-center text-base font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <Toast 
        message="Profile saved successfully"
        show={showToast}
        onHide={() => setShowToast(false)}
      />
    </div>
  )
} 