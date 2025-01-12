import { User, Pause, Play, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  file: File | null
}

interface StoryPreviewProps {
  items: MediaItem[]
  profileImage?: string
  profileName?: string
}

const STORY_DURATION = 5000 // 5 seconds for images
const PROGRESS_BAR_WIDTH = 100 // percentage

export default function StoryPreview({ items, profileImage, profileName }: StoryPreviewProps) {
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isClosing, setIsClosing] = useState(false)
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const startTimeRef = useRef<number>(Date.now())
  const elapsedBeforePauseRef = useRef<number>(0)

  // Only start after component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const currentItem = items[currentIndex]
  const isLastItem = currentIndex === items.length - 1

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
      // Loop back to first story
      setCurrentIndex(0)
      resetProgress()
    }
  }, [isLastItem, resetProgress])

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
      // For videos, use the video duration and timeupdate event
      videoRef.current.play().catch(console.error)
    } else {
      // For images, use a timer
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
      }

      // Si on reprend après une pause, on ajuste le temps de départ
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
      }, 16) // ~60fps

      progressTimerRef.current = timer
      return () => clearInterval(timer)
    }
  }, [currentIndex, currentItem, isPaused, goToNextStory, resetProgress])

  // Handle video progress and end
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * PROGRESS_BAR_WIDTH
      setProgress(progress)
    }
  }

  const handleVideoEnded = () => {
    goToNextStory()
  }

  // Handle touch/click navigation
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const touchX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const screenWidth = window.innerWidth
    const threshold = screenWidth / 2

    if (touchX < threshold) {
      goToPrevStory()
    } else {
      goToNextStory()
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      // Add your close callback here if needed
    }, 500) // Match the animation duration
  }, [])

  if (!mounted || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="p-6 rounded-full bg-white border border-gray-200 mb-4 shadow-sm">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">
          Upload media to preview your story
        </p>
      </div>
    )
  }

  if (!currentItem) return null

  return (
    <div className={`relative w-full h-full bg-black aspect-[9/16] ${
      isClosing ? 'animate-close-to-center-right' : ''
    }`}>
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 p-2 flex gap-1 z-20 bg-gradient-to-b from-black/50 via-black/25 to-transparent">
        {items.map((item, index) => (
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

      {/* Story header */}
      <div className="absolute top-6 left-0 right-0 px-4 flex items-center justify-between z-20">
        {/* Profile info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-300/50 backdrop-blur-sm overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            {profileName ? (
              <div className="text-sm font-medium text-white">
                {profileName}
              </div>
            ) : (
              <div className="w-24 h-2.5 bg-gray-300/50 backdrop-blur-sm rounded-full" />
            )}
          </div>
        </div>
      </div>

      {/* Controls - Top right */}
      <div className="absolute top-14 right-4 flex flex-col gap-2 z-20">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setIsPaused(!isPaused)
          }}
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
        >
          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setIsMuted(!isMuted)
          }}
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>

      {/* Click Navigation Areas */}
      <div className="absolute inset-0 z-10 flex select-none">
        <div 
          className="w-1/2 h-full cursor-default" 
          onClick={() => goToPrevStory()}
        />
        <div 
          className="w-1/2 h-full cursor-default" 
          onClick={() => goToNextStory()}
        />
      </div>

      {/* Navigation Arrows - Outside */}
      <div className="absolute inset-y-0 -left-20 -right-20 pointer-events-none flex items-center justify-between">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            goToPrevStory()
          }}
          className="pointer-events-auto p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            goToNextStory()
          }}
          className="pointer-events-auto p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Media content */}
      <div className="absolute inset-0 select-none">
        {currentItem.type === 'video' ? (
          <video
            ref={videoRef}
            src={currentItem.url}
            className="h-full w-full object-cover"
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onLoadStart={() => setProgress(0)}
          />
        ) : (
          <img
            src={currentItem.url}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        )}
      </div>
    </div>
  )
} 