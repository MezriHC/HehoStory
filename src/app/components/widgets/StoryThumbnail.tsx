import { Story } from '../StoriesList'

interface StoryThumbnailProps {
  story?: Story
  variant?: 'bubble' | 'card' | 'square' | 'single-bubble' | 'story'
  size?: 'sm' | 'md' | 'lg'
  showPlayIcon?: boolean
  className?: string
  borderColor?: string
}

export default function StoryThumbnail({ 
  story,
  variant = 'bubble',
  size = 'md',
  showPlayIcon = true,
  className = '',
  borderColor = '#000000'
}: StoryThumbnailProps) {
  // Size mappings for each variant
  const sizes = {
    bubble: {
      sm: {
        outer: 'w-[70px] h-[70px]',
        inner: 'w-[60px] h-[60px]',
        icon: 'w-6 h-6'
      },
      md: {
        outer: 'w-[90px] h-[90px]',
        inner: 'w-[80px] h-[80px]',
        icon: 'w-8 h-8'
      },
      lg: {
        outer: 'w-[110px] h-[110px]',
        inner: 'w-[100px] h-[100px]',
        icon: 'w-10 h-10'
      }
    },
    'single-bubble': {
      sm: {
        outer: 'w-[70px] h-[70px]',
        inner: 'w-[60px] h-[60px]',
        icon: 'w-6 h-6'
      },
      md: {
        outer: 'w-[90px] h-[90px]',
        inner: 'w-[80px] h-[80px]',
        icon: 'w-8 h-8'
      },
      lg: {
        outer: 'w-[110px] h-[110px]',
        inner: 'w-[100px] h-[100px]',
        icon: 'w-10 h-10'
      }
    },
    'story': {
      sm: {
        outer: 'w-[180px] h-[320px]',
        inner: 'w-[174px] h-[314px]',
        icon: 'w-10 h-10'
      },
      md: {
        outer: 'w-[200px] h-[356px]',
        inner: 'w-[194px] h-[350px]',
        icon: 'w-12 h-12'
      },
      lg: {
        outer: 'w-[220px] h-[391px]',
        inner: 'w-[214px] h-[385px]',
        icon: 'w-14 h-14'
      }
    },
    card: {
      sm: {
        outer: 'w-[96px] h-[128px]',
        inner: 'w-[90px] h-[122px]',
        icon: 'w-6 h-6'
      },
      md: {
        outer: 'w-[106px] h-[138px]',
        inner: 'w-[100px] h-[132px]',
        icon: 'w-8 h-8'
      },
      lg: {
        outer: 'w-[116px] h-[148px]',
        inner: 'w-[110px] h-[142px]',
        icon: 'w-10 h-10'
      }
    },
    square: {
      sm: {
        outer: 'w-[80px] h-[80px]',
        inner: 'w-[74px] h-[74px]',
        icon: 'w-6 h-6'
      },
      md: {
        outer: 'w-[90px] h-[90px]',
        inner: 'w-[84px] h-[84px]',
        icon: 'w-8 h-8'
      },
      lg: {
        outer: 'w-[100px] h-[100px]',
        inner: 'w-[94px] h-[94px]',
        icon: 'w-10 h-10'
      }
    }
  }

  const variantClasses = {
    bubble: 'rounded-full',
    card: 'rounded-lg',
    square: 'rounded-lg',
    'single-bubble': 'rounded-full',
    'story': 'rounded-2xl'
  }

  const innerVariantClasses = {
    bubble: 'rounded-full',
    card: 'rounded-md',
    square: 'rounded-md',
    'single-bubble': 'rounded-full',
    'story': 'rounded-xl'
  }

  const selectedSize = sizes[variant][size]
  const roundedClass = variantClasses[variant]
  const innerRoundedClass = innerVariantClasses[variant]

  return (
    <div className={`relative ${className} transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer`}>
      {/* Outer container */}
      <div 
        className={`relative ${selectedSize.outer} ${roundedClass} border-2 shadow-lg`} 
        style={{ borderColor }}
      >
        {/* Inner container */}
        <div className={`absolute inset-0 ${variant === 'card' || variant === 'square' ? 'm-[3px]' : 'm-[5px]'} ${innerRoundedClass} overflow-hidden`}>
          {story?.thumbnail ? (
            <>
              <img 
                src={story.thumbnail} 
                alt={story.title} 
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className={`absolute inset-0 ${innerRoundedClass} bg-black/20`} />
              
              {/* Play icon */}
              {showPlayIcon && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className={`${selectedSize.icon} text-white relative z-10`} viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M6 4v16l14-8L6 4z" 
                      fill="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-black/90 flex items-center justify-center">
              {showPlayIcon && (
                <svg className={`${selectedSize.icon} text-white`} viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M6 4v16l14-8L6 4z" 
                    fill="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 