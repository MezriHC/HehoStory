import { Suspense } from 'react'
import EditWidgetClient from './EditWidgetClient'

export default function EditWidgetPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    }>
      <EditWidgetClient widgetId={params.id} />
    </Suspense>
  )
} 