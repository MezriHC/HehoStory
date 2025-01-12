import { Suspense } from 'react'
import EditWidgetClient from './EditWidgetClient'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditWidgetPage({ params }: PageProps) {
  const resolvedParams = await params
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    }>
      <EditWidgetClient widgetId={resolvedParams.id} />
    </Suspense>
  )
} 