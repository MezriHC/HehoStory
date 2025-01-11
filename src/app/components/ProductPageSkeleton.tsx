import { WidgetFormat } from './WidgetFormatSelector'

interface ProductPageSkeletonProps {
  format: WidgetFormat
}

export default function ProductPageSkeleton({ format }: ProductPageSkeletonProps) {
  const renderWidget = () => {
    const commonClasses = "bg-gray-900 shadow-lg backdrop-blur-sm"
    
    switch (format) {
      case 'bubble':
        return (
          <div className="fixed bottom-4 right-4 flex gap-2 items-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-14 h-14 rounded-full ${commonClasses} transition-transform hover:scale-105`} />
            ))}
          </div>
        )
      case 'card':
        return (
          <div className="fixed bottom-4 right-4 flex gap-2 items-end">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-20 h-28 rounded-xl ${commonClasses} transition-transform hover:scale-105`} />
            ))}
          </div>
        )
      case 'square':
        return (
          <div className="fixed bottom-4 right-4 flex gap-2 items-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-20 h-20 rounded-xl ${commonClasses} transition-transform hover:scale-105`} />
            ))}
          </div>
        )
      case 'iframe':
        return (
          <div className="fixed right-4 top-1/2 -translate-y-1/2">
            <div className={`w-72 h-[calc(100vh-8rem)] rounded-xl ${commonClasses}`}>
              <div className="p-4 space-y-2">
                <div className="w-3/4 h-2 bg-white/20 rounded" />
                <div className="w-1/2 h-2 bg-white/20 rounded" />
              </div>
            </div>
          </div>
        )
      case 'sticky':
        return (
          <div className="fixed bottom-4 right-4">
            <div className={`w-14 h-14 rounded-full ${commonClasses} transition-transform hover:scale-105`} />
          </div>
        )
    }
  }

  return (
    <div className="w-full aspect-[4/3] bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-gray-100 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
          <div className="w-24 h-4 bg-gray-100 rounded-lg" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-4 bg-gray-100 rounded-lg" />
          <div className="w-10 h-4 bg-gray-100 rounded-lg" />
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-2 gap-8">
        {/* Product images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="w-3/4 h-8 bg-gray-100 rounded-lg" />
              <div className="w-1/2 h-6 bg-gray-100 rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-8 bg-gray-100 rounded-lg" />
              <div className="w-20 h-8 bg-gray-100 rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-100 rounded-lg" />
            <div className="w-full h-4 bg-gray-100 rounded-lg" />
            <div className="w-2/3 h-4 bg-gray-100 rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="w-1/3 h-6 bg-gray-100 rounded-lg" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-100 rounded-lg" />
            <div className="flex-1 h-12 bg-gray-900 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Widget preview */}
      <div className="relative">
        {renderWidget()}
      </div>
    </div>
  )
} 