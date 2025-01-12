import StoryThumbnail from './StoryThumbnail'

interface WidgetPreviewProps {
  borderColor: string
}

export default function WidgetPreview({ borderColor }: WidgetPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Bubble Style */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">Bubble Style</h3>
        <div className="flex items-center gap-4">
          <StoryThumbnail variant="bubble" size="md" borderColor={borderColor} />
          <StoryThumbnail variant="bubble" size="md" borderColor={borderColor} />
          <StoryThumbnail variant="bubble" size="md" borderColor={borderColor} />
        </div>
      </div>

      {/* Card Style */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">Card Style</h3>
        <div className="flex items-center gap-4">
          <StoryThumbnail variant="card" size="md" borderColor={borderColor} />
          <StoryThumbnail variant="card" size="md" borderColor={borderColor} />
        </div>
      </div>

      {/* Square Style */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">Square Style</h3>
        <div className="flex items-center gap-4">
          <StoryThumbnail variant="square" size="md" borderColor={borderColor} />
          <StoryThumbnail variant="square" size="md" borderColor={borderColor} />
        </div>
      </div>
    </div>
  )
} 