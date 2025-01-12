import { WidgetFormat } from './WidgetFormatSelector'
import StoryThumbnail from './widgets/StoryThumbnail'

interface ProductPageSkeletonProps {
  format: WidgetFormat
}

export default function ProductPageSkeleton({ format }: ProductPageSkeletonProps) {
  return (
    <div className="min-h-screen py-32">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="w-3/4 h-8 bg-gray-100 rounded-lg" />
          <div className="w-1/2 h-6 bg-gray-100 rounded-lg" />
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <div className="w-full h-48 bg-gray-100 rounded-lg" />
          <div className="w-5/6 h-32 bg-gray-100 rounded-lg" />
          <div className="w-full h-64 bg-gray-100 rounded-lg" />
        </div>

        {/* Widget Preview */}
        {renderWidget()}
      </div>
    </div>
  )

  function renderWidget() {
    switch (format) {
      case 'bubble':
        return (
          <div className="fixed bottom-6 right-6 flex gap-6 items-center">
            {[...Array(4)].map((_, i) => (
              <StoryThumbnail key={i} variant="bubble" />
            ))}
          </div>
        )
      case 'card':
        return (
          <div className="fixed bottom-6 right-6 flex gap-6 items-end">
            {[...Array(3)].map((_, i) => (
              <StoryThumbnail key={i} variant="card" />
            ))}
          </div>
        )
      case 'square':
        return (
          <div className="fixed bottom-6 right-6 flex gap-6 items-center">
            {[...Array(3)].map((_, i) => (
              <StoryThumbnail key={i} variant="square" />
            ))}
          </div>
        )
      case 'iframe':
        return (
          <div className="fixed right-6 top-1/2 -translate-y-1/2">
            <div className="relative w-[300px] h-[600px]">
              <div className="absolute inset-0 rounded-lg border-2 border-black" />
              <div className="absolute inset-[5px] rounded-lg overflow-hidden bg-black/90">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/20" />
                  <svg className="w-8 h-8 text-white relative z-10" viewBox="0 0 24 24" fill="none">
                    <path d="M6 4v16l14-8L6 4z" fill="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )
      case 'sticky':
        return (
          <div className="fixed bottom-6 right-6">
            <StoryThumbnail variant="bubble" size="sm" />
          </div>
        )
    }
  }
} 