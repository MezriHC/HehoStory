'use client'

import { HexColorPicker } from "react-colorful"
import { useState } from "react"
import { Paintbrush } from "lucide-react"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full h-10 px-4 text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
      >
        <div
          className="w-4 h-4 rounded-full border border-gray-200"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm text-gray-600 flex-1 text-left truncate">
          {value}
        </span>
        <Paintbrush className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200">
            <HexColorPicker color={value} onChange={onChange} />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-3 w-full px-2 py-1 text-sm border rounded focus:outline-none focus:border-gray-400"
            />
          </div>
        </>
      )}
    </div>
  )
} 