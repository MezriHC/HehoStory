'use client'

import { Check, Copy, X } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

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
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop with blur effect */}
        <motion.div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        
        {/* Modal */}
        <motion.div 
          className="relative w-full max-w-[480px] mx-4"
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          <div 
            className="relative w-full bg-white rounded-xl shadow-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">Code d'intégration</h2>
              <button 
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Code block */}
              <div className="relative">
                <pre className="bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed">
                  {code}
                </pre>
              </div>
              
              {/* Copy button */}
              <motion.button
                onClick={handleCopy}
                className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                  copied 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {copied ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.3 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                    <span className="text-sm">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copier le code</span>
                  </>
                )}
              </motion.button>

              {/* Simple instruction */}
              <p className="text-xs text-gray-500 text-center">
                Intégrez ce code sur votre page produit, page d'accueil ou toute autre page de votre site où vous souhaitez afficher le widget
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )

  return createPortal(modal, document.body)
} 