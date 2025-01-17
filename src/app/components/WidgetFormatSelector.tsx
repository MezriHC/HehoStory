'use client'

import { useState } from 'react'
import { Package, Store, ArrowRight } from 'lucide-react'

export type WidgetSize = 'S' | 'M' | 'L'
export type WidgetAlignment = 'left' | 'center' | 'right'

export interface WidgetFormat {
  type: 'bubble' | 'card' | 'square'
  size: WidgetSize
  alignment: WidgetAlignment
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
  const [hoveredFormat, setHoveredFormat] = useState<string | null>(null)

  const handleFormatChange = (newFormat: Partial<WidgetFormat>) => {
    onChange({
      type: newFormat.type || value?.type || 'bubble',
      size: newFormat.size || value?.size || 'S',
      alignment: newFormat.alignment || value?.alignment || 'center'
    })
  }

  const renderWidget = (type: 'bubble' | 'card' | 'square', size: WidgetSize = value?.size || 'S') => {
    const getSize = () => {
      switch (size) {
        case 'S': return { 
          bubble: 'w-[14px] h-[14px]',  // 70px ÷ 5
          card: 'w-[20px] h-[35.6px]',  // 100px ÷ 5, hauteur proportionnelle (16/9)
          square: 'w-[11.2px] h-[11.2px]'  // 56px ÷ 5
        }
        case 'M': return { 
          bubble: 'w-[18px] h-[18px]',  // 90px ÷ 5
          card: 'w-[28px] h-[49.8px]',  // 140px ÷ 5, hauteur proportionnelle (16/9)
          square: 'w-[12.8px] h-[12.8px]'  // 64px ÷ 5
        }
        case 'L': return { 
          bubble: 'w-[24px] h-[24px]',  // 120px ÷ 5
          card: 'w-[36px] h-[64px]',  // 180px ÷ 5, hauteur proportionnelle (16/9)
          square: 'w-[19.2px] h-[19.2px]'  // 96px ÷ 5
        }
        default: return { 
          bubble: 'w-[14px] h-[14px]',
          card: 'w-[20px] h-[35.6px]',
          square: 'w-[11.2px] h-[11.2px]'
        }
      }
    }

    const sizes = getSize()
    const alignment = value?.alignment || 'center'
    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    }

    switch (type) {
      case 'bubble':
        return (
          <div className={`flex items-center gap-[2px] ${alignmentClasses[alignment]}`}>
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
          <div className={`flex items-start gap-[2px] ${alignmentClasses[alignment]}`}>
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
          <div className={`flex items-center gap-[2px] ${alignmentClasses[alignment]}`}>
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
            <div className="mt-3 w-full">
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
          <div className="mt-2 w-full">
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
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col gap-8">
        {/* View Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Où souhaitez-vous afficher votre widget ?
          </label>
          <div className="flex h-12 bg-gray-100 rounded-xl p-1.5 w-[320px]">
            <button
              onClick={() => setView('product')}
              className={`
                flex-1 flex items-center justify-center gap-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${view === 'product'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
              `}
            >
              <Package className="w-4 h-4" />
              Page Produit
            </button>
            <button
              onClick={() => setView('home')}
              className={`
                flex-1 flex items-center justify-center gap-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${view === 'home'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
              `}
            >
              <Store className="w-4 h-4" />
              Page d'Accueil
            </button>
          </div>
        </div>

        {/* Size and Alignment Controls */}
        <div className="flex gap-8">
          {/* Size Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quelle taille pour votre widget ?
            </label>
            <div className="flex h-12 bg-gray-100 rounded-xl p-1.5 w-[200px]">
              {(['S', 'M', 'L'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFormatChange({ size })}
                  className={`
                    flex-1 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                    ${value?.size === size
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Alignment Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Comment aligner les stories ?
            </label>
            <div className="flex h-12 bg-gray-100 rounded-xl p-1.5 w-[240px]">
              {(['left', 'center', 'right'] as const).map((alignment) => (
                <button
                  key={alignment}
                  onClick={() => handleFormatChange({ alignment })}
                  className={`
                    flex-1 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                    ${value?.alignment === alignment
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
                  `}
                >
                  {alignment === 'left' && 'Gauche'}
                  {alignment === 'center' && 'Centre'}
                  {alignment === 'right' && 'Droite'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Format Cards */}
      <div className="grid grid-cols-3 gap-6">
        {formats.map((format) => (
          <button
            key={format.type}
            onClick={() => handleFormatChange({ type: format.type })}
            onMouseEnter={() => setHoveredFormat(format.type)}
            onMouseLeave={() => setHoveredFormat(null)}
            className={`
              group relative transition-all duration-300 ease-out
              ${value?.type === format.type ? 'scale-[1.02]' : ''}
            `}
          >
            {/* Card background with improved hover effect */}
            <div className={`
              absolute inset-0 rounded-2xl transition-all duration-300 ease-out bg-white
              ${value?.type === format.type
                ? 'border-[3px] border-gray-900 shadow-lg'
                : hoveredFormat === format.type
                ? 'border-2 border-gray-400 shadow-md'
                : 'border-2 border-gray-200 shadow-sm'}
            `} />

            <div className="relative p-5">
              {/* Format preview with improved spacing */}
              <div className="mb-5 max-w-[280px] mx-auto">
                {view === 'product' 
                  ? <ProductPreview type={format.type} /> 
                  : <HomePreview type={format.type} />
                }
              </div>

              {/* Format info with improved layout */}
              <div className="text-left space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2 group-hover:text-gray-900">
                    {format.label}
                    <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                      value?.type === format.type || hoveredFormat === format.type
                        ? 'translate-x-1 opacity-100'
                        : 'opacity-0'
                    }`} />
                  </h3>
                  <div className={`
                    w-5 h-5 rounded-full border-2 transition-all duration-300
                    ${value?.type === format.type
                      ? 'border-gray-900 bg-gray-900 scale-110'
                      : hoveredFormat === format.type
                      ? 'border-gray-400 scale-105'
                      : 'border-gray-300'}
                  `} />
                </div>
                <p className="text-sm text-gray-500 group-hover:text-gray-600">
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