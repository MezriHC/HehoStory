'use client'

import { useState } from 'react'
import { Package, Store } from 'lucide-react'

export type WidgetSize = 'S' | 'M' | 'L'

export interface WidgetFormat {
  type: 'bubble' | 'card' | 'square'
  size: WidgetSize
}

interface WidgetFormatSelectorProps {
  value: WidgetFormat | null
  onChange: (format: WidgetFormat) => void
}

const formats = [
  { 
    type: 'bubble' as const, 
    label: 'Bubble Stories',
    description: 'Stories circulaires idéales pour une intégration discrète',
    previewSizes: {
      S: '40px',
      M: '45px',
      L: '50px'
    }
  },
  { 
    type: 'card' as const, 
    label: 'Story Cards',
    description: 'Stories verticales avec plus de contenu visible',
    previewSizes: {
      S: '45px',
      M: '50px',
      L: '55px'
    }
  },
  { 
    type: 'square' as const, 
    label: 'Square Grid',
    description: 'Stories carrées pour une mise en page équilibrée',
    previewSizes: {
      S: '40px',
      M: '45px',
      L: '50px'
    }
  }
]

export default function WidgetFormatSelector({ value, onChange }: WidgetFormatSelectorProps) {
  const [view, setView] = useState<'product' | 'home'>('product')

  const renderWidget = (type: 'bubble' | 'card' | 'square', size: WidgetSize = value?.size || 'S') => {
    const getSize = () => {
      switch (size) {
        case 'S': return { 
          bubble: 'w-[14px] h-[14px]',  // 70px ÷ 5
          card: 'w-[30px] h-[53.4px]',  // 150px ÷ 5, hauteur proportionnelle (16/9)
          square: 'w-[11.2px] h-[11.2px]'  // 56px ÷ 5
        }
        case 'M': return { 
          bubble: 'w-[18px] h-[18px]',  // 90px ÷ 5
          card: 'w-[37.5px] h-[66.7px]',  // 187.5px ÷ 5 (entre S et L)
          square: 'w-[12.8px] h-[12.8px]'  // 64px ÷ 5
        }
        case 'L': return { 
          bubble: 'w-[24px] h-[24px]',  // 120px ÷ 5
          card: 'w-[60px] h-[106.7px]',  // 300px ÷ 5
          square: 'w-[19.2px] h-[19.2px]'  // 96px ÷ 5
        }
        default: return { 
          bubble: 'w-[14px] h-[14px]',
          card: 'w-[30px] h-[53.4px]',
          square: 'w-[11.2px] h-[11.2px]'
        }
      }
    }

    const sizes = getSize()

    switch (type) {
      case 'bubble':
        return (
          <div className="flex items-center gap-[2px]">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`${sizes.bubble} rounded-full transition-colors duration-200
                  ${value?.type === type ? 'bg-gray-600' : 'bg-gray-200'}`} 
              />
            ))}
          </div>
        )
      case 'card':
        return (
          <div className="flex items-start gap-[2px]">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`${sizes.card} rounded transition-colors duration-200
                  ${value?.type === type ? 'bg-gray-600' : 'bg-gray-200'}`} 
              />
            ))}
          </div>
        )
      case 'square':
        return (
          <div className="flex items-center gap-[2px]">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`${sizes.square} rounded transition-colors duration-200
                  ${value?.type === type ? 'bg-gray-600' : 'bg-gray-200'}`} 
              />
            ))}
          </div>
        )
      default:
        return null
    }
  }

  const ProductPreview = ({ type }: { type: 'bubble' | 'card' | 'square' }) => (
    <div className="aspect-[4/3] w-full bg-white rounded-lg relative shadow-sm overflow-hidden">
      {/* Header */}
      <div className="h-5 border-b border-gray-100 mx-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded bg-gray-200" />
          <div className="w-10 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-1.5 bg-gray-200 rounded-full" />
          <div className="w-5 h-1.5 bg-gray-200 rounded-full" />
          <div className="w-2.5 h-2.5 rounded bg-gray-200" />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Product image */}
          <div className="space-y-2">
            {/* Main image */}
            <div className="aspect-square bg-gray-100 rounded relative">
              {/* Image navigation dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-gray-400' : 'bg-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            {/* Thumbnail carousel */}
            <div className="flex gap-1.5 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-8 aspect-square flex-shrink-0 rounded bg-gray-100" />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col py-1">
            {/* Title and Description */}
            <div className="space-y-1.5">
              <div className="w-4/5 h-1.5 bg-gray-200 rounded-full" />
              <div className="w-2/3 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* Description lines */}
            <div className="space-y-1 mt-3">
              <div className="w-full h-1 bg-gray-100 rounded-full" />
              <div className="w-full h-1 bg-gray-100 rounded-full" />
              <div className="w-2/3 h-1 bg-gray-100 rounded-full" />
            </div>

            {/* Widget Display */}
            <div className="mt-3">
              {renderWidget(type)}
            </div>

            {/* Add to Cart */}
            <div className="mt-3 space-y-1">
              <div className="h-5 bg-gray-200 rounded" />
              <div className="flex gap-1">
                <div className="h-1 flex-1 bg-gray-100 rounded-full" />
                <div className="h-1 flex-1 bg-gray-100 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const HomePreview = ({ type }: { type: 'bubble' | 'card' | 'square' }) => (
    <div className="aspect-[4/3] w-full bg-white rounded-lg relative shadow-sm overflow-hidden">
      {/* Header */}
      <div className="h-5 border-b border-gray-100 mx-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded bg-gray-200" />
          <div className="w-10 h-1.5 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Hero Section */}
        <div className="h-16 bg-gray-100 rounded-lg mb-3 relative">
          <div className="absolute inset-3 space-y-1.5">
            <div className="w-1/3 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-1/2 h-1.5 bg-gray-200 rounded-full" />
          </div>
        </div>

        {/* Widget Section */}
        <div className="py-3 border-y border-gray-100 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="space-y-1">
              <div className="w-24 h-1.5 bg-gray-200 rounded-full" />
              <div className="w-32 h-1 bg-gray-100 rounded-full" />
            </div>
          </div>
          <div className="mt-2">
            {renderWidget(type)}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="aspect-square bg-gray-100 rounded" />
              <div className="w-2/3 h-1 bg-gray-200 rounded-full" />
              <div className="w-1/2 h-1 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        {/* View Toggle */}
        <div className="flex h-10 bg-gray-100 rounded-lg p-1 flex-1">
          <button
            onClick={() => setView('product')}
            className={`
              flex-1 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors
              ${view === 'product'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            <Package className="w-4 h-4" />
            Produit
          </button>
          <button
            onClick={() => setView('home')}
            className={`
              flex-1 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors
              ${view === 'home'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            <Store className="w-4 h-4" />
            Accueil
          </button>
        </div>

        {/* Size Selector */}
        <div className="flex h-10 bg-gray-100 rounded-lg p-1">
          {(['S', 'M', 'L'] as const).map((size) => (
            <button
              key={size}
              onClick={() => onChange({ type: value?.type || 'bubble', size })}
              className={`
                w-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors
                ${value?.size === size
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'}
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {formats.map((format) => (
          <button
            key={format.type}
            onClick={() => onChange({ type: format.type, size: value?.size || 'S' })}
            className={`
              group relative transition-all duration-200
              ${value?.type === format.type ? 'scale-[1.02]' : ''}
            `}
          >
            {/* Card background */}
            <div className={`
              absolute inset-0 rounded-2xl transition-all duration-200 bg-white
              ${value?.type === format.type
                ? 'border-[3px] border-gray-600'
                : 'border-2 border-gray-200 group-hover:border-gray-300'}
            `} />

            <div className="relative p-4">
              {/* Format preview */}
              <div className="mb-4">
                {view === 'product' 
                  ? <ProductPreview type={format.type} /> 
                  : <HomePreview type={format.type} />
                }
              </div>

              {/* Format info */}
              <div className="text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">
                    {format.label}
                  </h3>
                  <div className={`
                    w-4 h-4 rounded-full border-2 transition-colors duration-200
                    ${value?.type === format.type
                      ? 'border-gray-600 bg-gray-600'
                      : 'border-gray-300 group-hover:border-gray-400'}
                  `} />
                </div>
                <p className="text-sm text-gray-500">
                  {format.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 