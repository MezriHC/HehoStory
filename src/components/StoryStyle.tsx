import { User, Pause, Play, Volume2, VolumeX, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Story } from '@/app/components/StoriesList'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  file: File | null
}

type StoryVariant = 'preview' | 'bubble' | 'card' | 'square'

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
  hideNavigation?: boolean
  onNextStory?: () => void
  onPrevStory?: () => void
  isFirstStory?: boolean
  isLastStory?: boolean
  isModal?: boolean
  borderColor?: string
}

interface StoryCarouselProps {
  stories: Story[]
  variant: 'bubble' | 'card' | 'square'
  size: 'sm' | 'md' | 'lg'
  onStorySelect: (story: Story) => void
  className?: string
  alignment?: 'left' | 'center' | 'right'
  borderColor?: string
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
  isPhonePreview = false,
  hideNavigation = false,
  onNextStory,
  onPrevStory,
  isFirstStory = false,
  isLastStory = false,
  isModal = false,
  borderColor
}: StoryStyleProps) {
  console.log('🎨 StoryStyle - Received borderColor:', borderColor)
  console.log('🎨 StoryStyle - Variant:', variant)

  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const startTimeRef = useRef<number>(Date.now())
  const elapsedBeforePauseRef = useRef<number>(0)

  // Only start after component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Styles communs pour les vignettes avec bordure
  const thumbnailStyles = {
    bubble: 'rounded-full ring-2 ring-offset-2 shadow-lg transition-transform duration-200 flex items-center justify-center overflow-hidden',
    card: 'aspect-[9/16] rounded-xl ring-2 ring-offset-2 shadow-lg transition-transform duration-200 overflow-hidden',
    square: 'aspect-square rounded-lg ring-2 ring-offset-2 shadow-lg transition-transform duration-200 overflow-hidden',
    preview: 'w-full h-full'
  }

  const sizeStyles = {
    sm: {
      bubble: 'w-[70px] h-[70px]',
      card: 'w-[100px]',
      square: 'w-14'
    },
    md: {
      bubble: 'w-[90px] h-[90px]',
      card: 'w-[140px]',
      square: 'w-16'
    },
    lg: {
      bubble: 'w-[120px] h-[120px]',
      card: 'w-[180px]',
      square: 'w-24'
    }
  }

  // Rendu des vignettes
  if (variant !== 'preview') {
    const mediaContent = story?.content ? JSON.parse(story.content) : null
    const mediaUrl = story?.thumbnail || mediaContent?.mediaItems[0]?.url
    const mediaType = mediaContent?.mediaItems[0]?.type
    const containerStyle = `${thumbnailStyles[variant]} ${sizeStyles[size][variant]} ${className} relative cursor-pointer group flex-shrink-0`

    // Tailles du contenu interne (2px de moins que le conteneur pour le padding)
    const getInnerSize = () => {
      switch (size) {
        case 'sm':
          return variant === 'bubble' ? 'w-[66px] h-[66px]' : ''
        case 'md':
          return variant === 'bubble' ? 'w-[86px] h-[86px]' : ''
        case 'lg':
          return variant === 'bubble' ? 'w-[116px] h-[116px]' : ''
        default:
          return ''
      }
    }

    console.log('🎨 StoryStyle - Applying styles with borderColor:', borderColor)

    // Déterminer la largeur maximale en fonction du variant et de la taille
    const getMaxWidth = () => {
      if (variant === 'bubble') {
        return size === 'sm' ? 'max-w-[70px]' : size === 'md' ? 'max-w-[90px]' : 'max-w-[120px]'
      } else if (variant === 'card') {
        return size === 'sm' ? 'max-w-[100px]' : size === 'md' ? 'max-w-[140px]' : 'max-w-[180px]'
      } else { // square
        return size === 'sm' ? 'max-w-14' : size === 'md' ? 'max-w-16' : 'max-w-24'
      }
    }

    return (
      <div className="flex flex-col items-center gap-3">
        <div 
          className={containerStyle}
          onClick={onClick}
          style={borderColor ? { 
            '--tw-ring-color': borderColor,
            '--tw-ring-offset-color': 'white'
          } as React.CSSProperties : undefined}
        >
          {variant === 'bubble' ? (
            <div 
              className={`${size === 'sm' ? 'w-[70px] h-[70px]' : size === 'md' ? 'w-[90px] h-[90px]' : 'w-[120px] h-[120px]'} rounded-full overflow-hidden relative`}
            >
              {mediaUrl ? (
                <>
                  <img 
                    src={mediaUrl} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-7 h-7'} text-white drop-shadow-sm`} fill="currentColor" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-gray-400`} />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full rounded-[inherit] overflow-hidden relative">
              {mediaUrl ? (
                <>
                  <img 
                    src={mediaUrl} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className={`${size === 'sm' ? 'w-7 h-7' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10'} text-white drop-shadow-sm`} fill="currentColor" />
                    </div>
                  </div>
                  {/* Gradient et texte pour les cartes */}
                  {variant === 'card' && story?.profile_name && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-3 px-2">
                      <div className={`text-center truncate font-medium text-white ${
                        size === 'sm' ? 'text-xs' : 'text-sm'
                      }`}>
                        {story.profile_name}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-gray-400`} />
                </div>
              )}
            </div>
          )}
        </div>
        {/* Afficher le texte en dessous seulement pour les bubbles et squares */}
        {story?.profile_name && variant !== 'card' && (
          <div className={`text-center truncate font-medium ${getMaxWidth()} ${
            size === 'sm' ? 'text-xs' : 'text-sm'
          }`}>
            {story.profile_name}
          </div>
        )}
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

  // Logique de navigation simplifiée
  const goToNextStory = useCallback(() => {
    if (isLastStory) {
      onComplete?.()
      resetProgress()
    } else {
      onNextStory?.()
      setCurrentIndex(0)
      resetProgress()
    }
  }, [isLastStory, onNextStory, onComplete, resetProgress])

  const goToPrevFrame = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      resetProgress()
    } else if (currentIndex === 0 && !isFirstStory) {
      onPrevStory?.()
      setCurrentIndex((items?.length || 1) - 1)
      resetProgress()
    }
  }, [currentIndex, isFirstStory, items?.length, onPrevStory, resetProgress])

  const goToPrevStory = useCallback(() => {
    if (isFirstStory) {
      onComplete?.()
    } else {
      onPrevStory?.()
      setCurrentIndex((items?.length || 1) - 1)
      resetProgress()
    }
  }, [isFirstStory, items?.length, onPrevStory, onComplete, resetProgress])

  const goToNextFrame = useCallback(() => {
    if (!isLastItem) {
      setCurrentIndex(prev => prev + 1)
      resetProgress()
    } else if (isPhonePreview) {
      // En mode preview, on quitte la story à la fin
      onComplete?.()
    } else {
      // En mode normal, on passe à la story suivante
      if (isLastStory) {
        onComplete?.()
      } else {
        onNextStory?.()
        setCurrentIndex(0)
        resetProgress()
      }
    }
  }, [isLastItem, isPhonePreview, isLastStory, onNextStory, onComplete, resetProgress])

  // Effet pour réinitialiser l'état lors du changement de story
  useEffect(() => {
    setCurrentIndex(0)
    resetProgress()
  }, [story?.id, resetProgress])

  useEffect(() => {
    if (!currentItem) return

    if (currentItem.type === 'video' && videoRef.current) {
      videoRef.current.muted = isMuted
      
      if (isPaused) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(console.error)
      }
      return
    }

    // Nettoyage de l'ancien timer
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }

    // Si en pause, on garde juste la progression actuelle
    if (isPaused) {
      return
    }

    // Démarrer un nouveau timer
    startTimeRef.current = Date.now() - (progress * STORY_DURATION / PROGRESS_BAR_WIDTH)
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min((elapsed / STORY_DURATION) * PROGRESS_BAR_WIDTH, PROGRESS_BAR_WIDTH)
      setProgress(newProgress)

      if (newProgress >= PROGRESS_BAR_WIDTH) {
        clearInterval(timer)
        if (isPhonePreview && isLastItem) {
          onComplete?.()
        } else if (isLastItem && isLastStory) {
          onComplete?.()
        } else {
          goToNextFrame()
        }
      }
    }, 16) // 60fps pour une animation plus fluide

    progressTimerRef.current = timer
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [currentItem, isPaused, isMuted, progress, isLastItem, isLastStory, isPhonePreview, onComplete, goToNextFrame])

  if (!mounted || !currentItem) return null

  return (
    <div className="relative w-full max-w-[800px] mx-auto flex items-center justify-center">
      {/* Left Navigation */}
      {!hideNavigation && !isModal && (
        <div className={`absolute -left-32 top-1/2 -translate-y-1/2 flex items-center gap-4 z-30 ${isPhonePreview ? 'opacity-30 pointer-events-none' : ''}`}>
          {/* Story navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevStory()
            }}
            disabled={isFirstStory || isPhonePreview}
            className={`text-white transition-all ${
              isFirstStory || isPhonePreview
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:text-white/90'
            }`}
            title="Previous story"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5L5 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="6" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          {/* Frame navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevFrame()
            }}
            disabled={currentIndex === 0 && isFirstStory || isPhonePreview}
            className={`p-2 rounded-full bg-white text-gray-900 transition-all ${
              currentIndex === 0 && isFirstStory || isPhonePreview
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-white/90'
            }`}
            title="Previous frame"
          >
            <ChevronLeft className="w-8 h-8 stroke-[2]" />
          </button>
        </div>
      )}

      {/* Story Container */}
      <div 
        className={`relative w-full max-w-[450px] mx-auto rounded-xl overflow-hidden ${className}`}
        style={isModal ? {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50
        } : undefined}
      >
        <div className="relative aspect-[9/16] bg-black w-full rounded-2xl overflow-hidden">
          {/* Progress bars */}
          <div className="absolute top-0.5 left-0 right-0 p-2 flex gap-1 z-20">
            {items?.map((item, index) => (
              <div
                key={item.id}
                className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm"
              >
                <div
                  className={`h-full bg-white rounded-full ${
                    index === currentIndex && !isPaused
                      ? progress > 0 ? 'transition-[width] duration-200 ease-linear' : 'transition-none'
                      : 'transition-none'
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
                autoPlay
                preload="metadata"
                muted={isMuted}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    const progress = (videoRef.current.currentTime / videoRef.current.duration) * PROGRESS_BAR_WIDTH
                    setProgress(progress)
                  }
                }}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget
                  video.currentTime = 0.1
                  if (!isPaused) {
                    video.play().catch(console.error)
                  }
                }}
                onEnded={goToNextFrame}
                onPause={() => {
                  if (!isPaused) {
                    setIsPaused(true)
                  }
                }}
                onPlay={() => {
                  if (isPaused) {
                    setIsPaused(false)
                  }
                }}
              />
            ) : (
              <img
                src={currentItem?.url}
                alt=""
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Story header */}
          <div className="absolute top-6 left-4 flex items-center space-x-3 z-20">
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
          <div className="absolute top-6 right-4 flex flex-col gap-4 z-50">
            <button 
              onClick={(e) => {
                console.log('🔴 Bouton Close cliqué')
                e.preventDefault()
                e.stopPropagation()
                console.log('🔴 Appel de onComplete depuis le bouton Close')
                onComplete?.()
              }}
              className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <button 
              onClick={(e) => {
                console.log('⏯️ Bouton Play/Pause cliqué')
                e.preventDefault()
                e.stopPropagation()
                if (currentItem?.type === 'video' && videoRef.current) {
                  if (isPaused) {
                    videoRef.current.play().catch(console.error)
                  } else {
                    videoRef.current.pause()
                  }
                }
                setIsPaused(!isPaused)
              }}
              className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={(e) => {
                console.log('🔊 Bouton Mute cliqué')
                e.preventDefault()
                e.stopPropagation()
                setIsMuted(!isMuted)
              }}
              className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Controls */}
          {!isPhonePreview && (
            <>
              <div 
                className="absolute left-0 top-0 bottom-0 w-1/3 z-30"
                onClick={(e) => {
                  console.log('⬅️ Zone gauche cliquée')
                  e.preventDefault()
                  e.stopPropagation()
                  goToPrevFrame()
                }}
              />
              <div 
                className="absolute right-0 top-0 bottom-0 w-1/3 z-30"
                onClick={(e) => {
                  console.log('➡️ Zone droite cliquée')
                  e.preventDefault()
                  e.stopPropagation()
                  goToNextFrame()
                }}
              />
            </>
          )}

          {/* Phone Preview Click Handler */}
          {isPhonePreview && (
            <div 
              className="absolute inset-0 z-30"
              onClick={(e) => {
                console.log('📱 Zone preview cliquée')
                e.preventDefault()
                e.stopPropagation()
                console.log('📱 Appel de onComplete depuis la zone preview')
                onComplete?.()
              }}
            />
          )}
        </div>
      </div>

      {/* Right Navigation */}
      {!hideNavigation && !isModal && (
        <div className={`absolute -right-32 top-1/2 -translate-y-1/2 flex items-center gap-4 z-30 ${isPhonePreview ? 'opacity-30 pointer-events-none' : ''}`}>
          {/* Frame navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNextFrame()
            }}
            disabled={isLastItem && isLastStory || isPhonePreview}
            className={`p-2 rounded-full bg-white text-gray-900 transition-all ${
              isLastItem && isLastStory || isPhonePreview
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-white/90'
            }`}
            title="Next frame"
          >
            <ChevronRight className="w-8 h-8 stroke-[2]" />
          </button>
          {/* Story navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNextStory()
            }}
            disabled={isLastStory || isPhonePreview}
            className={`text-white transition-all ${
              isLastStory || isPhonePreview
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:text-white/90'
            }`}
            title="Next story"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 19L19 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="18" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export function StoryCarousel({ stories, variant, size, onStorySelect, className = '', alignment = 'center', borderColor }: StoryCarouselProps) {
  console.log('🎨 StoryCarousel - Received borderColor:', borderColor)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkOverflow = useCallback(() => {
    const container = containerRef.current
    if (container) {
      const hasOverflow = container.scrollWidth > container.clientWidth
      setShowLeftArrow(container.scrollLeft > 20)
      setShowRightArrow(
        container.scrollLeft < (container.scrollWidth - container.clientWidth - 20)
      )
    }
  }, [])

  useEffect(() => {
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', checkOverflow)
    }
    return () => {
      window.removeEventListener('resize', checkOverflow)
      if (container) {
        container.removeEventListener('scroll', checkOverflow)
      }
    }
  }, [checkOverflow])

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const getAlignmentClasses = () => {
    switch (alignment) {
      case 'left':
        return 'justify-start'
      case 'right':
        return 'justify-end'
      case 'center':
      default:
        return 'justify-center'
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`relative ${getAlignmentClasses()}`}>
        {/* Effet de fondu à gauche */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/60 to-transparent z-10 pointer-events-none transition-opacity duration-500 ${
            showLeftArrow ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Effet de fondu à droite */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/60 to-transparent z-10 pointer-events-none transition-opacity duration-500 ${
            showRightArrow ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Conteneur de défilement */}
        <div 
          ref={containerRef}
          className="relative overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={checkOverflow}
        >
          <div className="flex gap-4 w-max py-2 px-4">
            {stories.map((story) => (
              <StoryStyle 
                key={story.id}
                variant={variant}
                story={story}
                onClick={() => onStorySelect(story)}
                size={size}
                borderColor={borderColor}
              />
            ))}
          </div>
        </div>

        {/* Boutons de navigation avec transition douce */}
        <div 
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 transition-all duration-500 ${
            showLeftArrow 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-4 pointer-events-none'
          }`}
        >
          <button 
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div 
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 transition-all duration-500 ${
            showRightArrow 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-4 pointer-events-none'
          }`}
        >
          <button 
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Nouveau composant wrapper pour la gestion des stories
export function StoryViewer({
  stories,
  onClose,
  selectedStoryId,
  className = ''
}: {
  stories: Story[]
  onClose: () => void
  selectedStoryId?: string
  className?: string
}) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(
    selectedStoryId ? stories.find(s => s.id === selectedStoryId) || stories[0] : stories[0]
  )
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(
    selectedStoryId ? stories.findIndex(s => s.id === selectedStoryId) : 0
  )

  const handleNextStory = useCallback(() => {
    if (selectedStoryIndex < stories.length - 1) {
      setSelectedStory(stories[selectedStoryIndex + 1])
      setSelectedStoryIndex(prev => prev + 1)
    } else {
      onClose()
    }
  }, [selectedStoryIndex, stories, onClose])

  const handlePrevStory = useCallback(() => {
    if (selectedStoryIndex > 0) {
      setSelectedStory(stories[selectedStoryIndex - 1])
      setSelectedStoryIndex(prev => prev - 1)
    } else {
      onClose()
    }
  }, [selectedStoryIndex, stories, onClose])

  const handleBackdropClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Vérifier que le clic est bien sur le backdrop
    const target = e.target as HTMLElement
    if (target.classList.contains('story-viewer-backdrop')) {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    }
  }, [onClose])

  if (!selectedStory) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] story-viewer-backdrop" 
      onClick={handleBackdropClick}
      onTouchEnd={handleBackdropClick}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div 
        className={`relative w-full h-full max-w-[400px] flex items-center justify-center mx-auto p-3 ${className}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full h-full flex items-center justify-center">
          <StoryStyle
            variant="preview"
            story={selectedStory}
            items={selectedStory.content ? JSON.parse(selectedStory.content).mediaItems : []}
            profileImage={selectedStory.profile_image || undefined}
            profileName={selectedStory.profile_name || undefined}
            onComplete={onClose}
            onNextStory={handleNextStory}
            onPrevStory={handlePrevStory}
            isFirstStory={selectedStoryIndex === 0}
            isLastStory={selectedStoryIndex === stories.length - 1}
            className="rounded-xl overflow-hidden"
            isModal={true}
          />
        </div>
      </div>
    </div>
  )
}