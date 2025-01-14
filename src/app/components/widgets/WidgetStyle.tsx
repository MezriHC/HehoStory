import { Story } from '../StoriesList'
import { WidgetFormat } from '../WidgetFormatSelector'
import StoryThumbnail from './StoryThumbnail'

interface WidgetStyleProps {
  format: WidgetFormat
  stories?: Story[]
  onStoryClick?: (story: Story) => void
  className?: string
}

export default function WidgetStyle({ format, stories, onStoryClick, className = '' }: WidgetStyleProps) {
  // Rendu des widgets qui affichent plusieurs stories (bubble, card, square)
  const renderMultipleStories = (variant: 'bubble' | 'card' | 'square') => {
    const count = variant === 'bubble' ? 3 : 2 // 3 stories pour bubble, 2 pour les autres
    
    return (
      <div className={`flex gap-4 ${className}`}>
        {stories?.length ? (
          stories.map((story) => (
            <div 
              key={story.id} 
              className="flex-shrink-0 cursor-pointer relative z-10" 
              onClick={() => onStoryClick?.(story)}
            >
              <StoryThumbnail 
                story={story}
                variant={variant}
                size="md"
              />
            </div>
          ))
        ) : (
          [...Array(count)].map((_, i) => (
            <div key={i} className="flex-shrink-0 relative z-10">
              <StoryThumbnail 
                variant={variant}
                size="md"
              />
            </div>
          ))
        )}
      </div>
    )
  }

  // Rendu des widgets qui n'affichent qu'une seule story (sticky, iframe)
  const renderSingleStory = (variant: 'single-bubble' | 'story') => {
    return (
      <div className={className}>
        {stories?.[0] ? (
          <div 
            className="cursor-pointer relative z-10" 
            onClick={() => onStoryClick?.(stories[0])}
          >
            <StoryThumbnail 
              story={stories[0]}
              variant={variant}
              size={variant === 'story' ? 'lg' : 'md'}
            />
          </div>
        ) : (
          <div className="relative z-10">
            <StoryThumbnail 
              variant={variant}
              size={variant === 'story' ? 'lg' : 'md'}
            />
          </div>
        )}
      </div>
    )
  }

  // Conteneur commun pour les widgets intégrés
  const InlineContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="relative py-6 before:absolute before:inset-x-0 before:top-0 before:border-t before:border-gray-200 after:absolute after:inset-x-0 after:bottom-0 after:border-b after:border-gray-200">
      {children}
    </div>
  )

  switch (format) {
    // Widgets multi-stories
    case 'bubble':
    case 'card':
    case 'square':
      return (
        <InlineContainer>
          {renderMultipleStories(format)}
        </InlineContainer>
      )
    
    // Widgets single-story
    case 'sticky':
      return renderSingleStory('single-bubble')
    case 'iframe':
      return renderSingleStory('story')
    
    default:
      return null
  }
} 