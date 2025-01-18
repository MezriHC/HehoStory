import { Suspense } from 'react'
import CreateWidgetClient from './CreateWidgetClient'

interface PageProps {
  searchParams: Promise<{ widget?: string }>
}

export default async function CreateWidgetPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateWidgetClient initialWidget={resolvedParams.widget} />
    </Suspense>
  )
} 