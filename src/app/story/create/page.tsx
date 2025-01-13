'use client'

import { ArrowLeft, Save, Upload, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState, useEffect, Suspense } from 'react'
import MediaGrid, { MediaItem } from '../../components/MediaGrid'
import StoryPreview from '../../components/StoryPreview'
import { supabase } from '@/lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Story } from '@/types'

interface SaveStoryData {
  title: string
  content: string
  thumbnail: string
  profile_name: string | null
  profile_image: string | null
  published: boolean
  author_id: string
  tags: string[]
}

// Helper function to generate a stable ID
const generateId = (prefix: string) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 7)
  return `${prefix}-${timestamp}-${random}`
}

function getImageDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.readAsDataURL(file)
  })
}

function getVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    video.autoplay = true
    video.muted = true
    video.src = URL.createObjectURL(file)
    video.onloadeddata = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d')?.drawImage(video, 0, 0)
      resolve(canvas.toDataURL('image/jpeg'))
      video.remove()
      URL.revokeObjectURL(video.src)
    }
  })
}

async function compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Target width/height (adjust as needed)
      const maxWidth = 1080;
      const maxHeight = 1920;
      
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8)); // Adjust quality as needed
    };
    img.src = dataUrl;
  });
}

function StoryEditor() {
  const [title, setTitle] = useState('')
  const [profileName, setProfileName] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [localUrls, setLocalUrls] = useState<{ [key: string]: string }>({})
  const [isInitialized, setIsInitialized] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const queryClient = useQueryClient()

  // Query for story data when editing
  const { data: storyData } = useQuery({
    queryKey: ['story', editId],
    queryFn: async () => {
      if (!editId) return null
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', editId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!editId,
  })

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (story: SaveStoryData) => {
      if (editId) {
        const { data, error } = await supabase
          .from('stories')
          .update(story)
          .eq('id', editId)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('stories')
          .insert([story])
          .select()
          .single()

        if (error) throw error
        return data
      }
    },
    onSuccess: (data: Story) => {
      queryClient.setQueryData(['story', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['stories'] })
      Object.values(localUrls).forEach(url => URL.revokeObjectURL(url))
      router.push('/story')
    },
    onError: (error: Error) => {
      console.error('Error saving story:', error)
      alert(error.message || 'Failed to save story. Please try again.')
    }
  })

  // Initialize data
  useEffect(() => {
    if (storyData) {
      setTitle(storyData.title)
      setProfileName(storyData.profile_name || '')
      setProfileImage(storyData.profile_image || '')
      if (storyData.content) {
        const content = JSON.parse(storyData.content)
        const loadedMediaItems = content.mediaItems || []
        setMediaItems(loadedMediaItems.map((item: any) => ({
          ...item,
          file: null
        })))
      }
      setIsInitialized(true)
    } else if (!editId) {
      setIsInitialized(true)
    }
  }, [storyData])

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(localUrls).forEach(url => URL.revokeObjectURL(url))
    }
  }, [localUrls])

  // Event handlers
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading profile image:', error)
    }
  }

  const handleAddMedia = (files: File[]) => {
    const timestamp = Date.now()
    const newItems: MediaItem[] = files.map((file, index) => {
      const id = `${file.type.startsWith('video/') ? 'video' : 'image'}-${timestamp}-${index}`
      const url = URL.createObjectURL(file)
      setLocalUrls(prev => ({ ...prev, [id]: url }))
      return {
        id,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url,
        file
      }
    })
    setMediaItems(prev => [...prev, ...newItems])
  }

  const handleRemoveMedia = (id: string) => {
    if (localUrls[id]) {
      URL.revokeObjectURL(localUrls[id])
      setLocalUrls(prev => {
        const { [id]: removed, ...rest } = prev
        return rest
      })
    }
    setMediaItems(prev => prev.filter(item => item.id !== id))
  }

  const handleReorderMedia = (items: MediaItem[]) => {
    setMediaItems(items)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a story title')
      return
    }
    if (mediaItems.length === 0) {
      alert('Please add at least one media item')
      return
    }

    try {
      // Process media items in smaller chunks
      const processedMediaItems = []
      for (const item of mediaItems) {
        let url = item.url
        if (item.file) {
          const dataUrl = await getImageDataUrl(item.file)
          // Compress if it's an image
          if (item.type === 'image') {
            url = await compressImage(dataUrl)
          } else {
            url = dataUrl
          }
        }
        processedMediaItems.push({
          id: item.id,
          type: item.type,
          url,
          file: null
        })
      }

      // Get and compress thumbnail
      const firstItem = mediaItems[0]
      let thumbnail = firstItem.url
      if (firstItem.file) {
        const dataUrl = firstItem.type === 'video' 
          ? await getVideoThumbnail(firstItem.file)
          : await getImageDataUrl(firstItem.file)
        thumbnail = await compressImage(dataUrl)
      }

      const story = {
        title: title.trim(),
        content: JSON.stringify({ mediaItems: processedMediaItems }),
        thumbnail,
        profile_name: profileName.trim() || null,
        profile_image: profileImage || null,
        published: false,
        author_id: 'anonymous',
        tags: []
      }

      saveMutation.mutate(story)
    } catch (error) {
      console.error('Error saving story:', error instanceof Error ? error.message : error)
      alert(error instanceof Error ? error.message : 'Failed to save story. Please try again.')
    }
  }

  // Show loading state while fetching story data
  if (editId && !isInitialized) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/story"
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to stories
            </Link>
          </div>
          
          <button
            className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={!title.trim() || mediaItems.length === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            {editId ? 'Save changes' : 'Save story'}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="border-b border-gray-200 px-8 py-6">
            <input
              type="text"
              placeholder="Enter story title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-semibold text-gray-900 bg-transparent border-0 outline-none focus:ring-0 p-0 placeholder:text-gray-400"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload and organize your media to create an engaging story for your e-commerce site.
            </p>
          </div>

          {/* Profile Section */}
          <div className="border-b border-gray-200 px-8 py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Story Profile</h3>
            <div className="flex items-start space-x-6">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => profileImageInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                >
                  <Upload className="w-5 h-5 text-white" />
                </button>
                <input
                  ref={profileImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageUpload}
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter profile name or story purpose..."
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg px-3 h-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This will appear at the top of your story. Use it to brand your story or describe its purpose.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex gap-12">
              {/* Left side: Media grid */}
              <div className="flex-1">
                {mediaItems.length === 0 ? (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center transition-all hover:border-gray-300">
                    <div className="max-w-sm mx-auto">
                      <div className="p-6 rounded-full bg-white border border-gray-200 mb-6 shadow-sm mx-auto w-fit">
                        <Upload className="w-8 h-8 text-gray-900" />
                      </div>
                      <p className="text-base font-medium text-gray-900 mb-2">
                        No media added yet
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        Start by adding images or videos to create your story slides
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            handleAddMedia(Array.from(e.target.files))
                            e.target.value = ''
                          }
                        }}
                      />
                      <button
                        className="inline-flex items-center justify-center w-full h-11 px-6 text-sm font-medium text-white transition-colors bg-gray-900 rounded-lg hover:bg-gray-800"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Add media
                      </button>
                    </div>
                  </div>
                ) : (
                  <MediaGrid
                    items={mediaItems}
                    onAdd={handleAddMedia}
                    onRemove={handleRemoveMedia}
                    onReorder={handleReorderMedia}
                  />
                )}
              </div>

              {/* Right side: iPhone mockup with story preview */}
              <div className="w-[400px] flex-shrink-0">
                <div className="relative w-[400px] h-[711px] bg-gray-900 rounded-[2rem] shadow-xl p-3 border border-gray-800">
                  {/* Screen content */}
                  <div className="relative w-full h-full bg-gray-100 rounded-[1.75rem] overflow-hidden">
                    <StoryPreview 
                      items={mediaItems} 
                      profileImage={profileImage}
                      profileName={profileName}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateStoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    }>
      <StoryEditor />
    </Suspense>
  )
} 