import { User, Pause, Play, Volume2, VolumeX, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Story } from '@/app/components/StoriesList'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  file: File | null
}

type StoryVariant = 'preview' | 'bubble' | 'card' | 'square' | 'single-bubble' | 'story'

interface StoryStyleProps {
  variant: StoryVariant
  story?: Story
  items?: MediaItem[]
  profileImage?: string
  profileName?: string
  onComplete?: () => void
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  isPhonePreview?: boolean
}

const STORY_DURATION = 5000 // 5 seconds for images
const PROGRESS_BAR_WIDTH = 100 // percentage

export default function StoryStyle({ 
  variant,
  story,
  items,
  profileImage,
  profileName,
  onComplete,
  onClick,
  size = 'md',
  className = '',
  isPhonePreview = false
}: StoryStyleProps) {
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const startTimeRef = useRef<number>(Date.now())
  const elapsedBeforePauseRef = useRef<number>(0)

  // Only start after component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Styles communs pour les vignettes
  const thumbnailStyles = {
    bubble: 'w-16 h-16 rounded-full overflow-hidden ring-2 ring-black ring-offset-2 shadow-lg hover:scale-105 transition-transform duration-200',
    card: 'w-32 h-48 rounded-xl overflow-hidden ring-2 ring-black ring-offset-2 shadow-lg hover:scale-105 transition-transform duration-200',
    square: 'w-32 h-32 rounded-lg overflow-hidden ring-2 ring-black ring-offset-2 shadow-lg hover:scale-105 transition-transform duration-200',
    'single-bubble': 'w-20 h-20 rounded-full overflow-hidden ring-2 ring-black ring-offset-2 shadow-lg hover:scale-105 transition-transform duration-200',
    story: 'w-48 h-64 rounded-xl overflow-hidden ring-2 ring-black ring-offset-2 shadow-lg hover:scale-105 transition-transform duration-200',
    preview: 'w-full h-full'
  }

  const sizeStyles = {
    sm: 'scale-75',
    md: '',
    lg: 'scale-125'
  }

  // Rendu des vignettes
  if (variant !== 'preview') {
    const mediaUrl = story?.content ? JSON.parse(story.content).mediaItems[0]?.url : null
    const containerStyle = `${thumbnailStyles[variant]} ${sizeStyles[size]} ${className} relative cursor-pointer group`

    return (
      <div 
        className={containerStyle}
        onClick={onClick}
      >
        <div className="w-full h-full rounded-[inherit] overflow-hidden">
          {mediaUrl ? (
            <>
              <img 
                src={mediaUrl} 
                alt="" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Play className="w-5 h-5 text-white" />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    )
  }

  // Logique pour le mode preview
  const currentItem = items?.[currentIndex]
  const isLastItem = currentIndex === (items?.length || 0) - 1

  const resetProgress = useCallback(() => {
    setProgress(0)
    elapsedBeforePauseRef.current = 0
    startTimeRef.current = Date.now()
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
  }, [])

  const goToNextStory = useCallback(() => {
    if (!isLastItem) {
      setCurrentIndex(prev => prev + 1)
      resetProgress()
    } else {
      onComplete?.()
    }
  }, [isLastItem, resetProgress, onComplete])

  const goToPrevStory = useCallback(() => {
    if (currentIndex > 0) {
      setProgress(0)
      setCurrentIndex(prev => prev - 1)
      startTimeRef.current = Date.now()
      elapsedBeforePauseRef.current = 0
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
        progressTimerRef.current = null
      }
    }
  }, [currentIndex])

  useEffect(() => {
    if (!currentItem) return

    if (isPaused) {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
        progressTimerRef.current = null
      }
      if (currentItem.type === 'image') {
        elapsedBeforePauseRef.current = Date.now() - startTimeRef.current
      }
      return
    }

    if (currentItem.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(console.error)
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
      }

      if (elapsedBeforePauseRef.current > 0) {
        startTimeRef.current = Date.now() - elapsedBeforePauseRef.current
      } else {
        startTimeRef.current = Date.now()
      }
      
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        const newProgress = (elapsed / STORY_DURATION) * PROGRESS_BAR_WIDTH

        if (newProgress >= PROGRESS_BAR_WIDTH) {
          elapsedBeforePauseRef.current = 0
          resetProgress()
          goToNextStory()
        } else {
          setProgress(newProgress)
        }
      }, 16)

      progressTimerRef.current = timer
      return () => clearInterval(timer)
    }
  }, [currentIndex, currentItem, isPaused, goToNextStory, resetProgress])

  if (!mounted || !currentItem) return null

  // Preview render
  if (isPhonePreview) {
    return (
      <div className={`w-full h-full ${className}`}>
        <div className="relative aspect-[9/16] bg-black w-full h-full">
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 p-2 flex gap-1 z-20 bg-gradient-to-b from-black/50 via-black/25 to-transparent">
            {items?.map((item, index) => (
              <div
                key={item.id}
                className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm"
              >
                <div
                  className={`h-full bg-white rounded-full ${
                    index === currentIndex && !isPaused && progress > 0 ? 'transition-[width] duration-200 ease-linear' : ''
                  }`}
                  style={{
                    width: `${index === currentIndex ? progress : index < currentIndex ? 100 : 0}%`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Story content */}
          <div className="absolute inset-0 bg-black">
            {currentItem?.type === 'video' ? (
              <video
                ref={videoRef}
                src={currentItem.url}
                className="w-full h-full object-contain"
                playsInline
                muted={isMuted}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    const progress = (videoRef.current.currentTime / videoRef.current.duration) * PROGRESS_BAR_WIDTH
                    setProgress(progress)
                  }
                }}
                onEnded={goToNextStory}
              />
            ) : (
              <img
                src={currentItem?.url}
                alt=""
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Controls */}
          <div className="absolute inset-0 flex">
            <div
              className="flex-1"
              onClick={goToPrevStory}
            />
            <div
              className="flex-1"
              onClick={goToNextStory}
            />
          </div>

          {/* Story header */}
          <div className="absolute top-4 left-4 flex items-center space-x-3 z-20">
            <div className="w-8 h-8 rounded-full bg-gray-300/50 backdrop-blur-sm overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
            {profileName && (
              <div className="text-sm font-medium text-white">
                {profileName}
              </div>
            )}
          </div>

          {/* Controls - Top right */}
          <div className="absolute top-4 right-4 flex flex-col gap-4 z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onComplete?.()
              }}
              className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation()
                setIsPaused(!isPaused)
              }}
              className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setIsMuted(!isMuted)
              }}
              className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Regular preview
  return (
    <div 
      className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center ${className}`}
      onClick={onComplete}
    >
      <div 
        className="relative w-full h-full max-w-[450px] flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative aspect-[9/16] bg-black w-full rounded-2xl overflow-hidden">
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 p-2 flex gap-1 z-20 bg-gradient-to-b from-black/50 via-black/25 to-transparent">
            {items?.map((item, index) => (
              <div
                key={item.id}
                className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm"
              >
                <div
                  className={`h-full bg-white rounded-full ${
                    index === currentIndex && !isPaused && progress > 0 ? 'transition-[width] duration-200 ease-linear' : ''
                  }`}
                  style={{
                    width: `${index === currentIndex ? progress : index < currentIndex ? 100 : 0}%`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Story content */}
          <div className="absolute inset-0 bg-black">
            {currentItem?.type === 'video' ? (
              <video
                ref={videoRef}
                src={currentItem.url}
                className="w-full h-full object-contain"
                playsInline
                muted={isMuted}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    const progress = (videoRef.current.currentTime / videoRef.current.duration) * PROGRESS_BAR_WIDTH
                    setProgress(progress)
                  }
                }}
                onEnded={goToNextStory}
              />
            ) : (
              <img
                src={currentItem?.url}
                alt=""
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Controls */}
          <div className="absolute inset-0 flex">
            <div
              className="flex-1"
              onClick={goToPrevStory}
            />
            <div
              className="flex-1"
              onClick={goToNextStory}
            />
          </div>

          {/* Story header */}
          <div className="absolute top-4 left-4 flex items-center space-x-3 z-20">
            <div className="w-8 h-8 rounded-full bg-gray-300/50 backdrop-blur-sm overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
            {profileName && (
              <div className="text-sm font-medium text-white">
                {profileName}
              </div>
            )}
          </div>

          {/* Controls - Top right */}
          <div className="absolute top-4 right-4 flex flex-col gap-4 z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onComplete?.()
              }}
              className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation()
                setIsPaused(!isPaused)
              }}
              className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setIsMuted(!isMuted)
              }}
              className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 