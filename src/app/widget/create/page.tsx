import { Suspense } from 'react'
import { use } from 'react'
import WidgetEditor from './WidgetEditor'

interface PageProps {
  searchParams: { widget?: string }
}

export default function CreateWidgetPage({ searchParams }: PageProps) {
  const initialWidget = searchParams.widget ? JSON.parse(searchParams.widget) : undefined

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WidgetEditor initialWidget={initialWidget} />
    </Suspense>
  )
} 