'use client'

import { ArrowLeft, Save, Upload, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState, useEffect, Suspense } from 'react'
import { createPortal } from 'react-dom'
import MediaGrid, { MediaItem } from '../../components/MediaGrid'
import StoryStyle from '@/components/StoryStyle'
import { supabase } from '@/lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Story } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

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

// Fonction de compression vidéo
const compressVideo = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      // Créer un élément video temporaire
      const video = document.createElement('video')
      video.src = URL.createObjectURL(file)
      
      video.onloadedmetadata = () => {
        // Créer un canvas pour la compression
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Définir une taille maximale tout en gardant le ratio
        const maxWidth = 1280
        const maxHeight = 720
        let width = video.videoWidth
        let height = video.videoHeight
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Capturer la première frame pour la miniature
        ctx?.drawImage(video, 0, 0, width, height)
        
        // Convertir en Blob avec une qualité réduite
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'video/mp4',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Échec de la compression vidéo'))
          }
        }, 'video/mp4', 0.8)
      }
      
      video.onerror = () => {
        reject(new Error('Erreur lors du chargement de la vidéo'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

// Fonction pour générer une miniature à partir d'une vidéo
const generateVideoThumbnail = async (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = videoUrl
    video.crossOrigin = 'anonymous'
    video.currentTime = 0.1 // Prendre la frame à 100ms

    video.onloadeddata = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Convertir en base64 avec une qualité de 0.8
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8)
      resolve(thumbnailUrl)
    }

    video.onerror = () => {
      reject(new Error('Erreur lors de la génération de la miniature'))
    }
  })
}

function StoryEditor() {
  const { userId, loading: authLoading, supabase } = useAuth()
  const [title, setTitle] = useState('')
  const [profileName, setProfileName] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [localUrls, setLocalUrls] = useState<{ [key: string]: string }>({})
  const [isInitialized, setIsInitialized] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [thumbnail, setThumbnail] = useState<{ file: File | null; url: string | null }>({ file: null, url: null })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams?.get('edit') ?? null
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!authLoading && !userId) {
      router.push('/auth/signin')
    }
  }, [authLoading, userId, router])

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    try {
      setIsUploading(true)
      const filePath = `${userId}/profile/${Date.now()}-${file.name}`
      
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Erreur d'upload: ${uploadError.message}`)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      setProfileImage(publicUrl)
    } catch (error) {
      console.error('Error uploading profile image:', error)
      alert('Erreur lors de l\'upload de l\'image de profil')
    } finally {
      setIsUploading(false)
    }
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier si c'est une image
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image comme miniature')
      return
    }

    // Créer une URL locale pour la prévisualisation
    const localUrl = URL.createObjectURL(file)
    setThumbnail({ file, url: localUrl })
  }

  const handleSave = async () => {
    if (!userId) {
      console.error('No user ID available')
      return
    }

    // Vérifier si on a soit une nouvelle thumbnail, soit une thumbnail existante
    if (!thumbnail.file && !thumbnail.url) {
      alert('Veuillez ajouter une miniature pour votre story')
      return
    }

    setIsUploading(true)
    try {
      setUploadProgress(0)

      // Upload de la miniature seulement si c'est un nouveau fichier
      let thumbnailUrl = thumbnail.url || ''
      if (thumbnail.file) {
        const thumbnailPath = `${userId}/thumbnails/${Date.now()}-${thumbnail.file.name}`
        const { error: thumbnailError } = await supabase.storage
          .from('media')
          .upload(thumbnailPath, thumbnail.file, {
            cacheControl: '3600',
            upsert: false
          })

        if (thumbnailError) {
          throw new Error(`Erreur d'upload de la miniature: ${thumbnailError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(thumbnailPath)
        
        thumbnailUrl = publicUrl
      }

      if (!thumbnailUrl) {
        throw new Error('Une miniature est requise pour sauvegarder la story')
      }

      // Traiter les médias même s'il n'y en a pas de nouveaux
      let processed = 0
      const processedMediaItems = await Promise.all(
        mediaItems.map(async (item) => {
          try {
            // Si c'est un nouveau fichier à uploader
            if (item.file) {
              const filePath = `${userId}/stories/${Date.now()}-${item.file.name}`
              const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, item.file, {
                  cacheControl: '3600',
                  upsert: false
                })

              if (uploadError) {
                throw new Error(`Erreur d'upload: ${uploadError.message}`)
              }

              const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(filePath)

              // Si c'est une vidéo, générer et sauvegarder une miniature
              let thumbnailUrl = publicUrl
              if (item.type === 'video') {
                try {
                  // Générer la miniature
                  const base64Thumbnail = await generateVideoThumbnail(publicUrl)
                  
                  // Convertir le base64 en blob
                  const response = await fetch(base64Thumbnail)
                  const blob = await response.blob()
                  
                  // Upload la miniature
                  const thumbnailPath = `${userId}/thumbnails/${Date.now()}-${item.file.name.replace(/\.[^/.]+$/, '')}.jpg`
                  const { error: thumbnailError } = await supabase.storage
                    .from('media')
                    .upload(thumbnailPath, blob, {
                      contentType: 'image/jpeg',
                      cacheControl: '3600',
                      upsert: false
                    })

                  if (thumbnailError) throw thumbnailError

                  const { data: { publicUrl: thumbnailPublicUrl } } = supabase.storage
                    .from('media')
                    .getPublicUrl(thumbnailPath)

                  thumbnailUrl = thumbnailPublicUrl
                } catch (error) {
                  console.error('Erreur lors de la génération de la miniature:', error)
                  // En cas d'erreur, on garde l'URL de la vidéo comme miniature
                }
              }

              processed++
              setUploadProgress((processed / mediaItems.length) * 100)

              return {
                ...item,
                url: publicUrl,
                thumbnailUrl: thumbnailUrl,
                file: null
              }
            }
            // Si c'est un fichier existant, on garde tel quel
            return item
          } catch (error) {
            console.error('Erreur lors du traitement du média:', error)
            throw error
          }
        })
      )

      const storyData: SaveStoryData = {
        title: title.trim(),
        content: JSON.stringify({ mediaItems: processedMediaItems }),
        thumbnail: thumbnailUrl,
        profile_name: profileName.trim() || null,
        profile_image: profileImage || null,
        published: false,
        author_id: userId,
        tags: []
      }

      console.log('Debug - Story data:', storyData)

      // Si on est en mode édition
      if (editId) {
        const { error } = await supabase
          .from('stories')
          .update(storyData)
          .eq('id', editId)

        if (error) throw error
      } else {
        // Créer une nouvelle story
        const { error } = await supabase
          .from('stories')
          .insert([storyData])

        if (error) throw error
      }

      router.push('/story')
    } catch (error) {
      console.error('Error saving story:', error)
      if (error instanceof Error) {
        alert(`Erreur: ${error.message}`)
      } else {
        alert('Échec de la sauvegarde. Veuillez réessayer.')
      }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

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

  // Initialize data
  useEffect(() => {
    if (storyData) {
      setTitle(storyData.title)
      setProfileName(storyData.profile_name || '')
      setProfileImage(storyData.profile_image || '')
      if (storyData.thumbnail) {
        setThumbnail({ file: null, url: storyData.thumbnail })
      }
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
  const handleAddMedia = async (files: File[]) => {
    // Limite de taille ajustée à 45MB pour tous les fichiers (marge de sécurité)
    const MAX_FILE_SIZE = 45 * 1024 * 1024 // 45MB
    const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
    const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    try {
      for (const file of files) {
        // Vérification du type de fichier
        const isVideo = file.type.startsWith('video/');
        if (isVideo && !SUPPORTED_VIDEO_TYPES.includes(file.type)) {
          throw new Error(`Format vidéo non supporté: ${file.type}. Formats acceptés: MP4, MOV, WEBM`);
        }
        if (!isVideo && !SUPPORTED_IMAGE_TYPES.includes(file.type)) {
          throw new Error(`Format image non supporté: ${file.type}. Formats acceptés: JPEG, PNG, GIF, WEBP`);
        }

        // Vérification de la taille
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`Le fichier ${file.name} est trop volumineux. La taille maximum est de 45MB pour respecter les limites de Supabase.`);
        }

        // Vérification supplémentaire pour les vidéos
        if (isVideo) {
          const video = document.createElement('video');
          video.preload = 'metadata';
          
          await new Promise((resolve, reject) => {
            video.onloadedmetadata = resolve;
            video.onerror = () => reject(new Error(`La vidéo ${file.name} semble être corrompue ou dans un format non supporté.`));
            video.src = URL.createObjectURL(file);
          });
          
          URL.revokeObjectURL(video.src);
        }
      }

      const timestamp = Date.now();
      const processedFiles = await Promise.all(
        files.map(async (file, index) => {
          const isVideo = file.type.startsWith('video/');
          const id = `${isVideo ? 'video' : 'image'}-${timestamp}-${index}`;
          const url = URL.createObjectURL(file);
          
          console.log(`Ajout du média: ${file.name}, type: ${file.type}, taille: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
          
          setLocalUrls(prev => ({ ...prev, [id]: url }));
          return {
            id,
            type: isVideo ? 'video' : 'image' as const,
            url,
            file
          } satisfies MediaItem;
        })
      );

      setMediaItems(prev => [...prev, ...processedFiles]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout des médias:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'ajout des médias');
    }
  };

  const handleRemoveMedia = async (id: string) => {
    try {
      const mediaItem = mediaItems.find(item => item.id === id);
      
      // Si l'URL est une URL Supabase, supprimer le fichier du bucket
      if (mediaItem?.url && mediaItem.url.includes('supabase')) {
        const filePath = mediaItem.url.split('/').slice(-2).join('/'); // Récupère "userId/nomfichier"
        const { error: deleteError } = await supabase.storage
          .from('media')
          .remove([filePath]);

        if (deleteError) {
          console.error('Erreur lors de la suppression du fichier:', deleteError);
        }
      }

      // Nettoyer l'URL locale si elle existe
      if (localUrls[id]) {
        URL.revokeObjectURL(localUrls[id]);
        setLocalUrls(prev => {
          const { [id]: removed, ...rest } = prev;
          return rest;
        });
      }

      setMediaItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du média:', error);
      alert('Erreur lors de la suppression du média');
    }
  }

  const handleReorderMedia = (items: MediaItem[]) => {
    setMediaItems(items)
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/story"
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to stories
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium text-white transition-all bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              onClick={handleSave}
              disabled={!title.trim() || mediaItems.length === 0 || (!thumbnail.file && !thumbnail.url)}
            >
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Save changes' : 'Save story'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr,350px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="border-b border-gray-200 px-8 py-6">
                <input
                  type="text"
                  placeholder="Enter story title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-semibold text-gray-900 bg-transparent border-0 outline-none focus:ring-0 p-0 placeholder:text-gray-400"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload and organize your media to create an engaging story for your e-commerce site.
                </p>
              </div>

              {/* Thumbnail Section */}
              <div className="border-b border-gray-200 px-8 py-6 bg-gray-50">
                <h3 className="text-base font-medium text-gray-900 mb-4">Story Thumbnail *</h3>
                <div className="flex items-start space-x-6">
                  <div className="relative group">
                    {thumbnail.url ? (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md group">
                        <img
                          src={thumbnail.url}
                          alt="Thumbnail"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <button
                          onClick={() => {
                            if (thumbnail.url) URL.revokeObjectURL(thumbnail.url)
                            setThumbnail({ file: null, url: null })
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
                        <span className="text-sm text-gray-500 mt-2 group-hover:text-blue-600">Add thumbnail</span>
                      </div>
                    )}
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      This image will be used as the thumbnail for your story in lists and previews.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended format: JPG, PNG. Maximum size: 5 MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Section */}
              <div className="border-b border-gray-200 px-8 py-6">
                <h3 className="text-base font-medium text-gray-900 mb-4">Story Profile</h3>
                <div className="flex items-start space-x-6">
                  <div className="relative group">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-7 h-7 text-gray-400" />
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
                      className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-lg px-4 h-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      This will appear at the top of your story.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {mediaItems.length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center transition-all hover:border-blue-300">
                    <div className="max-w-sm mx-auto">
                      <div className="p-4 rounded-full bg-white border border-gray-200 mb-4 shadow-sm mx-auto w-fit">
                        <Upload className="w-6 h-6 text-gray-900" />
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        No media added yet
                      </p>
                      <p className="text-sm text-gray-600 mb-6">
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
                        className="inline-flex items-center justify-center w-full h-10 px-6 text-sm font-medium text-white transition-colors bg-gray-900 rounded-lg hover:bg-gray-800"
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
            </div>
          </div>

          <div className="space-y-8">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm">
                <div className="aspect-[9/16] w-full">
                  {mediaItems.length > 0 ? (
                    <StoryStyle
                      variant="preview"
                      items={mediaItems}
                      profileImage={profileImage}
                      profileName={profileName}
                      className="rounded-xl overflow-hidden"
                      isPhonePreview={true}
                      hideNavigation={true}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-xl">
                      <p className="text-sm">Add media to preview your story</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default function CreateStoryPage() {
  const { userId, loading: authLoading } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [profileName, setProfileName] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !userId) {
      router.push('/auth/signin')
    }
  }, [authLoading, userId, router])

  const handleSave = async () => {
    if (!userId) {
      console.error('No user ID available')
      return
    }

    setIsUploading(true)
    try {
      const storyData: SaveStoryData = {
        title: title.trim(),
        content: JSON.stringify({ mediaItems }),
        thumbnail: mediaItems[0]?.url || '',
        profile_name: profileName,
        profile_image: profileImage,
        published: false,
        author_id: userId,
        tags: []
      }

      const { error } = await supabase
        .from('stories')
        .insert([storyData])

      if (error) throw error

      router.push('/story')
    } catch (error) {
      console.error('Error saving story:', error)
    } finally {
      setIsUploading(false)
    }
  }

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