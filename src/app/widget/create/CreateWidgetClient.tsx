'use client'

import { Widget } from '@/app/widget/page'
import WidgetEditor from './WidgetEditor'

interface CreateWidgetClientProps {
  initialWidget?: string
}

export default function CreateWidgetClient({ initialWidget }: CreateWidgetClientProps) {
  const parsedWidget = initialWidget ? JSON.parse(initialWidget) as Widget : undefined

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <WidgetEditor initialWidget={parsedWidget} />
      </div>
    </div>
  )
} 