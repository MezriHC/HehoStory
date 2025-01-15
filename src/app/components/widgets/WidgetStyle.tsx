import { Story } from '../StoriesList'
import { WidgetFormat } from '../WidgetFormatSelector'
import StoryStyle from '@/components/StoryStyle'
import { useState } from 'react'

interface WidgetStyleProps {
  format: WidgetFormat
  stories?: Story[]
  onStoryClick?: (story: Story) => void
  className?: string
}

export default function WidgetStyle({ format, stories, onStoryClick, className = '' }: WidgetStyleProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

  // Rendu des widgets qui affichent plusieurs stories (bubble, card, square)
  const renderMultipleStories = (variant: 'bubble' | 'card' | 'square') => {
    const count = variant === 'bubble' ? 3 : 2 // 3 stories pour bubble, 2 pour les autres
    
    return (
      <div className={`flex gap-6 ${className}`}>
        {stories?.length ? (
          stories.map((story) => (
            <StoryStyle
              key={story.id}
              variant={variant}
              story={story}
              onClick={() => {
                setSelectedStory(story)
                onStoryClick?.(story)
              }}
            />
          ))
        ) : (
          [...Array(count)].map((_, i) => (
            <StoryStyle
              key={i}
              variant={variant}
            />
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
          <StoryStyle
            variant={variant}
            story={stories[0]}
            onClick={() => {
              setSelectedStory(stories[0])
              onStoryClick?.(stories[0])
            }}
          />
        ) : (
          <StoryStyle
            variant={variant}
          />
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

  return (
    <>
      {/* Widget Content */}
      {(() => {
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
      })()}

      {/* Story Preview */}
      {selectedStory && (
        <StoryStyle
          variant="preview"
          items={selectedStory.content ? JSON.parse(selectedStory.content).mediaItems : []}
          profileImage={selectedStory.profile_image}
          profileName={selectedStory.profile_name}
          onComplete={() => setSelectedStory(null)}
        />
      )}
    </>
  )
} 