'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  show: boolean
  onHide: () => void
  duration?: number
}

export default function Toast({ message, show, onHide, duration = 1500 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onHide])

  if (!show) return null

  return (
    <div 
      className={`
        fixed bottom-4 right-4 
        bg-gray-900 text-white 
        px-4 py-3 
        rounded-lg shadow-lg 
        flex items-center 
        transform
        transition-all duration-500 ease-out
        translate-y-[200%] opacity-0
        animate-in fade-in slide-in-from-bottom-full 
        data-[state=open]:translate-y-0 data-[state=open]:opacity-100
        hover:translate-y-[-4px]
      `}
      data-state={show ? 'open' : 'closed'}
    >
      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
      {message}
    </div>
  )
} 