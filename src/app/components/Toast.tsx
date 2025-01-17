'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  visible: boolean
  onClose: () => void
  type?: ToastType
  duration?: number
}

export default function Toast({ 
  message, 
  visible, 
  onClose, 
  type = 'success',
  duration = 3000 
}: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    if (visible) {
      setIsLeaving(false)
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [visible, duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose()
      setIsLeaving(false)
    }, 150) // Durée de l'animation de sortie
  }

  if (!visible) return null

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  }

  const backgrounds = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  }

  const textColors = {
    success: 'text-emerald-800',
    error: 'text-red-800',
    info: 'text-blue-800'
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <div 
        className={`
          ${backgrounds[type]}
          ${textColors[type]}
          px-4 py-3 
          rounded-lg 
          shadow-sm
          border
          flex items-center gap-3
          transform
          ${isLeaving 
            ? 'animate-out fade-out slide-out-to-right duration-150' 
            : 'animate-in fade-in slide-in-from-right-5 duration-300'
          }
        `}
      >
        <div className={`
          transform transition-transform duration-200 
          ${isLeaving ? 'scale-95' : 'scale-100'}
        `}>
          {icons[type]}
        </div>
        <span className="text-sm font-medium">{message}</span>
        <button 
          onClick={handleClose} 
          className={`
            ${textColors[type]} 
            opacity-60 
            hover:opacity-100 
            transition-all
            duration-200
            hover:scale-110
          `}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
} 