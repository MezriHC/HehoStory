'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { WidgetFormat } from './WidgetFormatSelector'
import { WidgetSettings } from '@/types/database.types'
import { supabase } from '@/lib/supabase'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  widget: {
    id: string
    format: WidgetFormat
    story_ids: string[]
    settings?: WidgetSettings
  }
}

export default function SettingsModal({ isOpen, onClose, widget }: SettingsModalProps) {
  const [settings, setSettings] = useState<WidgetSettings>({
    appearance: {
      borderColor: '#000000',
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 8,
      backgroundColor: '#ffffff',
      textColor: '#000000'
    },
    display: {
      format: widget.format,
      size: 'md',
      position: {
        bottom: 20,
        right: 20
      }
    },
    behavior: {
      autoPlay: false,
      loop: false,
      showControls: true
    }
  })

  useEffect(() => {
    if (widget.settings) {
      setSettings(widget.settings as WidgetSettings)
    }
  }, [widget.settings])

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('widgets')
        .update({ settings })
        .eq('id', widget.id)

      if (error) throw error
      onClose()
    } catch (error) {
      console.error('Error saving widget settings:', error)
      alert('Failed to save settings. Please try again.')
    }
  }

  if (!isOpen) return null

  const modal = (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="absolute inset-4 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[640px]">
        <div 
          className="relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Widget Settings</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Customize the appearance and behavior of your widget
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

          <div className="p-8">
            <div className="space-y-8">
              {/* Appearance Settings */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Color
                    </label>
                    <input
                      type="color"
                      value={settings.appearance.borderColor}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          borderColor: e.target.value
                        }
                      }))}
                      className="h-11 px-2 rounded border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Width (px)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={settings.appearance.borderWidth}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          borderWidth: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full h-11 px-4 text-sm text-gray-900 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Style
                    </label>
                    <select
                      value={settings.appearance.borderStyle}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          borderStyle: e.target.value as 'solid' | 'dashed' | 'dotted'
                        }
                      }))}
                      className="w-full h-11 px-4 text-sm text-gray-900 border border-gray-200 rounded-lg"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Radius (px)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={settings.appearance.borderRadius}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          borderRadius: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full h-11 px-4 text-sm text-gray-900 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={settings.appearance.backgroundColor}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          backgroundColor: e.target.value
                        }
                      }))}
                      className="h-11 px-2 rounded border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={settings.appearance.textColor}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          textColor: e.target.value
                        }
                      }))}
                      className="h-11 px-2 rounded border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Display Settings */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Display</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <select
                      value={settings.display.size}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        display: {
                          ...prev.display,
                          size: e.target.value as 'sm' | 'md' | 'lg'
                        }
                      }))}
                      className="w-full h-11 px-4 text-sm text-gray-900 border border-gray-200 rounded-lg"
                    >
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                    </select>
                  </div>

                  {widget.format === 'sticky' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bottom Position (px)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={settings.display.position?.bottom}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            display: {
                              ...prev.display,
                              position: {
                                ...prev.display.position,
                                bottom: parseInt(e.target.value)
                              }
                            }
                          }))}
                          className="w-full h-11 px-4 text-sm text-gray-900 border border-gray-200 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Right Position (px)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={settings.display.position?.right}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            display: {
                              ...prev.display,
                              position: {
                                ...prev.display.position,
                                right: parseInt(e.target.value)
                              }
                            }
                          }))}
                          className="w-full h-11 px-4 text-sm text-gray-900 border border-gray-200 rounded-lg"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Behavior Settings */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Behavior</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Auto Play
                      </label>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Automatically play stories when opened
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.behavior.autoPlay}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          behavior: {
                            ...prev.behavior,
                            autoPlay: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Loop Stories
                      </label>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Continuously loop through stories
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.behavior.loop}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          behavior: {
                            ...prev.behavior,
                            loop: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Show Controls
                      </label>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Display navigation controls
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.behavior.showControls}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          behavior: {
                            ...prev.behavior,
                            showControls: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

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