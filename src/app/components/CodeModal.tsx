'use client'

import { Check, Copy, X } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'

interface CodeModalProps {
  isOpen: boolean
  onClose: () => void
  code: string
}

export default function CodeModal({ isOpen, onClose, code }: CodeModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
                <h2 className="text-xl font-semibold text-gray-900">Widget Code</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Copy and paste this code into your product page, right after the product title.
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

          {/* Code Block */}
          <div className="p-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity" />
              <pre className="relative bg-gray-950 text-gray-200 p-6 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed">
                {code}
              </pre>
              
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Copy code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
} 