'use client'

import { Camera, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Toast from '../components/Toast'

interface Profile {
  name: string
  picture: string | null
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
  const [profile, setProfile] = useState<Profile>({
    name: '',
    picture: null
  })
  const [showToast, setShowToast] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = JSON.parse(localStorage.getItem('profile') || '{}')
    if (savedProfile.name) {
      setProfile(savedProfile)
    }
  }, [])

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

  const handleSave = () => {
    if (!profile.name.trim()) {
      alert('Please enter your name')
      return
    }
    try {
      localStorage.setItem('profile', JSON.stringify(profile))
      setShowToast(true)
      setTimeout(() => {
        router.push('/story')
      }, 1500)
    } catch (error) {
      alert('Failed to save profile. The image might be too large.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure how you appear to others in your stories
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="p-8">
            {/* Profile picture */}
            <div className="mb-8 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {profile.picture ? (
                    <img
                      src={profile.picture}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <Camera className="w-4 h-4" />
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

            {/* Profile name */}
            <div className="mb-8">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                className="w-full h-11 px-4 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
              />
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={!profile.name.trim()}
              className="w-full h-11 flex items-center justify-center text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save changes
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