'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CreateWidgetPage from '../../create/page'

export default function EditWidgetClient({ widgetId }: { widgetId: string }) {
  const [widget, setWidget] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadWidget = async () => {
      try {
        const { data, error } = await supabase
          .from('widgets')
          .select('*')
          .eq('id', widgetId)
          .single()

        if (error) throw error
        setWidget(data)
      } catch (error) {
        console.error('Error loading widget:', error)
        router.push('/widget')
      } finally {
        setLoading(false)
      }
    }

    loadWidget()
  }, [widgetId, router])

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

  return <CreateWidgetPage initialWidget={widget} />
} 