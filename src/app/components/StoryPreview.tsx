import { Heart, MoreHorizontal, Send } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  file: File
}

interface StoryPreviewProps {
  items: MediaItem[]
}

const STORY_DURATION = 5000 // 5 seconds for images
const PROGRESS_BAR_WIDTH = 100 // percentage

export default function StoryPreview({ items }: StoryPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const currentItem = items[currentIndex]

  const resetProgress = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
    }
    setProgress(0)
  }, [])

  const goToNext = useCallback(() => {
    setDirection('forward')
    resetProgress()
    setCurrentIndex(prev => (prev + 1) % items.length)
  }, [items.length, resetProgress])

  const goToPrevious = useCallback(() => {
    setDirection('backward')
    resetProgress()
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length)
  }, [items.length, resetProgress])

  const startImageProgress = useCallback(() => {
    const startTime = Date.now()
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = (elapsed / STORY_DURATION) * PROGRESS_BAR_WIDTH

      if (newProgress >= PROGRESS_BAR_WIDTH) {
        goToNext()
      } else {
        setProgress(newProgress)
      }
    }, 16) // ~60fps
  }, [goToNext])

  const handleVideoProgress = useCallback(() => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current
      setProgress((currentTime / duration) * PROGRESS_BAR_WIDTH)
    }
  }, [])

  const handleVideoEnded = useCallback(() => {
    goToNext()
  }, [goToNext])

  const handleClick = useCallback((e: React.MouseEvent) => {
    const { clientX, currentTarget } = e
    const { left, width } = currentTarget.getBoundingClientRect()
    const clickPosition = clientX - left

    if (clickPosition < width / 2) {
      goToPrevious()
    } else {
      goToNext()
    }
  }, [goToNext, goToPrevious])

  // Handle media changes
  useEffect(() => {
    resetProgress()

    if (!currentItem) return

    if (currentItem.type === 'image') {
      startImageProgress()
    } else if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
      }
    }
  }, [currentItem, resetProgress, startImageProgress])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="p-6 rounded-full bg-white border border-gray-200 mb-6 shadow-sm">
          <svg className="w-8 h-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-base font-medium text-gray-600 mb-1">
          Your story preview
        </p>
        <p className="text-sm text-gray-400 max-w-[200px]">
          Upload media to see how your story will look
        </p>
      </div>
    )
  }

  return (
    <div 
      className="relative h-full bg-gray-50" 
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 p-2 flex gap-1 z-10 bg-gradient-to-b from-black/30 via-black/10 to-transparent">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm"
          >
            <div
              className="h-full bg-white rounded-full"
              style={{
                width: index === currentIndex 
                  ? `${progress}%` 
                  : index < currentIndex 
                    ? '100%' 
                    : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Story header info */}
      <div className="absolute top-6 left-0 right-0 px-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-300/50 backdrop-blur-sm"></div>
          <div className="space-y-1.5">
            <div className="w-24 h-2.5 bg-gray-300/50 backdrop-blur-sm rounded-full"></div>
            <div className="w-16 h-2 bg-gray-300/30 backdrop-blur-sm rounded-full"></div>
          </div>
        </div>
        <div className="p-1 text-white/70">
          <MoreHorizontal className="w-5 h-5" />
        </div>
      </div>

      {/* Media content */}
      <div className="absolute inset-0 select-none">
        {currentItem ? (
          currentItem.type === 'image' ? (
            <img
              src={currentItem.url}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <video
              ref={videoRef}
              src={currentItem.url}
              className="h-full w-full object-cover"
              playsInline
              muted
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
              onTimeUpdate={handleVideoProgress}
              onEnded={handleVideoEnded}
            />
          )
        ) : null}
      </div>

      {/* Story footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/30 via-black/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex-1 h-11 px-4 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/50 flex items-center select-none pointer-events-none">
            Send message
          </div>
          <div className="flex items-center space-x-2 ml-2">
            <div className="p-2 text-white/70">
              <Heart className="w-6 h-6" />
            </div>
            <div className="p-2 text-white/70">
              <Send className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 