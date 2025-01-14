'use client'

import { use } from 'react'
import { Widget } from '@/app/widget/page'
import WidgetEditor from './WidgetEditor'

interface PageProps {
  searchParams: {
    widget?: string
  }
}

export default function CreateWidgetClient({ searchParams }: PageProps) {
  const params = use(searchParams)
  const initialWidget = params.widget ? JSON.parse(params.widget) as Widget : undefined

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <WidgetEditor initialWidget={initialWidget} />
      </div>
    </div>
  )
} 