'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { WidgetFormat } from './WidgetFormatSelector'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  widget: {
    id: string
    format: WidgetFormat
    stories: string[]
  }
}

export default function SettingsModal({ isOpen, onClose, widget }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    pageUrl: '',
    productId: '',
    showOnAllPages: false
  })

  const handleSave = () => {
    // Save settings logic here
    onClose()
  }

  if (!isOpen) return null

  const modal = (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[640px]">
        <div 
          className="relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Widget Settings</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure where and how your widget appears on your website.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Page URL Pattern
                </label>
                <input
                  type="text"
                  placeholder="e.g., /products/*"
                  value={settings.pageUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, pageUrl: e.target.value }))}
                  className="w-full h-11 px-4 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Use * as a wildcard. Example: /products/* will match all product pages
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Product ID
                </label>
                <input
                  type="text"
                  placeholder="e.g., 123456"
                  value={settings.productId}
                  onChange={(e) => setSettings(prev => ({ ...prev, productId: e.target.value }))}
                  className="w-full h-11 px-4 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
                <p className="mt-2 text-sm text-gray-500">
                  The unique identifier for your product in your e-commerce platform
                </p>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Show on all pages
                  </label>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Display this widget across your entire website
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showOnAllPages}
                    onChange={(e) => setSettings(prev => ({ ...prev, showOnAllPages: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
} 