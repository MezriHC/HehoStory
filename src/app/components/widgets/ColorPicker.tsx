interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  description?: string
}

export default function ColorPicker({ value, onChange, label, description }: ColorPickerProps) {
  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {description && (
            <span className="block text-sm font-normal text-gray-500 mt-1">
              {description}
            </span>
          )}
        </label>
      )}

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-20 h-20 cursor-pointer rounded-xl border-2 border-gray-200 p-1 bg-white"
          />
          <div 
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ 
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
            }} 
          />
        </div>
        <div className="flex-grow">
          <input
            type="text"
            value={value.toUpperCase()}
            onChange={(e) => {
              const newValue = e.target.value
              if (newValue.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                onChange(newValue)
              }
            }}
            placeholder="#000000"
            className="w-full h-12 px-4 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors uppercase font-mono"
          />
        </div>
      </div>
    </div>
  )
} 