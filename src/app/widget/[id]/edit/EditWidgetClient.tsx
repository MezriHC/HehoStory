'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import WidgetEditor from '../../create/WidgetEditor'
import { useAuth } from '@/hooks/useAuth'
import { Widget } from '@/app/widget/page'

export default function EditWidgetClient({ widgetId }: { widgetId: string }) {
  const [widget, setWidget] = useState<Widget | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { userId, supabase: authClient } = useAuth()

  useEffect(() => {
    const loadWidget = async () => {
      if (!userId) return

      try {
        // Charger le widget
        const { data: widgetData, error: widgetError } = await authClient
          .from('widgets')
          .select('*')
          .eq('id', widgetId)
          .eq('author_id', userId)
          .single()

        if (widgetError) throw widgetError
        
        // Parse le format si c'est une chaîne de caractères
        const parsedWidget = {
          ...widgetData,
          format: typeof widgetData.format === 'string' ? JSON.parse(widgetData.format) : widgetData.format,
          story_ids: widgetData.story_ids || []
        }
        
        setWidget(parsedWidget)
      } catch (error) {
        console.error('Error loading widget:', error)
        router.push('/widget')
      } finally {
        setLoading(false)
      }
    }

    loadWidget()
  }, [widgetId, userId, router, authClient])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!widget) {
    return null
  }

  return <WidgetEditor initialWidget={widget} />
} 